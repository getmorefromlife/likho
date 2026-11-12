/**
 * Likho Pro (قلم و قافیہ) - Diwan Booklet Export Modal
 * Real-time customizable publication-ready classical Urdu book designer.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Printer,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  FileText,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { PoemDraft } from '../../types/editor';
import { StorageService } from '../../services/storageService';
import { DiwanBookletService, DiwanBookletConfig, PdfProgress } from '../../services/diwanBookletService';

interface DiwanBookletExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPoetName?: string;
  initialTitle?: string;
}

export const DiwanBookletExportModal: React.FC<DiwanBookletExportModalProps> = ({
  isOpen,
  onClose,
  initialPoetName = '',
  initialTitle = '',
}) => {
  const [allDrafts, setAllDrafts] = useState<PoemDraft[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Configuration fields
  const [bookTitle, setBookTitle] = useState(initialTitle || 'دیوانِ قلم و قافیہ');
  const [poetName, setPoetName] = useState(initialPoetName || 'شاعرِ قلم و قافیہ');
  const [subtitle, setSubtitle] = useState('طبعِ اوّل — مجموعۂ کلام');
  const [dedication, setDedication] = useState('بہ نامِ اہلِ ذوق و سخن، اور اردو شاعری کے سچے قدردانوں کے نام...');
  const [pageSize, setPageSize] = useState<'A4' | 'A5'>('A4');
  const [includeTOC, setIncludeTOC] = useState(true);
  const [includeMeters, setIncludeMeters] = useState(true);
  const [previewPageIdx, setPreviewPageIdx] = useState(0);

  // Direct PDF Download Generation States
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<PdfProgress | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Load drafts on open
  useEffect(() => {
    if (isOpen) {
      const drafts = StorageService.getDrafts();
      setAllDrafts(drafts);
      // Select all by default if non-empty
      setSelectedIds(new Set(drafts.map((d) => d.id)));
      if (initialTitle) setBookTitle(initialTitle);
      if (initialPoetName) setPoetName(initialPoetName);
    }
  }, [isOpen, initialTitle, initialPoetName]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const selectedDrafts = useMemo(() => {
    return allDrafts.filter((d) => selectedIds.has(d.id));
  }, [allDrafts, selectedIds]);

  const currentConfig: DiwanBookletConfig = useMemo(() => {
    return {
      title: bookTitle,
      poet: poetName,
      subtitle,
      dedication,
      pageSize,
      fontFamily: 'Noto Nastaliq Urdu',
      includeTOC,
      includeMeters,
      selectedDrafts,
    };
  }, [bookTitle, poetName, subtitle, dedication, pageSize, includeTOC, includeMeters, selectedDrafts]);

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedIds.size === allDrafts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allDrafts.map((d) => d.id)));
    }
  };

  const toggleDraft = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      setDownloadSuccess(false);
      await DiwanBookletService.downloadDirectPDF(currentConfig, (prog) => {
        setPdfProgress(prog);
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Direct PDF export failed:', err);
      alert('پی ڈی ایف برآمد کرنے میں خرابی پیش آئی۔ براہِ کرم دوبارہ کوشش فرمائیں۔');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  const handlePrint = () => {
    const html = DiwanBookletService.generateStandaloneBookletHTML(currentConfig);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      // Allow fonts to render then trigger print
      setTimeout(() => {
        printWindow.print();
      }, 600);
    }
  };

  const handleDownloadHTML = () => {
    DiwanBookletService.downloadStandaloneBooklet(currentConfig);
  };

  const handleOpenNewTab = () => {
    const html = DiwanBookletService.generateStandaloneBookletHTML(currentConfig);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  // Preview pages list: [0 = Cover, 1 = Dedication, 2 = TOC, 3... = Poems]
  const previewPagesCount = 1 + (dedication ? 1 : 0) + (includeTOC ? 1 : 0) + selectedDrafts.length;

  return (
    <div
      dir="rtl"
      lang="ur"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl flex flex-col overflow-hidden text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* Header                                                                    */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)] shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-nastaliq leading-[2.2] flex items-center gap-2">
                <span>دیوان کتابچہ برآمد</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)] text-white font-sans">
                  A4 / A5 Print Ready
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[2.2]">
                اپنے تمام کلام کو روایتی شاہانہ سرورق، فہرست اور صفحہ بندی کے ساتھ طباعت کے لیے تیار کریں
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-white font-nastaliq font-bold text-sm flex items-center gap-2 hover:opacity-95 shadow-xs leading-[2.2] transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
              title="کتابچے کی پی ڈی ایف فائل براہِ راست ڈاؤنلوڈ کریں"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>پی ڈی ایف بن رہی ہے...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                  <span>ڈاؤنلوڈ مکمل! ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span>پی ڈی ایف ڈاؤنلوڈ کریں</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
              title="بند کریں (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Body: Split View (Settings Controls vs Live Realistic Book Preview)       */}
        {/* ========================================================================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column (5 cols): Customization Controls */}
          <div className="lg:col-span-5 p-5 border-l border-[var(--border-subtle)] overflow-y-auto space-y-5 bg-[var(--bg-card)]">
            {/* 1. Book Metadata */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--accent-gold)] font-nastaliq leading-[2.2] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>کتاب و مصنف کی معلومات</span>
              </h3>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold font-nastaliq text-[var(--text-secondary)] mb-1">
                    کتاب کا نام (Diwan Title):
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="مثلاً: دیوانِ غالب، نوائے خامہ..."
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-sm font-nastaliq outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-nastaliq text-[var(--text-secondary)] mb-1">
                    تخلص یا نامِ شاعر (Author / Poet):
                  </label>
                  <input
                    type="text"
                    value={poetName}
                    onChange={(e) => setPoetName(e.target.value)}
                    placeholder="نام یا تخلص درج کریں"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-sm font-nastaliq outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-nastaliq text-[var(--text-secondary)] mb-1">
                    ذیلی عنوان یا اشاعت (Subtitle):
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="مثلاً: طبعِ اوّل، مجموعۂ غزلیات..."
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-sm font-nastaliq outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-nastaliq text-[var(--text-secondary)] mb-1">
                    انتساب یا دیباچہ (Dedication / Preface - اختیاری):
                  </label>
                  <textarea
                    rows={2}
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value)}
                    placeholder="بہ نامِ اہلِ ذوق و سخن..."
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-xs font-nastaliq outline-none transition-colors resize-none leading-[2.2]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Format & Layout Toggles */}
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-[var(--accent-gold)] font-nastaliq leading-[2.2] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>طباعت و صفحات کی ترتیب</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPageSize('A4')}
                  className={`p-2.5 rounded-xl border text-xs font-nastaliq font-bold transition-all leading-[2.2] flex items-center justify-center gap-2 ${
                    pageSize === 'A4'
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>A4 (سٹینڈرڈ کتاب)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPageSize('A5')}
                  className={`p-2.5 rounded-xl border text-xs font-nastaliq font-bold transition-all leading-[2.2] flex items-center justify-center gap-2 ${
                    pageSize === 'A5'
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>A5 (جیبی کتابچہ)</span>
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTOC}
                    onChange={(e) => setIncludeTOC(e.target.checked)}
                    className="accent-[var(--accent-gold)] w-4 h-4 rounded"
                  />
                  <span className="text-xs font-nastaliq font-bold text-[var(--text-primary)] leading-[2.2]">
                    فہرستِ کلام (Table of Contents) شامل کریں
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMeters}
                    onChange={(e) => setIncludeMeters(e.target.checked)}
                    className="accent-[var(--accent-gold)] w-4 h-4 rounded"
                  />
                  <span className="text-xs font-nastaliq font-bold text-[var(--text-primary)] leading-[2.2]">
                    ہر کلام کے نیچے بحر و ردیف کا اندراج کریں
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Drafts Selection */}
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--accent-gold)] font-nastaliq leading-[2.2] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>کلام کا انتخاب ({selectedDrafts.length} / {allDrafts.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-nastaliq text-[var(--accent-gold)] hover:underline leading-[2.2]"
                >
                  {selectedIds.size === allDrafts.length ? 'انتخاب ختم کریں' : 'سب منتخب کریں'}
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {allDrafts.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-4 font-nastaliq">
                    کوئی کلام محفوظ نہیں ہے۔ کینوس پر لکھا ہوا کلام خودکار طور پر کتابچہ میں شامل ہو جائے گا۔
                  </p>
                ) : (
                  allDrafts.map((draft) => {
                    const isChecked = selectedIds.has(draft.id);
                    const lineCount = (draft.content || '').split('\n').filter((l) => l.trim()).length;
                    return (
                      <div
                        key={draft.id}
                        onClick={() => toggleDraft(draft.id)}
                        className={`p-2 rounded-xl border text-xs font-nastaliq transition-all flex items-center justify-between cursor-pointer leading-[2.2] ${
                          isChecked
                            ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)]/40 text-[var(--text-primary)] font-bold'
                            : 'border-transparent hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                          )}
                          <span className="truncate">{draft.title || 'بے عنوان'}</span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] font-sans flex-shrink-0">
                          {lineCount} مصرعے
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={handleDownloadPDF}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-gold)] text-white font-nastaliq font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md leading-[2.2] transition-transform active:scale-98 cursor-pointer disabled:opacity-60"
                title="کتابچے کی پی ڈی ایف فائل براہِ راست ڈاؤنلوڈ کریں"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span>پی ڈی ایف تیار ہو رہی ہے...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                    <span>پی ڈی ایف ڈاؤنلوڈ ہو گئی! ✓</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 flex-shrink-0" />
                    <span>📥 براہِ راست پی ڈی ایف ڈاؤنلوڈ کریں</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadHTML}
                  className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] font-nastaliq font-bold text-xs flex items-center justify-center gap-1.5 leading-[2.2] transition-colors"
                  title="آف لائن ایچ ٹی ایم ایل کتاب ڈاؤنلوڈ کریں"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>HTML کتاب</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] font-nastaliq font-bold text-xs flex items-center justify-center gap-1.5 leading-[2.2] transition-colors"
                  title="براہِ راست کسی ہارڈ ویئر پرنٹر پر بھیجیں"
                >
                  <Printer className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>پرنٹر پر بھیجیں</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  className="py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] font-nastaliq font-bold text-xs flex items-center justify-center gap-1.5 leading-[2.2] transition-colors"
                  title="نئے ٹیب میں مکمل کتاب کا پیش منظر دیکھیں"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>نئے ٹیب میں</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Live Realistic Book Preview */}
          <div className="lg:col-span-7 p-6 bg-[#f5efe4] dark:bg-[#15120d] flex flex-col justify-between overflow-y-auto">
            {/* Preview Navigation Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2d5c0] dark:border-[#2e261b]">
              <div className="text-xs font-bold font-nastaliq text-[#8a5615] leading-[2.2] flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>پیش منظرِ کتابچہ: صفحہ {DiwanBookletService.toUrduDigits(previewPageIdx + 1)} از {DiwanBookletService.toUrduDigits(Math.max(1, previewPagesCount))}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={previewPageIdx === 0}
                  onClick={() => setPreviewPageIdx((p) => Math.max(0, p - 1))}
                  className="p-1.5 rounded-lg bg-white/80 dark:bg-black/30 border border-[#d6c7ae] dark:border-[#382f22] disabled:opacity-40 text-[#8a5615] hover:bg-white transition-colors"
                  title="پچھلا صفحہ"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={previewPageIdx >= previewPagesCount - 1}
                  onClick={() => setPreviewPageIdx((p) => Math.min(previewPagesCount - 1, p + 1))}
                  className="p-1.5 rounded-lg bg-white/80 dark:bg-black/30 border border-[#d6c7ae] dark:border-[#382f22] disabled:opacity-40 text-[#8a5615] hover:bg-white transition-colors"
                  title="اگلا صفحہ"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Realistic Paper Page Container */}
            <div className="flex-1 flex items-center justify-center py-2">
              <div
                className={`w-full max-w-[480px] min-h-[580px] bg-white text-[#1a1612] p-8 shadow-2xl rounded-sm border border-[#e0d6c4] flex flex-col justify-between transition-all duration-300 font-nastaliq ${
                  pageSize === 'A5' ? 'scale-95' : 'scale-100'
                }`}
                style={{
                  backgroundImage: 'radial-gradient(#faf6ee 15%, transparent 16%)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Dynamic Page Rendering based on previewPageIdx */}
                {previewPageIdx === 0 ? (
                  // Cover Page Preview
                  <div className="border-[3px] border-double border-[#8a5615] h-full p-2 flex flex-col">
                    <div className="border border-[#b3823d] h-full p-6 flex flex-col justify-between text-center items-center">
                      <div>
                        <div className="text-xs text-[#8a5615] tracking-widest mb-1">❦ ❦ ❦</div>
                        <p className="text-sm font-amiri text-[#8a5615]">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                      </div>

                      <div className="my-auto py-6">
                        <h1 className="text-3xl font-bold text-[#8a5615] leading-[2.2]">{bookTitle || 'دیوانِ کلام'}</h1>
                        {subtitle && <h2 className="text-sm text-[#5a4225] leading-[2.2] mt-1">{subtitle}</h2>}
                        <div className="w-16 h-0.5 bg-[#8a5615]/40 mx-auto my-4"></div>
                        <p className="text-xs text-[#7a6652] leading-[2.2]">کلام و نگارشِ</p>
                        <h3 className="text-2xl font-bold text-[#1a1612] leading-[2.2]">{poetName || 'شاعر'}</h3>
                      </div>

                      <div className="pt-4 border-t border-[#e8decb] w-full text-center">
                        <div className="text-lg">⚜️</div>
                        <p className="text-xs text-[#8a5615] font-bold leading-[2.2]">
                          سنۂ اشاعت: {DiwanBookletService.toUrduDigits(new Date().getFullYear())}ء
                        </p>
                        <p className="text-[10px] text-[#8a7a6a] leading-[2.2]">
                          قلم و قافیہ — اسٹوڈیو برائے شعر و ادب
                        </p>
                      </div>
                    </div>
                  </div>
                ) : previewPageIdx === 1 && dedication ? (
                  // Dedication Page Preview
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-[#e8decb] pb-2 text-xs text-[#8a5615]">
                      <span>{bookTitle}</span>
                      <span>انتساب</span>
                    </div>

                    <div className="my-auto text-center px-4 py-8">
                      <h2 className="text-xl font-bold text-[#8a5615] leading-[2.2]">انتساب</h2>
                      <div className="text-sm text-[#8a5615] my-2">❦</div>
                      <p className="text-sm text-[#332b24] leading-[2.6] whitespace-pre-line mt-4">
                        {dedication}
                      </p>
                    </div>

                    <div className="border-t border-[#e8decb] pt-2 text-center text-xs text-[#8a5615] font-bold">
                      — {DiwanBookletService.toUrduDigits(2)} —
                    </div>
                  </div>
                ) : previewPageIdx === (dedication ? 2 : 1) && includeTOC ? (
                  // TOC Page Preview
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-[#e8decb] pb-2 text-xs text-[#8a5615]">
                      <span>{bookTitle}</span>
                      <span>فہرستِ کلام</span>
                    </div>

                    <div className="my-auto py-4">
                      <h2 className="text-xl font-bold text-[#8a5615] text-center leading-[2.2]">فہرستِ کلام</h2>
                      <div className="text-sm text-[#8a5615] text-center my-1">❦</div>
                      <div className="space-y-2 mt-4 max-h-[360px] overflow-hidden">
                        {selectedDrafts.slice(0, 8).map((draft, idx) => (
                          <div key={draft.id} className="flex items-center justify-between text-xs leading-[2.2]">
                            <span className="text-[#8a5615] font-bold w-6">{DiwanBookletService.toUrduDigits(idx + 1)}.</span>
                            <span className="font-bold flex-1 truncate">{draft.title || 'بے عنوان'}</span>
                            <span className="border-b border-dotted border-[#b3823d] flex-1 mx-2"></span>
                            <span className="text-[#8a5615] font-bold">{DiwanBookletService.toUrduDigits(idx + 3)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#e8decb] pt-2 text-center text-xs text-[#8a5615] font-bold">
                      — {DiwanBookletService.toUrduDigits(dedication ? 3 : 2)} —
                    </div>
                  </div>
                ) : (
                  // Poem Page Preview
                  (() => {
                    const nonPoemPagesOffset = 1 + (dedication ? 1 : 0) + (includeTOC ? 1 : 0);
                    const poemIdx = Math.max(0, previewPageIdx - nonPoemPagesOffset);
                    const draft = selectedDrafts[poemIdx] || selectedDrafts[0];

                    if (!draft) {
                      return (
                        <div className="h-full flex items-center justify-center text-xs text-stone-400">
                          کوئی کلام منتخب نہیں ہے
                        </div>
                      );
                    }

                    const couplets = DiwanBookletService.parsePoemCouplets(draft.content || '').slice(0, 4);

                    return (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center border-b border-[#e8decb] pb-2 text-xs text-[#8a5615]">
                          <span>{poetName}</span>
                          <span>{bookTitle}</span>
                        </div>

                        <div className="my-auto text-center py-4">
                          <h2 className="text-lg font-bold text-[#8a5615] leading-[2.2]">{draft.title || 'بے عنوان'}</h2>
                          {includeMeters && draft.meterName && (
                            <p className="text-[11px] text-[#6a5845] leading-[2.2]">بحر: {draft.meterName}</p>
                          )}
                          <div className="text-xs text-[#8a5615] my-1">❦</div>

                          <div className="space-y-3 mt-4">
                            {couplets.map((c, i) => (
                              <div key={i} className="text-center">
                                <div className="text-sm text-[#1a1612] leading-[2.6]">{c.misra1}</div>
                                {c.misra2 && <div className="text-sm text-[#1a1612] leading-[2.6]">{c.misra2}</div>}
                                <div className="text-[9px] text-[#b3823d] opacity-60 mt-1">✦</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-[#e8decb] pt-2 text-center text-xs text-[#8a5615] font-bold">
                          — {DiwanBookletService.toUrduDigits(previewPageIdx + 1)} —
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Bottom Status Tips */}
            <div className="text-center text-[11px] text-[#8a5615] font-nastaliq leading-[2.2] pt-2">
              💡 <strong>براہِ راست پی ڈی ایف ڈاؤنلوڈ:</strong> «پی ڈی ایف ڈاؤنلوڈ کریں» پر کلک کرنے سے کتابچہ درست ابعاد ({pageSize})، حاشیوں اور شاہانہ مغلائی بارڈرز کے ساتھ سیدھا آپ کے کمپیوٹر میں بطور .pdf محفوظ ہو جاتا ہے، جس سے لوکل پریویو کی خرابی اور ڈسپلے کے مسائل مکمل ختم ہو جاتے ہیں۔
            </div>
          </div>
        </div>

        {/* Full-Modal Progress Overlay during PDF Generation */}
        {isGeneratingPdf && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-200">
            <div className="w-14 h-14 border-4 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
            <h3 className="text-xl font-bold font-nastaliq leading-[2.2]">پی ڈی ایف کتابچہ تیار ہو رہا ہے...</h3>
            <p className="text-sm text-amber-200 font-nastaliq leading-[2.2] max-w-sm mt-1">
              {pdfProgress?.message || 'کتاب کے صفحات مرتب کیے جا رہے ہیں...'}
            </p>
            {pdfProgress && (
              <div className="w-64 bg-white/20 rounded-full h-2.5 mt-4 overflow-hidden p-0.5 border border-white/30">
                <div
                  className="bg-[var(--accent-gold)] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((pdfProgress.current / pdfProgress.total) * 100)}%` }}
                ></div>
              </div>
            )}
            <p className="text-xs text-white/70 font-nastaliq mt-3 leading-[2.2]">
              براہِ کرم چند لمحے انتظار فرمائیں، پی ڈی ایف فائل خودکار طور پر ڈاؤنلوڈ ہو جائے گی
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
