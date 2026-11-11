/**
 * Visual Slot / Wildcard Rhyme Builder Engine (قالب سازِ قوافی)
 * Compiles interactive letter slots into boundary-safe Urdu regex expressions
 * and queries the in-memory pronunciation lexicon + 58,604-word Qaafiyah vocabulary.
 */

import { FOOT_NAMES } from '../data/prosodyMeters';
import { AroozLexiconService } from './aroozLexiconService';
import { cleanQafiyaWord } from './qafiyaEngine';
import qaafiyahVocabulary from '../data/qaafiyahVocabulary.json';

export type SlotState =
  | 'locked'
  | 'any'
  | 'vowel'
  | 'consonant'
  | 'custom_set'
  | 'exclude_set';

export interface LetterSlot {
  id: string;
  char: string;
  state: SlotState;
  /** Optional list of allowed (custom_set) or excluded (exclude_set) Urdu letters for this specific box */
  customChars?: string[];
}

export interface SlotQueryOptions {
  slots: LetterSlot[];
  exactLength: boolean;
  meterFilter?: string; // e.g. "-=", "-==", "=-="
  includeUnweighted?: boolean; // default true so poets get full 58,604-word coverage unless filtering by meter
}

export interface SlotQueryResultItem {
  word: string;
  pattern: string;
  afail: string;
}

export interface SlotQueryResult {
  regexString: string;
  totalMatches: number;
  matches: SlotQueryResultItem[];
}

const AFAIL_MAP: Record<string, string> = {
  ...FOOT_NAMES,
  '-': 'ہجائے کوتاہ',
  '=': 'ہجائے بلند',
  '': 'تلفظ درکار',
};

export const URDU_ALPHABET: string[] = [
  'آ', 'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح',
  'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ',
  'ل', 'م', 'ن', 'ں', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے',
];

export const URDU_LETTER_FAMILIES: {
  id: string;
  label: string;
  desc: string;
  chars: string[];
}[] = [
  {
    id: 'vowels',
    label: 'حروفِ علت (آ، ا، و، ی، ے)',
    desc: 'عروضی و صوتی حروفِ علت',
    chars: ['آ', 'ا', 'و', 'ی', 'ے'],
  },
  {
    id: 'labials',
    label: 'لبی حروف (ب، پ، ف، م، و)',
    desc: 'ہونٹوں سے ادا ہونے والے ہم آہنگ حروف',
    chars: ['ب', 'پ', 'ف', 'م', 'و'],
  },
  {
    id: 'sibilants',
    label: 'صفیری حروف (س، ش، ص، ز، ذ، ض، ظ)',
    desc: 'سیٹی اور سرسراہٹ کی آواز والے حروف',
    chars: ['س', 'ش', 'ص', 'ز', 'ذ', 'ض', 'ظ'],
  },
  {
    id: 'dentals',
    label: 'دندانی و لثوی (ت، ٹ، د، ڈ، ر، ڑ، ل، ن)',
    desc: 'زبان کی نوک سے ادا ہونے والے حروف',
    chars: ['ت', 'ٹ', 'د', 'ڈ', 'ر', 'ڑ', 'ل', 'ن'],
  },
  {
    id: 'gutturals',
    label: 'حلقی و کاموی (ح، خ، ع، غ، ق، ک، گ، ہ)',
    desc: 'حلق اور تالو کے پچھلے حصے کے حروف',
    chars: ['ح', 'خ', 'ع', 'غ', 'ق', 'ک', 'گ', 'ہ'],
  },
  {
    id: 'nasals',
    label: 'انفی / غنہ (م، ن، ں)',
    desc: 'ناک کی گونج والے حروف',
    chars: ['م', 'ن', 'ں'],
  },
];

const URDU_VOWEL_CHAR_CLASS = '[اویےآ]';
const URDU_CONSONANT_CHAR_CLASS = '[بپتٹثجچحخدڈذرڑزژسشصضطظعغفقکگلمنںوہھء]';

function escapeCharForClass(ch: string): string {
  return ch.replace(/[\\\]^-]/g, '\\$&');
}

/**
 * Splits a base Urdu word into interactive letter slots
 */
export function wordToLetterSlots(word: string): LetterSlot[] {
  const clean = cleanQafiyaWord(word).replace(/\s+/g, '');
  if (!clean) return [];

  return Array.from(clean).map((char, idx) => ({
    id: `slot-${idx}-${char}-${Date.now()}`,
    char,
    state: idx === clean.length - 1 ? 'locked' : 'any', // default last letter locked
    customChars: [char],
  }));
}

/**
 * Cycles slot state: locked -> any -> vowel -> consonant -> locked
 */
export function cycleSlotState(currentState: SlotState): SlotState {
  switch (currentState) {
    case 'locked':
      return 'any';
    case 'any':
      return 'vowel';
    case 'vowel':
      return 'consonant';
    case 'consonant':
    case 'custom_set':
    case 'exclude_set':
      return 'locked';
    default:
      return 'locked';
  }
}

/**
 * Compiles an array of LetterSlots into an optimized, boundary-safe regular expression
 */
export function compileSlotRegex(
  slots: LetterSlot[],
  exactLength: boolean
): { regex: RegExp; regexString: string } {
  if (slots.length === 0) {
    return { regex: /^$/, regexString: '^$' };
  }

  let patternBody = '';

  for (const slot of slots) {
    switch (slot.state) {
      case 'locked':
        patternBody += `[${escapeCharForClass(slot.char)}]`;
        break;
      case 'any':
        patternBody += '[\u0600-\u06FF]';
        break;
      case 'vowel':
        patternBody += URDU_VOWEL_CHAR_CLASS;
        break;
      case 'consonant':
        patternBody += URDU_CONSONANT_CHAR_CLASS;
        break;
      case 'custom_set': {
        const chars =
          slot.customChars && slot.customChars.length > 0
            ? slot.customChars
            : [slot.char];
        patternBody += `[${chars.map(escapeCharForClass).join('')}]`;
        break;
      }
      case 'exclude_set': {
        const chars =
          slot.customChars && slot.customChars.length > 0
            ? slot.customChars
            : [slot.char];
        patternBody += `[^${chars.map(escapeCharForClass).join('')}\\s]`;
        break;
      }
    }
  }

  const regexString = exactLength ? `^${patternBody}$` : `^.*${patternBody}$`;
  const regex = new RegExp(regexString);

  return { regex, regexString };
}

/**
 * Queries the active source-attributed lexicon (and unweighted Qaafiyah vocabulary when meterFilter is not restricting)
 * using compiled visual slot regex.
 */
export function querySlotRhymes(options: SlotQueryOptions): SlotQueryResult {
  const { slots, exactLength, meterFilter, includeUnweighted = true } = options;
  if (slots.length === 0) {
    return { regexString: '', totalMatches: 0, matches: [] };
  }

  const { regex, regexString } = compileSlotRegex(slots, exactLength);
  const wordMap = AroozLexiconService.getAllWordsWithScansion();

  const results: SlotQueryResultItem[] = [];
  const seen = new Set<string>();
  const normFilter = meterFilter ? meterFilter.replace(/\s+/g, '') : null;

  for (const [word, patterns] of wordMap.entries()) {
    const clean = cleanQafiyaWord(word);
    if (!clean || seen.has(clean)) continue;
    if (regex.test(clean)) {
      const primaryPattern = patterns[0] ? patterns[0].replace(/\s+/g, '') : '';
      if (normFilter && primaryPattern !== normFilter) {
        continue;
      }

      seen.add(clean);
      const afail = AFAIL_MAP[primaryPattern] || 'بر وزنِ معین';
      results.push({
        word: clean,
        pattern: primaryPattern,
        afail,
      });
    }
  }

  // Also search the unweighted Qaafiyah Expert vocabulary when no specific meter pattern is required
  if (includeUnweighted && !normFilter && Array.isArray(qaafiyahVocabulary)) {
    for (const rawWord of qaafiyahVocabulary) {
      const clean = cleanQafiyaWord(rawWord);
      if (!clean || seen.has(clean)) continue;
      if (regex.test(clean)) {
        seen.add(clean);
        results.push({
          word: clean,
          pattern: '',
          afail: 'تلفظ درکار',
        });
      }
    }
  }

  // Sort weighted matches first, then by word length, then alphabetically
  results.sort((a, b) => {
    const aWeighted = a.pattern ? 0 : 1;
    const bWeighted = b.pattern ? 0 : 1;
    if (aWeighted !== bWeighted) return aWeighted - bWeighted;
    return a.word.length - b.word.length || a.word.localeCompare(b.word, 'ur');
  });

  return {
    regexString,
    totalMatches: results.length,
    matches: results.slice(0, 600),
  };
}

/**
 * Presets for Ilm-ul-Qawafi rules
 */
export function applyRhymePreset(
  slots: LetterSlot[],
  preset: 'rawi_only' | 'radf_rawi' | 'tasees_dakhil'
): LetterSlot[] {
  if (slots.length === 0) return slots;

  const len = slots.length;
  const newSlots = slots.map((s) => ({ ...s }));

  if (preset === 'rawi_only') {
    // Lock only the very last letter; make all preceding slots wildcard ANY
    newSlots.forEach((s, idx) => {
      s.state = idx === len - 1 ? 'locked' : 'any';
    });
  } else if (preset === 'radf_rawi') {
    // Lock last 2 letters (e.g. Alif + Noon); make preceding wildcard ANY
    newSlots.forEach((s, idx) => {
      s.state = idx >= len - 2 ? 'locked' : 'any';
    });
  } else if (preset === 'tasees_dakhil') {
    // Alif-e-Tasees + Dakhil + Rawi: Lock slot -3 (usually Alif) and slot -1 (Rawi), slot -2 is Dakhil (consonant)
    newSlots.forEach((s, idx) => {
      if (idx === len - 1) {
        s.state = 'locked'; // Rawi
      } else if (idx === len - 2) {
        s.state = 'consonant'; // Harf-e-Dakhil
      } else if (idx === len - 3) {
        s.state = 'locked'; // Harf-e-Tasees (Alif)
      } else {
        s.state = 'any';
      }
    });
  }

  return newSlots;
}
