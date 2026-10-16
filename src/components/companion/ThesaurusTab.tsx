import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Quote } from 'lucide-react';
import { URDU_THESAURUS } from '../../data/urduThesaurus';
import { normalizeForRhyme } from '../../services/unicodeNormalizer';

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

  // If user selected a word in the poetry canvas, automatically look it up!
  useEffect(() => {
    if (selectedWord && selectedWord.trim()) {
      const normalized = normalizeForRhyme(selectedWord);
      // Look for exact or partial key match
      const foundKey = Object.keys(URDU_THESAURUS).find((k) => normalizeForRhyme(k) === normalized);
      if (foundKey) {
        setSearchTerm(foundKey);
      } else {
        setSearchTerm(selectedWord.trim());
      }
    }
  }, [selectedWord]);

  const normalizedQuery = normalizeForRhyme(searchTerm);
  const matchedEntry =
    URDU_THESAURUS[searchTerm] ||
    Object.values(URDU_THESAURUS).find(
      (entry) =>
        normalizeForRhyme(entry.word) === normalizedQuery ||
        entry.synonyms.some((s) => normalizeForRhyme(s) === normalizedQuery)
    );

  const suggestedWords = ['عشق', 'دل', 'شب', 'سحر', 'صبا', 'جام', 'یار', 'بہار', 'غم', 'جنوں', 'وفا'];

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Search Bar */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="لفظ تحریر کریں (مثلاً: عشق، دل، شب)..."
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
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {matchedEntry ? (
          <div className="space-y-3">
            {/* Main Word Header */}
            <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <h3
                  style={{ fontFamily }}
                  className="text-2xl font-bold text-[var(--accent-gold)]"
                >
                  {matchedEntry.word}
                </h3>
                <span className="text-[11px] font-nastaliq px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] font-medium">
                  لغت و مترادفات
                </span>
              </div>

              {/* Meanings */}
              <div className="text-xs font-nastaliq text-[var(--text-secondary)] mb-2">
                <span className="text-[var(--text-muted)] ml-1">معانی:</span>
                <span>{matchedEntry.meanings.join('، ')}</span>
              </div>
            </div>

            {/* Synonyms Card */}
            <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>ہم معنی و مترادف الفاظ (Synonyms)</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchedEntry.synonyms.map((s) => (
                  <span
                    key={s}
                    style={{ fontFamily }}
                    onClick={() => onSelectWordToInsert && onSelectWordToInsert(s)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-subtle)] hover:bg-[var(--accent-gold)]/15 hover:border-[var(--accent-gold)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-nastaliq transition-all cursor-pointer"
                    title="کلک کریں"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Antonyms Card */}
            {matchedEntry.antonyms && matchedEntry.antonyms.length > 0 && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2">
                  متضاد الفاظ (Antonyms)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchedEntry.antonyms.map((a) => (
                    <span
                      key={a}
                      style={{ fontFamily }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-nastaliq"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compounds Card */}
            {matchedEntry.compounds && matchedEntry.compounds.length > 0 && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <h4 className="text-xs font-bold font-nastaliq text-[var(--text-primary)] mb-2">
                  مرکبات و تراکیب
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchedEntry.compounds.map((c) => (
                    <span
                      key={c}
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
            {matchedEntry.sampleVerse && (
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] border-r-3 border-[var(--accent-gold)]">
                <div className="flex items-center gap-1.5 text-xs text-[var(--accent-gold)] font-nastaliq mb-1">
                  <Quote className="w-3.5 h-3.5" />
                  <span>شعرِ سند:</span>
                </div>
                <p
                  style={{ fontFamily }}
                  className="text-xs text-[var(--text-primary)] whitespace-pre-line leading-loose text-center py-1"
                >
                  {matchedEntry.sampleVerse.verse}
                </p>
                <span className="block text-[10px] text-[var(--text-muted)] text-left font-nastaliq mt-1">
                  — {matchedEntry.sampleVerse.poet}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[var(--text-muted)] font-nastaliq">
            اس لفظ کے لیے ابھی لغت میں اندراج موجود نہیں ہے۔ اوپر دیے گئے منتخب الفاظ میں سے انتخاب فرمائیں یا متن میں کسی دوسرے لفظ کو منتخب کریں۔
          </div>
        )}
      </div>
    </div>
  );
};
