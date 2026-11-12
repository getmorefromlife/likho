import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  BookOpen,
  Search,
  Sparkles,
  ScrollText,
  Award,
  Layers,
  ChevronRight,
  ChevronLeft,
  ListOrdered,
  ArrowRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  PanelRight,
  PanelLeft,
} from 'lucide-react';
import {
  CLASSICAL_DIWAN_POETS,
  ClassicalPoet,
  ClassicalPoem,
  getClassicalDiwanStats,
} from '../../data/sovereign/classicalDiwanCorpus';
import {
  loadSovereignLexicon,
  lookupSovereignWord,
  SOVEREIGN_LEXICON_META,
} from '../../services/sovereignLexiconService';

interface ClassicalDiwanReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontFamily?: string;
}

export const ClassicalDiwanReaderModal: React.FC<ClassicalDiwanReaderModalProps> = ({
  isOpen,
  onClose,
  fontFamily = 'Noto Nastaliq Urdu',
}) => {
  const [selectedPoetId, setSelectedPoetId] = useState<string>('ghalib');
  const [selectedPoemId, setSelectedPoemId] = useState<string>('ghalib-1');
  const [inspectedWord, setInspectedWord] = useState<string | null>('تحریر');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [poetPoemSearch, setPoetPoemSearch] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [radifFilter, setRadifFilter] = useState<string>('all');
  const [lexiconReady, setLexiconReady] = useState(false);
  const [fontSize, setFontSize] = useState<number>(24);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showPoetSidebar, setShowPoetSidebar] = useState<boolean>(true);
  const [showDictionarySidebar, setShowDictionarySidebar] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void loadSovereignLexicon().then(() => setLexiconReady(true));
  }, []);

  // Keyboard navigation: Escape to exit, Arrow keys for prev/next poem
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

  // Track browser fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      /* Fullscreen fallback */
    }
  };

  const activePoet: ClassicalPoet = useMemo(() => {
    return (
      CLASSICAL_DIWAN_POETS.find((p) => p.id === selectedPoetId) ||
      CLASSICAL_DIWAN_POETS[0]
    );
  }, [selectedPoetId]);

  const activePoem: ClassicalPoem = useMemo(() => {
    return (
      activePoet.poems.find((pm) => pm.id === selectedPoemId) ||
      activePoet.poems[0]
    );
  }, [activePoet, selectedPoemId]);

  const handleSelectPoet = (poet: ClassicalPoet) => {
    setSelectedPoetId(poet.id);
    setPoetPoemSearch('');
    setGenreFilter('all');
    setRadifFilter('all');
    if (poet.poems.length > 0) {
      setSelectedPoemId(poet.poems[0].id);
    }
  };

  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    for (const p of activePoet.poems) {
      set.add(p.form);
    }
    return Array.from(set);
  }, [activePoet]);

  const availableRadifs = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of activePoet.poems) {
      if (p.form === 'غزل' && p.radif) {
        const lastChar = p.radif.trim().slice(-1);
        if (lastChar) {
          map.set(lastChar, (map.get(lastChar) || 0) + 1);
        }
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'ur'));
  }, [activePoet]);

  const filteredActivePoetPoems = useMemo(() => {
    return activePoet.poems.filter((p) => {
      if (genreFilter !== 'all') {
        if (p.form !== genreFilter) return false;
      }
      if (radifFilter !== 'all') {
        if (p.form !== 'غزل' || !p.radif.endsWith(radifFilter)) return false;
      }
      if (poetPoemSearch.trim()) {
        const q = poetPoemSearch.trim();
        const matchesTitle = p.title.includes(q);
        const matchesFirstCouplet =
          p.couplets[0]?.misra1.includes(q) || p.couplets[0]?.misra2.includes(q);
        if (!matchesTitle && !matchesFirstCouplet) return false;
      }
      return true;
    });
  }, [activePoet, genreFilter, radifFilter, poetPoemSearch]);

  const currentPoemIndex = activePoet.poems.findIndex((p) => p.id === activePoem.id);
  const hasPreviousPoem = currentPoemIndex > 0;
  const hasNextPoem = currentPoemIndex >= 0 && currentPoemIndex < activePoet.poems.length - 1;

  const handlePreviousPoem = () => {
    if (hasPreviousPoem) {
      setSelectedPoemId(activePoet.poems[currentPoemIndex - 1].id);
      setInspectedWord(null);
    }
  };

  const handleNextPoem = () => {
    if (hasNextPoem) {
      setSelectedPoemId(activePoet.poems[currentPoemIndex + 1].id);
      setInspectedWord(null);
    }
  };

  // Global search across all poets & couplets when searchQuery is non-empty
  const searchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return null;
    const matches: Array<{
      poet: ClassicalPoet;
      poem: ClassicalPoem;
      misra1: string;
      misra2: string;
    }> = [];
    for (const poet of CLASSICAL_DIWAN_POETS) {
      for (const poem of poet.poems) {
        for (const c of poem.couplets) {
          if (
            c.misra1.includes(q) ||
            c.misra2.includes(q) ||
            poem.title.includes(q) ||
            poet.name.includes(q)
          ) {
            matches.push({ poet, poem, misra1: c.misra1, misra2: c.misra2 });
          }
        }
      }
    }
    return matches;
  }, [searchQuery]);

  const wordLookup = useMemo(() => {
    if (!lexiconReady || !inspectedWord || !inspectedWord.trim()) return null;
    const clean = inspectedWord
      .replace(/[\u064B-\u065F\u0670،۔!؟?؛:]/gu, '')
      .replace(/ۂ$/u, 'ہ')
      .trim();
    return lookupSovereignWord(clean, 8);
  }, [lexiconReady, inspectedWord]);

  const stats = useMemo(() => getClassicalDiwanStats(), []);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] font-nastaliq select-none animate-in fade-in duration-200"
      dir="rtl"
      role="region"
      aria-label="دیوانِ اساتذہ — مطالعۂ کلامِ کلاسیکی"
    >
      {/* 1. Full-Screen Elegant Top Header Bar */}
      <header className="h-16 px-4 sm:px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Right Section: Back to Studio Button, App Title & Public-Domain Badge */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 text-[var(--text-primary)] text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="قلم و قافیہ اسٹوڈیو میں واپس جائیں (Esc)"
          >
            <ArrowRight className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>اسٹوڈیو میں واپس</span>
          </button>

          <div className="h-5 w-px bg-[var(--border-subtle)] hidden sm:block" />

          {/* Pen / Scroll Icon */}
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/40 flex items-center justify-center text-[var(--accent-gold)] shadow-inner shrink-0">
            <ScrollText className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1
                style={{ fontFamily }}
                className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-tight"
              >
                دیوانِ اساتذہ
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-nastaliq px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                ملکِ عام (100% Public Domain)
              </span>
            </div>
            <p className="text-[11px] font-nastaliq text-[var(--text-secondary)] hidden md:block">
              {stats.totalPoets} کلاسیکی اساتذہ • {stats.totalPoems} شاہکار کلام • {stats.totalCouplets} اشعار مع لغتِ قلم و قافیہ
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="اشعار، شاعر یا لفظ تلاش کریں..."
            style={{ fontFamily }}
            className="w-full pl-8 pr-9 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors shadow-2xs"
          />
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-[var(--accent-gold)]" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2 text-[var(--text-muted)] hover:text-red-500 text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Left Section: Font Sizing, Fullscreen, Sidebar Toggles & Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Font Size Controls */}
          <div className="flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-0.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="خط چھوٹا کریں"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-[var(--accent-gold)] font-bold">
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={() => setFontSize((prev) => Math.min(36, prev + 2))}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="خط بڑا کریں"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Sidebar Buttons */}
          <button
            type="button"
            onClick={() => setShowPoetSidebar((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all text-xs cursor-pointer ${
              showPoetSidebar
                ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)]/50 text-[var(--accent-gold)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
            title="فہرستِ شعرا و کلام چھپائیں / دکھائیں"
          >
            <PanelRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowDictionarySidebar((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all text-xs cursor-pointer ${
              showDictionarySidebar
                ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)]/50 text-[var(--accent-gold)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
            title="لغتِ قلم و قافیہ پینل چھپائیں / دکھائیں"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
            title={isFullscreen ? 'عام منظر' : 'مکمل سکرین منظر'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-[var(--accent-gold)]" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="دیوانِ اساتذہ بند کریں"
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors cursor-pointer"
            title="بند کریں (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Full-Screen 3-Column Main Reading Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Right Column: Poets Roster & Full Accordion of All Kalams */}
        {showPoetSidebar && (
          <aside className="w-72 sm:w-80 md:w-88 border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 flex flex-col overflow-y-auto p-3 space-y-2.5 custom-scrollbar shrink-0 shadow-xs">
            <div className="px-2 py-1 text-xs font-bold font-nastaliq text-[var(--text-muted)] flex items-center justify-between">
              <span>شعرائے کرام و کلام ({CLASSICAL_DIWAN_POETS.length})</span>
              <Award className="w-4 h-4 text-[var(--accent-gold)]" />
            </div>

            {CLASSICAL_DIWAN_POETS.map((poet) => {
              const active = poet.id === activePoet.id && !searchQuery.trim();
              return (
                <div key={poet.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      handleSelectPoet(poet);
                    }}
                    className={`w-full text-right p-3 rounded-2xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--text-primary)] shadow-xs font-bold'
                        : 'bg-[var(--bg-card)]/70 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:border-[var(--accent-gold)]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        style={{ fontFamily }}
                        className="text-base font-bold text-[var(--text-primary)]"
                      >
                        {poet.name}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        {poet.birthYear}–{poet.deathYear}
                      </span>
                    </div>
                    <div className="text-[11px] font-nastaliq text-[var(--text-muted)] mt-1 flex items-center justify-between">
                      <span className="truncate">{poet.dabistan}</span>
                      <span className="font-bold text-[var(--accent-gold)] shrink-0 mr-1.5 px-2 py-0.5 rounded-md bg-[var(--accent-gold)]/10">
                        {poet.poems.length} کلام
                      </span>
                    </div>
                  </button>

                  {/* Expandable Accordion List of All Poems for Active Poet */}
                  {active && (
                    <div className="mr-2 pr-2.5 py-1.5 space-y-2 border-r-2 border-[var(--accent-gold)] animate-in fade-in slide-in-from-top-1">
                      {/* Header with count and filters */}
                      <div className="text-[11px] font-nastaliq text-[var(--text-muted)] px-1 font-semibold flex items-center justify-between">
                        <span>فہرستِ کلام:</span>
                        <span className="font-mono text-[var(--accent-gold)] font-bold">
                          {filteredActivePoetPoems.length} / {poet.poems.length}
                        </span>
                      </div>

                      {/* Search box if poet has > 6 poems */}
                      {poet.poems.length > 6 && (
                        <div className="relative">
                          <input
                            type="text"
                            value={poetPoemSearch}
                            onChange={(e) => setPoetPoemSearch(e.target.value)}
                            placeholder="کلام یا مصرع تلاش کریں..."
                            style={{ fontFamily }}
                            className="w-full pl-6 pr-7 py-1 text-[11px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                          />
                          <Search className="w-3 h-3 absolute right-2 top-2 text-[var(--accent-gold)]" />
                          {poetPoemSearch && (
                            <button
                              type="button"
                              onClick={() => setPoetPoemSearch('')}
                              className="absolute left-1.5 top-1.5 text-[var(--text-muted)] hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Genre pills if multiple genres exist (e.g. Ghalib) */}
                      {availableGenres.length > 1 && (
                        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 text-[10px] font-nastaliq">
                          <button
                            type="button"
                            onClick={() => {
                              setGenreFilter('all');
                              setRadifFilter('all');
                            }}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                              genreFilter === 'all'
                                ? 'bg-[var(--accent-gold)] text-white font-bold'
                                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                            }`}
                          >
                            سب ({poet.poems.length})
                          </button>
                          {availableGenres.map((g) => {
                            const count = poet.poems.filter((p) => p.form === g).length;
                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  setGenreFilter(g);
                                  setRadifFilter('all');
                                }}
                                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                                  genreFilter === g
                                    ? 'bg-[var(--accent-gold)] text-white font-bold'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                                }`}
                              >
                                {g} ({count})
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Radif pills if genre is غزل or all and poet has > 8 radifs */}
                      {(genreFilter === 'all' || genreFilter === 'غزل') && availableRadifs.length > 5 && (
                        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 text-[10px] font-nastaliq">
                          <button
                            type="button"
                            onClick={() => setRadifFilter('all')}
                            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer shrink-0 ${
                              radifFilter === 'all'
                                ? 'bg-[var(--accent-gold)] text-white font-bold'
                                : 'bg-[var(--bg-canvas)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            تمام ردیفیں
                          </button>
                          {availableRadifs.map(([char, count]) => (
                            <button
                              key={char}
                              type="button"
                              onClick={() => setRadifFilter(char)}
                              title={`ردیف ${char} (${count} کلام)`}
                              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer shrink-0 font-bold ${
                                radifFilter === char
                                  ? 'bg-[var(--accent-gold)] text-white'
                                  : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              {char} <span className="text-[9px] opacity-70">({count})</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Poem list */}
                      <div className="space-y-1 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                        {filteredActivePoetPoems.length === 0 ? (
                          <div className="text-center py-4 text-xs font-nastaliq text-[var(--text-muted)]">
                            کوئی کلام نہیں ملا
                          </div>
                        ) : (
                          filteredActivePoetPoems.map((pm) => {
                            const isPoemActive = pm.id === activePoem.id;
                            const origIdx = poet.poems.findIndex((p) => p.id === pm.id) + 1;
                            return (
                              <button
                                key={pm.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPoemId(pm.id);
                                  setInspectedWord(null);
                                }}
                                style={{ fontFamily }}
                                className={`w-full text-right px-2 py-1.5 rounded-xl text-xs leading-normal transition-all flex items-start gap-1.5 cursor-pointer ${
                                  isPoemActive
                                    ? 'bg-[var(--accent-gold)] text-white font-bold shadow-xs'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                                }`}
                              >
                                <span className="text-[10px] opacity-75 shrink-0 mt-0.5 font-mono">
                                  {origIdx}.
                                </span>
                                <div className="flex-1 text-right min-w-0">
                                  <span className="line-clamp-1 block">{pm.title}</span>
                                  <span
                                    className={`text-[10px] block mt-0.5 ${
                                      isPoemActive ? 'text-white/80' : 'text-[var(--text-muted)]'
                                    }`}
                                  >
                                    <span className="font-bold ml-1">[{pm.form}]</span>
                                    {pm.couplets.length} اشعار • {pm.meterName.split(' ')[0]}
                                    {pm.radif ? ` • ردیف: ${pm.radif}` : ''}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </aside>
        )}

        {/* Center Column: Full-Screen Classical Kalam Canvas & Reader */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-14 py-6 space-y-5 custom-scrollbar bg-[var(--bg-canvas)]">
          {searchResults ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <h2 className="text-base font-bold font-nastaliq text-[var(--accent-gold)]">
                  تلاش کے نتائج برائے «{searchQuery}» ({searchResults.length} اشعار ملے)
                </h2>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-nastaliq text-[var(--text-secondary)] hover:text-[var(--accent-gold)] underline cursor-pointer"
                >
                  تلاش صاف کریں
                </button>
              </div>

              {searchResults.map((item, idx) => (
                <div
                  key={`${item.poem.id}-${idx}`}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPoetId(item.poet.id);
                    setSelectedPoemId(item.poem.id);
                  }}
                  className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)] hover:shadow-md cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-nastaliq text-[var(--text-muted)]">
                    <span className="text-[var(--accent-gold)] font-bold text-sm">
                      {item.poet.name} — {item.poem.title}
                    </span>
                    <span>{item.poem.meterName}</span>
                  </div>
                  <div
                    style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: 2.8 }}
                    className="text-center text-[var(--text-primary)] py-2"
                  >
                    <p>{item.misra1}</p>
                    <p>{item.misra2}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-5">
              {/* Poet Bio & Context Banner */}
              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 shadow-2xs space-y-3.5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2
                      style={{ fontFamily }}
                      className="text-2xl font-bold text-[var(--accent-gold)] flex items-center gap-2"
                    >
                      <span>{activePoet.fullName}</span>
                      <span className="text-sm font-nastaliq text-[var(--text-muted)] font-normal">
                        ({activePoet.takhallus})
                      </span>
                    </h2>
                    <p className="text-xs font-nastaliq text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-2xl">
                      {activePoet.bio}
                    </p>
                  </div>
                  <span className="text-[11px] font-nastaliq px-3 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] shrink-0">
                    {activePoet.rightsNote}
                  </span>
                </div>

                {/* Numbered Poem Chips Row */}
                {activePoet.poems.length > 1 && (
                  <div className="pt-3 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                      <span className="text-xs font-nastaliq text-[var(--text-muted)] shrink-0 ml-1">
                        انتخابِ کلام ({activePoet.poems.length}):
                      </span>
                      {activePoet.poems.map((pm, idx) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => {
                            setSelectedPoemId(pm.id);
                            setInspectedWord(null);
                          }}
                          style={{ fontFamily }}
                          className={`px-3 py-1 rounded-xl text-xs border transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                            pm.id === activePoem.id
                              ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold shadow-2xs'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
                          }`}
                        >
                          <span className="text-[10px] font-mono opacity-70">{idx + 1}.</span>
                          <span>{pm.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prev / Next Kalam Navigation Bar */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-nastaliq shadow-2xs">
                <button
                  type="button"
                  onClick={handlePreviousPoem}
                  disabled={!hasPreviousPoem}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                    hasPreviousPoem
                      ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 cursor-pointer shadow-2xs'
                      : 'border-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 text-[var(--accent-gold)]" />
                  <span className="font-bold">پچھلا کلام</span>
                </button>

                <div className="flex items-center gap-2 text-center">
                  <ListOrdered className="w-4 h-4 text-[var(--accent-gold)]" />
                  <span className="font-bold text-sm text-[var(--text-primary)]">
                    کلام {currentPoemIndex + 1} از {activePoet.poems.length}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    ({activePoem.couplets.length} اشعار)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNextPoem}
                  disabled={!hasNextPoem}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                    hasNextPoem
                      ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 cursor-pointer shadow-2xs'
                      : 'border-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                  }`}
                >
                  <span className="font-bold">اگلا کلام</span>
                  <ChevronLeft className="w-4 h-4 text-[var(--accent-gold)]" />
                </button>
              </div>

              {/* Active Poem Metrical & Literary Metadata Bar */}
              <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between flex-wrap gap-2.5 text-xs font-nastaliq">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] font-bold text-sm">
                    {activePoem.form}: {activePoem.meterName}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                    ارکان: <strong>{activePoem.arkan}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-[var(--text-secondary)]">
                  <span>
                    قوافی: <strong>{activePoem.qafiyaSample.join('، ')}</strong>
                  </span>
                  {activePoem.radif && (
                    <span>
                      • ردیف: <strong>«{activePoem.radif}»</strong>
                    </span>
                  )}
                  <span className="text-[var(--text-muted)]">
                    ({activePoem.sourceBook}، {activePoem.publicationYear}ء)
                  </span>
                </div>
              </div>

              {/* Interactive Couplets Canvas */}
              <div className="space-y-4">
                <div className="text-xs font-nastaliq text-[var(--text-muted)] text-center py-1">
                  کسی بھی لفظ پر کلک کریں تاکہ لغتِ قلم و قافیہ میں اس کا اعراب، معنی، مادہ اور تقطیع دیکھی جا سکے۔
                </div>

                {activePoem.couplets.map((couplet, cIdx) => (
                  <div
                    key={`${activePoem.id}-c-${cIdx}`}
                    className="p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs hover:border-[var(--accent-gold)]/50 transition-all space-y-4 text-center"
                  >
                    {[couplet.misra1, couplet.misra2].map((misra, mIdx) => (
                      <div
                        key={mIdx}
                        style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: 2.8 }}
                        className="flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1 text-[var(--text-primary)]"
                      >
                        {misra.split(/\s+/u).map((word, wIdx) => {
                          const clean = word
                            .replace(/[\u064B-\u065F\u0670،۔!؟?؛:]/gu, '')
                            .replace(/ۂ$/u, 'ہ')
                            .trim();
                          const isSelected = inspectedWord === clean;
                          return (
                            <button
                              key={`${mIdx}-${wIdx}`}
                              type="button"
                              onClick={() => setInspectedWord(clean)}
                              style={{ fontFamily }}
                              className={`px-2 py-0.5 rounded-xl transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold ring-2 ring-[var(--accent-gold)] shadow-xs'
                                  : 'hover:bg-[var(--bg-surface)] hover:text-[var(--accent-gold)]'
                              }`}
                              title={`لفظ «${clean}» کی تشریح لغت میں دیکھیں`}
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                    <div className="text-[11px] font-mono text-[var(--text-muted)] opacity-60">
                      شعر {cIdx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Left Column: Live Sovereign Dictionary Inspector */}
        {showDictionarySidebar && (
          <aside className="w-80 sm:w-96 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 flex flex-col overflow-y-auto p-4 custom-scrollbar shrink-0 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />
                <h3 className="text-sm font-bold font-nastaliq text-[var(--text-primary)]">
                  لغتِ قلم و قافیہ
                </h3>
              </div>
              <span className="text-[10px] font-nastaliq px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                کلین روم لغت
              </span>
            </div>

            {inspectedWord && wordLookup ? (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Word Title & Syllable / Meter Breakdown */}
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--accent-gold)]/40 shadow-xs text-center space-y-2">
                  <h4
                    style={{ fontFamily }}
                    className="text-2xl font-bold text-[var(--accent-gold)]"
                  >
                    {wordLookup.word}
                  </h4>
                  {wordLookup.readings[0] && (
                    <div className="space-y-1.5">
                      <div className="text-sm font-nastaliq text-[var(--text-primary)] font-semibold">
                        تلفظ: <span className="text-[var(--accent-gold)]">{wordLookup.readings[0].vocalized}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-xs font-mono font-bold">
                          {wordLookup.readings[0].pattern}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-nastaliq">
                          رکن: <strong>{wordLookup.readings[0].rukn}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Readings */}
                <div className="space-y-3">
                  {wordLookup.readings.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2 text-xs font-nastaliq"
                    >
                      <div className="flex items-center justify-between text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] font-bold">
                          {r.pos}
                        </span>
                        {r.root && (
                          <span>
                            مادہ: <strong>«{r.root}»</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed text-sm">
                        {r.meaning}
                      </p>
                      {r.syllables && r.syllables.length > 0 && (
                        <div className="text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)] flex items-center justify-between">
                          <span>ہجے و تقطیع:</span>
                          <span className="font-mono text-[var(--accent-gold)]">
                            {r.syllables.join(' · ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Related Root Derivatives */}
                {wordLookup.relatedByRoot.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2">
                    <h5 className="text-xs font-bold font-nastaliq text-[var(--text-muted)] flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                      <span>ہم مادہ و مشتق الفاظ ({wordLookup.relatedByRoot.length}):</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {wordLookup.relatedByRoot.map((rw) => (
                        <button
                          key={rw}
                          type="button"
                          onClick={() => setInspectedWord(rw)}
                          style={{ fontFamily }}
                          className="px-2 py-0.5 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
                        >
                          {rw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-gold)] shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold font-nastaliq text-[var(--text-primary)]">
                  لفظ پر کلک کیجیے
                </h4>
                <p className="text-xs font-nastaliq leading-relaxed">
                  کلام کے کسی بھی شعر کے لفظ پر کلک کریں تاکہ لغتِ قلم و قافیہ ({SOVEREIGN_LEXICON_META.words.toLocaleString('ur-PK')} الفاظ) سے اس کا مکمل اعراب، معنی اور عروضی وزن یہاں ظاہر ہو۔
                </p>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default ClassicalDiwanReaderModal;
