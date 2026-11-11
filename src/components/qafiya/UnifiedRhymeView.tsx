import React, { useState, useMemo } from 'react';
import { Plus, X, Check, Trash2, Layers } from 'lucide-react';
import { translateKeyToUrdu } from '../../utils/phoneticKeymap';

interface UnifiedRhymeViewProps {
  /** Current raw newline-separated or array list of rhymes */
  rhymeWords: string[];
  /** Current poem content to highlight which rhymes are already used */
  poemContent: string;
  /** Placement mode: 'top' flows in Right-to-Left rows; 'left' flows Top-to-Bottom in 1..N columns */
  placement: 'top' | 'left';
  /** Font family for Nastaliq rendering */
  fontFamily: string;
  /** Base font size */
  fontSize?: number;
  /** Callback when the rhyme list changes */
  onChangeRhymes: (nextWords: string[]) => void;
  /** Optional callback when a rhyme is clicked (e.g. insert into poem at cursor) */
  onSelectRhyme?: (word: string) => void;
  /** Optional hidden accessible label for E2E compatibility */
  hiddenTextareaLabel?: string;
}

export const UnifiedRhymeView: React.FC<UnifiedRhymeViewProps> = ({
  rhymeWords,
  poemContent,
  placement,
  fontFamily,
  fontSize = 20,
  onChangeRhymes,
  onSelectRhyme,
  hiddenTextareaLabel,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const usedWordsSet = useMemo(() => {
    return new Set(
      poemContent
        .split(/[\s\n،۔!؟?؛:]+/u)
        .map((w) => w.trim())
        .filter(Boolean)
    );
  }, [poemContent]);

  const handleAddInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    const incoming = quickInput
      .split(/[\n،,\s]+/u)
      .map((w) => w.trim())
      .filter(Boolean);
    if (incoming.length > 0) {
      const merged = [...new Set([...rhymeWords, ...incoming])];
      onChangeRhymes(merged);
      setQuickInput('');
    }
  };

  const handlePasteIntoInput = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted && /[\n،,]/u.test(pasted)) {
      e.preventDefault();
      const incoming = pasted
        .split(/[\n،,\s]+/u)
        .map((w) => w.trim())
        .filter(Boolean);
      if (incoming.length > 0) {
        onChangeRhymes([...new Set([...rhymeWords, ...incoming])]);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let phoneticOn = false;
    try {
      phoneticOn = localStorage.getItem('likho_phonetic_keyboard') === 'true';
    } catch {
      phoneticOn = false;
    }
    if (!phoneticOn || e.nativeEvent.isComposing) return;
    const mapped = translateKeyToUrdu(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
    if (!mapped) return;
    e.preventDefault();
    const target = e.currentTarget;
    const start = target.selectionStart ?? quickInput.length;
    const end = target.selectionEnd ?? quickInput.length;
    const next = quickInput.slice(0, start) + mapped + quickInput.slice(end);
    setQuickInput(next);
    requestAnimationFrame(() => {
      target.setSelectionRange(start + mapped.length, start + mapped.length);
    });
  };

  const handleRemoveWord = (wordToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChangeRhymes(rhymeWords.filter((w) => w !== wordToRemove));
  };

  const handleHiddenTextareaChange = (val: string) => {
    const parsed = [
      ...new Set(
        val
          .split(/[\n،,]+/u)
          .map((w) => w.trim())
          .filter(Boolean)
      ),
    ];
    onChangeRhymes(parsed);
  };

  // Determine dynamic column count when placed on the left side based on number of rhymes
  const leftColumnCountClass = useMemo(() => {
    const n = rhymeWords.length;
    if (n <= 8) return 'grid-cols-1';
    if (n <= 18) return 'grid-cols-2';
    if (n <= 36) return 'grid-cols-2 sm:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
  }, [rhymeWords.length]);

  const rhymeFontSize = Math.max(16, Math.min(24, fontSize - 2));

  return (
    <div
      dir="rtl"
      className="w-full h-full min-h-0 min-w-0 flex flex-col overflow-hidden bg-[var(--bg-card)]/50 select-none"
    >
      {/* Hidden accessible textarea so keyboard/clipboard tests targeting aria-label="ذاتی قوافی" continue to work without showing a second box */}
      {hiddenTextareaLabel && (
        <textarea
          aria-label={hiddenTextareaLabel}
          value={rhymeWords.join('\n')}
          onChange={(e) => handleHiddenTextareaChange(e.target.value)}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Compact Header + Quick Add Input */}
      <div className="px-4 py-2 border-b border-[var(--border-subtle)]/60 bg-[var(--bg-surface)]/80 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span className="text-xs font-bold font-nastaliq text-[var(--text-primary)]">
            منتخب قوافی ({rhymeWords.length})
          </span>
          <span className="text-[10px] font-nastaliq text-[var(--text-muted)] hidden sm:inline">
            {placement === 'top'
              ? '— دائیں سے بائیں قطاریں (کلک کر کے مصرعے میں شامل کریں)'
              : '— اوپر سے نیچے ستون (کلک کر کے مصرعے میں شامل کریں)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <form onSubmit={handleAddInput} className="flex items-center gap-1">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onPaste={handlePasteIntoInput}
              placeholder="نیا قافیہ لکھیں یا چسپاں کریں..."
              className="w-40 sm:w-52 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-nastaliq text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] text-right"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="p-1.5 rounded-lg bg-[var(--accent-gold)] text-white hover:brightness-110 disabled:opacity-40 transition-all"
              title="قافیہ شامل کریں"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          {rhymeWords.length > 0 && (
            <button
              type="button"
              onClick={() => onChangeRhymes([])}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-400/50 transition-colors"
              title="تمام قوافی صاف کریں"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Single Unified Rhymes Display Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar overscroll-contain">
        {rhymeWords.length === 0 ? (
          <div className="h-full min-h-[72px] flex items-center justify-center text-center text-xs font-nastaliq text-[var(--text-muted)]">
            ابھی کوئی قافیہ درج نہیں۔ اوپر خانے میں لکھیں یا &quot;قالب ساز (Slot)&quot; چیک کر کے قوافی منتخب کریں۔
          </div>
        ) : placement === 'top' ? (
          /* TOP MODE: Horizontal Rows flowing from Right to Left (RTL) */
          <div
            data-testid="rhyme-rows-rtl"
            dir="rtl"
            className="flex flex-row flex-wrap items-center justify-start gap-2.5 content-start"
          >
            {rhymeWords.map((word) => {
              const isUsed = usedWordsSet.has(word);
              return (
                <div
                  key={word}
                  onClick={() => onSelectRhyme?.(word)}
                  style={{ fontFamily, fontSize: `${rhymeFontSize}px`, lineHeight: 2.0 }}
                  className={`group inline-flex items-center gap-2 px-3.5 py-1 rounded-xl border cursor-pointer transition-all ${
                    isUsed
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 line-through opacity-75'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 text-[var(--text-primary)] shadow-2xs'
                  }`}
                  title="کلک کر کے مصرعے میں شامل کریں"
                >
                  <span className="font-nastaliq font-bold">{word}</span>
                  {isUsed && <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveWord(word, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 transition-opacity"
                    title="یہ قافیہ ہٹائیں"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* LEFT MODE: Top-to-Bottom in 1 or more Vertical Columns depending on count */
          <div
            data-testid="rhyme-columns-top-to-bottom"
            dir="rtl"
            className={`grid ${leftColumnCountClass} gap-2 items-start content-start`}
          >
            {rhymeWords.map((word, idx) => {
              const isUsed = usedWordsSet.has(word);
              return (
                <div
                  key={word}
                  onClick={() => onSelectRhyme?.(word)}
                  style={{ fontFamily, fontSize: `${rhymeFontSize}px`, lineHeight: 2.0 }}
                  className={`group flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                    isUsed
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 line-through opacity-75'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 text-[var(--text-primary)] shadow-2xs'
                  }`}
                  title="کلک کر کے مصرعے میں شامل کریں"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] opacity-60">
                      {idx + 1}.
                    </span>
                    <span className="font-nastaliq font-bold truncate">{word}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isUsed && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveWord(word, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 transition-opacity"
                      title="یہ قافیہ ہٹائیں"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

