import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { PoemDraft } from '../../types/editor';
import { StorageService } from '../../services/storageService';

interface PortfolioTabProps {
  currentDraftId: string;
  onSelectDraft: (draft: PoemDraft) => void;
  fontFamily: string;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({
  currentDraftId,
  onSelectDraft,
  fontFamily,
}) => {
  const [drafts, setDrafts] = useState<PoemDraft[]>([]);
  const [search, setSearch] = useState('');

  const refreshDrafts = () => {
    setDrafts(StorageService.getDrafts());
  };

  useEffect(() => {
    refreshDrafts();
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('کیا آپ واقعی اس کلام کو حذف کرنا چاہتے ہیں؟')) {
      StorageService.deleteDraft(id);
      refreshDrafts();
    }
  };

  const handleExportBackup = () => {
    const json = StorageService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qalam_diwan_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && StorageService.restoreBackup(content)) {
        refreshDrafts();
        alert('بیک اپ کامیابی کے ساتھ بحال ہو گیا۔');
      } else {
        alert('بیک اپ فائل پڑھنے میں خرابی پیش آئی۔');
      }
    };
    reader.readAsText(file);
  };

  const filteredDrafts = drafts.filter(
    (d) =>
      !search.trim() ||
      d.title.includes(search) ||
      d.poet.includes(search) ||
      d.content.includes(search) ||
      (d.meterName && d.meterName.includes(search))
  );

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Search Bar & Backup Actions */}
      <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="مسودات میں تلاش کریں..."
            className="w-full pl-2 pr-8 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-nastaliq text-right"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[var(--text-muted)]" />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-nastaliq text-[var(--text-muted)] text-[11px]">
            کل کلام: <strong className="text-[var(--text-primary)] font-mono">{drafts.length}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
              title="مکمل دیوان کا بیک اپ ڈاؤنلوڈ کریں"
            >
              <Download className="w-3 h-3 text-[var(--accent-gold)]" />
              <span>بیک اپ</span>
            </button>

            <label
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-nastaliq border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] cursor-pointer"
              title="بیک اپ فائل بحال کریں"
            >
              <Upload className="w-3 h-3 text-[var(--accent-gold)]" />
              <span>بحالی</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Drafts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {filteredDrafts.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-muted)] font-nastaliq">
            کوئی مسودہ نہیں ملا۔
          </div>
        ) : (
          filteredDrafts.map((draft) => {
            const isActive = draft.id === currentDraftId;
            const dateStr = new Date(draft.updatedAt || draft.createdAt).toLocaleDateString('ur-PK', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={draft.id}
                onClick={() => onSelectDraft(draft)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 shadow-xs'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-gold)]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1">
                    <h4
                      style={{ fontFamily }}
                      className="text-base font-bold text-[var(--text-primary)] leading-snug"
                    >
                      {draft.title || 'بے عنوان کلام'}
                    </h4>
                    <span className="text-[11px] font-nastaliq text-[var(--accent-gold)] font-medium">
                      شاعر: {draft.poet || 'نامعلوم'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isActive && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    <button
                      onClick={(e) => handleDelete(e, draft.id)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--bg-subtle)] transition-colors"
                      title="مسودہ حذف کریں"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Excerpt / First line */}
                <p
                  style={{ fontFamily }}
                  className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-2"
                >
                  {draft.content ? draft.content.split('\n')[0] : 'خالی مسودہ...'}
                </p>

                {/* Footer Badges */}
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1.5 border-t border-[var(--border-subtle)]/40 font-nastaliq">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </div>

                  {draft.meterName && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {draft.meterName}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
