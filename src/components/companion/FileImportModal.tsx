import { WordSelectionArea } from '../common/WordSelectionArea';
import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowLeftCircle,
  Layers,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { processFileIngestion, FileIngestionReport } from '../../services/fileIngestionService';

interface FileImportModalProps {
  onLoadToTray: (words: string[]) => void;
  fontFamily: string;
}

export const FileImportModal: React.FC<FileImportModalProps> = ({ onLoadToTray, fontFamily }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<FileIngestionReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadedToTray, setIsLoadedToTray] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith('.txt') && !name.endsWith('.csv') && !name.endsWith('.tsv') && !name.endsWith('.odt')) {
      setErrorMessage('صرف .txt، .csv، .tsv یا .odt فائلیں ہی قبول کی جا سکتی ہیں۔');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setReport(null);

    try {
      const res = await processFileIngestion(file);
      setReport(res);
    } catch (err) {
      setErrorMessage(`فائل پڑھنے میں رکاوٹ: ${(err as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleLoadAllToTray = () => {
    if (report && report.uniqueWords.length > 0) {
      onLoadToTray(report.uniqueWords);
      setIsLoadedToTray(true);
      setTimeout(() => setIsLoadedToTray(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" dir="rtl">
      {/* Header Info */}
      <div className="p-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--accent-gold)]" />
            <h3 className="text-sm font-bold font-nastaliq text-[var(--text-primary)]">
              فائل درآمد برائے قافیہ و لغت (File Ingestion)
            </h3>
          </div>
          <span className="text-[10px] font-nastaliq px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 font-bold">
            کلائنٹ سائیڈ محفوظ انضمام
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] font-nastaliq leading-relaxed">
          اپنے کتب یا الفاظ کی فہرستیں بغیر کسی سرور کے براہِ راست درآمد فرمائیں۔ ہر لفظ مکمل تکرار سے پاک ہو کر آپ کے ذاتی بینک میں شامل ہو گا۔
        </p>

        {/* Formats Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-nastaliq">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <FileText className="w-3 h-3 text-[var(--accent-gold)]" />
            <span>.txt (Plain Text)</span>
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <FileSpreadsheet className="w-3 h-3 text-emerald-500" />
            <span>.csv / .tsv (جدول)</span>
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <Layers className="w-3 h-3 text-sky-500" />
            <span>.odt (اوپن ڈاکومنٹ)</span>
          </span>
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div className="p-3.5 flex-1 overflow-y-auto space-y-3.5 custom-scrollbar">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 scale-102'
              : 'border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/70 bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)]/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.tsv,.odt"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-2xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold font-nastaliq text-[var(--text-primary)]">
                فائل یہاں لا کر چھوڑیں یا منتخب فرمائیں
              </p>
              <p className="text-xs text-[var(--text-muted)] font-nastaliq">
                او ڈی ٹی، ٹی ایکس ٹی، یا سی ایس وی فائل کا انتخاب کریں
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-nastaliq text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تکرار کی مکمل ممانعت (No Duplicates Guaranteed)</span>
            </div>
          </div>
        </div>

        {/* Loading Progress */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center space-y-2">
            <div className="w-6 h-6 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-nastaliq text-[var(--text-primary)]">
              فائل کا تجزیہ اور الفاظ کی تقطیع جاری ہے...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-nastaliq flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Report Card */}
        {report && (
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold font-nastaliq text-[var(--text-primary)]">
                  {report.fileName}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold uppercase">
                {report.fileType}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                  {report.totalRawWords}
                </span>
                <p className="text-[10px] font-nastaliq text-[var(--text-muted)]">کل کلمات</p>
              </div>

              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {report.uniqueWords.length}
                </span>
                <p className="text-[10px] font-nastaliq text-emerald-600 dark:text-emerald-400">
                  منفرد قوافی
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[var(--bg-subtle)]/70 border border-[var(--border-subtle)]">
                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
                  {report.duplicateCount}
                </span>
                <p className="text-[10px] font-nastaliq text-[var(--text-muted)]">فلٹر شدہ تکرار</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-nastaliq text-[var(--text-muted)]">
                {report.persisted ? 'الفاظ ذاتی بینک میں محفوظ ہیں؛ تلفظ کے بغیر اوزان نہیں بنائے گئے۔' : 'الفاظ صرف اس نشست میں دستیاب ہیں؛ مستقل ذخیرہ دستیاب نہیں۔'}
              </span>

              <button
                type="button"
                onClick={handleLoadAllToTray}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-nastaliq font-bold transition-all border ${
                  isLoadedToTray
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/90 shadow-xs'
                }`}
              >
                {isLoadedToTray ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تختی پر منتقل ہو گئے</span>
                  </>
                ) : (
                  <>
                    <ArrowLeftCircle className="w-3.5 h-3.5" />
                    <span>قافیہ تختی پر لائیں</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview of Extracted Words */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-nastaliq text-[var(--text-muted)] font-bold">
                درآمد شدہ قوافی کا نمونہ ({report.uniqueWords.length}):
              </span>
              <WordSelectionArea id="import-preview" label="درآمد شدہ قوافی" resetKey={report.uniqueWords.join("|")} onLoadSelected={onLoadToTray} className="flex flex-wrap gap-1 max-h-36 overflow-y-auto custom-scrollbar p-2 pb-12 rounded-xl bg-[var(--bg-subtle)]/40 border border-[var(--border-subtle)]/60">
                {report.uniqueWords.slice(0, 80).map((w) => (
                  <span
                    key={w}
                    data-selectable-id={w}
                    data-selectable-word={w}
                    style={{ fontFamily }}
                    className="px-2 py-0.5 rounded text-xs font-nastaliq bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    {w}
                  </span>
                ))}
                {report.uniqueWords.length > 80 && (
                  <span className="text-[11px] font-nastaliq text-[var(--accent-gold)] self-center px-1">
                    +{report.uniqueWords.length - 80} مزید الفاظ...
                  </span>
                )}
              </WordSelectionArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
