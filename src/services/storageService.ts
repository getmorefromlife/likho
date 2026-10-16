import { PoemDraft } from '../types/editor';

const DRAFTS_STORAGE_KEY = 'qalam_drafts_v1';
const PREFS_STORAGE_KEY = 'qalam_workspace_prefs';

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

export class StorageService {
  /**
   * Retrieves all saved drafts from local storage, initializing with sample if empty
   */
  static getDrafts(): PoemDraft[] {
    try {
      const data = localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (!data) {
        // Initialize with default specimen
        const initial = [SAMPLE_INITIAL_DRAFT];
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = false;
        parsed.forEach((d: PoemDraft) => {
          if (
            d.id === 'draft-initial-ghalib' &&
            (d.content.includes('ll ll') || d.content.includes('UUUU') || !d.content.includes('نقش فریادی'))
          ) {
            d.content = SAMPLE_INITIAL_DRAFT.content;
            d.title = SAMPLE_INITIAL_DRAFT.title;
            d.poet = SAMPLE_INITIAL_DRAFT.poet;
            changed = true;
          }
          // Self-heal any typo in title where نازہ was saved instead of تازہ
          if (d.title && d.title.includes('نازہ')) {
            d.title = d.title.replace(/نازہ/g, 'تازہ');
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
      return [SAMPLE_INITIAL_DRAFT];
    } catch (e) {
      console.error('Failed to load drafts from storage:', e);
      return [SAMPLE_INITIAL_DRAFT];
    }
  }

  /**
   * Saves or updates a draft
   */
  static saveDraft(draft: PoemDraft): boolean {
    try {
      const drafts = this.getDrafts();
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

  /**
   * Deletes a draft by ID
   */
  static deleteDraft(id: string): boolean {
    try {
      const drafts = this.getDrafts();
      const filtered = drafts.filter((d) => d.id !== id);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete draft:', e);
      return false;
    }
  }

  /**
   * Exports full JSON backup of drafts and workspace configuration
   */
  static exportBackup(): string {
    const drafts = this.getDrafts();
    const prefs = localStorage.getItem(PREFS_STORAGE_KEY) || '{}';

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      drafts,
      prefs: JSON.parse(prefs),
    };

    return JSON.stringify(backupData, null, 2);
  }

  /**
   * Restores data from a backup JSON string
   */
  static restoreBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.drafts && Array.isArray(parsed.drafts)) {
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(parsed.drafts));
      }
      if (parsed.prefs) {
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(parsed.prefs));
      }
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }
}
