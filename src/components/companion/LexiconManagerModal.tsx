import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Upload,
  Download,
  CheckCircle,
  Database,
  FileText,
  Sparkles,
  AlertCircle,
  Search,
  Filter,
  ShieldAlert,
  Edit3,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import {
  AroozLexiconService,
  QUARANTINE_REASON_LABELS,
} from '../../services/aroozLexiconService';
import { ProsodicPatternView } from '../common/ProsodicPatternView';
import type {
  QuarantinedEntry,
  UserPronunciationProposal,
  ReviewStatus,
} from '../../services/aroozLexiconService';
import { parsePronunciation } from '../../services/urduPhonology';
import { FOOT_NAMES } from '../../data/prosodyMeters';

interface LexiconManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontFamily: string;
  initialTab?: 'quarantine' | 'approved' | 'import';
  initialWord?: string;
}

export const LexiconManagerModal: React.FC<LexiconManagerModalProps> = ({
  isOpen,
  onClose,
  fontFamily,
  initialTab = 'quarantine',
  initialWord,
}) => {
  const [activeTab, setActiveTab] = useState<'quarantine' | 'approved' | 'import'>(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialWord || '');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'quarantined' | 'unreviewed' | 'approved'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Editing state for a pronunciation proposal
  const [editingTarget, setEditingTarget] = useState<{
    word: string;
    sourceId: string;
    vocalized?: string;
    divisions?: string;
    reason?: string;
    patterns?: string[];
  } | null>(null);

  const [propPattern, setPropPattern] = useState('');
  const [propVocalized, setPropVocalized] = useState('');
  const [propDivisions, setPropDivisions] = useState('');
  const [propStatus, setPropStatus] = useState<ReviewStatus>('approved');
  const [propNotes, setPropNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveWarningMsg, setSaveWarningMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Bulk import state
  const [format, setFormat] = useState<'tsv' | 'json'>('tsv');
  const [inputText, setInputText] = useState('');
  const [totalCount, setTotalCount] = useState(AroozLexiconService.getTotalWordCount());
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats
  const [lexStats, setLexStats] = useState(AroozLexiconService.getVocabularyStats());

  useEffect(() => {
    if (isOpen) {
      setTotalCount(AroozLexiconService.getTotalWordCount());
      setLexStats(AroozLexiconService.getVocabularyStats());
      setStatusMsg(null);
      if (initialWord) {
        setSearchQuery(initialWord);
      }
    }
    const unsub = AroozLexiconService.subscribe(() => {
      setTotalCount(AroozLexiconService.getTotalWordCount());
      setLexStats(AroozLexiconService.getVocabularyStats());
    });
    return unsub;
  }, [isOpen, initialWord]);

  // Quarantined records list
  const quarantinedList = useMemo<QuarantinedEntry[]>(() => {
    return AroozLexiconService.getQuarantinedEntries();
  }, []);

  // Filtered quarantined records
  const filteredQuarantined = useMemo<QuarantinedEntry[]>(() => {
    return quarantinedList.filter((entry) => {
      if (reasonFilter !== 'all' && entry.reason !== reasonFilter) return false;

      const existingProposal = AroozLexiconService.getProposal(entry.word);
      const currentStatus: ReviewStatus = existingProposal ? existingProposal.status : 'quarantined';

      if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.trim().toLowerCase();
      return (
        entry.word.includes(q) ||
        entry.sourceId.toLowerCase().includes(q) ||
        (entry.vocalized || '').includes(q) ||
        (entry.divisions || '').includes(q) ||
        (entry.reason || '').toLowerCase().includes(q)
      );
    });
  }, [quarantinedList, reasonFilter, statusFilter, searchQuery, lexStats]);

  // Approved proposals list
  const approvedProposals = useMemo<UserPronunciationProposal[]>(() => {
    const all = AroozLexiconService.getAllProposals();
    return all.filter((p) => p.status === 'approved');
  }, [lexStats]);

  const filteredApproved = useMemo<UserPronunciationProposal[]>(() => {
    if (!searchQuery.trim()) return approvedProposals;
    const q = searchQuery.trim().toLowerCase();
    return approvedProposals.filter(
      (p) =>
        p.word.includes(q) ||
        p.pattern.includes(q) ||
        (p.sourceReference || '').toLowerCase().includes(q) ||
        (p.notes || '').toLowerCase().includes(q)
    );
  }, [approvedProposals, searchQuery]);

  // Pagination calculations
  const displayedItems = activeTab === 'approved' ? filteredApproved : filteredQuarantined;
  const totalPages = Math.max(1, Math.ceil(displayedItems.length / itemsPerPage));
  const paginatedItems = displayedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenProposalEditor = (entry: {
    word: string;
    sourceId: string;
    vocalized?: string;
    divisions?: string;
    reason?: string;
    patterns?: string[];
  }) => {
    setEditingTarget(entry);
    setValidationError(null);
    setSaveSuccessMsg(null);
    setSaveWarningMsg(null);

    const existing = AroozLexiconService.getProposal(entry.word);
    if (existing) {
      setPropPattern(existing.pattern);
      setPropVocalized(existing.vocalized || entry.vocalized || '');
      setPropDivisions(existing.divisions || entry.divisions || '');
      setPropStatus(existing.status);
      setPropNotes(existing.notes || '');
    } else {
      // Suggest default from patterns if available
      const defaultPat = entry.patterns?.[0] ? entry.patterns[0].replace(/\s+/g, '') : '';
      setPropPattern(defaultPat);
      setPropVocalized(entry.vocalized?.trim() || '');
      setPropDivisions(entry.divisions?.trim() || '');
      setPropStatus('approved');
      setPropNotes('');
    }
  };

  const handlePatternChange = (val: string) => {
    setPropPattern(val);
    setValidationError(null);
  };

  const handleAppendPatternSymbol = (sym: string) => {
    setPropPattern((prev) => prev.trim() + sym);
    setValidationError(null);
  };

  const handleDeriveWeightFromVocalized = () => {
    if (!propVocalized.trim()) {
      setValidationError('پہلے اعراب والا لفظ درج فرمائیں');
      return;
    }
    const result = parsePronunciation(propVocalized.trim());
    if (result.error) {
      setValidationError(`صوتی انحراف: ${result.error}`);
    } else {
      setPropPattern(result.pattern);
      setValidationError(null);
    }
  };

  const handleSaveProposal = async () => {
    if (!editingTarget) return;

    const cleanPattern = propPattern.replace(/\s+/g, '');
    if (!cleanPattern) {
      setValidationError('وزن درج کرنا لازمی ہے (مثلاً =- یا -==)');
      return;
    }
    if (!/^[-=x]{1,64}$/u.test(cleanPattern)) {
      setValidationError('وزن میں صرف - (کوتاہ)، = (بلند) اور x (لچکدار) استعمال فرمائیں');
      return;
    }

    setIsSaving(true);
    setValidationError(null);
    setSaveSuccessMsg(null);
    setSaveWarningMsg(null);

    try {
      const result = await AroozLexiconService.saveProposal({
        word: editingTarget.word,
        pattern: cleanPattern,
        vocalized: propVocalized.trim(),
        divisions: propDivisions.trim(),
        status: propStatus,
        sourceReference: editingTarget.sourceId,
        rejectionReason: editingTarget.reason,
        notes: propNotes.trim(),
      });

      if (!result.success) {
        setValidationError(result.error || 'اندراج محفوظ نہ ہو سکا');
      } else if (!result.persisted) {
        // The in-memory reading is usable now, but nothing durable committed.
        setSaveWarningMsg(
          propStatus === 'approved'
            ? 'یہ تبدیلی صرف اسی نشست میں دستیاب ہے؛ مستقل ذخیرہ ناکام رہا۔ لغت کا JSON بیک اپ برآمد کر لیں۔'
            : 'یہ مسودہ صرف اسی نشست میں دستیاب ہے؛ مستقل ذخیرہ ناکام رہا۔ لغت کا JSON بیک اپ برآمد کر لیں۔'
        );
      } else {
        setSaveSuccessMsg(
          propStatus === 'approved'
            ? 'مصدقہ تلفظ محفوظ ہو گیا۔ تقطیع اور خودکار اصلاح کے لیے فعال ہے۔'
            : 'مسودہ محفوظ ہو گیا۔ خودکار اصلاحات کے لیے تاحال غیر فعال ہے۔'
        );
        setTimeout(() => {
          setEditingTarget(null);
        }, 1200);
      }
    } catch (err) {
      setValidationError(`محفوظ کرنے میں خطا: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProposal = async () => {
    if (!editingTarget) return;
    setIsSaving(true);
    setValidationError(null);
    setSaveSuccessMsg(null);
    setSaveWarningMsg(null);
    try {
      const result = await AroozLexiconService.deleteProposal(editingTarget.word);
      if (!result.success) {
        setValidationError('یہ تجویز پہلے سے موجود نہیں تھی۔');
      } else if (!result.persisted) {
        setSaveWarningMsg('تجویز اس نشست سے خارج ہو گئی، مگر مستقل حذف ناکام رہا؛ دوبارہ لوڈ کرنے پر واپس آ سکتی ہے۔');
      } else {
        setSaveSuccessMsg('تجویز خارج کر کے لفظ کو واپس قرنطینہ میں منتقل کر دیا گیا۔');
        setTimeout(() => {
          setEditingTarget(null);
        }, 900);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSample = () => {
    if (format === 'tsv') {
      setInputText(
        `# نمونہ جدول (TSV): لفظ اور وزن\nبصیرت\t- = =\nحقیقت\t- = =\nکلام\t- = -\nقرآن\t= = -\nدلکش\t= =`
      );
    } else {
      setInputText(
        JSON.stringify(
          {
            بصیرت: ['- = ='],
            حقیقت: ['- = ='],
            کلام: ['- = -'],
            قرآن: ['= = -'],
            دلکش: ['= ='],
          },
          null,
          2
        )
      );
    }
  };

  const handleImport = async () => {
    if (!inputText.trim()) {
      setStatusMsg({ text: 'براہِ کرم الفاظ کا مواد درج فرمائیں', isError: true });
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const result = await AroozLexiconService.bulkImport(inputText, format);
      setTotalCount(result.totalCount);
      setStatusMsg({
        text: result.persisted
          ? `${result.importedCount} ذاتی اندراجات محفوظ ہو گئے۔ کل ذخیرہ: ${result.totalCount}۔`
          : 'اندراجات اس نشست میں دستیاب ہیں؛ مستقل ذخیرہ دستیاب نہیں۔ JSON بیک اپ برآمد کر لیں۔',
      });
      setInputText('');
    } catch (err) {
      setStatusMsg({
        text: `درآمد میں خرابی: ${(err as Error).message}`,
        isError: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    const jsonStr = AroozLexiconService.exportLexiconAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urdu_lexicon_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ fontFamily }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-text animate-fade-in font-nastaliq"
    >
      <div role="dialog" aria-label="Prosody Lexicon Review" className="relative w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
                لغتِ عروض، قرنطینہ و نظرثانی (Prosody Lexicon Review)
              </h3>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--text-muted)] font-mono">
                <span className="inline-flex items-center gap-1 text-[var(--accent-gold)] font-bold">
                  <Sparkles className="w-3 h-3" />
                  {totalCount.toLocaleString()} کل ذخیرہ
                </span>
                <span>•</span>
                <span className="text-amber-500 font-sans font-medium">
                  {lexStats.quarantined} قرنطینہ
                </span>
                <span>•</span>
                <span className="text-emerald-500 font-sans font-medium">
                  {lexStats.approvedProposals} مصدقہ تجاویز
                </span>
              </div>
            </div>
          </div>
          <button
            aria-label="بند کریں"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 px-5 pt-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('quarantine');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold text-xs transition-all ${
                activeTab === 'quarantine'
                  ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--bg-card)] rounded-t-lg'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>قرنطینہ شدہ الفاظ ({lexStats.quarantined})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('approved');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold text-xs transition-all ${
                activeTab === 'approved'
                  ? 'border-emerald-500 text-emerald-500 bg-[var(--bg-card)] rounded-t-lg'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>مصدقہ ذاتی اوزان ({lexStats.approvedProposals})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold text-xs transition-all ${
                activeTab === 'import'
                  ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--bg-card)] rounded-t-lg'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>درآمد و برآمد (TSV / JSON)</span>
            </button>
          </div>

          <p dir="rtl" className="text-[11px] text-[var(--text-muted)] hidden md:block">
            {activeTab === 'quarantine' && 'غیر معتبر ماخذی اندراجات الگ رکھے گئے ہیں؛ تصدیق کے بعد ہی خودکار اصلاح ممکن ہے۔'}
            {activeTab === 'approved' && 'صارف کے تصدیق شدہ اوزان خودکار تقطیع و اصلاح کے لیے فعال ہیں۔'}
            {activeTab === 'import' && 'ذاتی لغت کا بیک اپ محفوظ رکھیں یا نیا جدول درآمد کریں۔'}
          </p>
        </div>

        {/* Tab 1 & 2: Quarantine & Approved Lists */}
        {(activeTab === 'quarantine' || activeTab === 'approved') && (
          <div className="flex-1 overflow-hidden flex flex-col p-4 space-y-3">
            {/* Search and Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-surface)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  data-testid="lexicon-search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="تلاش بذریعہ لفظ، ماخذ شناختی نمبر (sourceId) یا وجہ..."
                  className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-nastaliq"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {activeTab === 'quarantine' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Filter className="w-3.5 h-3.5" />
                    <span>وجہ:</span>
                    <select
                      data-testid="reason-filter"
                      value={reasonFilter}
                      onChange={(e) => {
                        setReasonFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="all">تمام وجوہات (All Reasons)</option>
                      {Object.entries(QUARANTINE_REASON_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label.urdu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="all">تمام کیفیت (All Status)</option>
                      <option value="quarantined">قرنطینہ شدہ (بغیر تجویز)</option>
                      <option value="unreviewed">زیرِ جائزہ مسودہ (غیر مصدقہ)</option>
                      <option value="approved">مصدقہ برائے تقطیع</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Content Table / Cards */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {displayedItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-xl">
                  کوئی اندراج دستیاب نہیں۔ تلاش یا فلٹر تبدیل فرمائیں۔
                </div>
              ) : (
                paginatedItems.map((item: any) => {
                  const existingProposal = AroozLexiconService.getProposal(item.word);
                  const isApproved = existingProposal?.status === 'approved';
                  const isUnreviewed = existingProposal?.status === 'unreviewed';

                  return (
                    <div
                      key={item.sourceId || item.word}
                      data-testid="lexicon-row"
                      className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Word */}
                        <div className="min-w-[80px]">
                          <span className="text-base font-bold text-[var(--text-primary)] font-nastaliq">
                            {item.word}
                          </span>
                        </div>

                        {/* Vocalized / Divisions / Pattern */}
                        <div className="flex flex-col text-xs space-y-0.5">
                          <div className="flex items-center gap-2">
                            {item.vocalized && (
                              <span className="text-[var(--text-secondary)] font-nastaliq">
                                تلفظ: <span className="font-bold">{item.vocalized}</span>
                              </span>
                            )}
                            {item.divisions && (
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                ({item.divisions})
                              </span>
                            )}
                            {existingProposal && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-0.5 rounded">
                                <span>وزن:</span>
                                <ProsodicPatternView pattern={existingProposal.pattern} size="xs" />
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                            <span className="font-mono">{item.sourceId || item.sourceReference}</span>
                            {item.reason && (
                              <>
                                <span>•</span>
                                <span className="text-amber-500 font-sans">
                                  {QUARANTINE_REASON_LABELS[item.reason]?.urdu || item.reason}
                                </span>
                              </>
                            )}
                            {item.notes && (
                              <>
                                <span>•</span>
                                <span className="italic">حوالہ: {item.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badges & Actions */}
                      <div className="flex items-center gap-2">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <BadgeCheck className="w-3 h-3" />
                            مصدقہ (فعال)
                          </span>
                        ) : isUnreviewed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            زیرِ جائزہ (مسودہ)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <ShieldAlert className="w-3 h-3" />
                            قرنطینہ شدہ
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenProposalEditor(item)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-sans font-medium border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] text-[var(--text-secondary)] transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{existingProposal ? 'ترمیمِ تجویز' : 'تلفظ تجویز کریں'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 py-1.5 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                <span>
                  کل {displayedItems.length.toLocaleString()} نتائج — صفحہ {currentPage} از {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono">{currentPage}</span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bulk Import / Export (Preserved & Enhanced) */}
        {activeTab === 'import' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-right">
            <p dir="rtl" className="text-xs text-[var(--text-muted)] leading-[2.4]">
              درآمد شدہ ذاتی اوزان غیر مصدقہ رہیں گے جب تک کہ آپ انہیں مصدقہ قرار نہ دیں۔ عام لفظی فہرست سے کوئی وزن خودکار طور پر نہیں بنایا جاتا۔
            </p>

            {/* Format Selector & Sample Data */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)]">فارمیٹ:</span>
                <button
                  type="button"
                  onClick={() => setFormat('tsv')}
                  className={`px-3 py-1 rounded-lg text-xs font-sans transition-all border ${
                    format === 'tsv'
                      ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  TSV / جدول (لفظ \t وزن)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('json')}
                  className={`px-3 py-1 rounded-lg text-xs font-sans transition-all border ${
                    format === 'json'
                      ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  JSON ڈیٹا
                </button>
              </div>

              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-[var(--accent-gold)] hover:underline flex items-center gap-1 font-sans"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>نمونہ ڈیٹا درج کریں</span>
              </button>
            </div>

            {/* Text Area */}
            <div>
              <textarea
                data-testid="lexicon-import-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  format === 'tsv'
                    ? 'یہاں الفاظ اور ان کے اوزان چسپاں فرمائیں...\nمثال:\nکلام\t- = -\nبصیرت\t- = =\nقرآن\t= = -'
                    : '{\n  "کلام": ["- = -"],\n  "بصیرت": ["- = ="]\n}'
                }
                rows={7}
                dir={format === 'tsv' ? 'rtl' : 'ltr'}
                className="w-full p-3 text-xs md:text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-mono resize-y"
              />
            </div>

            {/* Status Alert */}
            {statusMsg && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  statusMsg.isError
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {statusMsg.isError ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span role="status">{statusMsg.text}</span>
              </div>
            )}
          </div>
        )}

        {/* Proposal Editor Drawer Overlay */}
        {editingTarget && (
          <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-nastaliq">
            <div data-testid="proposal-editor" className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[var(--accent-gold)]" />
                  <h4 className="text-base font-bold text-[var(--text-primary)]">
                    تلفظ کی نظرثانی و وزن کی تجویز: {editingTarget.word}
                  </h4>
                </div>
                <button
                  onClick={() => setEditingTarget(null)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Source Context Info */}
              <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-sans">ماخذ کا شناختی نمبر:</span>
                  <span className="font-mono font-bold text-[var(--accent-gold)]">{editingTarget.sourceId}</span>
                </div>
                {editingTarget.reason && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)] font-sans">قرنطینہ کی وجہ:</span>
                    <span className="text-amber-500 font-sans font-medium">
                      {QUARANTINE_REASON_LABELS[editingTarget.reason]?.urdu || editingTarget.reason}
                    </span>
                  </div>
                )}
                {editingTarget.vocalized && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)] font-sans">ماخذی تلفظ:</span>
                    <span className="font-bold text-[var(--text-primary)]">{editingTarget.vocalized}</span>
                  </div>
                )}
              </div>

              {/* Pattern Input & Quick Syllable Buttons */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    مجوزہ وزن (Prosody Pattern):
                  </label>
                  {propPattern && (
                    <span className="text-[11px] text-[var(--accent-gold)] font-mono">
                      رکن: {FOOT_NAMES[propPattern.replace(/x/g, '=')] || 'نامزد وزن'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    data-testid="proposal-pattern"
                  value={propPattern}
                    onChange={(e) => handlePatternChange(e.target.value)}
                    placeholder="مثلاً: =- یا -== یا =="
                    dir="ltr"
                    className="flex-1 p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm font-mono text-center tracking-widest text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                  <div className="flex items-center gap-1 font-sans text-xs">
                    <button
                      type="button"
                      onClick={() => handleAppendPatternSymbol('-')}
                      className="px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] font-mono font-bold"
                      title="ہجائے کوتاہ (-)"
                    >
                      - کوتاہ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAppendPatternSymbol('=')}
                      className="px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] font-mono font-bold"
                      title="ہجائے بلند (=)"
                    >
                      = بلند
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAppendPatternSymbol('x')}
                      className="px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] font-mono font-bold text-amber-500"
                      title="لچکدار ہجا (x)"
                    >
                      x لچکدار
                    </button>
                  </div>
                </div>

                {propPattern && (
                  <div className="mt-2 p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="text-[11px] font-nastaliq text-[var(--text-muted)]">
                      راست منظر (دائیں تا بائیں):
                    </span>
                    <ProsodicPatternView pattern={propPattern} size="sm" showDirectionBadge={true} />
                  </div>
                )}
              </div>

              {/* Vocalized Text with Erab (Optional) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    اعراب والا تلفظ (اختیاری):
                  </label>
                  <button
                    type="button"
                    onClick={handleDeriveWeightFromVocalized}
                    className="text-[11px] text-[var(--accent-gold)] hover:underline font-sans"
                  >
                    اعراب سے وزن اخذ کریں
                  </button>
                </div>
                <input
                  type="text"
                  value={propVocalized}
                  onChange={(e) => setPropVocalized(e.target.value)}
                  placeholder="مثلاً: آرْٹ یا کَلام"
                  className="w-full p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq"
                />
              </div>

              {/* Review Status Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[var(--text-primary)] block">
                  کیفیتِ نظرثانی (Review Status):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPropStatus('approved')}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2 ${
                      propStatus === 'approved'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <BadgeCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    <div>
                      <div className="text-xs">مصدقہ (Approved)</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-normal leading-normal">
                        خودکار تقطیع اور بحر کی اصلاحات کے لیے مکمل فعال۔
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPropStatus('unreviewed')}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2 ${
                      propStatus === 'unreviewed'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                    <div>
                      <div className="text-xs">زیرِ جائزہ (Unreviewed Draft)</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-normal leading-normal">
                        مسودہ محفوظ رہے گا؛ خودکار اصلاح روک کر رکھے گا۔
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notes / Citation (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  اسناد و حوالہ (اختیاری):
                </label>
                <input
                  type="text"
                  value={propNotes}
                  onChange={(e) => setPropNotes(e.target.value)}
                  placeholder="مثلاً: فرہنگِ آصفیہ / غالب کا مستعمل تلفظ"
                  className="w-full p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq"
                />
              </div>

              {/* Alerts */}
              {validationError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span role="alert">{validationError}</span>
                </div>
              )}

              {saveSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {saveWarningMsg && (
                <div
                  role="status"
                  className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{saveWarningMsg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                {AroozLexiconService.getProposal(editingTarget.word) ? (
                  <button
                    type="button"
                    data-testid="proposal-delete"
                    onClick={handleDeleteProposal}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف تجویز</span>
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTarget(null)}
                    disabled={isSaving}
                    className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    منسوخ
                  </button>
                  <button
                    type="button"
                    data-testid="proposal-save"
                    onClick={handleSaveProposal}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent-gold)] text-white hover:brightness-110 shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'محفوظ ہو رہا ہے...' : 'محفوظ کریں'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <button
            type="button"
            data-testid="lexicon-export"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-colors"
            title="مکمل ذخیرۂ لغت کو JSON فائل میں ڈاؤنلوڈ کریں"
          >
            <Download className="w-3.5 h-3.5" />
            <span>برآمد لغت (Export JSON)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="بند کریں"
            onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              بند کریں
            </button>
            {activeTab === 'import' && (
              <button
                type="button"
                data-testid="lexicon-import"
                onClick={handleImport}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[var(--accent-gold)] hover:brightness-110 text-white transition-all shadow-xs disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'درآمد ہو رہا ہے...' : 'درآمد کریں (Import)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
