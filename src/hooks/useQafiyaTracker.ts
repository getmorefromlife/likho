import { useState, useEffect, useCallback, useMemo } from 'react';
import { QafiyaChip } from '../types/editor';
import { getPoemNormalizedWordSet, isRhymeWordMatch } from '../services/unicodeNormalizer';

/** Draft-owned words are shared by the studio, quiet view, portfolio and backups. */
export function useQafiyaTracker(words: string[], poemContent: string, onWordsChange: (words: string[]) => void, draftId: string) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [searchFilter, setSearchFilter] = useState('');
  useEffect(() => { setOverrides({}); setSearchFilter(''); }, [draftId]);
  const poemWords = useMemo(() => [...getPoemNormalizedWordSet(poemContent)], [poemContent]);
  const chips = useMemo<QafiyaChip[]>(() => words.map((word, idx) => ({
    id: `qafiya-${idx}-${word}`, word,
    isUsed: overrides[word] ?? poemWords.some(p => isRhymeWordMatch(p, word)),
    isManualOverride: overrides[word] !== undefined,
  })), [words, poemWords, overrides]);
  const toggleChipStatus = useCallback((id: string) => {
    const chip = chips.find(c => c.id === id);
    if (chip) setOverrides(prev => ({ ...prev, [chip.word]: !chip.isUsed }));
  }, [chips]);
  const addWord = useCallback((raw: string) => {
    const word = raw.trim();
    if (word && !words.some(w => isRhymeWordMatch(w, word))) onWordsChange([word, ...words]);
  }, [words, onWordsChange]);
  const removeWord = useCallback((id: string) => {
    const chip = chips.find(c => c.id === id);
    if (chip) onWordsChange(words.filter((_, i) => i !== chips.indexOf(chip)));
  }, [chips, words, onWordsChange]);
  const loadWords = useCallback((incoming: string[], replace = false) => {
    const combined = replace ? incoming : [...incoming, ...words];
    onWordsChange([...new Set(combined.map(w => w.trim()).filter(Boolean))]);
  }, [words, onWordsChange]);
  const resyncWithText = useCallback(() => setOverrides({}), []);
  const filteredChips = useMemo(() => chips.filter(c => c.word.includes(searchFilter.trim())), [chips, searchFilter]);
  return { chips, filteredChips, searchFilter, setSearchFilter, toggleChipStatus, addWord, removeWord, loadWords, resyncWithText,
    usedCount: chips.filter(c => c.isUsed).length, totalCount: chips.length };
}
