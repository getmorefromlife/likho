import { WordSelectionArea } from '../common/WordSelectionArea';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowLeftCircle,
  Check,
  Sparkles,
  X,
  Layers,
  Sliders,
  UploadCloud,
  BookOpen,
  Download,
  Copy,
} from 'lucide-react';
import { RHYME_TREASURY } from '../../data/rhymeTreasury';
import {
  findRhymes,
  detectPoemRhymeScheme,
  getTotalRhymeVocabularyStats,
  QUICK_RHYME_CATEGORIES,
  RHYME_TIER_LABELS,
  RhymeMatchTier,
  LetterCountFilterMode,
} from '../../services/qafiyaEngine';
import { VisualSlotRhymeBuilder } from './VisualSlotRhymeBuilder';
import { FileImportModal } from './FileImportModal';

interface RhymeTreasuryTabProps {
  onLoadToTray: (words: string[]) => void;
  fontFamily: string;
  poemContent?: string;
  selectedWord?: string;
}

type TreasuryViewMode = 'algorithmic' | 'slots' | 'import' | 'thematic';

export const RhymeTreasuryTab: React.FC<RhymeTreasuryTabProps> = ({
  onLoadToTray,
  fontFamily,
  poemContent = '',
  selectedWord = '',
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<'all' | RhymeMatchTier>('all');
  const [letterFilterMode, setLetterFilterMode] = useState<LetterCountFilterMode>('all');
  const [letterFilterCount, setLetterFilterCount] = useState<number>(4);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<TreasuryViewMode>('algorithmic');
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const vocabStats = useMemo(() => getTotalRhymeVocabularyStats(), []);

  // Auto-fill search if user selected a word in the editor
  useEffect(() => {
    if (selectedWord && selectedWord.trim()) {
      setSearch(selectedWord.trim());
      setActiveCategory('custom');
      setViewMode('algorithmic');
    }
  }, [selectedWord]);

  // Automated poem rhyme detection
  const detectedScheme = useMemo(() => {
    if (!poemContent) return null;
    const lines = poemContent.split('\n');
    return detectPoemRhymeScheme(lines);
  }, [poemContent]);

  // Algorithmic Rhymes computation
  const algorithmicResults = useMemo(() => {
    let query = search.trim();
    if (!query && activeCategory !== 'all' && activeCategory !== 'custom') {
      const foundCat = QUICK_RHYME_CATEGORIES.find((c) => c.id === activeCategory);
      if (foundCat) query = foundCat.suffix;
    }
    if (!query) {
      query = 'ام';
    }
    return findRhymes(query, undefined, {
      mode: letterFilterMode,
      count: letterFilterCount,
    });
  }, [search, activeCategory, letterFilterMode, letterFilterCount]);

  const displayedGroups = useMemo(() => {
    if (tierFilter === 'all') return algorithmicResults.groups;
    return algorithmicResults.groups.filter((g) => g.tier === tierFilter);
  }, [algorithmicResults.groups, tierFilter]);

  const allDisplayedWords = useMemo(
    () => displayedGroups.flatMap((g) => g.words),
    [displayedGroups]
  );

  const handleCopyAllFiltered = () => {
    if (!allDisplayedWords.length) return;
    void navigator.clipboard?.writeText(allDisplayedWords.join(' ')).then(() => {
      setCopyFeedback('متن کاپی ہوگیا');
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const handleSaveAsTxtFile = () => {
    if (!allDisplayedWords.length) return;
    const modeLabel: Record<LetterCountFilterMode, string> = {
      all: '',
      max: 'زیادہ سے زیادہ',
      exact: 'صرف',
      min: 'کم از کم',
    };
    const suffixName = algorithmicResults.detectedSuffix || algorithmicResults.query || 'قوافی';
    const fileName =
      letterFilterMode === 'all'
        ? `${suffixName} کے قافیے.txt`
        : `${suffixName} کے قافیے- ${modeLabel[letterFilterMode]} ${letterFilterCount} حروف.txt`;
    const blob = new Blob([allDisplayedWords.join(' ')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Curated fallback filter
  const filteredCurated = useMemo(() => {
    return RHYME_TREASURY.filter((cat) => {
      const matchesSearch =
        !search.trim() ||
        cat.wazn.includes(search) ||
        cat.themeName.includes(search) ||
        cat.words.some((w) => w.includes(search));
      return matchesSearch;
    });
  }, [search]);

  const handleLoadGroup = (id: string, words: string[]) => {
    onLoadToTray(words);
    setLoadedId(id);
    setTimeout(() => setLoadedId(null), 2500);
  };

  const handleLoadSingleWord = (word: string) => {
    onLoadToTray([word]);
    setLoadedId(`word-${word}`);
    setTimeout(() => setLoadedId(null), 1500);
  };

  const handleApplyDetected = () => {
    if (detectedScheme?.detectedQafiyaWord) {
      setSearch(detectedScheme.detectedQafiyaWord);
      setActiveCategory('custom');
      setViewMode('algorithmic');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" dir="rtl">
      {/* Top 3-Pillar Mode Navigation Bar */}
      <div className="p-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-subtle)] overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setViewMode('algorithmic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-nastaliq transition-all whitespace-nowrap ${
              viewMode === 'algorithmic'
                ? 'bg-[var(--accent-gold)] text-white font-bold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>معجمِ قوافی</span>
          </button>

          <button
            onClick={() => setViewMode('slots')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-nastaliq transition-all whitespace-nowrap ${
              viewMode === 'slots'
                ? 'bg-[var(--accent-gold)] text-white font-bold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>قالب ساز (Slots)</span>
          </button>

          <button
            onClick={() => setViewMode('import')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-nastaliq transition-all whitespace-nowrap ${
              viewMode === 'import'
                ? 'bg-[var(--accent-gold)] text-white font-bold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]/50'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>درآمد فائل 📥</span>
          </button>

          <button
            onClick={() => setViewMode('thematic')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-nastaliq transition-all whitespace-nowrap ${
              viewMode === 'thematic'
                ? 'bg-[var(--accent-gold)] text-white font-bold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>موضوعاتی اوزان</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Algorithmic Search */}
      {viewMode === 'algorithmic' && (
        <>
          {/* Search & Quick Filter Bar */}
          <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (activeCategory !== 'custom') setActiveCategory('custom');
                }}
                placeholder="قافیہ، حرفِ روی یا کوئی بھی لفظ درج فرمائیں (مثلاً: کلام، بہار، ایمان)..."
                className="w-full pr-8 pl-8 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] font-nastaliq text-right shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 text-[var(--text-muted)] pointer-events-none" />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('all');
                  }}
                  className="absolute left-2.5 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  title="تلاش صاف کریں"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Classical Suffix Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-nastaliq custom-scrollbar select-none">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearch('');
                }}
                className={`px-2.5 py-0.5 rounded-full whitespace-nowrap border transition-all ${
                  activeCategory === 'all' && !search
                    ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                عام کلاسک قوافی
              </button>
              {QUICK_RHYME_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearch(cat.suffix);
                  }}
                  className={`px-2.5 py-0.5 rounded-full whitespace-nowrap border transition-all ${
                    activeCategory === cat.id || search === cat.suffix
                      ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold shadow-xs'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                  }`}
                  title={cat.example}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Pronunciation Tier Filter & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]/50 text-[11px] font-nastaliq">
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setTierFilter('all')}
                  className={`px-2 py-0.5 rounded-md border transition-all ${
                    tierFilter === 'all'
                      ? 'bg-[var(--bg-card)] border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  تمام ({algorithmicResults.totalMatches})
                </button>
                <button
                  type="button"
                  onClick={() => setTierFilter('strict')}
                  title={RHYME_TIER_LABELS.strict.description}
                  className={`px-2 py-0.5 rounded-md border transition-all ${
                    tierFilter === 'strict'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  معیاری قافیہ ({algorithmicResults.strictCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTierFilter('near')}
                  title={RHYME_TIER_LABELS.near.description}
                  className={`px-2 py-0.5 rounded-md border transition-all ${
                    tierFilter === 'near'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-400 font-bold'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  قریبی / دریافتی ({algorithmicResults.nearCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTierFilter('uncertain')}
                  title={RHYME_TIER_LABELS.uncertain.description}
                  className={`px-2 py-0.5 rounded-md border transition-all ${
                    tierFilter === 'uncertain'
                      ? 'bg-slate-500/15 border-slate-500/50 text-[var(--text-secondary)] font-bold'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  املائی / غیر مصدقہ ({algorithmicResults.uncertainCount})
                </button>
              </div>
              {algorithmicResults.rawiSummary && (
                <span className="text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)]/60">
                  {algorithmicResults.queryVocalized ? `${algorithmicResults.queryVocalized} • ` : ''}
                  {algorithmicResults.rawiSummary}
                </span>
              )}
            </div>

            {/* Qaafiyah Expert 1.1 Letter-Count Filter & Export Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[var(--border-subtle)]/50 text-[11px] font-nastaliq">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[var(--text-secondary)] font-bold">
                  قوافی میں کتنے حروف ہوں؟
                </span>
                <select
                  aria-label="قوافی میں کتنے حروف ہوں"
                  value={letterFilterMode}
                  onChange={(e) =>
                    setLetterFilterMode(e.target.value as LetterCountFilterMode)
                  }
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-0.5 text-[11px] text-[var(--text-primary)]"
                >
                  <option value="all">تمام دکھائیں</option>
                  <option value="max">زیادہ سے زیادہ</option>
                  <option value="exact">صرف</option>
                  <option value="min">کم از کم</option>
                </select>
                {letterFilterMode !== 'all' && (
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="number"
                      min={2}
                      max={14}
                      value={letterFilterCount}
                      onChange={(e) =>
                        setLetterFilterCount(
                          Math.max(2, Math.min(14, Number(e.target.value) || 2))
                        )
                      }
                      aria-label="حروف کی تعداد"
                      className="w-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-1.5 py-0.5 text-center font-mono text-xs text-[var(--text-primary)]"
                    />
                    <span className="text-[var(--text-muted)]">حروف</span>
                  </label>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] text-[var(--text-muted)] hidden sm:inline"
                  title={`${vocabStats.weightedLexiconWords.toLocaleString()} عروضی الفاظ + ${vocabStats.unweightedQaafiyahWords.toLocaleString()} ذخیرۂ قافیہ ایکسپرٹ`}
                >
                  کل ذخیرہ: {vocabStats.totalUniqueWords.toLocaleString()} الفاظ
                </span>
                <button
                  type="button"
                  onClick={handleCopyAllFiltered}
                  disabled={!allDisplayedWords.length}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[10px] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)] disabled:opacity-40 cursor-pointer"
                  title="سارا متن کاپی کریں"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copyFeedback || 'سارا متن کاپی کریں'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAsTxtFile}
                  disabled={!allDisplayedWords.length}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[10px] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)] disabled:opacity-40 cursor-pointer"
                  title="بطور ٹیکسٹ فائل محفوظ کریں"
                >
                  <Download className="w-3 h-3" />
                  <span>ٹیکسٹ فائل محفوظ کریں</span>
                </button>
              </div>
            </div>
          </div>

          {/* Auto-detected Rhyme Banner from Current Draft */}
          {detectedScheme && (
            <div className="px-3 py-2 bg-[var(--accent-gold)]/10 border-b border-[var(--accent-gold)]/20 flex items-center justify-between text-xs font-nastaliq">
              <div className="flex items-center gap-1.5 text-[var(--accent-gold)]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  کلام سے دریافت شدہ قافیہ: <strong>{detectedScheme.detectedQafiyaWord}</strong>
                  {detectedScheme.secondQafiyaWord &&
                    detectedScheme.secondQafiyaWord !== detectedScheme.detectedQafiyaWord && (
                      <span className="text-[var(--text-secondary)]"> / {detectedScheme.secondQafiyaWord}</span>
                    )}
                  {detectedScheme.detectedRadif && (
                    <span className="text-[var(--text-muted)] mr-1">
                      (ردیف: {detectedScheme.detectedRadif})
                    </span>
                  )}
                  <span className="text-[10px] text-[var(--text-muted)] mr-1.5">
                    [{RHYME_TIER_LABELS[detectedScheme.matchTier].badge}]
                  </span>
                </span>
              </div>
              <button
                onClick={handleApplyDetected}
                className="px-2.5 py-1 rounded-lg bg-[var(--accent-gold)] text-white font-bold text-xs hover:bg-[var(--accent-gold)]/90 transition-all shrink-0 shadow-xs"
              >
                اس کے تمام قافیے دیکھیں
              </button>
            </div>
          )}

          {/* Algorithmic Results */}
          <WordSelectionArea id="treasury" label="خزانہ قوافی" resetKey={`${viewMode}:${search}:${activeCategory}:${tierFilter}`} onLoadSelected={onLoadToTray} className="flex-1 overflow-y-auto p-3 pb-14 space-y-3 custom-scrollbar">
            {displayedGroups.length > 0 ? (
              displayedGroups.map((group, gIdx) => {
                const groupId = `algo-${group.tier}-${group.wazn}-${gIdx}`;
                const isJustLoaded = loadedId === groupId;
                const tierBadgeClass =
                  group.tier === 'strict'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : group.tier === 'near'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-subtle)]';

                return (
                  <div
                    key={groupId}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xs hover:border-[var(--accent-gold)]/50 transition-all"
                  >
                    {/* Group Header */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[var(--border-subtle)]/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-nastaliq font-bold text-sm text-[var(--text-primary)]">
                          {group.afail}
                        </span>
                        {group.wazn && (
                          <span
                            dir="rtl"
                            title="دائیں سے بائیں: پہلا ہجا دائیں جانب"
                            className="inline-flex items-center gap-0.5 text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--accent-gold)] border border-[var(--border-subtle)] font-bold"
                          >
                            {group.wazn.split('').map((sym, sIdx) => (
                              <span key={sIdx}>{sym}</span>
                            ))}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-nastaliq px-2 py-0.5 rounded-full border ${tierBadgeClass}`}
                          title={RHYME_TIER_LABELS[group.tier].description}
                        >
                          {group.tierLabel}
                        </span>
                        <span className="text-[10px] font-nastaliq text-[var(--text-muted)]">
                          ({group.words.length} الفاظ)
                        </span>
                      </div>

                      <button
                        onClick={() => handleLoadGroup(groupId, group.words)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-nastaliq transition-all font-medium border ${
                          isJustLoaded
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)]/40 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white font-bold'
                        }`}
                        title="اس پورے وزن کے تمام قوافی کو تختی پر منتقل کریں"
                      >
                        {isJustLoaded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>منتقل ہو گیا</span>
                          </>
                        ) : (
                          <>
                            <ArrowLeftCircle className="w-3.5 h-3.5" />
                            <span>یہ سب تختی پر لائیں</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Word Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {group.words.map((word) => {
                        const isWordLoaded = loadedId === `word-${word}`;
                        return (
                          <button
                            key={word}
                            data-selectable-id={`${groupId}:${word}`}
                            data-selectable-word={word}
                            type="button"
                            onClick={() => handleLoadSingleWord(word)}
                            style={{ fontFamily }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-nastaliq border transition-all cursor-pointer ${
                              isWordLoaded
                                ? 'bg-emerald-500 text-white border-emerald-500 font-bold scale-105'
                                : 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border-subtle)]/70 hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 hover:text-[var(--accent-gold)]'
                            }`}
                            title="تختی میں شامل کرنے کے لیے کلک فرمائیں"
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs font-nastaliq text-[var(--text-muted)] space-y-2">
                <Layers className="w-8 h-8 text-[var(--text-muted)]/40 mx-auto" />
                <p className="font-bold text-sm text-[var(--text-secondary)]">
                  کوئی ہم قافیہ لفظ نہیں ملا
                </p>
                <p className="text-[11px]">
                  براہِ کرم حرفِ روی کی علامت تبدیل کریں یا اوپر دیے گئے عمومی قوافی کے بٹن استعمال فرمائیں۔
                </p>
              </div>
            )}
          </WordSelectionArea>
        </>
      )}

      {/* Mode 2: Visual Slot Builder */}
      {viewMode === 'slots' && (
        <VisualSlotRhymeBuilder
          initialWord={search || detectedScheme?.detectedQafiyaWord || 'ایمان'}
          onLoadToTray={onLoadToTray}
          fontFamily={fontFamily}
        />
      )}

      {/* Mode 3: Multi-Format File Ingestion */}
      {viewMode === 'import' && (
        <FileImportModal onLoadToTray={onLoadToTray} fontFamily={fontFamily} />
      )}

      {/* Mode 4: Thematic Curated Fallback */}
      {viewMode === 'thematic' && (
        <WordSelectionArea id="thematic" label="موضوعاتی قوافی" resetKey={`${viewMode}:${search}`} onLoadSelected={onLoadToTray} className="flex-1 overflow-y-auto p-3 pb-14 space-y-3 custom-scrollbar">
          {filteredCurated.map((cat) => {
            const isJustLoaded = loadedId === cat.id;

            return (
              <div
                key={cat.id}
                className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xs hover:border-[var(--accent-gold)]/50 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold font-nastaliq text-[var(--text-primary)] leading-snug">
                      {cat.themeName}
                    </h4>
                    <span className="text-[11px] font-mono text-[var(--accent-gold)] font-semibold">
                      {cat.wazn}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLoadGroup(cat.id, cat.words)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-nastaliq transition-all font-medium border ${
                      isJustLoaded
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)]/40 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white font-bold'
                    }`}
                  >
                    {isJustLoaded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>منتقل ہو گیا</span>
                      </>
                    ) : (
                      <>
                        <ArrowLeftCircle className="w-3.5 h-3.5" />
                        <span>تختی پر لائیں</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-[var(--text-muted)] font-nastaliq mb-2.5 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[var(--border-subtle)]/40">
                  {cat.words.map((word) => (
                    <button
                      key={word}
                      data-selectable-id={`${cat.id}:${word}`}
                      data-selectable-word={word}
                      type="button"
                      onClick={() => handleLoadSingleWord(word)}
                      style={{ fontFamily }}
                      className="px-2.5 py-0.5 rounded text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)]/60 font-nastaliq hover:border-[var(--accent-gold)]"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </WordSelectionArea>
      )}
    </div>
  );
};
