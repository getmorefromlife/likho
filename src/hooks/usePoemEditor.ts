import { useState, useCallback, useEffect, useRef } from 'react';
import { PoemDraft, PoeticForm } from '../types/editor';
import { StorageService } from '../services/storageService';
import { cleanPastedUrduText, calculatePoemStats } from '../services/unicodeNormalizer';

export function usePoemEditor(initialDraft?: PoemDraft) {
  const drafts = StorageService.getDrafts();
  const defaultDraft: PoemDraft =
    initialDraft ||
    drafts[0] || {
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

  const [currentDraft, setCurrentDraft] = useState<PoemDraft>(() => {
    const draft = { ...defaultDraft };
    if (draft.title && draft.title.includes('نازہ')) {
      draft.title = draft.title.replace(/نازہ/g, 'تازہ');
    }
    return draft;
  });
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [history, setHistory] = useState<string[]>([defaultDraft.content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-save debounce ref
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Push to undo/redo history
  const updateContentWithHistory = useCallback((newContent: string) => {
    setCurrentDraft((prev) => ({
      ...prev,
      content: newContent,
      updatedAt: Date.now(),
    }));

    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newContent];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const prevContent = history[nextIndex];
      setHistoryIndex(nextIndex);
      setCurrentDraft((prev) => ({ ...prev, content: prevContent }));
    }
  }, [historyIndex, history]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextContent = history[nextIndex];
      setHistoryIndex(nextIndex);
      setCurrentDraft((prev) => ({ ...prev, content: nextContent }));
    }
  }, [historyIndex, history]);

  // Auto-save to StorageService
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      StorageService.saveDraft(currentDraft);
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [currentDraft]);

  // Update draft fields
  const setTitle = useCallback((title: string) => {
    setCurrentDraft((prev) => ({ ...prev, title }));
  }, []);

  const setPoet = useCallback((poet: string) => {
    setCurrentDraft((prev) => ({ ...prev, poet }));
  }, []);

  const setForm = useCallback((form: PoeticForm) => {
    setCurrentDraft((prev) => ({ ...prev, form }));
  }, []);

  const setMeter = useCallback((name: string, rukn: string) => {
    setCurrentDraft((prev) => ({ ...prev, meterName: name, meterRukn: rukn }));
  }, []);

  const setRadif = useCallback((radif: string) => {
    setCurrentDraft((prev) => ({ ...prev, radif }));
  }, []);

  // Erab / Diacritic insertion helper at cursor position
  const insertErab = useCallback(
    (erabChar: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        updateContentWithHistory(currentDraft.content + erabChar);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = currentDraft.content;

      const newContent = content.substring(0, start) + erabChar + content.substring(end);
      updateContentWithHistory(newContent);

      // Restore cursor right after inserted diacritic
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + erabChar.length, start + erabChar.length);
      }, 0);
    },
    [currentDraft.content, updateContentWithHistory]
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
      const newContent = currentDraft.content ? `${currentDraft.content}\n${template}` : template;
      updateContentWithHistory(newContent);
    },
    [currentDraft.content, updateContentWithHistory]
  );

  // Universal paste handler: Cleans AI artifacts (ChatGPT, Claude, Gemini) and maintains pure Nastaliq
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const rawText = e.clipboardData.getData('text/plain');
      const sanitized = cleanPastedUrduText(rawText);

      const textarea = textareaRef.current;
      if (!textarea) {
        updateContentWithHistory(currentDraft.content + sanitized);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = currentDraft.content;

      const newContent = content.substring(0, start) + sanitized + content.substring(end);
      updateContentWithHistory(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + sanitized.length, start + sanitized.length);
      }, 0);
    },
    [currentDraft.content, updateContentWithHistory]
  );

  // Selection change handler for thesaurus lookup
  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selected = target.value.substring(target.selectionStart, target.selectionEnd).trim();
    if (selected && selected.length >= 2 && selected.length <= 15) {
      setSelectedWord(selected);
    }
  }, []);

  // Start fresh new poem
  const startNewPoem = useCallback(() => {
    const newDraft: PoemDraft = {
      id: `poem-${Date.now()}`,
      title: 'تازہ کلام',
      poet: currentDraft.poet || 'شاعر',
      form: 'ghazal',
      tags: ['غزل'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      qafiyaList: [],
      content: '',
    };
    setCurrentDraft(newDraft);
    setHistory(['']);
    setHistoryIndex(0);
  }, [currentDraft.poet]);

  // Load an existing draft
  const loadDraft = useCallback((draft: PoemDraft) => {
    setCurrentDraft(draft);
    setHistory([draft.content]);
    setHistoryIndex(0);
  }, []);

  // Live Statistics
  const stats = calculatePoemStats(currentDraft.content);

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
    updateContent: updateContentWithHistory,
    insertErab,
    insertCoupletTemplate,
    handlePaste,
    handleSelect,
    startNewPoem,
    loadDraft,
  };
}
