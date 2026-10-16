import React, { useState } from 'react';
import {
  Search,
  Plus,
  RotateCcw,
  Sliders,
  Check,
  X,
  Sparkles,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { QafiyaChip } from '../../types/editor';
import { MarkerOption } from '../../types/workspace';

interface QafiyaTrayProps {
  chips: QafiyaChip[];
  filteredChips: QafiyaChip[];
  searchFilter: string;
  onSearchChange: (val: string) => void;
  onToggleChip: (id: string) => void;
  onAddWord: (word: string) => void;
  onRemoveWord: (id: string) => void;
  onResync: () => void;
  usedCount: number;
  totalCount: number;
  zoom: number; // Font size in px
  onZoomChange: (val: number) => void;
  markerStyle: MarkerOption;
  onMarkerStyleChange: (style: MarkerOption) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  dockPosition: 'top' | 'bottom';
  fontFamily: string;
}

export const QafiyaTray: React.FC<QafiyaTrayProps> = ({
  filteredChips,
  searchFilter,
  onSearchChange,
  onToggleChip,
  onAddWord,
  onRemoveWord,
  onResync,
  usedCount,
  totalCount,
  zoom,
  onZoomChange,
  markerStyle,
  onMarkerStyleChange,
  isOpen,
  onToggleOpen,
  dockPosition,
  fontFamily,
}) => {
  const [newWordInput, setNewWordInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWordInput.trim()) {
      onAddWord(newWordInput.trim());
      setNewWordInput('');
    }
  };

  const getMarkerClass = (isUsed: boolean) => {
    if (!isUsed) {
      return 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)] shadow-xs';
    }

    switch (markerStyle) {
      case 'strike':
        return 'line-through opacity-40 bg-[var(--bg-subtle)] text-[var(--text-muted)] border-dashed border-[var(--border-subtle)]';
      case 'glow':
        return 'bg-amber-500/15 border-amber-500/60 text-amber-700 dark:text-amber-300 font-bold shadow-[0_0_12px_rgba(217,119,6,0.25)] ring-1 ring-amber-500/30';
      case 'check':
        return 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 underline underline-offset-4 decoration-emerald-500 decoration-2 font-medium';
    }
  };

  if (!isOpen) {
    return (
      <div className="h-9 px-4 flex items-center justify-between bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] select-none">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span className="font-nastaliq font-medium">قوافی کی تختی (بند ہے)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono">
            {usedCount} / {totalCount}
          </span>
        </div>
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-1 text-[var(--accent-gold)] hover:underline text-xs font-nastaliq"
        >
          <span>تختی کھولیں</span>
          {dockPosition === 'top' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[var(--bg-card)]/95 border-b border-[var(--border-subtle)] transition-all select-none">
      {/* Tray Header Bar */}
      <div className="h-11 px-4 flex items-center justify-between border-b border-[var(--border-subtle)]/60 bg-[var(--bg-subtle)]/50 text-xs">
        {/* Left/Right Urdu: Title & Usage Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
            <Layers className="w-4 h-4 text-[var(--accent-gold)]" />
            <span className="font-nastaliq font-bold text-sm">قوافی کی تختی</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1 min-h-[28px] rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)] shadow-2xs">
            <span className="text-[var(--accent-gold)] font-bold">{usedCount}</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span>{totalCount}</span>
            <span className="text-xs font-nastaliq mr-1 text-[var(--text-secondary)] font-medium">مستعمل</span>
          </div>

          <button
            onClick={onResync}
            title="کلام کے ساتھ خودکار مطابقت کریں (Re-sync with text)"
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-surface)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Custom Add Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Filter */}
          <div className="relative w-32 sm:w-44">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="تلاش کریں..."
              className="w-full pl-2 pr-7 py-1 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq text-right"
            />
            <Search className="w-3.5 h-3.5 absolute right-2 top-2 text-[var(--text-muted)]" />
          </div>

          {/* Quick Add Custom Rhyme */}
          <form onSubmit={handleAddSubmit} className="hidden sm:flex items-center gap-1">
            <input
              type="text"
              value={newWordInput}
              onChange={(e) => setNewWordInput(e.target.value)}
              placeholder="نیا قافیہ..."
              className="w-28 pl-2 pr-2 py-1 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq text-right"
            />
            <button
              type="submit"
              disabled={!newWordInput.trim()}
              className="p-1 rounded-md bg-[var(--accent-gold)] text-white hover:brightness-110 disabled:opacity-40 transition-all"
              title="قافیہ شامل کریں"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Settings Trigger for Zoom & Marker */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] transition-colors"
              title="تختی کی ترتیبات (Zoom & Marker)"
            >
              <Sliders className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            </button>

            {showSettings && (
              <div className="absolute top-full mt-2 left-0 right-auto w-64 p-3 rounded-xl shadow-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] z-50 animate-in fade-in slide-in-from-top-2">
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                    <span>حجمِ الفاظ (Chip Zoom)</span>
                    <span className="font-mono text-[var(--accent-gold)]">{zoom}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="26"
                    value={zoom}
                    onChange={(e) => onZoomChange(Number(e.target.value))}
                    className="w-full accent-[var(--accent-gold)] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                    اندازِ استعمال (Marker Style)
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => onMarkerStyleChange('strike')}
                      className={`px-2 py-1.5 rounded text-[11px] font-nastaliq border ${
                        markerStyle === 'strike'
                          ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      تنسیخ
                    </button>
                    <button
                      onClick={() => onMarkerStyleChange('glow')}
                      className={`px-2 py-1.5 rounded text-[11px] font-nastaliq border ${
                        markerStyle === 'glow'
                          ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      نمایاں
                    </button>
                    <button
                      onClick={() => onMarkerStyleChange('check')}
                      className={`px-2 py-1.5 rounded text-[11px] font-nastaliq border ${
                        markerStyle === 'check'
                          ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      نشان زدہ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapse Tray */}
          <button
            onClick={onToggleOpen}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="تختی بند کریں"
          >
            {dockPosition === 'top' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chips Container: Horizontal scroll / wrapped chips */}
      <div className="p-3 max-h-44 overflow-y-auto flex flex-wrap gap-2 items-center">
        {filteredChips.length === 0 ? (
          <div className="w-full py-4 text-center text-xs text-[var(--text-muted)] font-nastaliq">
            کوئی قافیہ نہیں ملا۔ "خزانہ قوافی" سے نئے قوافی منتخب فرمائیں یا دستی شامل کریں۔
          </div>
        ) : (
          filteredChips.map((chip) => (
            <div
              key={chip.id}
              onClick={() => onToggleChip(chip.id)}
              style={{
                fontSize: `${zoom}px`,
                fontFamily: fontFamily,
              }}
              className={`group cursor-pointer select-none px-3.5 py-1 rounded-lg border transition-all duration-200 flex items-center gap-1.5 relative ${getMarkerClass(
                chip.isUsed
              )}`}
            >
              {markerStyle === 'check' && chip.isUsed && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              {markerStyle === 'glow' && chip.isUsed && <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />}

              <span>{chip.word}</span>

              {/* Remove button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveWord(chip.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-red-500 transition-opacity"
                title="حذف کریں"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
