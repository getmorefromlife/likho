import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  AlertTriangle,
  HelpCircle,
  Layers,
  GitCompare,
  Sparkles,
} from 'lucide-react';
import {
  MeterAtlasEntry,
  REVIEW_STAGE_LABELS,
} from '../../data/meterReferenceAtlas';

interface MeterReferenceViewProps {
  entry: MeterAtlasEntry;
  fontFamily: string;
  isSelectedMeter: boolean;
  onSelectMeter: (nameUrdu: string, pattern: string) => void;
  onBackToList: () => void;
  onOpenNeighborMeter?: (meterId: string) => void;
}

export const MeterReferenceView: React.FC<MeterReferenceViewProps> = ({
  entry,
  fontFamily,
  isSelectedMeter,
  onSelectMeter,
  onBackToList,
  onOpenNeighborMeter,
}) => {
  const [activeLayerStep, setActiveLayerStep] = useState<number>(5);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [hintStep, setHintStep] = useState<number>(0);

  const buttonClass =
    'rounded-xl border border-[var(--border-subtle)] px-3.5 py-1.5 text-xs hover:border-[var(--accent-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)] transition-all cursor-pointer';

  const patternString = entry.afailList.join(' ');
  const worked = entry.workedExample;
  const counter = entry.counterExample;
  const practice = entry.practiceExercise;

  return (
    <section
      dir="rtl"
      data-testid="meter-reference-view"
      aria-labelledby="meter-ref-title"
      className="h-full overflow-y-auto custom-scrollbar bg-[var(--bg-surface)] text-[var(--text-primary)] select-none"
      style={{ fontFamily }}
    >
      <div className="max-w-2xl mx-auto p-4 space-y-5 leading-[2.3]">
        {/* Top Navigation & Review Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onBackToList}
            className={`${buttonClass} flex items-center gap-1.5 bg-[var(--bg-card)]`}
          >
            <ArrowRight size={14} />
            <span>واپس بحور کی فہرست</span>
          </button>

          <span
            data-testid="meter-review-badge"
            className={`px-2.5 py-0.5 rounded-full text-[11px] border ${
              entry.reviewStage === 'source-checked' || entry.reviewStage === 'poet-reviewed'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
            }`}
          >
            {REVIEW_STAGE_LABELS[entry.reviewStage]}
          </span>
        </div>

        {/* Header & Canonical Identity */}
        <header className="space-y-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs text-[var(--accent-gold)] flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>اطلسِ بحور (۵۰ نامزد صورتیں) · {entry.familyUrdu}</span>
              </p>
              <h2 id="meter-ref-title" className="text-xl font-bold mt-1">
                {entry.nameUrdu}
              </h2>
              <p dir="ltr" className="text-[11px] font-mono text-[var(--text-muted)] text-right">
                {entry.nameEnglish} · ID: {entry.id}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectMeter(entry.nameUrdu, patternString)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSelectedMeter
                  ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)]'
                  : 'border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/15'
              }`}
            >
              {isSelectedMeter && <Check size={14} />}
              <span>{isSelectedMeter ? 'کلام پر فعال بحر' : 'اس بحر کو کلام کے لیے منتخب کریں'}</span>
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)] pt-1">{entry.overviewUrdu}</p>

          {/* Persistent RTL Symbol Legend & Foot Strip */}
          <div className="pt-2 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              {entry.afailList.map((rukn, idx) => {
                const rawPat = entry.patternsList[idx] || '';
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]"
                  >
                    <span className="text-sm font-bold text-[var(--accent-gold)]">{rukn}</span>
                    <span
                      dir="rtl"
                      title="دائیں سے بائیں: پہلا ہجا دائیں جانب"
                      className="inline-flex items-center gap-1 mt-1 font-mono text-xs font-bold text-[var(--text-primary)]"
                    >
                      {rawPat.split('').map((sym, sIdx) => (
                        <span
                          key={sIdx}
                          className={`px-1 rounded ${
                            sym === '='
                              ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {sym}
                        </span>
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
              <span>
                علامات کی کلید (دائیں سے بائیں): <strong>=</strong> ہجائے بلند (بھاری) ·{' '}
                <strong>-</strong> ہجائے کوتاہ (ہلکا)
              </span>
              <span dir="ltr" className="font-mono text-[10px]">
                {entry.sourceCitation}
              </span>
            </div>
          </div>
        </header>

        {/* Licenses & Conditions */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 space-y-2">
          <h3 className="text-sm font-bold text-[var(--accent-gold)]">
            عروضی شرائط اور جائز تغیرات
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-secondary)]">
            {entry.licensesAndConditionsUrdu.map((cond, idx) => (
              <li key={idx}>{cond}</li>
            ))}
          </ul>
        </div>

        {/* Synchronized 5-Layer Worked Example (if present) */}
        {worked ? (
          <div
            data-testid="meter-worked-example"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
                  <Layers size={15} />
                  <span>ہم آہنگ پانچ سطحی تقطیع (مستند استشہادی شعر)</span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  شاعر: {worked.poet} · ماخذ: {worked.sourceCitation} ({worked.rightsStatus})
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <span>سطحیں دکھائیں:</span>
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setActiveLayerStep(step)}
                    aria-pressed={activeLayerStep === step}
                    className={`px-2 py-0.5 rounded border font-mono cursor-pointer ${
                      activeLayerStep === step
                        ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold'
                        : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Layer 1: Original Verse */}
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border-r-2 border-[var(--accent-gold)] space-y-1">
              <span className="text-[10px] text-[var(--accent-gold)] font-bold">
                سطح ۱ — اصل متن (بغیر کسی تبدیلی کے):
              </span>
              <p className="text-base font-bold">{worked.misra1}</p>
              <p className="text-sm text-[var(--text-secondary)]">{worked.misra2}</p>
            </div>

            {/* Layers 2, 3, 4: Interactive Word-by-Word Pronunciation, Syllables & Weights */}
            {activeLayerStep >= 2 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--text-secondary)]">
                  سطح ۲ تا ۴ — الفاظ پر کلک کر کے تلفظ، ہجے اور اوزان کا تعلق دیکھیں:
                </span>
                <div className="flex flex-wrap gap-2">
                  {worked.wordsMisra1.map((w, idx) => {
                    const isSelected = selectedWordIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedWordIdx(idx)}
                        aria-pressed={isSelected}
                        className={`flex flex-col items-center p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/15 shadow-xs'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)]/50'
                        }`}
                      >
                        <span className="font-bold text-sm">{w.word}</span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {w.pronunciation}
                        </span>
                        {activeLayerStep >= 3 && (
                          <span className="text-[11px] text-[var(--accent-gold)]">
                            {w.syllableParts.join(' · ')}
                          </span>
                        )}
                        {activeLayerStep >= 4 && (
                          <span
                            dir="rtl"
                            className="inline-flex items-center gap-0.5 font-mono font-bold text-[var(--accent-gold)] mt-0.5"
                          >
                            {w.pattern.split('').map((sym, sIdx) => (
                              <span key={sIdx}>{sym}</span>
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {worked.wordsMisra1[selectedWordIdx] && (
                  <div
                    role="status"
                    className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs"
                  >
                    <strong>لفظ «{worked.wordsMisra1[selectedWordIdx].word}»:</strong>{' '}
                    {worked.wordsMisra1[selectedWordIdx].ruleExplanationUrdu}
                  </div>
                )}
              </div>
            )}

            {/* Layer 5: Foot Grouping across Word Boundaries */}
            {activeLayerStep >= 5 && (
              <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-bold text-[var(--accent-gold)]">
                  سطح ۵ — ارکان کی تقسیم (لفظ کی سرحد بمقابلہ رکن کی سرحد):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {worked.feetMisra1.map((foot) => (
                    <div
                      key={foot.ruknIndex}
                      className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--accent-gold)]">
                          رکن {foot.ruknIndex}: {foot.ruknName}
                        </span>
                        <span
                          dir="rtl"
                          className="inline-flex items-center gap-0.5 font-mono font-bold text-[var(--accent-gold)]"
                        >
                          {foot.pattern.split('').map((s, i) => (
                            <span key={i}>{s}</span>
                          ))}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-primary)]">
                        {foot.syllableSliceUrdu}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {foot.boundaryNoteUrdu}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs space-y-1">
            <p className="font-bold text-amber-600 dark:text-amber-400">
              فہرست میں شامل — تفصیلی تدریسی مضمون زیرِ تیاری
            </p>
            <p className="text-[var(--text-secondary)]">
              یہ وزن Likho کے ۵۰ نامزد عروضی اوزان کے کیٹلاگ میں شامل ہے اور اوپر بٹن دبانے سے آپ کے مسودے کی تقطیع کے لیے مکمل طور پر فعال ہے۔ اس وزن کی پانچ سطحی استشہادی مثال اور مشقیں مرحلہ وار علمی نظرثانی کے بعد شامل کی جائیں گی۔
            </p>
          </div>
        )}

        {/* Counterexample / Error Clinic */}
        {counter && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2 text-xs">
            <h3 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>{counter.labelUrdu}</span>
            </h3>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              «{counter.constructedLine}»
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong>تبدیلی کا مقام:</strong> {counter.changedSegment} ·{' '}
              <strong>متاثرہ رکن:</strong> رکن نمبر {counter.brokenFootIndex} (مطلوبہ:{' '}
              <span dir="rtl" className="font-mono font-bold">
                {counter.expectedFootPattern}
              </span>{' '}
              ، حاصل شدہ:{' '}
              <span dir="rtl" className="font-mono font-bold">
                {counter.actualFootPattern}
              </span>
              )
            </p>
            <p className="text-[var(--text-secondary)]">{counter.explanationUrdu}</p>
          </div>
        )}

        {/* Neighboring Form Comparisons */}
        {entry.neighborComparisons && entry.neighborComparisons.length > 0 && (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 space-y-2.5 text-xs">
            <h3 className="font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
              <GitCompare size={15} />
              <span>ملتے جلتے اوزان سے موازنہ</span>
            </h3>
            <div className="space-y-2">
              {entry.neighborComparisons.map((nb) => (
                <div
                  key={nb.meterId}
                  className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm">{nb.nameUrdu}</span>
                    {onOpenNeighborMeter && (
                      <button
                        type="button"
                        onClick={() => onOpenNeighborMeter(nb.meterId)}
                        className="text-[11px] text-[var(--accent-gold)] underline cursor-pointer"
                      >
                        یہ وزن کھولیں
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--accent-gold)]">{nb.patternSummary}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {nb.differenceExplanationUrdu}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unseen Practice Exercise (Prediction before reveal, staged hints) */}
        {practice && (
          <div
            data-testid="meter-practice-exercise"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-[var(--accent-gold)] flex items-center gap-1.5">
              <Sparkles size={15} />
              <span>عملی مشق (پہلے خود پرکھیں)</span>
            </h3>
            <p className="text-[var(--text-secondary)]">{practice.promptUrdu}</p>
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
              <p className="text-base font-bold">«{practice.verseLine}»</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                {practice.poet} ({practice.sourceCitation})
              </p>
            </div>

            <p id="meter-practice-q" className="font-bold">
              {practice.questionUrdu}
            </p>

            {/* Staged Hint Button */}
            {hintStep < practice.hintLadderUrdu.length && (
              <div>
                <button
                  type="button"
                  onClick={() => setHintStep((h) => h + 1)}
                  className={`${buttonClass} inline-flex items-center gap-1 text-[var(--accent-gold)]`}
                >
                  <HelpCircle size={13} />
                  <span>اشارہ دکھائیں ({hintStep + 1}/{practice.hintLadderUrdu.length})</span>
                </button>
              </div>
            )}

            {hintStep > 0 && (
              <div className="space-y-1 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--accent-gold)]/30">
                {practice.hintLadderUrdu.slice(0, hintStep).map((hint, idx) => (
                  <p key={idx} className="text-[11px] text-[var(--text-secondary)]">
                    {hint}
                  </p>
                ))}
              </div>
            )}

            <div role="group" aria-labelledby="meter-practice-q" className="grid gap-2">
              {practice.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-pressed={selectedOptionIdx === idx}
                  onClick={() => setSelectedOptionIdx(idx)}
                  className={`${buttonClass} text-right ${
                    selectedOptionIdx === idx
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-amber-500 bg-amber-500/10'
                      : 'bg-[var(--bg-surface)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {selectedOptionIdx !== null && practice.options[selectedOptionIdx] && (
              <div
                role="status"
                aria-live="polite"
                className={`p-3 rounded-xl border ${
                  practice.options[selectedOptionIdx].isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                }`}
              >
                {practice.options[selectedOptionIdx].feedbackUrdu}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

