import React, { useState, useMemo, useEffect } from 'react';
import {
  Music,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeftRight,
  Edit3,
} from 'lucide-react';
import { ScansionResult, patternToClassicalRukn, CLASSICAL_BUHUR, scanPoetryLine } from '../../services/aroozEngine';
import { AroozLexiconService } from '../../services/aroozLexiconService';
import { readingRuleLabel } from '../../services/prosodicReadings';
import {
  diagnoseAndRepairMeter,
  MeterDiagnosticReport,
  RepairContextOptions,
  RepairSuggestion,
} from '../../services/meterRepairEngine';
import {
  getWordIntentionMenuData,
  evaluateWithPinnedReadings,
  resolveActiveMeter,
  parseCustomBaharSpec,
  ARKAN_TO_PATTERN,
  POET_ENFORCED_BAHAR_RULE,
  POET_ENFORCED_BAHAR_LABEL,
  CompoundSplitChoice,
  PoeticSpellingChoice,
  WordReadingChoice,
} from '../../services/wordIntentionService';
import { QuickScansionCorrectionModal } from '../companion/QuickScansionCorrectionModal';
import { ProsodicPatternView } from '../common/ProsodicPatternView';
import { BaharBeatPlayer } from '../common/BaharBeatPlayer';
import { PlaybackTick } from '../../services/rhythmicCadenceAudioService';

interface ScansionCardProps {
  scansion?: ScansionResult;
  fontFamily: string;
  lineText?: string;
  lineIndex?: number;
  preferredMeterId?: string;
  poemMeterName?: string;
  poemMeterRukn?: string;
  onEnforcePoemMeter?: (meterName: string, meterRukn: string) => void;
  radif?: string;
  rhymeAnchorWord?: string;
  repairContext?: RepairContextOptions;
  onApplyRepair?: (repairedLine: string) => void;
  onApplyLineChange?: (lineIndex: number, repairedLine: string) => void;
}

const CUSTOM_BAHAR_SELECT_VALUE = '__CUSTOM_POET_BAHAR__';
const QUICK_ARKAN_CHIPS = [
  'فعولن',
  'فاعلن',
  'فاعلاتن',
  'مفاعیلن',
  'مستفعلن',
  'مفعول',
  'فاعلات',
  'مفاعیل',
  'مفاعلن',
  'فعلاتن',
  'فعلن',
  'مفتعلن',
  'فع',
];

const ScansionCardInner: React.FC<ScansionCardProps> = ({
  scansion,
  fontFamily,
  lineText = '',
  lineIndex,
  preferredMeterId,
  poemMeterName,
  poemMeterRukn,
  onEnforcePoemMeter,
  radif,
  rhymeAnchorWord,
  repairContext,
  onApplyRepair,
  onApplyLineChange,
}) => {
  const [lexiconRevision, setLexiconRevision] = useState(AroozLexiconService.getRevision());
  useEffect(() => AroozLexiconService.subscribe(() => setLexiconRevision(AroozLexiconService.getRevision())), []);
  const [selectedMeterId, setSelectedMeterId] = useState('');
  const [isCustomBaharOpen, setIsCustomBaharOpen] = useState(false);
  const [customBaharInput, setCustomBaharInput] = useState(poemMeterRukn || '');
  const [customBaharName, setCustomBaharName] = useState(poemMeterName || '');
  const [strictEnforceBahar, setStrictEnforceBahar] = useState(false);
  const [savedWordToast, setSavedWordToast] = useState<string | null>(null);
  const [activeBeatTick, setActiveBeatTick] = useState<PlaybackTick | null>(null);

  // Resolve poem-level or card-level enforced meter (catalog or custom poet-defined Arkan)
  const resolvedEnforcedMeter = useMemo(
    () =>
      resolveActiveMeter(
        selectedMeterId || preferredMeterId,
        poemMeterName,
        poemMeterRukn
      ),
    [selectedMeterId, preferredMeterId, poemMeterName, poemMeterRukn]
  );

  const catalogMeterId = useMemo(() => {
    if (selectedMeterId && CLASSICAL_BUHUR.some((m) => m.id === selectedMeterId)) {
      return selectedMeterId;
    }
    if (preferredMeterId && CLASSICAL_BUHUR.some((m) => m.id === preferredMeterId)) {
      return preferredMeterId;
    }
    if (
      resolvedEnforcedMeter &&
      CLASSICAL_BUHUR.some((m) => m.id === resolvedEnforcedMeter.id)
    ) {
      return resolvedEnforcedMeter.id;
    }
    return undefined;
  }, [selectedMeterId, preferredMeterId, resolvedEnforcedMeter]);

  const activeMeterId = selectedMeterId || preferredMeterId || resolvedEnforcedMeter?.id;
  const [pinnedWordPatterns, setPinnedWordPatterns] = useState<Record<number, string>>({});
  const [activeWordMenuIdx, setActiveWordMenuIdx] = useState<number | null>(null);
  const [correctingWord, setCorrectingWord] = useState<string | null>(null);

  const effectiveRadif = radif ?? repairContext?.radif;
  const effectiveRhymeAnchor = rhymeAnchorWord ?? repairContext?.rhymeAnchorWord;

  const baseScansion = useMemo(
    () => (lineText || !scansion ? scanPoetryLine(lineText, catalogMeterId) : scansion),
    [lineText, catalogMeterId, scansion, lexiconRevision]
  );
  const baseDiagnosticReport: MeterDiagnosticReport = useMemo(() => {
    const ctx: RepairContextOptions | undefined =
      effectiveRadif || effectiveRhymeAnchor
        ? { radif: effectiveRadif, rhymeAnchorWord: effectiveRhymeAnchor }
        : undefined;
    return diagnoseAndRepairMeter(lineText, catalogMeterId, ctx);
  }, [lineText, catalogMeterId, effectiveRadif, effectiveRhymeAnchor, lexiconRevision]);

  const { scansion: displayedScansion, report: diagnosticReport } = useMemo(
    () =>
      evaluateWithPinnedReadings(
        lineText,
        baseScansion,
        baseDiagnosticReport,
        pinnedWordPatterns,
        catalogMeterId,
        {
          customMeter: resolvedEnforcedMeter,
          strictEnforceBahar,
        }
      ),
    [
      lineText,
      baseScansion,
      baseDiagnosticReport,
      pinnedWordPatterns,
      catalogMeterId,
      resolvedEnforcedMeter,
      strictEnforceBahar,
    ]
  );

  const activeMeterObjectForDeduction = useMemo(
    () =>
      resolvedEnforcedMeter ||
      CLASSICAL_BUHUR.find((m) => m.id === diagnosticReport.meterId) ||
      null,
    [resolvedEnforcedMeter, diagnosticReport.meterId]
  );

  // Compute menu possibilities for all words in the line (including enforced-Bahar deduced readings)
  const allWordMenus = useMemo(() => {
    return diagnosticReport.wordSpans.map((span, idx) =>
      getWordIntentionMenuData(
        lineText,
        idx,
        span.syllables,
        pinnedWordPatterns[idx],
        activeMeterObjectForDeduction,
        pinnedWordPatterns
      )
    );
  }, [lineText, diagnosticReport.wordSpans, pinnedWordPatterns, activeMeterObjectForDeduction]);

  const activeWordMenu =
    activeWordMenuIdx !== null ? allWordMenus[activeWordMenuIdx] ?? null : null;

  const [isRepairOpen, setIsRepairOpen] = useState(false);
  const [appliedSuggestionId, setAppliedSuggestionId] = useState<string | null>(null);
  const repairPanelRef = React.useRef<HTMLDivElement | null>(null);

  const handleToggleRepair = () => {
    setIsRepairOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          repairPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
      return next;
    });
  };

  if (!displayedScansion.rawSyllables && !lineText.trim()) {
    return null;
  }

  const hasDefects = diagnosticReport.defects.length > 0;
  const hasSuggestions = diagnosticReport.suggestions.length > 0;
  const canApplyLineUpdate = Boolean(
    onApplyRepair || (onApplyLineChange && typeof lineIndex === 'number')
  );

  const emitLineUpdate = (repairedLine: string) => {
    if (onApplyRepair) {
      onApplyRepair(repairedLine);
    } else if (onApplyLineChange && typeof lineIndex === 'number') {
      onApplyLineChange(lineIndex, repairedLine);
    }
  };

  const handleApply = (sug: RepairSuggestion) => {
    if (canApplyLineUpdate) {
      setSelectedMeterId(diagnosticReport.meterId);
      setPinnedWordPatterns({});
      setActiveWordMenuIdx(null);
      emitLineUpdate(sug.repairedLine);
      setAppliedSuggestionId(sug.id);
      setTimeout(() => setAppliedSuggestionId(null), 1500);
    }
  };

  const handlePinReading = (wordIdx: number, pattern: string) => {
    setPinnedWordPatterns((prev) => {
      if (prev[wordIdx] === pattern) {
        const next = { ...prev };
        delete next[wordIdx];
        return next;
      }
      return { ...prev, [wordIdx]: pattern };
    });
  };

  const handleApplyCompoundSplit = (wordIdx: number, choice: CompoundSplitChoice) => {
    if (!canApplyLineUpdate) return;
    // Shift existing pins after wordIdx by +1 and pin the newly split left & right words
    setPinnedWordPatterns((prev) => {
      const next: Record<number, string> = {};
      for (const [k, v] of Object.entries(prev)) {
        const idx = Number(k);
        if (idx < wordIdx) next[idx] = v;
        else if (idx > wordIdx) next[idx + 1] = v;
      }
      next[wordIdx] = choice.pinLeftPattern;
      next[wordIdx + 1] = choice.pinRightPattern;
      return next;
    });
    setActiveWordMenuIdx(null);
    emitLineUpdate(choice.repairedLine);
  };

  const handleApplyPoeticSpelling = (wordIdx: number, choice: PoeticSpellingChoice) => {
    if (!canApplyLineUpdate) return;
    setPinnedWordPatterns((prev) => ({
      ...prev,
      [wordIdx]: choice.alternativePattern,
    }));
    setActiveWordMenuIdx(null);
    emitLineUpdate(choice.repairedLine);
  };

  const handleApplyVocalizedWord = (wordIdx: number, choice: WordReadingChoice) => {
    if (!canApplyLineUpdate || !choice.vocalizedSpelling || !activeWordMenu) return;
    const repaired =
      lineText.slice(0, activeWordMenu.charStart) +
      choice.vocalizedSpelling +
      lineText.slice(activeWordMenu.charEnd);
    setPinnedWordPatterns((prev) => ({
      ...prev,
      [wordIdx]: choice.pattern,
    }));
    setActiveWordMenuIdx(null);
    emitLineUpdate(repaired);
  };

  const getCategoryBadge = (category: RepairSuggestion['category']) => {
    switch (category) {
      case 'synonym':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-nastaliq">
            ہم معنی لفظ
          </span>
        );
      case 'poetic_license':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-nastaliq">
            مستعمل متبادل املا
          </span>
        );
      case 'particle':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-nastaliq">
            حرفِ ربط و ترنم
          </span>
        );
      case 'transposition':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-nastaliq">
            الفاظ کی تقدیم و تاخیر
          </span>
        );
    }
  };

  return (
    <div data-testid="scansion-card" className="my-2 py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 backdrop-blur-xs shadow-2xs text-xs select-none transition-all hover:border-[var(--accent-gold)]/60">
      {/* Top Row: Identified Bahr Name & Match Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
            <Music className="w-3.5 h-3.5" />
          </span>
          <span className="font-nastaliq font-bold text-sm text-[var(--text-primary)]">
            {displayedScansion.meterNameUrdu || diagnosticReport.meterNameUrdu}
          </span>
          {displayedScansion.meterNameEnglish && displayedScansion.isMatched && (
            <span className="hidden sm:inline-block text-[10px] font-mono text-[var(--text-muted)]">
              ({displayedScansion.meterNameEnglish})
            </span>
          )}
        </div>

        {/* Confidence, Syllables Pill & Repair Toggle Button */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          {displayedScansion.isMatched ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-nastaliq">
              <CheckCircle2 className="w-3 h-3" />
              <span>تقطیع کے مطابق موزوں</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-nastaliq">
              <AlertCircle className="w-3 h-3" />
              <span>
                {diagnosticReport.uncertainWords.length ? 'تلفظ کی تصدیق درکار' : diagnosticReport.isPrefix && !activeMeterId ? 'زیرِ تکمیل' : hasDefects ? `${diagnosticReport.defects.length} وزنی فرق` : 'نامکمل'}
              </span>
            </span>
          )}

          <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-nastaliq">
            {displayedScansion.totalSyllables || diagnosticReport.actualPattern.length} ہجے
          </span>

          {/* Interactive Repair Trigger Button */}
          {hasDefects && canApplyLineUpdate && (
            <button
              type="button"
              onClick={handleToggleRepair}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-nastaliq text-[11px] font-bold transition-all border shadow-2xs ${
                isRepairOpen
                  ? 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] border-[var(--accent-gold)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10'
              }`}
              title="شکستِ بحر کی نشان دہی اور تجاویز ملاحظہ فرمائیں"
            >
              <Wrench className="w-3 h-3" />
              <span>اصلاحِ بحر</span>
              {hasSuggestions && (
                <span className="px-1 rounded-full bg-[var(--accent-gold)]/30 text-[10px]">
                  {diagnosticReport.suggestions.length}
                </span>
              )}
              {isRepairOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      <div dir="rtl" className="my-2 space-y-2 font-nastaliq leading-[2.4] text-[var(--text-secondary)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex flex-wrap items-center gap-2">
            <span>مطلوبہ بحر:</span>
            <select
              aria-label="مطلوبہ بحر"
              value={
                isCustomBaharOpen
                  ? CUSTOM_BAHAR_SELECT_VALUE
                  : activeMeterId?.startsWith('custom:')
                    ? CUSTOM_BAHAR_SELECT_VALUE
                    : activeMeterId || ''
              }
              onChange={(e) => {
                const val = e.target.value;
                setAppliedSuggestionId(null);
                if (val === CUSTOM_BAHAR_SELECT_VALUE) {
                  setIsCustomBaharOpen(true);
                } else {
                  setIsCustomBaharOpen(false);
                  setSelectedMeterId(val);
                  if (onEnforcePoemMeter) {
                    const found = CLASSICAL_BUHUR.find((m) => m.id === val);
                    if (found) {
                      onEnforcePoemMeter(found.nameUrdu, found.afailList.join(' '));
                    } else if (!val) {
                      onEnforcePoemMeter('', '');
                    }
                  }
                }
              }}
              className="max-w-full min-w-0 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1"
            >
              <option value="">قریب ترین بحر (تجویز)</option>
              <option value={CUSTOM_BAHAR_SELECT_VALUE}>
                ✍️ اپنی مخصوص بحر / ارکان خود نافذ کریں...
              </option>
              {CLASSICAL_BUHUR.map((meter) => (
                <option key={meter.id} value={meter.id}>
                  {meter.nameUrdu}
                </option>
              ))}
            </select>
          </label>

          {/* Poet-Enforced Bahar Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              data-testid="toggle-strict-enforced-bahar"
              onClick={() => setStrictEnforceBahar((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                strictEnforceBahar
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                  : 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/20'
              }`}
              title="جب نظام کسی لفظ یا بحر کو نہ پہچانے تو شاعر کی نافذ کردہ بحر کے مطابق خودکار وزن متعین کریں"
            >
              <Sparkles className="w-3 h-3" />
              <span>
                {strictEnforceBahar
                  ? '✓ شاعر کی بحر نافذ ہے (حرفِ آخر)'
                  : 'شاعر کی بحر نافذ کریں'}
              </span>
            </button>

            <button
              type="button"
              data-testid="open-custom-bahar-builder"
              onClick={() => setIsCustomBaharOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] transition-all cursor-pointer border ${
                isCustomBaharOpen
                  ? 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] font-bold border-[var(--accent-gold)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/40'
              }`}
              title="اگر آپ کی بحر فہرست میں نہیں تو اپنے ارکان خود درج کریں"
            >
              <Edit3 className="w-3 h-3" />
              <span>اپنی بحر / ارکان</span>
            </button>
          </div>
        </div>

        {/* Custom Poet-Enforced Bahar Builder Panel */}
        {isCustomBaharOpen && (
          <div
            data-testid="custom-bahar-builder-panel"
            dir="rtl"
            className="p-3 rounded-xl border border-[var(--accent-gold)]/40 bg-[var(--bg-surface)] space-y-2.5 text-xs shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-[var(--accent-gold)]">
                ✍️ شاعر کی اپنی نافذ کردہ بحر (ارکان یا علامات درج فرمائیں):
              </span>
              <button
                type="button"
                onClick={() => setIsCustomBaharOpen(false)}
                className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                بند کریں ✕
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] text-[var(--text-muted)] ml-1">فوری ارکان:</span>
              {QUICK_ARKAN_CHIPS.map((rukn) => (
                <button
                  key={rukn}
                  type="button"
                  onClick={() =>
                    setCustomBaharInput((prev) =>
                      prev.trim() ? `${prev.trim()} ${rukn}` : rukn
                    )
                  }
                  className="px-2 py-0.5 rounded-md bg-[var(--bg-card)] hover:bg-[var(--accent-gold)]/15 text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/40 text-[11px] cursor-pointer transition-all"
                >
                  + {rukn} ({ARKAN_TO_PATTERN[rukn]?.pattern})
                </button>
              ))}
              {customBaharInput && (
                <button
                  type="button"
                  onClick={() => setCustomBaharInput('')}
                  className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] cursor-pointer"
                >
                  صاف کریں
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                dir="rtl"
                value={customBaharInput}
                onChange={(e) => setCustomBaharInput(e.target.value)}
                placeholder="مثلاً: فاعلاتن فاعلاتن فاعلن یا =-== / =-== / =-="
                aria-label="اپنی بحر کے ارکان"
                className="sm:col-span-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
              />
              <input
                type="text"
                dir="rtl"
                value={customBaharName}
                onChange={(e) => setCustomBaharName(e.target.value)}
                placeholder="بحر کا نام (اختیاری)"
                aria-label="بحر کا نام"
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
              />
            </div>

            {(() => {
              const parsed = parseCustomBaharSpec(customBaharInput, customBaharName);
              return (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {parsed ? (
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <span>✓ شناخت شدہ ارکان: {parsed.afailList.join(' · ')}</span>
                      <ProsodicPatternView pattern={parsed.fullRawPattern} size="xs" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-[var(--text-muted)]">
                      اوپر دیے گئے ارکان پر کلک کریں یا `-` اور `=` علامات درج کریں۔
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!parsed}
                    onClick={() => {
                      if (!parsed) return;
                      setSelectedMeterId(parsed.id);
                      setStrictEnforceBahar(true);
                      if (onEnforcePoemMeter) {
                        onEnforcePoemMeter(
                          parsed.nameUrdu,
                          parsed.afailList.join(' ')
                        );
                      }
                      setIsCustomBaharOpen(false);
                    }}
                    className="px-3 py-1 rounded-lg bg-[var(--accent-gold)] text-[var(--text-on-gold)] font-bold text-xs disabled:opacity-40 cursor-pointer hover:opacity-90 transition-all"
                  >
                    یہ بحر نافذ کریں
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        <p>ماخذِ تلفظ و تقطیع: لغتِ قلم و قافیہ (مستقل بالذات علمی و عروضی لغت — ۱۰۴،۰۰۰+ الفاظ) · الفاظ پر کلک کر کے تمام ممکنہ قرأتیں، اوزان اور مرکب املا منتخب کریں۔</p>
        {diagnosticReport.meterNotes.length > 0 && <p className="text-[var(--accent-gold)]">
          {diagnosticReport.meterNotes.map(note => ({ 'terminal-short': 'آخر میں زائد ہجائے کوتاہ', 'caesura-short': 'وقفے سے پہلے زائد ہجائے کوتاہ', 'initial-short': 'پہلے ہجے کی جائز تخفیف' }[note] || note)).join('، ')}
        </p>}
        {savedWordToast && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            ✓ {savedWordToast}
          </div>
        )}
        {diagnosticReport.uncertainWords.length > 0 && (
          <div role="status" className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-amber-600 dark:text-amber-400">
              <span>
                ان الفاظ کے تلفظ کی تصدیق درکار ہے: {diagnosticReport.uncertainWords.join('، ')}۔ خودکار اصلاح روک دی گئی ہے۔
              </span>
              {allWordMenus.some((m) => m && m.source === 'unresolved' && m.compoundSplits.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = allWordMenus.findIndex(
                      (m) => m && m.source === 'unresolved' && m.compoundSplits.length > 0
                    );
                    if (idx >= 0) setActiveWordMenuIdx(activeWordMenuIdx === idx ? null : idx);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>مرکب لفظ کے امکانات دیکھیں (جیسے اسپیس کے ساتھ)</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 1-Click Poet-Enforced Bahar Deduction Banner for Unrecognized Words */}
            {allWordMenus
              .filter(
                (m): m is NonNullable<typeof m> =>
                  Boolean(
                    m &&
                      (m.source === 'unresolved' || !m.currentPattern) &&
                      m.enforcedBaharDeduction
                  )
              )
              .map((m) => {
                const ded = m.enforcedBaharDeduction!;
                return (
                  <div
                    key={`deduce-banner-${m.wordIndex}`}
                    data-testid="enforced-bahar-deduction-banner"
                    className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 text-xs"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                      <span className="text-[var(--text-primary)]">
                        بحر <strong>({ded.meterNameUrdu})</strong> کے مطابق لفظ{' '}
                        <strong>«{m.word}»</strong> کا متوقع وزن:{' '}
                        <strong className="text-[var(--accent-gold)]">{ded.ruknLabel}</strong>
                      </span>
                      <ProsodicPatternView pattern={ded.deducedPattern} size="xs" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        data-testid="apply-enforced-bahar-word"
                        onClick={() => handlePinReading(m.wordIndex, ded.deducedPattern)}
                        className="px-3 py-1 rounded-md bg-[var(--accent-gold)] text-[var(--text-on-gold)] font-bold text-[11px] cursor-pointer hover:opacity-90 transition-all"
                      >
                        ✓ اس مصرعے میں نافذ کریں
                      </button>
                      <button
                        type="button"
                        data-testid="save-enforced-bahar-word"
                        onClick={() => {
                          void AroozLexiconService.saveProposal({
                            word: m.word,
                            pattern: ded.deducedPattern,
                            status: 'approved',
                            notes: `${POET_ENFORCED_BAHAR_LABEL} (${ded.meterNameUrdu})`,
                          }).then((res) => {
                            if (res.success) {
                              setSavedWordToast(
                                `لفظ «${m.word}» کا وزن (${ded.ruknLabel} / ${ded.deducedPattern}) لغت میں مستقل محفوظ کر دیا گیا!`
                              );
                              setTimeout(() => setSavedWordToast(null), 3500);
                            }
                          });
                        }}
                        className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 font-bold text-[11px] cursor-pointer hover:bg-emerald-500/30 transition-all"
                      >
                        + لغت میں مستقل محفوظ کریں
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {diagnosticReport.wordSpans.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {diagnosticReport.wordSpans.map((span, idx) => {
              const menu = allWordMenus[idx];
              const isOpen = activeWordMenuIdx === idx;
              const isPinned = Boolean(pinnedWordPatterns[idx]);
              const isPoetEnforcedRule = span.readingRules.includes(POET_ENFORCED_BAHAR_RULE);
              const hasCompoundSplits = (menu?.compoundSplits.length || 0) > 0;
              const totalChoices =
                (menu?.directReadings.length || 0) +
                (menu?.compoundSplits.length || 0) +
                (menu?.poeticSpellings.length || 0);
              const isUnresolved = !span.syllables;

              return (
                <button
                  type="button"
                  data-testid="word-reading"
                  key={`${span.charStart}-${idx}`}
                  onClick={() => setActiveWordMenuIdx(isOpen ? null : idx)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCorrectingWord(span.word);
                  }}
                  aria-expanded={isOpen}
                  title="اس لفظ کے اوزان دیکھنے کے لیے کلک کریں — وزن درست کرنے کے لیے رائٹ کلک کریں"
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]/50 ${
                    isOpen
                      ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/15 shadow-xs'
                      : isUnresolved && hasCompoundSplits
                        ? 'border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20'
                        : isPinned || isPoetEnforcedRule
                          ? 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/15'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 hover:border-[var(--accent-gold)]/50 hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <span>{span.word}</span>
                  <span
                    dir="rtl"
                    title="دائیں سے بائیں: پہلا ہجا دائیں جانب"
                    className="inline-flex items-center gap-0.5 font-mono text-[var(--accent-gold)] font-bold"
                  >
                    {(span.syllables || '?').split('').map((sym, sIdx) => (
                      <span key={sIdx}>{sym}</span>
                    ))}
                  </span>
                  {isUnresolved && hasCompoundSplits && (
                    <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 leading-tight">
                      تجویز موجود
                    </span>
                  )}
                  {(isPinned || isPoetEnforcedRule) && (
                    <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 leading-tight">
                      {isPoetEnforcedRule ? 'بحرِ نافذہ' : 'مقررہ'}
                    </span>
                  )}
                  {totalChoices > 1 && !isUnresolved && !isPinned && !isPoetEnforcedRule && (
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      ({totalChoices})
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-3 h-3 text-[var(--accent-gold)]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Interactive Word Intention & Possibilities Dropdown Panel */}
        {activeWordMenu && (
          <div
            data-testid="word-intention-menu"
            dir="rtl"
            className="mt-2 p-3 rounded-xl border border-[var(--accent-gold)]/40 bg-[var(--bg-surface)] shadow-md space-y-3 text-xs animate-in fade-in duration-150"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span className="font-bold text-sm text-[var(--text-primary)]">
                  لفظ «{activeWordMenu.word}» — ممکنہ مراد، تلفظ اور عروضی اختیارات
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveWordMenuIdx(null)}
                className="px-2 py-0.5 rounded text-[11px] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
              >
                بند کریں ✕
              </button>
            </div>

            {/* 1. Compound / Unspaced Word Split Choices (e.g., آگئے -> آ گئے) */}
            {activeWordMenu.compoundSplits.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span>۱. مرکب الفاظ کی تفریق (غیر پیوستہ حرف کے بعد اسپیس کے ساتھ):</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  اردو رسم الخط میں غیر پیوستہ حرف (جیسے الف، مد، واؤ، دال، رے) کے بعد اسپیس نہ ہونے پر بھی لفظ جڑا ہوا نظر آتا ہے۔ اپنی مراد کے مطابق درست وزن منتخب کریں:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeWordMenu.compoundSplits.map((choice) => (
                    <div
                      key={choice.id}
                      className="flex flex-col justify-between gap-2 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-[var(--text-primary)]">
                            «{choice.spacedText}»
                          </span>
                          <div className="flex items-center gap-1.5">
                            {choice.ruknLabel && (
                              <span className="px-2 py-0.5 rounded bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/35 font-bold text-[11px]">
                                {choice.ruknLabel}
                              </span>
                            )}
                            <ProsodicPatternView pattern={choice.combinedPattern} size="xs" />
                          </div>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {choice.explanationUrdu}
                        </p>
                      </div>
                      {canApplyLineUpdate && (
                        <button
                          type="button"
                          onClick={() =>
                            handleApplyCompoundSplit(activeWordMenu.wordIndex, choice)
                          }
                          className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-gold)] text-[var(--text-on-gold)] font-bold text-xs leading-[2.1] hover:opacity-90 transition-all cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>«{choice.spacedText}» ({choice.ruknLabel}) منتخب کریں</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Direct Attested Readings */}
            {activeWordMenu.directReadings.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-[var(--accent-gold)]">
                  <span>اس لفظ کی مستند عروضی قرأتیں (لغت و قواعد کے مطابق):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeWordMenu.directReadings.map((reading) => (
                    <div
                      key={reading.id}
                      className={`flex flex-col justify-between gap-2 p-2.5 rounded-lg border transition-all ${
                        reading.isCurrentlySelected
                          ? 'border-emerald-500/50 bg-emerald-500/5'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)]/60 hover:border-[var(--accent-gold)]/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[var(--text-primary)]">
                              {reading.pronunciation}
                            </span>
                            {reading.isCurrentlySelected && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                {reading.isPinnedByPoet ? 'آپ کا مقرر کردہ' : 'زیرِ استعمال'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {reading.ruknLabel && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 font-bold text-[10px]">
                                {reading.ruknLabel}
                              </span>
                            )}
                            <ProsodicPatternView pattern={reading.pattern} size="xs" />
                          </div>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          وزنی ساخت: {reading.weightDescriptionUrdu}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          قاعدہ: {reading.rulesUrdu.join('، ')}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handlePinReading(activeWordMenu.wordIndex, reading.pattern)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold leading-[2.1] transition-all cursor-pointer border shadow-2xs ${
                            reading.isPinnedByPoet
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--text-on-gold)]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {reading.isPinnedByPoet
                              ? 'مقررہ وزن ہٹائیں (خودکار)'
                              : 'یہ وزن مقرر کریں'}
                          </span>
                        </button>

                        {reading.vocalizedSpelling && canApplyLineUpdate && (
                          <button
                            type="button"
                            onClick={() =>
                              handleApplyVocalizedWord(activeWordMenu.wordIndex, reading)
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs leading-[2.1] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] border border-[var(--border-subtle)] cursor-pointer shadow-2xs"
                          >
                            <span>متن میں «{reading.vocalizedSpelling}» درج کریں</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Attested Poetic Spelling Alternatives */}
            {activeWordMenu.poeticSpellings.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                  <span>مستعمل شعری متبادل املا (تخفیف و اشباع):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeWordMenu.poeticSpellings.map((alt) => (
                    <div
                      key={alt.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-sky-500/30 bg-sky-500/5"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[var(--text-primary)]">
                            «{alt.alternativeWord}»
                          </span>
                          <ProsodicPatternView pattern={alt.alternativePattern} size="xs" />
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {alt.explanationUrdu}
                        </p>
                      </div>
                      {canApplyLineUpdate && (
                        <button
                          type="button"
                          onClick={() =>
                            handleApplyPoeticSpelling(activeWordMenu.wordIndex, alt)
                          }
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] cursor-pointer shadow-2xs transition-all"
                        >
                          «{alt.alternativeWord}» درج کریں
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Fallback note if completely unknown with no splits */}
            {activeWordMenu.directReadings.length === 0 &&
              activeWordMenu.compoundSplits.length === 0 && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  اس لفظ کا اندراج لغت میں موجود نہیں اور نہ ہی یہ کسی معروف مرکب لفظ میں تقسیم ہو سکا۔ آپ اوپر اعراب ٹول بار سے اس پر حرکات (زبر، زیر، پیش، جزم) لگا کر واضح تلفظ دے سکتے ہیں، یا «انتظامِ لغت» میں اس کا وزن محفوظ کر سکتے ہیں۔
                </p>
              )}

            {/* 5. Quick Scansion Correction Trigger */}
            <div className="pt-2.5 mt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--text-secondary)] font-nastaliq">
                کیا اس لفظ کا وزن یا تقطیع نامکمل یا غلط ہے؟
              </span>
              <button
                type="button"
                onClick={() => setCorrectingWord(activeWordMenu.word)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-nastaliq bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--text-on-gold)] transition-all font-bold cursor-pointer shadow-2xs"
                title="اس لفظ کا صحیح عروضی وزن تجویز یا درست فرمائیں"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>صحیح وزن تجویز فرمائیں</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {diagnosticReport.wordSpans.length > 0 && <details dir="rtl" className="mb-2 text-xs font-nastaliq leading-[2.6]">
        <summary className="cursor-pointer text-[var(--accent-gold)]">تلفظ، ماخذ اور استعمال شدہ جوازات</summary>
        <div className="space-y-1 pt-2">
          {diagnosticReport.wordSpans.map(span => <div key={span.charStart} className="rounded border border-[var(--border-subtle)] px-2 break-words">
            <strong>{span.word}</strong> — {span.pronunciation || 'تلفظ دستیاب نہیں'}
            {span.readingRules.length > 0 && <p>{span.readingRules.map(r => r === POET_ENFORCED_BAHAR_RULE ? POET_ENFORCED_BAHAR_LABEL : readingRuleLabel(r)).join('، ')}</p>}
            <span dir="ltr" className="block font-mono text-[10px] text-[var(--text-muted)]">{span.sourceIds.join(' · ') || 'unresolved'}</span>
          </div>)}
        </div>
      </details>}

      {/* Middle & Bottom Row: Afa'il Breakdown & Rhythmic Pattern (- and =) in RTL order */}
      {displayedScansion.isMatched && displayedScansion.afailList.length > 0 ? (
        <div className="pt-2 border-t border-[var(--border-subtle)]/60 space-y-2">
          {/* Audio Rhythm Player & Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <span className="font-nastaliq text-xs font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
              <span>صوتی بحری تال و ارکانِ تقطیع:</span>
            </span>
            <BaharBeatPlayer
              pattern={
                displayedScansion.groupedPatternList
                  .map((g) => g.replace(/\s+/g, ''))
                  .join(' ') || displayedScansion.rawSyllables
              }
              afailList={displayedScansion.afailList}
              onActiveTick={setActiveBeatTick}
            />
          </div>

          {/* Afa'il Breakdown: rendered right-to-left */}
          <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {displayedScansion.afailList.map((rukn, idx) => {
              const rawPattern = displayedScansion.groupedPatternList[idx] || '';
              const symbols = rawPattern.replace(/\s+/g, '').split('');
              const isRuknActive = activeBeatTick?.ruknIndex === idx;

              let globalOffset = 0;
              for (let i = 0; i < idx; i++) {
                globalOffset += (displayedScansion.groupedPatternList[i] || '').replace(/\s+/g, '').length;
              }

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center px-3.5 py-1.5 rounded-lg border transition-all ${
                    isRuknActive
                      ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 scale-105 shadow-xs'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70 shadow-2xs hover:border-[var(--accent-gold)]/50'
                  }`}
                >
                  <span
                    style={{ fontFamily }}
                    className="font-nastaliq font-bold text-sm text-[var(--accent-gold)] leading-relaxed"
                  >
                    {rukn}
                  </span>

                  <div dir="rtl" className="flex items-center justify-center gap-1 mt-1">
                    {symbols.map((sym, sIdx) => {
                      const isLong = sym === '=';
                      const globalSyllableIdx = globalOffset + sIdx;
                      const isSyllableActive =
                        activeBeatTick?.syllableGlobalIndex === globalSyllableIdx;

                      return (
                        <span
                          key={sIdx}
                          className={`inline-flex items-center justify-center min-w-[18px] h-5 px-1 rounded text-xs font-mono font-bold leading-none select-none transition-all ${
                            isSyllableActive
                              ? 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] border border-[var(--accent-gold)] scale-125 shadow-sm font-extrabold'
                              : isLong
                              ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/35 shadow-2xs hover:scale-110'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:scale-110'
                          }`}
                          title={isLong ? 'ہجائے بلند (Long Syllable: =)' : 'ہجائے کوتاہ (Short Syllable: -)'}
                        >
                          {sym}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notation Legend Hint & RTL Line Rhythm Summary */}
          <div dir="rtl" className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] pt-1 font-nastaliq">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)] font-medium">مجموعی آہنگ (دائیں تا بائیں):</span>
              <div dir="rtl" className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--accent-gold)] tracking-wider">
                {displayedScansion.groupedPatternList.map((grp, gIdx) => (
                  <span
                    key={gIdx}
                    dir="rtl"
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]/80 border border-[var(--border-subtle)] text-[11px]"
                  >
                    {grp.replace(/\s+/g, '').split('').map((sym, sIdx) => (
                      <span key={sIdx}>{sym}</span>
                    ))}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-mono font-bold border border-[var(--accent-gold)]/40 leading-none">
                  =
                </span>
                <span>بلند (Long)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-mono font-bold border border-[var(--border-subtle)] leading-none">
                  -
                </span>
                <span>کوتاہ (Short)</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-[var(--border-subtle)]/60 space-y-2">
          {displayedScansion.groupedPatternList.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <span className="font-nastaliq text-xs font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
                  <span>صوتی بحری تال:</span>
                </span>
                <BaharBeatPlayer
                  pattern={
                    displayedScansion.groupedPatternList
                      .map((g) => g.replace(/\s+/g, ''))
                      .join(' ') || diagnosticReport.targetPattern
                  }
                  afailList={displayedScansion.afailList}
                  onActiveTick={setActiveBeatTick}
                />
              </div>

              <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {displayedScansion.groupedPatternList.map((grp, idx) => {
                  const symbols = grp.replace(/\s+/g, '').split('');
                  const isRuknActive = activeBeatTick?.ruknIndex === idx;

                  let globalOffset = 0;
                  for (let i = 0; i < idx; i++) {
                    globalOffset += (displayedScansion.groupedPatternList[i] || '').replace(/\s+/g, '').length;
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center px-3.5 py-1.5 rounded-lg border transition-all ${
                        isRuknActive
                          ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 scale-105 shadow-xs'
                          : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70 shadow-2xs hover:border-[var(--accent-gold)]/50'
                      }`}
                    >
                      <span
                        style={{ fontFamily }}
                        className="font-nastaliq font-bold text-xs text-[var(--accent-gold)] leading-relaxed"
                      >
                        {displayedScansion.afailList[idx] || patternToClassicalRukn(grp) || `رکن ${idx + 1}`}
                      </span>
                      <div dir="rtl" className="flex items-center justify-center gap-1 mt-1">
                        {symbols.map((sym, sIdx) => {
                          const isLong = sym === '=';
                          const globalSyllableIdx = globalOffset + sIdx;
                          const isSyllableActive =
                            activeBeatTick?.syllableGlobalIndex === globalSyllableIdx;

                          return (
                            <span
                              key={sIdx}
                              className={`inline-flex items-center justify-center min-w-[18px] h-5 px-1 rounded text-xs font-mono font-bold leading-none select-none transition-all ${
                                isSyllableActive
                                  ? 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] border border-[var(--accent-gold)] scale-125 shadow-sm font-extrabold'
                                  : isLong
                                  ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/35 shadow-2xs hover:scale-110'
                                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:scale-110'
                              }`}
                              title={isLong ? 'ہجائے بلند (Long: =)' : 'ہجائے کوتاہ (Short: -)'}
                            >
                              {sym}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* RTL Line Rhythm Summary */}
          <div dir="rtl" className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] pt-1 font-nastaliq">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)] font-medium">مجموعی آہنگ:</span>
              <div dir="rtl" className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--accent-gold)] tracking-wider">
                {displayedScansion.groupedPatternList.map((grp, gIdx) => (
                  <span
                    key={gIdx}
                    dir="rtl"
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]/80 border border-[var(--border-subtle)] text-[11px]"
                  >
                    {grp.replace(/\s+/g, '').split('').map((sym, sIdx) => (
                      <span key={sIdx}>{sym}</span>
                    ))}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-[var(--text-muted)]">
              {diagnosticReport.isPrefix && !activeMeterId
                ? 'مصرع جاری رکھیں...'
                : diagnosticReport.uncertainWords.length ? 'نامکمل تقطیع — تلفظ کی تصدیق درکار ہے' : 'مطلوبہ بحر سے وزنی فرق موجود ہے'}
            </div>
          </div>
        </div>
      )}

      {/* EXPANDABLE SYLLABLE DEFECT DIAGNOSTICS & 1-CLICK REPAIRS */}
      {hasDefects && isRepairOpen && (
        <div
          ref={repairPanelRef}
          dir="rtl"
          className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-3 animate-fadeIn"
        >
          {/* Header of Diagnostics */}
          <div className="flex items-center justify-between text-xs font-nastaliq font-bold text-[var(--text-primary)]">
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span>تشخیصِ شکستِ وزن و اوزانی اصلاح</span>
            </div>
            <span className="text-[11px] font-normal text-[var(--text-muted)]">
              مطلوبہ بحر: <span className="font-bold text-[var(--accent-gold)]">{diagnosticReport.meterNameUrdu}</span>
            </span>
          </div>

          {/* Word-by-Word Defect Pinpointers */}
          <div className="space-y-1.5">
            {diagnosticReport.defects.map((def) => (
              <div
                key={def.id}
                className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-[var(--bg-surface)] border border-amber-500/25 text-xs font-nastaliq"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30">
                    لفظ: {def.word}
                  </span>
                  <span className="text-[var(--text-secondary)]">{def.descriptionUrdu}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-[var(--text-muted)]">مطلوبہ وزن:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold">
                    {def.expected}
                  </span>
                  <span className="text-[var(--text-muted)]">موجودہ:</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 font-bold">
                    {def.actual}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Actionable 1-Click Poetic Repairs */}
          {hasSuggestions ? (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1 text-[11px] font-nastaliq font-bold text-[var(--accent-gold)]">
                <Sparkles className="w-3 h-3" />
                <span>دوبارہ تقطیع شدہ تجاویز — معنی اور محاورہ کی جانچ فرمائیں:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {diagnosticReport.suggestions.map((sug) => {
                  const isApplied = appliedSuggestionId === sug.id;
                  return (
                    <div
                      key={sug.id}
                      data-testid="repair-suggestion"
                      className="flex flex-col justify-between p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/60 transition-all shadow-2xs"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="font-nastaliq font-bold text-sm text-[var(--text-primary)] leading-[2.2]">
                            {sug.titleUrdu}
                          </span>
                          <div className="flex items-center gap-1">
                            {sug.preservesRhyme && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-nastaliq">
                                قافیہ محفوظ
                              </span>
                            )}
                            {getCategoryBadge(sug.category)}
                          </div>
                        </div>
                        <p dir="rtl" className="font-nastaliq text-sm leading-[2.6] break-words">{sug.repairedLine}</p>
                        <p className="font-nastaliq text-xs text-[var(--text-secondary)] leading-[2.2] mb-1">
                          {sug.explanationUrdu}
                        </p>
                        {sug.cautionUrdu && (
                          <p className="font-nastaliq text-[11px] text-amber-600 dark:text-amber-400 leading-[2.0] mb-2">
                            {sug.cautionUrdu}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]/50 mt-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {sug.impactPreview}
                        </span>
                        <button
                          type="button"
                          disabled={!canApplyLineUpdate}
                          onClick={() => handleApply(sug)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-nastaliq font-bold transition-all shadow-2xs ${
                            isApplied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[var(--accent-gold)] text-[var(--text-on-gold)] hover:brightness-110 active:scale-95'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>لاگو ہو گیا</span>
                            </>
                          ) : (
                            <>
                              <ArrowLeftRight className="w-3 h-3" />
                              <span>{sug.isExact ? 'یہ اصلاح لاگو کریں' : 'جزوی بہتری لاگو کریں'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-[var(--bg-surface)] text-[11px] font-nastaliq text-[var(--text-muted)] text-center">
              اس بحر کے لیے کوئی قابلِ تصدیق خودکار اصلاح نہیں ملی۔ الفاظ، تلفظ یا مطلوبہ بحر کا جائزہ لیں۔
            </div>
          )}
        </div>
      )}

      {/* Quick Scansion Correction Modal */}
      <QuickScansionCorrectionModal
        isOpen={Boolean(correctingWord)}
        word={correctingWord || ''}
        onClose={() => setCorrectingWord(null)}
        fontFamily={fontFamily}
      />
    </div>
  );
};

export const ScansionCard = React.memo(ScansionCardInner);
export default ScansionCard;
