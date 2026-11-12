import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Crown,
  BookOpen,
  Feather,
  Share2,
  KeyRound,
  Check,
  AlertCircle,
  Copy,
  LogOut,
} from 'lucide-react';
import { NastaliqFont } from '../../types/workspace';
import {
  licenseVerificationService,
  ActiveLicense,
} from '../../services/licenseVerificationService';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontFamily?: NastaliqFont;
  trialDaysRemaining?: number;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  fontFamily = 'Noto Nastaliq Urdu',
  trialDaysRemaining = 7,
}) => {
  const [activeLicense, setActiveLicense] = useState<ActiveLicense | null>(() =>
    licenseVerificationService.getActiveLicense()
  );
  const [inputKey, setInputKey] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);

  useEffect(() => {
    return licenseVerificationService.subscribe(setActiveLicense);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!inputKey.trim()) {
      setFeedback({
        isSuccess: false,
        text: 'برائے مہربانی اپنا ۲۰ ہندسوں پر مشتمل لائسنس کوڈ درج فرمائیں۔',
      });
      return;
    }

    const result = licenseVerificationService.activate(inputKey, customerName);
    if (result.success) {
      setFeedback({ isSuccess: true, text: result.messageUrdu });
      setInputKey('');
      setCustomerName('');
    } else {
      setFeedback({ isSuccess: false, text: result.messageUrdu });
    }
  };

  const handleDeactivate = () => {
    if (
      window.confirm(
        'کیا آپ واقعی اس کمپیوٹر پر پرو لائسنس غیر فعال کرنا چاہتے ہیں؟ آپ بعد میں یہی کوڈ دوبارہ درج کر کے فعال کر سکتے ہیں۔'
      )
    ) {
      licenseVerificationService.deactivate();
      setFeedback({
        isSuccess: false,
        text: 'پرو لائسنس غیر فعال کر دیا گیا ہے۔ اب آپ آزمائشی ورژن پر ہیں۔',
      });
    }
  };

  const handleCopyKey = () => {
    if (activeLicense?.licenseKey) {
      void navigator.clipboard.writeText(activeLicense.licenseKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const proFeatures = [
    {
      icon: <Sparkles className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: 'لامحدود عروضی تقطیع و اصلاحِ اوزان',
      desc: 'اردو کے ۵۰ کلاسیکی اوزان و بحور پر خودکار تقطیع، عروضی آہنگ کی فوری تصدیق اور اصلاحی تجاویز۔',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: '۱۰۴,۰۰۰+ الفاظ پر مشتمل خود مختار لغت',
      desc: 'بغیر انٹرنیٹ، تیز رفتار مصدقہ لغت مع اعراب، ہجے، قوافی، ردیف اور عروضی اوزان۔',
    },
    {
      icon: <Feather className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: 'دیوانِ اساتذہ کا مکمل کلاسیکی خزانہ و تضمین',
      desc: '۱۰ اساتذہ کا کلام مع زمینِ مشاعرہ میچر اور عروضی موازنہ۔',
    },
    {
      icon: <Share2 className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: 'شاہانہ خطاطی سوشل کارڈز اور پی ڈی ایف',
      desc: 'انسٹاگرام اور سوشل میڈیا کے لیے اعلیٰ معیار کے خطاطی کارڈز اور مطبعی معیار کے پی ڈی ایف برآمد۔',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: '۱۰۰٪ ذاتی و نجی ذخیرۂ کلام (Offline-First)',
      desc: 'آپ کی شاعری کلاؤڈ پر نہیں بلکہ صرف آپ کے کمپیوٹر پر محفوظ رہے گی، تاحیات نجی اور محفوظ۔',
    },
  ];

  return (
    <div
      dir="rtl"
      lang="ur"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      style={{ fontFamily }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
          title="بند کریں (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden border border-[var(--accent-gold)]/40 shadow-md bg-[#0f141c]">
            <img src="/logo.jpg" alt="قلم و قافیہ" className="w-full h-full object-cover" />
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[var(--accent-gold)] text-[var(--text-on-gold)] shadow-xs">
              <Crown className="w-3.5 h-3.5" />
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-[2.2]">
            قلم و قافیہ پرو (Likho Pro)
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto leading-[2.2]">
            اردو شعراء، ادباء اور محققین کے لیے ایک خود مختار، سنجیدہ اور کلاؤڈ سے آزاد عروضی اسٹوڈیو
          </p>

          {/* Status Banner */}
          {activeLicense ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-sm font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="leading-[2.2]">
                مبارک ہو! آپ کا {activeLicense.tierNameUrdu} تصدیق شدہ اور فعال ہے
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/12 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-sm font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="leading-[2.2]">
                مفت آزمائشی دورانیہ: {trialDaysRemaining} دن باقی ہیں
              </span>
            </div>
          )}
        </div>

        {/* Active License Details Card (if already activated) */}
        {activeLicense && (
          <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[var(--accent-gold)]" />
                <span className="font-bold text-sm text-[var(--text-primary)]">
                  فعال پرو لائسنس کی تفصیلات
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                مصدقہ آف لائن ایکٹیویشن ✓
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] block">لائسنس کا درجہ:</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  {activeLicense.tierNameUrdu}
                </span>
              </div>

              {activeLicense.customerName && (
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-muted)] block">رجسٹرڈ خریدار:</span>
                  <span className="font-bold text-[var(--text-primary)] text-sm">
                    {activeLicense.customerName}
                  </span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] sm:col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[var(--text-muted)] block">لائسنس کوڈ:</span>
                  <span className="font-mono font-bold text-sm text-[var(--text-primary)] tracking-widest dir-ltr inline-block">
                    {showFullKey
                      ? activeLicense.licenseKey
                      : activeLicense.licenseKey.replace(
                          /LKHO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/,
                          'LKHO-••••-••••-••••'
                        )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowFullKey(!showFullKey)}
                    className="px-2 py-1 rounded-md text-[11px] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
                  >
                    {showFullKey ? 'چھپائیں' : 'دکھائیں'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
                    title="لائسنس کوڈ کاپی کریں"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'کاپی ہو گیا' : 'کاپی'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">
                یہ لائسنس آپ کے کمپیوٹر پر محفوظ ہے اور ہمیشہ بغیر انٹرنیٹ چلے گا۔
              </span>
              <button
                type="button"
                onClick={handleDeactivate}
                className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>لائسنس منسوخ یا تبدیل کریں</span>
              </button>
            </div>
          </div>
        )}

        {/* License Activation Form (When not activated or switching keys) */}
        {!activeLicense && (
          <div className="p-5 rounded-2xl border border-[var(--accent-gold)]/40 bg-[var(--bg-surface)] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              <KeyRound className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>پرو لائسنس کوڈ ایکٹیویٹ کریں (Enter License Key)</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-[2.2]">
              اگر آپ نے بذریعہ واٹس ایپ، ای میل، بینک ٹرانسفر، JazzCash یا EasyPaisa لائسنس حاصل کیا ہے، تو اپنا ۲۰ ہندسوں کا کوڈ یہاں درج فرما کر ایکٹیویٹ کریں:
            </p>

            <form onSubmit={handleActivate} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(licenseVerificationService.formatKey(e.target.value));
                    setFeedback(null);
                  }}
                  placeholder="LKHO-XXXX-XXXX-XXXX-XXXX"
                  aria-label="لائسنس کلید"
                  className="sm:col-span-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2 font-mono text-sm tracking-wider text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] shadow-2xs uppercase text-center sm:text-left"
                />
                <input
                  type="text"
                  dir="rtl"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="آپ کا نام یا تخلص (اختیاری)"
                  aria-label="خریدار کا نام"
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] shadow-2xs font-nastaliq"
                />
              </div>

              {feedback && (
                <div
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                    feedback.isSuccess
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {feedback.isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[var(--accent-gold)] text-[var(--text-on-gold)] font-bold text-sm cursor-pointer shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>لائسنس کی تصدیق و ایکٹیویشن</span>
              </button>
            </form>
          </div>
        )}

        {/* Feature List */}
        <div className="space-y-3 rounded-2xl bg-[var(--bg-surface)] p-4 sm:p-5 border border-[var(--border-subtle)]">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] mb-3 leading-[2.2] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>پرو خصوصیات اور مستقل سہولیات</span>
          </h3>
          <div className="grid grid-cols-1 gap-3.5">
            {proFeatures.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {item.icon}
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-[var(--text-primary)] leading-[2.2]">
                    {item.title}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] leading-[2.2]">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Licensing Options (Only shown if not yet activated) */}
        {!activeLicense && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Annual Membership */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)] transition-all space-y-2 text-right">
              <div className="text-xs text-[var(--text-secondary)] font-bold leading-[2.2]">
                سالانہ پاس (Annual Access)
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                $29 <span className="text-xs text-[var(--text-secondary)] font-sans">/ سال</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-[2.2]">
                ایک سال تک تمام نئی اپ ڈیٹس اور نئے شعراء کا کلام مع معاونت۔
              </p>
            </div>

            {/* Option 2: Lifetime License (Featured) */}
            <div className="relative p-4 sm:p-5 rounded-2xl border-2 border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 space-y-2 text-right shadow-sm">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-gold)] text-white shadow-xs">
                سب سے مقبول
              </span>
              <div className="text-xs text-[var(--accent-gold)] font-bold leading-[2.2]">
                مستقل تاحیات لائسنس (Lifetime License)
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                $69 <span className="text-xs text-[var(--text-secondary)] font-sans">/ ایک بار</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-[2.2]">
                ہمیشہ کے لیے آپ کا۔ کوئی ماہانہ فیس نہیں، تاحیات اپ ڈیٹس شامل ہیں۔
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] text-sm font-bold transition-all leading-[2.2] cursor-pointer"
          >
            {activeLicense ? 'بند کریں' : 'آزمائش جاری رکھیں'}
          </button>

          {!activeLicense && (
            <div className="text-xs text-[var(--text-muted)] text-center sm:text-left leading-relaxed">
              لائسنس فوری خریدنے کے لیے: <strong className="text-[var(--text-primary)]">ادائیگی بذریعہ بینک / JazzCash دستیاب ہے</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
