import React, { useState, useEffect } from 'react';
import { X, Download, Sparkles } from 'lucide-react';
import { ExportService } from '../../services/exportService';

interface CalligraphyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  poet: string;
  content: string;
}

export const CalligraphyCardModal: React.FC<CalligraphyCardModalProps> = ({
  isOpen,
  onClose,
  title,
  poet,
  content,
}) => {
  const [theme, setTheme] = useState<'parchment' | 'obsidian' | 'emerald'>('parchment');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    ExportService.generateCalligraphyCard(title, poet, content, theme)
      .then((url) => {
        if (isMounted) {
          setImageSrc(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate card:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, title, poet, content, theme]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageSrc) return;
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = `${title || 'kalam'}_card_${theme}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />
            <h3 className="font-nastaliq font-bold text-base text-[var(--text-primary)]">
              خطاطی کارڈ ساز (Calligraphy Card Generator)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Selector */}
        <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 flex items-center justify-between text-xs">
          <span className="font-nastaliq text-[var(--text-secondary)]">پس منظر اور رنگ:</span>
          <div className="flex items-center gap-1.5 font-nastaliq">
            <button
              onClick={() => setTheme('parchment')}
              className={`px-3 py-1 rounded-lg border transition-all ${
                theme === 'parchment'
                  ? 'bg-[#F4EEDC] text-[#2C241E] border-[#D4AF37] font-bold shadow-xs'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              کاغذ (Parchment)
            </button>
            <button
              onClick={() => setTheme('obsidian')}
              className={`px-3 py-1 rounded-lg border transition-all ${
                theme === 'obsidian'
                  ? 'bg-[#12151B] text-[#F3EDE0] border-[#D4AF37] font-bold shadow-xs'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              شبینہ (Obsidian)
            </button>
            <button
              onClick={() => setTheme('emerald')}
              className={`px-3 py-1 rounded-lg border transition-all ${
                theme === 'emerald'
                  ? 'bg-[#09231B] text-[#F0FDF4] border-[#059669] font-bold shadow-xs'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              زمرد (Emerald)
            </button>
          </div>
        </div>

        {/* Card Preview */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[var(--bg-canvas)]">
          {loading ? (
            <div className="py-20 text-center font-nastaliq text-sm text-[var(--text-muted)]">
              کارڈ تیار ہو رہا ہے...
            </div>
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt="Calligraphy Card Preview"
              className="max-h-[55vh] rounded-lg shadow-xl border border-[var(--border-subtle)] object-contain"
            />
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)] font-nastaliq">
            سوشل میڈیا اور دوستوں کے ساتھ اشتراک کے لیے مثالی تصویر (1080x1350)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-nastaliq border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              بند کریں
            </button>
            <button
              onClick={handleDownload}
              disabled={!imageSrc}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-nastaliq font-bold bg-[var(--accent-gold)] text-white hover:brightness-110 disabled:opacity-40 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصویر ڈاؤنلوڈ کریں (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
