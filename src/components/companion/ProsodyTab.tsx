import React, { useState } from 'react';
import { Search, Check, Music } from 'lucide-react';
import { CLASSICAL_METERS } from '../../data/classicalMeters';
import { analyzeMisra } from '../../services/prosodyEngine';

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
  const [testLine, setTestLine] = useState('');

  const filteredMeters = CLASSICAL_METERS.filter(
    (m) =>
      !search.trim() ||
      m.nameUrdu.includes(search) ||
      m.pattern.includes(search) ||
      m.nameEnglish.toLowerCase().includes(search.toLowerCase())
  );

  const testAnalysis = testLine.trim() ? analyzeMisra(testLine) : null;

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Interactive Line Tester (تقطیع و وزن آزمائش) */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold font-nastaliq text-[var(--text-primary)] flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>میزانِ مصرع (مصرع وزن آزمائش)</span>
          </label>
          {testAnalysis && (
            <span className="text-[11px] font-mono text-[var(--accent-gold)] font-bold">
              {testAnalysis.approxSyllables} ارکان / ہجے
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
              <span>تخمینی ہجے: {testAnalysis.approxSyllables}</span>
            </div>
            {/* Visual Rhythm Guide */}
            <div className="flex items-center justify-center gap-1.5 py-1 text-sm font-mono tracking-widest text-[var(--accent-gold)] font-bold">
              {testAnalysis.scansionGuide.map((flag, idx) => (
                <span
                  key={idx}
                  className="px-1 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--accent-gold)]/30"
                >
                  {flag}
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

      {/* Meters List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredMeters.map((meter) => {
          const isSelected = currentMeterName === meter.nameUrdu;

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
                  <h4 className="text-sm font-bold font-nastaliq text-[var(--text-primary)]">
                    {meter.nameUrdu}
                  </h4>
                  <p className="text-[11px] font-mono text-[var(--text-muted)]">{meter.nameEnglish}</p>
                </div>

                <button
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

              {/* Pattern / Rukn */}
              <div className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]/70 mb-2 text-center">
                <span className="text-sm font-bold font-nastaliq text-[var(--accent-gold)]">
                  {meter.pattern}
                </span>
                <span className="block text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                  {meter.syllabicCode}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] font-nastaliq mb-2 leading-relaxed">
                {meter.description}
              </p>

              {/* Famous Verse Example */}
              <div className="p-2 rounded-lg bg-[var(--bg-surface)] border-r-2 border-[var(--accent-gold)] text-xs font-nastaliq">
                <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                  "{meter.famousVerse.misra1}
                  <br />
                  {meter.famousVerse.misra2}"
                </p>
                <span className="block text-[10px] text-[var(--accent-gold)] mt-1 font-semibold">
                  — {meter.famousVerse.poet}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
