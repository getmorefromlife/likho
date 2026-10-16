import React, { useState } from 'react';
import { Search, ArrowLeftCircle, Check } from 'lucide-react';
import { RHYME_TREASURY, RhymeCategory } from '../../data/rhymeTreasury';

interface RhymeTreasuryTabProps {
  onLoadToTray: (words: string[]) => void;
  fontFamily: string;
}

export const RhymeTreasuryTab: React.FC<RhymeTreasuryTabProps> = ({ onLoadToTray, fontFamily }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loadedCategory, setLoadedCategory] = useState<string | null>(null);

  const filteredTreasury = RHYME_TREASURY.filter((cat) => {
    const matchesCategory = selectedCategory === 'all' || cat.id === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      cat.wazn.includes(search) ||
      cat.themeName.includes(search) ||
      cat.words.some((w) => w.includes(search));
    return matchesCategory && matchesSearch;
  });

  const handleLoadGroup = (cat: RhymeCategory) => {
    onLoadToTray(cat.words);
    setLoadedCategory(cat.id);
    setTimeout(() => setLoadedCategory(null), 2500);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Search & Category Filter */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="قافیہ، وزن یا موضوع تلاش کریں..."
            className="w-full pl-2 pr-8 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq text-right"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[var(--text-muted)]" />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-nastaliq custom-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            تمام اوزان
          </button>
          {RHYME_TREASURY.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-0.5 rounded-full whitespace-nowrap border transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
              }`}
            >
              {cat.themeName}
            </button>
          ))}
        </div>
      </div>

      {/* Rhyme Group Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredTreasury.map((cat) => {
          const isJustLoaded = loadedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xs hover:border-[var(--accent-gold)]/50 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-bold font-nastaliq text-[var(--text-primary)] leading-snug">
                    {cat.themeName}
                  </h4>
                  <span className="text-[11px] font-mono text-[var(--accent-gold)] font-semibold">
                    {cat.wazn}
                  </span>
                </div>

                {/* "Load to Tray" Button */}
                <button
                  onClick={() => handleLoadGroup(cat)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-nastaliq transition-all font-medium border ${
                    isJustLoaded
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)]/40 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white'
                  }`}
                  title="اس گروہ کو فعال تختی میں منتقل کریں"
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

              {/* Word Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[var(--border-subtle)]/40">
                {cat.words.map((word) => (
                  <span
                    key={word}
                    style={{ fontFamily }}
                    className="px-2.5 py-0.5 rounded text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)]/60 font-nastaliq"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
