import React from 'react';

export interface ProsodicPatternViewProps {
  /** The scansion pattern string, e.g. "==-" or "-==" or "=-=" */
  pattern: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show visual RTL direction guide label */
  showDirectionBadge?: boolean;
  /** Custom extra CSS classes */
  className?: string;
  /** Optional custom syllable labels or word breakdowns */
  syllables?: string[];
}

/**
 * Standard RTL Prosodic Pattern Component (عروضی تقطیع کا دائیں تا بائیں معیاری ڈسپلے)
 *
 * Enforces strict Right-to-Left visual alignment for Urdu prosody:
 * - Syllable 1 (index 0) is anchored on the RIGHT (matching the start of the Urdu word).
 * - Syllables progress leftward towards the end of the word.
 * - Long syllables (=) are styled in emerald/gold.
 * - Short syllables (-) are styled in amber/muted blue.
 * - Flexible syllables (x) are styled in violet.
 */
export const ProsodicPatternView: React.FC<ProsodicPatternViewProps> = ({
  pattern,
  size = 'sm',
  showDirectionBadge = false,
  className = '',
  syllables,
}) => {
  const cleanSymbols = pattern.replace(/[\s/]/g, '').split('');

  if (cleanSymbols.length === 0) {
    return <span className="text-[var(--text-muted)] text-xs">—</span>;
  }

  const sizeClasses = {
    xs: 'w-3 h-3 text-[9px] rounded-xs',
    sm: 'w-4 h-4 text-[10px] rounded',
    md: 'w-5 h-5 text-xs rounded-md',
    lg: 'w-6 h-6 text-sm rounded-lg',
  }[size];

  const urduDigits = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰'];

  return (
    <span
      dir="rtl"
      title="دائیں سے بائیں (RTL): پہلا ہجا دائیں جانب شروع ہوتا ہے"
      className={`inline-flex items-center gap-1 select-none ${className}`}
    >
      <span className="inline-flex items-center gap-0.5 font-mono font-bold">
        {cleanSymbols.map((sym, idx) => {
          const isLong = sym === '=';
          const isFlexible = sym === 'x';
          const syllableNum = urduDigits[idx] || String(idx + 1);
          const syllableName = isLong ? 'بلند (=)' : isFlexible ? 'لچکدار (x)' : 'کوتاہ (-)';
          const syllableWord = syllables && syllables[idx] ? ` «${syllables[idx]}»` : '';

          const badgeColor = isLong
            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/35'
            : isFlexible
            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/35'
            : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';

          return (
            <span
              key={idx}
              className={`inline-flex items-center justify-center border font-bold transition-all shadow-2xs ${sizeClasses} ${badgeColor}`}
              title={`ہجا ${syllableNum}: ${syllableName}${syllableWord} (دائیں سے بائیں)`}
            >
              {sym}
            </span>
          );
        })}
      </span>

      {showDirectionBadge && (
        <span
          dir="rtl"
          className="text-[9px] text-[var(--accent-gold)] font-nastaliq opacity-80 hidden sm:inline"
        >
          (دائیں تا بائیں)
        </span>
      )}
    </span>
  );
};

