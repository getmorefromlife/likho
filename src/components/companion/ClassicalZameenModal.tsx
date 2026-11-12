import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Feather,
  ArrowLeftCircle,
  Check,
  Copy,
  Award,
  Layers,
} from 'lucide-react';
import {
  ZameenMatchReport,
  ZameenMatchTier,
  ZAMEEN_TIER_META,
  ClassicalZameenMatch,
} from '../../services/zameenMatcherService';

interface ClassicalZameenModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ZameenMatchReport;
  fontFamily: string;
  onLoadRhymesToTray?: (words: string[]) => void;
}

export const ClassicalZameenModal: React.FC<ClassicalZameenModalProps> = ({
  isOpen,
  onClose,
  report,
  fontFamily,
  onLoadRhymesToTray,
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | ZameenMatchTier>('all');
  const [selectedPoemId, setSelectedPoemId] = useState<string>('');
  const [loadedFeedback, setLoadedFeedback] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredMatches = useMemo(() => {
    if (tierFilter === 'all') return report.matches;
    return report.matches.filter((m) => m.tier === tierFilter);
  }, [report.matches, tierFilter]);

  useEffect(() => {
    if (!isOpen) return;
    if (filteredMatches.length > 0) {
      const stillExists = filteredMatches.some((m) => m.poem.id === selectedPoemId);
      if (!stillExists) {
        setSelectedPoemId(filteredMatches[0].poem.id);
      }
    } else {
      setSelectedPoemId('');
    }
  }, [isOpen, filteredMatches, selectedPoemId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeMatch: ClassicalZameenMatch | null =
    filteredMatches.find((m) => m.poem.id === selectedPoemId) ||
    filteredMatches[0] ||
    null;

  const handleLoadQafiyas = (words: string[], feedbackId: string) => {
    if (!onLoadRhymesToTray || words.length === 0) return;
    onLoadRhymesToTray(words);
    setLoadedFeedback(feedbackId);
    setTimeout(() => setLoadedFeedback(null), 1800);
  };

  const handleCopyTazmeen = (text: string, poetTakhallus: string, key: string) => {
    const formatted = `«${text}» (${poetTakhallus}ؔ)`;
    void navigator.clipboard?.writeText(formatted).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    });
  };

  const getTierBadgeStyle = (tier: ZameenMatchTier) => {
    switch (tier) {
      case 'exact_zameen':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40';
      case 'same_radif_qafiya':
        return 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border-[var(--accent-gold)]/40';
      case 'same_radif':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40';
      case 'same_meter':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/35';
    }
  };

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="zameen-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm select-none animate-in fade-in"
    >
      <div className="relative w-full max-w-5xl h-[88vh] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl overflow-hidden flex flex-col">
        {/* Top Modal Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/40 flex items-center justify-center text-[var(--accent-gold)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="zameen-modal-title"
                className="font-nastaliq font-bold text-base sm:text-lg text-[var(--text-primary)] leading-relaxed"
              >
                ہم زمین کلامِ اساتذہ و تضمین اسٹوڈیو (Classical Zameen Matcher)
              </h2>
              <p className="text-[11px] font-nastaliq text-[var(--text-muted)]">
                آپ کے زیرِ تخلیق کلام کی بحر، ردیف اور قافیہ سے ہم آہنگ کلاسیکی اساتذہ کی غزلیات
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بند کریں"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poet's Active Zameen Diagnostic Bar */}
        <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 flex flex-wrap items-center justify-between gap-2 text-xs font-nastaliq">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--text-muted)] font-bold">آپ کی فعال زمین:</span>
            {report.detectedMeterName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 font-bold">
                <BookOpen className="w-3 h-3" />
                <span>{report.detectedMeterName}</span>
              </span>
            )}
            {report.detectedRadif && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">ردیف:</span>
                <strong>«{report.detectedRadif}»</strong>
              </span>
            )}
            {report.detectedQafiyaWord && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span>قافیہ اساس:</span>
                <strong>{report.detectedQafiyaWord}</strong>
              </span>
            )}
          </div>

          {/* Tier Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setTierFilter('all')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                tierFilter === 'all'
                  ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
              }`}
            >
              تمام ({report.matches.length})
            </button>
            {report.exactZameenCount > 0 && (
              <button
                type="button"
                onClick={() => setTierFilter('exact_zameen')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                  tierFilter === 'exact_zameen'
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:border-emerald-500'
                }`}
              >
                مکمل ہم زمین ({report.exactZameenCount})
              </button>
            )}
            {report.sameRadifQafiyaCount > 0 && (
              <button
                type="button"
                onClick={() => setTierFilter('same_radif_qafiya')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                  tierFilter === 'same_radif_qafiya'
                    ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                    : 'bg-[var(--bg-card)] text-[var(--accent-gold)] border-[var(--accent-gold)]/30 hover:border-[var(--accent-gold)]'
                }`}
              >
                ہم قافیہ و ردیف ({report.sameRadifQafiyaCount})
              </button>
            )}
            {report.sameRadifCount > 0 && (
              <button
                type="button"
                onClick={() => setTierFilter('same_radif')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                  tierFilter === 'same_radif'
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-[var(--bg-card)] text-amber-600 dark:text-amber-400 border-amber-500/30 hover:border-amber-500'
                }`}
              >
                ہم ردیف ({report.sameRadifCount})
              </button>
            )}
            {report.sameMeterCount > 0 && (
              <button
                type="button"
                onClick={() => setTierFilter('same_meter')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                  tierFilter === 'same_meter'
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-[var(--bg-card)] text-blue-600 dark:text-blue-400 border-blue-500/30 hover:border-blue-500'
                }`}
              >
                ہم بحر ({report.sameMeterCount})
              </button>
            )}
          </div>
        </div>

        {/* Main Master-Detail Body */}
        {filteredMatches.length > 0 && activeMatch ? (
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Right Sidebar: Matched Classical Poems List (5 cols) */}
            <div className="md:col-span-5 border-b md:border-b-0 md:border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredMatches.map((item) => {
                const isSelected = item.poem.id === activeMatch.poem.id;
                return (
                  <button
                    key={item.poem.id}
                    type="button"
                    onClick={() => setSelectedPoemId(item.poem.id)}
                    className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] shadow-xs'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-nastaliq font-bold text-[var(--accent-gold)]">
                        <Feather className="w-3 h-3" />
                        <span>{item.poet.name}</span>
                      </span>
                      <span
                        className={`text-[10px] font-nastaliq px-2 py-0.5 rounded-full border ${getTierBadgeStyle(
                          item.tier
                        )}`}
                      >
                        {item.tierLabelUrdu}
                      </span>
                    </div>

                    <p
                      style={{ fontFamily, lineHeight: 2.3 }}
                      className="text-sm font-bold text-[var(--text-primary)] font-nastaliq line-clamp-1"
                    >
                      {item.poem.title}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-nastaliq text-[var(--text-muted)] pt-0.5 border-t border-[var(--border-subtle)]/40">
                      <span>{item.matchReasonUrdu}</span>
                      <span>{item.poem.couplets.length} اشعار</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Left Pane: Full Classical Poem & Qafiya/Tazmeen Workbench (7 cols) */}
            <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar bg-[var(--bg-canvas)]">
              {/* Poem Header Card */}
              <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3 shadow-2xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-nastaliq font-bold text-[var(--accent-gold)]">
                        {activeMatch.poet.name} ({activeMatch.poet.takhallus}ؔ)
                      </span>
                      <span className="text-[11px] font-nastaliq text-[var(--text-muted)]">
                        • {activeMatch.poem.sourceBook} ({activeMatch.poem.publicationYear}ء)
                      </span>
                    </div>
                    <h3
                      style={{ fontFamily, lineHeight: 2.5 }}
                      className="text-lg sm:text-xl font-bold font-nastaliq text-[var(--text-primary)] mt-1"
                    >
                      {activeMatch.poem.title}
                    </h3>
                  </div>

                  <span
                    className={`text-xs font-nastaliq px-2.5 py-1 rounded-full border font-bold ${getTierBadgeStyle(
                      activeMatch.tier
                    )}`}
                    title={ZAMEEN_TIER_META[activeMatch.tier].description}
                  >
                    {activeMatch.tierLabelUrdu}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]/60 text-xs font-nastaliq">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    بحر: <strong>{activeMatch.poem.meterName}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--accent-gold)] border border-[var(--border-subtle)]">
                    ارکان: {activeMatch.poem.arkan}
                  </span>
                  {activeMatch.poem.radif && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                      ردیف: <strong>«{activeMatch.poem.radif}»</strong>
                    </span>
                  )}
                </div>

                {/* Master Poet's Used Qafiyas Box */}
                {activeMatch.poem.qafiyaSample.length > 0 && (
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-nastaliq font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                        <span>
                          اس زمین میں {activeMatch.poet.takhallus}ؔ کے برتے ہوئے قوافی ({activeMatch.poem.qafiyaSample.length}):
                        </span>
                      </span>

                      {onLoadRhymesToTray && (
                        <button
                          type="button"
                          onClick={() =>
                            handleLoadQafiyas(
                              activeMatch.poem.qafiyaSample,
                              `all-${activeMatch.poem.id}`
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-nastaliq font-bold border transition-all cursor-pointer ${
                            loadedFeedback === `all-${activeMatch.poem.id}`
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border-[var(--accent-gold)]/40 hover:bg-[var(--accent-gold)] hover:text-white'
                          }`}
                        >
                          {loadedFeedback === `all-${activeMatch.poem.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>تختی پر منتقل ہو گئے!</span>
                            </>
                          ) : (
                            <>
                              <ArrowLeftCircle className="w-3.5 h-3.5" />
                              <span>یہ تمام قوافی اپنی تختی پر لائیں</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeMatch.poem.qafiyaSample.map((qWord) => {
                        const isShared = activeMatch.sharedQafiyas.includes(qWord);
                        const isWordLoaded = loadedFeedback === `word-${qWord}`;
                        return (
                          <button
                            key={qWord}
                            type="button"
                            onClick={() => handleLoadQafiyas([qWord], `word-${qWord}`)}
                            style={{ fontFamily }}
                            title="تختی میں شامل کرنے کے لیے کلک فرمائیں"
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-nastaliq border transition-all cursor-pointer ${
                              isWordLoaded
                                ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                                : isShared
                                ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border-[var(--accent-gold)]/50 font-bold'
                                : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
                            }`}
                          >
                            {qWord}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Classical Couplets List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-nastaliq text-[var(--text-muted)] px-1">
                  <span>اشعارِ کلام ({activeMatch.poem.couplets.length} اشعار)</span>
                  <span>تضمین یا گرہ لگانے کے لیے کسی بھی مصرعے کے ساتھ «نقل» پر کلک کریں</span>
                </div>

                {activeMatch.poem.couplets.map((couplet, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)]/40 transition-all space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded bg-[var(--bg-subtle)]">
                        شعر {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyTazmeen(
                            `${couplet.misra1} / ${couplet.misra2}`,
                            activeMatch.poet.takhallus,
                            `couplet-${idx}`
                          )
                        }
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-nastaliq text-[var(--text-muted)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                        title="تضمین یا حوالے کے لیے شعر نقل کریں"
                      >
                        {copiedKey === `couplet-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">نقل ہو گیا</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>تضمین کے لیے نقل کریں</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div
                      style={{ fontFamily, lineHeight: 2.7 }}
                      className="text-center font-nastaliq text-base sm:text-lg text-[var(--text-primary)] space-y-1 py-1 select-text"
                    >
                      <p>{couplet.misra1}</p>
                      <p>{couplet.misra2}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center font-nastaliq text-[var(--text-muted)] space-y-2">
            <Layers className="w-10 h-10 text-[var(--text-muted)]/40" />
            <p className="text-base font-bold text-[var(--text-secondary)]">
              اس فلٹر میں کوئی کلاسیکی کلام نہیں ملا
            </p>
            <p className="text-xs">
              اوپر «تمام» کے بٹن پر کلک فرمائیں یا اپنے کلام میں مطلع، بحر یا ردیف متعین کریں۔
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

