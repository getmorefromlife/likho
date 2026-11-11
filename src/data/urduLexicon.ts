/** Compatibility view of the attributed dictionary. No hand-entered estimated weights. */
import dictionary from './prosody/aruuz-dictionary.json';
import { FOOT_NAMES } from './prosodyMeters';
import { normalizeUrduChars, stripDiacritics } from '../services/unicodeNormalizer';

export interface LexiconEntry {
  pattern: string;
  afail: string;
}

const rawDict = dictionary as unknown as Record<string, [string, ...unknown[]][]>;
const resolvedCache = new Map<string, LexiconEntry>();

function getEntryByNormalizedKey(key: string): LexiconEntry | undefined {
  if (!key) return undefined;
  const cached = resolvedCache.get(key);
  if (cached) return cached;
  const rows = rawDict[key];
  if (!rows || !rows.length) return undefined;
  const pattern = String(rows[0][0]);
  const entry: LexiconEntry = {
    pattern,
    afail: FOOT_NAMES[pattern.replace(/x/g, '=')] || '',
  };
  resolvedCache.set(key, entry);
  return entry;
}

export const URDU_LEXICON: Record<string, LexiconEntry> = new Proxy(
  {} as Record<string, LexiconEntry>,
  {
    get(_target, prop) {
      if (typeof prop !== 'string') return undefined;
      return getEntryByNormalizedKey(prop);
    },
    has(_target, prop) {
      if (typeof prop !== 'string') return false;
      return Object.prototype.hasOwnProperty.call(rawDict, prop);
    },
    ownKeys() {
      return Reflect.ownKeys(rawDict);
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (typeof prop !== 'string' || !Object.prototype.hasOwnProperty.call(rawDict, prop)) {
        return undefined;
      }
      return {
        enumerable: true,
        configurable: true,
        value: getEntryByNormalizedKey(prop),
      };
    },
  }
);

export function lookupUrduLexicon(word: string): LexiconEntry | undefined {
  return getEntryByNormalizedKey(normalizeUrduChars(stripDiacritics(word)).trim());
}
