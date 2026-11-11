import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';

interface Point { x: number; y: number }
export function useLineBoxSelection(content: string, draftId: string, onChange: (content: string) => void) {
  const container = useRef<HTMLDivElement>(null);
  const anchor = useRef<Point | null>(null);
  const pointer = useRef<Point | null>(null);
  const frame = useRef(0);
  const dragged = useRef(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [notice, setNotice] = useState('');
  useEffect(() => { setSelected([]); setBox(null); setNotice(''); }, [content, draftId]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const clear = () => { setSelected([]); setBox(null); setNotice(''); };
  const update = () => {
    const root = container.current, start = anchor.current, end = pointer.current;
    if (!root || !start || !end) return;
    const bounds = root.getBoundingClientRect();
    const from = { x: start.x + bounds.left - root.scrollLeft, y: start.y + bounds.top - root.scrollTop };
    if (Math.hypot(from.x - end.x, from.y - end.y) < 5 && !dragged.current) return;
    dragged.current = true;
    const left = Math.max(bounds.left, Math.min(from.x, end.x));
    const right = Math.min(bounds.right, Math.max(from.x, end.x));
    const top = Math.max(bounds.top, Math.min(from.y, end.y));
    const bottom = Math.min(bounds.bottom, Math.max(from.y, end.y));
    setBox({ left, top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) });
    const indices = [...root.querySelectorAll<HTMLElement>('[data-line-index]')].filter(row => {
      const rect = row.getBoundingClientRect();
      // Include off-screen rows crossed while auto-scrolling, not just the visible rectangle.
      return rect.right >= Math.min(from.x, end.x) && rect.left <= Math.max(from.x, end.x) &&
        rect.bottom >= Math.min(from.y, end.y) && rect.top <= Math.max(from.y, end.y);
    }).map(row => Number(row.dataset.lineIndex));
    setSelected(indices);
  };
  const scroll = () => {
    const root = container.current, end = pointer.current;
    if (!root || !end || !anchor.current) return;
    const bounds = root.getBoundingClientRect();
    const speed = end.y < bounds.top + 35 ? -18 : end.y > bounds.bottom - 35 ? 18 : 0;
    if (speed) { root.scrollTop += speed; update(); }
    frame.current = requestAnimationFrame(scroll);
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.pointerType !== 'mouse' || (event.target as Element).closest('input,textarea,button,select,a,summary,label')) return;
    const root = event.currentTarget, bounds = root.getBoundingClientRect();
    event.preventDefault(); root.focus({ preventScroll: true }); root.setPointerCapture(event.pointerId);
    setSelected([]); setNotice(''); dragged.current = false;
    anchor.current = { x: event.clientX - bounds.left + root.scrollLeft, y: event.clientY - bounds.top + root.scrollTop };
    pointer.current = { x: event.clientX, y: event.clientY };
    frame.current = requestAnimationFrame(scroll);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!anchor.current) return;
    pointer.current = { x: event.clientX, y: event.clientY }; update();
  };
  const finish = () => { anchor.current = null; pointer.current = null; cancelAnimationFrame(frame.current); setBox(null); };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(selected.map(i => content.split('\n')[i]).join('\n'));
      setNotice('منتخب مصرعے نقل ہو گئے۔');
    } catch { setNotice('نقل نہیں ہو سکی؛ صرف تحریر منظر میں متن منتخب کر کے نقل کریں۔'); }
  };
  const remove = () => {
    onChange(content.split('\n').filter((_, i) => !selected.includes(i)).join('\n'));
    clear();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('input,textarea,select')) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      event.preventDefault(); setSelected(content.split('\n').map((_, i) => i));
    } else if (event.key === 'Escape') clear();
    else if (selected.length && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') { event.preventDefault(); void copy(); }
    else if (selected.length && event.key === 'Delete') { event.preventDefault(); remove(); }
  };
  return { container, selected, box, notice, copy, remove, clear, onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish, onKeyDown };
}
