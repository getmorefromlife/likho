import { useEffect, useRef, useState, type ReactNode, type PointerEvent, type KeyboardEvent } from 'react';

interface Props {
  id: string;
  label: string;
  resetKey: string;
  className?: string;
  children: ReactNode;
  onLoadSelected?: (words: string[]) => void;
}

/** Scope selection to result chips; ordinary clicks and form controls keep their actions. */
export function WordSelectionArea({ id, label, resetKey, className = '', children, onLoadSelected }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const anchor = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);
  const dragging = useRef(false);
  const suppressClick = useRef(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [notice, setNotice] = useState('');
  const nodes = () => [...(root.current?.querySelectorAll<HTMLElement>('[data-selectable-word]') || [])];
  const choose = (items: HTMLElement[]) => {
    setSelected(items.map(item => item.dataset.selectableId!));
    setWords([...new Set(items.map(item => item.dataset.selectableWord!))]);
    const chosen = new Set(items);
    nodes().forEach(item => { item.dataset.boxSelected = String(chosen.has(item)); });
  };
  const finish = () => {
    anchor.current = null; last.current = null; dragging.current = false;
    cancelAnimationFrame(frame.current); setBox(null);
  };
  const clear = () => { finish(); choose([]); setNotice(''); };
  useEffect(() => { clear(); }, [resetKey]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const update = () => {
    const area = root.current, start = anchor.current, end = last.current;
    if (!area || !start || !end) return;
    const bounds = area.getBoundingClientRect();
    const x = start.x + bounds.left - area.scrollLeft, y = start.y + bounds.top - area.scrollTop;
    const left = Math.min(x, end.x), right = Math.max(x, end.x), top = Math.min(y, end.y), bottom = Math.max(y, end.y);
    setBox({ left: Math.max(left, bounds.left), top: Math.max(top, bounds.top),
      width: Math.max(0, Math.min(right, bounds.right) - Math.max(left, bounds.left)),
      height: Math.max(0, Math.min(bottom, bounds.bottom) - Math.max(top, bounds.top)) });
    choose(nodes().filter(item => {
      const r = item.getBoundingClientRect();
      return r.right >= left && r.left <= right && r.bottom >= top && r.top <= bottom;
    }));
  };
  const scroll = () => {
    const area = root.current, point = last.current;
    if (!area || !point || !anchor.current || !dragging.current) return;
    const r = area.getBoundingClientRect();
    const delta = point.y < r.top + 24 ? -12 : point.y > r.bottom - 24 ? 12 : 0;
    if (delta) { area.scrollTop += delta; update(); }
    frame.current = requestAnimationFrame(scroll);
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.pointerType !== 'mouse') return;
    const target = event.target as Element;
    if (target.closest('input,textarea,select,a,summary,label,[data-selection-control]')) return;
    if (target.closest('button') && !target.closest('[data-selectable-word]')) return;
    const r = event.currentTarget.getBoundingClientRect();
    anchor.current = { x: event.clientX - r.left + event.currentTarget.scrollLeft, y: event.clientY - r.top + event.currentTarget.scrollTop, pointerId: event.pointerId };
    last.current = { x: event.clientX, y: event.clientY }; dragging.current = false; suppressClick.current = false;
    if (!target.closest('[data-selectable-word]')) { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); choose([]); setNotice(''); }
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!anchor.current || !root.current) return;
    last.current = { x: event.clientX, y: event.clientY };
    const r = root.current.getBoundingClientRect(), start = anchor.current;
    if (!dragging.current && Math.hypot(event.clientX - (start.x + r.left - root.current.scrollLeft), event.clientY - (start.y + r.top - root.current.scrollTop)) < 5) return;
    if (!dragging.current) {
      dragging.current = true; suppressClick.current = true;
      root.current.setPointerCapture(event.pointerId); root.current.focus({ preventScroll: true }); setNotice('');
      frame.current = requestAnimationFrame(scroll);
    }
    event.preventDefault(); update();
  };
  const up = () => { finish(); setTimeout(() => { suppressClick.current = false; }, 0); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(words.join('\n')); setNotice('منتخب الفاظ نقل ہو گئے۔'); }
    catch { setNotice('نقل کی اجازت نہیں ملی۔ منتخب متن نیچے سے نقل کریں۔'); }
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('input,textarea,select')) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') { event.preventDefault(); choose(nodes()); }
    else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && selected.length) { event.preventDefault(); void copy(); }
    else if (event.key === 'Escape') { event.preventDefault(); clear(); }
  };
  return <div data-testid={`${id}-selection`} className="relative flex flex-col min-h-0" style={{ flex: '1 1 auto' }}>
    <div ref={root} data-testid={`${id}-words`} role="region" aria-label={`${label} — ماؤس کھینچ کر الفاظ منتخب کریں`} tabIndex={0}
      className={`word-selection-area ${className}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { finish(); suppressClick.current = false; }} onKeyDown={keys}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
      {children}
    </div>
    {box && <div data-testid={`${id}-selection-box`} aria-hidden="true" style={{ position: 'fixed', ...box, pointerEvents: 'none', zIndex: 45, border: '1px solid var(--accent-gold)', background: 'rgba(180,130,40,.12)' }} />}
    {selected.length > 0 && <div data-selection-control="true" role="toolbar" aria-label={`${label} — منتخب الفاظ`} data-testid={`${id}-selection-actions`}
      className="absolute bottom-1 inset-x-1 z-20 rounded-lg border border-[var(--accent-gold)] bg-[var(--bg-card)] shadow-lg px-2 py-1.5 flex flex-wrap items-center gap-2 text-xs font-nastaliq">
      <span role="status">{words.length} الفاظ منتخب</span>
      <button type="button" onClick={() => void copy()} className="underline">نقل کریں</button>
      {onLoadSelected && <button type="button" onClick={() => { onLoadSelected(words); setNotice('منتخب الفاظ تختی پر آ گئے۔'); }} className="underline">منتخب تختی پر لائیں</button>}
      <button type="button" onClick={clear} className="underline">انتخاب ختم کریں</button>
      {notice && <span role="status">{notice}</span>}
      {notice.includes('اجازت') && <textarea aria-label="منتخب متن" readOnly value={words.join('\n')} onFocus={event => event.target.select()} className="w-full bg-transparent select-text" />}
    </div>}
  </div>;
}
