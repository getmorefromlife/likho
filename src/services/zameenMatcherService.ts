/**
 * Classical Zameen Matcher Service (خدمتِ تلاشِ ہم زمین کلام و تضمینِ اساتذہ)
 *
 * Connects the poet's active composition (or searched rhyme/meter) with the
 * 10 Classical Urdu Masters' Corpus (`CLASSICAL_DIWAN_POETS` — Ghalib, Mir,
 * Iqbal, Dagh, Momin, Zauq, Hali, Akbar, Hasrat, Fani).
 *
 * Classifies matches into 4 clear literary tiers:
 * 1. `exact_zameen`: Exact Classical Zameen (Same Meter + Same Radif + Same Qafiya rhyme family)
 * 2. `same_radif_qafiya`: Shared Radif & Qafiya rhyme family
 * 3. `same_radif`: Shared Radif
 * 4. `same_meter`: Shared Bahr / Prosodic Meter
 */

import {
  CLASSICAL_DIWAN_POETS,
  ClassicalPoem,
} from '../data/sovereign/classicalDiwanCorpus';
import { scanPoetryLine } from './aroozEngine';
import { detectPoemRhymeScheme } from './qafiyaEngine';
import { normalizeUrduChars, stripDiacritics, stripInvisibleChars } from './unicodeNormalizer';

export type ZameenMatchTier =
  | 'exact_zameen'
  | 'same_radif_qafiya'
  | 'same_radif'
  | 'same_meter';

export interface ClassicalZameenMatch {
  poem: ClassicalPoem;
  poet: {
    id: string;
    name: string;
    takhallus: string;
    dabistan: string;
  };
  tier: ZameenMatchTier;
  tierLabelUrdu: string;
  matchReasonUrdu: string;
  sharedQafiyas: string[];
}

export interface PoetMatchCount {
  poetId: string;
  poetName: string;
  takhallus: string;
  count: number;
}

export interface ZameenMatchReport {
  detectedMeterName: string;
  detectedArkan: string;
  detectedRadif: string;
  detectedQafiyaWord: string;
  detectedQafiyas: string[];
  totalMatches: number;
  exactZameenCount: number;
  sameRadifQafiyaCount: number;
  sameRadifCount: number;
  sameMeterCount: number;
  poetSummary: PoetMatchCount[];
  matches: ClassicalZameenMatch[];
}

export interface ZameenQueryOptions {
  poemContent?: string;
  lines?: string[];
  preferredMeterName?: string;
  preferredMeterRukn?: string;
  preferredRadif?: string;
  qafiyaQuery?: string;
  maxResults?: number;
}

export const ZAMEEN_TIER_META: Record<
  ZameenMatchTier,
  { badge: string; title: string; description: string }
> = {
  exact_zameen: {
    badge: 'مکمل ہم زمین',
    title: 'درجہ اول: مکمل ہم زمین کلام (بحر، ردیف اور قافیہ یکساں)',
    description: 'یہ کلاسیکی کلام بالکل آپ کی منتخب بحر، ردیف اور قافیہ کی زمین میں کہے گئے ہیں۔',
  },
  same_radif_qafiya: {
    badge: 'ہم قافیہ و ردیف',
    title: 'درجہ دوم: ہم قافیہ و ہم ردیف کلاسیکی کلام',
    description: 'ان غزلیات میں وہی ردیف اور ہم آواز قوافی استعمال ہوئے ہیں۔',
  },
  same_radif: {
    badge: 'ہم ردیف',
    title: 'درجہ سوم: ہم ردیف کلاسیکی کلام',
    description: 'ان غزلیات میں آپ کے کلام کی ردیف استعمال ہوئی ہے۔',
  },
  same_meter: {
    badge: 'ہم بحر',
    title: 'درجہ چہارم: ہم بحر کلاسیکی شاہکار',
    description: 'یہ کلام آپ کی منتخب بحر اور عروضی آہنگ میں کہے گئے ہیں۔',
  },
};

function cleanToken(str: string): string {
  return stripDiacritics(
    normalizeUrduChars(stripInvisibleChars(str))
  )
    .replace(/[،۔؟!؛:«»"()[\]{}ؔ]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
}

function normalizeMeterKey(meterName: string): string {
  return cleanToken(meterName)
    .replace(/^بحر\s+/u, '')
    .replace(/^رباعی\s*[—-]\s*/u, 'رباعی ')
    .trim();
}

/**
 * Extracts the phonetic/orthographic rhyme tail (آخر کے ۲ تا ۳ حروف) of a qafiya word.
 */
function getQafiyaTail(word: string): string {
  const cleaned = cleanToken(word);
  if (cleaned.length <= 2) return cleaned;
  // Normalize terminal nasal noon (ں -> ن) for flexible classical matching (ساماں / سامان)
  const norm = cleaned.replace(/ں$/u, 'ن');
  // Check common 2-letter and 3-letter classical rhyme suffixes
  const last2 = norm.slice(-2);
  return last2;
}

function doQafiyasMatch(wordA: string, wordB: string): boolean {
  const a = cleanToken(wordA);
  const b = cleanToken(wordB);
  if (!a || !b) return false;
  if (a === b) return true;
  const tailA = getQafiyaTail(a);
  const tailB = getQafiyaTail(b);
  if (tailA.length >= 2 && tailA === tailB) return true;
  // Single long vowel ending (الف یا واو یا چھوٹی/بڑی ی)
  if (a.length >= 2 && b.length >= 2) {
    const endA = a.slice(-1);
    const endB = b.slice(-1);
    if (['ا', 'و', 'ی', 'ے'].includes(endA) && endA === endB) {
      // Check penultimate letter or vowel family
      if (a.slice(-2) === b.slice(-2)) return true;
    }
  }
  return false;
}

/**
 * Finds all matching Classical Poems from the 10 Masters' Diwan Corpus
 * for the given draft or search parameters.
 */
export function findClassicalZameenMatches(
  options: ZameenQueryOptions
): ZameenMatchReport {
  const rawLines =
    options.lines && options.lines.length > 0
      ? options.lines
      : (options.poemContent || '').split('\n');
  const lines = rawLines
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('—'));

  const detectedScheme = lines.length > 0 ? detectPoemRhymeScheme(lines) : null;

  let detectedMeterName = (options.preferredMeterName || '').trim();
  let detectedArkan = (options.preferredMeterRukn || '').trim();

  // Auto-detect meter from the first couplet if not explicitly set on draft
  if (!detectedMeterName && lines.length > 0) {
    for (const line of lines.slice(0, 3)) {
      const scan = scanPoetryLine(line);
      if (scan.isMatched && scan.meterNameUrdu) {
        detectedMeterName = scan.meterNameUrdu;
        detectedArkan = scan.afail;
        break;
      }
    }
  }

  const detectedRadif = cleanToken(
    options.preferredRadif || detectedScheme?.detectedRadif || ''
  );
  const detectedQafiyaWord = cleanToken(
    options.qafiyaQuery || detectedScheme?.detectedQafiyaWord || ''
  );

  const poetQafiyaPool = new Set<string>();
  if (detectedQafiyaWord) poetQafiyaPool.add(detectedQafiyaWord);
  if (detectedScheme?.secondQafiyaWord) {
    poetQafiyaPool.add(cleanToken(detectedScheme.secondQafiyaWord));
  }
  if (detectedScheme?.qafiyaWordsInPoem) {
    for (const w of detectedScheme.qafiyaWordsInPoem) {
      const cw = cleanToken(w);
      if (cw) poetQafiyaPool.add(cw);
    }
  }

  const normTargetMeter = normalizeMeterKey(detectedMeterName);
  const normTargetArkan = cleanToken(detectedArkan);

  const matches: ClassicalZameenMatch[] = [];

  for (const poet of CLASSICAL_DIWAN_POETS) {
    for (const poem of poet.poems) {
      const normPoemMeter = normalizeMeterKey(poem.meterName);
      const normPoemArkan = cleanToken(poem.arkan);
      const normPoemRadif = cleanToken(poem.radif);

      const isMeterMatch =
        Boolean(normTargetMeter && normPoemMeter && normTargetMeter === normPoemMeter) ||
        Boolean(normTargetArkan && normPoemArkan && normTargetArkan === normPoemArkan);

      const isRadifMatch =
        Boolean(detectedRadif) && normPoemRadif === detectedRadif;

      const isBothRadifEmpty = !detectedRadif && !normPoemRadif;

      // Find shared/rhyming qafiya words between poet's qafiya and classical poem's qafiyaSample
      const sharedQafiyas: string[] = [];
      if (poetQafiyaPool.size > 0) {
        for (const sampleQ of poem.qafiyaSample) {
          for (const targetQ of poetQafiyaPool) {
            if (doQafiyasMatch(sampleQ, targetQ)) {
              sharedQafiyas.push(sampleQ);
              break;
            }
          }
        }
      }

      const isQafiyaMatch = sharedQafiyas.length > 0;

      let tier: ZameenMatchTier | null = null;
      let matchReasonUrdu = '';

      if (
        isMeterMatch &&
        ((isRadifMatch && (isQafiyaMatch || poetQafiyaPool.size === 0)) ||
          (isBothRadifEmpty && isQafiyaMatch))
      ) {
        tier = 'exact_zameen';
        matchReasonUrdu = isRadifMatch
          ? `یکساں بحر (${poem.meterName}) + ردیف «${poem.radif}»`
          : `یکساں بحر (${poem.meterName}) + ہم قافیہ الفاظ`;
      } else if (
        (isRadifMatch && isQafiyaMatch) ||
        (!detectedMeterName && isRadifMatch && poetQafiyaPool.size === 0)
      ) {
        tier = 'same_radif_qafiya';
        matchReasonUrdu = poem.radif
          ? `ردیف «${poem.radif}» اور ہم آواز قوافی (${sharedQafiyas.slice(0, 3).join('، ')})`
          : `ہم آواز قوافی (${sharedQafiyas.slice(0, 3).join('، ')})`;
      } else if (isRadifMatch) {
        tier = 'same_radif';
        matchReasonUrdu = `مشترک ردیف: «${poem.radif}»`;
      } else if (!detectedRadif && isQafiyaMatch && sharedQafiyas.length >= 2) {
        tier = 'same_radif_qafiya';
        matchReasonUrdu = `مشترک قوافی: ${sharedQafiyas.slice(0, 4).join('، ')}`;
      } else if (isMeterMatch) {
        tier = 'same_meter';
        matchReasonUrdu = `مشترک بحر: ${poem.meterName}`;
      }

      if (!tier) continue;

      matches.push({
        poem,
        poet: {
          id: poet.id,
          name: poet.name,
          takhallus: poet.takhallus,
          dabistan: poet.dabistan,
        },
        tier,
        tierLabelUrdu: ZAMEEN_TIER_META[tier].badge,
        matchReasonUrdu,
        sharedQafiyas,
      });
    }
  }

  const tierPriority: Record<ZameenMatchTier, number> = {
    exact_zameen: 0,
    same_radif_qafiya: 1,
    same_radif: 2,
    same_meter: 3,
  };

  matches.sort((a, b) => {
    const pDiff = tierPriority[a.tier] - tierPriority[b.tier];
    if (pDiff !== 0) return pDiff;
    return b.sharedQafiyas.length - a.sharedQafiyas.length;
  });

  const exactZameenCount = matches.filter((m) => m.tier === 'exact_zameen').length;
  const sameRadifQafiyaCount = matches.filter((m) => m.tier === 'same_radif_qafiya').length;
  const sameRadifCount = matches.filter((m) => m.tier === 'same_radif').length;
  const sameMeterCount = matches.filter((m) => m.tier === 'same_meter').length;

  // Summarize poet counts for high-priority matches (or all matches if only meter matches exist)
  const primarySubset =
    exactZameenCount + sameRadifQafiyaCount + sameRadifCount > 0
      ? matches.filter((m) => m.tier !== 'same_meter')
      : matches;

  const poetMap = new Map<string, PoetMatchCount>();
  for (const m of primarySubset) {
    const existing = poetMap.get(m.poet.id);
    if (existing) {
      existing.count++;
    } else {
      poetMap.set(m.poet.id, {
        poetId: m.poet.id,
        poetName: m.poet.name,
        takhallus: m.poet.takhallus,
        count: 1,
      });
    }
  }

  const poetSummary = Array.from(poetMap.values()).sort((a, b) => b.count - a.count);
  const maxResults = options.maxResults ?? 60;

  return {
    detectedMeterName,
    detectedArkan,
    detectedRadif,
    detectedQafiyaWord,
    detectedQafiyas: Array.from(poetQafiyaPool),
    totalMatches: matches.length,
    exactZameenCount,
    sameRadifQafiyaCount,
    sameRadifCount,
    sameMeterCount,
    poetSummary,
    matches: matches.slice(0, maxResults),
  };
}
