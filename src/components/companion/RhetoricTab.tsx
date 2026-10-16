import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { RHETORICAL_DEVICES } from '../../data/rhetoricalDevices';

interface RhetoricTabProps {
  fontFamily: string;
}

export const RhetoricTab: React.FC<RhetoricTabProps> = ({ fontFamily }) => {
  const [search, setSearch] = useState('');

  const filteredDevices = RHETORICAL_DEVICES.filter(
    (d) =>
      !search.trim() ||
      d.nameUrdu.includes(search) ||
      d.nameEnglish.toLowerCase().includes(search.toLowerCase()) ||
      d.definition.includes(search) ||
      d.sampleCouplet.poet.includes(search)
  );

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="صنعت تلاش کریں (مثلاً: تضاد، تجنیس، حسنِ تعلیل)..."
            className="w-full pl-2 pr-8 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq text-right"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xs hover:border-[var(--accent-gold)]/50 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <h4 className="text-sm font-bold font-nastaliq text-[var(--text-primary)]">
                  {device.nameUrdu}
                </h4>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{device.nameEnglish}</span>
              </div>
              <span className="p-1 rounded-md bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-nastaliq mb-2.5 leading-relaxed">
              {device.definition}
            </p>

            {/* Sample Verse with Nastaliq font */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border-r-3 border-[var(--accent-gold)] text-xs font-nastaliq">
              <p
                style={{ fontFamily }}
                className="text-xs text-[var(--text-primary)] font-medium leading-loose text-center py-0.5"
              >
                {device.sampleCouplet.misra1}
                <br />
                {device.sampleCouplet.misra2}
              </p>
              <div className="flex items-center justify-between text-[10px] text-[var(--accent-gold)] mt-1 pt-1 border-t border-[var(--border-subtle)]/40 font-semibold">
                <span>— {device.sampleCouplet.poet}</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-nastaliq mt-1">
                {device.sampleCouplet.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
