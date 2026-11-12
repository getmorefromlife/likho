import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  Copy,
  Download,
  Image,
  BookOpen,
  Cloud,
} from 'lucide-react';
import { ExportService } from '../../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  poet: string;
  content: string;
  onOpenCardModal: () => void;
  onOpenBookletModal?: () => void;
  onOpenGoogleDrive?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  poet,
  content,
  onOpenCardModal,
  onOpenBookletModal,
  onOpenGoogleDrive,
}) => {
  const [copiedGoogleDocs, setCopiedGoogleDocs] = useState(false);

  if (!isOpen) return null;

  const handleCopyGoogleDocs = async () => {
    const success = await ExportService.copyForGoogleDocs(title, poet, content);
    if (success) {
      setCopiedGoogleDocs(true);
      setTimeout(() => setCopiedGoogleDocs(false), 3000);
    }
  };

  const handleExportText = () => {
    ExportService.exportPlainText(title, poet, content);
  };

  const handleExportRTF = () => {
    ExportService.exportRTF(title, poet, content);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[var(--accent-gold)]" />
            <h3 className="font-nastaliq font-bold text-base text-[var(--text-primary)]">
              کلام برآمد کریں (Multi-Format Export)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بند کریں"
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Export Options Grid */}
        <div className="p-5 space-y-3">
          {/* 0. Diwan Booklet Export (Premier Feature) */}
          {onOpenBookletModal && (
            <div
              onClick={() => {
                onClose();
                onOpenBookletModal();
              }}
              className="group p-3.5 rounded-xl border-2 border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 hover:bg-[var(--accent-gold)]/20 cursor-pointer transition-all flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-gold)] text-white flex items-center justify-center shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-nastaliq font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <span>مکمل دیوان کتابچہ برآمد (Printable Diwan Booklet / PDF)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-gold)] text-white font-sans">
                      A4 / A5
                    </span>
                  </h4>
                  <p className="font-nastaliq text-[11px] text-[var(--text-muted)]">
                    شاہانہ سرورق، فہرستِ کلام اور حاشیوں کے ساتھ مکمل کتابچہ طباعت و پی ڈی ایف کے لیے تیار کریں۔
                  </p>
                </div>
              </div>
              <span className="text-xs font-nastaliq text-[var(--accent-gold)] font-bold group-hover:translate-x-[-4px] transition-transform">
                کتابچہ بنائیں ←
              </span>
            </div>
          )}

          {/* 1. PDF Print */}
          <div
            onClick={handlePrintPDF}
            className="group p-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-surface)]/60 hover:bg-[var(--accent-gold)]/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-nastaliq font-bold text-sm text-[var(--text-primary)]">
                  پی ڈی ایف پرنٹ (PDF / Print Layout)
                </h4>
                <p className="font-nastaliq text-[11px] text-[var(--text-muted)]">
                  روایتی آرائشی حاشیوں اور نستعلیق فارمیٹ کے ساتھ پرنٹ اور پی ڈی ایف محفوظ کریں۔
                </p>
              </div>
            </div>
            <span className="text-xs font-nastaliq text-[var(--accent-gold)] font-medium group-hover:translate-x-[-4px] transition-transform">
              پرنٹ کریں ←
            </span>
          </div>

          {/* 2. Microsoft Word (RTF) */}
          <div
            onClick={handleExportRTF}
            className="group p-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-surface)]/60 hover:bg-[var(--accent-gold)]/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-nastaliq font-bold text-sm text-[var(--text-primary)]">
                  مائیکروسافٹ ورڈ (Word .DOC / RTF)
                </h4>
                <p className="font-nastaliq text-[11px] text-[var(--text-muted)]">
                  ایم ایس ورڈ میں دائیں سے بائیں (RTL) رخ اور نستعلیق فونٹس کو برقرار رکھتا ہے۔
                </p>
              </div>
            </div>
            <span className="text-xs font-nastaliq text-[var(--accent-gold)] font-medium group-hover:translate-x-[-4px] transition-transform">
              ڈاؤنلوڈ ←
            </span>
          </div>

          {/* 3. Google Docs Clipboard Copy */}
          <div
            onClick={handleCopyGoogleDocs}
            className="group p-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-surface)]/60 hover:bg-[var(--accent-gold)]/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-nastaliq font-bold text-sm text-[var(--text-primary)]">
                  گوگل ڈوکس کاپی (Google Docs Clipboard)
                </h4>
                <p className="font-nastaliq text-[11px] text-[var(--text-muted)]">
                  براہِ راست گوگل ڈوکس میں پیسٹ کریں، فارمیٹ اور نستعلیق خودکار محفوظ رہے گا۔
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-nastaliq font-medium ${
                copiedGoogleDocs ? 'text-emerald-500 font-bold' : 'text-[var(--accent-gold)]'
              }`}
            >
              {copiedGoogleDocs ? 'کاپی ہو گیا ✓' : 'کاپی کریں ←'}
            </span>
          </div>

          {/* Google Drive & Docs Cloud Backup & Export */}
          {onOpenGoogleDrive && (
            <div
              onClick={() => {
                onClose();
                onOpenGoogleDrive();
              }}
              className="group p-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[#4285F4] bg-[#4285F4]/5 hover:bg-[#4285F4]/15 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4285F4]/15 text-[#4285F4] border border-[#4285F4]/30 flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-nastaliq font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>گوگل ڈرائیو و دستاویز (Google Drive & Docs)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#4285F4]/20 text-[#4285F4] font-sans font-bold">Cloud</span>
                  </h4>
                  <p className="font-nastaliq text-[11px] text-[var(--text-muted)]">
                    کلام کو گوگل کلاؤڈ پر بیک اپ کریں یا گوگل ڈاکس میں برآمد فرما کر محفوظ رکھیں۔
                  </p>
                </div>
              </div>
              <span className="text-xs font-nastaliq text-[#4285F4] font-medium group-hover:translate-x-[-4px] transition-transform">
                کھولیں ←
              </span>
            </div>
          )}

          {/* 4. Calligraphy Image Card */}
          <div
            onClick={() => {
              onClose();
              onOpenCardModal();
            }}
            className="group p-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-surface)]/60 hover:bg-[var(--accent-gold)]/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-nastaliq font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                  <span>خطاطی تصویری کارڈ (Calligraphy Card .PNG)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-gold)] text-white">
                    نئی خصوصیت
                  </span>
                </h4>
                <p className="font-nastaliq text-[11px] text-[var(--text-muted)]">
                  اشعار کا دیدہ زیب خطاطی کارڈ تیار کر کے سوشل میڈیا پر شیئر کریں۔
                </p>
              </div>
            </div>
            <span className="text-xs font-nastaliq text-[var(--accent-gold)] font-medium group-hover:translate-x-[-4px] transition-transform">
              کارڈ بنائیں ←
            </span>
          </div>

          {/* 5. Plain Text (.txt) */}
          <div
            onClick={handleExportText}
            className="group p-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-surface)]/60 hover:bg-[var(--accent-gold)]/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-nastaliq font-bold text-sm text-[var(--text-primary)]">
                  سادہ متن (Plain Text .TXT)
                </h4>
                <p className="font-nastaliq text-[11px] text-[var(--text-muted)]">
                  صاف اور شفاف UTF-8 انکوڈنگ کے ساتھ سادہ فائل ڈاؤنلوڈ کریں۔
                </p>
              </div>
            </div>
            <span className="text-xs font-nastaliq text-[var(--accent-gold)] font-medium group-hover:translate-x-[-4px] transition-transform">
              ڈاؤنلوڈ ←
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center text-xs text-[var(--text-muted)] font-nastaliq">
          قلم و قافیہ — اردو شاعری و عروض کا نگارخانہ
        </div>
      </div>
    </div>
  );
};
