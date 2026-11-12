import { useState, useCallback, useEffect, useRef } from 'react';
import { PoemDraft, PoeticForm, VoiceRecordingMeta } from '../types/editor';
import { StorageService } from '../services/storageService';
import { cleanPastedUrduText, calculatePoemStats } from '../services/unicodeNormalizer';

export type PersistenceState = 'idle' | 'dirty' | 'saving' | 'saved' | 'session-only' | 'failed';

export interface StorageIssue {
  status: 'corrupt' | 'unavailable';
  raw: string | null;
  error: string;
}

export function usePoemEditor(initialDraft?: PoemDraft) {
  const [initial] = useState(() => {
    const snapshot = StorageService.loadPortfolio();
    const activeId = StorageService.getActiveDraftId();
    const activeDraft = activeId ? snapshot.drafts.find((d) => d.id === activeId) : undefined;
    const draft = initialDraft || activeDraft || snapshot.drafts[0] || StorageService.createBlankDraft();
    const issue: StorageIssue | null =
      snapshot.status === 'corrupt' || snapshot.status === 'unavailable'
        ? { status: snapshot.status, raw: snapshot.raw, error: snapshot.error || 'ذخیرہ دستیاب نہیں ہے' }
        : null;
    return { draft, issue };
  });

  const [storageIssue, setStorageIssue] = useState<StorageIssue | null>(initial.issue);
  const [currentDraft, setCurrentDraft] = useState<PoemDraft>(initial.draft);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [history, setHistory] = useState<string[]>([initial.draft.content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [saveState, setSaveState] = useState<PersistenceState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [committedRevision, setCommittedRevision] = useState(0);

  const currentDraftRef = useRef<PoemDraft>(initial.draft);
  // Opening an existing portfolio or an empty fallback is not a user edit.
  const loadedDraftRef = useRef<PoemDraft>(initial.draft);
  const revisionRef = useRef(0);
  const committedRevisionRef = useRef(0);
  const dirtyRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  /** Write the latest revision and only call it saved when that revision commits. */
  const performSave = useCallback((): boolean => {
    const draft = currentDraftRef.current;
    const revisionAtSave = revisionRef.current;
    setSaveState('saving');
    const persisted = StorageService.saveDraft(draft);

    if (persisted) {
      committedRevisionRef.current = revisionAtSave;
      setCommittedRevision(revisionAtSave);
      setSaveError(null);
      StorageService.setActiveDraftId(draft.id);
      if (revisionRef.current === revisionAtSave) {
        dirtyRef.current = false;
        setSaveState('saved');
      } else {
        // A newer revision arrived while writing; it is still unsaved.
        setSaveState('dirty');
      }
      return true;
    }

    setSaveState('session-only');
    setSaveError('مسودہ محفوظ نہیں ہو سکا؛ متن اس نشست میں موجود ہے۔ دوبارہ کوشش کریں یا برآمد کریں۔');
    return false;
  }, []);

  /** Apply one user-visible edit and immediately invalidate the saved label. */
  const applyEdit = useCallback((updater: (prev: PoemDraft) => PoemDraft) => {
    const previous = currentDraftRef.current;
    const next = updater(previous);
    if (next === previous) return;
    currentDraftRef.current = next;
    revisionRef.current += 1;
    dirtyRef.current = true;
    setRevision(revisionRef.current);
    setCurrentDraft(next);
    setSaveState('dirty');
    setSaveError(null);
  }, []);

  // Auto-save debounce. Pristine loading (including a restored active draft) never saves.
  useEffect(() => {
    currentDraftRef.current = currentDraft;
    if (currentDraft === loadedDraftRef.current || !dirtyRef.current) return;

    clearPendingSave();
    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      performSave();
    }, 1200);

    return clearPendingSave;
  }, [currentDraft, performSave, clearPendingSave]);

  // Best-effort leave warning only while an edited revision is uncommitted.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const retrySave = useCallback(() => {
    clearPendingSave();
    performSave();
  }, [clearPendingSave, performSave]);

  // Push to undo/redo history
  const updateContentWithHistory = useCallback((newContent: string) => {
    applyEdit((prev) => ({
      ...prev,
      content: newContent,
      updatedAt: Date.now(),
    }));

    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newContent];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [applyEdit, historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const prevContent = history[nextIndex];
      setHistoryIndex(nextIndex);
      applyEdit((prev) => ({ ...prev, content: prevContent, updatedAt: Date.now() }));
    }
  }, [historyIndex, history, applyEdit]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextContent = history[nextIndex];
      setHistoryIndex(nextIndex);
      applyEdit((prev) => ({ ...prev, content: nextContent, updatedAt: Date.now() }));
    }
  }, [historyIndex, history, applyEdit]);

  // Update draft fields
  const setTitle = useCallback((title: string) => {
    applyEdit((prev) => ({ ...prev, title }));
  }, [applyEdit]);

  const setPoet = useCallback((poet: string) => {
    applyEdit((prev) => ({ ...prev, poet }));
  }, [applyEdit]);

  const setForm = useCallback((form: PoeticForm) => {
    applyEdit((prev) => ({ ...prev, form }));
  }, [applyEdit]);

  const setMeter = useCallback((name: string, rukn: string) => {
    applyEdit((prev) => ({ ...prev, meterName: name, meterRukn: rukn }));
  }, [applyEdit]);

  const setQafiyaList = useCallback((words: string[]) => {
    applyEdit(prev => ({ ...prev, qafiyaList: words }));
  }, [applyEdit]);

  const setRadif = useCallback((radif: string) => {
    applyEdit((prev) => ({ ...prev, radif }));
  }, [applyEdit]);

  const setVoiceRecording = useCallback((recording?: VoiceRecordingMeta) => {
    applyEdit((prev) => ({
      ...prev,
      voiceRecording: recording,
      updatedAt: Date.now(),
    }));
  }, [applyEdit]);

  // Erab / Diacritic insertion helper at cursor position
  const insertErab = useCallback(
    (erabChar: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        updateContentWithHistory(currentDraftRef.current.content + erabChar);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = currentDraftRef.current.content;

      const newContent = content.substring(0, start) + erabChar + content.substring(end);
      updateContentWithHistory(newContent);

      // Restore cursor right after inserted diacritic
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + erabChar.length, start + erabChar.length);
      }, 0);
    },
    [updateContentWithHistory]
  );

  // Couplet template insertion helper (Matla, Sher, Maqta)
  const insertCoupletTemplate = useCallback(
    (type: 'matla' | 'sher' | 'maqta') => {
      const labels = {
        matla: '— مطلع —\nپہلا مصرع یہاں تحریر فرمائیں\nدوسرا مصرع یہاں تحریر فرمائیں\n',
        sher: '\nپہلا مصرع\nدوسرا مصرع\n',
        maqta: '\n— مقطع —\nپہلا مصرع (مع تخلص)\nدوسرا مصرع\n',
      };

      const template = labels[type];
      const content = currentDraftRef.current.content;
      const newContent = content ? `${content}\n${template}` : template;
      updateContentWithHistory(newContent);
    },
    [updateContentWithHistory]
  );

  // Universal paste handler: Cleans AI artifacts (ChatGPT, Claude, Gemini) and maintains pure Nastaliq
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const rawText = e.clipboardData.getData('text/plain');
      const sanitized = cleanPastedUrduText(rawText);

      const textarea = textareaRef.current;
      if (!textarea) {
        updateContentWithHistory(currentDraftRef.current.content + sanitized);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = currentDraftRef.current.content;

      const newContent = content.substring(0, start) + sanitized + content.substring(end);
      updateContentWithHistory(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + sanitized.length, start + sanitized.length);
      }, 0);
    },
    [updateContentWithHistory]
  );

  // Selection change handler for thesaurus lookup
  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selected = target.value.substring(target.selectionStart, target.selectionEnd).trim();
    if (selected && selected.length >= 2 && selected.length <= 15) {
      setSelectedWord(selected);
    }
  }, []);

  const adoptDraft = useCallback((draft: PoemDraft, activeId: string | null) => {
    loadedDraftRef.current = draft;
    currentDraftRef.current = draft;
    revisionRef.current = 0;
    committedRevisionRef.current = 0;
    dirtyRef.current = false;
    setRevision(0);
    setCommittedRevision(0);
    setSaveState('idle');
    setSaveError(null);
    setCurrentDraft(draft);
    setHistory([draft.content]);
    setHistoryIndex(0);
    StorageService.setActiveDraftId(activeId);
  }, []);

  // Start fresh new poem. It stays pristine (and unsaved) until the first edit.
  const startNewPoem = useCallback(() => {
    if (dirtyRef.current && !StorageService.saveDraft(currentDraftRef.current)) {
      setSaveState('failed');
      setSaveError('موجودہ تبدیلیاں محفوظ نہیں ہو سکیں؛ نیا کلام شروع نہیں کیا گیا۔');
      return;
    }
    clearPendingSave();
    const newDraft: PoemDraft = {
      id: `poem-${Date.now()}`,
      title: 'تازہ کلام',
      poet: currentDraftRef.current.poet || 'شاعر',
      form: 'ghazal',
      tags: ['غزل'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      qafiyaList: [],
      content: '',
    };
    adoptDraft(newDraft, null);
  }, [adoptDraft, clearPendingSave]);

  // Load an existing draft. Refuse to discard an uncommitted revision silently.
  const loadDraft = useCallback((draft: PoemDraft) => {
    if (draft.id === currentDraftRef.current.id && dirtyRef.current) {
      // Selecting the already-open draft must not replace it with a stale list copy.
      clearPendingSave();
      performSave();
      return;
    }
    if (dirtyRef.current && !StorageService.saveDraft(currentDraftRef.current)) {
      setSaveState('failed');
      setSaveError('موجودہ تبدیلیاں محفوظ نہیں ہو سکیں؛ مسودہ تبدیل نہیں کیا گیا۔');
      return;
    }
    clearPendingSave();
    adoptDraft(draft, draft.id);
  }, [adoptDraft, clearPendingSave, performSave]);

  /**
   * Delete through the editor so the active draft's pending autosave is cancelled
   * and it cannot be resurrected after deletion.
   */
  const deleteDraft = useCallback((id: string): boolean => {
    const wasActive = currentDraftRef.current.id === id;
    const deleted = StorageService.deleteDraft(id);
    if (!deleted) {
      setSaveState('failed');
      setSaveError('مسودہ حذف نہیں ہو سکا؛ ذخیرہ دستیاب نہیں ہے۔');
      return false;
    }

    if (wasActive) {
      // Cancel only the deleted draft's pending write; other drafts keep their timers.
      clearPendingSave();
      const remaining = StorageService.getDrafts();
      if (remaining.length > 0) {
        adoptDraft(remaining[0], remaining[0].id);
      } else {
        adoptDraft(StorageService.createBlankDraft(), null);
      }
    }
    return true;
  }, [adoptDraft, clearPendingSave]);

  /** Adopt a validated restored portfolio without writing over it. */
  const reloadPortfolio = useCallback((drafts: PoemDraft[]) => {
    clearPendingSave();
    const activeId = StorageService.getActiveDraftId();
    const next = drafts.find((d) => d.id === activeId) || drafts[0] || StorageService.createBlankDraft();
    adoptDraft(next, drafts.length > 0 ? next.id : null);
    setStorageIssue(null);
  }, [adoptDraft, clearPendingSave]);

  const dismissStorageIssue = useCallback(() => setStorageIssue(null), []);

  // Live Statistics
  const stats = calculatePoemStats(currentDraft.content);
  const isDirty = revision !== committedRevision || saveState === 'dirty';

  return {
    currentDraft,
    textareaRef,
    stats,
    selectedWord,
    setSelectedWord,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    setTitle,
    setPoet,
    setForm,
    setMeter,
    setRadif,
    setQafiyaList,
    setVoiceRecording,
    updateContent: updateContentWithHistory,
    insertErab,
    insertCoupletTemplate,
    handlePaste,
    handleSelect,
    startNewPoem,
    loadDraft,
    deleteDraft,
    reloadPortfolio,
    saveState,
    saveError,
    revision,
    committedRevision,
    isDirty,
    retrySave,
    storageIssue,
    dismissStorageIssue,
  };
}
