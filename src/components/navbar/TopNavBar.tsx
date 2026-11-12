import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Type,
  Minimize2,
  Download,
  PlusCircle,
  Check,
  ChevronDown,
  Sparkles,
  Palette,
  Sliders,
  Clock3,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Crown,
  Settings,
  X,
  Smartphone,
  Mic,
  FolderDown,
  LayoutGrid,
  Cloud,
} from 'lucide-react';
import { WorkspacePrefs, LayoutPreset, ThemeId, NastaliqFont } from '../../types/workspace';
import type { PersistenceState } from '../../hooks/usePoemEditor';
import {
  licenseVerificationService,
  ActiveLicense,
} from '../../services/licenseVerificationService';
import { usePWAInstall } from '../../services/pwaService';

interface TopNavBarProps {
  prefs: WorkspacePrefs;
  onThemeChange: (theme: ThemeId) => void;
  onFontFamilyChange: (font: NastaliqFont) => void;
  onFontSizeChange: (size: number) => void;
  onLineHeightChange: (lh: number) => void;
  onToggleLock: () => void;
  onApplyPreset: (preset: LayoutPreset) => void;
  onToggleZen: () => void;
  onNewPoem: () => void;
  onOpenExport: () => void;
  onOpenGoogleDrive?: () => void;
  onOpenVoiceStudio?: () => void;
  hasVoiceRecording?: boolean;
  onOpenDiwan?: () => void;
  onOpenUpgrade?: () => void;
  trialDaysRemaining?: number;
  saveState?: PersistenceState;
  saveError?: string | null;
  onRetrySave?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  prefs,
  onThemeChange,
  onFontFamilyChange,
  onFontSizeChange,
  onLineHeightChange,
  onToggleLock,
  onApplyPreset,
  onToggleZen,
  onNewPoem,
  onOpenExport,
  onOpenGoogleDrive,
  onOpenVoiceStudio,
  hasVoiceRecording = false,
  onOpenDiwan,
  onOpenUpgrade,
  trialDaysRemaining = 7,
  saveState = 'idle',
  saveError,
  onRetrySave,
}) => {
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const { canInstall, isInstalled, isStandalone, isIOS, promptInstall } = usePWAInstall();
  const [activeLicense, setActiveLicense] = useState<ActiveLicense | null>(() =>
    licenseVerificationService.getActiveLicense()
  );

  useEffect(() => {
    return licenseVerificationService.subscribe(setActiveLicense);
  }, []);

  // Close dropdowns and drawers on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsDrawerOpen) setIsSettingsDrawerOpen(false);
        if (showFileMenu) setShowFileMenu(false);
        if (showPresetMenu) setShowPresetMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsDrawerOpen, showFileMenu, showPresetMenu]);

  const saveStatus = {
    idle: {
      label: 'محفوظ شدہ',
      icon: <Check className="w-3.5 h-3.5 text-emerald-500" />,
      tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    },
    dirty: {
      label: 'غیر محفوظ تبدیلی',
      icon: <Clock3 className="w-3.5 h-3.5 text-amber-500" />,
      tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    },
    saving: {
      label: 'محفوظ ہو رہا ہے...',
      icon: <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin" />,
      tone: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
    },
    saved: {
      label: 'محفوظ شدہ',
      icon: <Check className="w-3.5 h-3.5 text-emerald-500" />,
      tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    },
    failed: {
      label: 'محفوظ نہیں ہو سکا',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
      tone: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
    },
    'session-only': {
      label: 'صرف اس نشست میں',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
      tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    },
  }[saveState];

  const fontOptions: { id: NastaliqFont; label: string; sample: string }[] = [
    { id: 'Noto Nastaliq Urdu', label: 'نوٹو نستعلیق (Noto Nastaliq)', sample: 'دلِ ناداں تجھے ہوا کیا ہے' },
    { id: 'Jameel Noori Nastaliq', label: 'جمیل نوری نستعلیق (Jameel Noori)', sample: 'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے' },
    { id: 'Mehr Nastaliq Web', label: 'مہر نستعلیق ویب (Mehr Nastaliq)', sample: 'غالبؔ خستہ کے بغیر کون سے کام بند ہیں' },
    { id: 'Gulzar', label: 'گلزار (Gulzar)', sample: 'ستاروں سے آگے جہاں اور بھی ہیں' },
  ];

  const themeOptions: { id: ThemeId; label: string; iconBg: string; desc: string }[] = [
    { id: 'sepia', label: 'کاغذ (Sepia)', iconBg: 'bg-[#F4EEDC] text-[#2C241E] border-[#D4AF37]', desc: 'قدیم کتابی کاغذ کا آرام دہ اور نفاست بخش رنگ' },
    { id: 'dark', label: 'شبینہ (Obsidian)', iconBg: 'bg-[#12151B] text-[#F3EDE0] border-[#3E4554]', desc: 'رات کے وقت لکھنے کے لیے پرسکون تاریک منظر' },
    { id: 'white', label: 'سادہ (Clean Canvas)', iconBg: 'bg-[#FFFFFF] text-[#1E1E1E] border-[#E0E0E0]', desc: 'روشن اور جدید صاف کینوس' },
  ];

  const presetLabels: Record<LayoutPreset, string> = {
    classic: 'کلاسیکی (Classic)',
    custom: 'من پسند (Custom Studio)',
    zen: 'گوشۂ تنہائی (Zen)',
    quiet: 'صرف تحریر (Writing only)',
    quiet_rhymes: 'تحریر و قوافی (70 / 30)',
    swapped: 'معکوس (Swapped)',
    bottom_dock: 'تہہ نشین (Bottom Dock)',
  };

  return (
    <>
      {/* Invisible backdrop to dismiss open dropdown menus smoothly */}
      {(showFileMenu || showPresetMenu) && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setShowFileMenu(false);
            setShowPresetMenu(false);
          }}
          aria-hidden="true"
        />
      )}

      <header className="min-h-[5.5rem] md:h-[5.75rem] px-3 sm:px-5 lg:px-6 py-2 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur-md z-30 select-none flex-shrink-0 transition-all">
        {/* ========================================================================= */}
        {/* Right Side: Identity & Auto-Save Status (Unclipped Nastaliq)              */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 py-1">
          {/* Brand Royal Seal Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[var(--accent-gold)] shadow-md flex-shrink-0 bg-[#0c1017] flex items-center justify-center ring-2 ring-[var(--accent-gold)]/25">
            <img
              src="/logo.jpg"
              alt="نشانِ قلم و قافیہ"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Brand Name & Status Indicator */}
          <div className="flex items-center gap-2 pb-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-nastaliq text-[var(--text-primary)] leading-[1.8] sm:leading-[1.9] tracking-tight">
              قلم و قافیہ
            </h1>
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 hidden sm:inline-block"
              title="خودکار محفوظ سازی فعال ہے"
            ></span>
          </div>

          {/* Auto-Save Status Pill */}
          <div
            data-testid="save-status"
            title={saveError || saveStatus.label}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border flex-shrink-0 shadow-2xs font-nastaliq ${saveStatus.tone}`}
          >
            {saveStatus.icon}
            <span>{saveStatus.label}</span>
          </div>

          {/* Retry Save Button if Failed */}
          {(saveState === 'session-only' || saveState === 'failed') && onRetrySave && (
            <button
              type="button"
              onClick={onRetrySave}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-nastaliq border transition-colors flex-shrink-0 leading-[2.2] ${
                saveState === 'failed'
                  ? 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/20'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
              }`}
              title="مسودہ دوبارہ محفوظ کرنے کی کوشش کریں"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>دوبارہ کوشش</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* Center: Three Creative Sanctuaries (Segmented Island with breathing space) */}
        {/* ========================================================================= */}
        <div className="hidden md:flex items-center p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
          {/* 1. Studio Workspace */}
          <button
            type="button"
            onClick={() => {
              if (prefs.isZenMode) onToggleZen();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-nastaliq font-bold transition-all flex items-center gap-1.5 leading-[2.2] ${
              !prefs.isZenMode
                ? 'bg-[var(--accent-gold)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="شاعر کا بنیادی ورک اسپیس — تقطیع، قوافی اور اصلاح"
          >
            <span>✍️ تحریر</span>
          </button>

          {/* 2. Classical Diwan (10 Poets Public-Domain Library & Dictionary) */}
          {onOpenDiwan && (
            <button
              type="button"
              data-testid="open-classical-diwan-btn"
              onClick={onOpenDiwan}
              className="px-4 py-2 rounded-xl text-sm font-nastaliq font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all flex items-center gap-2 leading-[2.2]"
              title="دیوانِ اساتذہ — ۱۰ کلاسیکی اساتذہ کا مکمل کلام مع لغتِ قلم و قافیہ"
            >
              <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>دیوانِ اساتذہ</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-sans font-bold border border-emerald-500/30">
                ۱۰
              </span>
            </button>
          )}

          {/* 3. Zen Mode (گوشۂ تنہائی) */}
          <button
            type="button"
            onClick={onToggleZen}
            className={`px-4 py-2 rounded-xl text-sm font-nastaliq font-bold transition-all flex items-center gap-1.5 leading-[2.2] ${
              prefs.isZenMode
                ? 'bg-[var(--accent-gold)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title={prefs.isZenMode ? 'گوشۂ تنہائی سے خروج' : 'گوشۂ تنہائی — پرسکون، یکسو تحریری ماحول'}
          >
            {prefs.isZenMode ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>خروجِ تنہائی</span>
              </>
            ) : (
              <>
                <span>🕊️ گوشۂ تنہائی</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* Left Side: Consolidated, Eye-Pleasing Dropdowns & Pro Studio Actions       */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* ----------------------------------------------------------------------- */}
          {/* Dropdown 1: File & Export Menu (فائل و اشاعت)                          */}
          {/* ----------------------------------------------------------------------- */}
          <div className="relative z-50">
            <button
              type="button"
              onClick={() => {
                setShowFileMenu(!showFileMenu);
                setShowPresetMenu(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-nastaliq font-bold border transition-all leading-[2.2] cursor-pointer ${
                showFileMenu
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] shadow-xs'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
              title="فائل، نیا کلام اور برآمد و اشاعت مینو"
              aria-expanded={showFileMenu}
            >
              <FolderDown className="w-3.5 h-3.5 text-[var(--accent-gold)] flex-shrink-0" />
              <span>فائل و اشاعت</span>
              <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${showFileMenu ? 'rotate-180 text-[var(--accent-gold)]' : ''}`} />
            </button>

            {showFileMenu && (
              <div
                dir="rtl"
                className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-72 p-2 rounded-2xl shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/98 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="text-[11px] font-bold text-[var(--text-muted)] px-3 py-1 font-nastaliq leading-[2.2] border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                  <span>مسودہ و اشاعت</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)]">Ctrl+S خودکار</span>
                </div>

                {/* Option: New Poem */}
                <button
                  type="button"
                  onClick={() => {
                    setShowFileMenu(false);
                    onNewPoem();
                  }}
                  className="w-full text-right px-3 py-2.5 rounded-xl text-xs sm:text-sm font-nastaliq transition-all flex items-center gap-2.5 hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] leading-[2.2] group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 flex items-center justify-center flex-shrink-0 text-[var(--accent-gold)] group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">نیا کلام (New Poem)</div>
                    <div className="text-[11px] text-[var(--text-secondary)] leading-[1.6]">خالی کینوس پر نیا مسودہ شروع کریں</div>
                  </div>
                </button>

                {/* Option: Export / Booklet / WhatsApp */}
                <button
                  type="button"
                  onClick={() => {
                    setShowFileMenu(false);
                    onOpenExport();
                  }}
                  className="w-full text-right px-3 py-2.5 rounded-xl text-xs sm:text-sm font-nastaliq transition-all flex items-center gap-2.5 hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] leading-[2.2] group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>برآمد و دیوان کتابچہ</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-sans font-bold">HD</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] leading-[1.6]">پی ڈی ایف، واٹس ایپ سائز اور کراچی پرنٹ ڈیسک</div>
                  </div>
                </button>

                {/* Option: Google Drive & Google Docs */}
                {onOpenGoogleDrive && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowFileMenu(false);
                      onOpenGoogleDrive();
                    }}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-xs sm:text-sm font-nastaliq transition-all flex items-center gap-2.5 hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] leading-[2.2] group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#4285F4]/15 border border-[#4285F4]/30 flex items-center justify-center flex-shrink-0 text-[#4285F4] group-hover:scale-105 transition-transform">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold flex items-center justify-between">
                        <span>گوگل ڈرائیو و دستاویز</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#4285F4]/20 text-[#4285F4] font-sans font-bold">Cloud</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] leading-[1.6]">گوگل کلاؤڈ بیک اپ اور ڈاکس میں برآمد</div>
                    </div>
                  </button>
                )}

                {/* Option: PWA App Install if available */}
                {canInstall && !isStandalone && (
                  <button
                    type="button"
                    onClick={async () => {
                      setShowFileMenu(false);
                      const outcome = await promptInstall();
                      if (outcome === 'ios_guide') {
                        setShowInstallHelp(true);
                        setIsSettingsDrawerOpen(true);
                      }
                    }}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-xs sm:text-sm font-nastaliq transition-all flex items-center gap-2.5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-t border-[var(--border-subtle)] mt-1 pt-2 leading-[2.2] cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-300">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">ایپ کمپیوٹر پر انسٹال کریں</div>
                      <div className="text-[11px] opacity-80 leading-[1.6]">بغیر انٹرنیٹ آف لائن استعمال کے لیے</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* Action 2: Voice Recitation & Tarannum Studio (صوتی اسٹوڈیو)              */}
          {/* ----------------------------------------------------------------------- */}
          {onOpenVoiceStudio && (
            <button
              type="button"
              onClick={onOpenVoiceStudio}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-nastaliq font-bold border transition-all leading-[2.2] cursor-pointer ${
                hasVoiceRecording
                  ? 'bg-red-500/15 border-red-500/50 text-red-700 dark:text-red-300 hover:bg-red-500/25 shadow-xs'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
              title="صوتی ترنم و مشاعرہ اسٹوڈیو (Voice Recitation & Tarannum Studio)"
            >
              <Mic className={`w-3.5 h-3.5 flex-shrink-0 ${hasVoiceRecording ? 'text-red-500 animate-pulse' : 'text-[var(--accent-gold)]'}`} />
              <span className="hidden sm:inline">ترنم اسٹوڈیو</span>
              <span className="sm:hidden">ترنم</span>
              {hasVoiceRecording && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </button>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* Dropdown 3: View & Workspace Layout Presets (منظر و ترتیب)                */}
          {/* Preserves title="طرزِ تقسیم اور نمونے" for Playwright test compatibility */}
          {/* ----------------------------------------------------------------------- */}
          <div className="relative z-50">
            <button
              type="button"
              onClick={() => {
                setShowPresetMenu(!showPresetMenu);
                setShowFileMenu(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-nastaliq font-bold border transition-all leading-[2.2] cursor-pointer ${
                showPresetMenu
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] shadow-xs'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
              title="طرزِ تقسیم اور نمونے"
              aria-expanded={showPresetMenu}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[var(--accent-gold)] flex-shrink-0" />
              <span className="hidden md:inline">{presetLabels[prefs.activePreset]}</span>
              <span className="md:hidden">منظر</span>
              <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${showPresetMenu ? 'rotate-180 text-[var(--accent-gold)]' : ''}`} />
            </button>

            {showPresetMenu && (
              <div
                dir="rtl"
                className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-64 p-2 rounded-2xl shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/98 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="text-[11px] font-bold text-[var(--text-muted)] px-3 py-1 font-nastaliq leading-[2.2] border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                  <span>طرزِ منظر منتخب کریں:</span>
                  <Sparkles className="w-3 h-3 text-[var(--accent-gold)]" />
                </div>

                {/* Preset List */}
                <div className="space-y-0.5">
                  {(Object.keys(presetLabels) as LayoutPreset[]).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        onApplyPreset(preset);
                        setShowPresetMenu(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs sm:text-sm font-nastaliq transition-all flex items-center justify-between leading-[2.2] cursor-pointer ${
                        prefs.activePreset === preset
                          ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold'
                          : 'hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{presetLabels[preset]}</span>
                      {prefs.activePreset === preset && <Check className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Quick Canvas Lock Toggle inside Layout Menu */}
                <div className="pt-1.5 mt-1 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleLock();
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs sm:text-sm font-nastaliq transition-all flex items-center justify-between hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] leading-[2.2] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {prefs.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
                      <span>{prefs.isLocked ? 'کینوس مقفل ہے (ان لاک کریں)' : 'کینوس کو مقفل کریں'}</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] font-mono">
                      {prefs.isLocked ? 'Locked' : 'Unlocked'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* Action 4: Settings Drawer Trigger (خطاطی، فونٹ و موضوع)                 */}
          {/* ----------------------------------------------------------------------- */}
          <button
            type="button"
            onClick={() => {
              setIsSettingsDrawerOpen(true);
              setShowFileMenu(false);
              setShowPresetMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-nastaliq font-bold border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-all leading-[2.2] cursor-pointer"
            title="خطاطی، فونٹ اور موضوع کی ترتیبات"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="hidden lg:inline">تنظیمات</span>
          </button>

          {/* ----------------------------------------------------------------------- */}
          {/* Commercial SaaS Pro Pill or Upgrade Button                             */}
          {/* ----------------------------------------------------------------------- */}
          {activeLicense ? (
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-nastaliq font-bold bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 hover:bg-amber-500/25 transition-all leading-[2.2] shadow-2xs cursor-pointer flex-shrink-0"
              title="آپ کا قلم و قافیہ پرو لائف ٹائم لائسنس تصدیق شدہ اور فعال ہے — تفصیلات کے لیے کلک کریں"
            >
              <Crown className="w-3.5 h-3.5 text-[var(--accent-gold)] flex-shrink-0" />
              <span>👑 پرو مصدقہ</span>
            </button>
          ) : (
            onOpenUpgrade && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Trial Pill (shown on wider displays) */}
                <button
                  type="button"
                  onClick={onOpenUpgrade}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-nastaliq font-bold bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 transition-all leading-[2.2] cursor-pointer"
                  title="مفت آزمائشی میعاد — مکمل پرو ورژن کی تفصیلات کے لیے کلک کریں"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>آزمائش: {trialDaysRemaining} دن</span>
                </button>

                {/* Shimmer Upgrade Button */}
                <button
                  type="button"
                  onClick={onOpenUpgrade}
                  className="btn-gold-shimmer text-black font-bold font-nastaliq px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform leading-[2.2] cursor-pointer flex-shrink-0"
                  title="قلم و قافیہ پرو — تاحیات لائسنس، لامحدود عروضی تقطیع اور مکمل لغت"
                >
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black flex-shrink-0" />
                  <span>پرو حاصل کریں</span>
                </button>
              </div>
            )
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* Consolidated Studio Settings Drawer (Slide-out Panel)                     */}
      {/* ========================================================================= */}
      {isSettingsDrawerOpen && (
        <div
          dir="rtl"
          lang="ur"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsSettingsDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-[var(--bg-card)] border-r border-[var(--border-subtle)] shadow-2xl flex flex-col p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-nastaliq text-[var(--text-primary)] leading-[2.2]">
                    تنظیماتِ اسٹوڈیو
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[2.2]">
                    خطاطی، رسم الخط، رنگت اور ورک اسپیس کی ترتیب
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsDrawerOpen(false)}
                className="p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
                title="بند کریں (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Typography & Font Family */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--accent-gold)] font-nastaliq leading-[2.2] flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>رسم الخط (Nastaliq Font Family)</span>
                </h3>
              </div>

              <div className="space-y-2">
                {fontOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onFontFamilyChange(opt.id)}
                    className={`w-full text-right p-3.5 rounded-2xl border transition-all ${
                      prefs.fontFamily === opt.id
                        ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--text-primary)] shadow-xs'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold font-nastaliq leading-[2.2]">
                        {opt.label}
                      </span>
                      {prefs.fontFamily === opt.id && (
                        <Check className="w-4 h-4 text-[var(--accent-gold)]" />
                      )}
                    </div>
                    {/* Unclipped Live Sample */}
                    <div
                      className="text-base text-[var(--text-primary)] leading-[2.4] pt-1"
                      style={{ fontFamily: opt.id }}
                    >
                      {opt.sample}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Font Size & Line Height Sliders */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-nastaliq mb-1.5 leading-[2.2]">
                  <span className="font-bold text-sm">حجمِ الفاظ (Font Size)</span>
                  <span className="font-mono text-sm font-bold text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-0.5 rounded-md">
                    {prefs.fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="36"
                  step="1"
                  value={prefs.fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer h-2 bg-[var(--bg-card)] rounded-lg"
                />
              </div>

              {/* Line Height */}
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-nastaliq mb-1.5 leading-[2.2]">
                  <span className="font-bold text-sm">سطری فاصلہ (Line Height)</span>
                  <span className="font-mono text-sm font-bold text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-0.5 rounded-md">
                    {prefs.lineHeight.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="3.2"
                  step="0.1"
                  value={prefs.lineHeight}
                  onChange={(e) => onLineHeightChange(Number(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer h-2 bg-[var(--bg-card)] rounded-lg"
                />
                <p className="text-xs text-[var(--text-muted)] mt-2 font-nastaliq leading-[2.2]">
                  نستعلیق کے اعراب، پیش، زبر اور کشش کی حفاظت کے لیے کم از کم ۲.۴ فاصلہ تجویز کیا جاتا ہے۔
                </p>
              </div>
            </div>

            {/* Section 3: Themes (رنگ و موضوع) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--accent-gold)] font-nastaliq leading-[2.2] flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>رنگ و موضوع (Theme Palette)</span>
              </h3>

              <div className="space-y-2">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onThemeChange(opt.id)}
                    className={`w-full text-right p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      opt.iconBg
                    } ${prefs.theme === opt.id ? 'ring-2 ring-[var(--accent-gold)] shadow-md' : 'opacity-85 hover:opacity-100'}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-nastaliq text-sm leading-[2.2]">{opt.label}</span>
                        {prefs.theme === opt.id && <Check className="w-4 h-4 text-[var(--accent-gold)]" />}
                      </div>
                      <p className="text-xs opacity-80 font-nastaliq leading-[2.2]">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Lock Layout Toggle */}
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div>
                  <div className="text-sm font-bold font-nastaliq text-[var(--text-primary)] leading-[2.2]">
                    ورک اسپیس کی ساخت کا قفل
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[2.2]">
                    {prefs.isLocked ? 'طرزِ ترتیب مقفل ہے (تبدیلی محفوظ)' : 'طرزِ ترتیب غیر مقفل ہے'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleLock}
                  className={`p-2.5 rounded-xl border transition-all ${
                    prefs.isLocked
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
                  }`}
                  title={prefs.isLocked ? 'طرزِ ترتیب مقفل ہے' : 'طرزِ ترتیب غیر مقفل ہے'}
                >
                  {prefs.isLocked ? <Lock className="w-4 h-4 text-amber-500" /> : <Unlock className="w-4 h-4 text-[var(--accent-gold)]" />}
                </button>
              </div>
            </div>

            {/* Section 5: PWA & Offline Desktop/Mobile App */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
              <h3 className="text-sm font-bold text-[var(--accent-gold)] font-nastaliq leading-[2.2] flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>ڈیسک ٹاپ و موبائل ایپ (PWA)</span>
              </h3>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold font-nastaliq text-[var(--text-primary)] leading-[2.2]">
                    حالتِ تنصیب (Install Status)
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-nastaliq font-bold border ${
                      isStandalone || isInstalled
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {isStandalone || isInstalled ? 'مستقل ونڈو ایپ' : 'ویب براؤزر'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[2.2]">
                  {isStandalone || isInstalled
                    ? 'قلم و قافیہ آپ کے کمپیوٹر / موبائل پر بطور خود مختار ایپ انسٹال ہے اور بغیر انٹرنیٹ مکمل آف لائن چلتی ہے۔'
                    : 'قلم و قافیہ کو اپنے سسٹم (Mac / Windows / Android / iOS) پر بغیر ایپ اسٹور کے ایک کلک میں انسٹال کریں۔'}
                </p>
                {!isStandalone && (
                  <button
                    type="button"
                    onClick={async () => {
                      const outcome = await promptInstall();
                      if (outcome === 'ios_guide') {
                        setShowInstallHelp(true);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--accent-gold)] text-white hover:opacity-95 font-nastaliq font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs leading-[2.2] cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {canInstall
                        ? 'ابھی ایپ انسٹال کریں'
                        : isIOS
                        ? 'آئی فون / آئی پیڈ پر انسٹالیشن کا طریقہ'
                        : 'ڈیسک ٹاپ پر انسٹال کریں'}
                    </span>
                  </button>
                )}
                {showInstallHelp && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-[var(--text-primary)] font-nastaliq leading-[2.2] animate-in fade-in">
                    💡 <strong>ہدایت:</strong> سفاری براؤزر میں نیچے <strong>Share</strong> کے بٹن پر ٹیپ کریں اور فہرست سے <strong>Add to Home Screen (ہوم اسکرین پر شامل کریں)</strong> منتخب فرمائیں۔
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
