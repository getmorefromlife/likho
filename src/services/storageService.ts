import { PoemDraft } from '../types/editor';

const DRAFTS_STORAGE_KEY = 'qalam_drafts_v1';
const PREFS_STORAGE_KEY = 'qalam_workspace_prefs';
const ACTIVE_DRAFT_KEY = 'qalam_active_draft_v1';
// Recovery snapshots are stored separately from the live keys. A restore never
// replaces the previous portfolio until its exact bytes have been preserved.
const RECOVERY_DRAFTS_KEY = 'qalam_recovery_drafts_v1';
const RECOVERY_PREFS_KEY = 'qalam_recovery_prefs_v1';
export const BACKUP_VERSION = '1.0';

const SAMPLE_INITIAL_DRAFT: PoemDraft = {
  id: 'draft-initial-ghalib',
  title: 'نقش فریادی ہے کس کی شوخیِ تحریر کا',
  poet: 'مرزا اسد اللہ خان غالب',
  form: 'ghazal',
  meterName: 'بحرِ رمل مثمن محذوف',
  meterRukn: 'فاعلاتن فاعلاتن فاعلاتن فاعلن',
  radif: 'کا',
  tags: ['کلاسیکی', 'غزل', 'معرفت'],
  createdAt: Date.now() - 86400000,
  updatedAt: Date.now(),
  qafiyaList: ['تحریر', 'تصویر', 'زنجیر', 'تقدیر', 'تدبیر', 'شمشیر', 'جاگیر', 'تعبیر'],
  content: `نقش فریادی ہے کس کی شوخیِ تحریر کا
کاغذی ہے پیرہن ہر پیکرِ تصویر کا

کاو کاوِ سخت جانی ہائے تنہائی نہ پوچھ
صبح کرنا شام کا لانا ہے جوئے شیر کا

جذبۂ بے اختیارِ شوق دیکھا چاہیے
سینۂ شمشیر سے باہر ہے دم شمشیر کا

آگہی دامِ شنیدن جس قدر چاہے بچھائے
مدعا عنقا ہے اپنے عالمِ تقریر کا

بسکہ ہوں غالب اسیری میں بھی آتش زیرِ پا
موئے آتش دیدہ ہے حلقہ مری زنجیر کا`,
};

export type PortfolioStatus = 'absent' | 'empty' | 'valid' | 'corrupt' | 'unavailable';

export interface PortfolioSnapshot {
  status: PortfolioStatus;
  drafts: PoemDraft[];
  /** Exact stored bytes, preserved for recovery/export. */
  raw: string | null;
  error?: string;
}

export interface RestoreResult {
  success: boolean;
  /** True when some keys were committed but a later step failed and rollback also failed. */
  partial?: boolean;
  /** True when the previous portfolio was preserved under the recovery key. */
  recoverySaved?: boolean;
  drafts?: PoemDraft[];
  error?: string;
}

/** Reject malformed stored data without rewriting or coercing the original payload. */
function isDraft(value: unknown): value is PoemDraft {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const d = value as Record<string, unknown>;
  return typeof d.id === 'string' && d.id.length > 0 &&
    ['title', 'poet', 'content'].every(field => typeof d[field] === 'string') &&
    ['ghazal', 'nazm', 'rubai', 'qataa', 'fard', 'prose'].includes(String(d.form)) &&
    ['tags', 'qafiyaList'].every(field => Array.isArray(d[field]) && (d[field] as unknown[]).every(v => typeof v === 'string')) &&
    ['createdAt', 'updatedAt'].every(field => typeof d[field] === 'number' && Number.isFinite(d[field])) &&
    ['meterName', 'meterRukn', 'radif'].every(field => d[field] === undefined || typeof d[field] === 'string') &&
    (d.voiceRecording === undefined || (
      typeof d.voiceRecording === 'object' && d.voiceRecording !== null &&
      typeof (d.voiceRecording as Record<string, unknown>).id === 'string' &&
      typeof (d.voiceRecording as Record<string, unknown>).blobDataUrl === 'string' &&
      typeof (d.voiceRecording as Record<string, unknown>).mimeType === 'string' &&
      typeof (d.voiceRecording as Record<string, unknown>).durationSeconds === 'number' &&
      Number.isFinite((d.voiceRecording as Record<string, unknown>).durationSeconds) &&
      typeof (d.voiceRecording as Record<string, unknown>).recordedAt === 'number' &&
      Number.isFinite((d.voiceRecording as Record<string, unknown>).recordedAt)
    ));
}

function isValidDraftList(value: unknown): value is PoemDraft[] {
  return Array.isArray(value) && value.every(isDraft) &&
    new Set((value as PoemDraft[]).map(d => d.id)).size === value.length;
}

function isValidPrefs(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  const strings: Record<string, string[]> = {
    theme: ['sepia', 'dark', 'white'],
    fontFamily: ['Noto Nastaliq Urdu', 'Jameel Noori Nastaliq', 'Mehr Nastaliq Web', 'Gulzar'],
    activePreset: ['classic', 'zen', 'swapped', 'bottom_dock', 'quiet', 'quiet_rhymes'],
    qafiyaDockPosition: ['top', 'bottom'],
    qafiyaMarkerStyle: ['strike', 'glow', 'check'],
  };
  for (const [field, allowed] of Object.entries(strings)) {
    if (p[field] !== undefined && (typeof p[field] !== 'string' || !allowed.includes(p[field] as string))) return false;
  }
  for (const field of ['fontSize', 'lineHeight', 'verticalSplitPct', 'horizontalSplitPct', 'qafiyaZoom']) {
    if (p[field] !== undefined && (typeof p[field] !== 'number' || !Number.isFinite(p[field]))) return false;
  }
  for (const field of ['isLocked', 'isZenMode', 'companionOpen', 'qafiyaTrayOpen', 'showLiveScansion']) {
    if (p[field] !== undefined && typeof p[field] !== 'boolean') return false;
  }
  return true;
}

function blankDraft(): PoemDraft {
  return {
    id: `poem-${Date.now()}`,
    title: 'نویدِ سحر',
    poet: 'شاعر',
    form: 'ghazal',
    meterName: 'بحرِ رمل مثمن محذوف',
    meterRukn: 'فاعلاتن فاعلاتن فاعلاتن فاعلن',
    radif: '',
    tags: ['غزل'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    qafiyaList: ['سحر', 'نظر', 'اثر', 'سفر', 'خبر'],
    content: '',
  };
}

export class StorageService {
  /** Pure read. Invalid/unreadable originals remain untouched; writes must revalidate. */
  static readPortfolio(): PortfolioSnapshot {
    let raw: string | null;
    try {
      raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    } catch (error) {
      return { status: 'unavailable', drafts: [], raw: null, error: (error as Error).message };
    }
    if (raw === null) return { status: 'absent', drafts: [], raw: null };
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isValidDraftList(parsed)) throw new Error('Invalid stored portfolio; original data has been preserved');
      return { status: parsed.length ? 'valid' : 'empty', drafts: parsed, raw };
    } catch (error) {
      return { status: 'corrupt', drafts: [], raw, error: (error as Error).message };
    }
  }

  /** Pure read. Invalid/unreadable originals remain untouched; writes must revalidate. */
  static getDrafts(): PoemDraft[] {
    const snapshot = this.readPortfolio();
    if (snapshot.status === 'corrupt' || snapshot.status === 'unavailable') {
      console.error('Cannot read portfolio; original data preserved:', snapshot.error);
    }
    return snapshot.drafts;
  }

  /** Explicit first-use seeding only. An empty or damaged existing store is never seeded. */
  static loadPortfolio(): PortfolioSnapshot {
    const snapshot = this.readPortfolio();
    if (snapshot.status !== 'absent') return snapshot;
    const initial = [{ ...SAMPLE_INITIAL_DRAFT, tags: [...SAMPLE_INITIAL_DRAFT.tags], qafiyaList: [...SAMPLE_INITIAL_DRAFT.qafiyaList] }];
    const raw = JSON.stringify(initial);
    // The specimen remains usable in memory if persistent storage is unavailable.
    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, raw);
      return { status: 'valid', drafts: initial, raw };
    } catch (error) {
      console.error('Specimen is available for this session only:', error);
      return { status: 'unavailable', drafts: initial, raw, error: (error as Error).message };
    }
  }

  static initializeDrafts(): PoemDraft[] {
    return this.loadPortfolio().drafts;
  }

  /** The draft an explicit new-editor fallback should use when nothing is stored. */
  static createBlankDraft(): PoemDraft {
    return blankDraft();
  }

  static getActiveDraftId(): string | null {
    try { return localStorage.getItem(ACTIVE_DRAFT_KEY); }
    catch { return null; }
  }

  static setActiveDraftId(id: string | null): void {
    try {
      if (id === null) localStorage.removeItem(ACTIVE_DRAFT_KEY);
      else localStorage.setItem(ACTIVE_DRAFT_KEY, id);
    } catch (error) {
      console.error('Failed to persist active draft identity:', error);
    }
  }

  /** Saves or updates a draft. Returns false without touching a damaged store. */
  static saveDraft(draft: PoemDraft): boolean {
    try {
      if (!isDraft(draft)) return false;
      const snapshot = this.readPortfolio();
      if (snapshot.status === 'corrupt' || snapshot.status === 'unavailable') return false;
      const drafts = snapshot.drafts;
      const existingIndex = drafts.findIndex((d) => d.id === draft.id);

      const updatedDraft = {
        ...draft,
        updatedAt: Date.now(),
      };

      if (existingIndex >= 0) {
        drafts[existingIndex] = updatedDraft;
      } else {
        drafts.unshift(updatedDraft);
      }

      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
      return true;
    } catch (e) {
      console.error('Failed to save draft:', e);
      return false;
    }
  }

  /** Deletes a draft by ID. Returns false without touching a damaged store. */
  static deleteDraft(id: string): boolean {
    try {
      const snapshot = this.readPortfolio();
      if (snapshot.status === 'corrupt' || snapshot.status === 'unavailable') return false;
      const filtered = snapshot.drafts.filter((d) => d.id !== id);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete draft:', e);
      return false;
    }
  }

  /**
   * Exports a versioned full-workspace backup. Preferences are omitted rather
   * than guessed when the stored value is unreadable.
   */
  static exportBackup(): string {
    const snapshot = this.readPortfolio();
    let prefs: unknown = {};
    try {
      const rawPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
      if (rawPrefs !== null) {
        const parsed: unknown = JSON.parse(rawPrefs);
        if (isValidPrefs(parsed)) prefs = parsed;
      }
    } catch {
      prefs = {};
    }

    const backupData = {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      drafts: snapshot.drafts,
      prefs,
    };

    return JSON.stringify(backupData, null, 2);
  }

  /**
   * Restores a validated versioned backup.
   *
   * Policy: explicit REPLACE of the whole portfolio and preferences. Collisions
   * are resolved by replacement. The exact previous payloads are written to
   * separate recovery keys before any live key is changed. localStorage has no
   * multi-key transaction, so a failed later write triggers a rollback; if the
   * rollback also fails the result is reported as partial rather than success.
   */
  static restoreBackup(jsonString: string): RestoreResult {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return { success: false, error: 'بیک اپ فائل درست JSON نہیں ہے۔' };
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { success: false, error: 'بیک اپ کی ساخت درست نہیں ہے۔' };
    }
    const backup = parsed as Record<string, unknown>;
    if (backup.version !== BACKUP_VERSION) {
      return { success: false, error: `غیر تعاون یافتہ بیک اپ ورژن: ${String(backup.version)}` };
    }
    if (!isValidDraftList(backup.drafts)) {
      return { success: false, error: 'بیک اپ میں مسودات درست یا منفرد نہیں ہیں؛ کچھ تبدیل نہیں کیا گیا۔' };
    }
    if (backup.prefs !== undefined && !isValidPrefs(backup.prefs)) {
      return { success: false, error: 'بیک اپ میں ترتیبات درست نہیں ہیں؛ کچھ تبدیل نہیں کیا گیا۔' };
    }

    const drafts = backup.drafts;
    const prefs = backup.prefs;

    let oldDraftsRaw: string | null = null;
    let oldPrefsRaw: string | null = null;
    try {
      oldDraftsRaw = localStorage.getItem(DRAFTS_STORAGE_KEY);
      oldPrefsRaw = localStorage.getItem(PREFS_STORAGE_KEY);
    } catch {
      return { success: false, error: 'موجودہ ڈیٹا پڑھا نہیں جا سکا؛ بحالی روک دی گئی۔' };
    }

    // Preserve before replacement. If the recovery copy cannot be written, stop.
    try {
      if (oldDraftsRaw !== null) localStorage.setItem(RECOVERY_DRAFTS_KEY, oldDraftsRaw);
      if (oldPrefsRaw !== null) localStorage.setItem(RECOVERY_PREFS_KEY, oldPrefsRaw);
    } catch (error) {
      return { success: false, error: `پرانے ڈیٹا کی بازیابی محفوظ نہیں ہو سکی؛ بحالی روک دی گئی۔ (${(error as Error).message})` };
    }
    const recoverySaved = oldDraftsRaw !== null || oldPrefsRaw !== null;

    const restoreValue = (key: string, raw: string | null) => {
      if (raw === null) localStorage.removeItem(key);
      else localStorage.setItem(key, raw);
    };

    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    } catch (error) {
      // Nothing live was changed yet.
      return { success: false, recoverySaved, error: `مسودات محفوظ نہیں ہو سکے؛ کچھ تبدیل نہیں کیا گیا۔ (${(error as Error).message})` };
    }

    if (prefs !== undefined) {
      try {
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
      } catch (error) {
        // Roll back the drafts write so an accepted partial result cannot remain.
        try {
          restoreValue(DRAFTS_STORAGE_KEY, oldDraftsRaw);
          return { success: false, recoverySaved, error: `ترتیبات محفوظ نہیں ہو سکیں؛ مسودات واپس بحال کر دیے گئے۔ (${(error as Error).message})` };
        } catch (rollbackError) {
          return {
            success: false,
            partial: true,
            recoverySaved,
            error: `ترتیبات محفوظ نہیں ہو سکیں اور مسودات واپس بحال نہیں ہو سکے۔ بازیابی بیک اپ دستیاب ہے۔ (${(rollbackError as Error).message})`,
          };
        }
      }
    }

    return { success: true, recoverySaved, drafts };
  }
}
