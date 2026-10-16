/**
 * Urdu Unicode Normalizer & Phonetic Rhyme Utilities
 * Specifically tailored for Classical and Modern Urdu Nastaliq typography
 */

// Comprehensive set of Urdu/Arabic Diacritics (اعراب)
export const URDU_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;

// Invisible and Zero-width characters
export const INVISIBLE_CHARS_REGEX = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u00AD]/g;

// Tatweel / Kashida
export const TATWEEL_REGEX = /\u0640/g;

/**
 * Removes all diacritics (اعراب) from Urdu text
 */
export function stripDiacritics(text: string): string {
  if (!text) return '';
  // Crucial: Precompose decomposed Alif + Madda (\u0627\u0653) to آ (\u0622) before stripping,
  // since Madda (\u0653) falls within the diacritics range \u064B-\u065F
  const precomposed = text
    .normalize('NFC')
    .replace(/\u0627\u0653/g, '\u0622')
    .replace(/\u0627\u0654/g, '\u0623')
    .replace(/\u06CC\u0654/g, '\u0626');

  return precomposed.replace(URDU_DIACRITICS_REGEX, '');
}

/**
 * Strips zero-width characters, directional formatting marks, and BOM
 */
export function stripInvisibleChars(text: string): string {
  if (!text) return '';
  return text
    .replace(INVISIBLE_CHARS_REGEX, '')
    .replace(/\u00A0/g, ' '); // Non-breaking space to regular space
}

/**
 * Normalizes letter variations (Heh, Yeh, Kaf, Alef) to standardized Urdu canonical forms
 */
export function normalizeUrduChars(text: string): string {
  if (!text) return '';

  return (
    text
      // 1. Crucial Unicode Pre-Normalization
      .normalize('NFC')
      // Decomposed Alif + Madda to precomposed آ
      .replace(/\u0627\u0653/g, '\u0622') // ا + ٓ -> آ
      // Decomposed Alif + Hamza Above to precomposed أ
      .replace(/\u0627\u0654/g, '\u0623')
      // Decomposed Yeh + Hamza to precomposed ئ
      .replace(/\u06CC\u0654/g, '\u0626')
      // Arabic Kaf to Urdu Kaf
      .replace(/\u0643/g, '\u06A9') // ك -> ک
      // Arabic Yeh to Urdu Chhoti Yeh
      .replace(/\u064A/g, '\u06CC') // ي -> ی
      // Alef Maksura to Chhoti Yeh
      .replace(/\u0649/g, '\u06CC') // ى -> ی
      // Arabic Heh & Teh Marbuta to Urdu Goal Heh
      .replace(/\u0647/g, '\u06C1') // ه -> ہ
      .replace(/\u0629/g, '\u06C1') // ة -> ہ
      // Normalize Hamza-Yeh variants
      .replace(/\u0626/g, '\u0626') // ئ
      // Normalize Heh Goal with Hamza
      .replace(/\u06C2/g, '\u06C1\u0621') // ۂ -> ہء
      // Remove Kashida / Tatweel
      .replace(TATWEEL_REGEX, '')
  );
}

/**
 * Normalizes text for rhyme / qafiya comparison:
 * Strips diacritics, invisible characters, punctuation, and normalizes character variants
 */
export function normalizeForRhyme(text: string): string {
  if (!text) return '';
  const cleaned = stripInvisibleChars(text);
  const withoutDiacritics = stripDiacritics(cleaned);
  const normalized = normalizeUrduChars(withoutDiacritics);

  // Strip punctuation and extra spaces, lowercase just in case
  return normalized
    .replace(/[۔،؛:!؟""''()[\]{}<>«»…ـ\-_/\\+=|@#$%^&*`~]/g, '')
    .trim();
}

/**
 * Universal paste cleaner:
 * Cleans erratic formatting from AI models (ChatGPT, Claude, Gemini) and mobile keyboards:
 * - Removes markdown bolding (e.g. **مصرع**), headers (#), backticks, bullet symbols
 * - Normalizes erratic whitespace and line endings (\r\n -> \n)
 * - Retains Urdu ligatures and couplet structures
 */
export function cleanPastedUrduText(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Remove common AI markdown artifacts
  cleaned = cleaned
    .replace(/^#+\s+/gm, '') // Markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold **text**
    .replace(/\*(.*?)\*/g, '$1') // Italic *text*
    .replace(/__(.*?)__/g, '$1') // Bold __text__
    .replace(/_(.*?)_/g, '$1') // Italic _text_
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/^[•*\-+]\s+/gm, '') // Bullet points
    .replace(/^\d+\.\s+/gm, ''); // Numbered lists

  // Remove excessive consecutive empty lines (more than 2 to just 1)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Strip invisible zero-width chars that interfere with rendering
  cleaned = stripInvisibleChars(cleaned);

  // Normalize kaf/yeh/heh
  cleaned = normalizeUrduChars(cleaned);

  return cleaned.trim();
}

/**
 * Extracts distinct Urdu words from text, safe for tokenizing Urdu poetry
 */
export function extractUrduTokens(text: string): string[] {
  if (!text) return [];

  // Split by whitespace and common punctuation
  const rawTokens = text.split(/[\s۔،؛:!؟""''()[\]{}<>«»…\-_/\\]+/);
  const tokens: string[] = [];

  for (const raw of rawTokens) {
    const norm = normalizeForRhyme(raw);
    if (norm.length > 0) {
      tokens.push(norm);
    }
  }

  return tokens;
}

/**
 * Diacritic-agnostic comparison to check if two words match for Qafiya
 */
export function isRhymeWordMatch(wordA: string, wordB: string): boolean {
  if (!wordA || !wordB) return false;
  const normA = normalizeForRhyme(wordA);
  const normB = normalizeForRhyme(wordB);

  return normA === normB;
}

/**
 * Scans a full poem text and returns a set of normalized words present in the poem
 */
export function getPoemNormalizedWordSet(poemText: string): Set<string> {
  const tokens = extractUrduTokens(poemText);
  return new Set(tokens);
}

/**
 * Counts characters, words, misras (lines), couplets (ash'ar), paragraphs, and reading time
 */
export function calculatePoemStats(text: string): {
  chars: number;
  words: number;
  misras: number;
  couplets: number;
  paragraphs: number;
  readingTimeMinutes: number;
} {
  if (!text.trim()) {
    return { chars: 0, words: 0, misras: 0, couplets: 0, paragraphs: 0, readingTimeMinutes: 0 };
  }

  const chars = text.replace(/\s/g, '').length;
  const words = extractUrduTokens(text).length;

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length || 1;

  const misras = lines.length;
  const couplets = Math.floor(misras / 2);
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 150)); // ~150 Urdu words/minute

  return { chars, words, misras, couplets, paragraphs, readingTimeMinutes };
}
