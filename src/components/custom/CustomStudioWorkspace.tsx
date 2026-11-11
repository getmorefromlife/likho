import React, { useState, useRef } from 'react';
import {
  Sliders,
  Columns2,
  Columns3,
  Rows2,
  Grid2x2,
  Square,
  PanelTop,
  CheckSquare,
  Sparkles,
  BookOpen,
  Feather,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import type { PoemDraft, PoeticForm } from '../../types/editor';
import type {
  WorkspacePrefs,
  CustomViewConfig,
  CustomGridDivision,
  CustomPaneWidgetId,
  CustomPaperWidth,
} from '../../types/workspace';
import { DEFAULT_CUSTOM_CONFIG } from '../../hooks/useWorkspacePrefs';
import { PoetryCanvas } from '../editor/PoetryCanvas';
import { RhymeTreasuryTab } from '../companion/RhymeTreasuryTab';
import { VisualSlotRhymeBuilder } from '../companion/VisualSlotRhymeBuilder';
import { UnifiedRhymeView } from '../qafiya/UnifiedRhymeView';
import { ResizableDivider } from '../common/ResizableDivider';
import { ProsodyTab } from '../companion/ProsodyTab';
import { ThesaurusTab } from '../companion/ThesaurusTab';
import { RhetoricTab } from '../companion/RhetoricTab';
import { PortfolioTab } from '../companion/PortfolioTab';
import { translateKeyToUrdu } from '../../utils/phoneticKeymap';

const SCRATCHPAD_STORAGE_KEY = 'qalam_poet_scratchpad_v1';

interface CustomStudioWorkspaceProps {
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
  selectedWord: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onTitleChange: (title: string) => void;
  onPoetChange: (poet: string) => void;
  onFormChange: (form: PoeticForm) => void;
  onMeterChange: (name: string, rukn: string) => void;
  onContentChange: (content: string) => void;
  onQafiyaListChange: (words: string[]) => void;
  onLoadRhymesToTray: (words: string[]) => void;
  onInsertErab: (char: string) => void;
  onInsertCoupletTemplate: (type: 'matla' | 'sher' | 'maqta') => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onSelect: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  onToggleLiveScansion: () => void;
  onSelectDraft: (draft: PoemDraft) => void;
  onDeleteDraft?: (id: string) => boolean;
  onPortfolioRestored: (drafts: PoemDraft[]) => void;
  onUpdateCustomConfig: (patch: Partial<CustomViewConfig>) => void;
  onExitCustom: () => void;
}

export const DIVISION_OPTIONS: {
  id: CustomGridDivision;
  label: string;
  subtitle: string;
  panes: number;
}[] = [
  { id: 'single', label: 'یکتا ورق (۱ خانہ)', subtitle: 'پوری اسکرین پر ایک منتخب منظر', panes: 1 },
  { id: 'two_cols', label: 'دو کالم (دائیں بائیں)', subtitle: 'دو ستون — تناسب خود طے کریں', panes: 2 },
  { id: 'three_cols', label: 'تین کالم (سہ ستونی)', subtitle: 'دائیں، درمیان اور بائیں تین خانے', panes: 3 },
  { id: 'two_rows', label: 'دو قطاریں (اوپر نیچے)', subtitle: 'بالائی اور زیریں افقی تقسیم', panes: 2 },
  { id: 't_split', label: 'ٹی تقسیم (۱ اوپر + ۲ نیچے)', subtitle: 'اوپر چوڑا خانہ، نیچے دو ستون', panes: 3 },
  { id: 'quad_grid', label: 'چہار خانہ (۲×۲ گرڈ)', subtitle: 'چاروں خانے بیک وقت اسکرین پر', panes: 4 },
];

export const PANE_WIDGET_OPTIONS: {
  id: CustomPaneWidgetId;
  label: string;
  badge: string;
}[] = [
  { id: 'editor', label: 'مسودۂ کلام (مرکزی مدیر و تقطیع)', badge: 'تحریر' },
  { id: 'raw_sheet', label: 'سادہ کاغذ (صرف تحریر — بغیر حاشیہ)', badge: 'سادہ ورق' },
  { id: 'diwan_preview', label: 'روایتی دیوان منظر (شعر بہ شعر آمنے سامنے)', badge: 'دیوان' },
  { id: 'qafiya_search', label: 'خزانۂ قوافی (۵۸،۶۰۴ الفاظ کی تلاش)', badge: 'قافیہ تلاش' },
  { id: 'slot_builder', label: 'قالب سازِ قوافی (حروف کے خانے اور تہجی انتخاب)', badge: 'قالب ساز' },
  { id: 'qafiya_pad', label: 'ذاتی قوافی پیڈ (فوری فہرست)', badge: 'ذاتی قوافی' },
  { id: 'prosody', label: 'عروضی تقطیع اور بحر کی تشخیص', badge: 'عروض' },
  { id: 'lugat', label: 'لغت اور مترادفات (تھیسارس)', badge: 'لغت' },
  { id: 'rhetoric', label: 'صنائع بدائع (علمِ بیان و بدیع)', badge: 'صنائع' },
  { id: 'scratchpad', label: 'تخلیقی بیاض (گرہ، ادھورے مصرعے اور نوٹس)', badge: 'بیاض' },
  { id: 'portfolio', label: 'محفوظ کلام اور مسودات', badge: 'مسودات' },
];

export const FEATURE_CHECKBOX_ITEMS: {
  key: keyof Pick<
    CustomViewConfig,
    | 'showTopNavBar'
    | 'showQafiyaTray'
    | 'showSlotRhymeBuilder'
    | 'showTitleAndMetadata'
    | 'showWordProcessorToolbar'
    | 'showErabToolbar'
    | 'showAutoRhymeBanner'
    | 'showLiveScansionCards'
    | 'showLineNumbers'
    | 'showCoupletDiwanLayout'
    | 'showRuledLines'
    | 'showBottomStatsBar'
    | 'showFloatingQuickBar'
  >;
  label: string;
  desc: string;
}[] = [
  { key: 'showTopNavBar', label: 'بالائی نیویگیشن پٹی', desc: 'ایپ کا اوپری ہیڈر، خطاطی، موضوع اور برآمد بٹن' },
  { key: 'showQafiyaTray', label: 'قوافی (اوپر یا بائیں)', desc: 'منتخب قوافی کی پٹی اوپر یا بائیں کالم میں دکھائیں' },
  { key: 'showSlotRhymeBuilder', label: 'قالب سازِ قوافی (Slot Builder)', desc: 'حروف کے خانوں اور حروفِ تہجی سے فوری قوافی منتخب کریں' },
  { key: 'showTitleAndMetadata', label: 'عنوان، شاعر اور صنفِ سخن', desc: 'کلام کا عنوان، تخلص اور غزل/نظم/رباعی انتخاب' },
  { key: 'showWordProcessorToolbar', label: 'تدوین اور صوتی کی بورڈ پٹی', desc: 'الائنمنٹ، مطلع/شعر بٹن، اَن ڈو اور صوتی کی بورڈ' },
  { key: 'showErabToolbar', label: 'اعراب تختی (زبر، زیر، پیش، تشدید)', desc: 'تلفظ کی وضاحت کے لیے اعراب لگانے کی پٹی' },
  { key: 'showAutoRhymeBanner', label: 'خودکار قافیہ و ردیف پٹی', desc: 'مطلع سے شناخت شدہ قافیہ اساس اور ردیف کا ٹیگ' },
  { key: 'showLiveScansionCards', label: 'مصرع بہ مصرع فوری تقطیع کارڈز', desc: 'ہر مصرعے کے نیچے ارکان، علامات (- / =) اور الفاظ کے اختیارات' },
  { key: 'showLineNumbers', label: 'مصرع اور شعر نمبر شمار', desc: 'ہر مصرعے کے اوپر نمبر اور الفاظ کی تعداد' },
  { key: 'showCoupletDiwanLayout', label: 'روایتی دیوان طرز (دو مصرعے آمنے سامنے)', desc: 'مصرع اولیٰ دائیں اور مصرع ثانیہ بائیں کالم میں' },
  { key: 'showRuledLines', label: 'مصرع کارڈز کے حاشیے اور لکیریں', desc: 'مصرعوں کے گرد کارڈ بارڈر یا بالکل سادہ کاغذ' },
  { key: 'showBottomStatsBar', label: 'اشعار، مصرعے اور الفاظ کا شمار (فوٹر)', desc: 'نچلی پٹی میں اشعار، مصرعوں اور الفاظ کی کل تعداد' },
  { key: 'showFloatingQuickBar', label: 'تیرتا ہوا من پسند کنٹرول بٹن', desc: 'کسی بھی وقت ترتیبات کھولنے کے لیے فوری بٹن' },
];

export const CustomStudioWorkspace: React.FC<CustomStudioWorkspaceProps> = ({
  currentDraft,
  textareaRef,
  prefs,
  stats,
  selectedWord,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onTitleChange,
  onPoetChange,
  onFormChange,
  onMeterChange,
  onContentChange,
  onQafiyaListChange,
  onLoadRhymesToTray,
  onInsertErab,
  onInsertCoupletTemplate,
  onPaste,
  onSelect,
  onToggleLiveScansion,
  onSelectDraft,
  onDeleteDraft,
  onPortfolioRestored,
  onUpdateCustomConfig,
  onExitCustom,
}) => {
  const cc = prefs.customConfig;
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(true);
  const [topRhymeHeightPct, setTopRhymeHeightPct] = useState(24);
  const [leftDockWidthPct, setLeftDockWidthPct] = useState(32);
  const [leftSlotSplitPct, setLeftSlotSplitPct] = useState(58);
  const verticalStackRef = useRef<HTMLDivElement | null>(null);
  const horizontalSplitRef = useRef<HTMLDivElement | null>(null);
  const leftDockStackRef = useRef<HTMLDivElement | null>(null);
  const [scratchpadText, setScratchpadText] = useState<string>(() => {
    try {
      return localStorage.getItem(SCRATCHPAD_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const handleScratchpadChange = (val: string) => {
    setScratchpadText(val);
    try {
      localStorage.setItem(SCRATCHPAD_STORAGE_KEY, val);
    } catch {
      // ignore
    }
  };

  const handlePhoneticKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    currentVal: string,
    updater: (next: string) => void
  ) => {
    let phoneticOn = false;
    try {
      phoneticOn = localStorage.getItem('likho_phonetic_keyboard') === 'true';
    } catch {
      phoneticOn = false;
    }
    if (!phoneticOn || e.nativeEvent.isComposing) return;
    const mapped = translateKeyToUrdu(e);
    if (!mapped) return;
    e.preventDefault();
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    updater(currentVal.slice(0, start) + mapped + currentVal.slice(end));
    requestAnimationFrame(() => {
      target.setSelectionRange(start + mapped.length, start + mapped.length);
    });
  };

  const applyQuickTemplate = (
    templateId: 'writing_only' | 'diwan' | 'poet_rhyme' | 'three_col' | 'quad_studio' | 'full_all'
  ) => {
    switch (templateId) {
      case 'writing_only':
        onUpdateCustomConfig({
          division: 'single',
          pane1: 'editor',
          paperWidth: 'book',
          showTopNavBar: false,
          showQafiyaTray: false,
          showTitleAndMetadata: false,
          showWordProcessorToolbar: false,
          showErabToolbar: false,
          showAutoRhymeBanner: false,
          showLiveScansionCards: false,
          showLineNumbers: false,
          showCoupletDiwanLayout: false,
          showRuledLines: false,
          showBottomStatsBar: false,
          showFloatingQuickBar: true,
        });
        break;
      case 'diwan':
        onUpdateCustomConfig({
          division: 'single',
          pane1: 'editor',
          paperWidth: 'wide',
          showTopNavBar: true,
          showQafiyaTray: false,
          showTitleAndMetadata: true,
          showWordProcessorToolbar: true,
          showErabToolbar: false,
          showAutoRhymeBanner: true,
          showLiveScansionCards: true,
          showLineNumbers: true,
          showCoupletDiwanLayout: true,
          showRuledLines: true,
          showBottomStatsBar: true,
          showFloatingQuickBar: true,
        });
        break;
      case 'poet_rhyme':
        onUpdateCustomConfig({
          division: 'two_cols',
          colSplitPct: 68,
          pane1: 'editor',
          pane2: 'qafiya_search',
          paperWidth: 'book',
          showTopNavBar: true,
          showQafiyaTray: true,
          showTitleAndMetadata: true,
          showWordProcessorToolbar: true,
          showLiveScansionCards: true,
          showCoupletDiwanLayout: false,
        });
        break;
      case 'three_col':
        onUpdateCustomConfig({
          division: 'three_cols',
          pane1: 'scratchpad',
          pane2: 'editor',
          pane3: 'qafiya_search',
          paperWidth: 'full',
          showTopNavBar: true,
          showQafiyaTray: false,
          showTitleAndMetadata: true,
          showLiveScansionCards: true,
        });
        break;
      case 'quad_studio':
        onUpdateCustomConfig({
          division: 'quad_grid',
          colSplitPct: 58,
          rowSplitPct: 58,
          pane1: 'editor',
          pane2: 'qafiya_search',
          pane3: 'prosody',
          pane4: 'scratchpad',
          paperWidth: 'full',
          showTopNavBar: true,
          showQafiyaTray: false,
        });
        break;
      case 'full_all':
        onUpdateCustomConfig(DEFAULT_CUSTOM_CONFIG);
        break;
    }
  };

  const renderWidgetPane = (widgetId: CustomPaneWidgetId, slotNumber: number) => {
    switch (widgetId) {
      case 'editor':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <PoetryCanvas
              currentDraft={currentDraft}
              textareaRef={textareaRef}
              prefs={prefs}
              stats={stats}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={onUndo}
              onRedo={onRedo}
              onTitleChange={onTitleChange}
              onPoetChange={onPoetChange}
              onFormChange={onFormChange}
              onContentChange={onContentChange}
              onInsertErab={onInsertErab}
              onInsertCoupletTemplate={onInsertCoupletTemplate}
              onPaste={onPaste}
              onSelect={onSelect}
              onToggleLiveScansion={onToggleLiveScansion}
            />
          </div>
        );

      case 'raw_sheet':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col bg-[var(--bg-canvas)] p-6 md:p-12 overflow-y-auto custom-scrollbar overscroll-contain">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)]/40 text-xs text-[var(--text-muted)] font-nastaliq flex-shrink-0">
              <span>سادہ ورق (خالص تحریر — خانہ {slotNumber})</span>
              <span>{stats.misras} مصرعے · {stats.words} الفاظ</span>
            </div>
            <textarea
              value={currentDraft.content}
              onChange={(e) => onContentChange(e.target.value)}
              onKeyDown={(e) => handlePhoneticKeyDown(e, currentDraft.content, onContentChange)}
              dir="rtl"
              spellCheck={false}
              placeholder="یہاں مکمل یکسوئی کے ساتھ اپنا کلام تحریر فرمائیں..."
              style={{
                fontFamily: prefs.fontFamily,
                fontSize: `${prefs.fontSize}px`,
                lineHeight: Math.max(2.6, prefs.lineHeight),
              }}
              className="w-full flex-1 min-h-[360px] resize-none bg-transparent border-0 outline-none text-right font-nastaliq text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 custom-scrollbar"
            />
          </div>
        );

      case 'diwan_preview': {
        const nonEmptyLines = currentDraft.content
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l && !l.startsWith('—'));
        const couplets: [string, string][] = [];
        for (let i = 0; i < nonEmptyLines.length; i += 2) {
          couplets.push([nonEmptyLines[i] || '', nonEmptyLines[i + 1] || '']);
        }
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col bg-[var(--bg-canvas)] p-6 overflow-y-auto custom-scrollbar overscroll-contain">
            <div className="text-center pb-4 mb-5 border-b border-[var(--accent-gold)]/30 flex-shrink-0">
              <h2
                style={{ fontFamily: prefs.fontFamily }}
                className="text-2xl font-bold text-[var(--text-primary)] font-nastaliq leading-[2.4]"
              >
                {currentDraft.title || 'دیوانِ کلام'}
              </h2>
              {currentDraft.poet && (
                <p className="text-sm text-[var(--accent-gold)] font-nastaliq mt-1">
                  {currentDraft.poet}
                </p>
              )}
            </div>
            {couplets.length === 0 ? (
              <p className="text-center text-sm text-[var(--text-muted)] font-nastaliq py-12">
                اشعار لکھنے پر یہاں روایتی دیوان کی صورت میں آمنے سامنے نظر آئیں گے۔
              </p>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto w-full pb-10">
                {couplets.map(([m1, m2], cIdx) => (
                  <div
                    key={cIdx}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--bg-card)]/80 border border-[var(--border-subtle)] shadow-2xs"
                  >
                    <div
                      style={{ fontFamily: prefs.fontFamily, fontSize: `${prefs.fontSize}px`, lineHeight: 2.5 }}
                      className="text-right font-nastaliq text-[var(--text-primary)] border-b md:border-b-0 md:border-l border-[var(--border-subtle)]/50 pb-2 md:pb-0 md:pl-4"
                    >
                      {m1}
                    </div>
                    <div
                      style={{ fontFamily: prefs.fontFamily, fontSize: `${prefs.fontSize}px`, lineHeight: 2.5 }}
                      className="text-right font-nastaliq text-[var(--text-primary)]"
                    >
                      {m2 || <span className="text-xs text-[var(--text-muted)]">(مصرع ثانیہ زیرِ تحریر...)</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'qafiya_search':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain bg-[var(--bg-card)]">
            <RhymeTreasuryTab
              selectedWord={selectedWord}
              poemContent={currentDraft.content}
              onLoadToTray={onLoadRhymesToTray}
              fontFamily={prefs.fontFamily}
            />
          </div>
        );

      case 'slot_builder':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain bg-[var(--bg-card)]">
            <VisualSlotRhymeBuilder
              initialWord={selectedWord || 'ایمان'}
              onLoadToTray={onLoadRhymesToTray}
              fontFamily={prefs.fontFamily}
            />
          </div>
        );

      case 'qafiya_pad':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-hidden bg-[var(--bg-card)]">
            <UnifiedRhymeView
              rhymeWords={currentDraft.qafiyaList}
              poemContent={currentDraft.content}
              placement="left"
              fontFamily={prefs.fontFamily}
              fontSize={prefs.fontSize}
              onChangeRhymes={onQafiyaListChange}
              onSelectRhyme={(word) =>
                onContentChange(currentDraft.content ? `${currentDraft.content} ${word}` : word)
              }
            />
          </div>
        );

      case 'prosody':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain bg-[var(--bg-card)]">
            <ProsodyTab
              currentMeterName={currentDraft.meterName}
              onSelectMeter={onMeterChange}
              fontFamily={prefs.fontFamily}
            />
          </div>
        );

      case 'lugat':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain bg-[var(--bg-card)]">
            <ThesaurusTab selectedWord={selectedWord} fontFamily={prefs.fontFamily} />
          </div>
        );

      case 'rhetoric':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain bg-[var(--bg-card)]">
            <RhetoricTab fontFamily={prefs.fontFamily} />
          </div>
        );

      case 'scratchpad':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col bg-[var(--bg-card)] p-4 overflow-y-auto custom-scrollbar overscroll-contain">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] flex-shrink-0">
              <span className="text-sm font-bold font-nastaliq text-[var(--accent-gold)] flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5" />
                <span>تخلیقی بیاض (رف نوٹس، گرہ اور ادھورے مصرعے)</span>
              </span>
              <span className="text-[11px] font-nastaliq text-[var(--text-muted)]">
                خودکار محفوظ (مسودے سے الگ)
              </span>
            </div>
            <textarea
              value={scratchpadText}
              onChange={(e) => handleScratchpadChange(e.target.value)}
              onKeyDown={(e) => handlePhoneticKeyDown(e, scratchpadText, handleScratchpadChange)}
              dir="rtl"
              spellCheck={false}
              placeholder="یہاں اپنے ذہن میں آنے والے خیالات، ادھورے مصرعے، متبادل الفاظ یا گرہ محفوظ کریں۔ یہ بیاض آپ کے اصل مسودے کو تبدیل نہیں کرتی..."
              style={{
                fontFamily: prefs.fontFamily,
                fontSize: `${Math.max(16, prefs.fontSize - 2)}px`,
                lineHeight: 2.4,
              }}
              className="w-full flex-1 min-h-[240px] resize-none bg-[var(--bg-surface)]/50 rounded-xl border border-[var(--border-subtle)] p-4 outline-none focus:border-[var(--accent-gold)] text-right font-nastaliq text-[var(--text-primary)] custom-scrollbar"
            />
          </div>
        );

      case 'portfolio':
        return (
          <div className="h-full min-h-0 min-w-0 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain bg-[var(--bg-card)]">
            <PortfolioTab
              currentDraftId={currentDraft.id}
              onSelectDraft={onSelectDraft}
              onDeleteDraft={onDeleteDraft}
              onPortfolioRestored={onPortfolioRestored}
              fontFamily={prefs.fontFamily}
            />
          </div>
        );
    }
  };

  const activeDivisionMeta =
    DIVISION_OPTIONS.find((d) => d.id === cc.division) || DIVISION_OPTIONS[0];
  const checkedFeaturesCount = FEATURE_CHECKBOX_ITEMS.filter((item) =>
    Boolean(cc[item.key])
  ).length;

  return (
    <div
      data-testid="custom-studio-workspace"
      className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden relative bg-[var(--bg-canvas)]"
    >
      {/* Collapsible Customizer Control Strip (من پسند منظر ساز) */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md z-20 flex-shrink-0">
        <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/40 text-[var(--accent-gold)] text-xs font-bold font-nastaliq">
              <Sparkles className="w-3.5 h-3.5" />
              <span>من پسند اسٹوڈیو (شاعر کی مرضی کا منظر)</span>
            </span>
            <span
              data-testid="selected-features-badge"
              className="px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] font-nastaliq text-[var(--text-secondary)]"
            >
              منتخب سہولیات: {checkedFeaturesCount} / {FEATURE_CHECKBOX_ITEMS.length}
            </span>

            {/* Direct Quick Checkbox 1: Rhyming (Top or Left) */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-nastaliq">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  data-testid="custom-rhyming-checkbox"
                  checked={Boolean(cc.showQafiyaTray)}
                  onChange={(e) =>
                    onUpdateCustomConfig({
                      showQafiyaTray: e.target.checked,
                      rhymePlacement: cc.rhymePlacement || 'top',
                    })
                  }
                  className="w-3.5 h-3.5 rounded accent-[var(--accent-gold)] cursor-pointer"
                />
                <span className="font-bold text-[var(--text-primary)]">قوافی</span>
              </label>
              {cc.showQafiyaTray && (
                <div className="flex items-center gap-0.5 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[10px]">
                  <button
                    type="button"
                    onClick={() => onUpdateCustomConfig({ rhymePlacement: 'top' })}
                    className={`px-2 py-0.5 rounded transition-all ${
                      (cc.rhymePlacement ?? 'top') === 'top'
                        ? 'bg-[var(--accent-gold)] text-white font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    اوپر (Top)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateCustomConfig({ rhymePlacement: 'left' })}
                    className={`px-2 py-0.5 rounded transition-all ${
                      cc.rhymePlacement === 'left'
                        ? 'bg-[var(--accent-gold)] text-white font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    بائیں (Left)
                  </button>
                </div>
              )}
            </div>

            {/* Direct Quick Checkbox 2: Slot Rhyme Builder */}
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-nastaliq cursor-pointer select-none">
              <input
                type="checkbox"
                data-testid="custom-slot-checkbox"
                checked={Boolean(cc.showSlotRhymeBuilder)}
                onChange={(e) =>
                  onUpdateCustomConfig({ showSlotRhymeBuilder: e.target.checked })
                }
                className="w-3.5 h-3.5 rounded accent-[var(--accent-gold)] cursor-pointer"
              />
              <span className="font-bold text-[var(--text-primary)]">قالب ساز (Slot)</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick One-Click Templates */}
            <div className="hidden xl:flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyQuickTemplate('writing_only')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors"
              >
                خالص تحریر (صرف ورق)
              </button>
              <button
                type="button"
                onClick={() => applyQuickTemplate('diwan')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors"
              >
                روایتی دیوان (آمنے سامنے)
              </button>
              <button
                type="button"
                onClick={() => applyQuickTemplate('poet_rhyme')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors"
              >
                تحریر + قافیہ (۲ کالم)
              </button>
              <button
                type="button"
                onClick={() => applyQuickTemplate('three_col')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors"
              >
                سہ ستونی (۳ کالم)
              </button>
              <button
                type="button"
                onClick={() => applyQuickTemplate('quad_studio')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors"
              >
                چہار خانہ (۲×۲ گرڈ)
              </button>
            </div>

            <button
              type="button"
              onClick={() => applyQuickTemplate('full_all')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              title="تمام چیک باکسز غیر منتخب کریں (صفر سے آغاز)"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">سب غیر منتخب (صفر)</span>
            </button>

            <button
              type="button"
              onClick={onExitCustom}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="کلاسیکی اسٹوڈیو میں واپس جائیں"
            >
              <span>کلاسیکی منظر</span>
            </button>

            <button
              type="button"
              data-testid="toggle-customizer-drawer"
              onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-nastaliq bg-[var(--accent-gold)] text-white shadow-2xs hover:brightness-110 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isCustomizerOpen ? 'اختیارات سمیٹیں' : 'من پسند اختیارات کھولیں'}</span>
              {isCustomizerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Interactive Control Drawer */}
        {isCustomizerOpen && (
          <div
            data-testid="customizer-options-panel"
            className="px-4 pb-5 pt-2 border-t border-[var(--border-subtle)]/60 bg-[var(--bg-card)]/95 max-h-[56vh] overflow-y-auto custom-scrollbar overscroll-contain space-y-4"
          >
            {/* Section 1: Screen Division Geometry (کالم، قطاریں اور خانے) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold font-nastaliq text-[var(--accent-gold)] flex items-center gap-1.5">
                    <Columns2 className="w-3.5 h-3.5" />
                    <span>۱۔ اسکرین کی تقسیم (کالم، قطاریں یا چہار خانہ گرڈ)</span>
                  </h3>
                  <span className="text-[11px] font-nastaliq text-[var(--text-muted)]">
                    فعال خانے: {activeDivisionMeta.panes}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DIVISION_OPTIONS.map((div) => {
                    const active = cc.division === div.id;
                    return (
                      <button
                        key={div.id}
                        type="button"
                        onClick={() => onUpdateCustomConfig({ division: div.id })}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-0.5 ${
                          active
                            ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold shadow-2xs'
                            : 'bg-[var(--bg-surface)]/70 border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-nastaliq">{div.label}</span>
                          {div.id === 'single' && <Square className="w-3.5 h-3.5" />}
                          {div.id === 'two_cols' && <Columns2 className="w-3.5 h-3.5" />}
                          {div.id === 'three_cols' && <Columns3 className="w-3.5 h-3.5" />}
                          {div.id === 'two_rows' && <Rows2 className="w-3.5 h-3.5" />}
                          {div.id === 't_split' && <PanelTop className="w-3.5 h-3.5" />}
                          {div.id === 'quad_grid' && <Grid2x2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-[10px] font-nastaliq text-[var(--text-muted)]">
                          {div.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Split Ratio Controls + Paper Width */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  {(cc.division === 'two_cols' || cc.division === 't_split' || cc.division === 'quad_grid') && (
                    <div className="flex items-center gap-2 text-xs font-nastaliq">
                      <span className="text-[var(--text-secondary)]">دائیں/بائیں تناسب:</span>
                      {[75, 68, 60, 50, 35].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => onUpdateCustomConfig({ colSplitPct: pct })}
                          className={`px-2 py-0.5 rounded border font-mono text-[11px] ${
                            cc.colSplitPct === pct
                              ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'
                          }`}
                        >
                          {pct}/{100 - pct}
                        </button>
                      ))}
                    </div>
                  )}

                  {(cc.division === 'two_rows' || cc.division === 't_split' || cc.division === 'quad_grid') && (
                    <div className="flex items-center gap-2 text-xs font-nastaliq">
                      <span className="text-[var(--text-secondary)]">اوپر/نیچے تناسب:</span>
                      {[70, 60, 50, 40].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => onUpdateCustomConfig({ rowSplitPct: pct })}
                          className={`px-2 py-0.5 rounded border font-mono text-[11px] ${
                            cc.rowSplitPct === pct
                              ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'
                          }`}
                        >
                          {pct}/{100 - pct}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs font-nastaliq">
                    <Maximize2 className="w-3 h-3 text-[var(--accent-gold)]" />
                    <span className="text-[var(--text-secondary)]">ورق کی چوڑائی:</span>
                    {(
                      [
                        { id: 'narrow', label: 'تنگ' },
                        { id: 'book', label: 'کتابی' },
                        { id: 'wide', label: 'کشادہ' },
                        { id: 'full', label: '۱۰۰٪ مکمل' },
                      ] as { id: CustomPaperWidth; label: string }[]
                    ).map((pw) => (
                      <button
                        key={pw.id}
                        type="button"
                        onClick={() => onUpdateCustomConfig({ paperWidth: pw.id })}
                        className={`px-2 py-0.5 rounded border text-[11px] ${
                          cc.paperWidth === pw.id
                            ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                            : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                        }`}
                      >
                        {pw.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Per-Pane Content Pickers (ہر خانے میں کیا دکھائیں؟) */}
              <div className="lg:col-span-5 space-y-2">
                <h3 className="text-xs font-bold font-nastaliq text-[var(--accent-gold)] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>۲۔ ہر خانے کا مواد منتخب کریں</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      { slot: 1, key: 'pane1' as const, title: 'خانہ ۱ (مرکزی / دائیں)' },
                      { slot: 2, key: 'pane2' as const, title: 'خانہ ۲ (بائیں / ذیلی)' },
                      { slot: 3, key: 'pane3' as const, title: 'خانہ ۳ (تیسرا خانہ)' },
                      { slot: 4, key: 'pane4' as const, title: 'خانہ ۴ (چوتھا خانہ)' },
                    ] as const
                  )
                    .slice(0, activeDivisionMeta.panes)
                    .map((p) => (
                      <div
                        key={p.key}
                        className="p-2.5 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] flex flex-col gap-1"
                      >
                        <label className="text-[11px] font-bold font-nastaliq text-[var(--text-secondary)]">
                          {p.title}
                        </label>
                        <select
                          aria-label={p.title}
                          value={cc[p.key]}
                          onChange={(e) =>
                            onUpdateCustomConfig({ [p.key]: e.target.value as CustomPaneWidgetId })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-nastaliq text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                        >
                          {PANE_WIDGET_OPTIONS.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Section 3: Simple Checkboxes for Every Screen Feature (سادہ چیک باکسز) */}
            <div className="pt-2 border-t border-[var(--border-subtle)]/50 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-nastaliq text-[var(--accent-gold)] flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>۳۔ تمام سہولیات کے چیک باکسز (جو چاہیں اسکرین پر رکھیں یا ہٹا دیں)</span>
                </h3>
                <div className="flex items-center gap-2 text-[11px] font-nastaliq">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCustomConfig({
                        showTopNavBar: true,
                        showQafiyaTray: true,
                        showTitleAndMetadata: true,
                        showWordProcessorToolbar: true,
                        showErabToolbar: true,
                        showAutoRhymeBanner: true,
                        showLiveScansionCards: true,
                        showLineNumbers: true,
                        showRuledLines: true,
                        showBottomStatsBar: true,
                      })
                    }
                    className="underline text-[var(--accent-gold)]"
                  >
                    سب آن کریں
                  </button>
                  <span className="text-[var(--text-muted)]">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCustomConfig({
                        showTopNavBar: false,
                        showQafiyaTray: false,
                        showTitleAndMetadata: false,
                        showWordProcessorToolbar: false,
                        showErabToolbar: false,
                        showAutoRhymeBanner: false,
                        showLiveScansionCards: false,
                        showLineNumbers: false,
                        showCoupletDiwanLayout: false,
                        showRuledLines: false,
                        showBottomStatsBar: false,
                      })
                    }
                    className="underline text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    سب چھپائیں (صرف کاغذ)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                {FEATURE_CHECKBOX_ITEMS.map((item) => {
                  const checked = Boolean(cc[item.key]);
                  return (
                    <label
                      key={item.key}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                        checked
                          ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)]/50 text-[var(--text-primary)]'
                          : 'bg-[var(--bg-surface)]/40 border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-subtle)]/90'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          onUpdateCustomConfig({ [item.key]: e.target.checked })
                        }
                        className="mt-1 w-4 h-4 rounded accent-[var(--accent-gold)] cursor-pointer flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold font-nastaliq leading-relaxed">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-nastaliq text-[var(--text-muted)] leading-normal">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Multi-Zone Screen Division Renderer */}
      <div
        ref={verticalStackRef}
        className="flex-1 min-h-0 min-w-0 overflow-hidden relative flex flex-col"
      >
        {/* Top Docked Unified Rhyme View (Right-to-Left Rows) + Draggable Horizontal Divider */}
        {cc.showQafiyaTray && (cc.rhymePlacement ?? 'top') === 'top' && (
          <>
            <div
              style={{ height: `${topRhymeHeightPct}%` }}
              className="w-full min-h-[88px] overflow-hidden flex-shrink-0"
            >
              <UnifiedRhymeView
                rhymeWords={currentDraft.qafiyaList}
                poemContent={currentDraft.content}
                placement="top"
                fontFamily={prefs.fontFamily}
                fontSize={prefs.fontSize}
                onChangeRhymes={onQafiyaListChange}
                onSelectRhyme={(word) =>
                  onContentChange(currentDraft.content ? `${currentDraft.content} ${word}` : word)
                }
              />
            </div>

            <ResizableDivider
              orientation="horizontal"
              isLocked={prefs.isLocked}
              onResize={(pct) => setTopRhymeHeightPct(Math.max(12, Math.min(60, pct)))}
              containerRef={verticalStackRef}
            />
          </>
        )}

        <div
          ref={horizontalSplitRef}
          className="flex-1 min-h-0 min-w-0 overflow-hidden relative flex"
        >
        <div
          style={{
            width:
              (cc.showQafiyaTray && cc.rhymePlacement === 'left') || cc.showSlotRhymeBuilder
                ? `${100 - leftDockWidthPct}%`
                : '100%',
          }}
          className="h-full min-h-0 min-w-0 overflow-hidden"
        >
          {cc.division === 'single' && (
            <div className="w-full h-full min-h-0 min-w-0 overflow-hidden">
              {renderWidgetPane(cc.pane1, 1)}
            </div>
          )}

        {cc.division === 'two_cols' && (
          <div className="w-full h-full min-h-0 min-w-0 flex overflow-hidden">
            <div
              style={{ width: `${cc.colSplitPct}%` }}
              className="h-full min-h-0 min-w-0 overflow-hidden border-l border-[var(--border-subtle)]"
            >
              {renderWidgetPane(cc.pane1, 1)}
            </div>
            <div
              style={{ width: `${100 - cc.colSplitPct}%` }}
              className="h-full min-h-0 min-w-0 overflow-hidden"
            >
              {renderWidgetPane(cc.pane2, 2)}
            </div>
          </div>
        )}

        {cc.division === 'three_cols' && (
          <div className="w-full h-full min-h-0 min-w-0 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden custom-scrollbar">
            <div className="lg:col-span-3 h-full min-h-[320px] lg:min-h-0 min-w-0 overflow-hidden border-b lg:border-b-0 lg:border-l border-[var(--border-subtle)]">
              {renderWidgetPane(cc.pane1, 1)}
            </div>
            <div className="lg:col-span-6 h-full min-h-[420px] lg:min-h-0 min-w-0 overflow-hidden border-b lg:border-b-0 lg:border-l border-[var(--border-subtle)]">
              {renderWidgetPane(cc.pane2, 2)}
            </div>
            <div className="lg:col-span-3 h-full min-h-[320px] lg:min-h-0 min-w-0 overflow-hidden">
              {renderWidgetPane(cc.pane3, 3)}
            </div>
          </div>
        )}

        {cc.division === 'two_rows' && (
          <div className="w-full h-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <div
              style={{ height: `${cc.rowSplitPct}%` }}
              className="w-full min-h-0 min-w-0 overflow-hidden border-b border-[var(--border-subtle)]"
            >
              {renderWidgetPane(cc.pane1, 1)}
            </div>
            <div
              style={{ height: `${100 - cc.rowSplitPct}%` }}
              className="w-full min-h-0 min-w-0 overflow-hidden"
            >
              {renderWidgetPane(cc.pane2, 2)}
            </div>
          </div>
        )}

        {cc.division === 't_split' && (
          <div className="w-full h-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <div
              style={{ height: `${cc.rowSplitPct}%` }}
              className="w-full min-h-0 min-w-0 overflow-hidden border-b border-[var(--border-subtle)]"
            >
              {renderWidgetPane(cc.pane1, 1)}
            </div>
            <div
              style={{ height: `${100 - cc.rowSplitPct}%` }}
              className="w-full min-h-0 min-w-0 flex overflow-hidden"
            >
              <div
                style={{ width: `${cc.colSplitPct}%` }}
                className="h-full min-h-0 min-w-0 overflow-hidden border-l border-[var(--border-subtle)]"
              >
                {renderWidgetPane(cc.pane2, 2)}
              </div>
              <div
                style={{ width: `${100 - cc.colSplitPct}%` }}
                className="h-full min-h-0 min-w-0 overflow-hidden"
              >
                {renderWidgetPane(cc.pane3, 3)}
              </div>
            </div>
          </div>
        )}

        {cc.division === 'quad_grid' && (
          <div className="w-full h-full min-h-0 min-w-0 flex flex-col overflow-hidden">
            <div
              style={{ height: `${cc.rowSplitPct}%` }}
              className="w-full min-h-0 min-w-0 flex overflow-hidden border-b border-[var(--border-subtle)]"
            >
              <div
                style={{ width: `${cc.colSplitPct}%` }}
                className="h-full min-h-0 min-w-0 overflow-hidden border-l border-[var(--border-subtle)]"
              >
                {renderWidgetPane(cc.pane1, 1)}
              </div>
              <div
                style={{ width: `${100 - cc.colSplitPct}%` }}
                className="h-full min-h-0 min-w-0 overflow-hidden"
              >
                {renderWidgetPane(cc.pane2, 2)}
              </div>
            </div>
            <div
              style={{ height: `${100 - cc.rowSplitPct}%` }}
              className="w-full min-h-0 min-w-0 flex overflow-hidden"
            >
              <div
                style={{ width: `${cc.colSplitPct}%` }}
                className="h-full min-h-0 min-w-0 overflow-hidden border-l border-[var(--border-subtle)]"
              >
                {renderWidgetPane(cc.pane3, 3)}
              </div>
              <div
                style={{ width: `${100 - cc.colSplitPct}%` }}
                className="h-full min-h-0 min-w-0 overflow-hidden"
              >
                {renderWidgetPane(cc.pane4, 4)}
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Left Docked Rhyming / Slot Builder Sidebar with Draggable Vertical & Horizontal Dividers */}
        {((cc.showQafiyaTray && cc.rhymePlacement === 'left') || cc.showSlotRhymeBuilder) && (
          <>
            <ResizableDivider
              orientation="vertical"
              isLocked={prefs.isLocked}
              onResize={(rightPct) =>
                setLeftDockWidthPct(Math.max(20, Math.min(65, 100 - rightPct)))
              }
              containerRef={horizontalSplitRef}
            />

            <aside
              ref={leftDockStackRef}
              data-testid="custom-left-rhyme-slot-dock"
              style={{ width: `${leftDockWidthPct}%` }}
              className="h-full min-h-0 bg-[var(--bg-card)] flex flex-col overflow-hidden flex-shrink-0"
            >
              {cc.showSlotRhymeBuilder && cc.showQafiyaTray && cc.rhymePlacement === 'left' ? (
                <>
                  <div
                    style={{ height: `${leftSlotSplitPct}%` }}
                    className="min-h-0 flex flex-col overflow-hidden"
                  >
                    <VisualSlotRhymeBuilder
                      initialWord={selectedWord || 'ایمان'}
                      onLoadToTray={onLoadRhymesToTray}
                      fontFamily={prefs.fontFamily}
                    />
                  </div>
                  <ResizableDivider
                    orientation="horizontal"
                    isLocked={prefs.isLocked}
                    onResize={(pct) => setLeftSlotSplitPct(Math.max(25, Math.min(78, pct)))}
                    containerRef={leftDockStackRef}
                  />
                  <div
                    style={{ height: `${100 - leftSlotSplitPct}%` }}
                    className="min-h-0 flex flex-col overflow-hidden"
                  >
                    {renderWidgetPane('qafiya_pad', 2)}
                  </div>
                </>
              ) : cc.showSlotRhymeBuilder ? (
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <VisualSlotRhymeBuilder
                    initialWord={selectedWord || 'ایمان'}
                    onLoadToTray={onLoadRhymesToTray}
                    fontFamily={prefs.fontFamily}
                  />
                </div>
              ) : (
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  {renderWidgetPane('qafiya_pad', 2)}
                </div>
              )}
            </aside>
          </>
        )}
        </div>
      </div>
      {/* Floating Quick Bar when Customizer is collapsed */}
      {!isCustomizerOpen && (cc.showFloatingQuickBar || !cc.showTopNavBar) && (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--accent-gold)]/50 shadow-lg opacity-60 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-gold)] text-white text-xs font-bold font-nastaliq"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>من پسند ترتیبات</span>
          </button>
          {!cc.showTopNavBar && (
            <button
              type="button"
              onClick={() => onUpdateCustomConfig({ showTopNavBar: true })}
              className="px-2.5 py-1 rounded-full text-xs font-nastaliq border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]"
            >
              بالائی پٹی دکھائیں
            </button>
          )}
        </div>
      )}
    </div>
  );
};
