import React, { useRef } from 'react';

interface InteractiveWaveformProps {
  peaks: number[];
  durationSeconds: number;
  currentTime: number;
  trimStart: number;
  trimEnd: number;
  isLoading?: boolean;
  onSeekSeconds: (seconds: number) => void;
}

/**
 * Interactive clickable waveform display showing full audio peaks,
 * dimmed sections outside [trimStart, trimEnd], and live playhead position.
 */
export const InteractiveWaveform: React.FC<InteractiveWaveformProps> = ({
  peaks,
  durationSeconds,
  currentTime,
  trimStart,
  trimEnd,
  isLoading = false,
  onSeekSeconds,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const safeDuration = Math.max(0.1, durationSeconds);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
    onSeekSeconds(ratio * safeDuration);
  };

  if (isLoading) {
    return (
      <div className="h-14 w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[11px] font-nastaliq text-[var(--text-muted)]">
        آڈیو ویوفارم لوڈ ہو رہا ہے...
      </div>
    );
  }

  if (peaks.length === 0) {
    return null;
  }

  const playheadPct = Math.max(0, Math.min(100, (currentTime / safeDuration) * 100));

  return (
    <div
      ref={containerRef}
      dir="ltr"
      role="slider"
      tabIndex={0}
      aria-label="انٹرایکٹو آڈیو ویوفارم"
      aria-valuemin={0}
      aria-valuemax={Math.round(safeDuration)}
      aria-valuenow={Math.round(currentTime)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          onSeekSeconds(Math.min(trimEnd, currentTime + 1));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onSeekSeconds(Math.max(trimStart, currentTime - 1));
        }
      }}
      title="کسی بھی حصے پر کلک کر کے وہاں سے سنیں"
      className="relative h-14 w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] px-2 py-2 flex items-center gap-[2px] cursor-pointer select-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
    >
      {peaks.map((peak, idx) => {
        const barTime = ((idx + 0.5) / peaks.length) * safeDuration;
        const insideTrim = barTime >= trimStart && barTime <= trimEnd;
        const played = barTime <= currentTime && insideTrim;

        return (
          <div
            key={idx}
            className={`flex-1 rounded-full transition-colors ${
              !insideTrim
                ? 'bg-[var(--border-subtle)] opacity-35'
                : played
                ? 'bg-[var(--accent-gold)]'
                : 'bg-[var(--accent-gold)]/45 hover:bg-[var(--accent-gold)]/70'
            }`}
            style={{
              height: `${Math.max(14, Math.round(peak * 100))}%`,
            }}
          />
        );
      })}

      {/* Live Playhead */}
      <div
        className="absolute top-1 bottom-1 w-0.5 bg-emerald-500 shadow-xs pointer-events-none"
        style={{ left: `${playheadPct}%` }}
      />
    </div>
  );
};

