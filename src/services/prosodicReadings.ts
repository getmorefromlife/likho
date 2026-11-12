import { AroozLexiconService, expandFlexiblePattern, normalizeLexiconKey } from './aroozLexiconService';
import { parsePronunciation, pronunciationLetters } from './urduPhonology';

export interface ReadingOption {
  pattern: string;
  rules: string[];
  sourceIds: string[];
  pronunciation: string;
  terminalOverlong?: boolean;
}
export interface ScannedWord {
  word: string;
  charStart: number;
  charEnd: number;
  variants: string[];
  options: ReadingOption[];
  source: 'dictionary' | 'vocalized' | 'user-entry' | 'reviewed-entry' | 'unresolved';
  reason?: string;
}
const SHORT_WORDS = new Set(['کہ', 'نہ', 'بہ', 'پہ']);
const FLEXIBLE_MONOSYLLABLES = new Set(['بھی','تو','تھا','تھی','تھے','تھیں','جو','دو','سا','سے','سی','سو','کا','کے','کی','کو','میں','نے','وہ','یہ','ہو','ہوں','ہی','ہے','ہیں','یوں']);
const FIXED_MONOSYLLABLES = new Set(['تا', 'گو', 'یا', 'جا', 'لا', 'پا', 'کھا', 'آ', 'اے', 'کیا', 'کیوں', 'جوں']);
const SOURCE_RULES = new Set(['dictionary-exception', 'final-vowel-flexibility', 'monosyllable-flexibility', 'izafat-consonant', 'izafat-vowel', 'izafat-yeh', 'word-grafting', 'conjunction-o', 'terminal-pause', 'arabic-article', 'nasal-spelling', 'polite-verb-ending', 'verb-e-ending', 'izafat-shadda', 'user-reviewed']);
export const PROSODY_RULE_LABELS: Record<string, string> = {
  'user-reviewed': 'صارف کا مصدقہ وزن (برائے خودکار تقطیع و اصلاح)',
  'dictionary-exception': 'لغت میں درج متبادل قرأت',
  'polite-verb-ending': 'مصدر کے معروف ربط کے ساتھ یے کی صوتی تشکیل',
  'verb-e-ending': 'مصدر کے معروف ربط کے ساتھ ے کی صوتی تشکیل',
  'izafat-shadda': 'اضافت سے پہلے مستعمل تشدید',
  'arabic-article': 'عربی ال کے ساتھ ترکیب', 'nasal-spelling': 'نونِ غنہ کا صریح املا',
  'final-vowel-flexibility': 'لفظ کے آخری مصوتے کی جائز تخفیف',
  'monosyllable-flexibility': 'یک ہجائی لفظ کی جائز تخفیف',
  'izafat-consonant': 'حرفِ صحیح کے ساتھ اضافت', 'izafat-vowel': 'مصوتے کے بعد اضافت',
  'izafat-yeh': 'یائے آخر کے ساتھ اضافت', 'word-grafting': 'وصلِ الف',
  'conjunction-o': 'واؤِ عطف کے ساتھ وصل', 'terminal-pause': 'مصرع کے آخر میں وقف',
};
export function readingRuleLabel(rule: string): string { return PROSODY_RULE_LABELS[rule] || rule; }

function markedReadingMatches(raw: string, vocalized: string): boolean {
  const input = pronunciationLetters(raw), recorded = pronunciationLetters(vocalized);
  if (input.length !== recorded.length) return false;
  return input.every((letter, i) => letter.base === recorded[i].base &&
    [...letter.marks].filter(m => /[َُِّْٰ]/u.test(m)).every(mark => recorded[i].marks.includes(mark)));
}
function flexibleEnding(word: string, pattern: string, language: string): boolean {
  if (!pattern.endsWith('=') || FIXED_MONOSYLLABLES.has(word)) return false;
  if (FLEXIBLE_MONOSYLLABLES.has(word)) return true;
  if (pattern.length === 1) return false;
  if (/[یےہ]$/u.test(word)) return true;
  return /[او]$/u.test(word) && /ہندی|سنسکرت|پراکرت|پنجابی/u.test(language);
}
interface Izafat { base: string; type: 'consonant' | 'vowel' | 'yeh' }
function separateIzafat(word: string): Izafat | null {
  // Work on original letters: the generic normalizer expands ۂ and would erase this evidence.
  const raw = word.normalize('NFC');
  if (/[ۂۀ]$/u.test(raw)) return { base: raw.slice(0, -1) + 'ہ', type: 'consonant' };
  if (/ہ[ٔء]$/u.test(raw)) return { base: raw.slice(0, -1), type: 'consonant' };
  if (/[یے][ٔء]$/u.test(raw)) return { base: raw.slice(0, -1), type: 'yeh' };
  if (raw.endsWith('ِ')) {
    const base = raw.slice(0, -1);
    const clean = normalizeLexiconKey(base);
    return { base, type: /[او]$/u.test(clean) ? 'vowel' : /[یے]$/u.test(clean) ? 'yeh' : 'consonant' };
  }
  const match = raw.match(/^(.*[او])(?:ئے|ۓ|ۓ)$/u);
  if (match && normalizeLexiconKey(match[1]).length > 1 && AroozLexiconService.hasWord(match[1])) return { base: match[1], type: 'vowel' };
  return null;
}

function lexicalOptions(raw: string): { options: ReadingOption[]; source: ScannedWord['source']; reason?: string } {
  const key = normalizeLexiconKey(raw);
  const hasMarks = /[\u064b-\u0652\u0670]/u.test(raw);
  let records = AroozLexiconService.getLexicalReadings(key);
  let nasalContraction = false;
  if (!records.length && key.endsWith('ں')) {
    records = AroozLexiconService.getLexicalReadings(key.slice(0, -1) + 'ن').filter(r => r.pattern.endsWith('=-'));
    nasalContraction = records.length > 0;
  }
  const options: ReadingOption[] = [];
  if (records[0]?.source === 'user-entry' || records[0]?.source === 'reviewed-entry') {
    return {
      source: records[0].source,
      options: records.map(r => ({
        pattern: r.pattern,
        rules: records[0].source === 'reviewed-entry' ? ['user-reviewed'] : [],
        sourceIds: [r.sourceId],
        pronunciation: r.vocalized || r.divisions || ''
      }))
    };
  }
  // The handbook explicitly specifies these grammatical monosyllables.
  if (!hasMarks && (FLEXIBLE_MONOSYLLABLES.has(key) || SHORT_WORDS.has(key))) return {
    source: 'dictionary', options: [{ pattern: SHORT_WORDS.has(key) ? '-' : 'x',
      rules: SHORT_WORDS.has(key) ? [] : ['monosyllable-flexibility'],
      sourceIds: ['handbook:2.1:' + key], pronunciation: records[0]?.vocalized || key }],
  };
  // Explicit short vowels, sukun, tashdid and madda participate in parsing, never disappear.
  if (hasMarks) {
    const explicit = parsePronunciation(raw);
    if (!explicit.error) {
      const flexible = !['جَو','مَے','نَے','رُو','سُو'].includes(raw.normalize('NFC')) && flexibleEnding(key, explicit.pattern, records[0]?.language || '');
      return { options: [{ pattern: flexible ? explicit.pattern.slice(0, -1) + 'x' : explicit.pattern,
        rules: flexible ? ['final-vowel-flexibility'] : [], sourceIds: ['input:vocalization'], pronunciation: raw,
        terminalOverlong: explicit.syllables.at(-1)?.pattern === '=-' }], source: 'vocalized' };
    }
  }
  if (!records.length && /^[اٱ]ل/u.test(key) && key.length > 3) {
    const articleBase = lexicalOptions(raw.replace(/^[اٱ]ل/u, ''));
    if (articleBase.source === 'dictionary') return { source: 'dictionary', options: articleBase.options.map(option =>
      ({ ...option, pattern: '=' + option.pattern, rules: [...option.rules, 'arabic-article'] })) };
  }
  if (!records.length && !hasMarks) {
    const polite = key.match(/^(..+?)(?:یئے|یے|ئے)$/u);
    const eEnding = key.match(/^(..+?)ے$/u);
    const stem = polite?.[1] || eEnding?.[1];
    if (stem && AroozLexiconService.hasWord(stem + 'نا')) {
      const root = AroozLexiconService.getLexicalReadings(stem).filter(r => r.pattern.endsWith('=-') && r.source === 'dictionary');
      if (root.length) return { source: 'dictionary', options: root.map(record => ({
        pattern: polite ? record.pattern + 'x' : record.pattern.slice(0, -1) + 'x',
        rules: [polite ? 'polite-verb-ending' : 'verb-e-ending'],
        sourceIds: [record.sourceId, ...AroozLexiconService.getLexicalReadings(stem + 'نا').map(r => r.sourceId)],
        pronunciation: polite ? stem + 'ِیے' : stem + 'ے',
      })) };
    }
  }
  for (const record of records) {
    if (hasMarks && (!record.vocalized || !markedReadingMatches(raw, record.vocalized))) continue;
    let pattern = nasalContraction ? record.pattern.slice(0, -1) : record.pattern;
    const rules: string[] = record.sourceId.includes('exception') ? ['dictionary-exception'] : [];
    if (nasalContraction) rules.push('nasal-spelling');
    if (SHORT_WORDS.has(key)) pattern = '-';
    else if (!nasalContraction && flexibleEnding(key, pattern, record.language)) {
      pattern = pattern.slice(0, -1) + 'x';
      rules.push(pattern.length === 1 ? 'monosyllable-flexibility' : 'final-vowel-flexibility');
    }
    options.push({ pattern, rules, sourceIds: [record.sourceId], pronunciation: record.vocalized || record.divisions,
      terminalOverlong: !nasalContraction && pattern.endsWith('=-') && /[^اویےںہ]$/u.test(key) });
  }
  return { options, source: options.length ? records[0].source : 'unresolved',
    reason: options.length ? undefined : hasMarks ? 'نامکمل یا لغت سے مختلف اعراب' : 'مستند تلفظ کا اندراج موجود نہیں' };
}
function baseOptions(raw: string) {
  const izafat = separateIzafat(raw);
  if (!izafat) return lexicalOptions(raw);
  const base = lexicalOptions(izafat.base);
  const options: ReadingOption[] = [];
  for (const option of base.options) {
    // Expand before redivision; unshortened base is mandatory for vowel + izafat.
    const pattern = option.pattern.replace(/x/g, '=');
    const tail = pattern.at(-1);
    if (!tail) continue;
    let transformed: string;
    if (izafat.type === 'vowel') transformed = pattern + 'x';
    else if (izafat.type === 'yeh') transformed = pattern.slice(0, -1) + '-x';
    else transformed = tail === '-' ? pattern.slice(0, -1) + 'x' : pattern.slice(0, -1) + '-x';
    options.push({ ...option, pattern: transformed, terminalOverlong: false, rules: [...option.rules.filter(r => !['final-vowel-flexibility','monosyllable-flexibility'].includes(r)), `izafat-${izafat.type}`] });
    if (izafat.type === 'consonant' && ['فن', 'خط'].includes(normalizeLexiconKey(izafat.base)) && pattern === '=') {
      options.push({ ...option, pattern: '=x', terminalOverlong: false, rules: [...option.rules, 'izafat-shadda'] });
    }
    if (izafat.type === 'yeh') options.push({ ...option, pattern: pattern + '-', terminalOverlong: false, rules: [...option.rules.filter(r => !['final-vowel-flexibility','monosyllable-flexibility'].includes(r)), 'izafat-vowel'] });
  }
  return { ...base, options };
}

const wordCache = new Map<string, ScannedWord[]>();
let dictionaryRevision = -1;
export function scanPronouncedWords(line: string): ScannedWord[] {
  if (dictionaryRevision !== AroozLexiconService.getRevision()) { wordCache.clear(); dictionaryRevision = AroozLexiconService.getRevision(); }
  const cached = wordCache.get(line);
  if (cached) return cached;
  const tokens = [...line.matchAll(/[\p{L}\p{M}\u200b-\u200f\u2060\ufeff]+/gu)].filter(m => /\p{L}/u.test(m[0]));
  const preliminary = tokens.map(match => ({ word: match[0], charStart: match.index!, charEnd: match.index! + match[0].length, ...baseOptions(match[0]) }));
  const result: ScannedWord[] = preliminary.map((word, index) => {
    const key = normalizeLexiconKey(word.word);
    let options = word.options;
    const next = preliminary[index + 1];
    const nextKey = next ? normalizeLexiconKey(next.word) : '';
    const connected = next && /^\s+$/u.test(line.slice(word.charEnd, next.charStart));
    const consonantEnding = !/[اویےں]$/u.test(key);
    if (key === 'و' && index > 0 && /^\s+$/u.test(line.slice(preliminary[index - 1].charEnd, word.charStart))) {
      options = [{ pattern: 'x', rules: ['conjunction-o'], sourceIds: ['handbook:3.3'], pronunciation: 'و' }];
    }
    if (connected && nextKey === 'و' && options.length) {
      options = options.flatMap(option => {
        const pattern = option.pattern.replace(/x$/u, '=');
        if (/[ا]$/u.test(key)) return [{ ...option, pattern, rules: [...option.rules, 'conjunction-o'] }];
        if (/[ی]$/u.test(key)) return [
          { ...option, pattern, rules: [...option.rules, 'conjunction-o'] },
          { ...option, pattern: pattern.slice(0, -1) + '-', rules: [...option.rules, 'conjunction-o'] },
        ];
        if (pattern.endsWith('-') && !option.terminalOverlong) return [option];
        const changed = pattern.endsWith('-') ? pattern.slice(0, -1) : pattern.slice(0, -1) + '-';
        return [{ ...option, pattern: changed, rules: [...option.rules, 'conjunction-o'] }];
      });
    } else if (connected && consonantEnding && /^[اآ]/u.test(nextKey) && next.options.length) {
      options = options.flatMap(option => {
        if (!/[-=]$/u.test(option.pattern) || (option.pattern.endsWith('-') && !option.terminalOverlong)) return [option];
        const pattern = option.pattern.endsWith('-') ? option.pattern.slice(0, -1) : option.pattern.slice(0, -1) + '-';
        return [option, { ...option, pattern, rules: [...option.rules, 'word-grafting'] }];
      });
    }
    const concrete: ReadingOption[] = [];
    for (const option of options) {
      for (const pattern of expandFlexiblePattern(option.pattern)) {
        if (pattern.includes('---')) continue;
        concrete.push({ ...option, pattern, rules: option.rules.filter(r => SOURCE_RULES.has(r) &&
          (!['final-vowel-flexibility','monosyllable-flexibility'].includes(r) || [...option.pattern].some((symbol, i) => symbol === 'x' && pattern[i] === '-'))) });

      }
    }
    const seen = new Set<string>();
    const unique = concrete.filter(option => { if (seen.has(option.pattern)) return false; seen.add(option.pattern); return true; });
    return { ...word, source: unique.length ? word.source : 'unresolved', options: unique,
      variants: unique.length ? unique.map(o => o.pattern) : [''] };
  });
  if (wordCache.size >= 512) wordCache.clear();
  wordCache.set(line, result);
  return result;
}
