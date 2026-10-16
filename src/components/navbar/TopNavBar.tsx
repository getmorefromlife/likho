import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Type,
  Maximize2,
  Minimize2,
  Download,
  PlusCircle,
  Check,
  ChevronDown,
  Sparkles,
  Palette,
  Sliders,
} from 'lucide-react';
import { WorkspacePrefs, LayoutPreset, ThemeId, NastaliqFont } from '../../types/workspace';

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
  isSaved?: boolean;
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
  isSaved = true,
}) => {
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const fontOptions: { id: NastaliqFont; label: string }[] = [
    { id: 'Noto Nastaliq Urdu', label: 'نوٹو نستعلیق (Noto Nastaliq)' },
    { id: 'Jameel Noori Nastaliq', label: 'جمیل نوری نستعلیق (Jameel Noori)' },
    { id: 'Mehr Nastaliq Web', label: 'مہر نستعلیق ویب (Mehr Nastaliq)' },
    { id: 'Gulzar', label: 'گلزار (Gulzar)' },
  ];

  const themeOptions: { id: ThemeId; label: string; iconBg: string }[] = [
    { id: 'sepia', label: 'کاغذ (Sepia)', iconBg: 'bg-[#F4EEDC] text-[#2C241E] border-[#D4AF37]' },
    { id: 'dark', label: 'شبینہ (Obsidian)', iconBg: 'bg-[#12151B] text-[#F3EDE0] border-[#3E4554]' },
    { id: 'white', label: 'سادہ (Clean Canvas)', iconBg: 'bg-[#FFFFFF] text-[#1E1E1E] border-[#E0E0E0]' },
  ];

  const presetLabels: Record<LayoutPreset, string> = {
    classic: 'کلاسیکی (Classic)',
    zen: 'گوشۂ تنہائی (Zen)',
    swapped: 'معکوس (Swapped)',
    bottom_dock: 'تہہ نشین (Bottom Dock)',
  };

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 backdrop-blur-md z-30 select-none">
      {/* Right Side: Branding, Subtitle, and Badges in a single horizontal row */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Pen Icon */}
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)] flex items-center justify-center text-[var(--accent-gold)] font-bold shadow-inner flex-shrink-0">
          <span className="text-xl">✒</span>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold font-nastaliq text-[var(--text-primary)] leading-normal flex-shrink-0">
          قلم و قافیہ
        </h1>

        {/* Divider dot */}
        <div className="hidden md:block w-1 h-1 rounded-full bg-[var(--border-subtle)]"></div>

        {/* Subtitle inline */}
        <span className="hidden md:inline-block text-xs md:text-sm font-nastaliq text-[var(--text-secondary)] leading-normal flex-shrink-0">
          اسٹوڈیو برائے شعر و ادب
        </span>

        {/* Prosody Studio Badge */}
        <span className="hidden lg:inline-block text-[10px] font-sans font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 flex-shrink-0">
          PROSODY STUDIO
        </span>

        {/* Auto-Save Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] flex-shrink-0 shadow-2xs font-nastaliq">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>{isSaved ? 'محفوظ شدہ' : 'محفوظ ہو رہا ہے...'}</span>
        </div>
      </div>

      {/* Middle & Left Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Typography Controls Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTypographyMenu(!showTypographyMenu);
              setShowThemeMenu(false);
              setShowPresetMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] transition-colors text-[var(--text-primary)]"
            title="خط اور فونٹ کی ترتیبات"
          >
            <Type className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span className="hidden sm:inline">خطاطی</span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">{prefs.fontSize}px</span>
            <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
          </button>

          {showTypographyMenu && (
            <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-72 p-4 rounded-xl shadow-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] z-50 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>خطاطی اور فاصلہ</span>
                <Sliders className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              </h3>

              {/* Font Family */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  رسم الخط (Font Family)
                </label>
                <div className="space-y-1">
                  {fontOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => onFontFamilyChange(opt.id)}
                      className={`w-full text-right px-2.5 py-1.5 rounded-lg text-sm font-nastaliq transition-all flex items-center justify-between ${
                        prefs.fontFamily === opt.id
                          ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold border border-[var(--accent-gold)]/40'
                          : 'hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {prefs.fontFamily === opt.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Slider */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                  <span>حجم (Font Size)</span>
                  <span className="font-mono text-[var(--accent-gold)]">{prefs.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="36"
                  step="1"
                  value={prefs.fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              {/* Line Height Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                  <span>سطری فاصلہ (Line Height)</span>
                  <span className="font-mono text-[var(--accent-gold)]">{prefs.lineHeight.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="3.2"
                  step="0.1"
                  value={prefs.lineHeight}
                  onChange={(e) => onLineHeightChange(Number(e.target.value))}
                  className="w-full accent-[var(--accent-gold)] cursor-pointer"
                />
                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-nastaliq">
                  نستعلیق کے لیے اعراب کی حفاظت کی خاطر کم از کم 2.4 فاصلہ تجویز کیا جاتا ہے۔
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Theme Palette Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowTypographyMenu(false);
              setShowPresetMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] transition-colors text-[var(--text-primary)]"
            title="رنگ و موضوع (Theme)"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span className="hidden sm:inline">موضوع</span>
            <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
          </button>

          {showThemeMenu && (
            <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-52 p-3 rounded-xl shadow-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] z-50 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onThemeChange(opt.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-nastaliq transition-all flex items-center justify-between border ${
                      opt.iconBg
                    } ${prefs.theme === opt.id ? 'ring-2 ring-[var(--accent-gold)]' : 'opacity-85 hover:opacity-100'}`}
                  >
                    <span>{opt.label}</span>
                    {prefs.theme === opt.id && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Layout Presets Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPresetMenu(!showPresetMenu);
              setShowTypographyMenu(false);
              setShowThemeMenu(false);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] transition-colors text-[var(--text-primary)]"
            title="طرزِ تقسیم اور نمونے"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>{presetLabels[prefs.activePreset]}</span>
            <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
          </button>

          {showPresetMenu && (
            <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-56 p-2 rounded-xl shadow-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] z-50 animate-in fade-in slide-in-from-top-2">
              {(Object.keys(presetLabels) as LayoutPreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    onApplyPreset(preset);
                    setShowPresetMenu(false);
                  }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-xs font-nastaliq transition-all flex items-center justify-between ${
                    prefs.activePreset === preset
                      ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold'
                      : 'hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                  }`}
                >
                  <span>{presetLabels[preset]}</span>
                  {prefs.activePreset === preset && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dedicated Lock / Unlock Button */}
        <button
          onClick={onToggleLock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
            prefs.isLocked
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
          }`}
          title={prefs.isLocked ? 'طرزِ ترتیب مقفل ہے' : 'طرزِ ترتیب غیر مقفل ہے'}
        >
          {prefs.isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline font-nastaliq">مقفل</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="hidden md:inline font-nastaliq">غیر مقفل</span>
            </>
          )}
        </button>

        {/* Zen Mode Button */}
        <button
          onClick={onToggleZen}
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1 ${
            prefs.isZenMode
              ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)]'
              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
          }`}
          title="گوشۂ تنہائی (Zen Focus Mode)"
        >
          {prefs.isZenMode ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-nastaliq">خروج</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span className="hidden md:inline font-nastaliq">تنہائی</span>
            </>
          )}
        </button>

        <div className="h-6 w-px bg-[var(--border-subtle)] mx-0.5"></div>

        {/* New Poem Button */}
        <button
          onClick={onNewPoem}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] transition-colors"
          title="نیا کلام شروع کریں"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span className="hidden sm:inline font-nastaliq">نیا کلام</span>
        </button>

        {/* Export Modal Trigger */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--accent-gold)] hover:brightness-110 text-white font-bold transition-all shadow-sm"
          title="کلام برآمد کریں (Export)"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="font-nastaliq">برآمد</span>
        </button>
      </div>
    </header>
  );
};
