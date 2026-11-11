import { useState } from 'react';
import { ArrowRight, BookOpen, Check, RotateCcw } from 'lucide-react';

interface Props {
  onClose: () => void;
  fontFamily: string;
}

export function FirstTaqtiLesson({ onClose, fontFamily }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const reset = () => { setRevealed(false); setAnswer(null); setCompleted(false); };
  const buttonClass = 'rounded-xl border border-[var(--border-subtle)] px-4 py-2 hover:border-[var(--accent-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)]';

  return (
    <section dir="rtl" aria-labelledby="taqti-lesson-title" className="h-full overflow-y-auto custom-scrollbar bg-[var(--bg-surface)] text-[var(--text-primary)]" style={{ fontFamily }}>
      <div className="max-w-2xl mx-auto p-5 space-y-6 leading-[2.3]">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={onClose} className={`${buttonClass} flex items-center gap-2 text-xs`}><ArrowRight size={14} /> بحور کی فہرست</button>
          <span className="text-xs text-[var(--text-muted)]">تعارفی نمونہ · تقریباً ۲ منٹ</span>
        </div>
        <header>
          <p className="text-sm text-[var(--accent-gold)] flex items-center gap-2"><BookOpen size={17} /> رہنمائے شعر و عروض</p>
          <h2 id="taqti-lesson-title" className="text-2xl font-bold mt-3">سبق ۱: حروف سے آواز تک</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-3">تقطیع کا پہلا قدم: لفظ کو صرف دیکھنا نہیں، اس کے تلفظ کو سمجھنا۔</p>
        </header>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
          <h3 className="font-bold text-[var(--accent-gold)]">آج ہم کیا سیکھیں گے؟</h3>
          <p className="text-sm mt-2">حرف لکھائی کی اکائی ہے۔ ہجا تلفظ کا ایک حصہ ہے۔ حروف کی تعداد گن لینے سے ہجوں کی تعداد معلوم نہیں ہوتی۔</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">چھوٹے اور لمبے ہجوں کا وزن اگلے سبق کا موضوع ہوگا۔</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] p-4 text-center">
          <h3 className="text-sm text-[var(--text-secondary)]">لفظ کو معمول کے تلفظ میں پڑھیں</h3>
          <p className="text-4xl py-5">پانی</p>
          <p className="text-sm mb-4">اسے کن حصوں میں ادا کرتے ہیں؟ پہلے خود سوچیں۔</p>
          <button type="button" onClick={() => setRevealed(!revealed)} aria-expanded={revealed} aria-controls="syllable-example" className={`${buttonClass} text-sm text-[var(--accent-gold)]`}>
            {revealed ? 'تقسیم چھپائیں' : 'ہجوں کی تقسیم دیکھیں'}
          </button>
          {revealed && <div id="syllable-example" className="mt-5" aria-live="polite">
            <div className="flex justify-center gap-3" aria-label="پہلا ہجا پا، دوسرا ہجا نی">
              <span className="rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] px-6 py-2 text-2xl">پا</span>
              <span className="rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] px-6 py-2 text-2xl">نی</span>
            </div>
            <p className="text-sm mt-4">چار لکھے ہوئے حروف، مگر دو ہجے: <strong>پا · نی</strong>۔</p>
            <p className="text-xs text-[var(--text-muted)] mt-2">خانے تلفظ کے حصے دکھاتے ہیں؛ پڑھتے وقت ان کے درمیان وقفہ ضروری نہیں۔</p>
          </div>}
        </div>

        {revealed && <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
          <h3 className="font-bold">اب آپ بتائیں</h3>
          <p id="taqti-question" className="text-sm mt-2">تقطیع میں ہجے پہچاننے کے لیے بنیادی توجہ کس پر ہونی چاہیے؟</p>
          <div role="group" aria-labelledby="taqti-question" className="grid gap-3 mt-4">
            {['صرف لکھے ہوئے حروف کی تعداد پر', 'لفظ کے تلفظ اور اس کے ہجوں پر'].map((label, index) => (
              <button key={label} type="button" aria-pressed={answer === index} onClick={() => { setAnswer(index); setCompleted(false); }} className={`${buttonClass} text-right text-sm ${answer === index ? 'border-[var(--accent-gold)] bg-[var(--bg-subtle)]' : ''}`}>{label}</button>
            ))}
          </div>
          <div aria-live="polite" aria-atomic="true" className="text-sm mt-4">
            {answer === 0 && <p>دوبارہ سوچیں: پانی میں چار حروف ہیں، مگر ہم نے دو ہجے پہچانے۔ لکھائی مدد دیتی ہے، لیکن تلفظ کو سمجھنا ضروری ہے۔</p>}
            {answer === 1 && <p><strong className="text-[var(--accent-gold)]">درست۔</strong> ہم پہلے لفظ کی قرأت سمجھتے ہیں، پھر ہجے پہچانتے ہیں۔ اس کے بعد ان کا وزن دیکھ سکتے ہیں۔</p>}
          </div>
          {answer === 1 && !completed && <button type="button" onClick={() => setCompleted(true)} className={`${buttonClass} mt-4 text-sm text-[var(--accent-gold)]`}>سبق کا خلاصہ دیکھیں</button>}
        </div>}

        {completed && <div role="status" className="rounded-2xl border border-[var(--accent-gold)] p-4">
          <h3 className="font-bold flex items-center gap-2"><Check size={18} /> پہلا قدم مکمل</h3>
          <p className="text-sm mt-2">یاد رکھیں: حرف، ہجا اور وزن الگ تصورات ہیں۔ آج ہم نے حرف اور ہجے میں فرق دیکھا۔</p>
          <p className="text-sm mt-2 text-[var(--text-secondary)]">اگلا مجوزہ سبق: ہجا کیسے بنتا ہے؟</p>
          <button type="button" onClick={reset} className={`${buttonClass} flex items-center gap-2 mt-4 text-sm`}><RotateCcw size={14} /> دوبارہ آزمائیں</button>
        </div>}
        <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-4">یہ ابتدائی تعلیمی نمونہ ہے؛ مکمل نصاب اور مواد کی علمی نظرثانی ابھی باقی ہے۔ اس نمونے کی پیش رفت محفوظ نہیں ہوتی۔</p>
      </div>
    </section>
  );
}
