import React, { useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Crown, BookOpen, Feather, Share2 } from 'lucide-react';
import { NastaliqFont } from '../../types/workspace';

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

  const proFeatures = [
    {
      icon: <Sparkles className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: 'لامحدود عروضی تقطیع و اصلاحِ اوزان',
      desc: 'اردو کے ۵۰ کلاسیکی اوزان و بحور پر خودکار تقطیع، عروضی آہنگ کی فوری تصدیق اور اصلاحی تجاویز۔',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: '۶۸,۴۰۰+ الفاظ پر مشتمل خود مختار لغت',
      desc: 'بغیر انٹرنیٹ، تیز رفتار مصدقہ لغت مع اعراب، ہجے، قوافی، ردیف اور عروضی اوزان۔',
    },
    {
      icon: <Feather className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-1" />,
      title: 'دیوانِ اساتذہ کا مکمل کلاسیکی خزانہ',
      desc: 'میر، غالب، اقبال، داغ، مومن، ذوق اور دیگر کلاسیکی اساتذہ کا منتخب کلام مع معانی اور عروضی تقطیع۔',
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
          className="absolute top-5 left-5 p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
          title="بند کریں (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden border border-[var(--accent-gold)]/40 shadow-md bg-[#0f141c]">
            <img src="/logo.jpg" alt="قلم و قافیہ" className="w-full h-full object-cover" />
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[var(--accent-gold)] text-black shadow-xs">
              <Crown className="w-3.5 h-3.5" />
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-[2.2]">
            قلم و قافیہ پرو (Likho Pro)
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto leading-[2.2]">
            اردو شعراء، ادباء اور محققین کے لیے ایک خود مختار، سنجیدہ اور کلاؤڈ سے آزاد عروضی اسٹوڈیو
          </p>

          {/* Trial Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/12 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-sm font-bold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="leading-[2.2]">
              مفت آزمائشی دورانیہ: {trialDaysRemaining} دن باقی ہیں
            </span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 rounded-2xl bg-[var(--bg-surface)] p-4 sm:p-5 border border-[var(--border-subtle)]">
          <h3 className="text-sm font-bold text-[var(--accent-gold)] mb-3 leading-[2.2] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>پرو خصوصیات اور سہولیات</span>
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

        {/* Pricing & Licensing Options */}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-bold transition-all leading-[2.2]"
          >
            آزمائش جاری رکھیں
          </button>

          <button
            type="button"
            className="w-full sm:w-auto btn-gold-shimmer text-black font-bold px-7 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-transform leading-[2.2]"
            onClick={() => {
              // Future checkout integration link
              alert('قلم و قافیہ کے کمرشل ورژن میں آپ کی دلچسپی کا شکریہ! جلد ہی ادائیگی کا خودکار گیٹ وے فعال ہو جائے گا۔');
            }}
          >
            <Crown className="w-4 h-4 text-black" />
            <span>مکمل پرو حاصل کریں</span>
          </button>
        </div>
      </div>
    </div>
  );
};

