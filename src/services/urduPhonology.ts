/** Pronunciation parser. Orthographic guesses never become dictionary evidence. */
export interface PhonologyResult {
  pattern: string;
  syllables: { text: string; shape: string; pattern: string }[];
  error?: string;
}
const SHORT: Record<string, string> = { 'َ': 'a', 'ِ': 'i', 'ُ': 'u' };
const ASPIRATABLE = 'بپتٹجچدڈڑکگنل';
interface Letter { base: string; marks: string; text: string }
interface Phone { kind: 'C' | 'V'; long?: boolean; text: string }

/** Preserves vowel marks and hamza; never run stripDiacritics before this parser. */
export function pronunciationLetters(raw: string): Letter[] {
  return [...raw.normalize('NFC').replace(/ك/g, 'ک').replace(/[يى]/g, 'ی').replace(/ه/g, 'ہ')
    .replace(/[\u200b-\u200f\u2060\ufeffـ]/g, '').matchAll(/([^\p{M}\s])([\p{M}]*)/gu)]
    .map(m => ({ base: m[1], marks: m[2], text: m[0] }));
}

/** Dictionary chunks supply a syllable onset; arbitrary unvocalized input does not. */
export function parsePronunciation(raw: string, dictionaryChunk = false): PhonologyResult {
  const fail = (error: string): PhonologyResult => ({ pattern: '', syllables: [], error });
  const letters = pronunciationLetters(raw);
  if (letters.at(-1)?.base === 'ا' && letters.at(-1)?.marks.includes('ً') && letters.length > 1) {
    letters.pop(); letters[letters.length - 1].marks += 'ً';
  }
  if (letters.at(-1)?.base === 'ا' && !letters.at(-1)?.marks && letters.at(-2)?.marks.includes('ً')) letters.pop();
  if (!letters.length) return fail('empty-pronunciation');
  const phones: Phone[] = [];
  for (let i = 0; i < letters.length; i++) {
    const { base, marks, text } = letters[i];
    if (!/^[\u0621-\u063a\u0641-\u064a\u066e-\u06d3]$/u.test(base)) return fail('unsupported-letter');
    if (base === 'ں') {
      if (!phones.some(p => p.kind === 'V')) return fail('nasal-without-vowel');
      continue;
    }
    if (base === 'ھ') {
      if (i > 0 && ASPIRATABLE.includes(letters[i - 1].base)) continue;
      return fail('aspirate-without-onset');
    }
    if (base === 'آ') { phones.push({ kind: 'C', text: '' }, { kind: 'V', long: true, text }); continue; }
    const tanwin = [...marks].find(m => /[ًٌٍ]/u.test(m));
    if (tanwin && i !== letters.length - 1) return fail('nonterminal-tanwin');
    const vowels = [...marks].filter(m => SHORT[m]);
    if (tanwin) vowels.push(({ 'ً': 'َ', 'ٍ': 'ِ', 'ٌ': 'ُ' } as Record<string, string>)[tanwin]);
    if (vowels.length > 1 || (vowels.length && marks.includes('ْ'))) return fail('conflicting-vowel-marks');
    const vowel = vowels[0];
    const initialAlif = i === 0 && /[اأإٱ]/u.test(base);
    if (marks.includes('ّ')) {
      if (initialAlif || !phones.some(p => p.kind === 'V')) return fail('invalid-shadda');
      phones.push({ kind: 'C', text: base });
    }
    if (!initialAlif) phones.push({ kind: 'C', text: base });
    let nextIndex = i + 1;
    if (letters[nextIndex]?.base === 'ھ' && ASPIRATABLE.includes(base)) nextIndex++;
    const next = letters[nextIndex];
    const carrier = next && /^[اویے]$/u.test(next.base) && !/[َُِّ]/u.test(next.marks) &&
      !(/^[وی]$/u.test(next.base) && letters[nextIndex + 1]?.base === 'ا');
    // A carrier has a matching short vowel or an unmarked consonantal onset.
    const canLengthen = carrier && !marks.includes('ْ') && (!vowel ||
      (vowel === 'َ' && /^[اویے]$/u.test(next.base)) || (vowel === 'ِ' && next.base === 'ی') ||
      (vowel === 'ُ' && next.base === 'و'));
    if (!dictionaryChunk && !canLengthen && !vowel && !initialAlif && !marks.includes('ْ') && !marks.includes('ٰ') && i < letters.length - 1) return fail('unmarked-medial-consonant');
    if (canLengthen) {
      phones.push({ kind: 'V', long: true, text: (vowel || '') + next.text });
      i = nextIndex;
    } else if (marks.includes('ٰ')) {
      phones.push({ kind: 'V', long: true, text: 'ٰ' });
    } else if (vowel) {
      phones.push({ kind: 'V', long: false, text: vowel });
    } else if (initialAlif) {
      if (dictionaryChunk) phones.push({ kind: 'V', long: false, text });
      else return fail('unmarked-initial-vowel');
    } else if (base === 'ے' && i === 0) {
      phones.pop(); phones.push({ kind: 'V', long: true, text });
    } else if (!marks.includes('ْ') && !phones.some(p => p.kind === 'V')) {
      if (dictionaryChunk) phones.push({ kind: 'V', long: false, text: '' });
      else return fail('unmarked-onset-vowel');
    }
    if (tanwin) phones.push({ kind: 'C', text: 'ن' });
  }
  const nuclei = phones.map((p, i) => p.kind === 'V' ? i : -1).filter(i => i >= 0);
  if (!nuclei.length) return fail('no-vowel');
  const syllables: PhonologyResult['syllables'] = [];
  let cursor = 0;
  for (let n = 0; n < nuclei.length; n++) {
    const at = nuclei[n];
    const nextAt = nuclei[n + 1] ?? phones.length;
    const followingConsonants = nextAt - at - 1;
    const coda = n + 1 < nuclei.length ? Math.max(0, followingConsonants - 1) : followingConsonants;
    const onset = at - cursor;
    if (onset > 1 && !dictionaryChunk) return fail('unresolved-onset-cluster');
    // CV, CVC, CVV, CVCC and CVVC. More complex codas need lexical exceptions.
    const long = !!phones[at].long;
    if (coda > (long ? 1 : 2)) return fail('complex-coda-requires-lexical-reading');
    const pattern = !long && coda === 0 ? '-' : (long && coda === 1) || (!long && coda === 2) ? '=-' : '=';
    const end = at + coda + 1;
    const shape = 'C'.repeat(onset) + (long ? 'VV' : 'V') + 'C'.repeat(coda);
    syllables.push({ text: phones.slice(cursor, end).map(p => p.text).join(''), shape, pattern });
    cursor = end;
  }
  return { pattern: syllables.map(s => s.pattern).join(''), syllables };
}

/** Compile source-supplied pronunciation divisions, not a word's written length. */
export function parseDictionaryTaqti(taqti: string): PhonologyResult {
  const results = taqti.trim().split(/\s*\+\s*/u).filter(Boolean).map(part => parsePronunciation(part.trim(), true));
  const failed = results.find(r => r.error);
  if (failed) return failed;
  const syllables = results.flatMap(r => r.syllables);
  return { pattern: syllables.map(s => s.pattern).join(''), syllables };
}
