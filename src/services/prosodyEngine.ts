import { CLASSICAL_METERS } from '../data/classicalMeters';
import { PoeticMeter } from '../types/editor';
import { stripDiacritics, stripInvisibleChars, extractUrduTokens } from './unicodeNormalizer';

export interface LineProsodyAnalysis {
  lineNumber: number;
  rawText: string;
  wordCount: number;
  charCount: number;
  approxSyllables: number;
  scansionGuide: string[]; // estimated short/long tags
}

/**
 * Approximate syllable weight for Urdu words:
 * In Urdu prosody:
 * - A short syllable (متحرک / 'v') is a single consonant with short vowel
 * - A long syllable (ساکن / '-') is a closed syllable (CVC) or long vowel (CVV like ا، و، ی)
 */
export function estimateWordSyllableCount(word: string): number {
  const clean = stripDiacritics(stripInvisibleChars(word)).replace(/[^ء-ي]/g, '');
  if (!clean) return 0;

  // Urdu long vowel indicators: Alef (ا), Wao (و), Chhoti Yeh (ی), Bari Yeh (ے), Ain (ع)
  const length = clean.length;
  if (length <= 2) return 1;
  if (length <= 4) return 2;
  if (length <= 6) return 3;
  return Math.ceil(length / 2);
}

/**
 * Analyses a single misra (line) for prosodic metrics
 */
export function analyzeMisra(lineText: string, lineNumber: number = 1): LineProsodyAnalysis {
  const words = extractUrduTokens(lineText);
  let totalSyllables = 0;
  const scansionGuide: string[] = [];

  for (const word of words) {
    const syllables = estimateWordSyllableCount(word);
    totalSyllables += syllables;
    // Simple visual rhythm flag: short (v) or long (-)
    scansionGuide.push(syllables > 1 ? '—' : 'ᴗ');
  }

  const charCount = stripInvisibleChars(lineText).replace(/\s/g, '').length;

  return {
    lineNumber,
    rawText: lineText,
    wordCount: words.length,
    charCount,
    approxSyllables: totalSyllables,
    scansionGuide,
  };
}

/**
 * Finds the closest matching classical meter by keyword, name, or rukn pattern
 */
export function searchMeters(query: string): PoeticMeter[] {
  if (!query.trim()) return CLASSICAL_METERS;

  const normalized = query.toLowerCase().trim();
  return CLASSICAL_METERS.filter(
    (m) =>
      m.nameUrdu.includes(normalized) ||
      m.pattern.includes(normalized) ||
      m.nameEnglish.toLowerCase().includes(normalized) ||
      m.description.includes(normalized)
  );
}
