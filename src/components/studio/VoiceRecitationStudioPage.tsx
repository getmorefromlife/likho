import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowRight,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Download,
  Save,
  Trash2,
  Music,
  Headphones,
  Sliders,
  Volume2,
  Sparkles,
  ScrollText,
  AlertCircle,
  Check,
  Radio,
  SlidersHorizontal,
  X,
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
  EchoPreset,
  VOCAL_PROFILE_PRESETS,
  REVERB_PRESET_LABELS,
  ECHO_PRESETS,
} from '../../services/voiceDspService';

interface VoiceRecitationStudioPageProps {
  draft: PoemDraft;
  fontFamily: string;
  onSaveVoiceRecording: (recording?: VoiceRecordingMeta) => void;
  onExit: () => void;
}

export const VoiceRecitationStudioPage: React.FC<VoiceRecitationStudioPageProps> = ({
  draft,
  fontFamily,
  onSaveVoiceRecording,
  onExit,
}) => {
  // Recitation Mode: Tarannum vs Taht-ul-Lafz
  const [recitationMode, setRecitationMode] = useState<'tarannum' | 'taht-ul-lafz'>(
    draft.voiceRecording?.mode || 'tarannum'
  );

  // Recording lifecycle state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [amplitudeLevels, setAmplitudeLevels] = useState<number[]>(() =>
    Array(28).fill(0.08)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active / finished recording object
  const [currentRecording, setCurrentRecording] = useState<VoiceRecordingMeta | null>(
    draft.voiceRecording || null
  );
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Vocal DSP Profile & Settings
  const [vocalProfile, setVocalProfile] = useState<VocalProfilePreset>('tarannum_sheen');
  const [echoPreset, setEchoPreset] = useState<EchoPreset>('mushaira');
  const [echoWetLevel, setEchoWetLevel] = useState<number>(0.38);
  const [reverbPreset, setReverbPreset] = useState<ReverbPreset>('mushaira');
  const [reverbWetLevel, setReverbWetLevel] = useState<number>(0.28);
  const [lowCutEnabled, setLowCutEnabled] = useState<boolean>(true);
  const [noiseGateEnabled, setNoiseGateEnabled] = useState<boolean>(true);
  const [showAdvancedRack, setShowAdvancedRack] = useState<boolean>(false);

  // Live Earphone Direct Monitoring (Logic Pro style)
  const [isLiveMonitoring, setIsLiveMonitoring] = useState<boolean>(false);

  // Metronome State
  const [isMetronomeEnabled, setIsMetronomeEnabled] = useState<boolean>(false);
  const [metronomeTempo, setMetronomeTempo] = useState<CadenceTempo>('medium');

  // Ambient Tanpura / Shruti Drone State
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState<boolean>(false);
  const [tanpuraVolume, setTanpuraVolume] = useState<number>(0.28);

  // Auto-Scrolling Prompter State
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState<boolean>(true);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const prompterContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollAnimRef = useRef<number | null>(null);

  // Active Couplet Highlight
  const [activeCoupletIndex, setActiveCoupletIndex] = useState<number | null>(null);

  // Playback state for finished/saved recording
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // Prompter font size
  const [prompterFontSize, setPrompterFontSize] = useState<number>(26);

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

  // Handle Escape key to exit dedicated studio page safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRecording) {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, onExit]);

  // Clean up recording, monitoring, metronome, and drone on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (autoScrollAnimRef.current) cancelAnimationFrame(autoScrollAnimRef.current);
      voiceRecitationService.cancelRecording();
      rhythmicCadenceAudioService.stop();
      voiceDspService.setLiveMonitoring(false);
      voiceDspService.stopTanpuraDrone();
    };
  }, []);

  // Continuous Hands-Free Auto-Scrolling during recording
  useEffect(() => {
    if (isRecording && isAutoScrollEnabled && !isPaused) {
      const el = prompterContainerRef.current;
      if (!el) return;

      const pixelsPerFrame =
        autoScrollSpeed === 'slow' ? 0.35 : autoScrollSpeed === 'normal' ? 0.7 : 1.25;

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
    setNoiseGateEnabled(target.config.noiseGateEnabled);
    setEchoPreset(target.config.echoPreset);
    setEchoWetLevel(target.config.echoWetLevel);
    setReverbPreset(target.config.reverbPreset);
    setReverbWetLevel(target.config.reverbWetLevel);

    voiceDspService.updateParameters({
      lowCutEnabled: target.config.lowCutEnabled,
      noiseGateEnabled: target.config.noiseGateEnabled,
      warmthDb: target.config.warmthDb,
      presenceDb: target.config.presenceDb,
      airDb: target.config.airDb,
      compressorEnabled: target.config.compressorEnabled,
      echoPreset: target.config.echoPreset,
      echoWetLevel: target.config.echoWetLevel,
      reverbPreset: target.config.reverbPreset,
      reverbWetLevel: target.config.reverbWetLevel,
    });
  };

  // Switch Echo / Delay preset
  const handleSelectEchoPreset = (preset: EchoPreset) => {
    setEchoPreset(preset);
    const wet = ECHO_PRESETS[preset].wetLevel;
    setEchoWetLevel(wet);
    voiceDspService.updateParameters({ echoPreset: preset, echoWetLevel: wet });
  };

  // Switch Reverb preset
  const handleSelectReverbPreset = (preset: ReverbPreset) => {
    setReverbPreset(preset);
    const wet = preset === 'dry' ? 0 : preset === 'chamber' ? 0.18 : preset === 'mushaira' ? 0.32 : 0.45;
    setReverbWetLevel(wet);
    voiceDspService.updateParameters({ reverbPreset: preset, reverbWetLevel: wet });
  };

  // Toggle Tanpura Drone anytime
  const handleToggleTanpura = async () => {
    try {
      if (isTanpuraPlaying) {
        voiceDspService.stopTanpuraDrone();
        setIsTanpuraPlaying(false);
      } else {
        await voiceDspService.startTanpuraDrone(tanpuraVolume);
        setIsTanpuraPlaying(true);
      }
    } catch (err) {
      console.error('Failed to start Tanpura drone:', err);
    }
  };

  const handleTanpuraVolumeChange = (newVol: number) => {
    setTanpuraVolume(newVol);
    voiceDspService.setTanpuraVolume(newVol);
  };

  // Toggle Live Earphone Direct Monitoring
  const handleToggleLiveMonitoring = async () => {
    const nextState = !isLiveMonitoring;
    setIsLiveMonitoring(nextState);

    const audioCtx = await voiceRecitationService.ensureAudioContext();
    if (audioCtx) {
      voiceDspService.setLiveMonitoring(nextState);
    }
  };

  // 1. Start Recording Action with DSP & Metronome
  const handleStartRecording = async () => {
    setErrorMessage(null);
    setSaveSuccessNotification(false);

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    }

    try {
      const currentPresetConfig = VOCAL_PROFILE_PRESETS[vocalProfile].config;
      const dspConfig: VocalDspConfig = {
        profilePreset: vocalProfile,
        lowCutEnabled,
        noiseGateEnabled,
        warmthDb: currentPresetConfig.warmthDb,
        presenceDb: currentPresetConfig.presenceDb,
        airDb: currentPresetConfig.airDb,
        compressorEnabled: currentPresetConfig.compressorEnabled,
        echoPreset,
        echoWetLevel,
        reverbPreset,
        reverbWetLevel,
      };

      await voiceRecitationService.startRecording((levels) => {
        setAmplitudeLevels(levels.slice(0, 28));
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

    // Stop metronome
    rhythmicCadenceAudioService.stop();

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
      setAmplitudeLevels(Array(28).fill(0.08));

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
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setAmplitudeLevels(Array(28).fill(0.08));
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
      dir="rtl"
      lang="ur"
      className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] select-none font-nastaliq"
    >
      {/* 1. Top Dedicated Studio Header Bar */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex-shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Back to Canvas Button */}
          <button
            type="button"
            onClick={onExit}
            disabled={isRecording}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all font-nastaliq cursor-pointer shadow-2xs"
            title="کینوس پر واپس جائیں (Esc)"
          >
            <ArrowRight className="w-4 h-4 text-[var(--accent-gold)]" />
            <span className="font-bold">کینوس پر واپسی</span>
          </button>

          <div className="h-5 w-px bg-[var(--border-subtle)] hidden sm:block" />

          {/* Studio Brand and Status */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
              <Mic className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-none">
                  صوتی ترنم و مشاعرہ اسٹوڈیو
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 text-[10px] font-bold">
                  DEDICATED STUDIO
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-nastaliq">
                کلام: <span className="font-bold text-[var(--text-secondary)]">{draft.title || 'بے عنوان'}</span>
                {draft.poet ? ` — شاعر: ${draft.poet}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Live Earphone Monitoring Toggle & Mode Pills */}
        <div className="flex items-center gap-3">
          {/* Live Earphone Direct Monitoring (Logic Pro style) */}
          <button
            type="button"
            onClick={handleToggleLiveMonitoring}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-nastaliq border transition-all cursor-pointer ${
              isLiveMonitoring
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="ہیڈ فون لگا کر اپنی آواز اسٹوڈیو ایکو اور فلٹرز کے ساتھ لائیو سنیں (Live Direct Monitoring)"
          >
            <Headphones className={`w-3.5 h-3.5 ${isLiveMonitoring ? 'animate-bounce text-emerald-500' : ''}`} />
            <span>{isLiveMonitoring ? 'لائیو مانیٹرنگ فعال' : 'لائیو سنیں (مانیٹر)'}</span>
          </button>

          {/* Mode Pills: Tarannum vs Taht-ul-Lafz */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs">
            <button
              type="button"
              onClick={() => setRecitationMode('tarannum')}
              disabled={isRecording}
              className={`px-3 py-1 rounded-lg transition-all font-nastaliq ${
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
              className={`px-3 py-1 rounded-lg transition-all font-nastaliq ${
                recitationMode === 'taht-ul-lafz'
                  ? 'bg-[var(--accent-gold)] text-white font-bold shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              تحت اللفظ (Taht-ul-Lafz)
            </button>
          </div>
        </div>
      </header>

      {/* Advisory Banners */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-2 px-6 py-2 bg-red-500/10 border-b border-red-500/20 text-red-700 dark:text-red-300 text-xs flex-shrink-0 font-nastaliq"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="p-1 hover:bg-red-500/20 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {saveSuccessNotification && (
        <div className="flex items-center gap-2 px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex-shrink-0 font-nastaliq animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>صوتی ریکارڈنگ کلام کے ساتھ کامیابی سے منسلک و محفوظ کر دی گئی ہے۔</span>
        </div>
      )}

      {/* 2. Main Studio Workspace: 2 Large Panels (Prompter 60% / Studio Console 40%) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT / CENTER PANEL: Full-Featured Live Teleprompter (7 cols) */}
        <section className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-l border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden">
          {/* Prompter Toolbar */}
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs flex-shrink-0">
            <span className="font-bold text-[var(--text-secondary)] flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>کلام کا ٹیلی پرامپٹر (Full Screen Prompter)</span>
            </span>

            {/* Auto-Scroll & Typography Controls */}
            <div className="flex items-center gap-3">
              {/* Auto Scroll Toggle */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-[var(--border-subtle)]/70">
                <button
                  type="button"
                  onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border font-nastaliq transition-all cursor-pointer ${
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
                        className={`px-2 py-0.5 rounded text-[10px] border font-nastaliq cursor-pointer ${
                          autoScrollSpeed === spd
                            ? 'bg-[var(--accent-gold)] text-white font-bold border-[var(--accent-gold)]'
                            : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        {spd === 'slow' ? 'سست' : spd === 'normal' ? 'متوازن' : 'تیز'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Size Adjusters */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPrompterFontSize((s) => Math.max(18, s - 2))}
                  className="px-2 py-0.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] font-sans cursor-pointer"
                  title="فونٹ سائز چھوٹا کریں"
                >
                  A-
                </button>
                <span className="px-1 text-[var(--text-muted)] font-mono text-[11px]">
                  {prompterFontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => setPrompterFontSize((s) => Math.min(42, s + 2))}
                  className="px-2 py-0.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] font-sans cursor-pointer"
                  title="فونٹ سائز بڑا کریں"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Couplets Body */}
          <div
            ref={prompterContainerRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 select-text custom-scrollbar"
          >
            {/* Poem Title & Poet Header */}
            <div className="text-center pb-6 border-b border-[var(--border-subtle)]/40">
              <h2
                className="font-bold text-[var(--text-primary)]"
                style={{
                  fontFamily,
                  fontSize: `${prompterFontSize + 8}px`,
                  lineHeight: 2.2,
                }}
              >
                {draft.title || 'عنوانِ کلام'}
              </h2>
              {draft.poet && (
                <p
                  className="text-[var(--text-secondary)] font-nastaliq mt-1"
                  style={{ fontSize: `${prompterFontSize - 4}px` }}
                >
                  شاعر: {draft.poet}
                </p>
              )}
              {draft.meterName && (
                <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-1 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 text-xs font-nastaliq">
                  <Music className="w-3.5 h-3.5" />
                  <span>{draft.meterName}</span>
                  {draft.meterRukn && (
                    <span className="font-mono text-[11px] opacity-80">({draft.meterRukn})</span>
                  )}
                </div>
              )}
            </div>

            {/* Couplets List */}
            {couplets.length === 0 ? (
              <div className="text-center py-16 text-[var(--text-muted)] font-nastaliq text-base">
                کوئی شعر یا مصرع دستیاب نہیں ہے۔ کینوس پر اشعار تحریر فرما کر اسٹوڈیو میں تشریف لائیں۔
              </div>
            ) : (
              couplets.map((coupletLines, cIndex) => {
                const isCurrentActive = activeCoupletIndex === cIndex;
                return (
                  <div
                    key={cIndex}
                    onClick={() => setActiveCoupletIndex(cIndex)}
                    className={`p-6 rounded-2xl border transition-all text-center cursor-pointer ${
                      isCurrentActive
                        ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 shadow-lg ring-1 ring-[var(--accent-gold)]/40 scale-[1.01]'
                        : 'border-[var(--border-subtle)]/60 bg-[var(--bg-card)]/60 hover:bg-[var(--bg-card)] hover:border-[var(--accent-gold)]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-3 select-none">
                      <span className="font-nastaliq text-[11px]">
                        شعر {toUrduNumerals((cIndex + 1).toString())}
                      </span>
                      {isCurrentActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)] text-white text-[10px] font-nastaliq font-bold">
                          زیرِ مطالعہ (Focused)
                        </span>
                      )}
                    </div>
                    <div
                      className="space-y-4 font-nastaliq text-[var(--text-primary)]"
                      style={{
                        fontFamily,
                        fontSize: `${prompterFontSize}px`,
                        lineHeight: 2.3,
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
        </section>

        {/* RIGHT PANEL: Master Audio Mixing & Effects Console (5 cols) */}
        <section className="lg:col-span-5 flex flex-col bg-[var(--bg-surface)] overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
          {/* 1. Live Waveform Visualizer & Elapsed Timer */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs">
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
                    : 'آڈیو لیولز و ویژولائزر (Waveform)'}
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
                    isRecording ? recordingSeconds : currentRecording?.durationSeconds || 0
                  )}
                </span>
                <span className="text-[10px] opacity-70">
                  ({toUrduNumerals(
                    formatDurationMMSS(
                      isRecording ? recordingSeconds : currentRecording?.durationSeconds || 0
                    )
                  )})
                </span>
              </div>
            </div>

            {/* Dynamic Waveform Bars */}
            <div className="flex items-center justify-center gap-1 h-20 px-3 py-3 bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-subtle)]/60 overflow-hidden">
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
                      opacity: isRecording ? 0.9 : 0.45,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* 2. Primary Record / Stop Transport Controls */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-3">
            <div className="text-xs font-bold text-[var(--text-secondary)] mb-1">
              ریکارڈنگ کنٹرولز (Transport Controls)
            </div>

            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="w-full py-4 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer font-nastaliq text-base"
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
                  className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer font-nastaliq text-base"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>ریکارڈنگ مکمل کریں (Finish & Save)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="py-2.5 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] flex items-center justify-center gap-1.5 text-xs font-nastaliq cursor-pointer"
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
                    className="py-2.5 px-3 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5 text-xs font-nastaliq cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>منسوخ کریں</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Real Audible Mushaira Echo & Delay Rack */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-[var(--accent-gold)]">
                <Sparkles className="w-4 h-4" />
                <span>مشاعرہ ایکو و ڈیلے (Audible Mushaira Echo)</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                {ECHO_PRESETS[echoPreset].delayTime ? `${Math.round(ECHO_PRESETS[echoPreset].delayTime * 1000)}ms` : 'OFF'}
              </span>
            </div>

            {/* Echo Presets Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-xs font-nastaliq">
              {(Object.keys(ECHO_PRESETS) as EchoPreset[]).map((eKey) => {
                const eData = ECHO_PRESETS[eKey];
                const isSelected = echoPreset === eKey;
                return (
                  <button
                    key={eKey}
                    type="button"
                    onClick={() => handleSelectEchoPreset(eKey)}
                    className={`p-2 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold shadow-2xs'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{eData.label.split(' ')[0]}</div>
                    <div className="text-[9px] opacity-70 truncate">{eData.urdu}</div>
                  </button>
                );
              })}
            </div>

            {/* Echo Volume Slider */}
            {echoPreset !== 'off' && (
              <div className="pt-2 border-t border-[var(--border-subtle)]/40 flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-[var(--text-muted)] font-nastaliq">ایکو کی مقدار:</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.7"
                  step="0.05"
                  value={echoWetLevel}
                  onChange={(e) => {
                    const wet = parseFloat(e.target.value);
                    setEchoWetLevel(wet);
                    voiceDspService.updateParameters({ echoWetLevel: wet });
                  }}
                  className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-[var(--border-subtle)] accent-[var(--accent-gold)]"
                />
                <span className="font-mono text-[10px] text-[var(--text-muted)] w-8 text-left">
                  {Math.round(echoWetLevel * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* 4. Studio Vocal Profiles & Equalizer */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-[var(--accent-gold)]">
                <SlidersHorizontal className="w-4 h-4" />
                <span>صوتی نکھار و فلٹرز (Studio Vocal Profiles)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAdvancedRack(!showAdvancedRack)}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 font-nastaliq cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>{showAdvancedRack ? 'مختصر کریں' : 'مزید ترتیبات'}</span>
              </button>
            </div>

            {/* Vocal Profiles Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-xs font-nastaliq">
              {(Object.keys(VOCAL_PROFILE_PRESETS) as VocalProfilePreset[]).map((pKey) => {
                const pData = VOCAL_PROFILE_PRESETS[pKey];
                const isSelected = vocalProfile === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => handleSelectVocalProfile(pKey)}
                    className={`p-2 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold shadow-2xs'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{pData.label.split(' ')[0]}</div>
                    <div className="text-[9px] opacity-70 truncate">{pData.description.slice(0, 26)}...</div>
                  </button>
                );
              })}
            </div>

            {/* Advanced EQ & Noise Filter Controls */}
            {showAdvancedRack && (
              <div className="pt-2 border-t border-[var(--border-subtle)]/50 space-y-2.5 text-xs font-nastaliq animate-in fade-in">
                {/* Reverb Presets */}
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] mb-1">صوتی ماحول و گونج (Reverb Space):</div>
                  <div className="flex flex-wrap gap-1">
                    {(Object.keys(REVERB_PRESET_LABELS) as ReverbPreset[]).map((rKey) => (
                      <button
                        key={rKey}
                        type="button"
                        onClick={() => handleSelectReverbPreset(rKey)}
                        className={`px-2 py-1 rounded-lg text-[11px] border cursor-pointer ${
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

                {/* Noise Gate and Rumble Filter Toggles */}
                <div className="pt-2 border-t border-[var(--border-subtle)]/30 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer text-xs select-none">
                    <span className="text-[var(--text-secondary)]">شور فلٹر (80Hz Low-Cut Rumble Filter):</span>
                    <input
                      type="checkbox"
                      checked={lowCutEnabled}
                      onChange={(e) => {
                        setLowCutEnabled(e.target.checked);
                        voiceDspService.updateParameters({ lowCutEnabled: e.target.checked });
                      }}
                      className="w-3.5 h-3.5 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer text-xs select-none">
                    <span className="text-[var(--text-secondary)]">نائز گیٹ (کمرے اور پنکھے کا شور خاموش کریں):</span>
                    <input
                      type="checkbox"
                      checked={noiseGateEnabled}
                      onChange={(e) => {
                        setNoiseGateEnabled(e.target.checked);
                        voiceDspService.updateParameters({ noiseGateEnabled: e.target.checked });
                      }}
                      className="w-3.5 h-3.5 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)] cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 5. Ambient Tanpura Drone Synthesizer (شاہی تنبورہ) */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-[var(--accent-gold)]">
                <Music className="w-4 h-4" />
                <span>شاہی تنبورہ (Ambient Tanpura / Drone)</span>
              </span>

              {/* Instant Tanpura Play/Stop Button */}
              <button
                type="button"
                onClick={handleToggleTanpura}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-nastaliq border transition-all cursor-pointer ${
                  isTanpuraPlaying
                    ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
                }`}
              >
                {isTanpuraPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isTanpuraPlaying ? 'تنبورہ موقوف کریں' : 'تنبورہ شروع کریں'}</span>
              </button>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] font-nastaliq leading-relaxed">
              کلاسیکی سُر (Sa - Pa) کی دھیمی گونج، جو آپ ریکارڈنگ سے قبل یا دوران کسی بھی وقت سن سکتے ہیں۔
            </p>

            {/* Tanpura Volume Slider */}
            <div className="pt-2 border-t border-[var(--border-subtle)]/40 flex items-center justify-between gap-3 text-xs">
              <span className="text-[11px] text-[var(--text-muted)] font-nastaliq">تنبورہ والیم:</span>
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
          </div>

          {/* 6. Acoustic Bahar Metronome (بحر کی تال) */}
          <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs space-y-2.5">
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

            {/* Tempo Selector */}
            {isMetronomeEnabled && (
              <div className="pt-2 border-t border-[var(--border-subtle)]/40 flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] text-[11px] font-nastaliq">رفتار (Tempo):</span>
                <div className="flex items-center gap-1">
                  {(['slow', 'medium', 'fast'] as CadenceTempo[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMetronomeTempo(t)}
                      disabled={isRecording}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] border font-nastaliq cursor-pointer ${
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

          {/* 7. Attached / Saved Recording Player Hub */}
          {currentRecording && !isRecording && (
            <div className="p-4 rounded-2xl border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>کلام کی صوتی ریکارڈنگ موجود ہے</span>
                </span>

                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[10px] font-nastaliq text-[var(--text-muted)]">
                  {currentRecording.mode === 'taht-ul-lafz' ? 'تحت اللفظ' : 'ترنم'}
                </span>
              </div>

              {/* Audio Element */}
              <audio
                ref={audioPlayerRef}
                src={currentRecording.blobDataUrl}
                onTimeUpdate={handleAudioTimeUpdate}
                onEnded={handleAudioEnded}
                preload="metadata"
              />

              {/* Scrubber Bar */}
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

              {/* Player Row */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]/40">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className="p-2.5 rounded-full bg-[var(--accent-gold)] text-white hover:opacity-90 shadow-2xs cursor-pointer"
                    title={isPlayingAudio ? 'موقوف کریں' : 'سنیں'}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current mr-0.5" />}
                  </button>
                  <span className="text-xs font-nastaliq text-[var(--text-secondary)]">
                    {isPlayingAudio ? 'سن رہے ہیں...' : 'سنیں'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="p-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    title="آڈیو فائل برآمد کریں (Download)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleManualSave}
                    className="p-2 rounded-lg border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                    title="کلام کے ساتھ محفوظ کریں"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteRecording}
                    className="p-2 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer"
                    title="ریکارڈنگ حذف کریں"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 3. Bottom Studio Status Bar */}
      <footer className="flex items-center justify-between px-6 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] flex-shrink-0 font-nastaliq">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[var(--accent-gold)]" />
          <span>
            براڈکاسٹ ڈی ایس پی فلٹرز، مشاعرہ ایکو، اور تنبورے کے ساتھ تمام صوتی فائلیں ۱۰۰٪ آف لائن اور آپ کے ڈیوائس پر محفوظ ہیں۔
          </span>
        </div>
        <button
          type="button"
          onClick={onExit}
          disabled={isRecording}
          className="px-4 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer font-bold"
        >
          اسٹوڈیو سے باہر نکلیں (Exit Studio)
        </button>
      </footer>
    </div>
  );
};

export default VoiceRecitationStudioPage;
