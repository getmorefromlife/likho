import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { PHONETIC_KEYBOARD_LAYOUT } from '../../utils/phoneticKeymap';

interface PhoneticKeyboardGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggle: () => void;
}

export const PhoneticKeyboardGuideModal: React.FC<PhoneticKeyboardGuideModalProps> = ({
  isOpen,
  onClose,
  isEnabled,
  onToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-nastaliq text-[var(--text-primary)]">
                صوتی کی بورڈ گائیڈ (CRULP / NLA Standard)
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-nastaliq">
                اپنے معیاری انگریزی (QWERTY) کی بورڈ پر بغیر زبان بدلے براہِ راست روانی سے اردو لکھیے۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-nastaliq font-bold transition-all border ${
                isEnabled
                  ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] shadow-xs'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{isEnabled ? 'صوتی کی بورڈ: فعال (آن)' : 'صوتی کی بورڈ: غیر فعال (آف)'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto custom-scrollbar flex-1 py-4 space-y-6">
          {/* Shortcuts Info Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-xs font-nastaliq text-[var(--text-secondary)]">
              <Command className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>کی بورڈ آن / آف شارٹ کٹ:</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <kbd className="px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--accent-gold)] font-mono font-bold">
                Ctrl + Space
              </kbd>
              <span className="text-[var(--text-muted)] font-nastaliq">یا</span>
              <kbd className="px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--accent-gold)] font-mono font-bold">
                Alt + K
              </kbd>
            </div>
          </div>

          {/* Visual QWERTY Layout */}
          <div className="space-y-2.5 p-4 rounded-xl bg-[var(--bg-subtle)]/50 border border-[var(--border-subtle)]" dir="ltr">
            <div className="text-right text-xs font-nastaliq text-[var(--text-muted)] mb-2" dir="rtl">
              نقشہ کلید (QWERTY Layout) — اوپر شفٹ کلید اور نیچے بنیادی حرف:
            </div>
            {PHONETIC_KEYBOARD_LAYOUT.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5 md:gap-2">
                {row.map((k) => (
                  <div
                    key={k.normalKey}
                    className="flex flex-col items-center justify-between p-1.5 md:p-2 min-w-[34px] md:min-w-[46px] h-14 md:h-16 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xs hover:border-[var(--accent-gold)] transition-colors"
                  >
                    {/* Shifted Urdu Character */}
                    <div className="flex items-center justify-between w-full text-[10px] text-[var(--accent-gold)]">
                      <span className="font-mono text-[9px] opacity-60 uppercase">{k.shiftKey}</span>
                      <span className="font-nastaliq font-bold">{k.shiftUrdu}</span>
                    </div>

                    {/* Normal Urdu Character */}
                    <div className="flex items-center justify-between w-full text-sm md:text-base text-[var(--text-primary)]">
                      <span className="font-mono text-[10px] text-[var(--text-muted)] lowercase">{k.normalKey}</span>
                      <span className="font-nastaliq font-bold text-lg md:text-xl text-[var(--text-primary)]">
                        {k.normalUrdu}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Quick Reference Tables (Punctuation, Diacritics & Special Glyphs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Punctuation (رموزِ اوقاف) */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <h3 className="text-xs font-bold font-nastaliq text-[var(--accent-gold)] mb-3 pb-1 border-b border-[var(--border-subtle)]">
                رموزِ اوقاف (Punctuation Marks)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">سوالیہ نشان</span>
                  <span className="font-nastaliq font-bold text-base text-[var(--accent-gold)]">؟</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">?</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">سکتہ (کوما)</span>
                  <span className="font-nastaliq font-bold text-base text-[var(--accent-gold)]">،</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">,</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">وقفہ (سیمی کولن)</span>
                  <span className="font-nastaliq font-bold text-base text-[var(--accent-gold)]">؛</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">;</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">ختمہ (فل اسٹاپ)</span>
                  <span className="font-nastaliq font-bold text-base text-[var(--accent-gold)]">۔</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">. یا -</kbd>
                </div>
              </div>
            </div>

            {/* Aerab & Symbols (اعراب و دعائیہ علامات) */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <h3 className="text-xs font-bold font-nastaliq text-[var(--accent-gold)] mb-3 pb-1 border-b border-[var(--border-subtle)]">
                اعراب و دعائیہ کلمات (Shifted Keys)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">زبر</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">Shift+F</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">زیر</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">Shift+I</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">پیش</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">Shift+P</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">جزم / سکون</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">Shift+Q</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">تشدید</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">Shift+M</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                  <span className="font-nastaliq">ہمزہ</span>
                  <kbd className="font-mono text-[11px] text-[var(--text-muted)]">Shift+W</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent-gold)] text-white font-nastaliq font-bold text-xs hover:bg-[var(--accent-gold)]/90 transition-all shadow-xs"
          >
            سمجھ گیا / بند کریں
          </button>
        </div>
      </div>
    </div>
  );
};
