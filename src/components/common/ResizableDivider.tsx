import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ResizableDividerProps {
  orientation: 'vertical' | 'horizontal';
  isLocked: boolean;
  onResize: (newPercentage: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const ResizableDivider: React.FC<ResizableDividerProps> = ({
  orientation,
  isLocked,
  onResize,
  containerRef,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isLocked) return;
      e.preventDefault();
      setIsDragging(true);
      dragStartPos.current = orientation === 'vertical' ? e.clientX : e.clientY;
    },
    [isLocked, orientation]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isLocked) return;
      setIsDragging(true);
      const touch = e.touches[0];
      dragStartPos.current = orientation === 'vertical' ? touch.clientX : touch.clientY;
    },
    [isLocked, orientation]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (orientation === 'vertical') {
        // Because of RTL layout, right column starts at rect.right
        const offsetFromRight = rect.right - e.clientX;
        const percentage = (offsetFromRight / rect.width) * 100;
        onResize(Math.round(percentage));
      } else {
        const offsetFromTop = e.clientY - rect.top;
        const percentage = (offsetFromTop / rect.height) * 100;
        onResize(Math.round(percentage));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();

      if (orientation === 'vertical') {
        const offsetFromRight = rect.right - touch.clientX;
        const percentage = (offsetFromRight / rect.width) * 100;
        onResize(Math.round(percentage));
      } else {
        const offsetFromTop = touch.clientY - rect.top;
        const percentage = (offsetFromTop / rect.height) * 100;
        onResize(Math.round(percentage));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, orientation, containerRef, onResize]);

  if (orientation === 'vertical') {
    return (
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="separator"
        aria-orientation="vertical"
        aria-disabled={isLocked}
        title={isLocked ? 'طرزِ ترتیب مقفل ہے (Locked)' : 'کھینچ کر چوڑائی تبدیل کریں (Drag to resize)'}
        className={`relative z-20 group flex-shrink-0 transition-colors ${
          isLocked
            ? 'w-1 cursor-default bg-[var(--border-subtle)]'
            : 'w-2 cursor-col-resize hover:bg-[var(--accent-gold)] active:bg-[var(--accent-gold)]'
        } ${isDragging ? 'bg-[var(--accent-gold)] shadow-md' : 'bg-[var(--border-subtle)]'} ${className}`}
      >
        {!isLocked && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-card)] border border-[var(--accent-gold)] shadow-sm">
            <div className="w-0.5 h-4 bg-[var(--accent-gold)] rounded-full"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="separator"
      aria-orientation="horizontal"
      aria-disabled={isLocked}
      title={isLocked ? 'طرزِ ترتیب مقفل ہے (Locked)' : 'کھینچ کر اونچائی تبدیل کریں (Drag to resize)'}
      className={`relative z-20 group flex-shrink-0 transition-colors ${
        isLocked
          ? 'h-1 cursor-default bg-[var(--border-subtle)]'
          : 'h-2 cursor-row-resize hover:bg-[var(--accent-gold)] active:bg-[var(--accent-gold)]'
      } ${isDragging ? 'bg-[var(--accent-gold)] shadow-md' : 'bg-[var(--border-subtle)]'} ${className}`}
    >
      {!isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-card)] border border-[var(--accent-gold)] shadow-sm">
          <div className="h-0.5 w-4 bg-[var(--accent-gold)] rounded-full"></div>
        </div>
      )}
    </div>
  );
};
