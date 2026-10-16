import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Music,
  BookMarked,
  Sparkles,
  FolderOpen,
  X,
} from 'lucide-react';
import { RhymeTreasuryTab } from './RhymeTreasuryTab';
import { ProsodyTab } from './ProsodyTab';
import { ThesaurusTab } from './ThesaurusTab';
import { RhetoricTab } from './RhetoricTab';
import { PortfolioTab } from './PortfolioTab';
import { PoemDraft } from '../../types/editor';

export type CompanionTabId = 'treasury' | 'prosody' | 'thesaurus' | 'rhetoric' | 'portfolio';

interface LiteraryCompanionProps {
  currentDraft: PoemDraft;
  selectedWord?: string;
  onLoadRhymesToTray: (words: string[]) => void;
  onSelectMeter: (name: string, rukn: string) => void;
  onSelectWordToInsert?: (word: string) => void;
  onSelectDraft: (draft: PoemDraft) => void;
  fontFamily: string;
  onClose?: () => void;
}

export const LiteraryCompanion: React.FC<LiteraryCompanionProps> = ({
  currentDraft,
  selectedWord,
  onLoadRhymesToTray,
  onSelectMeter,
  onSelectWordToInsert,
  onSelectDraft,
  fontFamily,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<CompanionTabId>('treasury');

  // Auto switch to thesaurus when user selects a word in editor
  React.useEffect(() => {
    if (selectedWord && selectedWord.trim()) {
      setActiveTab('thesaurus');
    }
  }, [selectedWord]);

  const tabs: { id: CompanionTabId; label: string; icon: React.ReactNode }[] = [
    { id: 'treasury', label: 'خزانہ قوافی', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'prosody', label: 'علمِ عروض', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'thesaurus', label: 'لغت و الفاظ', icon: <BookMarked className="w-3.5 h-3.5" /> },
    { id: 'rhetoric', label: 'صنائع بدائع', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'portfolio', label: 'دیوانِ کلام', icon: <FolderOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-l border-[var(--border-subtle)] overflow-hidden select-none">
      {/* Top Header & Tab Strip */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="h-10 px-3 flex items-center justify-between border-b border-[var(--border-subtle)]/60">
          <div className="flex items-center gap-1.5 text-xs font-bold font-nastaliq text-[var(--text-primary)]">
            <BookOpen className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>ادبی معاون (Literary Companion)</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              title="پینل بند کریں"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex overflow-x-auto p-1.5 gap-1 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-nastaliq whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold shadow-xs'
                  : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'treasury' && (
          <RhymeTreasuryTab onLoadToTray={onLoadRhymesToTray} fontFamily={fontFamily} />
        )}
        {activeTab === 'prosody' && (
          <ProsodyTab
            currentMeterName={currentDraft.meterName}
            onSelectMeter={onSelectMeter}
            fontFamily={fontFamily}
          />
        )}
        {activeTab === 'thesaurus' && (
          <ThesaurusTab
            selectedWord={selectedWord}
            onSelectWordToInsert={onSelectWordToInsert}
            fontFamily={fontFamily}
          />
        )}
        {activeTab === 'rhetoric' && <RhetoricTab fontFamily={fontFamily} />}
        {activeTab === 'portfolio' && (
          <PortfolioTab
            currentDraftId={currentDraft.id}
            onSelectDraft={onSelectDraft}
            fontFamily={fontFamily}
          />
        )}
      </div>
    </div>
  );
};
