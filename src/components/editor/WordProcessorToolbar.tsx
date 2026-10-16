import React from 'react';
import {
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Minus,
  Sparkles,
} from 'lucide-react';

export type TextAlignment = 'right' | 'center' | 'left' | 'justify';

export interface WordProcessorToolbarProps {
  textAlign: TextAlignment;
  onTextAlignChange: (align: TextAlignment) => void;
  onFormatAction: (type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'h1' | 'h2' | 'quote' | 'bullet' | 'number' | 'divider') => void;
  isProseMode?: boolean;
  // Optional feature flags for ultra-clean modularity: any group can be toggled on/off
  features?: {
    showAlignment?: boolean;
    showFormatting?: boolean;
    showStructure?: boolean;
  };
}

export const WordProcessorToolbar: React.FC<WordProcessorToolbarProps> = ({
  textAlign,
  onTextAlignChange,
  onFormatAction,
  isProseMode = false,
  features = {
    showAlignment: true,
    showFormatting: true,
    showStructure: true,
  },
}) => {
  return (
    <div
      dir="rtl"
      className="flex flex-wrap items-center gap-1 sm:gap-1.5 py-1 select-none"
    >
      {/* 1. Alignment Group (Right, Center, Left, Justify) */}
      {features.showAlignment && (
        <div className="flex items-center gap-0.5 bg-[var(--bg-card)]/80 p-0.5 rounded-lg border border-[var(--border-subtle)]/70 shadow-2xs">
          <button
            type="button"
            onClick={() => onTextAlignChange('right')}
            className={`p-1.5 rounded transition-all ${
              textAlign === 'right'
                ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="دائیں صف بندی (Align Right - معیاری اردو)"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onTextAlignChange('center')}
            className={`p-1.5 rounded transition-all ${
              textAlign === 'center'
                ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="درمیانی صف بندی (Couplet / Center Align)"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onTextAlignChange('left')}
            className={`p-1.5 rounded transition-all ${
              textAlign === 'left'
                ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="بائیں صف بندی (Align Left - حوالہ جات/انگریزی)"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onTextAlignChange('justify')}
            className={`p-1.5 rounded transition-all ${
              textAlign === 'justify'
                ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="دونوں طرف ہموار (Justify - کتابی و نثری صف بندی)"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Group Separator */}
      <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5" />

      {/* 2. Text Styles (Bold, Italic, Underline, Strikethrough) */}
      {features.showFormatting && (
        <div className="flex items-center gap-0.5 bg-[var(--bg-card)]/80 p-0.5 rounded-lg border border-[var(--border-subtle)]/70 shadow-2xs">
          <button
            type="button"
            onClick={() => onFormatAction('bold')}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="جلی (Bold / Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onFormatAction('italic')}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="ترچھا (Italic / Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onFormatAction('underline')}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="خط کشیدہ (Underline / Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onFormatAction('strikethrough')}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="خطِ تنسیخ (Strikethrough)"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Document Structure (Headings, Quote, Lists, Divider) */}
      {features.showStructure && (
        <>
          <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5" />

          <div className="flex items-center gap-0.5 bg-[var(--bg-card)]/80 p-0.5 rounded-lg border border-[var(--border-subtle)]/70 shadow-2xs">
            <button
              type="button"
              onClick={() => onFormatAction('h1')}
              className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="بڑی سرخی (Heading 1)"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onFormatAction('h2')}
              className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="ذیلی سرخی (Heading 2)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onFormatAction('quote')}
              className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="اقتباس / حوالہ (Blockquote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onFormatAction('bullet')}
              className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="نقاطی فہرست (Bullet List)"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onFormatAction('number')}
              className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="عددی فہرست (Numbered List)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onFormatAction('divider')}
              className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="خطِ فاصل (Divider Line)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {/* Mode Tag if Prose */}
      {isProseMode && (
        <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 text-[11px] font-nastaliq font-medium mr-1">
          <Sparkles className="w-3 h-3" />
          <span>نثری مقالہ نگاری</span>
        </span>
      )}
    </div>
  );
};
