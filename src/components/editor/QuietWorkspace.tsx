import {
  useEffect,
  useState,
  useMemo,
  useRef,
  lazy,
  Suspense,
  type RefObject,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { ArrowRight, Maximize2, Columns2, PanelTop, PanelLeft, Sliders, BookOpen } from 'lucide-react';
import type { PoemDraft } from '../../types/editor';
import type { WorkspacePrefs } from '../../types/workspace';
import { translateKeyToUrdu } from '../../utils/phoneticKeymap';
import { CreatorCredit } from '../common/CreatorCredit';
import { ResizableDivider } from '../common/ResizableDivider';
import { UnifiedRhymeView } from '../qafiya/UnifiedRhymeView';
import type { PersistenceState } from '../../hooks/usePoemEditor';

const LazyVisualSlotRhymeBuilder = lazy(() =>
  import('../companion/VisualSlotRhymeBuilder').then((m) => ({
    default: m.VisualSlotRhymeBuilder,
  }))
);

interface Props {
  draft: PoemDraft;
  prefs: WorkspacePrefs;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (content: string) => void;
  onRhymesChange: (words: string[]) => void;
  onExit: () => void;
  onToggleSplit: () => void;
  onOpenDiwan?: () => void;
  saveState: PersistenceState;
  onRetry: () => void;
  storageDamaged: boolean;
}

export function QuietWorkspace({
  draft,
  prefs,
  textareaRef,
  onChange,
  onRhymesChange,
  onExit,
  onToggleSplit,
  onOpenDiwan,
  saveState,
  onRetry,
  storageDamaged,
}: Props) {
  const split = prefs.activePreset === 'quiet_rhymes';
  const [rhymePosition, setRhymePosition] = useState<'left' | 'top'>('left');
  const [showSlotBuilder, setShowSlotBuilder] = useState(false);

  // Controllable split percentages so the poet can drag dividers freely
  const [writingWidthPct, setWritingWidthPct] = useState<number>(70); // Default 70% writing / 30% left
  const [topRhymeHeightPct, setTopRhymeHeightPct] = useState<number>(24); // Default 24% top rhyme bar height
  const [leftSlotHeightPct, setLeftSlotHeightPct] = useState<number>(58); // Default 58% slot / 42% rhymes when stacked on left

  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const columnsContainerRef = useRef<HTMLDivElement | null>(null);
  const leftColumnRef = useRef<HTMLDivElement | null>(null);

  const [rhymeWords, setRhymeWords] = useState<string[]>(draft.qafiyaList);
  const [fullscreenError, setFullscreenError] = useState('');
  const [phonetic, setPhonetic] = useState(() => {
    try {
      return localStorage.getItem('likho_phonetic_keyboard') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const toggle = (event: globalThis.KeyboardEvent) => {
      if (
        (event.ctrlKey && event.code === 'Space') ||
        (event.altKey && event.key.toLowerCase() === 'k')
      ) {
        event.preventDefault();
        setPhonetic((previous) => {
          try {
            localStorage.setItem('likho_phonetic_keyboard', String(!previous));
          } catch {
            /* Typing remains available for this session. */
          }
          return !previous;
        });
      }
    };
    window.addEventListener('keydown', toggle);
    return () => window.removeEventListener('keydown', toggle);
  }, []);

  const phoneticKey = (
    event: ReactKeyboardEvent<HTMLTextAreaElement>,
    text: string,
    update: (text: string) => void
  ) => {
    if (!phonetic || event.nativeEvent.isComposing) return;
    const character = translateKeyToUrdu(event);
    if (!character) return;
    event.preventDefault();
    const input = event.currentTarget,
      start = input.selectionStart,
      end = input.selectionEnd;
    update(text.slice(0, start) + character + text.slice(end));
    requestAnimationFrame(() =>
      input.setSelectionRange(start + character.length, start + character.length)
    );
  };

  const normalizedRhymeWords = useMemo(
    () => [...new Set(rhymeWords.map((w) => w.trim()).filter(Boolean))],
    [rhymeWords]
  );

  const handleUpdateRhymesList = (nextWords: string[]) => {
    const clean = [...new Set(nextWords.map((w) => w.trim()).filter(Boolean))];
    setRhymeWords(clean);
    onRhymesChange(clean);
  };

  const handleAddRhymesFromSlot = (newWords: string[]) => {
    const merged = [
      ...new Set([...normalizedRhymeWords, ...newWords.map((w) => w.trim()).filter(Boolean)]),
    ];
    setRhymeWords(merged);
    onRhymesChange(merged);
    if (!split) {
      onToggleSplit();
    }
  };

  const handleInsertRhymeAtCursor = (word: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(draft.content ? `${draft.content} ${word}` : word);
      return;
    }
    const start = el.selectionStart ?? draft.content.length;
    const end = el.selectionEnd ?? draft.content.length;
    const next = draft.content.slice(0, start) + word + draft.content.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + word.length, start + word.length);
    });
  };

  useEffect(() => {
    setRhymeWords(draft.qafiyaList);
  }, [draft.id, draft.qafiyaList]);

  useEffect(() => {
    const exit = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.isComposing) {
        event.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', exit);
    return () => window.removeEventListener('keydown', exit);
  }, [onExit]);

  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setFullscreenError('');
    } catch {
      setFullscreenError('پوری سکرین دستیاب نہیں؛ تحریر جاری رکھ سکتے ہیں۔');
    }
  };

  const textStyle = {
    fontFamily: prefs.fontFamily,
    fontSize: prefs.fontSize,
    lineHeight: Math.max(2.6, prefs.lineHeight),
  };

  const showLeftRhymes = split && rhymePosition === 'left';
  const showTopRhymes = split && rhymePosition === 'top';
  const hasLeftColumn = showLeftRhymes || showSlotBuilder;

  return (
    <main
      dir="rtl"
      lang="ur"
      data-testid="quiet-workspace"
      className="h-screen w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col"
    >
      {/* Top Floating Bar: Navigation + Two Checkboxes (1. Rhyming Top/Left, 2. Slot Builder) */}
      <div className="fixed top-2 right-3 left-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-subtle)] shadow-xs opacity-80 hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            aria-label="اسٹوڈیو میں واپس (Esc)"
            title="اسٹوڈیو میں واپس (Esc)"
            onClick={onExit}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]"
          >
            <ArrowRight size={16} />
          </button>
          <button
            aria-label={split ? 'صرف تحریر' : 'تحریر و قوافی'}
            title={split ? 'صرف تحریر' : 'تحریر و قوافی — 70 / 30'}
            onClick={onToggleSplit}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]"
          >
            <Columns2 size={16} />
          </button>
          <button
            aria-label="پوری سکرین"
            title="پوری سکرین"
            onClick={fullscreen}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]"
          >
            <Maximize2 size={16} />
          </button>

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

          {/* Checkbox 1: Rhyming (قوافی) with Top / Left selector */}
          <label
            data-testid="quiet-rhyming-checkbox-label"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg cursor-pointer text-xs font-nastaliq select-none hover:bg-[var(--bg-subtle)]"
          >
            <input
              type="checkbox"
              data-testid="quiet-rhyming-checkbox"
              checked={split}
              onChange={onToggleSplit}
              className="w-3.5 h-3.5 rounded accent-[var(--accent-gold)] cursor-pointer"
            />
            <span className="font-bold">قوافی</span>
          </label>

          {split && (
            <div
              data-testid="quiet-rhyme-position-toggle"
              className="flex items-center gap-0.5 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[11px] font-nastaliq"
            >
              <button
                type="button"
                onClick={() => setRhymePosition('left')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                  rhymePosition === 'left'
                    ? 'bg-[var(--accent-gold)] text-white font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="قوافی بائیں کالم میں اوپر سے نیچے دکھائیں"
              >
                <PanelLeft className="w-3 h-3" />
                <span>بائیں (ستون)</span>
              </button>
              <button
                type="button"
                onClick={() => setRhymePosition('top')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                  rhymePosition === 'top'
                    ? 'bg-[var(--accent-gold)] text-white font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="قوافی اوپر دائیں سے بائیں قطاروں میں دکھائیں"
              >
                <PanelTop className="w-3 h-3" />
                <span>اوپر (قطاریں)</span>
              </button>
            </div>
          )}

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

          {/* Checkbox 2: Slot Rhyme Builder (قالب ساز) */}
          <label
            data-testid="quiet-slot-checkbox-label"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg cursor-pointer text-xs font-nastaliq select-none hover:bg-[var(--bg-subtle)]"
          >
            <input
              type="checkbox"
              data-testid="quiet-slot-checkbox"
              checked={showSlotBuilder}
              onChange={(e) => setShowSlotBuilder(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-[var(--accent-gold)] cursor-pointer"
            />
            <Sliders className="w-3 h-3 text-[var(--accent-gold)]" />
            <span className="font-bold">قالب ساز (Slot)</span>
          </label>

          {onOpenDiwan && (
            <>
              <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />
              <button
                type="button"
                data-testid="quiet-open-diwan-btn"
                onClick={onOpenDiwan}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-nastaliq font-bold text-[var(--text-primary)] hover:bg-[var(--accent-gold)]/15 transition-colors"
                title="دیوانِ اساتذہ — دس کلاسیکی اساتذۂ سخن کا مفت کلام"
              >
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>دیوانِ اساتذہ</span>
              </button>
            </>
          )}
        </div>
      </div>

      {(storageDamaged || saveState === 'session-only' || saveState === 'failed') && (
        <div
          role="alert"
          className="text-sm text-amber-700 dark:text-amber-300 px-5 py-3 pt-14 font-nastaliq flex-shrink-0"
        >
          {storageDamaged
            ? 'اصل ذخیرہ محفوظ رکھا گیا ہے۔ بازیابی کے لیے اسٹوڈیو میں واپس جائیں۔'
            : 'تبدیلیاں صرف اس نشست میں ہیں۔ متن نقل کر لیں یا دوبارہ محفوظ کریں۔'}
          <button onClick={storageDamaged ? onExit : onRetry} className="underline mx-3">
            {storageDamaged ? 'بازیابی' : 'دوبارہ کوشش'}
          </button>
        </div>
      )}
      {fullscreenError && (
        <p role="status" className="pt-14 px-5 text-xs flex-shrink-0">
          {fullscreenError}
        </p>
      )}

      {/* Main Vertical Stack Container (for Top Rhymes + Horizontal Resizable Divider + Workspace Columns) */}
      <div
        ref={mainContainerRef}
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        {/* TOP RHYMES MODE: Single Unified Rhyme View in Right-to-Left Rows + Draggable Horizontal Divider */}
        {showTopRhymes && (
          <>
            <aside
              data-testid="quiet-rhyme-top-bar"
              style={{ height: `${topRhymeHeightPct}%` }}
              className="w-full min-h-[96px] pt-12 flex flex-col overflow-hidden flex-shrink-0"
            >
              <UnifiedRhymeView
                rhymeWords={normalizedRhymeWords}
                poemContent={draft.content}
                placement="top"
                fontFamily={prefs.fontFamily}
                fontSize={prefs.fontSize}
                onChangeRhymes={handleUpdateRhymesList}
                onSelectRhyme={handleInsertRhymeAtCursor}
                hiddenTextareaLabel="ذاتی قوافی"
              />
            </aside>

            <ResizableDivider
              orientation="horizontal"
              isLocked={false}
              onResize={(pct) => setTopRhymeHeightPct(Math.max(14, Math.min(65, pct)))}
              containerRef={mainContainerRef}
            />
          </>
        )}

        {/* Columns Area: Right Writing Column + Draggable Vertical Divider + Left Rhymes/Slot Column */}
        <div
          ref={columnsContainerRef}
          className="flex flex-1 min-h-0 overflow-hidden"
          data-testid="quiet-columns"
        >
          {/* Right Writing Column */}
          <section
            data-testid="quiet-writing-column"
            style={{ width: hasLeftColumn ? `${writingWidthPct}%` : '100%' }}
            className="min-w-0 h-full flex flex-col overflow-hidden"
          >
            <textarea
              ref={textareaRef}
              aria-label="خاموش تحریر"
              value={draft.content}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => phoneticKey(e, draft.content, onChange)}
              dir="rtl"
              spellCheck={false}
              style={textStyle}
              autoFocus
              className={`w-full h-full resize-none bg-transparent outline-none border-0 px-8 md:px-16 ${
                showTopRhymes ? 'pt-6' : 'pt-16'
              } pb-16 text-right selection:bg-amber-200/50 overflow-y-auto custom-scrollbar overscroll-contain`}
            />
          </section>

          {/* Controllable Vertical Divider + Left Column (for Left Rhymes and/or Slot Builder) */}
          {hasLeftColumn && (
            <>
              <ResizableDivider
                orientation="vertical"
                isLocked={false}
                onResize={(pct) => setWritingWidthPct(Math.max(30, Math.min(82, pct)))}
                containerRef={columnsContainerRef}
              />

              <aside
                ref={leftColumnRef}
                data-testid={showLeftRhymes ? 'quiet-rhyme-column' : 'quiet-slot-column'}
                style={{ width: `${100 - writingWidthPct}%` }}
                className={`min-w-0 h-full bg-[var(--bg-card)]/30 flex flex-col overflow-hidden ${
                  showTopRhymes ? 'pt-0' : 'pt-12'
                }`}
              >
                {/* Case A: Both Slot Builder and Left Rhymes are active -> stacked with a draggable horizontal divider */}
                {showSlotBuilder && showLeftRhymes && (
                  <>
                    <div
                      style={{ height: `${leftSlotHeightPct}%` }}
                      className="min-h-0 flex flex-col overflow-hidden"
                    >
                      <Suspense
                        fallback={
                          <div className="p-4 text-xs font-nastaliq text-[var(--text-muted)]">
                            قالب ساز لوڈ ہو رہا ہے...
                          </div>
                        }
                      >
                        <LazyVisualSlotRhymeBuilder
                          onLoadToTray={handleAddRhymesFromSlot}
                          fontFamily={prefs.fontFamily}
                        />
                      </Suspense>
                    </div>

                    <ResizableDivider
                      orientation="horizontal"
                      isLocked={false}
                      onResize={(pct) => setLeftSlotHeightPct(Math.max(25, Math.min(78, pct)))}
                      containerRef={leftColumnRef}
                    />

                    <div
                      style={{ height: `${100 - leftSlotHeightPct}%` }}
                      className="min-h-0 flex flex-col overflow-hidden"
                    >
                      <UnifiedRhymeView
                        rhymeWords={normalizedRhymeWords}
                        poemContent={draft.content}
                        placement="left"
                        fontFamily={prefs.fontFamily}
                        fontSize={prefs.fontSize}
                        onChangeRhymes={handleUpdateRhymesList}
                        onSelectRhyme={handleInsertRhymeAtCursor}
                        hiddenTextareaLabel="ذاتی قوافی"
                      />
                    </div>
                  </>
                )}

                {/* Case B: Only Left Rhymes is active -> Single clean Top-to-Bottom Column(s) Rhyme View */}
                {!showSlotBuilder && showLeftRhymes && (
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                    <UnifiedRhymeView
                      rhymeWords={normalizedRhymeWords}
                      poemContent={draft.content}
                      placement="left"
                      fontFamily={prefs.fontFamily}
                      fontSize={prefs.fontSize}
                      onChangeRhymes={handleUpdateRhymesList}
                      onSelectRhyme={handleInsertRhymeAtCursor}
                      hiddenTextareaLabel="ذاتی قوافی"
                    />
                  </div>
                )}

                {/* Case C: Only Slot Builder is active (with Rhymes either unchecked or on Top) */}
                {showSlotBuilder && !showLeftRhymes && (
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                    <Suspense
                      fallback={
                        <div className="p-4 text-xs font-nastaliq text-[var(--text-muted)]">
                          قالب ساز لوڈ ہو رہا ہے...
                        </div>
                      }
                    >
                      <LazyVisualSlotRhymeBuilder
                        onLoadToTray={handleAddRhymesFromSlot}
                        fontFamily={prefs.fontFamily}
                      />
                    </Suspense>
                  </div>
                )}
              </aside>
            </>
          )}
        </div>
      </div>

      <CreatorCredit />
    </main>
  );
}
