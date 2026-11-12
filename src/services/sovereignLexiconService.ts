/**
 * SovereignLexiconService (خدمتِ لغتِ قلم و قافیہ — مستقل بالذات علمی و عروضی لغت)
 *
 * Dual-purpose clean-room dictionary service:
 * 1. User-Facing Literary & Prosodic Dictionary (`لغتِ قلم و قافیہ`):
 *    Provides vocalized pronunciation (`تلفظ و اعراب`), syllable division (`ہجے`),
 *    prosodic weight & foot (`وزن و رکن`), grammatical part-of-speech (`قواعدی نوعیت`),
 *    root/stem (`مادہ / اصل`), Urdu meaning (`معنی و وضاحت`), and root-family derivatives.
 * 2. Parallel Scansion & Rhyming Engine Feed:
 *    Attaches all 30,916+ clean-room words to `AroozLexiconService` so scansion,
 *    the Rhyme Treasury (`qafiyaEngine`), and the Slot Rhyme Builder (`slotRhymeBuilder`)
 *    automatically benefit from newly compiled derivatives and poetic compounds.
 */

import sovereignMetaRaw from '../data/sovereign/likho-sovereign-lexicon.meta.json';
import { FOOT_NAMES } from '../data/prosodyMeters';
import {
  AroozLexiconService,
  normalizeLexiconKey,
  SovereignLexiconReading,
} from './aroozLexiconService';

export interface SovereignLexiconMetadata {
  name: string;
  version: string;
  license: string;
  cleanRoom: boolean;
  thirdPartyGplUsed: boolean;
  compiler: string;
  generatedAt: string;
  words: number;
  readings: number;
  rejectedCandidates: number;
  sha256: string;
}

export interface SovereignDictionaryLookupResult {
  word: string;
  readings: SovereignLexiconReading[];
  relatedByRoot: string[];
  prefixMatches: string[];
}

export const SOVEREIGN_LEXICON_META = sovereignMetaRaw as SovereignLexiconMetadata;

let loadedLexicon: Record<string, SovereignLexiconReading[]> | null = null;
let rootFamilyIndex: Map<string, string[]> | null = null;
let sortedKeysCache: string[] | null = null;
let loadingPromise: Promise<Record<string, SovereignLexiconReading[]>> | null = null;

function buildIndices(lexicon: Record<string, SovereignLexiconReading[]>): void {
  const rootMap = new Map<string, string[]>();
  const keys = Object.keys(lexicon);
  for (const word of keys) {
    const entries = lexicon[word];
    if (!entries || entries.length === 0) continue;
    const root = entries[0].root;
    if (root) {
      let list = rootMap.get(root);
      if (!list) {
        list = [];
        rootMap.set(root, list);
      }
      if (list.length < 24 && !list.includes(word)) {
        list.push(word);
      }
    }
  }
  rootFamilyIndex = rootMap;
  sortedKeysCache = keys;
}

export type SovereignCompactTuple = [
  string, // 0: pattern
  string, // 1: vocalized
  string, // 2: syllables joined by '·'
  number, // 3: posIdx
  string, // 4: root
  number, // 5: meaningIdx
  number, // 6: catIdx
];

interface SovereignPackedPayload {
  posTable: string[];
  catTable: string[];
  meaningTable: string[];
  entries: Record<string, SovereignCompactTuple[]>;
}

function unpackLexicon(
  raw: SovereignPackedPayload
): Record<string, SovereignLexiconReading[]> {
  const result: Record<string, SovereignLexiconReading[]> = {};
  const { posTable = [], catTable = [], meaningTable = [], entries = {} } = raw;
  for (const [word, rows] of Object.entries(entries)) {
    const rawi = [...word].at(-1) || '';
    result[word] = rows.map((r) => {
      const pattern = r[0];
      const root = r[4] || '';
      let meaning = meaningTable[r[5]] || '';
      if (root && root.includes(' + ')) {
        const [h, t] = root.split(' + ');
        meaning = meaning.replaceAll('$H', h || '').replaceAll('$T', t || '');
      } else if (root) {
        meaning = meaning.replaceAll('$R', root);
      }
      return {
        pattern,
        rukn: FOOT_NAMES[pattern] || 'مرکب عروضی وزن',
        vocalized: r[1],
        syllables: r[2] ? r[2].split('·') : [],
        pos: posTable[r[3]] || 'اسم',
        root,
        meaning,
        rawi,
        source: `likho:sovereign:${catTable[r[6]] || 'core'}`,
      };
    });
  }
  return result;
}

/**
 * Lazily loads the 65,000+ word Sovereign Clean-Room Lexicon JSON shards
 * and attaches the unified dictionary to AroozLexiconService for scansion and rhyming.
 */
export async function loadSovereignLexicon(): Promise<
  Record<string, SovereignLexiconReading[]>
> {
  if (loadedLexicon) return loadedLexicon;
  if (!loadingPromise) {
    loadingPromise = Promise.all([
      import('../data/sovereign/likho-sovereign-lexicon.json'),
      import('../data/sovereign/likho-sovereign-lexicon-part2.json'),
      import('../data/sovereign/likho-sovereign-lexicon-part3.json'),
    ]).then(([mod1, mod2, mod3]) => {
      const raw1 = (mod1.default || mod1) as unknown as SovereignPackedPayload;
      const raw2 = (mod2.default || mod2) as unknown as {
        entries: Record<string, SovereignCompactTuple[]>;
      };
      const raw3 = (mod3.default || mod3) as unknown as {
        entries: Record<string, SovereignCompactTuple[]>;
      };
      const mergedPayload: SovereignPackedPayload = {
        posTable: raw1.posTable,
        catTable: raw1.catTable,
        meaningTable: raw1.meaningTable,
        entries: {
          ...raw1.entries,
          ...raw2.entries,
          ...raw3.entries,
        },
      };
      const data = unpackLexicon(mergedPayload);
      loadedLexicon = data;
      buildIndices(data);
      AroozLexiconService.attachSovereignLexicon(data);
      return data;
    });
  }
  return loadingPromise;
}

export function isSovereignLexiconLoaded(): boolean {
  return loadedLexicon !== null;
}

/**
 * Looks up a word in the Sovereign Literary Dictionary, returning its vocalized
 * readings, grammatical part-of-speech, root, meaning, prosodic weight/rukn,
 * root-family derivatives, and prefix/substring suggestions.
 */
export function lookupSovereignWord(
  rawQuery: string,
  maxSuggestions = 18
): SovereignDictionaryLookupResult | null {
  if (!loadedLexicon || !sortedKeysCache) return null;
  const key = normalizeLexiconKey(rawQuery);
  if (!key) return null;

  let matchedWord = key;
  let readings = loadedLexicon[key] || [];

  // If no exact match, try nasal/noon equivalence or prefix match
  if (readings.length === 0 && key.endsWith('ں') && key.length >= 2) {
    const noonKey = key.slice(0, -1) + 'ن';
    if (loadedLexicon[noonKey]) {
      matchedWord = noonKey;
      readings = loadedLexicon[noonKey];
    }
  }

  const prefixMatches: string[] = [];
  for (const k of sortedKeysCache) {
    if (k !== matchedWord && k.startsWith(key)) {
      prefixMatches.push(k);
      if (prefixMatches.length >= maxSuggestions) break;
    }
  }

  if (prefixMatches.length < maxSuggestions && key.length >= 2) {
    for (const k of sortedKeysCache) {
      if (
        k !== matchedWord &&
        !k.startsWith(key) &&
        k.includes(key)
      ) {
        prefixMatches.push(k);
        if (prefixMatches.length >= maxSuggestions) break;
      }
    }
  }

  // If no exact match but prefix matches exist, promote the first prefix match if query >= 2 chars
  if (readings.length === 0 && prefixMatches.length > 0) {
    const best = prefixMatches[0];
    matchedWord = best;
    readings = loadedLexicon[best] || [];
  }

  const primaryRoot = readings[0]?.root || '';
  const relatedByRoot =
    primaryRoot && rootFamilyIndex?.get(primaryRoot)
      ? (rootFamilyIndex.get(primaryRoot) || []).filter((w) => w !== matchedWord)
      : [];

  return {
    word: matchedWord,
    readings,
    relatedByRoot: relatedByRoot.slice(0, 16),
    prefixMatches,
  };
}
