export type ThemeId = 'sepia' | 'dark' | 'white';

export type NastaliqFont =
  | 'Noto Nastaliq Urdu'
  | 'Jameel Noori Nastaliq'
  | 'Mehr Nastaliq Web'
  | 'Gulzar';

export type LayoutPreset =
  | 'classic'
  | 'custom'
  | 'zen'
  | 'swapped'
  | 'bottom_dock'
  | 'quiet'
  | 'quiet_rhymes';

export type MarkerOption = 'strike' | 'glow' | 'check';

export type CustomGridDivision =
  | 'single'        // ۱ خانہ (صرف تحریر / مکمل ورق)
  | 'two_cols'      // ۲ کالم (دائیں بائیں ستون)
  | 'three_cols'    // ۳ کالم (سہ ستونی اسٹوڈیو)
  | 'two_rows'      // ۲ قطاریں (اوپر نیچے تقسیم)
  | 't_split'       // ٹی تقسیم (اوپر پٹی + نیچے ۲ کالم)
  | 'quad_grid';    // چہار خانہ (۲×۲ گرڈ — ۴ خانے)

export type CustomPaneWidgetId =
  | 'editor'        // مسودۂ کلام (مرکزی تحریر)
  | 'raw_sheet'     // سادہ ورق (خاموش تحریر)
  | 'diwan_preview' // روایتی دیوان منظر (شعر بہ شعر دو ستونی منظر)
  | 'qafiya_search' // خزانۂ قوافی (۵۸،۶۰۴ الفاظ کی تلاش)
  | 'slot_builder'  // قالب سازِ قوافی (حروف کے خانے اور تہجی انتخاب)
  | 'qafiya_pad'    // ذاتی قوافی فہرست
  | 'prosody'       // عروضی تقطیع اور بحر کی تشخیص
  | 'lugat'         // لغت اور مترادفات
  | 'rhetoric'      // صنائع بدائع (علمِ بیان و بدیع)
  | 'scratchpad'    // تخلیقی بیاض (رف نوٹس اور گرہ)
  | 'portfolio';    // بیاض و محفوظ مسودات

export type CustomPaperWidth = 'narrow' | 'book' | 'wide' | 'full';

export interface CustomViewConfig {
  configVersion?: number;
  division: CustomGridDivision;
  colSplitPct: number;        // Primary column width % (e.g., 65)
  rowSplitPct: number;        // Primary row height % (e.g., 60)
  pane1: CustomPaneWidgetId;  // Primary pane (default: 'editor')
  pane2: CustomPaneWidgetId;  // Secondary pane (default: 'qafiya_search')
  pane3: CustomPaneWidgetId;  // Tertiary pane (default: 'prosody')
  pane4: CustomPaneWidgetId;  // Quaternary pane (default: 'scratchpad')
  paperWidth: CustomPaperWidth;
  // Feature Checkboxes (جو چاہیں دکھائیں یا چھپائیں)
  showTopNavBar: boolean;
  showQafiyaTray: boolean;
  rhymePlacement?: 'top' | 'left';
  showSlotRhymeBuilder?: boolean;
  showTitleAndMetadata: boolean;
  showWordProcessorToolbar: boolean;
  showErabToolbar: boolean;
  showAutoRhymeBanner: boolean;
  showLiveScansionCards: boolean;
  showLineNumbers: boolean;
  showCoupletDiwanLayout: boolean;
  showBottomStatsBar: boolean;
  showRuledLines: boolean;
  showFloatingQuickBar: boolean;
}

export interface WorkspacePrefs {
  theme: ThemeId;
  fontFamily: NastaliqFont;
  fontSize: number; // 16 to 36
  lineHeight: number; // 2.0 to 3.2
  isLocked: boolean;
  activePreset: LayoutPreset;
  verticalSplitPct: number; // Percentage for Editor Canvas (e.g. 70 means 70% canvas, 30% companion)
  horizontalSplitPct: number; // Percentage for Top Tray vs Workspace (e.g. 20 means 20% tray)
  qafiyaDockPosition: 'top' | 'bottom';
  qafiyaZoom: number; // Zoom percentage/multiplier for tray chips (e.g. 14 to 26 px)
  qafiyaMarkerStyle: MarkerOption;
  isZenMode: boolean;
  companionOpen: boolean;
  qafiyaTrayOpen: boolean;
  showLiveScansion: boolean;
  customConfig: CustomViewConfig;
}
