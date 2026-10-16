import React from 'react';

interface ErabToolbarProps {
  onInsertErab: (char: string) => void;
}

export const ERAB_LIST = [
  { char: '\u064E', name: 'زبر' },
  { char: '\u0650', name: 'زیر' },
  { char: '\u064F', name: 'پیش' },
  { char: '\u0651', name: 'تشدید' },
  { char: '\u0652', name: 'جزم' },
  { char: '\u064B', name: 'دو زبر' },
  { char: '\u064D', name: 'دو زیر' },
  { char: '\u064C', name: 'دو پیش' },
  { char: '\u0670', name: 'کھڑا زبر' },
  { char: '\u0656', name: 'کھڑی زیر' },
  { char: '\u0657', name: 'الٹا پیش' },
  { char: '\u0653', name: 'مد' },
  { char: '\u0621', name: 'ہمزہ' },
  { char: '\u06C2', name: 'ہائے مختفی' },
  { char: '\u0614', name: 'تخلص' },
  { char: '\u060F', name: 'مصرع' },
];

export const ErabToolbar: React.FC<ErabToolbarProps> = ({ onInsertErab }) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1 px-2 border-y border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 text-xs select-none">
      <span className="text-[11px] font-nastaliq text-[var(--text-muted)] ml-2 whitespace-nowrap">
        اعراب و علامات:
      </span>
      <div className="flex items-center gap-1">
        {ERAB_LIST.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => onInsertErab(item.char)}
            className="w-7 h-7 flex items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] font-nastaliq text-base transition-all active:scale-95 shadow-2xs"
            title={item.name}
          >
            {item.char === '\u064E' ||
            item.char === '\u0650' ||
            item.char === '\u064F' ||
            item.char === '\u0651' ||
            item.char === '\u0652' ||
            item.char === '\u064B' ||
            item.char === '\u064D' ||
            item.char === '\u064C' ||
            item.char === '\u0670' ||
            item.char === '\u0656' ||
            item.char === '\u0657' ||
            item.char === '\u0653' ? (
              <span className="relative">
                <span className="text-transparent">ب</span>
                <span className="absolute inset-0 flex items-center justify-center">ب{item.char}</span>
              </span>
            ) : (
              item.char
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
