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
} from './meterRepairEngine';
import { FOOT_NAMES } from '../data/prosodyMeters';

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
  pinnedPattern?: string
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
        ? opt.rules.map(readingRuleLabel)
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
    // Check if we already have this exact pattern without vocalization; if only one record exists, update it
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
  };
}

/**
 * Re-evaluates scansion and diagnostic report when the poet has explicitly pinned
 * specific readings (patterns) on one or more words in the line.
 */
export function evaluateWithPinnedReadings(
  line: string,
  baseScansion: ScansionResult,
  baseReport: MeterDiagnosticReport,
  pinnedPatterns: Record<number, string>,
  preferredMeterId?: string
): { scansion: ScansionResult; report: MeterDiagnosticReport } {
  const pinnedIndices = Object.keys(pinnedPatterns)
    .map(Number)
    .filter((idx) => Boolean(pinnedPatterns[idx]));

  if (pinnedIndices.length === 0 || !line.trim()) {
    return { scansion: baseScansion, report: baseReport };
  }

  const words = scanPronouncedWords(line);
  if (!words.length) {
    return { scansion: baseScansion, report: baseReport };
  }

  // Constrain pinned words to their chosen pattern
  const constrainedWords: ScannedWord[] = words.map((w, idx) => {
    const pinned = pinnedPatterns[idx];
    if (!pinned || !w.variants.includes(pinned)) return w;
    const matchingOptions = w.options.filter((o) => o.pattern === pinned);
    return {
      ...w,
      variants: [pinned],
      options: matchingOptions.length ? matchingOptions : w.options,
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

  const meters = preferredMeterId
    ? CLASSICAL_BUHUR.filter((m) => m.id === preferredMeterId)
    : CLASSICAL_BUHUR;
  const candidates = meters.map((meter) => ({ meter, scan: scanMeterConstrained(meter) }));
  let chosen = candidates[0];
  if (!preferredMeterId && !candidates.some((c) => c.scan.distance === 0)) {
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
    !preferredMeterId &&
    scan.distance > 0 &&
    !scan.uncertainWords.length &&
    scan.target.startsWith(scan.pattern);

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
      isPrefix,
      isCompliant: isMatched,
      meterId: meter.id,
      meterNameUrdu: meter.nameUrdu,
      meterNameEnglish: meter.nameEnglish,
      targetPattern: scan.target,
      actualPattern: scan.pattern,
      wordSpans,
    },
  };
}
