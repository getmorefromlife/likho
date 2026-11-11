import { WordSelectionArea } from '../common/WordSelectionArea';
import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Lock,
  Asterisk,
  Layers,
  ArrowLeftCircle,
  Check,
  RotateCcw,
  Sliders,
  Filter,
  Plus,
  Trash2,
  Ban,
  ListChecks,
  ChevronDown,
} from 'lucide-react';
import {
  LetterSlot,
  SlotState,
  URDU_ALPHABET,
  URDU_LETTER_FAMILIES,
  wordToLetterSlots,
  cycleSlotState,
  applyRhymePreset,
  querySlotRhymes,
} from '../../services/slotRhymeBuilder';

interface VisualSlotRhymeBuilderProps {
  initialWord?: string;
  onLoadToTray: (words: string[]) => void;
  fontFamily: string;
}

const COMMON_METERS = [
  { id: 'all', label: 'تمام اوزان (۵۸،۶۰۴ الفاظ)', pattern: '' },
  { id: 'fa-ool', label: 'فَعُولْ (- =)', pattern: '-=' },
  { id: 'fa-eeylat', label: 'فَعِیلَت / فَعُولُن (- = =)', pattern: '-==' },
  { id: 'fa-ilun', label: 'فَاعِلُن (= - =)', pattern: '=-=' },
  { id: 'fa-lun', label: 'فَعْلُن / مَفْعُولْ (= =)', pattern: '==' },
  { id: 'mustaf-ilun', label: 'مُسْتَفْعِلُن (= = - =)', pattern: '==-=' },
  { id: 'ma-fa-eelun', label: 'مَفَاعِیلُن (- = = =)', pattern: '-===' },
  { id: 'fa-i-latun', label: 'فَاعِلَاتُن (= - = =)', pattern: '=-==' },
];

export const VisualSlotRhymeBuilder: React.FC<VisualSlotRhymeBuilderProps> = ({
  initialWord = 'ایمان',
  onLoadToTray,
  fontFamily,
}) => {
  const [baseWord, setBaseWord] = useState(initialWord);
  const [slots, setSlots] = useState<LetterSlot[]>(() => wordToLetterSlots(initialWord));
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(0);
  const [exactLength, setExactLength] = useState(true);
  const [meterFilter, setMeterFilter] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Update slots when base word is changed
  const handleBaseWordChange = (newWord: string) => {
    setBaseWord(newWord);
    const nextSlots = wordToLetterSlots(newWord);
    setSlots(nextSlots);
    setActiveSlotIndex(nextSlots.length > 0 ? nextSlots.length - 1 : null);
  };

  // Select a slot to customize its alphabet options (or cycle if double-clicked)
  const handleSlotSelect = (index: number) => {
    setActiveSlotIndex((prev) => (prev === index ? index : index));
  };

  const handleQuickCycleSlot = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlots((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          state: cycleSlotState(updated[index].state),
        };
      }
      return updated;
    });
  };

  const updateSlotAt = (index: number, patch: Partial<LetterSlot>) => {
    setSlots((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      updated[index] = { ...updated[index], ...patch };
      return updated;
    });
  };

  // Toggle or pick a specific Urdu letter for the currently active slot
  const handlePickLetterForSlot = (index: number, letter: string) => {
    setSlots((prev) => {
      const updated = [...prev];
      const current = updated[index];
      if (!current) return prev;

      if (current.state === 'custom_set' || current.state === 'exclude_set') {
        const existing = current.customChars || [current.char];
        const nextChars = existing.includes(letter)
          ? existing.filter((c) => c !== letter)
          : [...existing, letter];
        updated[index] = {
          ...current,
          char: nextChars[0] || letter,
          customChars: nextChars.length > 0 ? nextChars : [letter],
        };
      } else {
        updated[index] = {
          ...current,
          char: letter,
          state: 'locked',
          customChars: [letter],
        };
      }
      return updated;
    });
  };

  // Apply a phonetic family to the active slot
  const handleApplyFamilyToSlot = (index: number, chars: string[]) => {
    updateSlotAt(index, {
      state: 'custom_set',
      char: chars[0] || 'ا',
      customChars: [...chars],
    });
  };

  // Add a new slot box at start or end
  const handleAddSlot = (position: 'start' | 'end') => {
    const newSlot: LetterSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      char: 'ا',
      state: 'any',
      customChars: ['ا'],
    };
    setSlots((prev) => {
      const next = position === 'start' ? [newSlot, ...prev] : [...prev, newSlot];
      setActiveSlotIndex(position === 'start' ? 0 : next.length - 1);
      return next;
    });
  };

  // Remove a slot box
  const handleRemoveSlot = (index: number) => {
    setSlots((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      setActiveSlotIndex(Math.min(index, next.length - 1));
      return next;
    });
  };

  // Presets
  const handlePreset = (preset: 'rawi_only' | 'radf_rawi' | 'tasees_dakhil') => {
    setSlots((prev) => applyRhymePreset(prev, preset));
  };

  // Live Query Execution
  const queryResult = useMemo(() => {
    return querySlotRhymes({
      slots,
      exactLength,
      meterFilter: meterFilter || undefined,
    });
  }, [slots, exactLength, meterFilter]);

  const handleLoadAll = () => {
    const words = queryResult.matches.map((m) => m.word);
    if (words.length > 0) {
      onLoadToTray(words);
      setIsLoaded(true);
      setTimeout(() => setIsLoaded(false), 2000);
    }
  };

  const handleLoadSingle = (word: string) => {
    onLoadToTray([word]);
  };

  // Slot badge helper
  const getSlotDetails = (slot: LetterSlot) => {
    const { state, char, customChars } = slot;
    switch (state) {
      case 'locked':
        return {
          title: `مستقل حرف: ${char}`,
          badgeText: char,
          style: 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] shadow-xs',
          subLabel: 'مستقل حرف',
          icon: <Lock className="w-2.5 h-2.5" />,
        };
      case 'any':
        return {
          title: 'کوئی بھی حرف (*)',
          badgeText: '*',
          style: 'bg-[var(--bg-card)] text-[var(--accent-gold)] border-dashed border-2 border-[var(--accent-gold)]',
          subLabel: 'کوئی بھی',
          icon: <Asterisk className="w-2.5 h-2.5" />,
        };
      case 'vowel':
        return {
          title: 'صرف حرفِ علت (آ، ا، و، ی، ے)',
          badgeText: 'علت',
          style: 'bg-sky-500/20 text-sky-400 border-2 border-sky-400 font-bold',
          subLabel: 'حرفِ علت',
          icon: <span className="text-[10px] font-bold">ع</span>,
        };
      case 'consonant':
        return {
          title: 'صرف حرفِ صحیح',
          badgeText: 'صحیح',
          style: 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 font-bold',
          subLabel: 'حرفِ صحیح',
          icon: <span className="text-[10px] font-bold">ص</span>,
        };
      case 'custom_set': {
        const list = customChars && customChars.length > 0 ? customChars : [char];
        return {
          title: `منتخب حروف: ${list.join('، ')}`,
          badgeText: list.slice(0, 3).join('·'),
          style: 'bg-purple-500/20 text-purple-300 border-2 border-purple-400 font-bold',
          subLabel: `${list.length} حروف`,
          icon: <ListChecks className="w-2.5 h-2.5" />,
        };
      }
      case 'exclude_set': {
        const list = customChars && customChars.length > 0 ? customChars : [char];
        return {
          title: `ان حروف کے سوا: ${list.join('، ')}`,
          badgeText: `≠${list.slice(0, 2).join('')}`,
          style: 'bg-rose-500/20 text-rose-300 border-2 border-rose-400 font-bold',
          subLabel: 'مستثنیٰ',
          icon: <Ban className="w-2.5 h-2.5" />,
        };
      }
    }
  };

  const activeSlot = activeSlotIndex !== null ? slots[activeSlotIndex] : null;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden select-none" dir="rtl">
      {/* Top Controls Box (Scrollable if expanded on compact viewports) */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2.5 overflow-y-auto max-h-[58%] custom-scrollbar flex-shrink-0">
        {/* Base Word Input + Add Slot Buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex-1 relative">
            <input
              type="text"
              value={baseWord}
              onChange={(e) => handleBaseWordChange(e.target.value)}
              placeholder="بنیادی لفظ لکھیں (مثلاً: ایمان، کلام، بہار) یا نیچے خانوں سے حروف چنیں..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq text-right shadow-2xs"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAddSlot('start')}
            className="px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-nastaliq text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] flex items-center gap-1"
            title="شروع میں نیا خانہ شامل کریں"
          >
            <Plus className="w-3 h-3" />
            <span>خانہ</span>
          </button>
          <button
            type="button"
            onClick={() => handleBaseWordChange('ایمان')}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-card)]"
            title="ری سیٹ کریں"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Interactive Letter Slots */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-nastaliq text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[var(--accent-gold)]" />
              <span>کسی بھی خانے پر کلک کر کے اس خانے کے لیے اردو حروفِ تہجی منتخب کریں:</span>
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              کل خانے: {slots.length}
            </span>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 py-2.5 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xs">
            {slots.map((slot, sIdx) => {
              const details = getSlotDetails(slot);
              const isSelected = activeSlotIndex === sIdx;

              return (
                <div
                  key={slot.id}
                  onClick={() => handleSlotSelect(sIdx)}
                  className={`relative flex flex-col items-center justify-between min-w-[54px] h-18 p-1.5 rounded-xl transition-all cursor-pointer border ${
                    details.style
                  } ${
                    isSelected
                      ? 'ring-2 ring-[var(--accent-gold)] ring-offset-2 ring-offset-[var(--bg-card)] scale-105'
                      : 'opacity-90 hover:opacity-100'
                  }`}
                  title={details.title}
                >
                  <div className="flex items-center justify-between w-full text-[10px] opacity-85 gap-1">
                    <span className="font-mono text-[9px]">#{sIdx + 1}</span>
                    <button
                      type="button"
                      onClick={(e) => handleQuickCycleSlot(sIdx, e)}
                      className="px-1 rounded bg-black/15 hover:bg-black/30 text-[9px] flex items-center gap-0.5"
                      title="فوری تبدیلی (مستقل / * / علت / صحیح)"
                    >
                      {details.icon}
                    </button>
                  </div>

                  <span
                    style={{ fontFamily }}
                    className="text-lg font-bold font-nastaliq my-auto leading-none px-1"
                  >
                    {details.badgeText}
                  </span>

                  <span className="text-[9px] font-nastaliq opacity-95 truncate max-w-[50px]">
                    {details.subLabel}
                  </span>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => handleAddSlot('end')}
              className="flex flex-col items-center justify-center min-w-[42px] h-18 p-1.5 rounded-xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-all"
              title="آخر میں نیا حرف خانہ شامل کریں"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[9px] font-nastaliq mt-1">نیا خانہ</span>
            </button>
          </div>
        </div>

        {/* Per-Slot Alphabet & Rule Customizer Panel */}
        {activeSlot && activeSlotIndex !== null && (
          <div
            data-testid="slot-alphabet-picker"
            className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--accent-gold)]/40 space-y-2.5 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[var(--border-subtle)]/60">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] text-xs font-bold font-nastaliq">
                  خانہ #{activeSlotIndex + 1} کے اختیارات
                </span>
                <span className="text-[11px] font-nastaliq text-[var(--text-secondary)]">
                  اس خانے میں کون سا حرف یا حروف کا گروپ آ سکتا ہے؟
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(activeSlotIndex)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-nastaliq"
                    title="یہ خانہ حذف کریں"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>خانہ ہٹائیں</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveSlotIndex(null)}
                  className="px-2 py-0.5 rounded-lg border border-[var(--border-subtle)] text-[10px] font-nastaliq text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  بند کریں <ChevronDown className="w-2.5 h-2.5 inline" />
                </button>
              </div>
            </div>

            {/* 6 Slot Mode Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-nastaliq">
              {(
                [
                  { id: 'locked', label: '🔒 ایک مخصوص حرف' },
                  { id: 'custom_set', label: '🔠 چند منتخب حروف (مثلاً ب، پ، ت)' },
                  { id: 'exclude_set', label: '🚫 یہ حروف نہ ہوں (مستثنیٰ)' },
                  { id: 'any', label: '✳️ کوئی بھی حرف (*)' },
                  { id: 'vowel', label: '💧 صرف حرفِ علت (آ، ا، و، ی، ے)' },
                  { id: 'consonant', label: '🧱 صرف حرفِ صحیح' },
                ] as { id: SlotState; label: string }[]
              ).map((mode) => {
                const isActive = activeSlot.state === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      updateSlotAt(activeSlotIndex, {
                        state: mode.id,
                        customChars:
                          activeSlot.customChars && activeSlot.customChars.length > 0
                            ? activeSlot.customChars
                            : [activeSlot.char],
                      })
                    }
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]/60'
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>

            {/* Interactive 40-Letter Urdu Alphabet Grid for this box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-nastaliq text-[var(--text-muted)]">
                <span>
                  {activeSlot.state === 'custom_set'
                    ? 'متعدد حروف پر کلک کر کے اس خانے کا مجموعہ بنائیں:'
                    : activeSlot.state === 'exclude_set'
                    ? 'جن حروف کو اس خانے سے خارج کرنا ہے ان پر کلک کریں:'
                    : 'کسی بھی حرف پر کلک کر کے اس خانے میں مقفل کریں:'}
                </span>
                {(activeSlot.state === 'custom_set' || activeSlot.state === 'exclude_set') && (
                  <span className="text-[var(--accent-gold)] font-bold">
                    منتخب: {(activeSlot.customChars || [activeSlot.char]).join('، ')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-10 sm:grid-cols-14 gap-1 p-2 rounded-xl bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)]">
                {URDU_ALPHABET.map((letter) => {
                  const isMulti =
                    activeSlot.state === 'custom_set' || activeSlot.state === 'exclude_set';
                  const selectedChars = activeSlot.customChars || [activeSlot.char];
                  const isPicked = isMulti
                    ? selectedChars.includes(letter)
                    : activeSlot.state === 'locked' && activeSlot.char === letter;

                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => handlePickLetterForSlot(activeSlotIndex, letter)}
                      style={{ fontFamily }}
                      className={`h-8 rounded-lg text-sm font-nastaliq font-bold transition-all flex items-center justify-center border ${
                        isPicked
                          ? activeSlot.state === 'exclude_set'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-2xs scale-105'
                            : 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] shadow-2xs scale-105'
                          : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
                      }`}
                      title={`حرف "${letter}" چنیں`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* One-Click Phonetic / Poetic Sound Families for this box */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-nastaliq text-[var(--text-muted)]">
                ہم مخرج / صوتی گروپ:
              </span>
              {URDU_LETTER_FAMILIES.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => handleApplyFamilyToSlot(activeSlotIndex, fam.chars)}
                  className="px-2 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] text-[10px] font-nastaliq text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  title={fam.desc}
                >
                  {fam.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Classical Presets Bar + Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-nastaliq">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[var(--text-muted)] font-bold">پری سیٹس:</span>
            <button
              type="button"
              onClick={() => handlePreset('rawi_only')}
              className="px-2 py-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] text-[11px]"
            >
              🎯 صرف حرفِ روی
            </button>
            <button
              type="button"
              onClick={() => handlePreset('radf_rawi')}
              className="px-2 py-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] text-[11px]"
            >
              ✨ مردف (ردف و روی)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('tasees_dakhil')}
              className="px-2 py-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] text-[11px]"
            >
              📜 تاسیس و دخیل
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Exact Length Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-nastaliq text-[11px] text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={exactLength}
                onChange={(e) => setExactLength(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)] cursor-pointer"
              />
              <span>صرف {slots.length} حروف کے الفاظ</span>
            </label>

            {/* Meter Filter */}
            <div className="flex items-center gap-1">
              <Filter className="w-3 h-3 text-[var(--accent-gold)]" />
              <select
                value={meterFilter}
                onChange={(e) => setMeterFilter(e.target.value)}
                className="text-[11px] font-nastaliq px-2 py-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
              >
                {COMMON_METERS.map((m) => (
                  <option key={m.id} value={m.pattern}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="px-3.5 py-2 bg-[var(--bg-subtle)]/70 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs font-nastaliq flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span className="font-bold text-[var(--text-primary)]">
            دریافت شدہ نتائج: {queryResult.totalMatches.toLocaleString()} قوافی
          </span>
          <span className="text-[10px] font-mono text-[var(--text-muted)] dir-ltr hidden sm:inline">
            ({queryResult.regexString})
          </span>
        </div>

        {queryResult.totalMatches > 0 && (
          <button
            type="button"
            onClick={handleLoadAll}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-nastaliq font-bold transition-all border ${
              isLoaded
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/90 shadow-xs'
            }`}
          >
            {isLoaded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>قوافی منتقل ہو گئے</span>
              </>
            ) : (
              <>
                <ArrowLeftCircle className="w-3.5 h-3.5" />
                <span>یہ تمام قوافی منتخب کریں</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Results Grid */}
      <WordSelectionArea
        id="slots"
        label="قالب کے قوافی"
        resetKey={queryResult.matches.map((m) => m.word).join('|')}
        onLoadSelected={onLoadToTray}
        className="flex-1 min-h-0 overflow-y-auto p-3.5 pb-14 space-y-2 custom-scrollbar overscroll-contain"
      >
        {queryResult.matches.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {queryResult.matches.map((item, idx) => (
              <button
                key={`${item.word}-${idx}`}
                data-selectable-id={`${idx}:${item.word}`}
                data-selectable-word={item.word}
                type="button"
                onClick={() => handleLoadSingle(item.word)}
                style={{ fontFamily }}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 text-[var(--text-primary)] font-nastaliq text-xs transition-all shadow-2xs"
                title={`کلک کر کے اپنے قوافی میں شامل فرمائیں۔ وزن: ${item.afail} ${item.pattern ? `(${item.pattern})` : ''}`}
              >
                <span className="text-sm font-bold">{item.word}</span>
                {item.pattern && (
                  <span
                    dir="rtl"
                    title="دائیں سے بائیں: پہلا ہجا دائیں جانب"
                    className="inline-flex items-center gap-0.5 text-[10px] font-mono text-[var(--accent-gold)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded opacity-75 group-hover:opacity-100"
                  >
                    {item.pattern.split('').map((sym, sIdx) => (
                      <span key={sIdx}>{sym}</span>
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-nastaliq text-[var(--text-muted)] space-y-2">
            <Layers className="w-8 h-8 text-[var(--text-muted)]/30 mx-auto" />
            <p className="font-bold text-sm text-[var(--text-secondary)]">
              اس قالب (Pattern) پر کوئی قافیہ دریافت نہیں ہوا
            </p>
            <p className="text-[11px]">
              کسی خانے پر کلک کر کے مزید حروف منتخب کریں، وائلڈ کارڈ (*) لگائیں یا طوالت کا فلٹر ہٹا دیں۔
            </p>
          </div>
        )}
      </WordSelectionArea>
    </div>
  );
};
