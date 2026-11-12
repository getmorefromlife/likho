/**
 * Word Intention & Prosodic Possibilities Service (خدمتِ انتخابِ قرأت و املا)
 *
 * Exposes all valid prosodic readings, compound-word split possibilities (e.g., آگئے -> آ گئے),
 * and attested poetic spelling alternatives for any word token in a line, empowering the poet
 * to see every possibility and explicitly lock their intended reading or spelling.
 */

import {
  scanPronouncedWords,
  ScannedWord,
  readingRuleLabel,
} from './prosodicReadings';
import {
  AroozLexiconService,
  normalizeLexiconKey,
} from './aroozLexiconService';
import {
  CLASSICAL_BUHUR,
  ClassicalMeterDef,
  patternToClassicalRukn,
  splitSyllablesByMeterArkan,
  ScansionResult,
} from './aroozEngine';
import {
  MeterDiagnosticReport,
  WordSyllableSpan,
  alignSyllablePatterns,
  SyllableDefect,
} from './meterRepairEngine';
import { FOOT_NAMES } from '../data/prosodyMeters';
import { normalizeUrduChars, stripDiacritics, stripInvisibleChars } from './unicodeNormalizer';

export const POET_ENFORCED_BAHAR_RULE = 'poet-enforced-bahar';
export const POET_ENFORCED_BAHAR_LABEL = 'شاعر کی نافذ کردہ بحر کے مطابق متوقع وزن';

/**
 * Standard classical & custom Urdu Arkan mapped to their prosodic patterns (- and =).
 * Allows poets to construct any custom Bahar by typing or clicking Arkan names.
 */
export const ARKAN_TO_PATTERN: Record<string, { pattern: string; canonicalUrdu: string }> = {
  'فعولن': { pattern: '-==', canonicalUrdu: 'فَعُولُن' },
  'فاعلن': { pattern: '=-=', canonicalUrdu: 'فَاعِلُن' },
  'فاعلاتن': { pattern: '=-==', canonicalUrdu: 'فَاعِلَاتُن' },
  'مفاعیلن': { pattern: '-===', canonicalUrdu: 'مَفَاعِیلُن' },
  'مستفعلن': { pattern: '==-=', canonicalUrdu: 'مُسْتَفْعِلُن' },
  'مفعولن': { pattern: '===', canonicalUrdu: 'مَفْعُولُن' },
  'مفعول': { pattern: '==-', canonicalUrdu: 'مَفْعُولُ' },
  'فاعلات': { pattern: '=-=-', canonicalUrdu: 'فَاعِلَاتُ' },
  'مفاعیل': { pattern: '-==-', canonicalUrdu: 'مَفَاعِیلُ' },
  'مفاعلن': { pattern: '-=-=', canonicalUrdu: 'مَفَاعِلُن' },
  'فعلاتن': { pattern: '--==', canonicalUrdu: 'فَعِلَاتُن' },
  'فعلات': { pattern: '--=-', canonicalUrdu: 'فَعِلَاتُ' },
  'فعلن': { pattern: '--=', canonicalUrdu: 'فَعِلُن' },
  'مفتعلن': { pattern: '=--=', canonicalUrdu: 'مُفْتَعِلُن' },
  'متفاعلن': { pattern: '--=-=', canonicalUrdu: 'مُتَفَاعِلُن' },
  'فعول': { pattern: '-=-', canonicalUrdu: 'فَعُولُ' },
  'فعل': { pattern: '-=', canonicalUrdu: 'فَعَلْ' },
  'فاع': { pattern: '=-', canonicalUrdu: 'فَاعْ' },
  'فع': { pattern: '=', canonicalUrdu: 'فَعْ' },
};

function cleanMeterToken(s: string): string {
  return stripDiacritics(normalizeUrduChars(stripInvisibleChars(s)))
    .replace(/[،۔؟!؛:«»"()[\]{}]/gu, '')
    .trim();
}

/**
 * Parses a poet's custom Bahar specification (either space/slash-separated Arkan like
 * "مفعول فاعلات مفاعیل فاعلن" or raw prosodic patterns like "==- / =-=- / -==- / =-=")
 * into a structured `ClassicalMeterDef`.
 */
export function parseCustomBaharSpec(
  spec: string,
  customNameUrdu?: string
): ClassicalMeterDef | null {
  const trimmed = (spec || '').trim();
  if (!trimmed) return null;

  // Check if spec matches a catalog meter ID directly
  const byId = CLASSICAL_BUHUR.find((m) => m.id === trimmed);
  if (byId) return byId;

  const rawTokens = trimmed
    .split(/[/|،\s]+/u)
    .map((t) => t.trim())
    .filter(Boolean);
  if (rawTokens.length === 0) return null;

  const patternsList: string[] = [];
  const afailList: string[] = [];

  for (const tok of rawTokens) {
    // 1. Direct -/= pattern token
    if (/^[-=]{1,8}$/.test(tok)) {
      patternsList.push(tok);
      afailList.push(FOOT_NAMES[tok] || tok);
      continue;
    }
    // 2. Vocalized distinction: فَعْلُن (==) vs فَعِلُن (--=)
    const nfc = tok.normalize('NFC');
    if (nfc === 'فَعْلُن' || nfc === 'فعلنْ') {
      patternsList.push('==');
      afailList.push('فَعْلُن');
      continue;
    }
    const cleanTok = cleanMeterToken(tok);
    const known = ARKAN_TO_PATTERN[cleanTok];
    if (known) {
      patternsList.push(known.pattern);
      afailList.push(known.canonicalUrdu);
      continue;
    }
    return null;
  }

  const fullRawPattern = patternsList.join('');
  if (fullRawPattern.length < 2 || fullRawPattern.length > 40) return null;

  // Check if this exact foot pattern already exists in CLASSICAL_BUHUR
  const existingCatalog = CLASSICAL_BUHUR.find(
    (m) =>
      m.fullRawPattern === fullRawPattern &&
      m.patternsList.join('/') === patternsList.join('/')
  );
  if (existingCatalog && !customNameUrdu) {
    return existingCatalog;
  }

  const labelUrdu =
    customNameUrdu?.trim() ||
    `شاعر کی نافذ کردہ بحر (${afailList.join(' ')})`;

  return {
    id: `custom:${patternsList.join('/')}`,
    nameUrdu: labelUrdu,
    nameEnglish: 'Poet-Enforced Custom Meter',
    afailList,
    patternsList,
    fullRawPattern,
    source: 'poet:enforced-bahar',
    allowTerminalShort: true,
  };
}

/**
 * Resolves the active `ClassicalMeterDef` from an explicit meter ID/spec or from the poem's
 * saved `meterName` and `meterRukn`.
 */
export function resolveActiveMeter(
  preferredMeterId?: string,
  poemMeterName?: string,
  poemMeterRukn?: string
): ClassicalMeterDef | null {
  if (preferredMeterId) {
    if (preferredMeterId.startsWith('custom:')) {
      const spec = preferredMeterId.slice('custom:'.length);
      return parseCustomBaharSpec(spec, poemMeterName);
    }
    const catalogMatch = CLASSICAL_BUHUR.find((m) => m.id === preferredMeterId);
    if (catalogMatch) return catalogMatch;
    const parsedFromId = parseCustomBaharSpec(preferredMeterId, poemMeterName);
    if (parsedFromId) return parsedFromId;
  }

  if (poemMeterName) {
    const cleanName = cleanMeterToken(poemMeterName).replace(/^بحر\s+/u, '');
    const byName = CLASSICAL_BUHUR.find(
      (m) =>
        cleanMeterToken(m.nameUrdu).replace(/^بحر\s+/u, '') === cleanName ||
        m.id === poemMeterName
    );
    if (byName) return byName;
  }

  if (poemMeterRukn) {
    const cleanRukn = cleanMeterToken(poemMeterRukn);
    const byAfail = CLASSICAL_BUHUR.find(
      (m) => cleanMeterToken(m.afailList.join(' ')) === cleanRukn
    );
    if (byAfail) return byAfail;
    const customFromRukn = parseCustomBaharSpec(poemMeterRukn, poemMeterName);
    if (customFromRukn) return customFromRukn;
  }

  return null;
}

export interface EnforcedBaharDeduction {
  wordIndex: number;
  word: string;
  deducedPattern: string;
  ruknLabel: string;
  weightDescriptionUrdu: string;
  meterId: string;
  meterNameUrdu: string;
  resultingDistance: number;
  isExactLineMatch: boolean;
  explanationUrdu: string;
}

export interface WordReadingChoice {
  id: string;
  pattern: string;
  ruknLabel: string;
  weightDescriptionUrdu: string;
  pronunciation: string;
  rulesUrdu: string[];
  sourceIds: string[];
  isCurrentlySelected: boolean;
  isPinnedByPoet: boolean;
  /** Optional vocalized text that can be inserted into the line if the poet wishes */
  vocalizedSpelling?: string;
}

export interface CompoundSplitChoice {
  id: string;
  spacedText: string;
  leftWord: string;
  rightWord: string;
  leftPattern: string;
  rightPattern: string;
  combinedPattern: string;
  ruknLabel: string;
  explanationUrdu: string;
  repairedLine: string;
  /** Pattern to pin on the second word after splitting so the poet's exact choice is preserved */
  pinRightPattern: string;
  pinLeftPattern: string;
}

export interface PoeticSpellingChoice {
  id: string;
  originalWord: string;
  alternativeWord: string;
  alternativePattern: string;
  ruknLabel: string;
  explanationUrdu: string;
  repairedLine: string;
}

export interface WordIntentionMenuData {
  wordIndex: number;
  word: string;
  normalizedWord: string;
  charStart: number;
  charEnd: number;
  source: ScannedWord['source'];
  unresolvedReason?: string;
  currentPattern: string;
  directReadings: WordReadingChoice[];
  compoundSplits: CompoundSplitChoice[];
  poeticSpellings: PoeticSpellingChoice[];
  enforcedBaharDeduction?: EnforcedBaharDeduction | null;
}

function getMeterVariantTargets(meter: ClassicalMeterDef): {
  feet: string[];
  target: string;
  notes: string[];
  caesuraBoundary?: number;
}[] {
  const patterns: { feet: string[]; notes: string[]; caesuraBoundary?: number }[] = [
    { feet: [...meter.patternsList], notes: [] },
  ];
  if (meter.initialFlexible) {
    patterns.push({
      feet: ['-' + meter.patternsList[0].slice(1), ...meter.patternsList.slice(1)],
      notes: ['initial-short'],
    });
  }
  if (meter.caesuraAfter) {
    for (const variant of [...patterns]) {
      const feet = [...variant.feet];
      feet[meter.caesuraAfter - 1] += '-';
      patterns.push({
        feet,
        notes: [...variant.notes, 'caesura-short'],
        caesuraBoundary: feet.slice(0, meter.caesuraAfter).join('').length,
      });
    }
  }
  if (meter.allowTerminalShort) {
    for (const variant of [...patterns]) {
      const feet = [...variant.feet];
      feet[feet.length - 1] += '-';
      patterns.push({ ...variant, feet, notes: [...variant.notes, 'terminal-short'] });
    }
  }
  return patterns.map((v) => ({
    ...v,
    target: v.feet.join(''),
  }));
}

function computePrefixCosts(wordVariantsList: string[][], target: string): number[] {
  let dp: number[] = Array.from({ length: target.length + 1 }, (_, j) => j);
  for (const variants of wordVariantsList) {
    const nonEmpty = variants.filter(Boolean);
    const activeVariants = nonEmpty.length > 0 ? nonEmpty : ['='];
    const altRows = activeVariants.map((variant) => {
      let row = [...dp];
      for (const symbol of variant) {
        const next: number[] = [row[0] + 1];
        for (let j = 1; j <= target.length; j++) {
          next.push(
            Math.min(
              row[j - 1] + (symbol !== target[j - 1] ? 1 : 0),
              row[j] + 1,
              next[j - 1] + 1
            )
          );
        }
        row = next;
      }
      return row;
    });
    dp = dp.map((_, j) => Math.min(...altRows.map((r) => r[j])));
  }
  return dp;
}

/**
 * Deduces the exact prosodic pattern (`-` and `=`) that the poet's enforced Bahar
 * expects for `words[wordIndex]` by aligning the prefix words (0..wordIndex-1) from
 * the start of the meter and the suffix words (wordIndex+1..end) from the end of the meter.
 */
export function deduceWordPatternFromEnforcedBahar(
  line: string,
  wordIndex: number,
  meterInput?: ClassicalMeterDef | string | null,
  pinnedPatterns: Record<number, string> = {}
): EnforcedBaharDeduction | null {
  if (!meterInput || !line.trim()) return null;
  const meter =
    typeof meterInput === 'string'
      ? resolveActiveMeter(meterInput)
      : meterInput;
  if (!meter) return null;

  const words = scanPronouncedWords(line);
  const targetWord = words[wordIndex];
  if (!targetWord) return null;

  const getWordVariants = (w: ScannedWord, idx: number): string[] => {
    const pinned = pinnedPatterns[idx];
    if (pinned && /^[-=]{1,8}$/.test(pinned)) return [pinned];
    const valid = w.variants.filter(Boolean);
    if (valid.length > 0) return valid;
    // Fallback rough length for another unresolved word in the same line
    const cleanLen = normalizeLexiconKey(w.word).length;
    if (cleanLen <= 2) return ['=', '-='];
    if (cleanLen <= 4) return ['=-=', '-==', '=='];
    return ['=-==', '-==='];
  };

  const prefixVariants = words.slice(0, wordIndex).map((w, i) => getWordVariants(w, i));
  const suffixVariantsReversed = words
    .slice(wordIndex + 1)
    .map((w, i) => getWordVariants(w, wordIndex + 1 + i))
    .reverse()
    .map((vars) => vars.map((v) => v.split('').reverse().join('')));

  const cleanWordLen = Math.max(1, normalizeLexiconKey(targetWord.word).length);
  const expectedSyllables =
    targetWord.variants[0]?.length ||
    Math.max(1, Math.min(5, Math.round(cleanWordLen * 0.65)));

  const meterVariants = getMeterVariantTargets(meter);
  let bestSlice = '';
  let bestDist = Number.POSITIVE_INFINITY;
  let bestLenDiff = Number.POSITIVE_INFINITY;

  for (const mv of meterVariants) {
    const target = mv.target;
    const revTarget = target.split('').reverse().join('');
    const prefixCosts =
      prefixVariants.length === 0
        ? Array.from({ length: target.length + 1 }, (_, j) => (j === 0 ? 0 : j))
        : computePrefixCosts(prefixVariants, target);
    const suffixCostsRev =
      suffixVariantsReversed.length === 0
        ? Array.from({ length: target.length + 1 }, (_, j) => (j === 0 ? 0 : j))
        : computePrefixCosts(suffixVariantsReversed, revTarget);

    for (let p = 0; p < target.length; p++) {
      for (let q = p + 1; q <= Math.min(target.length, p + 7); q++) {
        const slice = target.slice(p, q);
        if (slice.includes('---')) continue;
        const suffixLen = target.length - q;
        const dist = prefixCosts[p] + suffixCostsRev[suffixLen];
        const lenDiff = Math.abs(slice.length - expectedSyllables);
        if (
          dist < bestDist ||
          (dist === bestDist && lenDiff < bestLenDiff)
        ) {
          bestDist = dist;
          bestLenDiff = lenDiff;
          bestSlice = slice;
        }
      }
    }
  }

  if (!bestSlice) return null;

  const ruknLabel =
    patternToClassicalRukn(bestSlice) || describeWeightInUrdu(bestSlice);
  const weightDescriptionUrdu = describeWeightInUrdu(bestSlice);

  return {
    wordIndex,
    word: targetWord.word,
    deducedPattern: bestSlice,
    ruknLabel,
    weightDescriptionUrdu,
    meterId: meter.id,
    meterNameUrdu: meter.nameUrdu,
    resultingDistance: bestDist,
    isExactLineMatch: bestDist === 0,
    explanationUrdu: `شاعر کی نافذ کردہ بحر (${meter.nameUrdu}) کے مطابق اس مقام پر لفظ «${targetWord.word}» کا متوقع عروضی وزن «${ruknLabel}» (${bestSlice}) بنتا ہے۔`,
  };
}

const POETIC_SPELLING_MAP: Record<string, { alt: string; noteUrdu: string }[]> = {
  'میرا': [{ alt: 'مرا', noteUrdu: 'یائے معروف کا شعری اسقاط (تخفیف)' }],
  'مرا': [{ alt: 'میرا', noteUrdu: 'مکمل معیاری املا (اشباع)' }],
  'میری': [{ alt: 'مری', noteUrdu: 'یائے معروف کا شعری اسقاط (تخفیف)' }],
  'مری': [{ alt: 'میری', noteUrdu: 'مکمل معیاری املا (اشباع)' }],
  'میرے': [{ alt: 'مرے', noteUrdu: 'یائے مجہول کا شعری اسقاط (تخفیف)' }],
  'مرے': [{ alt: 'میرے', noteUrdu: 'مکمل معیاری املا (اشباع)' }],
  'تیرا': [{ alt: 'ترا', noteUrdu: 'یائے معروف کا شعری اسقاط (تخفیف)' }],
  'ترا': [{ alt: 'تیرا', noteUrdu: 'مکمل معیاری املا (اشباع)' }],
  'تیری': [{ alt: 'تری', noteUrdu: 'یائے معروف کا شعری اسقاط (تخفیف)' }],
  'تری': [{ alt: 'تیری', noteUrdu: 'مکمل معیاری املا (اشباع)' }],
  'تیرے': [{ alt: 'ترے', noteUrdu: 'یائے مجہول کا شعری اسقاط (تخفیف)' }],
  'ترے': [{ alt: 'تیرے', noteUrdu: 'مکمل معیاری املا (اشباع)' }],
  'جہان': [{ alt: 'جہاں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'جہاں': [{ alt: 'جہان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'آسمان': [{ alt: 'آسماں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'آسماں': [{ alt: 'آسمان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'گمان': [{ alt: 'گماں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'گماں': [{ alt: 'گمان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'زبان': [{ alt: 'زباں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'زباں': [{ alt: 'زبان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'بیان': [{ alt: 'بیاں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'بیاں': [{ alt: 'بیان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'نشان': [{ alt: 'نشاں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'نشاں': [{ alt: 'نشان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'مکان': [{ alt: 'مکاں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'مکاں': [{ alt: 'مکان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'داستان': [{ alt: 'داستاں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'داستاں': [{ alt: 'داستان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'خزان': [{ alt: 'خزاں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'خزاں': [{ alt: 'خزان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
  'کاروان': [{ alt: 'کارواں', noteUrdu: 'نونِ غنہ کے ساتھ شعری تخفیف' }],
  'کارواں': [{ alt: 'کاروان', noteUrdu: 'نونِ معلنہ کے ساتھ مکمل وزن' }],
};

/** Common second-member auxiliary / compound verbs & particles in Urdu */
const COMMON_SECOND_WORDS = new Set([
  'گیا', 'گئے', 'گئی', 'گئیں',
  'جا', 'جائے', 'جائیں', 'جاؤ', 'جاتا', 'جاتی', 'جاتے', 'جانا',
  'آ', 'آیا', 'آئے', 'آئی', 'آئیں', 'آتا', 'آتی', 'آتے', 'آنا',
  'لو', 'لے', 'لیں', 'لیا', 'لیے', 'لی',
  'دو', 'دے', 'دیں', 'دیا', 'دیے', 'دی',
  'چکا', 'چکے', 'چکی', 'چکیں',
  'سکتا', 'سکتے', 'سکتی', 'سکا', 'سکے', 'سکی',
  'رہا', 'رہے', 'رہی', 'رہیں',
  'پڑا', 'پڑے', 'پڑی',
  'کر', 'کے', 'کو', 'سے', 'پر', 'پہ', 'میں', 'بھی', 'ہی', 'تو', 'نہ',
  'دل', 'جاں', 'جان', 'دم', 'بر', 'سر', 'در', 'کار', 'زار', 'بار', 'دار', 'وار', 'گر', 'گاہ', 'نواز', 'شناس',
]);

/** Non-joining Urdu letters after which spaces are commonly omitted in typing */
const NON_JOINER_END_REGEX = /[اآدڈذرڑزژوے]$/u;

export function describeWeightInUrdu(pattern: string): string {
  const clean = pattern.replace(/\s+/g, '');
  if (!clean) return 'نامعلوم';
  const rukn = patternToClassicalRukn(clean);
  const parts = clean.split('').map((s) => (s === '=' ? 'بلند (=)' : 'کوتاہ (-)'));
  const breakdown = parts.join(' + ');
  if (rukn) {
    return `${rukn} (${breakdown})`;
  }
  const commonLabels: Record<string, string> = {
    '=': 'سببِ خفیف (ایک بلند ہجا)',
    '-': 'ہجائے کوتاہ (ایک ہلکا ہجا)',
    '-=': 'وتدِ مجموع / فعول (کوتاہ + بلند)',
    '=-': 'فاعل / فاع (بلند + کوتاہ)',
    '==': 'فعلن / دو بلند ہجے',
    '--': 'دو کوتاہ ہجے (تخفیف شدہ)',
    '=-=': 'فاعلن (بلند + کوتاہ + بلند)',
    '--=': 'فعلن (کوتاہ + کوتاہ + بلند)',
    '-==': 'فعولن (کوتاہ + بلند + بلند)',
    '==-': 'مفعول (بلند + بلند + کوتاہ)',
    '=--': 'فاعلات / بلند + دو کوتاہ',
  };
  return commonLabels[clean] || breakdown;
}

/**
 * Finds valid 2-word split possibilities for an unspaced Urdu token (such as آگئے -> آ گئے, ہوگئے -> ہو گئے).
 */
export function findCompoundSplitChoices(
  line: string,
  wordObj: ScannedWord
): CompoundSplitChoice[] {
  const raw = wordObj.word.normalize('NFC').replace(/\u0627\u0653/g, '\u0622');
  const norm = normalizeLexiconKey(raw);
  if (norm.length < 2) return [];

  // Only propose splits if the word is unresolved OR starts with a non-joiner stem followed by a known second word
  const choices: CompoundSplitChoice[] = [];
  const seenIds = new Set<string>();

  for (let i = 1; i < raw.length; i++) {
    const leftRaw = raw.slice(0, i);
    const rightRaw = raw.slice(i);
    const leftKey = normalizeLexiconKey(leftRaw);
    const rightKey = normalizeLexiconKey(rightRaw);
    if (!leftKey || !rightKey) continue;

    const leftEndsWithNonJoiner = NON_JOINER_END_REGEX.test(leftKey);
    const rightIsCommon = COMMON_SECOND_WORDS.has(rightKey);

    // If the unspaced token is already a known dictionary word, only offer splits when
    // left ends in a non-joiner AND right is a common auxiliary verb/particle.
    if (wordObj.source !== 'unresolved' && !(leftEndsWithNonJoiner && rightIsCommon)) {
      continue;
    }

    // Even for unresolved words, require either a non-joiner boundary or a known second word
    // so we don't produce arbitrary letter splits.
    if (!leftEndsWithNonJoiner && !rightIsCommon) {
      continue;
    }

    const spacedText = `${leftRaw} ${rightRaw}`;
    const scannedPair = scanPronouncedWords(spacedText);
    if (scannedPair.length !== 2) continue;
    const [leftScanned, rightScanned] = scannedPair;
    if (
      leftScanned.source === 'unresolved' ||
      rightScanned.source === 'unresolved' ||
      !leftScanned.options.length ||
      !rightScanned.options.length
    ) {
      continue;
    }

    const repairedLine =
      line.slice(0, wordObj.charStart) + spacedText + line.slice(wordObj.charEnd);

    for (const lOpt of leftScanned.options) {
      for (const rOpt of rightScanned.options) {
        const combinedPattern = lOpt.pattern + rOpt.pattern;
        if (combinedPattern.includes('---')) continue;
        const id = `split-${leftKey}-${rightKey}-${lOpt.pattern}-${rOpt.pattern}`;
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const ruknLabel =
          patternToClassicalRukn(combinedPattern) ||
          describeWeightInUrdu(combinedPattern);
        const ruleNotes = [...lOpt.rules, ...rOpt.rules].map(readingRuleLabel);
        const ruleSuffix =
          ruleNotes.length > 0 ? ` — ${ruleNotes.join('، ')}` : ' — مکمل معیاری تلفظ';

        choices.push({
          id,
          spacedText,
          leftWord: leftRaw,
          rightWord: rightRaw,
          leftPattern: lOpt.pattern,
          rightPattern: rOpt.pattern,
          combinedPattern,
          ruknLabel,
          explanationUrdu: `${leftRaw} (${lOpt.pattern}) + ${rightRaw} (${rOpt.pattern})${ruleSuffix}`,
          repairedLine,
          pinLeftPattern: lOpt.pattern,
          pinRightPattern: rOpt.pattern,
        });
      }
    }
  }

  return choices;
}

/**
 * Builds the complete WordIntentionMenuData for a given word in a line.
 */
export function getWordIntentionMenuData(
  line: string,
  wordIndex: number,
  currentSelectedPattern: string,
  pinnedPattern?: string,
  enforcedMeter?: ClassicalMeterDef | string | null,
  allPinnedPatterns?: Record<number, string>
): WordIntentionMenuData | null {
  const words = scanPronouncedWords(line);
  const wordObj = words[wordIndex];
  if (!wordObj) return null;

  const key = normalizeLexiconKey(wordObj.word);
  const lexicalRecords = AroozLexiconService.getLexicalReadings(key);

  // 1. Direct readings from contextual options + distinct vocalized dictionary homographs
  const directReadings: WordReadingChoice[] = [];
  const seenReadingKeys = new Set<string>();

  for (const opt of wordObj.options) {
    const rKey = `${opt.pattern}::${opt.pronunciation}`;
    seenReadingKeys.add(rKey);
    const rulesUrdu =
      opt.rules.length > 0
        ? opt.rules.map((r) =>
            r === POET_ENFORCED_BAHAR_RULE ? POET_ENFORCED_BAHAR_LABEL : readingRuleLabel(r)
          )
        : ['معیاری لغوی وزن (مکمل مصوتہ)'];

    const hasDistinctVocalization =
      opt.pronunciation &&
      /[\u064b-\u0652\u0670]/u.test(opt.pronunciation) &&
      opt.pronunciation !== wordObj.word;

    directReadings.push({
      id: `reading-${opt.pattern}-${opt.pronunciation || 'default'}`,
      pattern: opt.pattern,
      ruknLabel: patternToClassicalRukn(opt.pattern),
      weightDescriptionUrdu: describeWeightInUrdu(opt.pattern),
      pronunciation: opt.pronunciation || wordObj.word,
      rulesUrdu,
      sourceIds: opt.sourceIds,
      isCurrentlySelected: opt.pattern === currentSelectedPattern,
      isPinnedByPoet: pinnedPattern === opt.pattern,
      vocalizedSpelling: hasDistinctVocalization ? opt.pronunciation : undefined,
    });
  }

  // Also surface distinct vocalized dictionary entries that share or differ in pattern (e.g., سَحَر vs سِحْر, گُل vs گِل)
  for (const rec of lexicalRecords) {
    if (!rec.vocalized || !/[\u064b-\u0652\u0670]/u.test(rec.vocalized)) continue;
    const cleanPattern = rec.pattern.replace(/x/g, '=');
    const rKey = `${cleanPattern}::${rec.vocalized}`;
    if (seenReadingKeys.has(rKey)) continue;
    const existingSamePattern = directReadings.find(
      (d) => d.pattern === cleanPattern && d.pronunciation === rec.vocalized
    );
    if (existingSamePattern) continue;

    seenReadingKeys.add(rKey);
    directReadings.push({
      id: `lex-${cleanPattern}-${rec.sourceId}`,
      pattern: cleanPattern,
      ruknLabel: patternToClassicalRukn(cleanPattern),
      weightDescriptionUrdu: describeWeightInUrdu(cleanPattern),
      pronunciation: rec.vocalized,
      rulesUrdu: ['لغت میں درج معرب تلفظ'],
      sourceIds: [rec.sourceId],
      isCurrentlySelected:
        cleanPattern === currentSelectedPattern &&
        directReadings.filter((d) => d.pattern === cleanPattern).length === 0,
      isPinnedByPoet: pinnedPattern === cleanPattern,
      vocalizedSpelling: rec.vocalized !== wordObj.word ? rec.vocalized : undefined,
    });
  }

  // 1b. Deduce expected reading from the poet's enforced Bahar (if active)
  const enforcedBaharDeduction = enforcedMeter
    ? deduceWordPatternFromEnforcedBahar(
        line,
        wordIndex,
        enforcedMeter,
        allPinnedPatterns || {}
      )
    : null;

  if (enforcedBaharDeduction) {
    const dPat = enforcedBaharDeduction.deducedPattern;
    const alreadyInDirect = directReadings.some((d) => d.pattern === dPat);
    if (!alreadyInDirect) {
      directReadings.unshift({
        id: `enforced-bahar-${wordIndex}-${dPat}`,
        pattern: dPat,
        ruknLabel: enforcedBaharDeduction.ruknLabel,
        weightDescriptionUrdu: enforcedBaharDeduction.weightDescriptionUrdu,
        pronunciation: wordObj.word,
        rulesUrdu: [POET_ENFORCED_BAHAR_LABEL],
        sourceIds: ['poet:enforced-bahar'],
        isCurrentlySelected: dPat === currentSelectedPattern,
        isPinnedByPoet: pinnedPattern === dPat,
      });
    }
  }

  // 2. Compound / Unspaced word split possibilities (e.g., آگئے -> آ گئے)
  const compoundSplits = findCompoundSplitChoices(line, wordObj);

  // 3. Poetic spelling alternatives (e.g., میرا -> مرا, جہان -> جہاں)
  const poeticSpellings: PoeticSpellingChoice[] = [];
  const altEntries = POETIC_SPELLING_MAP[key] || [];
  for (const entry of altEntries) {
    const altScan = scanPronouncedWords(entry.alt);
    const altOpt = altScan[0]?.options[0];
    if (!altOpt) continue;
    const repairedLine =
      line.slice(0, wordObj.charStart) + entry.alt + line.slice(wordObj.charEnd);
    poeticSpellings.push({
      id: `poetic-${key}-${entry.alt}`,
      originalWord: wordObj.word,
      alternativeWord: entry.alt,
      alternativePattern: altOpt.pattern,
      ruknLabel:
        patternToClassicalRukn(altOpt.pattern) ||
        describeWeightInUrdu(altOpt.pattern),
      explanationUrdu: entry.noteUrdu,
      repairedLine,
    });
  }

  return {
    wordIndex,
    word: wordObj.word,
    normalizedWord: key,
    charStart: wordObj.charStart,
    charEnd: wordObj.charEnd,
    source: wordObj.source,
    unresolvedReason: wordObj.reason,
    currentPattern: currentSelectedPattern,
    directReadings,
    compoundSplits,
    poeticSpellings,
    enforcedBaharDeduction,
  };
}

export interface EvaluateEnforcedOptions {
  customMeter?: ClassicalMeterDef | null;
  strictEnforceBahar?: boolean;
}

function findFootInfoForMeter(
  targetSyllableIdx: number,
  meter: ClassicalMeterDef
): { ruknName: string; ruknIndex: number } {
  let accum = 0;
  for (let r = 0; r < meter.patternsList.length; r++) {
    const rawPattern = meter.patternsList[r].replace(/\s+/g, '');
    const len = rawPattern.length;
    if (targetSyllableIdx >= accum && targetSyllableIdx < accum + len) {
      return {
        ruknName: meter.afailList[r] || patternToClassicalRukn(rawPattern),
        ruknIndex: r,
      };
    }
    accum += len;
  }
  return {
    ruknName: meter.afailList[meter.afailList.length - 1] || 'آخری رکن',
    ruknIndex: Math.max(0, meter.afailList.length - 1),
  };
}

/**
 * Re-evaluates scansion and diagnostic report when the poet has:
 * 1. Pinned specific readings (`pinnedPatterns`) on one or more words (including unrecognized words), OR
 * 2. Enforced a custom Bahar (`options.customMeter` or `preferredMeterId`), OR
 * 3. Enabled strict Bahar enforcement (`options.strictEnforceBahar = true`), which automatically
 *    assigns deduced Bahar weights to unrecognized or mismatched words under the poet's enforced Bahar.
 */
export function evaluateWithPinnedReadings(
  line: string,
  baseScansion: ScansionResult,
  baseReport: MeterDiagnosticReport,
  pinnedPatterns: Record<number, string>,
  preferredMeterId?: string,
  options?: EvaluateEnforcedOptions
): { scansion: ScansionResult; report: MeterDiagnosticReport } {
  const effectivePinned: Record<number, string> = { ...pinnedPatterns };
  const resolvedCustomMeter =
    options?.customMeter ||
    (preferredMeterId ? resolveActiveMeter(preferredMeterId) : null);
  const isCustomMeter = Boolean(
    resolvedCustomMeter &&
      !CLASSICAL_BUHUR.some((m) => m.id === resolvedCustomMeter.id)
  );
  const strictEnforceBahar = Boolean(options?.strictEnforceBahar);

  const words = scanPronouncedWords(line);
  if (!words.length || !line.trim()) {
    return { scansion: baseScansion, report: baseReport };
  }

  // If strictEnforceBahar is active and an enforced meter is known, auto-deduce weights for unresolved words
  const targetMeterForDeduction =
    resolvedCustomMeter ||
    CLASSICAL_BUHUR.find((m) => m.id === baseReport.meterId) ||
    null;

  if (strictEnforceBahar && targetMeterForDeduction) {
    for (let idx = 0; idx < words.length; idx++) {
      if (effectivePinned[idx]) continue;
      if (words[idx].source === 'unresolved' || !words[idx].variants[0]) {
        const deduced = deduceWordPatternFromEnforcedBahar(
          line,
          idx,
          targetMeterForDeduction,
          effectivePinned
        );
        if (deduced && deduced.deducedPattern) {
          effectivePinned[idx] = deduced.deducedPattern;
        }
      }
    }
    // Also check if a single known word has a poetic weight mismatch that can be resolved to 0 distance under strictEnforceBahar
    for (let idx = 0; idx < words.length; idx++) {
      if (effectivePinned[idx]) continue;
      const deduced = deduceWordPatternFromEnforcedBahar(
        line,
        idx,
        targetMeterForDeduction,
        effectivePinned
      );
      if (
        deduced &&
        deduced.isExactLineMatch &&
        !words[idx].variants.includes(deduced.deducedPattern)
      ) {
        effectivePinned[idx] = deduced.deducedPattern;
        break;
      }
    }
  }

  const pinnedIndices = Object.keys(effectivePinned)
    .map(Number)
    .filter((idx) => Boolean(effectivePinned[idx]));

  if (pinnedIndices.length === 0 && !isCustomMeter && !strictEnforceBahar) {
    return { scansion: baseScansion, report: baseReport };
  }

  // Constrain pinned words to their chosen pattern (supporting both dictionary and poet-enforced patterns)
  const constrainedWords: ScannedWord[] = words.map((w, idx) => {
    const pinned = effectivePinned[idx];
    if (!pinned || !/^[-=]{1,8}$/.test(pinned)) return w;
    if (w.variants.includes(pinned)) {
      const matchingOptions = w.options.filter((o) => o.pattern === pinned);
      return {
        ...w,
        source: w.source === 'unresolved' ? 'reviewed-entry' : w.source,
        variants: [pinned],
        options: matchingOptions.length ? matchingOptions : w.options,
      };
    }
    // Poet-enforced Bahar reading (either on an unresolved word or overriding dictionary weight)
    return {
      ...w,
      source: 'reviewed-entry',
      variants: [pinned],
      options: [
        {
          pattern: pinned,
          rules: [POET_ENFORCED_BAHAR_RULE],
          sourceIds: ['poet:enforced-bahar'],
          pronunciation: w.word,
        },
      ],
    };
  });

  // Helper to align constrained words against a target pattern
  function alignConstrained(target: string, requiredWordBoundary?: number) {
    type State = { cost: number; readings: string[] };
    const unreachable = (): State => ({ cost: Number.POSITIVE_INFINITY, readings: [] });
    function advance(previous: State[], variants: string[], minColumn: number, maxColumn: number): State[] {
      const alternatives = variants.map((variant) => {
        let row = previous.map((state) => ({
          cost: state.cost,
          readings: [...state.readings, variant],
        }));
        for (const symbol of variant) {
          const next: State[] = [
            minColumn === 0 ? { cost: row[0].cost + 1, readings: row[0].readings } : unreachable(),
          ];
          for (let j = 1; j <= target.length; j++) {
            if (j < minColumn || j > maxColumn) {
              next.push(unreachable());
              continue;
            }
            const options = [
              { cost: row[j - 1].cost + Number(symbol !== target[j - 1]), readings: row[j - 1].readings },
              { cost: row[j].cost + 1, readings: row[j].readings },
              { cost: next[j - 1].cost + 1, readings: next[j - 1].readings },
            ];
            next.push(options.reduce((a, b) => (b.cost < a.cost ? b : a)));
          }
          row = next;
        }
        return row;
      });
      return previous.map((_, j) =>
        alternatives.map((row) => row[j]).reduce((a, b) => (b.cost < a.cost ? b : a))
      );
    }

    const boundary = requiredWordBoundary ?? target.length;
    let before: State[] = Array.from({ length: target.length + 1 }, (_, j) =>
      j <= boundary ? { cost: j, readings: [] } : unreachable()
    );
    let after: State[] = Array.from({ length: target.length + 1 }, unreachable);
    for (const word of constrainedWords) {
      before = advance(before, word.variants, 0, boundary);
      if (requiredWordBoundary !== undefined) {
        after = advance(after, word.variants, boundary, target.length);
        if (before[boundary].cost < after[boundary].cost) after[boundary] = before[boundary];
        for (let j = boundary + 1; j <= target.length; j++) {
          if (after[j - 1].cost + 1 < after[j].cost) {
            after[j] = { cost: after[j - 1].cost + 1, readings: after[j - 1].readings };
          }
        }
      }
    }
    const best = (requiredWordBoundary === undefined ? before : after)[target.length];
    return {
      words: constrainedWords,
      readings: best.readings,
      pattern: best.readings.join(''),
      distance: best.cost,
      selectedOptions: constrainedWords.map((w, i) =>
        w.options.find((o) => o.pattern === best.readings[i])
      ),
      uncertainWords: [
        ...constrainedWords
          .filter((w) => w.source === 'unresolved' || w.source === 'user-entry')
          .map((w) => w.word),
        ...(line.match(/\p{N}+/gu) || []),
      ],
    };
  }

  function scanMeterConstrained(meter: ClassicalMeterDef) {
    const patterns: { feet: string[]; notes: string[]; caesuraBoundary?: number }[] = [
      { feet: [...meter.patternsList], notes: [] },
    ];
    if (meter.initialFlexible) {
      patterns.push({
        feet: ['-' + meter.patternsList[0].slice(1), ...meter.patternsList.slice(1)],
        notes: ['initial-short'],
      });
    }
    if (meter.caesuraAfter) {
      for (const variant of [...patterns]) {
        const feet = [...variant.feet];
        feet[meter.caesuraAfter - 1] += '-';
        patterns.push({
          feet,
          notes: [...variant.notes, 'caesura-short'],
          caesuraBoundary: feet.slice(0, meter.caesuraAfter).join('').length,
        });
      }
    }
    if (meter.allowTerminalShort) {
      for (const variant of [...patterns]) {
        const feet = [...variant.feet];
        feet[feet.length - 1] += '-';
        patterns.push({ ...variant, feet, notes: [...variant.notes, 'terminal-short'] });
      }
    }
    const candidates = patterns.map((variant) => {
      const target = variant.feet.join('');
      const scan = alignConstrained(target, variant.caesuraBoundary);
      return {
        ...scan,
        target,
        notes: variant.notes,
        resolvedMeter: {
          ...meter,
          patternsList: variant.feet,
          afailList: meter.afailList.map((name, i) =>
            i === 0 && variant.notes.includes('initial-short') ? FOOT_NAMES['--=='] : name
          ),
          fullRawPattern: target,
        },
      };
    });
    return candidates.reduce((a, b) => (b.distance < a.distance ? b : a));
  }

  const meters = resolvedCustomMeter
    ? [resolvedCustomMeter]
    : preferredMeterId
      ? CLASSICAL_BUHUR.filter((m) => m.id === preferredMeterId)
      : CLASSICAL_BUHUR;
  const candidates = meters.map((meter) => ({ meter, scan: scanMeterConstrained(meter) }));
  let chosen = candidates[0];
  const hasExplicitTarget = Boolean(resolvedCustomMeter || preferredMeterId);
  if (!hasExplicitTarget && !candidates.some((c) => c.scan.distance === 0)) {
    const prefixes = candidates.filter(
      (c) =>
        c.scan.pattern &&
        !c.scan.uncertainWords.length &&
        c.scan.target.startsWith(c.scan.pattern)
    );
    if (prefixes.length) {
      chosen = prefixes.reduce((a, b) => (b.scan.distance < a.scan.distance ? b : a));
    } else {
      chosen = candidates.reduce((a, b) => (b.scan.distance < a.scan.distance ? b : a));
    }
  } else {
    chosen = candidates.reduce((a, b) => {
      if (b.scan.distance < a.scan.distance) return b;
      if (
        b.scan.distance === a.scan.distance &&
        b.scan.pattern &&
        b.scan.target.startsWith(b.scan.pattern) &&
        !a.scan.target.startsWith(a.scan.pattern)
      ) {
        return b;
      }
      return a;
    });
  }

  const { meter, scan } = chosen;
  const isMatched =
    scan.pattern.length > 0 && scan.distance === 0 && !scan.uncertainWords.length;
  const groups = splitSyllablesByMeterArkan(scan.pattern, scan.resolvedMeter);

  let cursor = 0;
  const wordSpans: WordSyllableSpan[] = scan.words.map((word, index) => {
    const syllables = scan.readings[index];
    const span: WordSyllableSpan = {
      wordIndex: index,
      word: word.word,
      normalizedWord: normalizeLexiconKey(word.word),
      charStart: word.charStart,
      charEnd: word.charEnd,
      syllables,
      readingRules: scan.selectedOptions[index]?.rules || [],
      sourceIds: scan.selectedOptions[index]?.sourceIds || [],
      pronunciation: scan.selectedOptions[index]?.pronunciation || '',
      source: word.source,
      syllableStartIdx: cursor,
      syllableEndIdx: cursor + syllables.length,
    };
    cursor += syllables.length;
    return span;
  });

  const isPrefix =
    !hasExplicitTarget &&
    scan.distance > 0 &&
    !scan.uncertainWords.length &&
    scan.target.startsWith(scan.pattern);

  // Recompute defects against the active target pattern
  const updatedDefects: SyllableDefect[] = [];
  if (scan.pattern && !isMatched && (hasExplicitTarget || !isPrefix)) {
    const ops = alignSyllablePatterns(scan.target, scan.pattern);
    for (const [index, op] of ops.entries()) {
      if (op.type === 'match') continue;
      const span =
        wordSpans.find(
          (w) => op.actualIdx >= w.syllableStartIdx && op.actualIdx < w.syllableEndIdx
        ) || wordSpans.at(-1)!;
      const foot = findFootInfoForMeter(op.targetIdx, scan.resolvedMeter);
      const type =
        op.type === 'insert'
          ? 'extra_syllable'
          : op.type === 'delete'
            ? 'missing_syllable'
            : 'weight_mismatch';
      updatedDefects.push({
        id: `defect-${index}`,
        type,
        syllableIndex: op.actualIdx,
        wordIndex: span.wordIndex,
        word: span.word,
        expected: op.targetSym || '—',
        actual: op.actualSym || '—',
        ...foot,
        descriptionUrdu:
          type === 'extra_syllable'
            ? 'مطلوبہ وزن کے مقابلے میں زائد ہجا۔'
            : type === 'missing_syllable'
              ? 'اس مقام پر مطلوبہ وزن کا ہجا موجود نہیں۔'
              : 'اس مقام پر ہجے کا وزن مختلف ہے۔',
      });
    }
  }

  return {
    scansion: {
      isMatched,
      rawSyllables: scan.pattern,
      meterNameUrdu: scan.pattern ? meter.nameUrdu : 'خالی مصرع',
      meterNameEnglish: meter.nameEnglish,
      afail: scan.resolvedMeter.afailList.join(' '),
      afailList: scan.resolvedMeter.afailList,
      groupedPattern: groups.join('   '),
      groupedPatternList: groups,
      confidence: Math.max(
        0,
        Math.round(
          100 * (1 - scan.distance / Math.max(scan.pattern.length, meter.fullRawPattern.length))
        )
      ),
      totalSyllables: scan.pattern.length,
    },
    report: {
      ...baseReport,
      meterNotes: scan.notes,
      uncertainWords: scan.uncertainWords,
      distance: scan.distance,
      targetIsExplicit: hasExplicitTarget,
      isPrefix,
      isCompliant: isMatched,
      meterId: meter.id,
      meterNameUrdu: meter.nameUrdu,
      meterNameEnglish: meter.nameEnglish,
      targetPattern: scan.target,
      actualPattern: scan.pattern,
      wordSpans,
      defects: updatedDefects,
      suggestions: isMatched ? [] : baseReport.suggestions,
    },
  };
}
