/**
 * AroozLexiconService (خدمتِ لغتِ عروض)
 * High-performance offline Prosody Lexicon service with IndexedDB persistence
 * Provides O(1) multi-weight scansion lookup and bulk TSV/JSON import
 */

import sourceDictionary from '../data/prosody/aruuz-dictionary.json';
import dictionaryMetadata from '../data/prosody/aruuz-dictionary.meta.json';
import quarantinedEntriesRaw from '../data/prosody/aruuz-quarantine.json';
import { normalizeUrduChars, stripDiacritics, stripInvisibleChars } from './unicodeNormalizer';

const DB_NAME = 'QalamAroozDB';
const DB_VERSION = 1;
const STORE_NAME = 'lexicon_store';
const CUSTOM_ENTRIES_KEY = 'custom_lexicon_entries_v2';
const REVIEWED_PROPOSALS_KEY = 'reviewed_lexicon_proposals_v1';
const VOCABULARY_KEY = 'unweighted_vocabulary_v2';

export interface QuarantinedEntry {
  sourceId: string;
  word: string;
  vocalized?: string;
  divisions?: string;
  patterns?: string[];
  reason: string;
}

export type ReviewStatus = 'quarantined' | 'unreviewed' | 'approved';

export interface UserPronunciationProposal {
  word: string;
  pattern: string; // e.g. "-==" or "=-"
  vocalized?: string;
  divisions?: string;
  status: ReviewStatus;
  sourceReference?: string;
  rejectionReason?: string;
  notes?: string;
  updatedAt: string;
}

export const QUARANTINE_REASON_LABELS: Record<string, { urdu: string; en: string }> = {
  'complex-coda-requires-lexical-reading': {
    urdu: 'پیچیدہ ساکن مجموعہ (سلسلہ حروفِ ساکنہ) — لغوی تلفظ درکار',
    en: 'Complex consonantal coda — requires lexical reading',
  },
  'conflicting-vowel-marks': {
    urdu: 'متضاد اعراب (ایک ہی حرف پر متضاد حرکات)',
    en: 'Conflicting vowel diacritics',
  },
  'unsupported-letter': {
    urdu: 'غیر معیاری یا غیر مصدقہ حرف',
    en: 'Unsupported character',
  },
  'invalid-key': {
    urdu: 'غیر درست لغوی کلید',
    en: 'Invalid dictionary key',
  },
  'aspirate-without-onset': {
    urdu: 'ہائے مخلوط بغیر ماقبل حرف',
    en: 'Aspirate without preceding onset',
  },
  'invalid-shadda': {
    urdu: 'ناجائز تشدید کا مقام',
    en: 'Invalid shadda position',
  },
  'nonterminal-tanwin': {
    urdu: 'درمیانی تنوین (غیر آخری تنوین)',
    en: 'Non-terminal tanwin',
  },
  'impossible-exception': {
    urdu: 'غیر ممکن صوتی استثنا',
    en: 'Impossible phonetic exception',
  },
};

function openLexiconDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromIDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openLexiconDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => { db.close(); resolve(req.result || null); };
      req.onerror = () => { db.close(); resolve(null); };
    });
  } catch {
    return null;
  }
}

async function setToIDB<T>(key: string, val: T): Promise<boolean> {
  try {
    const db = await openLexiconDB();
    return await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(val, key);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = tx.onabort = () => { db.close(); resolve(false); };
    });
  } catch { return false; }
}

export type SourceDictionaryRow = [string, string, string, string, string, number];
export interface LexicalReading {
  pattern: string;
  vocalized: string;
  divisions: string;
  language: string;
  source: 'dictionary' | 'user-entry' | 'reviewed-entry';
  sourceId: string;
}
const dictionary = sourceDictionary as unknown as Record<string, SourceDictionaryRow[]>;
const quarantinedEntries = quarantinedEntriesRaw as QuarantinedEntry[];

export function normalizeLexiconKey(word: string): string {
  return normalizeUrduChars(stripDiacritics(stripInvisibleChars(word))).trim();
}

/** Validate every entry point, including persisted and imported personal readings. */
function validateProposal(value: unknown, expectedWord?: string): UserPronunciationProposal {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('غلط تلفظ کی تجویز');
  const p = value as Record<string, unknown>;
  if (typeof p.word !== 'string' || typeof p.pattern !== 'string') throw new Error('لفظ اور وزن درکار ہیں');
  const word = normalizeLexiconKey(p.word);
  const pattern = p.pattern.replace(/\s+/gu, '');
  if (!word || !/^[\u0621-\u063a\u0641-\u064a\u066e-\u06d3]+$/u.test(word) || (expectedWord !== undefined && word !== normalizeLexiconKey(expectedWord))) throw new Error('غلط لغوی کلید');
  if (!/^[-=x]{1,64}$/u.test(pattern) || (pattern.match(/x/g) || []).length > 8) throw new Error('غلط وزن یا بہت زیادہ لچکدار مقامات');
  if (!['quarantined', 'unreviewed', 'approved'].includes(String(p.status))) throw new Error('غلط جائزے کی حالت');
  for (const field of ['vocalized', 'divisions', 'sourceReference', 'rejectionReason', 'notes', 'updatedAt']) {
    if (p[field] !== undefined && typeof p[field] !== 'string') throw new Error('غلط تجویز کی تفصیل');
  }
  return { word, pattern, status: p.status as ReviewStatus,
    vocalized: (p.vocalized as string || '').trim(), divisions: (p.divisions as string || '').trim(),
    sourceReference: (p.sourceReference as string || 'user:manual').trim(),
    rejectionReason: (p.rejectionReason as string || '').trim(), notes: (p.notes as string || '').trim(),
    updatedAt: p.updatedAt as string || new Date().toISOString() };
}

/** x is a recorded flexible syllable, never an invitation to change any other symbol. */
export function expandFlexiblePattern(pattern: string): string[] {
  return [...pattern].reduce<string[]>((paths, symbol) => paths.flatMap(path =>
    symbol === 'x' ? [path + '=', path + '-'] : [path + symbol]), ['']);
}

class AroozLexiconServiceImpl {
  private custom = new Map<string, string[]>();
  private proposals = new Map<string, UserPronunciationProposal>();
  private vocabulary = new Set<string>();
  private revision = 0;
  public getRevision(): number { return this.revision; }
  private initPromise: Promise<void> | null = null;
  private subscribers = new Set<() => void>();
  public readonly metadata = dictionaryMetadata;

  public getLexicalReadings(word: string): LexicalReading[] {
    const key = normalizeLexiconKey(word);

    // 1. Explicitly approved proposal: eligible for scansion and automated repair
    const proposal = this.proposals.get(key);
    if (proposal && proposal.status === 'approved') {
      const patterns = expandFlexiblePattern(proposal.pattern.replace(/\s+/g, ''));
      return patterns.map(pattern => ({
        pattern,
        vocalized: proposal.vocalized || '',
        divisions: proposal.divisions || '',
        language: 'اردو',
        source: 'reviewed-entry',
        sourceId: proposal.sourceReference || 'user:reviewed',
      }));
    }

    // 2. Custom unreviewed entries
    const custom = this.custom.get(key);
    if (custom) return custom.map(pattern => ({ pattern, vocalized: '', divisions: '', language: '', source: 'user-entry', sourceId: 'user-import' }));

    // 3. Unreviewed proposal draft: safe preview, but halts automated repair as user-entry
    if (proposal && proposal.status === 'unreviewed') {
      const patterns = expandFlexiblePattern(proposal.pattern.replace(/\s+/g, ''));
      return patterns.map(pattern => ({
        pattern,
        vocalized: proposal.vocalized || '',
        divisions: proposal.divisions || '',
        language: 'اردو',
        source: 'user-entry',
        sourceId: proposal.sourceReference || 'user:unreviewed',
      }));
    }

    // 4. Source dictionary
    const records: LexicalReading[] = (dictionary[key] || []).map(([pattern, vocalized, divisions, language, table, id]) =>
      ({ pattern, vocalized, divisions, language, source: 'dictionary', sourceId: `aruuz:${table}:${id}` }));
    // Handbook §2.1 explicitly records monosyllabic kyaa; the source DB also has kiyaa.
    if (key === 'کیا') records.unshift({ pattern: '=', vocalized: 'کْیا', divisions: '', language: 'ہندی', source: 'dictionary', sourceId: 'handbook:2.1:kya' });
    return records;
  }

  public initialize(): Promise<void> {
    // Source data is synchronously available. Hydrate custom and proposal data without a fetch race.
    if (!this.initPromise) this.initPromise = (async () => {
      const saved = await getFromIDB<Record<string, string[]>>(CUSTOM_ENTRIES_KEY);
      if (saved) for (const [word, patterns] of Object.entries(saved)) {
        if (Array.isArray(patterns) && patterns.length && patterns.every(p => typeof p === 'string' && /^[-=x]{1,64}$/u.test(p) && (p.match(/x/g) || []).length <= 8)) {
          if (!this.custom.has(word)) this.custom.set(word, patterns);
        }
      }

      const savedProposals = await getFromIDB<Record<string, UserPronunciationProposal>>(REVIEWED_PROPOSALS_KEY);
      if (savedProposals && typeof savedProposals === 'object') {
        for (const [word, prop] of Object.entries(savedProposals)) {
          try {
            const validated = validateProposal(prop, word);
            if (!this.proposals.has(validated.word)) this.proposals.set(validated.word, validated);
          } catch { /* Ignore malformed persisted proposals; never activate them. */ }
        }
      }

      const vocabulary = await getFromIDB<string[]>(VOCABULARY_KEY);
      if (Array.isArray(vocabulary)) for (const word of vocabulary) if (typeof word === 'string') this.vocabulary.add(word);
      this.notifySubscribers();
    })();
    return this.initPromise;
  }

  public getScansionVariants(word: string): string[] | null {
    const readings = this.getLexicalReadings(word);
    return readings.length ? [...new Set(readings.flatMap(r => expandFlexiblePattern(r.pattern)))] : null;
  }

  public hasWord(word: string): boolean { return this.getLexicalReadings(word).length > 0; }

  // Quarantined records inspection and review helpers
  public getQuarantinedEntries(): QuarantinedEntry[] {
    return quarantinedEntries;
  }

  public searchQuarantined(query: string, reasonFilter?: string): QuarantinedEntry[] {
    const trimmed = query.trim().toLowerCase();
    const cleanWord = normalizeLexiconKey(query);
    return quarantinedEntries.filter(entry => {
      if (reasonFilter && entry.reason !== reasonFilter) return false;
      if (!trimmed) return true;
      return (entry.word || '').includes(cleanWord) ||
        (entry.sourceId || '').toLowerCase().includes(trimmed) ||
        (entry.vocalized || '').includes(trimmed) ||
        (entry.divisions || '').includes(trimmed) ||
        (entry.patterns || []).some(p => p.includes(trimmed)) ||
        (entry.reason || '').toLowerCase().includes(trimmed);
    });
  }

  public getProposal(word: string): UserPronunciationProposal | undefined {
    return this.proposals.get(normalizeLexiconKey(word));
  }

  public getAllProposals(): UserPronunciationProposal[] {
    return Array.from(this.proposals.values());
  }

  public async saveProposal(proposal: {
    word: string;
    pattern: string;
    vocalized?: string;
    divisions?: string;
    status: ReviewStatus;
    sourceReference?: string;
    rejectionReason?: string;
    notes?: string;
  }): Promise<{ success: boolean; persisted: boolean; error?: string }> {
    await this.initialize();
    let sanitized: UserPronunciationProposal;
    try { sanitized = validateProposal({ ...proposal, updatedAt: new Date().toISOString() }); }
    catch (error) { return { success: false, persisted: false, error: (error as Error).message }; }
    const key = sanitized.word;

    this.proposals.set(key, sanitized);
    let persisted = true;
    try {
      persisted = await setToIDB(REVIEWED_PROPOSALS_KEY, Object.fromEntries(this.proposals));
    } catch {
      persisted = false;
    }
    this.notifySubscribers();
    return { success: true, persisted };
  }

  public async deleteProposal(word: string): Promise<{ success: boolean; persisted: boolean }> {
    await this.initialize();
    const key = normalizeLexiconKey(word);
    if (!this.proposals.has(key)) return { success: false, persisted: true };
    this.proposals.delete(key);
    let persisted = true;
    try {
      persisted = await setToIDB(REVIEWED_PROPOSALS_KEY, Object.fromEntries(this.proposals));
    } catch {
      persisted = false;
    }
    this.notifySubscribers();
    return { success: true, persisted };
  }

  public async bulkImport(data: string, format: 'json' | 'tsv' = 'tsv'): Promise<{ importedCount: number; totalCount: number; persisted: boolean }> {
    await this.initialize();
    let pairs: [string, unknown][];
    let vocabulary: string[] = [];
    const proposalUpdates = new Map<string, UserPronunciationProposal>();
    if (format === 'json') {
      const parsed: unknown = JSON.parse(data);
      if (Array.isArray(parsed)) pairs = parsed.map(item => {
        if (!item || typeof item !== 'object' || !('word' in item) || !('pattern' in item)) throw new Error('ہر اندراج میں word اور pattern درکار ہیں');
        return [String(item.word), item.pattern];
      });
      else if (parsed && typeof parsed === 'object' && 'schemaVersion' in parsed && (parsed.schemaVersion === 2 || parsed.schemaVersion === 3)) {
        if (!('customEntries' in parsed) || !parsed.customEntries || typeof parsed.customEntries !== 'object' || Array.isArray(parsed.customEntries)) throw new Error('غلط بیک اپ');
        pairs = Object.entries(parsed.customEntries);
        if ('vocabulary' in parsed) {
          if (!Array.isArray(parsed.vocabulary) || parsed.vocabulary.some(w => typeof w !== 'string' || !/^[\u0621-\u063a\u0641-\u064a\u066e-\u06d3]+$/u.test(w))) throw new Error('غلط لفظی فہرست');
          vocabulary = parsed.vocabulary;
        }
        if ('proposals' in parsed) {
          if (!parsed.proposals || typeof parsed.proposals !== 'object' || Array.isArray(parsed.proposals)) throw new Error('غلط تجاویز کا بیک اپ');
          for (const [word, proposal] of Object.entries(parsed.proposals)) {
            const validated = validateProposal(proposal, word);
            proposalUpdates.set(validated.word, validated);
          }
        }
      }
      else if (parsed && typeof parsed === 'object') pairs = Object.entries(parsed);
      else throw new Error('JSON میں الفاظ اور اوزان کی فہرست درکار ہے');
    } else pairs = data.split(/\r?\n/u).filter(l => l.trim() && !l.trim().startsWith('#')).map(line => {
      const parts = line.split(/\t|,|:/u);
      if (parts.length !== 2) throw new Error('ہر سطر میں لفظ اور وزن درکار ہیں');
      return [parts[0], parts[1]];
    });
    const updates = new Map<string, string[]>();
    for (const [raw, value] of pairs) {
      const word = normalizeLexiconKey(raw);
      const list = Array.isArray(value) ? value : [value];
      if (!word || !/^[\u0621-\u063a\u0641-\u064a\u066e-\u06d3]+$/u.test(word) || list.length === 0 || list.length > 16 || list.some(p => typeof p !== 'string')) throw new Error('غلط لغوی اندراج');
      const patterns = (list as string[]).map(p => p.replace(/\s/gu, ''));
      if (patterns.some(p => !/^[-=x]{1,64}$/u.test(p) || (p.match(/x/g) || []).length > 8)) throw new Error('وزن میں صرف -، = اور x استعمال کریں');
      updates.set(word, [...new Set(patterns)]);
    }
    // Validate the entire payload before mutating memory or persistence.
    for (const [word, proposal] of proposalUpdates) this.proposals.set(word, proposal);
    for (const [word, patterns] of updates) this.custom.set(word, patterns);
    for (const word of vocabulary) this.vocabulary.add(word);
    let persisted = true;
    if (vocabulary.length) persisted = await setToIDB(VOCABULARY_KEY, [...this.vocabulary]);
    if (updates.size) persisted = (await setToIDB(CUSTOM_ENTRIES_KEY, Object.fromEntries(this.custom))) && persisted;
    if (this.proposals.size) persisted = (await setToIDB(REVIEWED_PROPOSALS_KEY, Object.fromEntries(this.proposals))) && persisted;
    this.notifySubscribers();
    return { importedCount: updates.size + proposalUpdates.size, totalCount: this.getTotalWordCount(), persisted };
  }

  public async registerVocabulary(words: string[]): Promise<{ addedCount: number; persisted: boolean }> {
    await this.initialize();
    let added = 0;
    for (const raw of words) {
      const word = normalizeLexiconKey(raw);
      if (word && !/\s/u.test(word) && !this.vocabulary.has(word) && !dictionary[word] && !this.custom.has(word) && !this.proposals.has(word)) {
        this.vocabulary.add(word);
        added++;
      }
    }
    let persisted = true;
    if (added) { persisted = await setToIDB(VOCABULARY_KEY, [...this.vocabulary]); this.notifySubscribers(); }
    return { addedCount: added, persisted };
  }

  public getVocabularyStats() {
    const approvedCount = Array.from(this.proposals.values()).filter(p => p.status === 'approved').length;
    const unreviewedCount = Array.from(this.proposals.values()).filter(p => p.status === 'unreviewed').length;
    return {
      sourced: Object.keys(dictionary).length,
      quarantined: quarantinedEntries.length,
      userWeighted: this.custom.size,
      unweighted: this.vocabulary.size,
      approvedProposals: approvedCount,
      unreviewedProposals: unreviewedCount,
    };
  }

  public getTotalWordCount(): number {
    return new Set([
      ...Object.keys(dictionary),
      ...this.custom.keys(),
      ...this.vocabulary,
      ...this.proposals.keys()
    ]).size;
  }

  public getAllWordsWithScansion(): Map<string, string[]> {
    return new Map([...new Set([...Object.keys(dictionary), ...this.custom.keys(), ...this.vocabulary, ...this.proposals.keys()])].map(w => [w, this.getScansionVariants(w) || []]));
  }

  public exportLexiconAsJSON(): string {
    return JSON.stringify({
      schemaVersion: 2,
      source: { repository: this.metadata.source, revision: this.metadata.revision, license: this.metadata.license },
      customEntries: Object.fromEntries(this.custom),
      proposals: Object.fromEntries(this.proposals),
      vocabulary: [...this.vocabulary],
    }, null, 2);
  }

  public subscribe(cb: () => void): () => void { this.subscribers.add(cb); return () => this.subscribers.delete(cb); }
  private notifySubscribers(): void { this.revision++; for (const cb of this.subscribers) cb(); }
}
export const AroozLexiconService = new AroozLexiconServiceImpl();

