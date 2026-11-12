/**
 * Likho Pro (قلم و قافیہ) - Karachi Book Publishing & Print-on-Demand Desk
 * Enables poets and authors to get physical copies of their Diwan / books printed in Karachi
 * with transparent quotations, multiple binding styles, paper stocks, ISBN registration,
 * and direct WhatsApp ordering to the publishing coordinators.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Layers,
  Award,
  Copy,
  Check,
} from 'lucide-react';
import { DiwanBookletConfig, DiwanPageSize } from '../../services/diwanBookletService';

interface KarachiPublishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DiwanBookletConfig;
  estimatedPages: number;
}

export type BindingStyle = 'hardcover_gold' | 'paperback_matte' | 'deluxe_velvet';
export type PaperStock = 'swedish_cream_80' | 'white_offset_75';
export type PrintQuantity = 50 | 100 | 250 | 500 | 1000;

export const KarachiPublishingModal: React.FC<KarachiPublishingModalProps> = ({
  isOpen,
  onClose,
  config,
  estimatedPages,
}) => {
  const [copies, setCopies] = useState<PrintQuantity>(100);
  const [binding, setBinding] = useState<BindingStyle>('hardcover_gold');
  const [paper, setPaper] = useState<PaperStock>('swedish_cream_80');
  const [includeISBN, setIncludeISBN] = useState(true);
  const [includeProofreading, setIncludeProofreading] = useState(true);
  const [includeCoverDesign, setIncludeCoverDesign] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState<'karachi' | 'pakistan' | 'international'>('karachi');
  const [poetContact, setPoetContact] = useState('');
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  // Resolution of format name
  const formatLabel = useMemo(() => {
    const map: Record<DiwanPageSize, string> = {
      whatsapp_hd: 'واٹس ایپ ایچ ڈی (موبائل ایڈیشن)',
      crown_octavo: 'کراؤن دیوان (5.5" × 8.5" — روایتی اردو سائز)',
      royal_octavo: 'ڈیمی سائز (6" × 9" — شاہانہ کتاب)',
      A4: 'A4 سٹینڈرڈ (8.3" × 11.7")',
      A5: 'A5 جیبی بیاض (5.8" × 8.3")',
    };
    return map[config.pageSize] || 'کراؤن سائز';
  }, [config.pageSize]);

  // Transparent pricing model based on Karachi Urdu Bazaar market rates
  const quote = useMemo(() => {
    const pages = Math.max(16, estimatedPages);
    
    // Base plate and prepress setup
    const baseSetup = copies <= 100 ? 9500 : 13500;

    // Per-page printing and paper cost (based on sheets needed)
    const paperPerSheet = paper === 'swedish_cream_80' ? 5.5 : 4.2;
    const sheetsPerBook = Math.ceil(pages / 8); // 8 pages per signature
    const printingCost = sheetsPerBook * paperPerSheet * copies;

    // Binding cost per copy
    let bindingCostPerCopy = 150; // paperback default
    if (binding === 'hardcover_gold') bindingCostPerCopy = 420;
    if (binding === 'deluxe_velvet') bindingCostPerCopy = 750;
    const totalBindingCost = bindingCostPerCopy * copies;

    // Add-on services
    const isbnCost = includeISBN ? 4500 : 0;
    const proofreadingCost = includeProofreading ? Math.min(12000, Math.max(4000, Math.round(pages * 90))) : 0;
    const coverDesignCost = includeCoverDesign ? 6000 : 0;

    // Delivery cost
    let deliveryCost = 0; // Karachi free local delivery
    if (deliveryCity === 'pakistan') deliveryCost = Math.round(copies * 22);
    if (deliveryCity === 'international') deliveryCost = Math.round(copies * 160);

    const subtotal = baseSetup + printingCost + totalBindingCost + isbnCost + proofreadingCost + coverDesignCost + deliveryCost;
    const perCopyCost = Math.round(subtotal / copies);

    return {
      totalPKR: subtotal,
      perCopyPKR: perCopyCost,
      pages,
      copies,
      isbnCost,
      proofreadingCost,
      coverDesignCost,
      deliveryCost,
    };
  }, [estimatedPages, copies, binding, paper, includeISBN, includeProofreading, includeCoverDesign, deliveryCity]);

  if (!isOpen) return null;

  // Format currency with Urdu digits
  const formatPKR = (amount: number) => {
    return amount.toLocaleString('en-PK') + ' روپے';
  };

  // Pre-filled WhatsApp message for Karachi Press desk
  const generateWhatsAppMessage = () => {
    const lines = [
      `السلام علیکم! میں Likho (قلم و قافیہ) پلیٹ فارم سے اپنی کتاب طبع کروانے کے لیے رابطہ کر رہا ہوں۔`,
      ``,
      `📖 کتاب کا نام: ${config.title || 'دیوانِ کلام'}`,
      `✍️ مصنف / شاعر: ${config.poet || 'شاعر'}`,
      `📑 تخمینہ صفحات: تقریباً ${quote.pages} صفحات`,
      `📐 منتخب سائز: ${formatLabel}`,
      `📚 کاپیوں کی تعداد: ${copies} جلدیں`,
      `🎨 جلد بندی کی قسم: ${binding === 'hardcover_gold' ? 'ہارڈ باؤنڈ مع گولڈن فوائل مہر' : binding === 'deluxe_velvet' ? 'مخملی ڈسٹ کور مع ریبن' : 'پیپر بیک میٹ لیمینیشن'}`,
      `📄 کاغذ کی قسم: ${paper === 'swedish_cream_80' ? '۸۰ گرام سویڈش کریمی کاغذ' : '۷۵ گرام وائٹ آفسیٹ کاغذ'}`,
      `🏷️ آئی ایس بی این (ISBN): ${includeISBN ? 'شامل ہے ✓' : 'نہیں'}`,
      `🔍 ادبی پروف ریڈنگ: ${includeProofreading ? 'شامل ہے ✓' : 'نہیں'}`,
      `🚚 ترسیل / ڈلیوری: ${deliveryCity === 'karachi' ? 'کراچی (مفت ڈلیوری)' : deliveryCity === 'pakistan' ? 'پاکستان بھر میں ترسیل' : 'بین الاقوامی ترسیل'}`,
      poetContact ? `📞 رابطہ نمبر: ${poetContact}` : '',
      `💰 آن لائن تخمینہ لاگت: تقریباً ${formatPKR(quote.totalPKR)} (فی کتاب: ${formatPKR(quote.perCopyPKR)})`,
      ``,
      `براہِ کرم اس آرڈر کی توثیق اور حتمی تفصیلات سے آگاہ فرمائیں۔ شکریہ!`,
    ];
    return lines.filter(Boolean).join('\n');
  };

  const handleOpenWhatsApp = () => {
    const phone = '923001234567'; // Centralized Karachi Publishing Desk WhatsApp number
    const message = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCopySpecs = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-nastaliq text-right">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--accent-gold)] leading-[2]">
                🖨️ کراچی میں کتاب طبع کروائیں (Print My Book in Karachi)
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                اردو بازار کراچی کے مستند پرنٹنگ پریس نیٹ ورک کے ذریعے معیاری طباعت، ہارڈ باؤنڈ جلد، اور مفت ڈلیوری
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors"
            title="بند کریں (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2 Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto">
          {/* Left Column (7 cols): Configuration & Specifications */}
          <div className="lg:col-span-7 p-6 border-l border-[var(--border-subtle)] space-y-5 overflow-y-auto">
            {/* Book Info Summary Pill */}
            <div className="p-3.5 rounded-2xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <BookOpen className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
                <span className="font-bold truncate">{config.title || 'دیوانِ کلام'}</span>
                <span className="text-[var(--text-muted)] font-sans">از {config.poet || 'شاعر'}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] font-bold text-[var(--accent-gold)] flex-shrink-0">
                {quote.pages} صفحات
              </span>
            </div>

            {/* 1. Print Quantity */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-secondary)]">
                کاپیوں کی مطلوبہ تعداد (Print Quantity):
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {([50, 100, 250, 500, 1000] as PrintQuantity[]).map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setCopies(qty)}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all text-center ${
                      copies === qty
                        ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] shadow-xs'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{qty} جلدیں</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Binding Style */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-[var(--text-secondary)]">
                جلد بندی کی ساخت (Book Binding Style):
              </label>
              <div className="space-y-2">
                <label
                  onClick={() => setBinding('hardcover_gold')}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    binding === 'hardcover_gold'
                      ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] text-[var(--text-primary)] shadow-xs'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
                    <div>
                      <p className="font-bold text-xs">ہارڈ باؤنڈ مع گولڈن فوائل مہر (Royal Hardcover)</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-sans">
                        مضبوط ہارڈکور، سنہری نقوش، مغلئی مہر اور پائیدار سلائی والی جلد
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--accent-gold)] font-sans">تجویز کردہ ✓</span>
                </label>

                <label
                  onClick={() => setBinding('paperback_matte')}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    binding === 'paperback_matte'
                      ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] text-[var(--text-primary)] shadow-xs'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
                    <div>
                      <p className="font-bold text-xs">پیپر بیک کارڈ مع میٹ لیمینیشن (Standard Paperback)</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-sans">
                        ۳۵۰ گرام آرٹ کارڈ، نفاست بخش میٹ لیمینیشن اور گرم گم بائنڈنگ
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text-muted)] font-sans">کم لاگت</span>
                </label>

                <label
                  onClick={() => setBinding('deluxe_velvet')}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    binding === 'deluxe_velvet'
                      ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] text-[var(--accent-gold)] shadow-xs'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
                    <div>
                      <p className="font-bold text-xs">مخملی ڈسٹ کور مع ریبن مارکر (Deluxe Velvet)</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-sans">
                        مخملی کور، سنہری صفحہ نما ریبن اور ہارڈ گفٹ باکس (سووینئر ایڈیشن)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--accent-gold)] font-sans">پریمیئم</span>
                </label>
              </div>
            </div>

            {/* 3. Paper Selection */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-[var(--text-secondary)]">
                کاغذ کی قسم (Inner Book Paper Stock):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaper('swedish_cream_80')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-right ${
                    paper === 'swedish_cream_80'
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <p className="font-bold text-xs">۸۰ گرام سویڈش کریمی کاغذ</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-sans">آنکھوں کے لیے پرسکون و کلاسیکی</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaper('white_offset_75')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-right ${
                    paper === 'white_offset_75'
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <p className="font-bold text-xs">۷۵ گرام وائٹ آفسیٹ کاغذ</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-sans">خستہ سفید و معیاری چھپائی</p>
                </button>
              </div>
            </div>

            {/* 4. Add-on Publishing Services */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-[var(--text-secondary)]">
                اضافی اشاعتی خدمات (Add-on Publishing Services):
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeISBN}
                      onChange={(e) => setIncludeISBN(e.target.checked)}
                      className="accent-[var(--accent-gold)] w-4 h-4 rounded"
                    />
                    <span className="font-bold">حکومتی آئی ایس بی این (ISBN) رجسٹریشن و بارکوڈ اندراج</span>
                  </div>
                  <span className="text-xs text-[var(--accent-gold)] font-sans">+ 4,500 روپے</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeProofreading}
                      onChange={(e) => setIncludeProofreading(e.target.checked)}
                      className="accent-[var(--accent-gold)] w-4 h-4 rounded"
                    />
                    <span className="font-bold">اساتذۂ سخن سے حتمی املا، اعراب و عروضی پروف ریڈنگ</span>
                  </div>
                  <span className="text-xs text-[var(--accent-gold)] font-sans">+ {formatPKR(quote.proofreadingCost)}</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeCoverDesign}
                      onChange={(e) => setIncludeCoverDesign(e.target.checked)}
                      className="accent-[var(--accent-gold)] w-4 h-4 rounded"
                    />
                    <span className="font-bold">ماہر خطاط و آرٹسٹ سے اختصاصی سرورق (Custom Title Art) ڈیزائن</span>
                  </div>
                  <span className="text-xs text-[var(--accent-gold)] font-sans">+ 6,000 روپے</span>
                </label>
              </div>
            </div>

            {/* 5. Delivery Location */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-[var(--text-secondary)]">
                کتابوں کی ترسیل / ڈلیوری کا مقام:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryCity('karachi')}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    deliveryCity === 'karachi'
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span>کراچی (مفت ڈلیوری)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryCity('pakistan')}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    deliveryCity === 'pakistan'
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span>پاکستان بھر میں ترسیل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryCity('international')}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    deliveryCity === 'international'
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span>بیرونِ ملک کارگو</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live Quotation & Instant WhatsApp Order Desk */}
          <div className="lg:col-span-5 p-6 bg-[#faf7f2] dark:bg-[#120f0a] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="pb-3 border-b border-[#e2d5c0] dark:border-[#2e261b]">
                <h3 className="text-sm font-bold text-[#8a5615] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>شفاف تخمینہ لاگت و پیکیج سمری</span>
                </h3>
                <p className="text-[11px] text-[#7a6652] font-sans mt-0.5">
                  اردو بازار کراچی پریس کے مستند ریٹس کے مطابق لائیو حساب کتاب
                </p>
              </div>

              {/* Price Display Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1610] border border-[#d6c7ae] dark:border-[#3a2e1d] shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#e8decb] dark:border-[#2a2216]">
                  <span className="text-xs text-[#7a6652] font-sans">تعدادِ جلد (Copies):</span>
                  <span className="font-bold text-sm text-[#8a5615]">{copies} کتب</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#e8decb] dark:border-[#2a2216]">
                  <span className="text-xs text-[#7a6652] font-sans">فی کتاب تخمینہ (Per Copy):</span>
                  <span className="font-bold text-sm text-[var(--text-primary)] font-sans">{formatPKR(quote.perCopyPKR)}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-bold text-sm text-[#8a5615]">کل تخمینہ پیکیج:</span>
                    <p className="text-[10px] text-[#8a7a6a] font-sans">چھپائی، جلد بندی، اور ڈلیوری سمیت</p>
                  </div>
                  <span className="text-xl font-bold text-[#8a5615] font-sans">
                    {formatPKR(quote.totalPKR)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 text-[11px] text-[#6a5845] font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>پریس بھیجنے سے پہلے مکمل ڈیجیٹل پروف (Soft Copy) بذریعہ واٹس ایپ توثیق</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>کراچی میں مصنف کے گھر تک ۱۰۰٪ محفوظ اور بلامعاوضہ ڈلیوری</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>قلم و قافیہ پلیٹ فارم سے براہِ راست پریس ریڈی سیٹنگ</span>
                </div>
              </div>

              {/* Poet Contact Input */}
              <div>
                <label className="block text-xs font-bold text-[#7a6652] mb-1">
                  آپ کا واٹس ایپ یا رابطہ نمبر (اختیاری):
                </label>
                <input
                  type="text"
                  value={poetContact}
                  onChange={(e) => setPoetContact(e.target.value)}
                  placeholder="مثلاً: 03001234567"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a1610] border border-[#d6c7ae] dark:border-[#3a2e1d] text-xs font-sans outline-none focus:border-[#8a5615]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-nastaliq font-bold text-sm flex items-center justify-center gap-2 shadow-lg leading-[2.2] transition-transform active:scale-98 cursor-pointer"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>💬 کراچی پریس ڈیسک پر واٹس ایپ آرڈر بھیجیں</span>
              </button>

              <button
                type="button"
                onClick={handleCopySpecs}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#1a1610] border border-[#d6c7ae] dark:border-[#3a2e1d] hover:border-[#8a5615] text-[#8a5615] font-nastaliq font-bold text-xs flex items-center justify-center gap-1.5 leading-[2.2] transition-colors cursor-pointer"
              >
                {copiedSpecs ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>آرڈر سمری کاپی ہو گئی! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>آرڈر سمری اور تفصیلات کاپی کریں</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
