import { CLASSICAL_METERS } from '../data/classicalMeters';
import { PoeticMeter } from '../types/editor';
import { stripInvisibleChars } from './unicodeNormalizer';
import { scanPoetryLine, scanWords } from './aroozEngine';
export interface LineProsodyAnalysis {
  lineNumber: number; rawText: string; wordCount: number; charCount: number;
  /** Compatibility field: now counts actual selected metrical positions. */
  approxSyllables: number; scansionGuide: string[]; uncertainWords: string[];
}
export function estimateWordSyllableCount(word: string): number {
  return scanWords(word)[0]?.variants[0]?.length || 0;
}
export function analyzeMisra(lineText: string, lineNumber = 1): LineProsodyAnalysis {
  const words = scanWords(lineText);
  const scan = scanPoetryLine(lineText);
  return { lineNumber, rawText: lineText, wordCount: words.length,
    charCount: stripInvisibleChars(lineText).replace(/\s/g, '').length,
    approxSyllables: scan.totalSyllables, scansionGuide: [...scan.rawSyllables],
    uncertainWords: words.filter(w => w.source === 'unresolved' || w.source === 'user-entry').map(w => w.word) };
}
export function searchMeters(query: string): PoeticMeter[] {
  const normalized = query.toLowerCase().trim();
  return CLASSICAL_METERS.filter(m => !normalized || m.nameUrdu.includes(normalized) || m.pattern.includes(normalized) || m.nameEnglish.toLowerCase().includes(normalized) || m.description.includes(normalized));
}
