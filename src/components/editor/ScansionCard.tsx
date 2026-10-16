import React from 'react';
import { Music, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScansionResult } from '../../services/aroozEngine';

interface ScansionCardProps {
  scansion: ScansionResult;
  fontFamily: string;
}

export const ScansionCard: React.FC<ScansionCardProps> = ({ scansion, fontFamily }) => {
  if (!scansion.rawSyllables) {
    return null;
  }

  return (
    <div className="my-2 py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 backdrop-blur-xs shadow-2xs text-xs select-none transition-all hover:border-[var(--accent-gold)]/60">
      {/* Top Row: Identified Bahr Name & Match Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
            <Music className="w-3.5 h-3.5" />
          </span>
          <span className="font-nastaliq font-bold text-sm text-[var(--text-primary)]">
            {scansion.meterNameUrdu}
          </span>
          {scansion.meterNameEnglish && scansion.isMatched && (
            <span className="hidden sm:inline-block text-[10px] font-mono text-[var(--text-muted)]">
              ({scansion.meterNameEnglish})
            </span>
          )}
        </div>

        {/* Confidence & Syllables Pill */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          {scansion.isMatched ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-nastaliq">
              <CheckCircle2 className="w-3 h-3" />
              <span>موزوں ({scansion.confidence}%)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-nastaliq">
              <AlertCircle className="w-3 h-3" />
              <span>نامکمل</span>
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-nastaliq">
            {scansion.totalSyllables} ہجے
          </span>
        </div>
      </div>

      {/* Middle & Bottom Row: Afa'il Breakdown & Rhythmic Pattern (- and =) in RTL order */}
      {scansion.isMatched && scansion.afailList.length > 0 ? (
        <div className="pt-2 border-t border-[var(--border-subtle)]/60 space-y-2">
          {/* Afa'il Breakdown: rendered right-to-left */}
          <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {scansion.afailList.map((rukn, idx) => {
              const rawPattern = scansion.groupedPatternList[idx] || '';
              // Extract clean sequence of symbols e.g. ['=', '-', '=', '=']
              const symbols = rawPattern.replace(/\s+/g, '').split('');

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70 shadow-2xs transition-all hover:border-[var(--accent-gold)]/50"
                >
                  {/* Rukn Name in Nastaliq */}
                  <span
                    style={{ fontFamily }}
                    className="font-nastaliq font-bold text-sm text-[var(--accent-gold)] leading-relaxed"
                  >
                    {rukn}
                  </span>

                  {/* Scansion Symbols in strict RTL order: rightmost symbol = first syllable of rukn */}
                  <div dir="rtl" className="flex items-center justify-center gap-1 mt-1">
                    {symbols.map((sym, sIdx) => {
                      const isLong = sym === '=';
                      return (
                        <span
                          key={sIdx}
                          className={`inline-flex items-center justify-center min-w-[18px] h-5 px-1 rounded text-xs font-mono font-bold leading-none select-none transition-transform hover:scale-110 ${
                            isLong
                              ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/35 shadow-2xs'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                          }`}
                          title={isLong ? 'ہجائے بلند (Long Syllable: =)' : 'ہجائے کوتاہ (Short Syllable: -)'}
                        >
                          {sym}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notation Legend Hint & RTL Line Rhythm Summary */}
          <div dir="rtl" className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] pt-1 font-nastaliq">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)] font-medium">مجموعی آہنگ (دائیں تا بائیں):</span>
              <div dir="rtl" className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--accent-gold)] tracking-wider">
                {scansion.groupedPatternList.map((grp, gIdx) => (
                  <span
                    key={gIdx}
                    dir="rtl"
                    className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]/80 border border-[var(--border-subtle)] text-[11px]"
                  >
                    {grp.replace(/\s+/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-mono font-bold border border-[var(--accent-gold)]/40 leading-none">
                  =
                </span>
                <span>بلند (Long)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-mono font-bold border border-[var(--border-subtle)] leading-none">
                  -
                </span>
                <span>کوتاہ (Short)</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-[var(--border-subtle)]/60 space-y-2">
          {/* User's typed rhythm grouped into feet in strict RTL order */}
          {scansion.groupedPatternList.length > 0 && (
            <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {scansion.groupedPatternList.map((grp, idx) => {
                const symbols = grp.replace(/\s+/g, '').split('');
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70 shadow-2xs"
                  >
                    <span className="font-nastaliq text-[11px] text-[var(--accent-gold)]">
                      رکن {idx + 1}
                    </span>
                    <div dir="rtl" className="flex items-center justify-center gap-1 mt-1">
                      {symbols.map((sym, sIdx) => {
                        const isLong = sym === '=';
                        return (
                          <span
                            key={sIdx}
                            className={`inline-flex items-center justify-center min-w-[18px] h-5 px-1 rounded text-xs font-mono font-bold leading-none select-none ${
                              isLong
                                ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/35 shadow-2xs'
                                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                            }`}
                            title={isLong ? 'ہجائے بلند (Long: =)' : 'ہجائے کوتاہ (Short: -)'}
                          >
                            {sym}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RTL Line Rhythm Summary */}
          <div dir="rtl" className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] pt-1 font-nastaliq">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)] font-medium">مجموعی آہنگ (دائیں تا بائیں):</span>
              <div dir="rtl" className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--accent-gold)] tracking-wider">
                {scansion.groupedPatternList.map((grp, gIdx) => (
                  <span
                    key={gIdx}
                    dir="rtl"
                    className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]/80 border border-[var(--border-subtle)] text-[11px]"
                  >
                    {grp.replace(/\s+/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-[var(--text-muted)]">
              {scansion.totalSyllables < 6
                ? 'مصرع جاری رکھیں...'
                : 'آزاد وزن — کسی روایتی بحر کے اوزان سے مطابقت پر بحر کا نام ظاہر ہوگا'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
