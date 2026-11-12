import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Edit3, Sparkles, Download, RotateCcw, Info } from 'lucide-react';
import { AroozLexiconService } from '../../services/aroozLexiconService';
import { FOOT_NAMES } from '../../data/prosodyMeters';

interface QuickScansionCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  fontFamily: string;
}

const COMMON_RUKN_PRESETS: { rukn: string; pattern: string; desc: string }[] = [
  { rukn: 'فعولن', pattern: '-=-', desc: 'ہزج و متقارب کا رکن' },
  { rukn: 'فاعلن', pattern: '=-=', desc: 'رمل و متدارک کا رکن' },
  { rukn: 'مفاعیلن', pattern: '-===', desc: 'بحرِ ہزج سالم' },
  { rukn: 'فاعلاتن', pattern: '=-==', desc: 'بحرِ رمل سالم' },
  { rukn: 'مستفعلن', pattern: '==-=-', desc: 'بحرِ رجز سالم' },
  { rukn: 'مفعولن', pattern: '===-', desc: 'ہزج اخرب کا صدر' },
  { rukn: 'مفاعلن', pattern: '-=-', desc: 'رجز مخبون' },
  { rukn: 'فعلاتن', pattern: '--==', desc: 'رمل مخبون' },
  { rukn: 'فعول', pattern: '-=', desc: 'متقارب محذوف' },
  { rukn: 'فاع', pattern: '=-', desc: 'رمل محذوف' },
  { rukn: 'فعل', pattern: '--', desc: 'ہجائے دو کوتاہ' },
  { rukn: 'فَع', pattern: '=', desc: 'ہجائے بلند مفرد' },
];

export const QuickScansionCorrectionModal: React.FC<QuickScansionCorrectionModalProps> = ({
  isOpen,
  onClose,
  word,
  fontFamily,
}) => {
  const [pattern, setPattern] = useState('');
  const [vocalized, setVocalized] = useState('');
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load current readings on open
  useEffect(() => {
    if (!isOpen || !word) return;
    setSaveSuccess(false);
    setErrorMessage(null);

    const existingProposal = AroozLexiconService.getProposal(word);
    if (existingProposal) {
      setPattern(existingProposal.pattern);
      setVocalized(existingProposal.vocalized || '');
      setNotes(existingProposal.notes || 'شاعر کی تصدیق شدہ قرأت');
      return;
    }

    const readings = AroozLexiconService.getLexicalReadings(word);
    if (readings.length > 0) {
      setPattern(readings[0].pattern);
      setVocalized(readings[0].vocalized || word);
      setNotes('');
    } else {
      setPattern('');
      setVocalized(word);
      setNotes('');
    }
  }, [isOpen, word]);

  const cleanPattern = useMemo(() => pattern.replace(/\s+/g, ''), [pattern]);
  const ruknName = useMemo(() => {
    if (!cleanPattern) return '';
    return FOOT_NAMES[cleanPattern.replace(/x/g, '=')] || 'مرکب عروضی وزن';
  }, [cleanPattern]);

  if (!isOpen || !word) return null;

  const handleApplyPreset = (presetPattern: string) => {
    setPattern(presetPattern);
  };

  const handleAppendSymbol = (symbol: '-' | '=') => {
    setPattern((prev) => prev + symbol);
  };

  const handleSaveCorrection = async () => {
    if (!cleanPattern) {
      setErrorMessage('براہِ کرم کم از کم ایک عروضی علامت (- یا =) درج فرمائیں');
      return;
    }

    const res = await AroozLexiconService.saveProposal({
      word: word.trim(),
      pattern: cleanPattern,
      vocalized: vocalized.trim() || word.trim(),
      status: 'approved',
      sourceReference: 'user:poet-override',
      notes: notes.trim() || 'شاعر کی تصدیق شدہ قرأت',
    });

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.error || 'وزن محفوظ نہ ہو سکا');
    }
  };

  const handleExportCorrections = () => {
    const jsonStr = AroozLexiconService.exportLexiconAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `likho-corrections-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[var(--accent-gold)]" />
            <h3 className="font-nastaliq font-bold text-base text-[var(--text-primary)]">
              تصحیحِ وزن و تقطیع (Scansion Correction)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {/* Target Word Hero */}
          <div className="p-4 rounded-xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/5 flex flex-col items-center justify-center text-center">
            <span
              style={{ fontFamily }}
              className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-1"
            >
              {word}
            </span>
            <div className="flex items-center gap-2 text-xs font-nastaliq text-[var(--text-muted)]">
              <span>وزن کا نام:</span>
              <strong className="text-[var(--accent-gold)]">{ruknName || 'زیرِ تدوین'}</strong>
              {cleanPattern && (
                <span
                  dir="rtl"
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-bold tracking-widest"
                >
                  {cleanPattern}
                </span>
              )}
            </div>
          </div>

          {/* Quick Preset Rukn Buttons */}
          <div>
            <label className="block text-xs font-nastaliq font-bold text-[var(--text-primary)] mb-1.5">
              مقبول عروضی ارکان (ایک کلک سے چنیں):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_RUKN_PRESETS.map((p) => {
                const isSelected = cleanPattern === p.pattern;
                return (
                  <button
                    key={p.rukn + p.pattern}
                    type="button"
                    onClick={() => handleApplyPreset(p.pattern)}
                    title={`${p.desc} (${p.pattern})`}
                    className={`px-2 py-1 rounded-lg text-xs font-nastaliq border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-bold shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--accent-gold)]'
                    }`}
                  >
                    <span>{p.rukn}</span>
                    <span className="font-mono text-[10px] opacity-75 mr-1">({p.pattern})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Pattern Builder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-nastaliq font-bold text-[var(--text-primary)]">
                عروضی علامات (- کوتاہ، = بلند):
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAppendSymbol('-')}
                  className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-xs font-bold font-mono"
                  title="ہجائے کوتاہ (-)"
                >
                  + کوتاہ (-)
                </button>
                <button
                  type="button"
                  onClick={() => handleAppendSymbol('=')}
                  className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-xs font-bold font-mono"
                  title="ہجائے بلند (=)"
                >
                  + بلند (=)
                </button>
                <button
                  type="button"
                  onClick={() => setPattern('')}
                  className="p-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-500"
                  title="صاف کریں"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="مثلاً: -=- یا =--="
              dir="ltr"
              className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center font-mono font-bold tracking-widest text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          {/* Vocalized Pronunciation Input */}
          <div>
            <label className="block text-xs font-nastaliq font-bold text-[var(--text-primary)] mb-1">
              اعراب کے ساتھ املا / تلفظ (اختیاری):
            </label>
            <input
              type="text"
              value={vocalized}
              onChange={(e) => setVocalized(e.target.value)}
              style={{ fontFamily }}
              placeholder="مثلاً: خَاب یا مُحَبَّت"
              className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-right font-nastaliq text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          {/* Poet's Note / Literary Sanad */}
          <div>
            <label className="block text-xs font-nastaliq font-bold text-[var(--text-primary)] mb-1">
              وجہ یا ادبی سند (اختیاری):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: واوِ معدولہ ہے یا کلاسیکی شعر کی سند"
              className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-right font-nastaliq text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-nastaliq">
              {errorMessage}
            </div>
          )}

          {/* Explanatory Note */}
          <div className="p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-2 text-[11px] font-nastaliq text-[var(--text-muted)]">
            <Info className="w-3.5 h-3.5 shrink-0 text-[var(--accent-gold)] mt-0.5" />
            <p className="leading-relaxed">
              آپ کی یہ تصحیح فوری طور پر آپ کے کمپیوٹر میں لاگو ہو جائے گی اور قافیہ و تقطیع اسی نئے وزن کے مطابق اپ ڈیٹ ہو جائیں گے۔
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleExportCorrections}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-nastaliq text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]"
            title="میری تمام تجاویز بطور JSON ڈاؤنلوڈ کریں"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تجاویز ڈاؤنلوڈ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-nastaliq text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              منسوخ
            </button>
            <button
              type="button"
              onClick={handleSaveCorrection}
              disabled={saveSuccess}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-nastaliq font-bold transition-all shadow-sm ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[var(--accent-gold)] text-white hover:bg-[var(--accent-gold)]/90'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>محفوظ ہو گیا!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>محفوظ اور لاگو کریں</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
