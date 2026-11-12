import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Download,
  Save,
  Trash2,
  Music,
  X,
  Check,
  Radio,
  Sliders,
  AlertCircle,
  Volume2,
  Sparkles,
  ScrollText,
} from 'lucide-react';
import { PoemDraft, VoiceRecordingMeta } from '../../types/editor';
import {
  voiceRecitationService,
  formatDurationMMSS,
  toUrduNumerals,
} from '../../services/voiceRecitationService';
import {
  rhythmicCadenceAudioService,
  CadenceTempo,
  CADENCE_TEMPO_LABELS,
} from '../../services/rhythmicCadenceAudioService';
import { ARKAN_TO_PATTERN } from '../../services/wordIntentionService';
import {
  voiceDspService,
  VocalDspConfig,
  VocalProfilePreset,
  ReverbPreset,
  VOCAL_PROFILE_PRESETS,
  REVERB_PRESET_LABELS,
} from '../../services/voiceDspService';

interface VoiceRecitationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: PoemDraft;
  fontFamily: string;
  onSaveVoiceRecording: (recording?: VoiceRecordingMeta) => void;
}

export const VoiceRecitationStudioModal: React.FC<VoiceRecitationStudioModalProps> = ({
  isOpen,
  onClose,
  draft,
  fontFamily,
  onSaveVoiceRecording,
}) => {
  // Studio Recitation Mode: Tarannum (singing/melodic) vs Taht-ul-Lafz (recitative/rhythmic speech)
  const [recitationMode, setRecitationMode] = useState<'tarannum' | 'taht-ul-lafz'>(
    draft.voiceRecording?.mode || 'tarannum'
  );

  // Recording lifecycle state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [amplitudeLevels, setAmplitudeLevels] = useState<number[]>(() =>
    Array(24).fill(0.08)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active / finished recording object
  const [currentRecording, setCurrentRecording] = useState<VoiceRecordingMeta | null>(
    draft.voiceRecording || null
  );
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Vocal DSP Profile & Acoustic Reverb State
  const [vocalProfile, setVocalProfile] = useState<VocalProfilePreset>('broadcast');
  const [reverbPreset, setReverbPreset] = useState<ReverbPreset>('chamber');
  const [reverbWetLevel, setReverbWetLevel] = useState<number>(0.18);
  const [lowCutEnabled, setLowCutEnabled] = useState<boolean>(true);
  const [showDspDetails, setShowDspDetails] = useState<boolean>(false);

  // Metronome & Acoustic Rhythm Accompaniment State
  const [isMetronomeEnabled, setIsMetronomeEnabled] = useState(false);
  const [metronomeTempo, setMetronomeTempo] = useState<CadenceTempo>('medium');

  // Ambient Tanpura / Shruti Drone State
  const [isTanpuraEnabled, setIsTanpuraEnabled] = useState(false);
  const [tanpuraVolume, setTanpuraVolume] = useState(0.25);

  // Hands-free Auto-Scrolling Prompter State
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const prompterContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollAnimRef = useRef<number | null>(null);

  // Highlighted couplet focus
  const [activeCoupletIndex, setActiveCoupletIndex] = useState<number | null>(null);

  // Playback state for finished/saved recording
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // Prompter font size
  const [prompterFontSize, setPrompterFontSize] = useState<number>(24);

  // Audio element ref for playback
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Derive meter pattern from draft metadata if available
  const derivedMeterPattern = useMemo(() => {
    if (draft.meterRukn) {
      const parts = draft.meterRukn.trim().split(/\s+/);
      const mapped = parts
        .map((p) => ARKAN_TO_PATTERN[p]?.pattern || '')
        .filter(Boolean);
      if (mapped.length > 0) {
        return mapped.join(' ');
      }
    }
    return '=-== =-== =-== =-=';
  }, [draft.meterRukn]);

  // Keep current recording in sync if draft changes externally
  useEffect(() => {
    if (draft.voiceRecording) {
      setCurrentRecording(draft.voiceRecording);
    }
  }, [draft.voiceRecording]);

  // Handle Escape key to close modal safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRecording) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRecording, onClose]);

  // Clean up recording, metronome and drone on unmount or close
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (autoScrollAnimRef.current) {
        cancelAnimationFrame(autoScrollAnimRef.current);
      }
      voiceRecitationService.cancelRecording();
      rhythmicCadenceAudioService.stop();
      voiceDspService.stopTanpuraDrone();
    };
  }, []);

  // Continuous Hands-Free Auto-Scrolling when recording
  useEffect(() => {
    if (isRecording && isAutoScrollEnabled && !isPaused) {
      const el = prompterContainerRef.current;
      if (!el) return;

      const pixelsPerFrame =
        autoScrollSpeed === 'slow' ? 0.35 : autoScrollSpeed === 'normal' ? 0.65 : 1.15;

      const step = () => {
        if (el) {
          el.scrollTop += pixelsPerFrame;
        }
        autoScrollAnimRef.current = requestAnimationFrame(step);
      };

      autoScrollAnimRef.current = requestAnimationFrame(step);
      return () => {
        if (autoScrollAnimRef.current) {
          cancelAnimationFrame(autoScrollAnimRef.current);
          autoScrollAnimRef.current = null;
        }
      };
    } else {
      if (autoScrollAnimRef.current) {
        cancelAnimationFrame(autoScrollAnimRef.current);
        autoScrollAnimRef.current = null;
      }
    }
  }, [isRecording, isAutoScrollEnabled, isPaused, autoScrollSpeed]);

  if (!isOpen) return null;

  // Split lines into couplets for the live teleprompter
  const couplets = draft.content
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => chunk.split('\n').map((l) => l.trim()));

  // Switch vocal profile preset
  const handleSelectVocalProfile = (preset: VocalProfilePreset) => {
    setVocalProfile(preset);
    const target = VOCAL_PROFILE_PRESETS[preset];
    setLowCutEnabled(target.config.lowCutEnabled);
    setReverbPreset(target.config.reverbPreset);
    setReverbWetLevel(target.config.reverbWetLevel);

    voiceDspService.updateParameters({
      lowCutEnabled: target.config.lowCutEnabled,
      warmthDb: target.config.warmthDb,
      presenceDb: target.config.presenceDb,
      airDb: target.config.airDb,
      compressorEnabled: target.config.compressorEnabled,
      reverbPreset: target.config.reverbPreset,
      reverbWetLevel: target.config.reverbWetLevel,
    });
  };

  // Switch reverb preset
  const handleSelectReverbPreset = (preset: ReverbPreset) => {
    setReverbPreset(preset);
    const wet = preset === 'dry' ? 0 : preset === 'chamber' ? 0.18 : preset === 'mushaira' ? 0.28 : 0.4;
    setReverbWetLevel(wet);
    voiceDspService.updateParameters({ reverbPreset: preset, reverbWetLevel: wet });
  };

  // Adjust Tanpura volume
  const handleTanpuraVolumeChange = (newVol: number) => {
    setTanpuraVolume(newVol);
    voiceDspService.setTanpuraVolume(newVol);
  };

  // 1. Start Recording Action with DSP & Ambient Drone
  const handleStartRecording = async () => {
    setErrorMessage(null);
    setSaveSuccessNotification(false);

    // Stop playback if playing
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    }

    try {
      const currentPresetConfig = VOCAL_PROFILE_PRESETS[vocalProfile].config;
      const dspConfig: VocalDspConfig = {
        profilePreset: vocalProfile,
        lowCutEnabled,
        warmthDb: currentPresetConfig.warmthDb,
        presenceDb: currentPresetConfig.presenceDb,
        airDb: currentPresetConfig.airDb,
        compressorEnabled: currentPresetConfig.compressorEnabled,
        reverbPreset,
        reverbWetLevel,
      };

      await voiceRecitationService.startRecording((levels) => {
        setAmplitudeLevels(levels.slice(0, 24));
      }, dspConfig);

      setIsRecording(true);
      setIsPaused(false);
      setRecordingSeconds(0);

      // Start elapsed timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Start Acoustic Bahar metronome if enabled
      if (isMetronomeEnabled && derivedMeterPattern) {
        rhythmicCadenceAudioService.play(derivedMeterPattern, {
          tempo: metronomeTempo,
          loop: true,
        });
      }

      // Start Ambient Tanpura drone if enabled
      if (isTanpuraEnabled) {
        const audioCtx = voiceRecitationService.getAudioContext();
        if (audioCtx) {
          voiceDspService.startTanpuraDrone(audioCtx, tanpuraVolume);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
      setIsRecording(false);
    }
  };

  // 2. Pause / Resume Recording
  const handleTogglePause = () => {
    if (!isRecording) return;
    if (isPaused) {
      voiceRecitationService.resumeRecording();
      setIsPaused(false);
      if (isMetronomeEnabled && derivedMeterPattern) {
        rhythmicCadenceAudioService.resume();
      }
    } else {
      voiceRecitationService.pauseRecording();
      setIsPaused(true);
      if (isMetronomeEnabled) {
        rhythmicCadenceAudioService.pause();
      }
    }
  };

  // 3. Stop & Finalize Recording
  const handleStopRecording = async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Stop metronome & Tanpura drone
    rhythmicCadenceAudioService.stop();
    voiceDspService.stopTanpuraDrone();

    try {
      const recordingMeta = await voiceRecitationService.stopRecording({
        title: draft.title || 'کلام',
        poet: draft.poet || '',
        mode: recitationMode,
        withMetronome: isMetronomeEnabled,
      });

      setCurrentRecording(recordingMeta);
      setIsRecording(false);
      setIsPaused(false);
      setAmplitudeLevels(Array(24).fill(0.08));

      // Auto-save to draft
      onSaveVoiceRecording(recordingMeta);
      setSaveSuccessNotification(true);
      setTimeout(() => setSaveSuccessNotification(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
      setIsRecording(false);
    }
  };

  // 4. Cancel Ongoing Recording
  const handleCancelRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    voiceRecitationService.cancelRecording();
    rhythmicCadenceAudioService.stop();
    voiceDspService.stopTanpuraDrone();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setAmplitudeLevels(Array(24).fill(0.08));
  };

  // 5. Playback Handlers for Finished/Saved Take
  const handleTogglePlayAudio = () => {
    if (!audioPlayerRef.current || !currentRecording) return;

    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      void audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioPlayerRef.current) return;
    const current = audioPlayerRef.current.currentTime;
    const duration = audioPlayerRef.current.duration || currentRecording?.durationSeconds || 1;
    setAudioCurrentTime(current);
    setAudioProgress((current / duration) * 100);
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioPlayerRef.current) return;
    const targetPercent = parseFloat(e.target.value);
    const duration = audioPlayerRef.current.duration || currentRecording?.durationSeconds || 1;
    const newTime = (targetPercent / 100) * duration;
    audioPlayerRef.current.currentTime = newTime;
    setAudioCurrentTime(newTime);
    setAudioProgress(targetPercent);
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
  };

  // 6. Save Recording to Draft
  const handleManualSave = () => {
    if (!currentRecording) return;
    onSaveVoiceRecording(currentRecording);
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 3000);
  };

  // 7. Delete Recording from Draft
  const handleDeleteRecording = () => {
    if (window.confirm('کیا آپ اس کلام کی ریکارڈ شدہ صوتی فائل حذف کرنا چاہتے ہیں؟')) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setCurrentRecording(null);
      setIsPlayingAudio(false);
      onSaveVoiceRecording(undefined);
    }
  };

  // 8. Download Audio File
  const handleDownload = () => {
    if (!currentRecording) return;
    voiceRecitationService.downloadRecording(currentRecording, draft.title);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recitation-studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        dir="rtl"
        className="relative flex flex-col w-full max-w-5xl h-[94vh] max-h-[890px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden font-nastaliq text-[var(--text-primary)]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="recitation-studio-title"
                  className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-normal"
                >
                  صوتی ترنم و مشاعرہ اسٹوڈیو
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 text-[10px] font-bold">
                  PRO STUDIO DSP
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-nastaliq">
                کلام تحت اللفظ یا ترنم سے ریکارڈ کریں، مشاعرہ ریورب اور تنبورے کی تال ملائیں
              </p>
            </div>
          </div>

          {/* Mode Selector & Close Button */}
          <div className="flex items-center gap-3">
            {/* Mode Pills */}
            <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs">
              <button
                type="button"
                onClick={() => setRecitationMode('tarannum')}
                disabled={isRecording}
                className={`px-3 py-1 rounded-md transition-all font-nastaliq ${
                  recitationMode === 'tarannum'
                    ? 'bg-[var(--accent-gold)] text-white font-bold shadow-2xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                ترنم (Tarannum)
              </button>
              <button
                type="button"
                onClick={() => setRecitationMode('taht-ul-lafz')}
                disabled={isRecording}
                className={`px-3 py-1 rounded-md transition-all font-nastaliq ${
                  recitationMode === 'taht-ul-lafz'
                    ? 'bg-[var(--accent-gold)] text-white font-bold shadow-2xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                تحت اللفظ (Taht-ul-Lafz)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isRecording}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="بند کریں (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Advisory Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-700 dark:text-red-300 text-xs flex-shrink-0"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 hover:bg-red-500/20 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Success Notification */}
        {saveSuccessNotification && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex-shrink-0 font-nastaliq animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>صوتی ریکارڈنگ کلام کے ساتھ کامیابی سے منسلک و محفوظ کر دی گئی ہے۔</span>
          </div>
        )}

        {/* Studio Body: Split View (Prompter on Right / Controls & DSP on Left) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Main Prompter (Verses Teleprompter) - 7 cols on desktop */}
          <div className="md:col-span-7 flex flex-col border-b md:border-b-0 md:border-l border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden">
            {/* Prompter Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs flex-shrink-0">
              <span className="font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>کلام کا ٹیلی پرامپٹر (Recitation Prompter)</span>
              </span>

              {/* Hands-Free Auto Scroll & Font Size Adjusters */}
              <div className="flex items-center gap-2 text-xs">
                {/* Auto Scroll Toggle */}
                <div className="flex items-center gap-1 pl-2 border-l border-[var(--border-subtle)]/60">
                  <button
                    type="button"
                    onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs border font-nastaliq transition-all ${
                      isAutoScrollEnabled
                        ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                        : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                    }`}
                    title="ریکارڈنگ کے دوران اشعار خودکار طور پر اوپر اسکرول ہوں"
                  >
                    <ScrollText className="w-3.5 h-3.5" />
                    <span>خودکار اسکرول</span>
                  </button>

                  {isAutoScrollEnabled && (
                    <div className="flex items-center gap-0.5">
                      {(['slow', 'normal', 'fast'] as const).map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setAutoScrollSpeed(spd)}
                          className={`px-1.5 py-0.5 rounded text-[10px] border font-nastaliq ${
                            autoScrollSpeed === spd
                              ? 'bg-[var(--accent-gold)] text-white font-bold'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                          }`}
                        >
                          {spd === 'slow' ? 'سست' : spd === 'normal' ? 'عام' : 'تیز'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPrompterFontSize((s) => Math.max(18, s - 2))}
                    className="px-2 py-0.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] font-sans"
                    title="فونٹ سائز چھوٹا کریں"
                  >
                    A-
                  </button>
                  <span className="px-1 text-[var(--text-muted)] font-mono text-[11px]">
                    {prompterFontSize}px
                  </span>
                  <button
                    type="button"
                    onClick={() => setPrompterFontSize((s) => Math.min(36, s + 2))}
                    className="px-2 py-0.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] font-sans"
                    title="فونٹ سائز بڑا کریں"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Couplets Display */}
            <div
              ref={prompterContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 select-text custom-scrollbar"
            >
              {/* Poem Title & Poet Header */}
              <div className="text-center pb-4 border-b border-[var(--border-subtle)]/40">
                <h3
                  className="font-bold text-[var(--text-primary)]"
                  style={{
                    fontFamily,
                    fontSize: `${prompterFontSize + 6}px`,
                    lineHeight: 2.2,
                  }}
                >
                  {draft.title || 'عنوانِ کلام'}
                </h3>
                {draft.poet && (
                  <p
                    className="text-[var(--text-secondary)] font-nastaliq"
                    style={{ fontSize: `${prompterFontSize - 4}px` }}
                  >
                    شاعر: {draft.poet}
                  </p>
                )}
                {draft.meterName && (
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 text-xs">
                    <Music className="w-3 h-3" />
                    <span>{draft.meterName}</span>
                    {draft.meterRukn && (
                      <span className="opacity-80">({draft.meterRukn})</span>
                    )}
                  </div>
                )}
              </div>

              {/* Couplets List */}
              {couplets.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-muted)] font-nastaliq">
                  کوئی شعر یا مصرع دستیاب نہیں ہے۔ کینوس پر اشعار تحریر فرمائیں۔
                </div>
              ) : (
                couplets.map((coupletLines, cIndex) => {
                  const isCurrentActive = activeCoupletIndex === cIndex;
                  return (
                    <div
                      key={cIndex}
                      onClick={() => setActiveCoupletIndex(cIndex)}
                      className={`p-4 rounded-xl border transition-all text-center cursor-pointer ${
                        isCurrentActive
                          ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 shadow-md ring-1 ring-[var(--accent-gold)]/40'
                          : 'border-[var(--border-subtle)]/60 bg-[var(--bg-card)]/50 hover:bg-[var(--bg-card)] hover:border-[var(--accent-gold)]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] mb-2 select-none">
                        <span>شعر {toUrduNumerals((cIndex + 1).toString())}</span>
                        {isCurrentActive && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--accent-gold)] text-white text-[10px] font-nastaliq">
                            زیرِ مطالعہ
                          </span>
                        )}
                      </div>
                      <div
                        className="space-y-3 font-nastaliq text-[var(--text-primary)]"
                        style={{
                          fontFamily,
                          fontSize: `${prompterFontSize}px`,
                          lineHeight: 2.2,
                        }}
                      >
                        {coupletLines.map((line, lIndex) => (
                          <div key={lIndex} className="leading-relaxed">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right/Side Control Panel: Visualizer, DSP Filters, Tanpura, Controls - 5 cols */}
          <div className="md:col-span-5 flex flex-col bg-[var(--bg-surface)] overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
            {/* 1. Live Waveform Visualizer & Elapsed Timer Card */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Radio
                    className={`w-4 h-4 ${
                      isRecording ? 'text-red-500 animate-pulse' : 'text-[var(--text-muted)]'
                    }`}
                  />
                  <span>
                    {isRecording
                      ? isPaused
                        ? 'ریکارڈنگ موقوف ہے (Paused)'
                        : 'ریکارڈنگ جاری ہے (Live)'
                      : 'آڈیو ویژولائزر (Waveform)'}
                  </span>
                </span>

                {/* Duration Badge */}
                <div
                  className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 ${
                    isRecording
                      ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isRecording && !isPaused ? 'bg-red-500 animate-ping' : 'bg-gray-400'
                    }`}
                  />
                  <span>
                    {formatDurationMMSS(
                      isRecording
                        ? recordingSeconds
                        : currentRecording?.durationSeconds || 0
                    )}
                  </span>
                  <span className="text-[10px] opacity-70">
                    ({toUrduNumerals(
                      formatDurationMMSS(
                        isRecording
                          ? recordingSeconds
                          : currentRecording?.durationSeconds || 0
                      )
                    )})
                  </span>
                </div>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="flex items-center justify-center gap-1 h-20 px-2 py-3 bg-[var(--bg-canvas)] rounded-lg border border-[var(--border-subtle)]/60 overflow-hidden">
                {amplitudeLevels.map((lvl, idx) => {
                  const barHeight = Math.max(8, Math.min(100, Math.round(lvl * 100)));
                  return (
                    <div
                      key={idx}
                      className="w-1.5 rounded-full transition-all duration-75"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: isRecording
                          ? isPaused
                            ? 'var(--text-muted)'
                            : idx % 2 === 0
                            ? 'var(--accent-gold)'
                            : '#ef4444'
                          : 'var(--border-subtle)',
                        opacity: isRecording ? 0.9 : 0.4,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 2. Recording Action Controls */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-3">
              <div className="text-xs font-bold text-[var(--text-secondary)] mb-1">
                ریکارڈنگ کنٹرولز
              </div>

              {/* Main Record / Stop Action Button */}
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer font-nastaliq text-base"
                >
                  <Mic className="w-5 h-5 animate-bounce" />
                  <span>
                    {currentRecording
                      ? 'نیا ٹیک ریکارڈ کریں (Re-record)'
                      : 'ریکارڈنگ شروع کریں (Start Recording)'}
                  </span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer font-nastaliq text-base"
                  >
                    <Square className="w-5 h-5 fill-current" />
                    <span>ریکارڈنگ مکمل کریں (Finish & Save)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePause}
                      className="py-2 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] flex items-center justify-center gap-1.5 text-xs font-nastaliq"
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current text-emerald-500" />
                          <span>جاری رکھیں</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span>وقفہ لیں</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelRecording}
                      className="py-2 px-3 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5 text-xs font-nastaliq"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>منسوخ کریں</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Studio Vocal DSP & Acoustic Reverb Engine (نیا: صوتی نکھار و ماحول) */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-[var(--accent-gold)]">
                  <Sparkles className="w-4 h-4" />
                  <span>صوتی نکھار و فلٹرز (Studio Vocal DSP)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDspDetails(!showDspDetails)}
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 font-nastaliq"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showDspDetails ? 'مختصر کریں' : 'ترتیبات'}</span>
                </button>
              </div>

              {/* Vocal Profile Preset Selector */}
              <div className="grid grid-cols-2 gap-1.5 text-xs font-nastaliq">
                {(Object.keys(VOCAL_PROFILE_PRESETS) as VocalProfilePreset[]).map((pKey) => {
                  const pData = VOCAL_PROFILE_PRESETS[pKey];
                  const isSelected = vocalProfile === pKey;
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => handleSelectVocalProfile(pKey)}
                      className={`p-2 rounded-lg border text-right transition-all ${
                        isSelected
                          ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold shadow-2xs'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{pData.label.split(' ')[0]}</div>
                      <div className="text-[9px] opacity-70 truncate">{pData.description.slice(0, 24)}...</div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Reverb & Noise Gate Controls */}
              {showDspDetails && (
                <div className="pt-2 border-t border-[var(--border-subtle)]/50 space-y-2.5 text-xs font-nastaliq animate-in fade-in">
                  {/* Reverb Presets */}
                  <div>
                    <div className="text-[11px] text-[var(--text-muted)] mb-1">صوتی گونج و ماحول (Acoustic Reverb):</div>
                    <div className="flex flex-wrap gap-1">
                      {(Object.keys(REVERB_PRESET_LABELS) as ReverbPreset[]).map((rKey) => (
                        <button
                          key={rKey}
                          type="button"
                          onClick={() => handleSelectReverbPreset(rKey)}
                          className={`px-2 py-1 rounded text-[11px] border ${
                            reverbPreset === rKey
                              ? 'bg-[var(--accent-gold)] text-white font-bold border-[var(--accent-gold)]'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                          }`}
                        >
                          {REVERB_PRESET_LABELS[rKey].label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 80Hz Rumble Filter */}
                  <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-[var(--border-subtle)]/30 text-xs select-none">
                    <span className="text-[var(--text-secondary)]">شور فلٹر (80Hz Low-Cut Rumble Filter):</span>
                    <input
                      type="checkbox"
                      checked={lowCutEnabled}
                      onChange={(e) => {
                        setLowCutEnabled(e.target.checked);
                        voiceDspService.updateParameters({ lowCutEnabled: e.target.checked });
                      }}
                      className="w-3.5 h-3.5 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)]"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* 4. Ambient Tanpura Drone Accompaniment (شاہی تنبورہ) */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-[var(--accent-gold)]">
                  <Music className="w-4 h-4" />
                  <span>شاہی تنبورہ (Ambient Tanpura / Drone)</span>
                </span>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={isTanpuraEnabled}
                    onChange={(e) => setIsTanpuraEnabled(e.target.checked)}
                    disabled={isRecording}
                    className="w-3.5 h-3.5 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)] cursor-pointer"
                  />
                  <span>تنبورہ فعال</span>
                </label>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] font-nastaliq leading-relaxed">
                ترنم کے دوران کلاسیکی سُر (Sa - Pa) کی دھیمی گونج، جو شاعر کی آواز کو محفل کا روپ بخشتی ہے۔
              </p>

              {isTanpuraEnabled && (
                <div className="pt-2 border-t border-[var(--border-subtle)]/40 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[var(--text-muted)] text-[11px] font-nastaliq">تنبورہ والیم:</span>
                  <input
                    type="range"
                    min="0.05"
                    max="0.6"
                    step="0.05"
                    value={tanpuraVolume}
                    onChange={(e) => handleTanpuraVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-[var(--border-subtle)] accent-[var(--accent-gold)]"
                  />
                  <span className="font-mono text-[10px] text-[var(--text-muted)] w-8 text-left">
                    {Math.round(tanpuraVolume * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* 5. Acoustic Bahar Cadence Metronome (بحر کی تال) */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-[var(--accent-gold)]">
                  <Music className="w-4 h-4" />
                  <span>بحر کی صوتی تال (Acoustic Rhythm Metronome)</span>
                </span>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={isMetronomeEnabled}
                    onChange={(e) => setIsMetronomeEnabled(e.target.checked)}
                    disabled={isRecording}
                    className="w-3.5 h-3.5 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)] cursor-pointer"
                  />
                  <span>تال فعال</span>
                </label>
              </div>

              {/* Tempo selector */}
              {isMetronomeEnabled && (
                <div className="pt-2 border-t border-[var(--border-subtle)]/40 flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] flex items-center gap-1 font-nastaliq text-[11px]">
                    <Sliders className="w-3 h-3" />
                    <span>رفتار (Tempo):</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {(['slow', 'medium', 'fast'] as CadenceTempo[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setMetronomeTempo(t)}
                        disabled={isRecording}
                        className={`px-2 py-0.5 rounded text-[11px] border font-nastaliq ${
                          metronomeTempo === t
                            ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                            : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        {CADENCE_TEMPO_LABELS[t].split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Attached / Saved Recording Player Hub */}
            {currentRecording && !isRecording && (
              <div className="p-4 rounded-xl border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>کلام کی صوتی ریکارڈنگ موجود ہے</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[10px] font-nastaliq text-[var(--text-muted)]">
                    {currentRecording.mode === 'taht-ul-lafz' ? 'تحت اللفظ' : 'ترنم'}
                  </span>
                </div>

                {/* Hidden Native Audio Element */}
                <audio
                  ref={audioPlayerRef}
                  src={currentRecording.blobDataUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onEnded={handleAudioEnded}
                  preload="metadata"
                />

                {/* Custom Audio Player Scrubber Bar */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioProgress}
                    onChange={handleAudioSeek}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[var(--border-subtle)] accent-[var(--accent-gold)]"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span>{formatDurationMMSS(audioCurrentTime)}</span>
                    <span>{formatDurationMMSS(currentRecording.durationSeconds)}</span>
                  </div>
                </div>

                {/* Player Play/Pause and Action Row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]/40">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePlayAudio}
                      className="p-2 rounded-full bg-[var(--accent-gold)] text-white hover:opacity-90 shadow-2xs cursor-pointer"
                      title={isPlayingAudio ? 'موقوف کریں' : 'سنیں'}
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current mr-0.5" />
                      )}
                    </button>
                    <span className="text-xs font-nastaliq text-[var(--text-secondary)]">
                      {isPlayingAudio ? 'سن رہے ہیں...' : 'سنیں'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="آڈیو فائل برآمد کریں (Download)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleManualSave}
                      className="p-1.5 rounded-lg border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                      title="کلام کے ساتھ محفوظ کریں"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteRecording}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                      title="ریکارڈنگ حذف کریں"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Status Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] flex-shrink-0 font-nastaliq">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>
              براڈکاسٹ ڈی ایس پی فلٹرز، رَمبل کٹ اور مشاعرہ ریورب کے ساتھ تمام صوتی فائلیں ۱۰۰٪ آف لائن اور پرائیویٹ ہیں۔
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isRecording}
            className="px-4 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          >
            بند کریں
          </button>
        </div>
      </div>
    </div>
  );
};
export default VoiceRecitationStudioModal;
