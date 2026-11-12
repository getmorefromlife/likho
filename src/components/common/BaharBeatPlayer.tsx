import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Repeat } from 'lucide-react';
import {
  rhythmicCadenceAudioService,
  CadenceTempo,
  PlaybackTick,
} from '../../services/rhythmicCadenceAudioService';

export interface BaharBeatPlayerProps {
  /** Space- or slash-separated pattern string (e.g. "=-== =-== =-== =-=" or "=-= / =-=") */
  pattern: string;
  /** Optional Afa'il list to sync with Arkan (e.g. ["فاعلاتن", "فاعلاتن", "فاعلاتن", "فاعلن"]) */
  afailList?: string[];
  /** Callback notifying the parent which syllable and Rukn is currently playing */
  onActiveTick?: (tick: PlaybackTick | null) => void;
  /** Compact inline presentation for headers and card strips */
  compact?: boolean;
  className?: string;
}

export const BaharBeatPlayer: React.FC<BaharBeatPlayerProps> = ({
  pattern,
  afailList,
  onActiveTick,
  compact = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tempo, setTempo] = useState<CadenceTempo>('medium');
  const [isLoop, setIsLoop] = useState(true);

  const patternRef = useRef(pattern);
  patternRef.current = pattern;
  const afailRef = useRef(afailList);
  afailRef.current = afailList;

  // Cleanup audio playback on unmount
  useEffect(() => {
    return () => {
      rhythmicCadenceAudioService.stop();
    };
  }, []);

  // When pattern changes, stop current playback
  useEffect(() => {
    if (isPlaying) {
      rhythmicCadenceAudioService.stop();
      setIsPlaying(false);
      setIsPaused(false);
      if (onActiveTick) onActiveTick(null);
    }
  }, [pattern]);

  const handlePlayToggle = () => {
    if (isPlaying && !isPaused) {
      rhythmicCadenceAudioService.pause();
      setIsPaused(true);
      if (onActiveTick) onActiveTick(null);
      return;
    }

    if (isPlaying && isPaused) {
      rhythmicCadenceAudioService.resume();
      setIsPaused(false);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    rhythmicCadenceAudioService.play(patternRef.current, {
      afailList: afailRef.current,
      tempo,
      loop: isLoop,
      onTick: (tick) => {
        if (onActiveTick) onActiveTick(tick);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (onActiveTick) onActiveTick(null);
      },
    });
  };

  const handleStop = () => {
    rhythmicCadenceAudioService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    if (onActiveTick) onActiveTick(null);
  };

  const handleTempoChange = (newTempo: CadenceTempo) => {
    setTempo(newTempo);
    if (isPlaying && !isPaused) {
      // Re-trigger with new tempo
      rhythmicCadenceAudioService.play(patternRef.current, {
        afailList: afailRef.current,
        tempo: newTempo,
        loop: isLoop,
        onTick: (tick) => {
          if (onActiveTick) onActiveTick(tick);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          if (onActiveTick) onActiveTick(null);
        },
      });
    }
  };

  const handleToggleLoop = () => {
    const next = !isLoop;
    setIsLoop(next);
    if (isPlaying) {
      // Restart with loop config
      rhythmicCadenceAudioService.play(patternRef.current, {
        afailList: afailRef.current,
        tempo,
        loop: next,
        onTick: (tick) => {
          if (onActiveTick) onActiveTick(tick);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          if (onActiveTick) onActiveTick(null);
        },
      });
    }
  };

  return (
    <div
      dir="rtl"
      data-testid="bahar-beat-player"
      className={`inline-flex flex-wrap items-center gap-2 p-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xs text-xs select-none transition-all ${className}`}
    >
      {/* Main Play / Pause Button */}
      <button
        type="button"
        data-testid="play-beat-btn"
        onClick={handlePlayToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-nastaliq font-bold text-xs cursor-pointer transition-all shadow-xs ${
          isPlaying && !isPaused
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : isPlaying && isPaused
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] hover:brightness-110 active:scale-95'
        }`}
        title={isPlaying && !isPaused ? 'لے روکیں (Pause)' : 'بحر کا صوتی آہنگ سنیں'}
      >
        {isPlaying && !isPaused ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>وقفہ</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlaying && isPaused ? 'جاری رکھیں' : 'لے سنیں'}</span>
          </>
        )}
      </button>

      {/* Stop Button */}
      {isPlaying && (
        <button
          type="button"
          data-testid="stop-beat-btn"
          onClick={handleStop}
          className="p-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-[var(--border-subtle)] cursor-pointer transition-all"
          title="بند کریں (Stop)"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      )}

      {/* Live Audio Equalizer Bars when active */}
      {isPlaying && !isPaused && (
        <div className="flex items-end gap-0.5 h-4 px-1.5">
          <span className="w-1 bg-[var(--accent-gold)] rounded-full animate-bounce h-3"></span>
          <span className="w-1 bg-[var(--accent-gold)] rounded-full animate-pulse h-4"></span>
          <span className="w-1 bg-[var(--accent-gold)] rounded-full animate-bounce h-2"></span>
        </div>
      )}

      {/* Loop Button */}
      <button
        type="button"
        data-testid="toggle-loop-btn"
        onClick={handleToggleLoop}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-nastaliq cursor-pointer border transition-all ${
          isLoop
            ? 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] border-[var(--accent-gold)] font-bold shadow-2xs'
            : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
        }`}
        title={isLoop ? 'تکرار فعال ہے' : 'تکرار بند ہے'}
      >
        <Repeat className="w-3 h-3" />
        <span className="hidden sm:inline">تکرار</span>
      </button>

      {/* Tempo Selector (سست / متوازن / تیز) */}
      {!compact && (
        <div className="flex items-center gap-1 border-r border-[var(--border-subtle)] pr-1.5 mr-0.5">
          {(['slow', 'medium', 'fast'] as CadenceTempo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTempoChange(t)}
              className={`px-2 py-0.5 rounded text-[10px] font-nastaliq cursor-pointer transition-all ${
                tempo === t
                  ? 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] font-bold shadow-2xs'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)]'
              }`}
            >
              {t === 'slow' ? 'سست' : t === 'medium' ? 'متوازن' : 'تیز'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
