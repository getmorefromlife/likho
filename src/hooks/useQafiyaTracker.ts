import { useState, useEffect, useCallback, useMemo } from 'react';
import { QafiyaChip } from '../types/editor';
import { getPoemNormalizedWordSet, isRhymeWordMatch } from '../services/unicodeNormalizer';

export function useQafiyaTracker(initialWords: string[], poemContent: string) {
  // Initialize chips
  const [chips, setChips] = useState<QafiyaChip[]>(() =>
    initialWords.map((word, idx) => ({
      id: `qafiya-${idx}-${word}`,
      word,
      isUsed: false,
      isManualOverride: false,
    }))
  );

  const [searchFilter, setSearchFilter] = useState('');

  // Real-time Auto-Detection Engine:
  // Scans editor text whenever poemContent changes
  useEffect(() => {
    const poemWords = getPoemNormalizedWordSet(poemContent);

    setChips((prevChips) =>
      prevChips.map((chip) => {
        // If user manually overrode this chip, respect their manual action
        if (chip.isManualOverride) {
          return chip;
        }

        // Check if any word in the poem matches this chip
        let matched = false;
        for (const pWord of poemWords) {
          if (isRhymeWordMatch(pWord, chip.word)) {
            matched = true;
            break;
          }
        }

        return {
          ...chip,
          isUsed: matched,
        };
      })
    );
  }, [poemContent]);

  // Manual Toggle
  const toggleChipStatus = useCallback((id: string) => {
    setChips((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isUsed: !c.isUsed,
              isManualOverride: true, // Lock user's explicit click
            }
          : c
      )
    );
  }, []);

  // Add custom rhyme word
  const addWord = useCallback((rawWord: string) => {
    const word = rawWord.trim();
    if (!word) return;

    setChips((prev) => {
      // Don't add if already exists
      if (prev.some((c) => isRhymeWordMatch(c.word, word))) {
        return prev;
      }
      return [
        {
          id: `custom-${Date.now()}-${word}`,
          word,
          isUsed: false,
          isManualOverride: false,
        },
        ...prev,
      ];
    });
  }, []);

  // Remove a rhyme word
  const removeWord = useCallback((id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Load an entire group from Treasury
  const loadWords = useCallback((words: string[], replace: boolean = false) => {
    const newChips: QafiyaChip[] = words.map((w, idx) => ({
      id: `treasury-${Date.now()}-${idx}-${w}`,
      word: w,
      isUsed: false,
      isManualOverride: false,
    }));

    setChips((prev) => {
      if (replace) return newChips;
      // Merge unique
      const existingMap = new Set(prev.map((c) => c.word));
      const filteredNew = newChips.filter((c) => !existingMap.has(c.word));
      return [...filteredNew, ...prev];
    });
  }, []);

  // Reset all manual overrides to re-sync strictly with text
  const resyncWithText = useCallback(() => {
    const poemWords = getPoemNormalizedWordSet(poemContent);
    setChips((prev) =>
      prev.map((chip) => {
        let matched = false;
        for (const pWord of poemWords) {
          if (isRhymeWordMatch(pWord, chip.word)) {
            matched = true;
            break;
          }
        }
        return {
          ...chip,
          isUsed: matched,
          isManualOverride: false,
        };
      })
    );
  }, [poemContent]);

  // Filtered chips based on in-tray search input
  const filteredChips = useMemo(() => {
    if (!searchFilter.trim()) return chips;
    const filter = searchFilter.trim();
    return chips.filter((c) => c.word.includes(filter));
  }, [chips, searchFilter]);

  // Statistics
  const usedCount = useMemo(() => chips.filter((c) => c.isUsed).length, [chips]);
  const totalCount = chips.length;

  return {
    chips,
    filteredChips,
    searchFilter,
    setSearchFilter,
    toggleChipStatus,
    addWord,
    removeWord,
    loadWords,
    resyncWithText,
    usedCount,
    totalCount,
  };
}
