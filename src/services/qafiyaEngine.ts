/**
 * Algorithmic Reverse-Rhyme Engine (خودکار قافیہ نگار و معجمِ قوافی)
 * Uses pronunciation-aware lexical readings (حرفِ روی، ردف، قید، ماقبل حرکت و تقطیع)
 * while explicitly distinguishing strict pronunciation matches from near/discovery
 * candidates and unvocalized/orthographic-only matches.
 */

import { FOOT_NAMES } from '../data/prosodyMeters';
import { AroozLexiconService, LexicalReading } from './aroozLexiconService';
import { pronunciationLetters } from './urduPhonology';
import { normalizeUrduChars, stripDiacritics, stripInvisibleChars } from './unicodeNormalizer';
import { RHYME_TREASURY } from '../data/rhymeTreasury';
import qaafiyahVocabularyRaw from '../data/qaafiyahVocabulary.json';

export type RhymeMatchTier = 'strict' | 'near' | 'uncertain';
export type LetterCountFilterMode = 'all' | 'max' | 'exact' | 'min';

export interface LetterCountFilter {
  mode: LetterCountFilterMode;
  count?: number;
}

export interface RhymeReadingAnalysis {
  strictKey: string | null;
  nearKey: string;
  rawi: string;
  radf?: string;
  tailWeight: string;
  vocalized: string;
  pattern: string;
  source: LexicalReading['source'] | 'vocalized' | 'orthographic';
}

export interface RhymeCandidateItem {
  word: string;
  wazn: string;
  tier: RhymeMatchTier;
  vocalized?: string;
  reasonLabel: string;
}

export interface RhymeMatchGroup {
  wazn: string; // e.g. "- ="
  afail: string; // e.g. "فَعُولْ"
  tier: RhymeMatchTier;
  tierLabel: string;
  words: string[];
  items?: RhymeCandidateItem[];
}

export interface RhymeSearchResult {
  query: string;
  detectedSuffix: string;
  rawiSummary?: string;
  queryVocalized?: string;
  totalMatches: number;
  strictCount: number;
  nearCount: number;
  uncertainCount: number;
  groups: RhymeMatchGroup[];
}

export interface QuickRhymeCategory {
  id: string;
  suffix: string;
  seedWord: string;
  label: string;
  example: string;
}

export interface DetectedRhymeScheme {
  detectedQafiyaWord: string;
  secondQafiyaWord?: string;
  detectedRadif: string;
  matchTier: RhymeMatchTier;
  verifiedLinesCount: number;
  qafiyaWordsInPoem: string[];
  sampleRhymes: string[];
}

const AFAIL_MAP: Record<string, string> = {
  ...FOOT_NAMES,
  '-': 'ہجائے کوتاہ',
  '=': 'ہجائے بلند',
  '': 'تلفظ کی تصدیق درکار',
};

export const RHYME_TIER_LABELS: Record<RhymeMatchTier, { title: string; badge: string; description: string }> = {
  strict: {
    title: 'معیاری ہم قافیہ (صوتی و عروضی مطابقت)',
    badge: 'معیاری قافیہ',
    description: 'لغوی اعراب، حرفِ روی، ماقبل حرکت اور اختتامی وزن کی تصدیق شدہ مطابقت۔',
  },
  near: {
    title: 'قریبی و دریافتی قوافی (صوتی رخصت / ہم آواز)',
    badge: 'قریبی / دریافتی',
    description: 'ردفِ قریب (مثلاً بصیرت/حکومت)، نون/نونِ غنہ (جہان/جہاں) یا مشترک حرفِ روی و حرکت۔',
  },
  uncertain: {
    title: 'املائی مطابقت (تلفظ غیر مصدقہ / زیرِ جائزہ)',
    badge: 'املائی / غیر مصدقہ',
    description: 'رسم الخط کی مماثلت موجود ہے مگر مکمل اعراب یا مصدقہ تلفظ دستیاب نہیں۔',
  },
};

/**
 * Standard classical quick-pick rhyme endings with representative vocalized seed words
 */
export const QUICK_RHYME_CATEGORIES: QuickRhymeCategory[] = [
  { id: 'am', suffix: 'ام', seedWord: 'کلام', label: 'قافیہ: ام', example: 'کلام، پیام، شام' },
  { id: 'ar', suffix: 'ار', seedWord: 'بہار', label: 'قافیہ: ار', example: 'بہار، گلزار، قرار' },
  { id: 'an', suffix: 'ان', seedWord: 'جہان', label: 'قافیہ: ان', example: 'جان، جہاں، ارمان' },
  { id: 'te', suffix: 'ت', seedWord: 'حقیقت', label: 'قافیہ: ت (حقیقت، بصیرت)', example: 'حقیقت، بصیرت، شریعت، غنیمت' },
  { id: 'yat', suffix: 'یت', seedWord: 'کیفیت', label: 'قافیہ: یت', example: 'سمیت، ملکیت، اذیت، کیفیت' },
  { id: 'al', suffix: 'ال', seedWord: 'خیال', label: 'قافیہ: ال', example: 'خیال، ملال، زوال' },
  { id: 'ab', suffix: 'اب', seedWord: 'گلاب', label: 'قافیہ: اب', example: 'گلاب، شراب، خواب' },
  { id: 'oor', suffix: 'ور', seedWord: 'نور', label: 'قافیہ: ور', example: 'نور، حضور، سرور' },
  { id: 'eer', suffix: 'یر', seedWord: 'تقدیر', label: 'قافیہ: یر', example: 'تصویر، تقدیر، زنجیر' },
  { id: 'aat', suffix: 'ات', seedWord: 'حیات', label: 'قافیہ: ات', example: 'حیات، نجات، صفات' },
  { id: 'az', suffix: 'از', seedWord: 'راز', label: 'قافیہ: از', example: 'راز، نیاز، پرواز' },
  { id: 'as', suffix: 'اس', seedWord: 'احساس', label: 'قافیہ: اس', example: 'یاس، احساس، اداس' },
  { id: 'ang', suffix: 'نگ', seedWord: 'رنگ', label: 'قافیہ: نگ', example: 'رنگ، سنگ، آہنگ' },
  { id: 'osh', suffix: 'وش', seedWord: 'خاموش', label: 'قافیہ: وش', example: 'جوش، ہوش، خاموش' },
  { id: 'wa', suffix: 'وا', seedWord: 'وفا', label: 'قافیہ: وا/دا/صدا', example: 'ہوا، صدا، وفا، نوا' },
  { id: 'ain', suffix: 'یں', seedWord: 'باتیں', label: 'قافیہ: یں', example: 'باتیں، راتیں، نگاہیں' },
];

/**
 * Normalizes input word for rhyme matching (strips diacritics & invisible marks)
 */
export function cleanQafiyaWord(word: string): string {
  return normalizeUrduChars(stripDiacritics(stripInvisibleChars(word))).trim();
}

function getVowelMark(marks: string): string {
  for (const m of marks) {
    if ('َُِ'.includes(m)) return m;
    if (m === 'ً') return 'َ';
    if (m === 'ٍ') return 'ِ';
    if (m === 'ٌ') return 'ُ';
  }
  return '';
}

/**
 * Analyzes a single vocalized reading and scansion pattern into strict and near rhyme signatures.
 * Returns null when vocalization is absent or insufficient to establish pronunciation rhyme.
 */
export function analyzeReadingRhyme(
  vocalized: string,
  pattern: string,
  source: RhymeReadingAnalysis['source'] = 'dictionary'
): RhymeReadingAnalysis | null {
  const normPattern = pattern.replace(/\s+/g, '');
  if (!vocalized || !normPattern) return null;
  const letters = pronunciationLetters(vocalized);
  if (!letters.length) return null;

  let hasNasal = false;
  let idx = letters.length - 1;
  if (letters[idx].base === 'ں' && idx > 0) {
    hasNasal = true;
    idx--;
  }

  const rawi = letters[idx];
  const rawiBase = rawi.base;
  const rawiVowel = getVowelMark(rawi.marks);
  const tailWeight = normPattern.slice(-2);

  // 1. Word ends in a long vowel carrier (ا، آ، و، ی، ے) [+ optional ں]
  if ('اویےآ'.includes(rawiBase) && !rawiVowel && !rawi.marks.includes('ّ') && !rawi.marks.includes('ْ')) {
    const prev = letters[idx - 1];
    const prevVowel = prev ? getVowelMark(prev.marks) : '';
    let nucleus = rawiBase === 'آ' ? 'ا' : rawiBase;

    if (rawiBase === 'ا' && prev && (prev.base === 'ی' || prev.base === 'و') && !prevVowel) {
      const bp = letters[idx - 2];
      const bpVowel = bp ? getVowelMark(bp.marks) : '';
      nucleus = `${bpVowel}${prev.base}ا`;
    } else if (rawiBase === 'ا' && prev && prev.base === 'ی' && prevVowel === 'َ') {
      const bp = letters[idx - 2];
      const bpVowel = bp ? getVowelMark(bp.marks) : '';
      if (bpVowel === 'ِ') nucleus = 'ِیا';
    } else if (rawiBase === 'ی') {
      nucleus = prevVowel === 'َ' ? 'َی' : prevVowel === 'ِ' ? 'ِی' : 'ی';
    } else if (rawiBase === 'و') {
      nucleus = prevVowel === 'َ' ? 'َو' : prevVowel === 'ُ' ? 'ُو' : 'و';
    } else if (rawiBase === 'ے') {
      nucleus = prevVowel === 'َ' ? 'َے' : 'ے';
    }

    const exactNucleus = !['ی', 'و'].includes(nucleus);
    const nearKey =
      nucleus === 'ا' && hasNasal
        ? 'R:ا+ن/ں'
        : `V:${nucleus.replace(/^[َُِ]/u, '')}${hasNasal ? 'ں' : ''}`;

    return {
      strictKey: exactNucleus ? `V:${nucleus}${hasNasal ? 'ں' : ''}` : null,
      nearKey,
      rawi: hasNasal ? `${rawiBase === 'آ' ? 'ا' : rawiBase}ں` : rawiBase === 'آ' ? 'ا' : rawiBase,
      tailWeight,
      vocalized,
      pattern: normPattern,
      source,
    };
  }

  // 2. Word ends in a consonant (Rawi is a consonant)
  const prev = letters[idx - 1];
  if (!prev) return null;
  const prevBase = prev.base;
  const prevVowel = getVowelMark(prev.marks);
  const prevSukun = prev.marks.includes('ْ');
  const prevShadda = prev.marks.includes('ّ');

  // 2a. Preceded by a long vowel carrier (Radf: ا، و، ی، ے)
  if ('اویےآ'.includes(prevBase) && !prevVowel && !prevSukun && !prevShadda) {
    const bc = letters[idx - 2];
    const bcVowel = bc ? getVowelMark(bc.marks) : '';
    let radf = prevBase === 'آ' ? 'ا' : prevBase;
    if (prevBase === 'ی') radf = bcVowel === 'َ' ? 'َی' : bcVowel === 'ِ' ? 'ِی' : 'ی';
    else if (prevBase === 'و') radf = bcVowel === 'َ' ? 'َو' : bcVowel === 'ُ' ? 'ُو' : 'و';
    else if (prevBase === 'ے') radf = bcVowel === 'َ' ? 'َے' : 'ے';

    const exactRadf = !['ی', 'و'].includes(radf);
    const nearKey =
      radf === 'ا' && rawiBase === 'ن' && !hasNasal
        ? 'R:ا+ن/ں'
        : `R:${prevBase === 'آ' ? 'ا' : prevBase}+${rawiBase}${hasNasal ? 'ں' : ''}`;

    return {
      strictKey: exactRadf ? `R:${radf}+${rawiBase}${hasNasal ? 'ں' : ''}` : null,
      nearKey,
      rawi: rawiBase,
      radf,
      tailWeight,
      vocalized,
      pattern: normPattern,
      source,
    };
  }

  // 2b. Preceded by a sukun consonant (Qayd: e.g., فِکْر، ذِکْر، صَبْر، قَدْر)
  if (prevSukun) {
    const bp = letters[idx - 2];
    const bpVowel = bp ? getVowelMark(bp.marks) : '';
    if (!bpVowel) return null;
    return {
      strictKey: `Q:${tailWeight}:${bpVowel}+${prevBase}ْ+${rawiBase}`,
      nearKey: `Q:${tailWeight}:${bpVowel}+Cْ+${rawiBase}`,
      rawi: rawiBase,
      tailWeight,
      vocalized,
      pattern: normPattern,
      source,
    };
  }

  // 2c. Preceded by a vowel-marked consonant (Mutaharrik before Rawi)
  if (prevVowel) {
    const bp = letters[idx - 2];

    if (prevShadda) {
      const bpVowel = bp ? getVowelMark(bp.marks) : '';
      if (prevBase === 'ی' && bpVowel === 'ِ') {
        return {
          strictKey: `Y:${tailWeight}:ِیَّ+${rawiBase}`,
          nearKey: `C:${tailWeight}:Cْ+${prevVowel}+${rawiBase}`,
          rawi: rawiBase,
          tailWeight,
          vocalized,
          pattern: normPattern,
          source,
        };
      }
      return {
        strictKey: `C:${tailWeight}:Cْ+${prevVowel}+${rawiBase}`,
        nearKey: `H:${tailWeight}:${prevVowel}+${rawiBase}`,
        rawi: rawiBase,
        tailWeight,
        vocalized,
        pattern: normPattern,
        source,
      };
    }

    // Preceded by a long vowel carrier before the mutaharrik consonant (e.g., بَصِیرَت، حَقِیقَت، حُکُومَت، عَدالَت، ساحِل)
    if (bp && 'اویےآ'.includes(bp.base) && !getVowelMark(bp.marks) && !bp.marks.includes('ْ') && !bp.marks.includes('ّ')) {
      const bbc = letters[idx - 3];
      const bbcVowel = bbc ? getVowelMark(bbc.marks) : '';
      let preLong = bp.base === 'آ' ? 'ا' : bp.base;
      if (bp.base === 'ی') preLong = bbcVowel === 'َ' ? 'َی' : bbcVowel === 'ِ' ? 'ِی' : 'ی';
      else if (bp.base === 'و') preLong = bbcVowel === 'َ' ? 'َو' : bbcVowel === 'ُ' ? 'ُو' : 'و';
      const redfQareeb = preLong === 'ِی' || preLong === 'ُو' ? 'ِی/ُو' : preLong;
      return {
        strictKey: `L:${tailWeight}:${preLong}+C${prevVowel}+${rawiBase}`,
        nearKey: `L:${tailWeight}:${redfQareeb}+C${prevVowel}+${rawiBase}`,
        rawi: rawiBase,
        radf: preLong,
        tailWeight,
        vocalized,
        pattern: normPattern,
        source,
      };
    }

    // Preceded by a closed syllable / sukun consonant (e.g., رَحْمَت، حِکْمَت، مَحْفِل، مَنْزِل)
    if (bp && bp.marks.includes('ْ')) {
      return {
        strictKey: `C:${tailWeight}:Cْ+${prevVowel}+${rawiBase}`,
        nearKey: `H:${tailWeight}:${prevVowel}+${rawiBase}`,
        rawi: rawiBase,
        tailWeight,
        vocalized,
        pattern: normPattern,
        source,
      };
    }

    // Simple open short syllable before Rawi (e.g., سَحَر، قَمَر، نَظَر، دِل، گُل)
    return {
      strictKey: `H:${tailWeight}:${prevVowel}+${rawiBase}`,
      nearKey: `H:${tailWeight}:${prevVowel}+${rawiBase}`,
      rawi: rawiBase,
      tailWeight,
      vocalized,
      pattern: normPattern,
      source,
    };
  }

  return null;
}

/**
 * Returns all pronunciation-backed rhyme analyses for an Urdu word, including
 * nasal contraction fallback (e.g. جہاں -> جہان, گماں -> گمان) when the nasalized
 * spelling is not separately stored in the dictionary.
 */
export function analyzeWordRhyme(rawWord: string): RhymeReadingAnalysis[] {
  const key = cleanQafiyaWord(rawWord);
  if (!key) return [];

  const readings = AroozLexiconService.getLexicalReadings(key);
  const analyses: RhymeReadingAnalysis[] = [];

  for (const r of readings) {
    if (r.vocalized && r.pattern) {
      const a = analyzeReadingRhyme(r.vocalized, r.pattern, r.source);
      if (a) analyses.push(a);
    }
  }

  // Nasal contraction fallback for poetic words ending in ں (like گماں، زباں، آسماں، داستاں)
  if (!analyses.length && key.endsWith('ں') && key.length >= 3) {
    const noonForm = key.slice(0, -1) + 'ن';
    const noonReadings = AroozLexiconService.getLexicalReadings(noonForm).filter((r) =>
      r.pattern.replace(/\s+/g, '').endsWith('=-')
    );
    for (const r of noonReadings) {
      if (r.vocalized) {
        const contractedPattern = r.pattern.replace(/\s+/g, '').slice(0, -1);
        const contractedVocalized = r.vocalized.replace(/ن$/u, 'ں');
        const a = analyzeReadingRhyme(contractedVocalized, contractedPattern, r.source);
        if (a) analyses.push(a);
      }
    }
  }

  // Special common poetic words that may be absent from the base table
  if (!analyses.length && (key === 'جان' || key === 'جاں')) {
    const isNasal = key === 'جاں';
    const a = analyzeReadingRhyme(isNasal ? 'جاں' : 'جان', isNasal ? '=' : '=-', 'dictionary');
    if (a) analyses.push(a);
  }

  return analyses;
}

interface IndexedLexiconWord {
  word: string;
  primaryPattern: string;
  patterns: string[];
  analyses: RhymeReadingAnalysis[];
  hasApprovedReading: boolean;
}

let cachedRhymeIndex: Map<string, IndexedLexiconWord> | null = null;
let cachedIndexRevision = -1;

function getRhymeLexiconIndex(): Map<string, IndexedLexiconWord> {
  const currentRev = AroozLexiconService.getRevision();
  if (cachedRhymeIndex && cachedIndexRevision === currentRev) {
    return cachedRhymeIndex;
  }

  const wordMap = AroozLexiconService.getAllWordsWithScansion();
  const index = new Map<string, IndexedLexiconWord>();

  for (const [rawWord, patterns] of wordMap.entries()) {
    const cleanW = cleanQafiyaWord(rawWord);
    if (!cleanW) continue;
    const readings = AroozLexiconService.getLexicalReadings(cleanW);
    const analyses: RhymeReadingAnalysis[] = [];
    let hasApprovedReading = false;

    for (const r of readings) {
      if (r.source === 'dictionary' || r.source === 'reviewed-entry') {
        hasApprovedReading = true;
      }
      if (r.vocalized && r.pattern) {
        const a = analyzeReadingRhyme(r.vocalized, r.pattern, r.source);
        if (a) analyses.push(a);
      }
    }

    index.set(cleanW, {
      word: cleanW,
      primaryPattern: (patterns[0] || '').replace(/\s+/g, ''),
      patterns: patterns.map((p) => p.replace(/\s+/g, '')).filter(Boolean),
      analyses,
      hasApprovedReading,
    });
  }

  // Ensure curated treasury words are also indexed
  for (const cat of RHYME_TREASURY) {
    for (const rawW of cat.words) {
      const cleanW = cleanQafiyaWord(rawW);
      if (!cleanW || index.has(cleanW)) continue;
      const variants = AroozLexiconService.getScansionVariants(cleanW) || [];
      const analyses = analyzeWordRhyme(cleanW);
      index.set(cleanW, {
        word: cleanW,
        primaryPattern: (variants[0] || '').replace(/\s+/g, ''),
        patterns: variants.map((p) => p.replace(/\s+/g, '')).filter(Boolean),
        analyses,
        hasApprovedReading: analyses.length > 0,
      });
    }
  }

  // Index the additional 18,171 unweighted vocabulary entries from Qaafiyah Expert master Urdu_Dict.txt (qaafiyahVocabulary.json)
  // Strictly kept as unweighted ('?') so no weights are ever fabricated from spelling length.
  const extraVocab = qaafiyahVocabularyRaw as string[];
  if (Array.isArray(extraVocab)) {
    for (const rawW of extraVocab) {
      const cleanW = cleanQafiyaWord(rawW);
      if (!cleanW || cleanW.length < 2 || index.has(cleanW)) continue;
      index.set(cleanW, {
        word: cleanW,
        primaryPattern: '?',
        patterns: ['?'],
        analyses: [],
        hasApprovedReading: false,
      });
    }
  }

  cachedRhymeIndex = index;
  cachedIndexRevision = currentRev;
  return index;
}

export function getTotalRhymeVocabularyStats(): {
  totalUniqueWords: number;
  weightedLexiconWords: number;
  unweightedQaafiyahWords: number;
} {
  const index = getRhymeLexiconIndex();
  let weighted = 0;
  let unweighted = 0;
  for (const entry of index.values()) {
    if (entry.primaryPattern && entry.primaryPattern !== '?') weighted++;
    else unweighted++;
  }
  return {
    totalUniqueWords: index.size,
    weightedLexiconWords: weighted,
    unweightedQaafiyahWords: unweighted,
  };
}

/**
 * Extracts the primary rhyming suffix (حرفِ روی و ماقبل علامت) from a word
 */
export function extractRhymeSuffix(rawWord: string): string {
  const word = cleanQafiyaWord(rawWord);
  if (!word || word.length < 2) return word;

  if (word.length === 2) return word;

  const last3 = word.slice(-3);
  if (['یات', 'گار', 'دار', 'وار', 'ناک', 'ساز', 'باں', 'کار'].includes(last3)) {
    return last3;
  }

  const last2 = word.slice(-2);
  const common2LetterRhymes = [
    'ام', 'ار', 'ان', 'ال', 'اب', 'ور', 'یر', 'یت', 'ات', 'از', 'اس', 'اک',
    'نگ', 'وش', 'ست', 'اہ', 'ول', 'ین', 'یل', 'وٹ', 'یا', 'واں', 'اں', 'یں', 'وں',
    'وا', 'دا', 'فا', 'ضا', 'جا', 'تا', 'نا', 'سا', 'لا', 'ما', 'قا', 'کا',
    'رت', 'قت', 'عت', 'مت', 'فت', 'بت', 'دت', 'حت', 'سط', 'خط',
    'ند', 'رد', 'بد', 'حد', 'قد', 'شد', 'مد', 'زد', 'تد', 'ود',
  ];

  if (common2LetterRhymes.includes(last2)) {
    return last2;
  }

  return last2;
}

/**
 * Compares two words and classifies their rhyme relationship into:
 * - 'strict': verified pronunciation rhyme (matching Rawi, preceding vowel/Radf/Qayd, and terminal syllable structure)
 * - 'near': classical near-rhyme (e.g. Redf-e-Qareeb بصیرت/حکومت, ن/ں alternation جہان/جہاں, or shared mutaharrik + Rawi)
 * - 'uncertain': spelling suffix matches, but one or both words lack verified vocalization
 * - null: not a rhyme match (including false orthographic homographs like سَحَر vs فِکْر or نُور vs غَور)
 */
export function compareRhymeWords(
  wordA: string,
  wordB: string
): { matches: boolean; tier: RhymeMatchTier | null; reason: string } {
  const cleanA = cleanQafiyaWord(wordA);
  const cleanB = cleanQafiyaWord(wordB);
  if (!cleanA || !cleanB) {
    return { matches: false, tier: null, reason: '' };
  }

  const analysesA = analyzeWordRhyme(cleanA);
  const analysesB = analyzeWordRhyme(cleanB);

  if (analysesA.length > 0 && analysesB.length > 0) {
    for (const a of analysesA) {
      for (const b of analysesB) {
        if (a.strictKey && b.strictKey && a.strictKey === b.strictKey) {
          const bothReviewed =
            (a.source === 'dictionary' || a.source === 'reviewed-entry') &&
            (b.source === 'dictionary' || b.source === 'reviewed-entry');
          return {
            matches: true,
            tier: bothReviewed ? 'strict' : 'uncertain',
            reason: bothReviewed
              ? `معیاری صوتی مطابقت (${a.vocalized} / ${b.vocalized})`
              : 'تلفظ زیرِ جائزہ ہے',
          };
        }
      }
    }

    for (const a of analysesA) {
      for (const b of analysesB) {
        if (
          (a.nearKey && b.nearKey && a.nearKey === b.nearKey) ||
          (a.strictKey && b.nearKey && a.strictKey === b.nearKey) ||
          (a.nearKey && b.strictKey && a.nearKey === b.strictKey)
        ) {
          // When both words have explicit Radf vowel markings (e.g., نُور R:ُو+ر vs غَور R:َو+ر, or تِیر R:ِی+ر vs خَیر R:َی+ر),
          // only match if at least one word lacks an explicit Radf strictKey.
          const hasExplicitRadfA = analysesA.some((x) => x.strictKey && x.strictKey.startsWith('R:'));
          const hasExplicitRadfB = analysesB.some((x) => x.strictKey && x.strictKey.startsWith('R:'));
          const isBroadCarrierKey = a.nearKey === 'R:و+ر' || a.nearKey === 'R:ی+ر' || a.nearKey.startsWith('R:و+') || a.nearKey.startsWith('R:ی+');
          if (hasExplicitRadfA && hasExplicitRadfB && isBroadCarrierKey) {
            continue;
          }

          return {
            matches: true,
            tier: 'near',
            reason: `قریبی صوتی مطابقت (${a.vocalized} / ${b.vocalized})`,
          };
        }
      }
    }

    // Both words have verified pronunciations and they DO NOT rhyme (e.g. سَحَر vs فِکْر, دِل vs گُل)
    return { matches: false, tier: null, reason: 'تلفظ اور حرکات مختلف ہیں' };
  }

  // Fallback when at least one word lacks vocalized pronunciation
  const suffA = extractRhymeSuffix(cleanA);
  const suffB = extractRhymeSuffix(cleanB);
  const nasalPair =
    (cleanA.endsWith('ان') && cleanB.endsWith('اں')) ||
    (cleanA.endsWith('اں') && cleanB.endsWith('ان'));

  if (suffA === suffB || nasalPair) {
    return {
      matches: true,
      tier: 'uncertain',
      reason: 'املائی مطابقت (تلفظ غیر مصدقہ)',
    };
  }

  return { matches: false, tier: null, reason: '' };
}

/**
 * Search all rhyming words from the active source-attributed lexicon and Rhyme Treasury,
 * categorized by pronunciation certainty (strict -> near -> uncertain) and grouped by meter.
 */
export function findRhymes(
  query: string,
  filterWazn?: string,
  letterFilter?: LetterCountFilter
): RhymeSearchResult {
  const cleanQuery = cleanQafiyaWord(query);
  if (!cleanQuery) {
    return {
      query: '',
      detectedSuffix: '',
      totalMatches: 0,
      strictCount: 0,
      nearCount: 0,
      uncertainCount: 0,
      groups: [],
    };
  }

  const detectedSuffix = extractRhymeSuffix(cleanQuery);
  const index = getRhymeLexiconIndex();

  // If the user clicked a 1-2 letter quick suffix chip (e.g. "ام", "ار", "ت"), resolve a vocalized seed word
  // so pronunciation-aware matching can operate on short suffix queries too.
  let queryAnalyses = analyzeWordRhyme(cleanQuery);
  if (queryAnalyses.length === 0 && cleanQuery.length <= 2) {
    const matchedQuick = QUICK_RHYME_CATEGORIES.find((c) => c.suffix === cleanQuery);
    if (matchedQuick) {
      queryAnalyses = analyzeWordRhyme(matchedQuick.seedWord);
    }
  }

  const strictKeys = new Set<string>();
  const nearKeys = new Set<string>();
  const conflictingDiphthongStrictKeys = new Set<string>();

  for (const a of queryAnalyses) {
    if (a.strictKey) {
      strictKeys.add(a.strictKey);
      if (a.strictKey.startsWith('R:ُو+')) conflictingDiphthongStrictKeys.add(a.strictKey.replace('R:ُو+', 'R:َو+'));
      if (a.strictKey.startsWith('R:َو+')) conflictingDiphthongStrictKeys.add(a.strictKey.replace('R:َو+', 'R:ُو+'));
      if (a.strictKey.startsWith('R:ِی+')) conflictingDiphthongStrictKeys.add(a.strictKey.replace('R:ِی+', 'R:َی+'));
      if (a.strictKey.startsWith('R:َی+')) conflictingDiphthongStrictKeys.add(a.strictKey.replace('R:َی+', 'R:ِی+'));
    }
    if (a.nearKey) nearKeys.add(a.nearKey);
  }

  const normFilter = filterWazn ? filterWazn.replace(/\s+/g, '') : '';
  const groupBuckets = new Map<string, { tier: RhymeMatchTier; wazn: string; items: RhymeCandidateItem[] }>();

  let strictCount = 0;
  let nearCount = 0;
  let uncertainCount = 0;

  for (const entry of index.values()) {
    const candidateWord = entry.word;

    // Optional Qaafiyah Expert 1.1 letter-count filter (زیادہ سے زیادہ / صرف / کم از کم N حروف)
    if (letterFilter && letterFilter.mode !== 'all' && letterFilter.count && letterFilter.count > 0) {
      const charLen = [...candidateWord].length;
      if (letterFilter.mode === 'max' && charLen > letterFilter.count) continue;
      if (letterFilter.mode === 'exact' && charLen !== letterFilter.count) continue;
      if (letterFilter.mode === 'min' && charLen < letterFilter.count) continue;
    }

    let matchedTier: RhymeMatchTier | null = null;
    let matchedPattern = entry.primaryPattern;
    let matchedVocalized: string | undefined;
    let reasonLabel = '';

    if (queryAnalyses.length > 0 && entry.analyses.length > 0) {
      // 1. Check strict pronunciation match
      const strictReading = entry.analyses.find((a) => a.strictKey && strictKeys.has(a.strictKey));
      if (strictReading) {
        matchedTier = entry.hasApprovedReading ? 'strict' : 'uncertain';
        matchedPattern = strictReading.pattern || entry.primaryPattern;
        matchedVocalized = strictReading.vocalized;
        reasonLabel = entry.hasApprovedReading ? 'معیاری صوتی مطابقت' : 'تلفظ زیرِ جائزہ';
      } else {
        // 2. Check near/discovery pronunciation match (excluding candidates whose explicit Radf readings all conflict)
        const candidateHasConflictingExplicitRadf =
          entry.analyses.some((a) => a.strictKey && conflictingDiphthongStrictKeys.has(a.strictKey)) &&
          !entry.analyses.some((a) => a.strictKey && strictKeys.has(a.strictKey));

        const nearReading = candidateHasConflictingExplicitRadf
          ? undefined
          : entry.analyses.find((a) => {
              return (
                (a.nearKey && nearKeys.has(a.nearKey)) ||
                (a.strictKey && nearKeys.has(a.strictKey)) ||
                (a.nearKey && strictKeys.has(a.nearKey))
              );
            });
        if (nearReading) {
          matchedTier = entry.hasApprovedReading ? 'near' : 'uncertain';
          matchedPattern = nearReading.pattern || entry.primaryPattern;
          matchedVocalized = nearReading.vocalized;
          reasonLabel = 'قریبی صوتی مطابقت';
        }
      }
      // Note: If both query and candidate have vocalized analyses and neither strict nor near matched,
      // we deliberately DO NOT fall back to spelling! This filters out false orthographic rhymes like سَحَر vs فِکْر or نُور vs غَور.
    } else {
      // Unvocalized query (including pure suffix queries like "اط" or "اش") or unvocalized/unweighted candidate:
      // orthographic suffix fallback labelled as 'uncertain'
      if (candidateWord.endsWith(detectedSuffix)) {
        matchedTier = 'uncertain';
        matchedPattern = entry.primaryPattern || '?';
        reasonLabel =
          matchedPattern === '?'
            ? 'ذخیرۂ قافیہ ایکسپرٹ (املائی مطابقت — وزن غیر متعین)'
            : 'املائی مطابقت (تلفظ غیر مصدقہ)';
      }
    }

    if (!matchedTier) continue;
    if (normFilter && matchedPattern !== normFilter) continue;

    if (matchedTier === 'strict') strictCount++;
    else if (matchedTier === 'near') nearCount++;
    else uncertainCount++;

    const bucketKey = `${matchedTier}:::${matchedPattern}`;
    if (!groupBuckets.has(bucketKey)) {
      groupBuckets.set(bucketKey, { tier: matchedTier, wazn: matchedPattern, items: [] });
    }
    groupBuckets.get(bucketKey)!.items.push({
      word: candidateWord,
      wazn: matchedPattern,
      tier: matchedTier,
      vocalized: matchedVocalized,
      reasonLabel,
    });
  }

  const tierOrder: Record<RhymeMatchTier, number> = { strict: 0, near: 1, uncertain: 2 };
  const patternPriority = ['-=', '==', '-==', '=-=', '===', '--=', '=-==', '-=-='];

  const groups: RhymeMatchGroup[] = [];
  for (const bucket of groupBuckets.values()) {
    bucket.items.sort((a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word, 'ur'));
    const baseAfail =
      bucket.wazn === '?'
        ? 'ذخیرۂ الفاظ (بغیر وزن)'
        : AFAIL_MAP[bucket.wazn] || (bucket.wazn.length <= 4 ? 'بر وزنِ معین' : 'مرکب وزن');
    const tierBadge = RHYME_TIER_LABELS[bucket.tier].badge;

    groups.push({
      wazn: bucket.wazn,
      afail: bucket.tier === 'strict' ? baseAfail : `${baseAfail} (${tierBadge})`,
      tier: bucket.tier,
      tierLabel: tierBadge,
      words: bucket.items.map((i) => i.word),
      items: bucket.items,
    });
  }

  groups.sort((a, b) => {
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier];
    }
    const idxA = patternPriority.indexOf(a.wazn);
    const idxB = patternPriority.indexOf(b.wazn);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return b.words.length - a.words.length;
  });

  const primaryAnalysis = queryAnalyses[0];
  const rawiSummary = primaryAnalysis
    ? `حرفِ روی: ${primaryAnalysis.rawi}${primaryAnalysis.radf ? ` • ردف: ${primaryAnalysis.radf}` : ''}`
    : `املائی علامت: ${detectedSuffix}`;

  return {
    query: cleanQuery,
    detectedSuffix,
    rawiSummary,
    queryVocalized: primaryAnalysis?.vocalized,
    totalMatches: strictCount + nearCount + uncertainCount,
    strictCount,
    nearCount,
    uncertainCount,
    groups,
  };
}

/**
 * Automatically inspects a poem's lines to extract the active Qafiya & multi-word Radif,
 * validating the rhyme relationship across the matla and subsequent couplets.
 */
export function detectPoemRhymeScheme(lines: string[]): DetectedRhymeScheme | null {
  const cleanLines = lines
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('—') && !l.startsWith('#'));

  if (cleanLines.length < 2) return null;

  const tokenizedLines = cleanLines
    .map((l) =>
      l
        .split(/\s+/)
        .map((w) => cleanQafiyaWord(w))
        .filter(Boolean)
    )
    .filter((tokens) => tokens.length >= 2);

  if (tokenizedLines.length < 2) return null;

  const line1 = tokenizedLines[0];
  const line2 = tokenizedLines[1];

  // 1. Find longest common trailing token sequence between line 1 and line 2 (up to 6 tokens),
  // leaving at least one preceding word in each line to serve as the Qafiya.
  const maxRadifLen = Math.min(6, line1.length - 1, line2.length - 1);
  let bestRadifTokens: string[] = [];

  for (let k = 1; k <= maxRadifLen; k++) {
    const tail1 = line1[line1.length - k];
    const tail2 = line2[line2.length - k];
    if (tail1 === tail2) {
      bestRadifTokens.unshift(tail1);
    } else {
      break;
    }
  }

  // Try candidate radif lengths from longest down to 0 so that if the longest trailing match
  // was actually an identical repeated qafiya word (or part of a refrain), we pick the split
  // where the preceding words genuinely rhyme.
  for (let radifLen = bestRadifTokens.length; radifLen >= 0; radifLen--) {
    const candidateRadifTokens = line1.slice(line1.length - radifLen);
    const q1 = line1[line1.length - 1 - radifLen] || '';
    const q2 = line2[line2.length - 1 - radifLen] || '';
    if (!q1 || !q2) continue;

    // In a valid matla, two distinct rhyming words are typical (or identical in rare radifless تکرار)
    const comparison = compareRhymeWords(q1, q2);
    if (comparison.matches && comparison.tier) {
      const radifStr = candidateRadifTokens.join(' ');
      const qafiyaWordsInPoem: string[] = [q1];
      if (q2 !== q1) qafiyaWordsInPoem.push(q2);
      let verifiedLinesCount = 2;

      // Check subsequent couplets (second line of each couplet: index 3, 5, 7...)
      for (let i = 3; i < tokenizedLines.length; i += 2) {
        const ln = tokenizedLines[i];
        if (ln.length <= radifLen) continue;
        const tailMatches =
          radifLen === 0 ||
          ln.slice(ln.length - radifLen).join(' ') === radifStr;
        if (!tailMatches) continue;

        const qCandidate = ln[ln.length - 1 - radifLen];
        if (qCandidate && (compareRhymeWords(q1, qCandidate).matches || compareRhymeWords(q2, qCandidate).matches)) {
          verifiedLinesCount++;
          if (!qafiyaWordsInPoem.includes(qCandidate)) {
            qafiyaWordsInPoem.push(qCandidate);
          }
        }
      }

      const searchRes = findRhymes(q1);
      const sampleRhymes: string[] = [];
      for (const g of searchRes.groups) {
        sampleRhymes.push(...g.words);
      }

      return {
        detectedQafiyaWord: q1,
        secondQafiyaWord: q2,
        detectedRadif: radifStr,
        matchTier: comparison.tier,
        verifiedLinesCount,
        qafiyaWordsInPoem,
        sampleRhymes: sampleRhymes.slice(0, 30),
      };
    }
  }

  // Fallback if line 1 and line 2 are not a rhyming matla: check if subsequent even lines (index 1, 3, 5...) share a radif and rhyme
  if (tokenizedLines.length >= 4) {
    const even1 = tokenizedLines[1];
    const even2 = tokenizedLines[3];
    const maxEvenRadif = Math.min(6, even1.length - 1, even2.length - 1);
    let evenRadifLen = 0;
    while (
      evenRadifLen < maxEvenRadif &&
      even1[even1.length - 1 - evenRadifLen] === even2[even2.length - 1 - evenRadifLen]
    ) {
      evenRadifLen++;
    }
    const q1 = even1[even1.length - 1 - evenRadifLen] || '';
    const q2 = even2[even2.length - 1 - evenRadifLen] || '';
    const comp = compareRhymeWords(q1, q2);
    if (q1 && q2 && comp.matches && comp.tier) {
      const radifStr = even1.slice(even1.length - evenRadifLen).join(' ');
      const searchRes = findRhymes(q1);
      const sampleRhymes = searchRes.groups.flatMap((g) => g.words).slice(0, 30);
      return {
        detectedQafiyaWord: q1,
        secondQafiyaWord: q2,
        detectedRadif: radifStr,
        matchTier: comp.tier,
        verifiedLinesCount: 2,
        qafiyaWordsInPoem: q1 === q2 ? [q1] : [q1, q2],
        sampleRhymes,
      };
    }
  }

  return null;
}
