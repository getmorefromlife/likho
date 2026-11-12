import { WordSelectionArea } from '../common/WordSelectionArea';
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Quote, BookOpen, Feather, Layers } from 'lucide-react';
import { URDU_THESAURUS } from '../../data/urduThesaurus';
import { normalizeForRhyme } from '../../services/unicodeNormalizer';
import {
  loadSovereignLexicon,
  lookupSovereignWord,
  SOVEREIGN_LEXICON_META,
  SovereignDictionaryLookupResult,
} from '../../services/sovereignLexiconService';
import { findSanadVerseForWord } from '../../data/sovereign/classicalDiwanCorpus';
import { ProsodicPatternView } from '../common/ProsodicPatternView';

interface ThesaurusTabProps {
  selectedWord?: string;
  onSelectWordToInsert?: (word: string) => void;
  fontFamily: string;
}

export const ThesaurusTab: React.FC<ThesaurusTabProps> = ({
  selectedWord,
  onSelectWordToInsert,
  fontFamily,
}) => {
  const [searchTerm, setSearchTerm] = useState('عشق');
  const [lexiconReady, setLexiconReady] = useState(false);
  const [lexiconError, setLexiconError] = useState<string | null>(null);

  // Lazily load the 30,916-word Sovereign Clean-Room Dictionary on mount
  // (which also attaches it to AroozLexiconService for scansion & rhyming)
  useEffect(() => {
    let active = true;
    loadSovereignLexicon()
      .then(() => {
        if (active) setLexiconReady(true);
      })
      .catch(() => {
        if (active) setLexiconError('لغت لوڈ کرنے میں دشواری پیش آئی۔');
      });
    return () => {
      active = false;
    };
  }, []);

  // If user selected a word in the poetry canvas, automatically look it up!
  useEffect(() => {
    if (selectedWord && selectedWord.trim()) {
      const normalized = normalizeForRhyme(selectedWord);
      const foundKey = Object.keys(URDU_THESAURUS).find(
        (k) => normalizeForRhyme(k) === normalized
      );
      if (foundKey) {
        setSearchTerm(foundKey);
      } else {
        setSearchTerm(selectedWord.trim());
      }
    }
  }, [selectedWord]);

  const normalizedQuery = normalizeForRhyme(searchTerm);

  const sovereignResult: SovereignDictionaryLookupResult | null = useMemo(() => {
    if (!lexiconReady || !searchTerm.trim()) return null;
    return lookupSovereignWord(searchTerm, 18);
  }, [lexiconReady, searchTerm]);

  const sanadVerse = useMemo(() => {
    const target = sovereignResult?.word || searchTerm;
    if (!target.trim()) return null;
    return findSanadVerseForWord(target);
  }, [sovereignResult, searchTerm]);

  const matchedThesaurusEntry = useMemo(() => {
    return (
      URDU_THESAURUS[searchTerm] ||
      Object.values(URDU_THESAURUS).find(
        (entry) =>
          normalizeForRhyme(entry.word) === normalizedQuery ||
          entry.synonyms.some((s) => normalizeForRhyme(s) === normalizedQuery)
      )
    );
  }, [searchTerm, normalizedQuery]);

  const suggestedWords = [
    'عشق',
    'علم',
    'دلنواز',
    'محبت',
    'ابتدا',
    'جستجو',
    'چاندنی',
    'سحر',
    'گلستان',
    'آرزو',
    'وفا',
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" dir="rtl">
      {/* Search Bar & Sovereign Dictionary Status Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold font-nastaliq text-[var(--text-primary)]">
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
            <span>لغتِ قلم و قافیہ و مترادفات</span>
          </div>
          <span
            className="text-[10px] font-nastaliq px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25"
            title={`${SOVEREIGN_LEXICON_META.name} (${SOVEREIGN_LEXICON_META.version})`}
          >
            {lexiconReady
              ? `${SOVEREIGN_LEXICON_META.words.toLocaleString('ur-PK')} الفاظ فعال`
              : 'لغت لوڈ ہو رہی ہے...'}
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="لفظ تلاش کریں (مثلاً: عشق، عالمین، دلنواز، ابتدا، محبت)..."
            aria-label="لغت میں لفظ تلاش کریں"
            style={{ fontFamily }}
            className="w-full pl-2 pr-8 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] text-right"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[var(--text-muted)]" />
        </div>

        {/* Suggestion Chips */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-nastaliq custom-scrollbar">
          {suggestedWords.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setSearchTerm(w)}
              className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-all ${
                searchTerm === w
                  ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <WordSelectionArea
        id="dictionary"
        label="لغت و الفاظ"
        resetKey={searchTerm}
        className="flex-1 overflow-y-auto p-3 pb-14 space-y-3 custom-scrollbar"
      >
        {lexiconError && (
          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-nastaliq text-red-600 dark:text-red-300">
            {lexiconError}
          </div>
        )}

        {/* 1. Sovereign Literary & Prosodic Dictionary Entry */}
        {sovereignResult && sovereignResult.readings.length > 0 && (
          <div className="space-y-2.5">
            {sovereignResult.readings.map((reading, idx) => (
              <div
                key={`${sovereignResult.word}-${reading.vocalized}-${idx}`}
                className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        style={{ fontFamily }}
                        className="text-2xl font-bold text-[var(--accent-gold)] leading-relaxed"
                      >
                        {sovereignResult.word}
                      </h3>
                      <span
                        style={{ fontFamily }}
                        className="text-base px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                        title="تلفظ مع اعراب"
                      >
                        {reading.vocalized}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[11px] font-nastaliq">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] font-medium">
                        {reading.pos}
                      </span>
                      {reading.root && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                          مادہ / اصل: <strong className="text-[var(--text-primary)]">{reading.root}</strong>
                        </span>
                      )}
                      {reading.rawi && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                          حرفِ روی: <strong className="text-[var(--text-primary)]">{reading.rawi}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {onSelectWordToInsert && (
                    <button
                      type="button"
                      onClick={() => onSelectWordToInsert(sovereignResult.word)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-nastaliq bg-[var(--accent-gold)]/15 hover:bg-[var(--accent-gold)] text-[var(--accent-gold)] hover:text-white border border-[var(--accent-gold)]/30 transition-all shrink-0"
                      title="نظم میں درج کریں"
                    >
                      + درج کریں
                    </button>
                  )}
                </div>

                {/* Meaning / Definition */}
                <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-nastaliq text-[var(--text-primary)] leading-relaxed">
                  <span className="text-[var(--text-muted)] ml-1.5">معنی و وضاحت:</span>
                  <span>{reading.meaning}</span>
                </div>

                {/* Scansion, Rukn, and Syllables */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs font-nastaliq">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[var(--text-muted)]">ہجے (تقطیع):</span>
                    {reading.syllables.map((syl, sIdx) => (
                      <span
                        key={`${syl}-${sIdx}`}
                        style={{ fontFamily }}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      >
                        {syl}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 font-bold">
                      {reading.rukn}
                    </span>
                    <ProsodicPatternView pattern={reading.pattern} size="xs" syllables={reading.syllables} />
                  </div>
                </div>
              </div>
            ))}

            {/* Classical Diwan Sanad Verse (شعرِ سند از دیوانِ اساتذہ) */}
            {sanadVerse && !matchedThesaurusEntry?.sampleVerse && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] border-r-3 border-[var(--accent-gold)]">
                <div className="flex items-center justify-between gap-1.5 text-xs text-[var(--accent-gold)] font-nastaliq mb-1">
                  <div className="flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    <span>شعرِ سند (دیوانِ اساتذہ — ملکِ عام):</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {sanadVerse.meterName}
                  </span>
                </div>
                <p
                  style={{ fontFamily }}
                  className="text-xs text-[var(--text-primary)] whitespace-pre-line leading-loose text-center py-1"
                >
                  {sanadVerse.misra1}
                  {'\n'}
                  {sanadVerse.misra2}
                </p>
                <span className="block text-[10px] text-[var(--text-muted)] text-left font-nastaliq mt-1">
                  — {sanadVerse.poetName}
                </span>
              </div>
            )}

            {/* Related Words by Root / Stem */}
            {sovereignResult.relatedByRoot.length > 0 && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>ہم مادہ و مشتق الفاظ ({sovereignResult.readings[0]?.root})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {sovereignResult.relatedByRoot.map((relWord) => (
                    <button
                      key={relWord}
                      type="button"
                      data-selectable-id={`root-rel:${relWord}`}
                      data-selectable-word={relWord}
                      style={{ fontFamily }}
                      onClick={() => setSearchTerm(relWord)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold)]/15 hover:border-[var(--accent-gold)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-nastaliq transition-all cursor-pointer"
                      title="لغت میں دیکھنے کے لیے کلک کریں"
                    >
                      {relWord}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prefix / Similar Dictionary Matches */}
            {sovereignResult.prefixMatches.length > 0 && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>لغت میں ملتے جلتے الفاظ</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {sovereignResult.prefixMatches.map((mWord) => (
                    <button
                      key={mWord}
                      type="button"
                      data-selectable-id={`prefix:${mWord}`}
                      data-selectable-word={mWord}
                      style={{ fontFamily }}
                      onClick={() => setSearchTerm(mWord)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-surface)] hover:bg-[var(--accent-gold)]/15 hover:border-[var(--accent-gold)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-nastaliq transition-all cursor-pointer"
                    >
                      {mWord}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Poetic Thesaurus Entry (Synonyms, Antonyms, Compounds, Sample Verse) */}
        {matchedThesaurusEntry && (
          <div className="space-y-3">
            {/* Synonyms Card */}
            <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>ہم معنی و مترادف الفاظ ({matchedThesaurusEntry.word})</span>
              </h4>
              <div className="text-xs font-nastaliq text-[var(--text-secondary)] mb-2">
                <span className="text-[var(--text-muted)] ml-1">ادبی معانی:</span>
                <span>{matchedThesaurusEntry.meanings.join('، ')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchedThesaurusEntry.synonyms.map((s) => (
                  <span
                    key={s}
                    data-selectable-id={`synonym:${s}`}
                    data-selectable-word={s}
                    style={{ fontFamily }}
                    onClick={() => {
                      setSearchTerm(s);
                      if (onSelectWordToInsert) onSelectWordToInsert(s);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold)]/15 hover:border-[var(--accent-gold)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-nastaliq transition-all cursor-pointer"
                    title="کلک کریں"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Antonyms Card */}
            {matchedThesaurusEntry.antonyms && matchedThesaurusEntry.antonyms.length > 0 && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2">
                  متضاد الفاظ (Antonyms)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchedThesaurusEntry.antonyms.map((a) => (
                    <span
                      key={a}
                      data-selectable-id={`antonym:${a}`}
                      data-selectable-word={a}
                      style={{ fontFamily }}
                      onClick={() => setSearchTerm(a)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-nastaliq cursor-pointer hover:border-[var(--accent-gold)]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compounds Card */}
            {matchedThesaurusEntry.compounds && matchedThesaurusEntry.compounds.length > 0 && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2">
                  مرکبات و تراکیب
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchedThesaurusEntry.compounds.map((c) => (
                    <span
                      key={c}
                      data-selectable-id={`compound:${c}`}
                      data-selectable-word={c}
                      style={{ fontFamily }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-nastaliq"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Illustrative Verse */}
            {matchedThesaurusEntry.sampleVerse && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] border-r-3 border-[var(--accent-gold)]">
                <div className="flex items-center gap-1.5 text-xs text-[var(--accent-gold)] font-nastaliq mb-1">
                  <Quote className="w-3.5 h-3.5" />
                  <span>شعرِ سند:</span>
                </div>
                <p
                  style={{ fontFamily }}
                  className="text-xs text-[var(--text-primary)] whitespace-pre-line leading-loose text-center py-1"
                >
                  {matchedThesaurusEntry.sampleVerse.verse}
                </p>
                <span className="block text-[10px] text-[var(--text-muted)] text-left font-nastaliq mt-1">
                  — {matchedThesaurusEntry.sampleVerse.poet}
                </span>
              </div>
            )}
          </div>
        )}

        {(!sovereignResult || sovereignResult.readings.length === 0) &&
          !matchedThesaurusEntry && (
            <div className="p-6 text-center text-xs text-[var(--text-muted)] font-nastaliq">
              اس لفظ کے لیے ابھی لغت میں اندراج موجود نہیں ہے۔ اوپر دیے گئے منتخب الفاظ میں سے انتخاب فرمائیں یا متن میں کسی دوسرے لفظ کو منتخب کریں۔
            </div>
          )}
      </WordSelectionArea>
    </div>
  );
};
