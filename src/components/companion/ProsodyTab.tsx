import React, { useState, useEffect } from 'react';
import { Search, Check, Music, Database, BookOpen } from 'lucide-react';
import { CLASSICAL_METERS } from '../../data/classicalMeters';
import { analyzeMisra } from '../../services/prosodyEngine';
import { AroozLexiconService } from '../../services/aroozLexiconService';
import { LexiconManagerModal } from './LexiconManagerModal';
import { FirstTaqtiLesson } from '../reference/FirstTaqtiLesson';
import { MeterReferenceView } from '../reference/MeterReferenceView';
import { getMeterAtlasEntry, REVIEW_STAGE_LABELS } from '../../data/meterReferenceAtlas';
import { ProsodicPatternView } from '../common/ProsodicPatternView';

interface ProsodyTabProps {
  currentMeterName?: string;
  onSelectMeter: (name: string, rukn: string) => void;
  fontFamily: string;
}

export const ProsodyTab: React.FC<ProsodyTabProps> = ({
  currentMeterName,
  onSelectMeter,
  fontFamily,
}) => {
  const [search, setSearch] = useState('');
  const [lessonOpen, setLessonOpen] = useState(false);
  const [activeAtlasMeterId, setActiveAtlasMeterId] = useState<string | null>(null);
  const [testLine, setTestLine] = useState('');
  const [isLexiconModalOpen, setIsLexiconModalOpen] = useState(false);
  const [lexiconWordCount, setLexiconWordCount] = useState(AroozLexiconService.getTotalWordCount());
  const [lexStats, setLexStats] = useState(AroozLexiconService.getVocabularyStats());

  useEffect(() => {
    setLexiconWordCount(AroozLexiconService.getTotalWordCount());
    setLexStats(AroozLexiconService.getVocabularyStats());
    const unsub = AroozLexiconService.subscribe(() => {
      setLexiconWordCount(AroozLexiconService.getTotalWordCount());
      setLexStats(AroozLexiconService.getVocabularyStats());
    });
    return unsub;
  }, []);

  const filteredMeters = CLASSICAL_METERS.filter(
    (m) =>
      !search.trim() ||
      m.nameUrdu.includes(search) ||
      m.pattern.includes(search) ||
      m.nameEnglish.toLowerCase().includes(search.toLowerCase())
  );

  const testAnalysis = testLine.trim() ? analyzeMisra(testLine) : null;

  if (lessonOpen) return <FirstTaqtiLesson onClose={() => setLessonOpen(false)} fontFamily={fontFamily} />;

  const activeAtlasEntry = activeAtlasMeterId ? getMeterAtlasEntry(activeAtlasMeterId) : undefined;
  if (activeAtlasEntry) {
    return (
      <MeterReferenceView
        entry={activeAtlasEntry}
        fontFamily={fontFamily}
        isSelectedMeter={currentMeterName === activeAtlasEntry.nameUrdu}
        onSelectMeter={onSelectMeter}
        onBackToList={() => setActiveAtlasMeterId(null)}
        onOpenNeighborMeter={(neighborId) => setActiveAtlasMeterId(neighborId)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      <button type="button" onClick={() => setLessonOpen(true)} className="shrink-0 m-3 mb-1 p-3 rounded-xl border border-[var(--accent-gold)] bg-[var(--bg-card)] text-right font-nastaliq focus-visible:outline-2 focus-visible:outline-[var(--accent-gold)]" dir="rtl">
        <span className="block text-sm font-bold text-[var(--accent-gold)]">تقطیع سیکھیں — پہلا سبق</span>
        <span className="block text-xs text-[var(--text-secondary)] mt-1">حروف سے آواز تک · مختصر انٹرایکٹو نمونہ</span>
      </button>
      {/* Offline Lexicon Status Banner & Importer Trigger */}
      <div className="px-3 py-2 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] flex items-center justify-between text-xs font-nastaliq">
        <div className="flex items-center gap-1.5 text-[var(--accent-gold)]">
          <Database className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-bold">ذخیرۂ لغت:</span>
          <span className="font-mono font-bold text-[var(--text-primary)]">{lexiconWordCount.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-500 font-sans font-medium">(آف لائن)</span>
        </div>
        <button
          type="button"
          onClick={() => setIsLexiconModalOpen(true)}
          className="px-2.5 py-1 rounded-lg text-[11px] font-sans border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors flex items-center gap-1.5"
          title="قرنطینہ شدہ الفاظ کی جانچ یا نئے اوزان کی تصدیق کریں"
        >
          <span>نظمِ لغت و نظرثانی</span>
          <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded">
            {lexStats.quarantined} قرنطینہ
          </span>
        </button>
      </div>

      <p dir="rtl" className="px-3 py-1 text-[11px] font-nastaliq text-[var(--text-muted)] leading-[2.2]">ماخذِ تلفظ و تقطیع: لغتِ قلم و قافیہ (مستقل بالذات علمی و عروضی لغت — ۱۰۴،۰۰۰+ الفاظ)</p>
      {/* Interactive Line Tester (تقطیع و وزن آزمائش) */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold font-nastaliq text-[var(--text-primary)] flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>میزانِ مصرع (مصرع وزن آزمائش)</span>
          </label>
          {testAnalysis && (
            <span className="text-[11px] font-mono text-[var(--accent-gold)] font-bold">
              {testAnalysis.approxSyllables} ہجے
            </span>
          )}
        </div>
        <input
          type="text"
          value={testLine}
          onChange={(e) => setTestLine(e.target.value)}
          placeholder="یہاں کوئی بھی مصرع لکھ کر وزن اور روانی جانچیں..."
          style={{ fontFamily }}
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] text-right"
        />

        {testAnalysis && (
          <div className="mt-2 p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-nastaliq">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
              <span>الفاظ: {testAnalysis.wordCount}</span>
              <span>حروف: {testAnalysis.charCount}</span>
              <span>معلوم ہجے: {testAnalysis.approxSyllables}</span>
            </div>
            {/* Visual Rhythm Guide */}
            <div dir="rtl" className="flex items-center justify-center gap-1.5 py-1 text-sm font-mono tracking-widest text-[var(--accent-gold)] font-bold">
              {testAnalysis.scansionGuide.map((flag, idx) => (
                <span
                  key={idx}
                  dir="rtl"
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--accent-gold)]/30"
                >
                  {flag.split('').map((sym, sIdx) => (
                    <span key={sIdx}>{sym}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Classical Meters Search */}
      <div className="p-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/40">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحر یا ارکان تلاش کریں (مثلاً: رمل، مفاعیلن)..."
            className="w-full pl-2 pr-8 py-1 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq text-right"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2 text-[var(--text-muted)]" />
        </div>
      </div>

      {testAnalysis?.uncertainWords.length ? <p role="status" className="px-3 text-xs font-nastaliq leading-[2.2]">تلفظ درکار: {testAnalysis.uncertainWords.join("، ")}</p> : null}
      {/* Meters List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredMeters.map((meter) => {
          const isSelected = currentMeterName === meter.nameUrdu;
          const atlasEntry = getMeterAtlasEntry(meter.id);

          return (
            <div
              key={meter.id}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 shadow-sm'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="text-sm font-bold font-nastaliq text-[var(--text-primary)]">
                      {meter.nameUrdu}
                    </h4>
                    {atlasEntry && (
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-nastaliq border ${
                          atlasEntry.reviewStage === 'source-checked' || atlasEntry.reviewStage === 'poet-reviewed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                        }`}
                      >
                        {REVIEW_STAGE_LABELS[atlasEntry.reviewStage]}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-[var(--text-muted)]">{meter.nameEnglish}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    data-testid={`open-meter-reference-${meter.id}`}
                    onClick={() => setActiveAtlasMeterId(meter.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-nastaliq transition-all border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/20"
                    title="اس بحر کا مکمل مرجع، ۶۔طبقاتی تقطیع اور مشق کھولیں"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>مرجع و مشق</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectMeter(meter.nameUrdu, meter.pattern)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-nastaliq transition-all font-medium border ${
                      isSelected
                        ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)]'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:bg-[var(--bg-subtle)]'
                    }`}
                    title="کلام پر اس بحر کا اطلاق کریں"
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{isSelected ? 'فعال بحر' : 'انتخاب کریں'}</span>
                  </button>
                </div>
              </div>

              {/* Pattern / Rukn */}
              <div className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]/70 mb-2 text-center">
                <span className="text-sm font-bold font-nastaliq text-[var(--accent-gold)]">
                  {meter.pattern}
                </span>
                <div className="flex justify-center mt-1">
                  <ProsodicPatternView pattern={meter.syllabicCode} size="xs" showDirectionBadge={true} />
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] font-nastaliq mb-2 leading-relaxed">
                {meter.description}
              </p>

              {/* Only source-checked meter examples are shown. */}
              {meter.famousVerse && <div className="p-2 rounded-lg bg-[var(--bg-surface)] border-r-2 border-[var(--accent-gold)] text-xs font-nastaliq">
                <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                  "{meter.famousVerse.misra1}
                  <br />
                  {meter.famousVerse.misra2}"
                </p>
                <span className="block text-[10px] text-[var(--accent-gold)] mt-1 font-semibold">
                  — {meter.famousVerse.poet}
                </span>
              </div>}
            </div>
          );
        })}
      </div>

      <LexiconManagerModal
        isOpen={isLexiconModalOpen}
        onClose={() => setIsLexiconModalOpen(false)}
        fontFamily={fontFamily}
      />
    </div>
  );
};
