import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import {
  Undo2,
  Redo2,
  Sparkles,
  BookOpen,
  Feather,
  Activity,
  Plus,
  Keyboard,
  HelpCircle,
} from 'lucide-react';
import { PoemDraft, PoeticForm } from '../../types/editor';
import { WorkspacePrefs } from '../../types/workspace';
import { ErabToolbar } from './ErabToolbar';
import { WordProcessorToolbar, TextAlignment } from './WordProcessorToolbar';
import type { detectPoemRhymeScheme as DetectPoemRhymeSchemeFn } from '../../services/qafiyaEngine';
import type { findClassicalZameenMatches as FindClassicalZameenMatchesFn } from '../../services/zameenMatcherService';
import { translateKeyToUrdu } from '../../utils/phoneticKeymap';
import { useLineBoxSelection } from '../../hooks/useLineBoxSelection';
import { PhoneticKeyboardGuideModal } from './PhoneticKeyboardGuideModal';
import { ClassicalZameenModal } from '../companion/ClassicalZameenModal';

const LazyScansionCard = React.lazy(() => import('./ScansionCard'));

interface PoetryCanvasProps {
  currentDraft: PoemDraft;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  prefs: WorkspacePrefs;
  stats: {
    chars: number;
    words: number;
    misras: number;
    couplets: number;
    paragraphs?: number;
    readingTimeMinutes?: number;
  };
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onTitleChange: (title: string) => void;
  onPoetChange: (poet: string) => void;
  onFormChange: (form: PoeticForm) => void;
  onContentChange: (content: string) => void;
  onInsertErab: (char: string) => void;
  onInsertCoupletTemplate: (type: 'matla' | 'sher' | 'maqta') => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onSelect: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  onToggleLiveScansion: () => void;
}

export const PoetryCanvas: React.FC<PoetryCanvasProps> = ({
  currentDraft,
  textareaRef,
  prefs,
  stats,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onTitleChange,
  onPoetChange,
  onFormChange,
  onContentChange,
  onInsertErab,
  onInsertCoupletTemplate,
  onPaste,
  onSelect,
  onToggleLiveScansion,
}) => {
  const [textAlign, setTextAlign] = useState<TextAlignment>('center');
  const [showErabToolbar, setShowErabToolbar] = useState(true);
  const [isPhoneticEnabled, setIsPhoneticEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('likho_phonetic_keyboard') === 'true';
    } catch {
      return false;
    }
  });
  const [isKeyboardGuideOpen, setIsKeyboardGuideOpen] = useState(false);

  const isProseMode = currentDraft.form === 'prose';
  const isCustomMode = prefs.activePreset === 'custom';
  const cc = prefs.customConfig;
  const showMetadataHeader = !isCustomMode || cc.showTitleAndMetadata;
  const showFormattingBar = !isCustomMode || cc.showWordProcessorToolbar;
  const effectiveShowErab = isCustomMode ? cc.showErabToolbar && showErabToolbar : showErabToolbar;
  const effectiveShowAutoRhyme = !isCustomMode || cc.showAutoRhymeBanner;
  const effectiveShowLiveScansion = isCustomMode ? cc.showLiveScansionCards : prefs.showLiveScansion;
  const effectiveShowLineNumbers = !isCustomMode || cc.showLineNumbers;
  const effectiveDiwanCouplets = isCustomMode && cc.showCoupletDiwanLayout && !isProseMode;
  const effectiveShowBottomStats = !isCustomMode || cc.showBottomStatsBar;
  const effectiveRuledLines = !isCustomMode || cc.showRuledLines;
  const paperWidthClass = !isCustomMode
    ? 'max-w-4xl'
    : cc.paperWidth === 'narrow'
    ? 'max-w-2xl'
    : cc.paperWidth === 'wide'
    ? 'max-w-6xl'
    : cc.paperWidth === 'full'
    ? 'max-w-full'
    : 'max-w-4xl';

  const selection = useLineBoxSelection(currentDraft.content, currentDraft.id, onContentChange);

  const togglePhoneticKeyboard = () => {
    setIsPhoneticEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('likho_phonetic_keyboard', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Global hotkey listener: Ctrl + Space or Alt + K toggles phonetic mode
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.code === 'Space') || (e.altKey && (e.key === 'k' || e.key === 'K'))) {
        e.preventDefault();
        togglePhoneticKeyboard();
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  // Split lines for per-line scansion mode
  const lines = currentDraft.content.split('\n');
  const linesRef = useRef(lines);
  linesRef.current = lines;

  const [rhymeDetectorFn, setRhymeDetectorFn] = useState<
    typeof DetectPoemRhymeSchemeFn | null
  >(null);
  const [zameenMatcherFn, setZameenMatcherFn] = useState<
    typeof FindClassicalZameenMatchesFn | null
  >(null);
  const [isZameenModalOpen, setIsZameenModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void import('../../services/qafiyaEngine').then((mod) => {
      if (active) setRhymeDetectorFn(() => mod.detectPoemRhymeScheme);
    });
    void import('../../services/zameenMatcherService').then((mod) => {
      if (active) setZameenMatcherFn(() => mod.findClassicalZameenMatches);
    });
    return () => {
      active = false;
    };
  }, []);

  const detectedRhymeScheme = useMemo(
    () => (isProseMode || !rhymeDetectorFn ? null : rhymeDetectorFn(lines)),
    [currentDraft.content, isProseMode, rhymeDetectorFn]
  );

  const zameenReport = useMemo(
    () =>
      isProseMode || !zameenMatcherFn
        ? null
        : zameenMatcherFn({
            poemContent: currentDraft.content,
            preferredMeterName: currentDraft.meterName,
            preferredMeterRukn: currentDraft.meterRukn,
            preferredRadif: currentDraft.radif,
          }),
    [
      currentDraft.content,
      currentDraft.meterName,
      currentDraft.meterRukn,
      currentDraft.radif,
      isProseMode,
      zameenMatcherFn,
    ]
  );

  const handleLineChange = useCallback(
    (index: number, newText: string) => {
      const newLines = [...linesRef.current];
      newLines[index] = newText;
      onContentChange(newLines.join('\n'));
    },
    [onContentChange]
  );

  const handleLineKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newLines = [...lines];
      newLines.splice(index + 1, 0, '');
      onContentChange(newLines.join('\n'));
      setTimeout(() => {
        const nextInput = document.getElementById(`misra-input-${index + 1}`);
        nextInput?.focus();
      }, 50);
      return;
    } else if (e.key === 'Backspace' && lines[index] === '' && lines.length > 1) {
      e.preventDefault();
      const newLines = lines.filter((_, i) => i !== index);
      onContentChange(newLines.join('\n'));
      setTimeout(() => {
        const prevInput = document.getElementById(`misra-input-${Math.max(0, index - 1)}`);
        prevInput?.focus();
      }, 50);
      return;
    }

    // In-App Urdu Phonetic Keyboard Interceptor
    if (isPhoneticEnabled) {
      const urduChar = translateKeyToUrdu(e);
      if (urduChar) {
        e.preventDefault();
        const input = e.currentTarget;
        const start = input.selectionStart ?? lines[index].length;
        const end = input.selectionEnd ?? lines[index].length;
        const currentText = lines[index];
        const nextText = currentText.substring(0, start) + urduChar + currentText.substring(end);
        handleLineChange(index, nextText);
        const nextCursor = start + urduChar.length;
        requestAnimationFrame(() => {
          input.setSelectionRange(nextCursor, nextCursor);
        });
      }
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPhoneticEnabled) {
      const urduChar = translateKeyToUrdu(e);
      if (urduChar) {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart ?? currentDraft.content.length;
        const end = textarea.selectionEnd ?? currentDraft.content.length;
        const currentText = currentDraft.content;
        const nextText = currentText.substring(0, start) + urduChar + currentText.substring(end);
        onContentChange(nextText);
        const nextCursor = start + urduChar.length;
        requestAnimationFrame(() => {
          textarea.setSelectionRange(nextCursor, nextCursor);
        });
      }
    }
  };

  const handlePoetKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPhoneticEnabled) {
      const urduChar = translateKeyToUrdu(e);
      if (urduChar) {
        e.preventDefault();
        const input = e.currentTarget;
        const start = input.selectionStart ?? currentDraft.poet.length;
        const end = input.selectionEnd ?? currentDraft.poet.length;
        const currentText = currentDraft.poet;
        const nextText = currentText.substring(0, start) + urduChar + currentText.substring(end);
        onPoetChange(nextText);
        const nextCursor = start + urduChar.length;
        requestAnimationFrame(() => {
          input.setSelectionRange(nextCursor, nextCursor);
        });
      }
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('misra-input-0')?.focus();
      return;
    }
    if (isPhoneticEnabled) {
      const urduChar = translateKeyToUrdu(e);
      if (urduChar) {
        e.preventDefault();
        const input = e.currentTarget;
        const start = input.selectionStart ?? currentDraft.title.length;
        const end = input.selectionEnd ?? currentDraft.title.length;
        const currentText = currentDraft.title;
        const nextText = currentText.substring(0, start) + urduChar + currentText.substring(end);
        onTitleChange(nextText);
        const nextCursor = start + urduChar.length;
        requestAnimationFrame(() => {
          input.setSelectionRange(nextCursor, nextCursor);
        });
      }
    }
  };

  const handleAddMisra = () => {
    onContentChange(currentDraft.content ? `${currentDraft.content}\n` : '\n');
  };

  // Word processor formatting helper
  const handleFormatAction = (
    type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'h1' | 'h2' | 'quote' | 'bullet' | 'number' | 'divider'
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // In line-by-line mode or fallback, append formatted marker
      if (type === 'divider') {
        onContentChange(currentDraft.content ? `${currentDraft.content}\n\n— — —\n\n` : '— — —\n');
      } else if (type === 'h1') {
        onContentChange(currentDraft.content ? `${currentDraft.content}\n# عنوان` : '# عنوان\n');
      } else if (type === 'quote') {
        onContentChange(currentDraft.content ? `${currentDraft.content}\n> اقتباس` : '> اقتباس\n');
      }
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = currentDraft.content;
    const selected = content.substring(start, end);

    let before = '';
    let after = '';
    let placeholder = '';

    switch (type) {
      case 'bold':
        before = '**';
        after = '**';
        placeholder = 'جلی متن';
        break;
      case 'italic':
        before = '*';
        after = '*';
        placeholder = 'ترچھا متن';
        break;
      case 'underline':
        before = '<u>';
        after = '</u>';
        placeholder = 'خط کشیدہ متن';
        break;
      case 'strikethrough':
        before = '~~';
        after = '~~';
        placeholder = 'قلم زدہ متن';
        break;
      case 'h1':
        before = '\n# ';
        after = '\n';
        placeholder = 'عنوانِ مقالہ';
        break;
      case 'h2':
        before = '\n## ';
        after = '\n';
        placeholder = 'ذیلی عنوان';
        break;
      case 'quote':
        before = '\n> ';
        after = '\n';
        placeholder = 'ادبی اقتباس یا حوالہ...';
        break;
      case 'bullet':
        before = '\n• ';
        after = '';
        placeholder = 'نکتہ';
        break;
      case 'number':
        before = '\n۱. ';
        after = '';
        placeholder = 'پہلا نکتہ';
        break;
      case 'divider':
        before = '\n\n— — —\n\n';
        after = '';
        placeholder = '';
        break;
    }

    const textToInsert = selected || placeholder;
    const newContent = content.substring(0, start) + before + textToInsert + after + content.substring(end);
    onContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  return (
    <div className="relative flex flex-col h-full min-h-0 min-w-0 bg-[var(--bg-card)] overflow-hidden select-text">
      {/* Top Header / Metadata Bar */}
      {showMetadataHeader && (
      <div className="p-5 md:p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/70">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Title and Poet Inputs with Ample Nastaliq Breathing Space */}
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Title Input with Ample Nastaliq Breathing Space */}
            <div className="flex-1 relative flex items-center px-4 py-2 min-h-[74px] rounded-xl border border-[var(--border-subtle)]/70 hover:border-[var(--accent-gold)] focus-within:border-[var(--accent-gold)] focus-within:ring-2 focus-within:ring-[var(--accent-gold)]/20 bg-[var(--bg-card)]/80 transition-all shadow-2xs">
              <input
                id="poem-title-input"
                type="text"
                value={currentDraft.title}
                onChange={(e) => onTitleChange(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                placeholder={isProseMode ? 'عنوانِ مقالہ یا مضمون درج فرمائیں...' : 'عنوانِ کلام یا مطلع درج فرمائیں...'}
                dir="rtl"
                style={{
                  fontFamily: prefs.fontFamily,
                  lineHeight: 2.8,
                }}
                className="w-full bg-transparent border-none outline-none text-xl md:text-2xl font-bold text-[var(--text-primary)] text-right font-nastaliq placeholder-[var(--text-muted)]/40"
              />
            </div>

            {/* Poet / Author Input with Ample Breathing Space */}
            <div className="flex items-center gap-2 sm:w-64 px-4 py-2 min-h-[66px] rounded-xl border border-[var(--border-subtle)]/70 hover:border-[var(--accent-gold)] focus-within:border-[var(--accent-gold)] bg-[var(--bg-card)]/80 transition-all shadow-2xs">
              <Feather className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
              <input
                type="text"
                value={currentDraft.poet}
                onChange={(e) => onPoetChange(e.target.value)}
                onKeyDown={handlePoetKeyDown}
                placeholder={isProseMode ? 'مصنف کا نام...' : 'شاعر کا نام...'}
                style={{ fontFamily: prefs.fontFamily, lineHeight: 2.4 }}
                className="w-full bg-transparent border-none outline-none text-sm md:text-base text-[var(--text-secondary)] placeholder-[var(--text-muted)] text-right font-nastaliq px-2"
              />
            </div>
          </div>

          {/* Form Selector (Ghazal / Nazm / Rubai / Prose) */}
          <div className="flex items-center gap-1.5 self-end lg:self-center">
            {(
              [
                { id: 'ghazal', label: 'غزل' },
                { id: 'nazm', label: 'نظم' },
                { id: 'rubai', label: 'رباعی' },
                { id: 'prose', label: 'نثر / مضمون' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFormChange(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-nastaliq transition-all border ${
                  currentDraft.form === f.id
                    ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold shadow-2xs'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Meter & Radif Pill Tags (Only in poetry mode) */}
        {!isProseMode && effectiveShowAutoRhyme && (currentDraft.meterName || currentDraft.radif || detectedRhymeScheme) && (
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[var(--border-subtle)]/40 text-xs">
            {currentDraft.meterName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 font-nastaliq">
                <BookOpen className="w-3 h-3" />
                <span>{currentDraft.meterName}</span>
                {currentDraft.meterRukn && (
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">({currentDraft.meterRukn})</span>
                )}
              </span>
            )}
            {(currentDraft.radif || detectedRhymeScheme?.detectedRadif) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-nastaliq text-[11px]">
                <span>ردیف:</span>
                <span className="font-bold text-[var(--text-primary)]">{currentDraft.radif || detectedRhymeScheme?.detectedRadif}</span>
              </span>
            )}
            {detectedRhymeScheme?.detectedQafiyaWord && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-nastaliq text-[11px]">
                <span>قافیہ اساس:</span>
                <span className="font-bold">{detectedRhymeScheme.detectedQafiyaWord}</span>
                {detectedRhymeScheme.secondQafiyaWord && detectedRhymeScheme.secondQafiyaWord !== detectedRhymeScheme.detectedQafiyaWord && (
                  <span>/ {detectedRhymeScheme.secondQafiyaWord}</span>
                )}
              </span>
            )}
            {zameenReport && zameenReport.totalMatches > 0 && (
              <button
                type="button"
                data-testid="zameen-matcher-pill"
                onClick={() => setIsZameenModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/40 hover:bg-[var(--accent-gold)] hover:text-white transition-all font-nastaliq text-[11px] font-bold cursor-pointer shadow-2xs"
                title="اس زمین، ردیف یا بحر میں موجود کلاسیکی اساتذہ کی غزلیات اور قوافی کا مطالعہ کریں"
              >
                <Sparkles className="w-3 h-3" />
                <span>
                  ہم زمین کلامِ اساتذہ:{' '}
                  {zameenReport.poetSummary
                    .slice(0, 3)
                    .map((p) => `${p.takhallus}ؔ (${p.count})`)
                    .join('، ')}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
      )}

      {/* Editor Secondary Formatting Toolbar */}
      {showFormattingBar && (
      <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Modular Word Processor Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <WordProcessorToolbar
            textAlign={textAlign}
            onTextAlignChange={setTextAlign}
            onFormatAction={handleFormatAction}
            isProseMode={isProseMode}
          />

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5 hidden sm:block" />

          {/* Quick stanza templates (Poetry mode) / Paragraph helper (Prose mode) */}
          {!isProseMode ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onInsertCoupletTemplate('matla')}
                className="px-2 py-1 rounded text-xs font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
              >
                + مطلع
              </button>
              <button
                type="button"
                onClick={() => onInsertCoupletTemplate('sher')}
                className="px-2 py-1 rounded text-xs font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
              >
                + شعر
              </button>
              <button
                type="button"
                onClick={() => onInsertCoupletTemplate('maqta')}
                className="px-2 py-1 rounded text-xs font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
              >
                + مقطع
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleFormatAction('divider')}
                className="px-2 py-1 rounded text-xs font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
              >
                + نیا باب / وقفہ
              </button>
            </div>
          )}
        </div>

        {/* Live Scansion Toggle & Undo/Redo Controls */}
        <div className="flex items-center gap-2">
          {/* Sticky Toggle Checkbox for Live Scansion (Only shown for poetry) */}
          {!isProseMode && (
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-nastaliq cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-all select-none shadow-2xs">
              <input
                type="checkbox"
                checked={prefs.showLiveScansion}
                onChange={onToggleLiveScansion}
                className="w-3.5 h-3.5 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)] cursor-pointer"
              />
              <Activity className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="font-bold">نمائشِ تقطیع و اوزان</span>
            </label>
          )}

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5"></div>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded border border-[var(--border-subtle)] disabled:opacity-30 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="پچھلا عمل (Undo)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded border border-[var(--border-subtle)] disabled:opacity-30 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="اگلا عمل (Redo)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowErabToolbar(!showErabToolbar)}
            className={`px-2 py-1 rounded text-xs font-nastaliq border transition-colors ${
              showErabToolbar
                ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            اعراب تختی
          </button>

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5"></div>

          {/* Urdu Phonetic Keyboard Toggle & Guide */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="phonetic-keyboard-toggle-btn"
              onClick={togglePhoneticKeyboard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-nastaliq transition-all border ${
                isPhoneticEnabled
                  ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold shadow-[0_0_12px_rgba(230,175,46,0.35)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
              title="صوتی کی بورڈ آن / آف (شارٹ کٹ: Ctrl + Space یا Alt + K)"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{isPhoneticEnabled ? 'صوتی کی بورڈ: آن' : 'صوتی کی بورڈ: آف'}</span>
            </button>

            <button
              type="button"
              id="phonetic-keyboard-guide-btn"
              onClick={() => setIsKeyboardGuideOpen(true)}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="کی بورڈ گائیڈ (نقشہ)"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Erab Toolbar Component */}
      {effectiveShowErab && <ErabToolbar onInsertErab={onInsertErab} />}

      {/* Main Canvas Area */}
      {selection.selected.length > 0 && <div data-testid="line-selection-actions" role="toolbar" aria-label="منتخب مصرعے" className="absolute bottom-10 inset-x-4 z-30 flex flex-wrap items-center gap-3 px-4 py-2 text-xs bg-[var(--bg-card)] shadow-lg rounded-xl border border-[var(--accent-gold)] font-nastaliq">
        <span role="status">{selection.selected.length} مصرعے منتخب</span>
        <button onClick={() => void selection.copy()} className="underline">منتخب مصرعے نقل کریں</button>
        <button onClick={selection.remove} className="underline text-red-600">منتخب مصرعے حذف کریں</button>
        <button onClick={selection.clear} className="underline">انتخاب ختم کریں</button>
        {selection.notice && <span role="status">{selection.notice}</span>}
      </div>}
      {selection.box && <div data-testid="line-selection-box" aria-hidden="true" style={{ position: 'fixed', ...selection.box, pointerEvents: 'none', zIndex: 40, border: '1px solid var(--accent-gold)', background: 'rgba(180, 130, 40, .12)' }} />}
      <div
        ref={selection.container}
        tabIndex={0}
        aria-label="مصرعوں کا انتخاب — خالی جگہ سے ماؤس کھینچیں"
        onPointerDown={selection.onPointerDown}
        onPointerMove={selection.onPointerMove}
        onPointerUp={selection.onPointerUp}
        onPointerCancel={selection.onPointerCancel}
        onKeyDown={selection.onKeyDown}
        id="poetry-canvas-scroll-container"
        className="flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain p-4 md:p-8 bg-[var(--bg-canvas)]"
      >
        {!isProseMode && (effectiveShowLiveScansion || effectiveDiwanCouplets) ? (
          /* Live Per-Line / Couplet Display (Poetry Mode only) */
          <div
            className={`w-full ${paperWidthClass} mx-auto pb-12 ${
              effectiveDiwanCouplets
                ? 'grid grid-cols-1 xl:grid-cols-2 gap-3 items-start content-start'
                : 'flex flex-col space-y-3'
            }`}
          >
            {lines.map((line, idx) => {
              const trimmed = line.trim();
              const isBlank = !trimmed;
              const isSectionMarker = trimmed.startsWith('—');
              const showScansionForLine = effectiveShowLiveScansion && !isBlank && !isSectionMarker;
              const isCoupletSecond = idx % 2 === 1;
              const activeRadif =
                idx === 0 || isCoupletSecond
                  ? currentDraft.radif || detectedRhymeScheme?.detectedRadif
                  : undefined;
              const activeRhymeAnchor =
                idx === 0 || isCoupletSecond
                  ? detectedRhymeScheme?.detectedQafiyaWord
                  : undefined;

              return (
                <div
                  key={idx}
                  data-line-index={idx}
                  data-selected={selection.selected.includes(idx)}
                  style={selection.selected.includes(idx) ? { outline: '2px solid var(--accent-gold)', outlineOffset: '-2px', background: 'var(--bg-subtle)' } : undefined}
                  className={`flex flex-col transition-all rounded-xl p-3 ${
                    isSectionMarker
                      ? 'bg-[var(--bg-subtle)]/50 border border-dashed border-[var(--border-subtle)] text-center py-2 xl:col-span-2'
                      : !effectiveRuledLines
                      ? 'bg-transparent border border-transparent hover:border-[var(--border-subtle)]/40'
                      : isCoupletSecond
                      ? `bg-[var(--bg-card)]/80 border border-[var(--border-subtle)]/80 ${effectiveDiwanCouplets ? '' : 'mb-4'}`
                      : 'bg-[var(--bg-surface)]/60 border border-[var(--border-subtle)]/90'
                  }`}
                >
                  {/* Line Meta Header */}
                  {!isSectionMarker && effectiveShowLineNumbers && (
                    <div className="flex items-center justify-between text-[11px] font-nastaliq text-[var(--text-muted)] mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center font-mono text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>
                          {isCoupletSecond
                            ? `مصرع ثانیہ (شعر ${Math.floor(idx / 2) + 1})`
                            : `مصرع اولیٰ (شعر ${Math.floor(idx / 2) + 1})`}
                        </span>
                      </span>
                      {trimmed.length > 0 && (
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {trimmed.split(/\s+/).length} الفاظ
                        </span>
                      )}
                    </div>
                  )}

                  {/* Editable Line Input with generous Nastaliq padding */}
                  <input
                    id={`misra-input-${idx}`}
                    type="text"
                    value={line}
                    onChange={(e) => handleLineChange(idx, e.target.value)}
                    onKeyDown={(e) => handleLineKeyDown(idx, e)}
                    placeholder="مصرع تحریر فرمائیں..."
                    dir="rtl"
                    style={{
                      fontFamily: prefs.fontFamily,
                      fontSize: `${prefs.fontSize}px`,
                      lineHeight: prefs.lineHeight,
                      textAlign: textAlign === 'justify' ? 'right' : textAlign,
                    }}
                    className="w-full bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]/40 font-nastaliq py-2.5 px-4 leading-[2.6]"
                  />

                  {/* Per-Line Scansion Card with Interactive Syllable Repair */}
                  {showScansionForLine && (
                    <Suspense
                      fallback={
                        <div className="my-2 py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 text-xs font-nastaliq text-[var(--text-muted)]">
                          عروضی لغت اور تقطیع لوڈ ہو رہی ہے...
                        </div>
                      }
                    >
                      <LazyScansionCard
                        fontFamily={prefs.fontFamily}
                        lineText={line}
                        lineIndex={idx}
                        radif={activeRadif}
                        rhymeAnchorWord={activeRhymeAnchor}
                        onApplyLineChange={handleLineChange}
                      />
                    </Suspense>
                  )}
                </div>
              );
            })}

            {/* Quick Add Misra Button */}
            <div className={`flex items-center justify-center pt-2 ${effectiveDiwanCouplets ? 'xl:col-span-2' : ''}`}>
              <button
                type="button"
                onClick={handleAddMisra}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 font-nastaliq text-xs font-bold transition-all shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>نیا مصرع شامل کریں</span>
              </button>
            </div>
          </div>
        ) : (
          /* Continuous Manuscript & Prose Textarea Mode */
          <div className={`w-full ${paperWidthClass} mx-auto min-h-full flex flex-col`}>
            <textarea
              ref={textareaRef}
              value={currentDraft.content}
              onChange={(e) => onContentChange(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              onPaste={onPaste}
              onSelect={onSelect}
              placeholder={
                isProseMode
                  ? `یہاں اپنا نثری مقالہ، مضمون، افسانہ یا انشائیہ تحریر فرمائیں...\n\nپیراگراف، سرخیاں اور اقتباسات شامل کرنے کے لیے اوپر موجود ورڈ پروسیسر ٹولز کا استعمال فرمائیں۔`
                  : `یہاں اپنا کلام تحریر فرمائیں...\n\nمثال کے طور پر:\nگلوں میں رنگ بھرے بادِ نو بہار چلے\nچلے بھی آؤ کہ گلشن کا کاروبار چلے`
              }
              dir="rtl"
              style={{
                fontFamily: prefs.fontFamily,
                fontSize: `${prefs.fontSize}px`,
                lineHeight: prefs.lineHeight,
                textAlign: textAlign,
              }}
              className="w-full flex-1 min-h-[65vh] bg-transparent border-none outline-none resize-none text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:ring-0 leading-[2.6] px-6 py-4 font-nastaliq custom-scrollbar"
              rows={20}
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Bottom Live Statistics Bar */}
      {effectiveShowBottomStats && (
      <div className="h-9 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-xs text-[var(--text-muted)] select-none">
        <div className="flex items-center gap-4 font-nastaliq">
          {isProseMode ? (
            /* Prose Specific Statistics */
            <>
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-primary)] font-bold font-mono">{stats.words}</span>
                <span>الفاظ</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-primary)] font-bold font-mono">{stats.chars}</span>
                <span>حروف</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-primary)] font-bold font-mono">{stats.paragraphs || 1}</span>
                <span>پیراگراف</span>
              </div>
              <div className="flex items-center gap-1 hidden sm:flex">
                <span className="text-[var(--accent-gold)] font-bold font-mono">{stats.readingTimeMinutes || 1}</span>
                <span>منٹ مطالعہ</span>
              </div>
            </>
          ) : (
            /* Poetry Specific Statistics */
            <>
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-primary)] font-bold font-mono">{stats.couplets}</span>
                <span>اشعار</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-primary)] font-bold font-mono">{stats.misras}</span>
                <span>مصرعے</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-primary)] font-bold font-mono">{stats.words}</span>
                <span>الفاظ</span>
              </div>
              <div className="flex items-center gap-1 hidden sm:flex">
                <span className="text-[var(--text-primary)] font-bold font-mono">{stats.chars}</span>
                <span>حروف</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-nastaliq text-[var(--text-muted)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>مصرعے منتخب کرنے کے لیے خالی کنارے سے ماؤس کھینچیں</span>
        </div>
      </div>
      )}

      {/* Phonetic Keyboard Interactive Guide Modal */}
      <PhoneticKeyboardGuideModal
        isOpen={isKeyboardGuideOpen}
        onClose={() => setIsKeyboardGuideOpen(false)}
        isEnabled={isPhoneticEnabled}
        onToggle={togglePhoneticKeyboard}
      />

      {/* Classical Zameen Matcher Modal */}
      {zameenReport && (
        <ClassicalZameenModal
          isOpen={isZameenModalOpen}
          onClose={() => setIsZameenModalOpen(false)}
          report={zameenReport}
          fontFamily={prefs.fontFamily}
        />
      )}
    </div>
  );
};
