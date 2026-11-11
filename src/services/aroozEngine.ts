/**
 * Local Urdu Prosody (Arooz / علمِ عروض) Engine
 * Deterministic word-reading alignment and classical meter matcher.
 * Source-attributed pronunciations and documented contextual reading rules.
 */

import { lookupUrduLexicon, URDU_LEXICON, LexiconEntry } from '../data/urduLexicon';
import { AroozLexiconService } from './aroozLexiconService';
import { scanPronouncedWords } from './prosodicReadings';
import { CLASSICAL_BUHUR, ClassicalMeterDef, FOOT_NAMES } from '../data/prosodyMeters';
export { CLASSICAL_BUHUR } from '../data/prosodyMeters';
export type { ClassicalMeterDef } from '../data/prosodyMeters';
export { scanPronouncedWords as scanWords } from './prosodicReadings';
export type { ScannedWord } from './prosodicReadings';

export { URDU_LEXICON, lookupUrduLexicon, AroozLexiconService };
export type { LexiconEntry };

export interface ScansionRuknMatch {
  ruknUrdu: string; // e.g. "فاعلاتن"
  pattern: string; // e.g. "= - = ="
}

export interface ScansionResult {
  isMatched: boolean;
  rawSyllables: string; // e.g. "=-====-====-====-="
  meterNameUrdu: string; // e.g. "بحرِ رمل مثمن محذوف"
  meterNameEnglish: string; // e.g. "Bahr-e-Ramal Musamman Mahzoof"
  afail: string; // e.g. "فاعلاتن فاعلاتن فاعلاتن فاعلن"
  afailList: string[]; // ["فاعلاتن", "فاعلاتن", "فاعلاتن", "فاعلن"]
  groupedPattern: string; // e.g. "= - = =   = - = =   = - = =   = - ="
  groupedPatternList: string[]; // ["= - = =", "= - = =", "= - = =", "= - ="]
  confidence: number; // 0 to 100
  totalSyllables: number;
}

export function patternToClassicalRukn(pattern: string): string {
  return FOOT_NAMES[pattern.replace(/\s/gu, '')] || '';
}

/** Compatibility API: unresolved words have no fabricated weight. */
export function syllabifyWord(word: string, isNextWordJoined = false): string {
  const readings = scanPronouncedWords(isNextWordJoined ? word + ' دل' : word);
  return readings[0]?.variants[0] || '';
}

/**
 * Splits extracted syllables dynamically according to the matched meter's actual foot lengths
 */
export function splitSyllablesByMeterArkan(syllables: string, meter: ClassicalMeterDef): string[] {
  if (!syllables) return [];
  const footLengths = meter.patternsList.map((p) => p.replace(/\s+/g, '').length);
  const result: string[] = [];
  let cursor = 0;

  for (let i = 0; i < footLengths.length; i++) {
    const len = footLengths[i];
    if (cursor >= syllables.length) break;

    const isLast = i === footLengths.length - 1;
    const chunk = isLast ? syllables.slice(cursor) : syllables.slice(cursor, cursor + len);
    result.push(chunk.split('').join(' '));
    cursor += chunk.replace(/\s/g, '').length;
  }

  if (cursor < syllables.length) {
    result.push(syllables.slice(cursor).split('').join(' '));
  }

  return result;
}

/** Exact dynamic programming over the word-reading lattice. No branch truncation. */
export function scanAgainstMeter(line: string, target: string, requiredWordBoundary?: number) {
  const words = scanPronouncedWords(line);
  type State = { cost: number; readings: string[] };
  const unreachable = (): State => ({ cost: Number.POSITIVE_INFINITY, readings: [] });
  function advance(previous: State[], variants: string[], minColumn: number, maxColumn: number): State[] {
    const alternatives = variants.map(variant => {
      let row = previous.map(state => ({ cost: state.cost, readings: [...state.readings, variant] }));
      for (const symbol of variant) {
        const next: State[] = [minColumn === 0 ? { cost: row[0].cost + 1, readings: row[0].readings } : unreachable()];
        for (let j = 1; j <= target.length; j++) {
          if (j < minColumn || j > maxColumn) { next.push(unreachable()); continue; }
          const options = [
            { cost: row[j - 1].cost + Number(symbol !== target[j - 1]), readings: row[j - 1].readings },
            { cost: row[j].cost + 1, readings: row[j].readings },
            { cost: next[j - 1].cost + 1, readings: next[j - 1].readings },
          ];
          next.push(options.reduce((a, b) => b.cost < a.cost ? b : a));
        }
        row = next;
      }
      return row;
    });
    return previous.map((_, j) => alternatives.map(row => row[j]).reduce((a, b) => b.cost < a.cost ? b : a));
  }
  const boundary = requiredWordBoundary ?? target.length;
  let before: State[] = Array.from({ length: target.length + 1 }, (_, j) => j <= boundary ? { cost: j, readings: [] } : unreachable());
  let after: State[] = Array.from({ length: target.length + 1 }, unreachable);
  for (const word of words) {
    before = advance(before, word.variants, 0, boundary);
    if (requiredWordBoundary !== undefined) {
      after = advance(after, word.variants, boundary, target.length);
      // A caesura transition is possible only here, between complete source words.
      if (before[boundary].cost < after[boundary].cost) after[boundary] = before[boundary];
      for (let j = boundary + 1; j <= target.length; j++) {
        if (after[j - 1].cost + 1 < after[j].cost) after[j] = { cost: after[j - 1].cost + 1, readings: after[j - 1].readings };
      }
    }
  }
  const best = (requiredWordBoundary === undefined ? before : after)[target.length];
  return { words, readings: best.readings, pattern: best.readings.join(''), distance: best.cost,
    selectedOptions: words.map((w, i) => w.options.find(o => o.pattern === best.readings[i])),
    uncertainWords: [...words.filter(w => w.source === 'unresolved' || w.source === 'user-entry').map(w => w.word), ...(line.match(/\p{N}+/gu) || [])] };
}

/** Resolve only the explicitly documented variants of a named meter. */
export function scanMeter(line: string, meter: ClassicalMeterDef) {
  const patterns: { feet: string[]; notes: string[]; caesuraBoundary?: number }[] = [{ feet: [...meter.patternsList], notes: [] }];
  if (meter.initialFlexible) patterns.push({ feet: [ '-' + meter.patternsList[0].slice(1), ...meter.patternsList.slice(1)], notes: ['initial-short'] });
  if (meter.caesuraAfter) for (const variant of [...patterns]) {
    const feet = [...variant.feet]; feet[meter.caesuraAfter - 1] += '-';
    patterns.push({ feet, notes: [...variant.notes, 'caesura-short'], caesuraBoundary: feet.slice(0, meter.caesuraAfter).join('').length });
  }
  if (meter.allowTerminalShort) for (const variant of [...patterns]) {
    const feet = [...variant.feet]; feet[feet.length - 1] += '-';
    patterns.push({ ...variant, feet, notes: [...variant.notes, 'terminal-short'] });
  }
  const candidates = patterns.map(variant => {
    const target = variant.feet.join('');
    const scan = scanAgainstMeter(line, target, variant.caesuraBoundary);
    return { ...scan,
      target, notes: variant.notes, resolvedMeter: { ...meter, patternsList: variant.feet,
        afailList: meter.afailList.map((name, i) => i === 0 && variant.notes.includes('initial-short') ? FOOT_NAMES['--=='] : name), fullRawPattern: target } };
  });
  return candidates.reduce((a, b) => b.distance < a.distance ? b : a);
}

export function tokenizeLineToSyllables(line: string): string {
  return scanPronouncedWords(line).map(w => w.variants[0]).join('');
}

export function selectMeterAnalysis(line: string, preferredMeterId?: string) {
  const meters = preferredMeterId ? CLASSICAL_BUHUR.filter(m => m.id === preferredMeterId) : CLASSICAL_BUHUR;
  if (!meters.length) throw new Error(`Unknown meter: ${preferredMeterId}`);
  const candidates = meters.map(meter => ({ meter, scan: scanMeter(line, meter) }));
  if (!preferredMeterId && !candidates.some(c => c.scan.distance === 0)) {
    const prefixes = candidates.filter(c => c.scan.pattern && !c.scan.uncertainWords.length && c.scan.target.startsWith(c.scan.pattern));
    if (prefixes.length) return prefixes.reduce((a, b) => b.scan.distance < a.scan.distance ? b : a);
  }
  return candidates.reduce((a, b) => {
    if (b.scan.distance < a.scan.distance) return b;
    if (b.scan.distance === a.scan.distance && b.scan.pattern && b.scan.target.startsWith(b.scan.pattern) && !a.scan.target.startsWith(a.scan.pattern)) return b;
    return a;
  });
}

export function scanPoetryLine(line: string, preferredMeterId?: string): ScansionResult {
  const { meter, scan } = selectMeterAnalysis(line, preferredMeterId);
  const isMatched = scan.pattern.length > 0 && scan.distance === 0 && !scan.uncertainWords.length;
  const groups = splitSyllablesByMeterArkan(scan.pattern, scan.resolvedMeter);
  return {
    isMatched, rawSyllables: scan.pattern,
    meterNameUrdu: scan.pattern ? meter.nameUrdu : 'خالی مصرع', meterNameEnglish: meter.nameEnglish,
    afail: scan.resolvedMeter.afailList.join(' '), afailList: scan.resolvedMeter.afailList,
    groupedPattern: groups.join('   '), groupedPatternList: groups,
    confidence: Math.max(0, Math.round(100 * (1 - scan.distance / Math.max(scan.pattern.length, meter.fullRawPattern.length)))),
    totalSyllables: scan.pattern.length,
  };
}
