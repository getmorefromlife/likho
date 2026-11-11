/** Deterministic, evidence-bounded repair. Every edit is rescanned against one fixed meter. */
import { ClassicalMeterDef, scanAgainstMeter, scanMeter, selectMeterAnalysis, patternToClassicalRukn } from './aroozEngine';
import { URDU_THESAURUS } from '../data/urduThesaurus';
import { normalizeUrduChars, stripDiacritics } from './unicodeNormalizer';
import { compareRhymeWords } from './qafiyaEngine';
export interface WordSyllableSpan {
  wordIndex: number;
  word: string;
  normalizedWord: string;
  charStart: number;
  charEnd: number;
  syllables: string; // e.g. "- =" or "="
  syllableStartIdx: number;
  readingRules: string[];
  sourceIds: string[];
  pronunciation: string;
  source: string;
  syllableEndIdx: number; // exclusive
}

export type DefectType = 'weight_mismatch' | 'extra_syllable' | 'missing_syllable';

export interface SyllableDefect {
  id: string;
  type: DefectType;
  syllableIndex: number;
  wordIndex: number;
  word: string;
  expected: string; // '-' or '='
  actual: string; // '-' or '=' or 'زائد' or 'ساقط'
  ruknName: string; // e.g. "فاعلاتن"
  ruknIndex: number;
  descriptionUrdu: string;
}

export type RepairCategory = 'poetic_license' | 'synonym' | 'particle' | 'transposition';

export interface RepairSuggestion {
  id: string;
  titleUrdu: string;
  category: RepairCategory;
  originalWord: string;
  replacementWord: string;
  repairedLine: string;
  explanationUrdu: string;
  beforeDistance: number;
  afterDistance: number;
  isExact: boolean;
  preservesRhyme?: boolean;
  cautionUrdu?: string;
  impactPreview: string; // e.g. "=-== -> =-=="
}

export interface RepairContextOptions {
  /** Active radif string (single or multi-word) that must not be broken at the end of a rhyming line */
  radif?: string;
  /** Reference qafiya word from the matla/poem to verify rhyme preservation on the qafiya slot */
  rhymeAnchorWord?: string;
}

export interface MeterDiagnosticReport {
  meterNotes: string[];
  uncertainWords: string[];
  distance: number;
  targetIsExplicit: boolean;
  isPrefix: boolean;
  isCompliant: boolean;
  meterId: string;
  meterNameUrdu: string;
  meterNameEnglish: string;
  targetPattern: string; // e.g. "=-====-====-====-="
  actualPattern: string; // e.g. "=-=====-===-====-="
  wordSpans: WordSyllableSpan[];
  defects: SyllableDefect[];
  suggestions: RepairSuggestion[];
}

interface AlignmentOp {
  type: 'match' | 'mismatch' | 'insert' | 'delete';
  targetSym: string; // from meter
  actualSym: string; // from user's line
  targetIdx: number;
  actualIdx: number;
}

export function alignSyllablePatterns(target: string, actual: string): AlignmentOp[] {
  const m = target.length;
  const n = actual.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i * -1;
  for (let j = 0; j <= n; j++) dp[0][j] = j * -1;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore = target[i - 1] === actual[j - 1] ? 0 : -1;
      dp[i][j] = Math.max(
        dp[i - 1][j - 1] + matchScore, // substitution
        dp[i - 1][j] - 1, // deletion from target (missing in actual)
        dp[i][j - 1] - 1 // insertion into actual (extra in actual)
      );
    }
  }

  const ops: AlignmentOp[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (target[i - 1] === actual[j - 1] ? 0 : -1)) {
      ops.push({
        type: target[i - 1] === actual[j - 1] ? 'match' : 'mismatch',
        targetSym: target[i - 1],
        actualSym: actual[j - 1],
        targetIdx: i - 1,
        actualIdx: j - 1,
      });
      i--;
      j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] - 1) {
      ops.push({
        type: 'insert',
        targetSym: '',
        actualSym: actual[j - 1],
        targetIdx: i,
        actualIdx: j - 1,
      });
      j--;
    } else if (i > 0) {
      ops.push({
        type: 'delete',
        targetSym: target[i - 1],
        actualSym: '',
        targetIdx: i - 1,
        actualIdx: j,
      });
      i--;
    } else {
      break;
    }
  }

  return ops.reverse();
}

/**
 * Finds which Rukn (foot) and relative index a syllable belongs to in a meter
 */
function findRuknInfo(targetSyllableIdx: number, meter: ClassicalMeterDef): { ruknName: string; ruknIndex: number } {
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
    ruknIndex: meter.afailList.length - 1,
  };
}


function normalize(word: string) { return normalizeUrduChars(stripDiacritics(word)); }

export function identifyTargetMeter(line: string, preferredMeterId?: string): ClassicalMeterDef {
  return selectMeterAnalysis(line, preferredMeterId).meter;
}

function spansFromScan(scan: ReturnType<typeof scanAgainstMeter>): WordSyllableSpan[] {
  let cursor = 0;
  return scan.words.map((word, index) => {
    const syllables = scan.readings[index];
    const span = { wordIndex: index, word: word.word, normalizedWord: normalize(word.word),
      charStart: word.charStart, charEnd: word.charEnd, syllables,
      readingRules: scan.selectedOptions[index]?.rules || [],
      sourceIds: scan.selectedOptions[index]?.sourceIds || [],
      pronunciation: scan.selectedOptions[index]?.pronunciation || '', source: word.source,
      syllableStartIdx: cursor, syllableEndIdx: cursor + syllables.length };
    cursor += syllables.length;
    return span;
  });
}

export function extractWordSpans(line: string, target = ''): WordSyllableSpan[] {
  return spansFromScan(scanAgainstMeter(line, target));
}

// Attested spelling alternatives; these change text, never silently change pronunciation.
const SPELLING_ALTERNATIVES: Record<string, string[]> = {
  'میرا': ['مرا'], 'مرا': ['میرا'], 'میری': ['مری'], 'مری': ['میری'],
  'میرے': ['مرے'], 'مرے': ['میرے'], 'تیرا': ['ترا'], 'ترا': ['تیرا'],
  'تیری': ['تری'], 'تری': ['تیری'], 'تیرے': ['ترے'], 'ترے': ['تیرے'],
  'جہان': ['جہاں'], 'جہاں': ['جہان'], 'آسمان': ['آسماں'], 'آسماں': ['آسمان'],
  'گمان': ['گماں'], 'گماں': ['گمان'], 'زبان': ['زباں'], 'زباں': ['زبان'],
  'بیان': ['بیاں'], 'بیاں': ['بیان'], 'نشان': ['نشاں'], 'نشاں': ['نشان'],
  'مکان': ['مکاں'], 'مکاں': ['مکان'], 'داستان': ['داستاں'], 'داستاں': ['داستان'],
  'خزاں': ['خزان'], 'خزان': ['خزاں'], 'کاروان': ['کارواں'], 'کارواں': ['کاروان'],
};

const POSTPOSITIONS_AND_PARTICLES = new Set([
  'نے', 'کو', 'سے', 'پر', 'پہ', 'میں', 'کا', 'کی', 'کے', 'تک', 'بھی', 'ہی', 'تو',
]);

const CLAUSE_OPENERS_AND_CONJUNCTIONS = new Set([
  'کہ', 'نہ', 'مگر', 'لیکن', 'گر', 'اگر', 'ورنہ', 'تاکہ', 'چونکہ', 'کیونکہ', 'بلکہ', 'اور', 'و',
]);

const AUXILIARY_TAIL_VERBS = new Set([
  'ہے', 'ہیں', 'تھا', 'تھی', 'تھے', 'تھیں', 'ہو', 'ہوں', 'گا', 'گی', 'گے',
]);

function isExplicitIzafatToken(rawWord: string): boolean {
  const nfc = rawWord.normalize('NFC');
  return /[ۂۀ]$/u.test(nfc) || /ہ[ٔء]$/u.test(nfc) || /[یے][ٔء]$/u.test(nfc) || nfc.endsWith('ِ');
}

function isGrammaticallyValidTransposition(
  spans: WordSyllableSpan[],
  index: number
): boolean {
  const a = spans[index];
  const b = spans[index + 1];
  const wordA = a.normalizedWord;
  const wordB = b.normalizedWord;

  // 1. Never break an explicit izafat chain (مضاف + مضاف الیہ) or conjunctive 'و'
  if (isExplicitIzafatToken(a.word) || isExplicitIzafatToken(b.word)) return false;
  if (wordA === 'و' || wordB === 'و') return false;

  // 2. Never invert a noun/pronoun with its governed postposition or enclitic particle
  //    (e.g., "دل میں" -> "میں دل", "اس نے" -> "نے اس", "اس کو" -> "کو اس")
  if (POSTPOSITIONS_AND_PARTICLES.has(wordB) || POSTPOSITIONS_AND_PARTICLES.has(wordA)) {
    return false;
  }

  // 3. Never invert clause openers / negations (e.g., "نہ دل" -> "دل نہ", "کہ دل" -> "دل کہ")
  if (CLAUSE_OPENERS_AND_CONJUNCTIONS.has(wordA) || CLAUSE_OPENERS_AND_CONJUNCTIONS.has(wordB)) {
    return false;
  }

  // 4. Never displace a line-final copula/auxiliary with its preceding predicate
  if (index + 1 === spans.length - 1 && AUXILIARY_TAIL_VERBS.has(wordB)) {
    return false;
  }

  return true;
}

const CATEGORY_RANK: Record<RepairCategory, number> = {
  poetic_license: 0,
  synonym: 1,
  particle: 2,
  transposition: 3,
};

export function diagnoseAndRepairMeter(
  line: string,
  preferredMeterId?: string,
  context?: RepairContextOptions
): MeterDiagnosticReport {
  const meter = identifyTargetMeter(line, preferredMeterId);
  const scan = scanMeter(line, meter);
  const spans = spansFromScan(scan);
  const target = scan.target;
  const isPrefix = !!scan.pattern && scan.pattern.length < target.length && target.startsWith(scan.pattern);
  const report: MeterDiagnosticReport = {
    isCompliant: !!scan.pattern && scan.distance === 0 && !scan.uncertainWords.length,
    meterId: meter.id, meterNameUrdu: meter.nameUrdu, meterNameEnglish: meter.nameEnglish,
    targetPattern: target, actualPattern: scan.pattern, wordSpans: spans, defects: [], suggestions: [],
    meterNotes: scan.notes, uncertainWords: scan.uncertainWords, distance: scan.distance, targetIsExplicit: !!preferredMeterId, isPrefix,
  };
  if (!scan.pattern || report.isCompliant || (!preferredMeterId && isPrefix)) return report;
  const ops = alignSyllablePatterns(target, scan.pattern);
  for (const [index, op] of ops.entries()) {
    if (op.type === 'match') continue;
    const span = spans.find(w => op.actualIdx >= w.syllableStartIdx && op.actualIdx < w.syllableEndIdx) || spans.at(-1)!;
    const foot = findRuknInfo(op.targetIdx, scan.resolvedMeter);
    const type = op.type === 'insert' ? 'extra_syllable' : op.type === 'delete' ? 'missing_syllable' : 'weight_mismatch';
    report.defects.push({ id: `defect-${index}`, type, syllableIndex: op.actualIdx,
      wordIndex: span.wordIndex, word: span.word, expected: op.targetSym || '—', actual: op.actualSym || '—',
      ...foot, descriptionUrdu: type === 'extra_syllable' ? 'مطلوبہ وزن کے مقابلے میں زائد ہجا۔'
        : type === 'missing_syllable' ? 'اس مقام پر مطلوبہ وزن کا ہجا موجود نہیں۔' : 'اس مقام پر ہجے کا وزن مختلف ہے۔' });
  }
  // Never advertise a repair whose input pronunciation depends on generated guesses.
  if (scan.uncertainWords.length || spans.length > 64) return report;

  // Identify protected Radif and Qafiya word indices when context is available
  const radifTokens = context?.radif
    ? context.radif.trim().split(/\s+/u).map(normalize).filter(Boolean)
    : [];
  let protectedRadifStartIdx = spans.length;
  if (radifTokens.length > 0 && spans.length > radifTokens.length) {
    const tailMatches = radifTokens.every(
      (tok, idx) => spans[spans.length - radifTokens.length + idx]?.normalizedWord === tok
    );
    if (tailMatches) {
      protectedRadifStartIdx = spans.length - radifTokens.length;
    }
  }
  const qafiyaSlotIdx =
    protectedRadifStartIdx < spans.length
      ? protectedRadifStartIdx - 1
      : context?.rhymeAnchorWord
      ? spans.length - 1
      : -1;

  const seen = new Set<string>([line]);
  function offer(
    start: number,
    end: number,
    replacement: string,
    category: RepairCategory,
    original: string,
    touchesQafiyaSlot = false
  ) {
    // Reject multi-word thesaurus glosses (e.g. "عہد نبھانا") for single-word replacements unless they preserve rhyme/idiom cleanly
    if (category === 'synonym' && /\s/u.test(replacement.trim())) return;

    const repairedLine = line.slice(0, start) + replacement + line.slice(end);
    if (seen.has(repairedLine)) return;
    seen.add(repairedLine);
    const rescanned = scanMeter(repairedLine, meter);
    if (rescanned.uncertainWords.length || rescanned.distance >= scan.distance) return;

    let preservesRhyme: boolean | undefined;
    let cautionUrdu: string | undefined;

    if (touchesQafiyaSlot && context?.rhymeAnchorWord) {
      const candidateToken = replacement.trim().split(/\s+/u).at(-1) || replacement;
      const rhymeCheck = compareRhymeWords(context.rhymeAnchorWord, candidateToken);
      if (!rhymeCheck.matches) {
        // Do not offer a replacement on the Qafiya slot that breaks the poem's established rhyme
        return;
      }
      preservesRhyme = true;
    }

    if (category === 'transposition') {
      cautionUrdu = 'الفاظ کی ترتیب بدلی گئی ہے؛ جملے کی روانی اور معنی کی جانچ فرمائیں۔';
    } else if (category === 'synonym') {
      cautionUrdu = 'مترادف لفظ تجویز کیا گیا ہے؛ سیاق و سباق اور محاورے کی موزونیت دیکھ لیں۔';
    }

    report.suggestions.push({
      id: `repair-${start}-${end}-${replacement}`,
      titleUrdu: `${original} ← ${replacement || 'حذف'}`,
      category,
      originalWord: original,
      replacementWord: replacement,
      repairedLine,
      beforeDistance: scan.distance,
      afterDistance: rescanned.distance,
      isExact: rescanned.distance === 0,
      preservesRhyme,
      cautionUrdu,
      explanationUrdu: rescanned.distance === 0
        ? 'درج تلفظ اور جائز قرأت کے مطابق وزن مکمل ہوتا ہے۔ معنی اور محاورہ کی جانچ فرمائیں۔'
        : 'وزنی فرق کم ہوتا ہے؛ مزید اصلاح درکار ہے۔ معنی اور محاورہ کی جانچ فرمائیں۔',
      impactPreview: `${scan.distance} → ${rescanned.distance}`,
    });
  }

  for (const span of spans) {
    // Never mutate the poem's established Radif tokens
    if (span.wordIndex >= protectedRadifStartIdx) continue;
    const isQafiyaSlot = span.wordIndex === qafiyaSlotIdx;
    const word = span.normalizedWord;
    for (const alternative of SPELLING_ALTERNATIVES[word] || []) {
      offer(span.charStart, span.charEnd, alternative, 'poetic_license', span.word, isQafiyaSlot);
    }
    // Direct lexical relations only; reverse synonym chains do not imply equivalence.
    for (const synonym of URDU_THESAURUS[word]?.synonyms || []) {
      offer(span.charStart, span.charEnd, synonym, 'synonym', span.word, isQafiyaSlot);
    }
  }
  for (let i = 0; i < spans.length - 1; i++) {
    // Never transpose words inside or across the protected Radif / Qafiya boundary
    if (i + 1 >= protectedRadifStartIdx) continue;
    if (i === qafiyaSlotIdx || i + 1 === qafiyaSlotIdx) continue;
    const a = spans[i], b = spans[i + 1];
    if (!/^\s+$/u.test(line.slice(a.charEnd, b.charStart))) continue;
    if (!isGrammaticallyValidTransposition(spans, i)) continue;
    offer(
      a.charStart,
      b.charEnd,
      b.word + line.slice(a.charEnd, b.charStart) + a.word,
      'transposition',
      line.slice(a.charStart, b.charEnd)
    );
  }
  report.suggestions.sort(
    (a, b) =>
      a.afterDistance - b.afterDistance ||
      CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category] ||
      a.id.localeCompare(b.id, 'en')
  );
  report.suggestions = report.suggestions.slice(0, 8);
  return report;
}
