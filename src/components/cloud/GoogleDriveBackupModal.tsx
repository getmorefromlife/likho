import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  Cloud,
  ExternalLink,
  Download,
  Upload,
  Check,
  CheckCircle2,
  FolderSync,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { PoemDraft } from '../../types/editor';
import { GoogleDriveService } from '../../services/googleDriveService';
import { StorageService } from '../../services/storageService';

interface GoogleDriveBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDraft: PoemDraft;
  fontFamily: string;
  onPortfolioRestored?: (drafts: PoemDraft[]) => void;
}

export const GoogleDriveBackupModal: React.FC<GoogleDriveBackupModalProps> = ({
  isOpen,
  onClose,
  currentDraft,
  fontFamily,
  onPortfolioRestored,
}) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'drive'>('docs');
  const [docsScope, setDocsScope] = useState<'current' | 'all'>('current');
  const [copySuccess, setCopySuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Load all drafts from storage
  const allDrafts = useMemo(() => StorageService.getDrafts(), [isOpen]);

  // Generate preview of formatted document
  const previewData = useMemo(() => {
    if (docsScope === 'current') {
      return GoogleDriveService.formatPoemForGoogleDoc(currentDraft);
    } else {
      return GoogleDriveService.formatDiwanForGoogleDoc(allDrafts);
    }
  }, [docsScope, currentDraft, allDrafts]);

  if (!isOpen) return null;

  const handleCopyAndLaunch = async () => {
    setCopySuccess(false);
    setStatusMessage(null);

    let success = false;
    if (docsScope === 'current') {
      success = await GoogleDriveService.copyAndLaunchGoogleDocs(currentDraft);
    } else {
      success = await GoogleDriveService.copyDiwanAndLaunchGoogleDocs(allDrafts);
    }

    if (success) {
      setCopySuccess(true);
      setStatusMessage({
        text: 'کلام کلپ بورڈ میں کاپی ہو گیا اور گوگل ڈاکس کا نیا صفحہ کھل گیا ہے! نئی ونڈو میں صرف Ctrl+V (یا پیسٹ) دبائیں۔',
      });
      setTimeout(() => setCopySuccess(false), 4000);
    } else {
      setStatusMessage({
        text: 'کلپ بورڈ تک رسائی نہیں ہو سکی۔ آپ متبادل طور پر نیچے سے .doc فائل ڈاؤن لوڈ کر سکتے ہیں۔',
        isError: true,
      });
    }
  };

  const handleDownloadDoc = () => {
    const filename = docsScope === 'current'
      ? (currentDraft.title?.trim() || 'کلام')
      : 'مکمل_دیوان_قلم_و_قافیہ';
    GoogleDriveService.downloadAsGoogleDocFile(filename, previewData.html);
  };

  const handleDownloadDriveJson = () => {
    GoogleDriveService.downloadDriveBackupJson();
    setStatusMessage({
      text: 'مکمل دیوان کی بیک اپ فائل (JSON) ڈاؤن لوڈ ہو گئی ہے۔ آپ اسے اپنی گوگل ڈرائیو میں محفوظ فرما سکتے ہیں۔',
    });
  };

  const handleOpenGoogleDrive = () => {
    window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('کیا آپ گوگل ڈرائیو کی اس بیک اپ فائل سے اپنا دیوان بحال کرنا چاہتے ہیں؟ موجودہ کلام بازیابی کے لیے محفوظ رہے گا۔')) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.restoreBackup(content);
      if (res.success && res.drafts) {
        onPortfolioRestored?.(res.drafts);
        setStatusMessage({
          text: 'دیوان کامیابی کے ساتھ گوگل ڈرائیو بیک اپ سے بحال ہو گیا!',
        });
      } else {
        setStatusMessage({
          text: res.error || 'بیک اپ فائل پڑھنے میں خرابی پیش آئی۔',
          isError: true,
        });
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div
      dir="rtl"
      lang="ur"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#4285F4]/15 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4] flex-shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-nastaliq text-[var(--text-primary)] leading-[2.0]">
                گوگل ڈرائیو و دستاویز (Google Drive & Docs)
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[1.8]">
                اپنے مسودات کو گوگل کلاؤڈ پر محفوظ کریں یا گوگل ڈاکس میں برآمد کریں
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            title="بند کریں (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--border-subtle)] px-6 pt-3 bg-[var(--bg-card)] gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-nastaliq font-bold border-b-2 transition-all cursor-pointer leading-[2.0] ${
              activeTab === 'docs'
                ? 'border-[#4285F4] text-[#4285F4]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>گوگل ڈاکس برآمد (Google Docs)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-nastaliq font-bold border-b-2 transition-all cursor-pointer leading-[2.0] ${
              activeTab === 'drive'
                ? 'border-[var(--accent-gold)] text-[var(--accent-gold)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FolderSync className="w-4 h-4" />
            <span>گوگل ڈرائیو کلاؤڈ بیک اپ (Cloud Backup)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-nastaliq border leading-[2.0] flex items-start gap-2.5 animate-in fade-in ${
                statusMessage.isError
                  ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div>{statusMessage.text}</div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: GOOGLE DOCS EXPORT & 1-CLICK PASTE                                */}
          {/* ========================================================================= */}
          {activeTab === 'docs' && (
            <div className="space-y-5">
              {/* Scope Selection */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <div className="text-xs font-bold text-[var(--text-secondary)] font-nastaliq leading-[1.8]">
                  برآمد کا دائرہ کار منتخب کریں:
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDocsScope('current')}
                    className={`p-3 rounded-xl border text-right font-nastaliq transition-all cursor-pointer leading-[2.0] ${
                      docsScope === 'current'
                        ? 'bg-[#4285F4]/15 border-[#4285F4] text-[var(--text-primary)] shadow-xs'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[#4285F4]/50'
                    }`}
                  >
                    <div className="text-sm font-bold flex items-center justify-between">
                      <span>موجودہ کلام</span>
                      {docsScope === 'current' && <Check className="w-4 h-4 text-[#4285F4]" />}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {currentDraft.title || 'لا عنوان کلام'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocsScope('all')}
                    className={`p-3 rounded-xl border text-right font-nastaliq transition-all cursor-pointer leading-[2.0] ${
                      docsScope === 'all'
                        ? 'bg-[#4285F4]/15 border-[#4285F4] text-[var(--text-primary)] shadow-xs'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[#4285F4]/50'
                    }`}
                  >
                    <div className="text-sm font-bold flex items-center justify-between">
                      <span>مکمل دیوان (تمام کلام)</span>
                      {docsScope === 'all' && <Check className="w-4 h-4 text-[#4285F4]" />}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {allDrafts.length} مسودات مع فہرستِ کلام
                    </div>
                  </button>
                </div>
              </div>

              {/* Main 1-Click Launch Button */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#4285F4]/10 via-[#4285F4]/5 to-transparent border border-[#4285F4]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#4285F4]">
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span className="font-bold font-nastaliq text-base leading-[2.0]">
                    ۱-کلک گوگل ڈاکس میں برآمد
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] font-nastaliq leading-[2.2]">
                  یہ بٹن دبانے سے آپ کا کلام خوبصورت نستعلیق فونٹ، دائیں سے بائیں (RTL) رخ اور اشعار کی جوڑیوں کے ساتھ کلپ بورڈ پر کاپی ہو جائے گا اور گوگل ڈاکس کی نئی ونڈو کھل جائے گی۔ آپ کو صرف وہاں جا کر پیسٹ کرنا ہوگا!
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyAndLaunch}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-nastaliq font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md leading-[2.0] cursor-pointer"
                  >
                    {copySuccess ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    <span>کاپی کریں اور گوگل ڈاکس کھولیں</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadDoc}
                    className="py-3 px-4 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[#4285F4] text-[var(--text-primary)] font-nastaliq font-bold text-sm flex items-center justify-center gap-2 transition-all leading-[2.0] cursor-pointer"
                    title="گوگل ڈاکس و ایم ایس ورڈ فائل ڈاؤن لوڈ کریں"
                  >
                    <Download className="w-4 h-4 text-[#4285F4]" />
                    <span>.doc فائل ڈاؤن لوڈ</span>
                  </button>
                </div>
              </div>

              {/* Document Preview Box */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[var(--text-secondary)] font-nastaliq flex items-center justify-between">
                  <span>دستاویز کا پیش نظارہ (Document Preview):</span>
                  <span className="font-sans text-[11px] text-[var(--text-muted)]">RTL Formatted</span>
                </div>
                <div
                  className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] max-h-48 overflow-y-auto text-xs text-[var(--text-primary)] leading-[2.4] font-nastaliq text-center"
                  style={{ fontFamily }}
                >
                  <div className="font-bold text-base text-[var(--accent-gold)] mb-1">
                    {docsScope === 'current' ? (currentDraft.title || 'لا عنوان کلام') : 'دیوانِ سخن'}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mb-3">
                    {docsScope === 'current' ? (currentDraft.meterName ? `بحر: ${currentDraft.meterName}` : '') : `${allDrafts.length} مسودات`}
                  </div>
                  <pre className="whitespace-pre-wrap font-nastaliq text-xs opacity-90">
                    {previewData.plain.slice(0, 450)}...
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: GOOGLE DRIVE CLOUD BACKUP & RESTORE                               */}
          {/* ========================================================================= */}
          {activeTab === 'drive' && (
            <div className="space-y-5">
              {/* Privacy Assurance Card */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-nastaliq leading-[2.2]">
                  <strong>۱۰۰٪ مکمل رازداری اور تحفظ:</strong> آپ کا کلام کسی غیر متعلقہ سرور پر نہیں جاتا۔ تمام فائلز براہِ راست آپ کے اپنے ذاتی گوگل اکاؤنٹ کی ڈرائیو میں محفوظ ہوتی ہیں۔
                </div>
              </div>

              {/* Step 1 & 2: Quick Drive Backup without complex OAuth setup */}
              <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-[var(--accent-gold)]" />
                  <h3 className="text-base font-bold font-nastaliq text-[var(--text-primary)] leading-[2.0]">
                    آسان اور فوری گوگل ڈرائیو بیک اپ
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Download Backup Button */}
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-sm font-bold font-nastaliq text-[var(--text-primary)] leading-[2.0]">
                        ۱. بیک اپ فائل حاصل کریں
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[1.8]">
                        پورے دیوان اور تمام مسودات کی محفوظ JSON فائل ڈاؤن لوڈ کریں۔
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadDriveJson}
                      className="w-full py-2.5 px-3 rounded-xl bg-[var(--accent-gold)] text-white hover:opacity-95 font-nastaliq font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all leading-[2.0] cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>بیک اپ فائل ڈاؤن لوڈ کریں</span>
                    </button>
                  </div>

                  {/* Open Google Drive Button */}
                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-sm font-bold font-nastaliq text-[var(--text-primary)] leading-[2.0]">
                        ۲. گوگل ڈرائیو پر اپلوڈ کریں
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[1.8]">
                        گوگل ڈرائیو کھول کر فائل کو اپنے کسی بھی پسندیدہ فولڈر میں محفوظ فرمائیں۔
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenGoogleDrive}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-nastaliq font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all leading-[2.0] cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>گوگل ڈرائیو کھولیں</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Restore from Google Drive Backup */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-nastaliq text-[var(--text-primary)] leading-[2.0]">
                      گوگل ڈرائیو سے دیوان بحال کریں (Restore from Drive)
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] font-nastaliq leading-[1.8]">
                      اگر آپ نے پہلے بیک اپ فائل گوگل ڈرائیو میں رکھی ہے، تو اسے یہاں منتخب کر کے بحال کریں۔
                    </p>
                  </div>
                </div>

                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] font-nastaliq font-bold text-xs sm:text-sm cursor-pointer transition-colors leading-[2.0]">
                  <Upload className="w-4 h-4 text-[var(--accent-gold)]" />
                  <span>گوگل ڈرائیو بیک اپ فائل (.json) منتخب کریں</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-xs font-nastaliq text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>سخن — کلاؤڈ اور دستاویزاتی تحفظ برائے شعراء</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold transition-colors cursor-pointer leading-[2.0]"
          >
            بند کریں
          </button>
        </div>
      </div>
    </div>
  );
};
