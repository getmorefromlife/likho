/**
 * Likho Pro (قلم و قافیہ) - Diwan Booklet Export Service
 * Formats multi-poem collections into classical publication-ready A4/A5 books
 * with ornate title covers, table of contents, and print-optimized Nastaliq typography.
 * Supports direct standalone HTML and direct binary PDF file generation & download.
 */

import { PoemDraft } from '../types/editor';

export type DiwanFontSize = 'compact' | 'medium' | 'large' | 'royal';
export type DiwanSpacing = 'comfortable' | 'spacious' | 'luxurious';
export type DiwanPageSize = 'A4' | 'A5' | 'whatsapp_hd' | 'crown_octavo' | 'royal_octavo';

export interface DiwanBookletConfig {
  title: string;
  poet: string;
  subtitle?: string;
  dedication?: string;
  publicationYear?: string;
  pageSize: DiwanPageSize;
  fontFamily: string;
  fontSize: DiwanFontSize;
  spacing?: DiwanSpacing;
  includeGhazalNumber?: boolean;
  includeTOC: boolean;
  includeMeters: boolean;
  selectedDrafts: PoemDraft[];
}

export interface FormattedCouplet {
  misra1: string;
  misra2?: string;
}

export interface PdfProgress {
  current: number;
  total: number;
  message: string;
}

export class DiwanBookletService {
  /**
   * Converts standard numerals to authentic Urdu/Eastern Arabic digits.
   */
  static toUrduDigits(num: number | string): string {
    const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => urduDigits[parseInt(d, 10)] || d);
  }

  /**
   * Parses raw multiline poetry text into classical couplet pairs.
   * Treats empty lines as stanza/couplet dividers.
   */
  static parsePoemCouplets(content: string): FormattedCouplet[] {
    const rawLines = content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const couplets: FormattedCouplet[] = [];

    for (let i = 0; i < rawLines.length; i += 2) {
      couplets.push({
        misra1: rawLines[i],
        misra2: rawLines[i + 1] || undefined,
      });
    }

    return couplets;
  }

  /**
   * Pure binary assembly of multi-page PDF 1.4 specification without any third-party dependencies.
   */
  static assemblePdf(
    pages: Array<{ jpegBytes: Uint8Array; width: number; height: number }>,
    ptWidth = 595.28,
    ptHeight = 841.89
  ): Uint8Array {
    const enc = new TextEncoder();
    const chunks: Uint8Array[] = [];
    const offsets: number[] = [];
    let currentLength = 0;

    function pushString(str: string) {
      const bytes = enc.encode(str);
      chunks.push(bytes);
      currentLength += bytes.length;
    }

    function pushBytes(bytes: Uint8Array) {
      chunks.push(bytes);
      currentLength += bytes.length;
    }

    pushString('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    const totalPages = pages.length;
    // Obj 1: Catalog
    offsets.push(currentLength);
    pushString('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    // Obj 2: Pages tree
    const pageKids: string[] = [];
    for (let i = 0; i < totalPages; i++) {
      pageKids.push(`${3 + i * 3} 0 R`);
    }
    offsets.push(currentLength);
    pushString(`2 0 obj\n<< /Type /Pages /Kids [${pageKids.join(' ')}] /Count ${totalPages} >>\nendobj\n`);

    // For each page:
    // Obj 3 + i*3: Page
    // Obj 4 + i*3: Content stream
    // Obj 5 + i*3: Image XObject
    for (let i = 0; i < totalPages; i++) {
      const pageObjId = 3 + i * 3;
      const contentObjId = 4 + i * 3;
      const imgObjId = 5 + i * 3;
      const imgName = `Im${i + 1}`;
      const page = pages[i];

      // Page object
      offsets.push(currentLength);
      pushString(
        `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptWidth} ${ptHeight}] /Resources << /XObject << /${imgName} ${imgObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
      );

      // Content stream
      const content = `q\n${ptWidth} 0 0 ${ptHeight} 0 0 cm\n/${imgName} Do\nQ\n`;
      offsets.push(currentLength);
      pushString(`${contentObjId} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);

      // Image XObject
      offsets.push(currentLength);
      pushString(
        `${imgObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpegBytes.length} >>\nstream\n`
      );
      pushBytes(page.jpegBytes);
      pushString('\nendstream\nendobj\n');
    }

    const startXref = currentLength;
    const totalObjs = 2 + totalPages * 3;
    pushString(`xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`);
    for (const off of offsets) {
      pushString(String(off).padStart(10, '0') + ' 00000 n \n');
    }
    pushString(`trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`);

    // Concatenate all chunks into final binary buffer
    const totalSize = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalSize);
    let pos = 0;
    for (const c of chunks) {
      result.set(c, pos);
      pos += c.length;
    }
    return result;
  }

  /**
   * Helper to wrap Urdu text into lines that fit within a maximum width in canvas.
   */
  static wrapUrduText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth <= maxWidth || !currentLine) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  /**
   * Resolves physical and canvas dimensions, scale factors, and layout traits for all publication formats.
   */
  static getPageMetrics(pageSize: DiwanPageSize): {
    canvasWidth: number;
    canvasHeight: number;
    ptWidth: number;
    ptHeight: number;
    scale: number;
    isSmallFormat: boolean;
    isMobileHd: boolean;
  } {
    switch (pageSize) {
      case 'whatsapp_hd':
        // WhatsApp Mobile HD Portrait: Native 9:16 aspect ratio (1080 x 1920)
        return {
          canvasWidth: 1080,
          canvasHeight: 1920,
          ptWidth: 450,
          ptHeight: 800,
          scale: 0.96,
          isSmallFormat: false,
          isMobileHd: true,
        };
      case 'crown_octavo':
        // Traditional Pakistani/Indian Urdu Diwan standard (5.5" x 8.5")
        return {
          canvasWidth: 825,
          canvasHeight: 1275,
          ptWidth: 396,
          ptHeight: 612,
          scale: 0.74,
          isSmallFormat: true,
          isMobileHd: false,
        };
      case 'royal_octavo':
        // Grand Classical Anthology / Kulliyat format (6" x 9")
        return {
          canvasWidth: 900,
          canvasHeight: 1350,
          ptWidth: 432,
          ptHeight: 648,
          scale: 0.78,
          isSmallFormat: true,
          isMobileHd: false,
        };
      case 'A5':
        // Pocket A5 booklet
        return {
          canvasWidth: 874,
          canvasHeight: 1240,
          ptWidth: 419.53,
          ptHeight: 595.28,
          scale: 0.72,
          isSmallFormat: true,
          isMobileHd: false,
        };
      case 'A4':
      default:
        // Standard A4
        return {
          canvasWidth: 1240,
          canvasHeight: 1754,
          ptWidth: 595.28,
          ptHeight: 841.89,
          scale: 1.0,
          isSmallFormat: false,
          isMobileHd: false,
        };
    }
  }

  /**
   * Generates a high-resolution, pixel-perfect binary PDF Blob in exact A4 or A5 dimensions.
   */
  static async generateDirectPDFBlob(
    config: DiwanBookletConfig,
    onProgress?: (progress: PdfProgress) => void
  ): Promise<Blob> {
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        // Proceed if font readiness check fails
      }
    }

    const metrics = this.getPageMetrics(config.pageSize);
    const { canvasWidth, canvasHeight, ptWidth, ptHeight, scale, isSmallFormat, isMobileHd } = metrics;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context is not available');

    const year = config.publicationYear || this.toUrduDigits(new Date().getFullYear());
    const totalSelected = config.selectedDrafts.length;
    const estimatedTotalPages = 1 + (config.dedication ? 1 : 0) + (config.includeTOC ? 1 : 0) + Math.max(1, totalSelected);

    const renderedPages: Array<{ jpegBytes: Uint8Array; width: number; height: number }> = [];
    let currentPageNum = 1;

    // Helper: Export current canvas state as JPEG bytes
    const captureCurrentPage = (): Promise<Uint8Array> => {
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Canvas toBlob failed'));
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(new Uint8Array(reader.result as ArrayBuffer));
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
          },
          'image/jpeg',
          0.96
        );
      });
    };

    // Helper: Draw borders
    const drawPageBorders = (isCover = false) => {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const margin = isMobileHd
        ? (isCover ? 50 : 60)
        : isSmallFormat
        ? (isCover ? 35 : 40)
        : (isCover ? 50 : 55);
      const innerGap = isSmallFormat ? 8 : 12;

      // Outer gold border
      ctx.strokeStyle = '#8a5615';
      ctx.lineWidth = isSmallFormat ? 3 : 4;
      ctx.strokeRect(margin, margin, canvasWidth - margin * 2, canvasHeight - margin * 2);

      // Inner subtle border
      ctx.strokeStyle = '#b3823d';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(
        margin + innerGap,
        margin + innerGap,
        canvasWidth - (margin + innerGap) * 2,
        canvasHeight - (margin + innerGap) * 2
      );

      // Corner florets
      const dotDist = margin + innerGap;
      ctx.fillStyle = '#8a5615';
      const drawDot = (x: number, y: number) => {
        ctx.beginPath();
        ctx.arc(x, y, isSmallFormat ? 3.5 : 5, 0, Math.PI * 2);
        ctx.fill();
      };
      drawDot(dotDist, dotDist);
      drawDot(canvasWidth - dotDist, dotDist);
      drawDot(dotDist, canvasHeight - dotDist);
      drawDot(canvasWidth - dotDist, canvasHeight - dotDist);
      ctx.restore();
    };

    // Helper: Draw header and footer
    const drawHeaderFooter = (title: string, poet: string, pageNum: number) => {
      ctx.save();
      ctx.direction = 'rtl';
      const headerY = isMobileHd ? 120 : isSmallFormat ? 75 : 100;
      const footerY = canvasHeight - (isMobileHd ? 105 : isSmallFormat ? 65 : 90);
      const marginSide = isMobileHd ? 65 : isSmallFormat ? 55 : 80;

      // Header rule & labels
      ctx.fillStyle = '#8a5615';
      ctx.font = `${Math.round(18 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      ctx.textAlign = 'right';
      ctx.fillText(poet, canvasWidth - marginSide, headerY);
      ctx.textAlign = 'left';
      ctx.fillText(title, marginSide, headerY);

      ctx.strokeStyle = '#e8decb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(marginSide, headerY + 12);
      ctx.lineTo(canvasWidth - marginSide, headerY + 12);
      ctx.stroke();

      // Footer rule & Urdu page number
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8a5615';
      ctx.font = `bold ${Math.round(20 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      ctx.fillText(`— ${this.toUrduDigits(pageNum)} —`, canvasWidth / 2, footerY);

      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2 - 80, footerY - 24);
      ctx.lineTo(canvasWidth / 2 + 80, footerY - 24);
      ctx.stroke();
      ctx.restore();
    };

    // -------------------------------------------------------------------------
    // PAGE 1: ROYAL TITLE COVER
    // -------------------------------------------------------------------------
    onProgress?.({
      current: 1,
      total: estimatedTotalPages,
      message: 'سرورقِ شاہانہ تیار ہو رہا ہے...',
    });

    drawPageBorders(true);
    ctx.save();
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';

    const centerY = canvasHeight / 2;

    // Top fleuron & bismillah
    ctx.fillStyle = '#8a5615';
    ctx.font = `${Math.round(22 * scale)}px "Amiri", "Noto Nastaliq Urdu", serif`;
    ctx.fillText('❦  ❦  ❦', canvasWidth / 2, centerY - (isMobileHd ? 540 : isSmallFormat ? 380 : 520));
    ctx.font = `${Math.round(26 * scale)}px "Amiri", serif`;
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', canvasWidth / 2, centerY - (isMobileHd ? 470 : isSmallFormat ? 330 : 450));

    // Book title
    ctx.font = `bold ${Math.round(52 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
    ctx.fillText(config.title || 'دیوانِ کلام', canvasWidth / 2, centerY - (isMobileHd ? 180 : isSmallFormat ? 120 : 160));

    // Subtitle
    if (config.subtitle) {
      ctx.fillStyle = '#5a4225';
      ctx.font = `${Math.round(24 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      ctx.fillText(config.subtitle, canvasWidth / 2, centerY - (isMobileHd ? 80 : isSmallFormat ? 50 : 70));
    }

    // Divider line
    ctx.strokeStyle = '#8a5615';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2 - 120, centerY);
    ctx.lineTo(canvasWidth / 2 + 120, centerY);
    ctx.stroke();

    // Author block
    ctx.fillStyle = '#7a6652';
    ctx.font = `${Math.round(20 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
    ctx.fillText('کلام و نگارشِ', canvasWidth / 2, centerY + (isMobileHd ? 80 : isSmallFormat ? 50 : 70));

    ctx.fillStyle = '#1a1612';
    ctx.font = `bold ${Math.round(42 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
    ctx.fillText(config.poet || 'شاعر', canvasWidth / 2, centerY + (isMobileHd ? 180 : isSmallFormat ? 120 : 160));

    // Footer emblem & year
    ctx.fillStyle = '#8a5615';
    ctx.font = `${Math.round(36 * scale)}px sans-serif`;
    ctx.fillText('⚜️', canvasWidth / 2, centerY + (isMobileHd ? 460 : isSmallFormat ? 320 : 440));

    ctx.font = `bold ${Math.round(18 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
    ctx.fillText(`سنۂ اشاعت: ${year}ء`, canvasWidth / 2, centerY + (isMobileHd ? 520 : isSmallFormat ? 370 : 500));

    ctx.fillStyle = '#8a7a6a';
    ctx.font = `${Math.round(14 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
    ctx.fillText('مرتب کردہ: قلم و قافیہ — اسٹوڈیو برائے شعر و ادب', canvasWidth / 2, centerY + (isMobileHd ? 570 : isSmallFormat ? 410 : 545));
    ctx.restore();

    renderedPages.push({
      jpegBytes: await captureCurrentPage(),
      width: canvasWidth,
      height: canvasHeight,
    });
    currentPageNum++;

    // -------------------------------------------------------------------------
    // PAGE 2: OPTIONAL DEDICATION / PREFACE
    // -------------------------------------------------------------------------
    if (config.dedication && config.dedication.trim().length > 0) {
      onProgress?.({
        current: currentPageNum,
        total: estimatedTotalPages,
        message: 'صفحۂ انتساب تیار ہو رہا ہے...',
      });

      drawPageBorders(false);
      drawHeaderFooter(config.title, config.poet, currentPageNum);

      ctx.save();
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';

      // Section title
      ctx.fillStyle = '#8a5615';
      ctx.font = `bold ${Math.round(36 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      ctx.fillText('انتساب', canvasWidth / 2, centerY - (isMobileHd ? 280 : isSmallFormat ? 180 : 260));

      ctx.font = `${Math.round(20 * scale)}px "Amiri", serif`;
      ctx.fillText('❦', canvasWidth / 2, centerY - (isMobileHd ? 220 : isSmallFormat ? 130 : 190));

      // Dedication body lines
      ctx.fillStyle = '#332b24';
      ctx.font = `${Math.round(25 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      const dedLines = config.dedication.split('\n').filter((l) => l.trim().length > 0);
      const lineSpacing = isMobileHd ? 80 : isSmallFormat ? 55 : 75;
      let dY = centerY - ((dedLines.length - 1) * lineSpacing) / 2;

      for (const line of dedLines) {
        ctx.fillText(line.trim(), canvasWidth / 2, dY);
        dY += lineSpacing;
      }
      ctx.restore();

      renderedPages.push({
        jpegBytes: await captureCurrentPage(),
        width: canvasWidth,
        height: canvasHeight,
      });
      currentPageNum++;
    }

    // -------------------------------------------------------------------------
    // PAGE 3: TABLE OF CONTENTS
    // -------------------------------------------------------------------------
    if (config.includeTOC && config.selectedDrafts.length > 0) {
      onProgress?.({
        current: currentPageNum,
        total: estimatedTotalPages,
        message: 'فہرستِ کلام مرتب ہو رہی ہے...',
      });

      drawPageBorders(false);
      drawHeaderFooter(config.title, config.poet, currentPageNum);

      ctx.save();
      ctx.direction = 'rtl';

      // Section title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8a5615';
      ctx.font = `bold ${Math.round(34 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      ctx.fillText('فہرستِ کلام', canvasWidth / 2, isMobileHd ? 240 : isSmallFormat ? 170 : 230);
      ctx.font = `${Math.round(20 * scale)}px "Amiri", serif`;
      ctx.fillText('❦', canvasWidth / 2, isMobileHd ? 290 : isSmallFormat ? 210 : 280);

      // Rows
      let tocY = isMobileHd ? 380 : isSmallFormat ? 270 : 360;
      const rowStep = isMobileHd ? 82 : isSmallFormat ? 58 : 78;
      const rightX = canvasWidth - (isMobileHd ? 100 : isSmallFormat ? 85 : 120);
      const leftX = isMobileHd ? 100 : isSmallFormat ? 85 : 120;
      let poemPageTracker = currentPageNum + 1;

      for (let i = 0; i < config.selectedDrafts.length; i++) {
        const draft = config.selectedDrafts[i];
        const numStr = this.toUrduDigits(i + 1) + ' . ';
        const titleStr = draft.title || 'بے عنوان';
        const formUrdu = this.getFormUrdu(draft.form);
        const metaStr = ` (${formUrdu})`;
        const pageStr = this.toUrduDigits(poemPageTracker);
        poemPageTracker++;

        // Number and title
        ctx.textAlign = 'right';
        ctx.fillStyle = '#8a5615';
        ctx.font = `bold ${Math.round(20 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
        ctx.fillText(numStr, rightX, tocY);

        const numWidth = ctx.measureText(numStr).width;
        ctx.fillStyle = '#1a1612';
        ctx.fillText(titleStr, rightX - numWidth, tocY);

        const titleWidth = ctx.measureText(titleStr).width;
        ctx.fillStyle = '#7a6652';
        ctx.font = `${Math.round(15 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
        ctx.fillText(metaStr, rightX - numWidth - titleWidth, tocY);

        // Page number on left
        ctx.textAlign = 'left';
        ctx.fillStyle = '#8a5615';
        ctx.font = `bold ${Math.round(20 * scale)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
        ctx.fillText(pageStr, leftX, tocY);

        // Dotted leader line
        const metaWidth = ctx.measureText(metaStr).width;
        const dotsStart = rightX - numWidth - titleWidth - metaWidth - 15;
        const dotsEnd = leftX + ctx.measureText(pageStr).width + 15;

        ctx.strokeStyle = '#b3823d';
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.moveTo(dotsStart, tocY - 6);
        ctx.lineTo(dotsEnd, tocY - 6);
        ctx.stroke();
        ctx.setLineDash([]);

        tocY += rowStep;
        if (tocY > canvasHeight - (isMobileHd ? 180 : 160)) break; // Limit single TOC page
      }
      ctx.restore();

      renderedPages.push({
        jpegBytes: await captureCurrentPage(),
        width: canvasWidth,
        height: canvasHeight,
      });
      currentPageNum++;
    }

    const fontMultiplier =
      config.fontSize === 'compact'
        ? 0.82
        : config.fontSize === 'royal'
        ? 1.34
        : config.fontSize === 'large'
        ? 1.18
        : 1.0;

    const spacingMultiplier =
      config.spacing === 'comfortable'
        ? 1.0
        : config.spacing === 'luxurious'
        ? 1.48
        : 1.25; // spacious default (ample, royal breathing room)

    // -------------------------------------------------------------------------
    // PAGES 4+: POEM PAGES
    // -------------------------------------------------------------------------
    for (let pIdx = 0; pIdx < config.selectedDrafts.length; pIdx++) {
      const draft = config.selectedDrafts[pIdx];
      onProgress?.({
        current: currentPageNum,
        total: estimatedTotalPages,
        message: `کلام «${draft.title || 'بے عنوان'}» برآمد ہو رہا ہے (${pIdx + 1} از ${totalSelected})...`,
      });

      drawPageBorders(false);
      drawHeaderFooter(config.title, config.poet, currentPageNum);

      ctx.save();
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';

      const marginSide = isMobileHd ? 65 : isSmallFormat ? 55 : 80;
      let poemY = isMobileHd ? 220 : isSmallFormat ? 160 : 210;

      // 1. Form badge: with generous breathing clearance and serial numbering
      let formUrdu = this.getFormUrdu(draft.form);
      if (config.includeGhazalNumber !== false) {
        formUrdu = `${formUrdu} ${this.toUrduDigits(pIdx + 1)}`;
      }
      const badgeFontSize = Math.round(14 * scale * fontMultiplier);
      ctx.fillStyle = '#8a5615';
      ctx.font = `bold ${badgeFontSize}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      ctx.fillText(`[ ${formUrdu} ]`, canvasWidth / 2, poemY);

      // Ample, guaranteed breathing space between badge and title baseline:
      // Nastaliq title ascenders reach up to 2.2x font size (~85px for 38px font).
      // We provide 165px (A4) / 120px (A5) multiplied by spacingMultiplier,
      // guaranteeing ~75px of clean white space between badge and top of title ascenders.
      const badgeToTitleGap = Math.round((isMobileHd ? 175 : isSmallFormat ? 120 : 165) * fontMultiplier * spacingMultiplier);
      poemY += badgeToTitleGap;

      // 2. Poem Title (Bold Nastaliq)
      const titleFontSize = Math.round(38 * scale * fontMultiplier);
      ctx.fillStyle = '#8a5615';
      ctx.font = `bold ${titleFontSize}px "Noto Nastaliq Urdu", "Gulzar", serif`;
      ctx.fillText(draft.title || 'بے عنوان', canvasWidth / 2, poemY);

      // Ample breathing space: title baseline to meter metadata
      // Nastaliq title descenders extend down ~45px.
      // We provide 110px (A4) / 80px (A5) so descenders never clash with meter annotations.
      const titleToMetaGap = Math.round((isMobileHd ? 115 : isSmallFormat ? 80 : 110) * fontMultiplier * spacingMultiplier);
      poemY += titleToMetaGap;

      // 3. Meter & Radif annotations
      if (config.includeMeters && (draft.meterName || draft.radif)) {
        ctx.fillStyle = '#6a5845';
        ctx.font = `${Math.round(16 * scale * fontMultiplier)}px "Noto Nastaliq Urdu", "Gulzar", serif`;
        const metaParts: string[] = [];
        if (draft.meterName) metaParts.push(`بحر: ${draft.meterName}`);
        if (draft.radif) metaParts.push(`ردیف: ${draft.radif}`);
        ctx.fillText(metaParts.join('  •  '), canvasWidth / 2, poemY);
        poemY += Math.round((isMobileHd ? 75 : isSmallFormat ? 50 : 70) * spacingMultiplier);
      }

      // 4. Centered fleuron
      ctx.fillStyle = '#8a5615';
      ctx.font = `${Math.round(18 * scale * fontMultiplier)}px "Amiri", serif`;
      ctx.fillText('❦', canvasWidth / 2, poemY);
      poemY += Math.round((isMobileHd ? 110 : isSmallFormat ? 75 : 105) * spacingMultiplier);

      // 5. Verse Couplets or Prose Paragraphs rendering with multi-page safety
      if (draft.form === 'prose') {
        const proseFontSize = Math.round(22 * scale * fontMultiplier);
        ctx.font = `${proseFontSize}px "Noto Nastaliq Urdu", "Gulzar", serif`;
        ctx.textAlign = 'right';
        ctx.fillStyle = '#1a1612';
        const proseLineHeight = Math.round((isMobileHd ? 72 : isSmallFormat ? 52 : 68) * fontMultiplier * spacingMultiplier);
        const paragraphGap = Math.round(25 * spacingMultiplier);
        const printableWidth = canvasWidth - marginSide * 2;
        const paragraphs = (draft.content || '').split(/\n\s*\n/).filter((p) => p.trim());

        for (const p of paragraphs) {
          const lines = this.wrapUrduText(ctx, p.trim(), printableWidth);
          for (let lIdx = 0; lIdx < lines.length; lIdx++) {
            if (poemY + proseLineHeight > canvasHeight - (isMobileHd ? 130 : isSmallFormat ? 110 : 150)) {
              ctx.restore();
              renderedPages.push({
                jpegBytes: await captureCurrentPage(),
                width: canvasWidth,
                height: canvasHeight,
              });
              currentPageNum++;

              drawPageBorders(false);
              drawHeaderFooter(`${config.title} (بقیہ)`, config.poet, currentPageNum);

              ctx.save();
              ctx.direction = 'rtl';
              ctx.textAlign = 'right';
              ctx.fillStyle = '#1a1612';
              ctx.font = `${proseFontSize}px "Noto Nastaliq Urdu", "Gulzar", serif`;
              poemY = isMobileHd ? 220 : isSmallFormat ? 160 : 210;
            }

            ctx.fillText(lines[lIdx], canvasWidth - marginSide, poemY);
            poemY += proseLineHeight;
          }
          poemY += paragraphGap;
        }
      } else {
        const couplets = this.parsePoemCouplets(draft.content || '');
        const misraFontSize = Math.round(26 * scale * fontMultiplier);
        ctx.font = `${misraFontSize}px "Noto Nastaliq Urdu", "Gulzar", serif`;
        const misraLineHeight = Math.round((isMobileHd ? 96 : isSmallFormat ? 68 : 92) * fontMultiplier * spacingMultiplier);
        const coupletGap = Math.round((isMobileHd ? 45 : isSmallFormat ? 28 : 42) * spacingMultiplier);

        for (let cIdx = 0; cIdx < couplets.length; cIdx++) {
          // Multi-page check: if next couplet would collide with footer, start continuation page
          if (poemY + misraLineHeight * 2 > canvasHeight - (isMobileHd ? 140 : isSmallFormat ? 120 : 160)) {
            ctx.restore();
            renderedPages.push({
              jpegBytes: await captureCurrentPage(),
              width: canvasWidth,
              height: canvasHeight,
            });
            currentPageNum++;

            drawPageBorders(false);
            drawHeaderFooter(`${config.title} (بقیہ)`, config.poet, currentPageNum);

            ctx.save();
            ctx.direction = 'rtl';
            ctx.textAlign = 'center';
            ctx.font = `${misraFontSize}px "Noto Nastaliq Urdu", "Gulzar", serif`;
            poemY = isMobileHd ? 220 : isSmallFormat ? 160 : 210;
          }

          const c = couplets[cIdx];

          // Misra 1
          ctx.fillStyle = '#1a1612';
          ctx.fillText(c.misra1, canvasWidth / 2, poemY);
          poemY += misraLineHeight;

          // Misra 2
          if (c.misra2) {
            ctx.fillText(c.misra2, canvasWidth / 2, poemY);
            poemY += misraLineHeight;
          }

          // Couplet fleuron separator
          if (cIdx < couplets.length - 1) {
            ctx.fillStyle = '#b3823d';
            ctx.font = `${Math.round(13 * scale)}px serif`;
            ctx.fillText('✦', canvasWidth / 2, poemY - 12);
            poemY += coupletGap;
            ctx.font = `${misraFontSize}px "Noto Nastaliq Urdu", "Gulzar", serif`;
          }
        }
      }
      ctx.restore();

      renderedPages.push({
        jpegBytes: await captureCurrentPage(),
        width: canvasWidth,
        height: canvasHeight,
      });
      currentPageNum++;
    }

    onProgress?.({
      current: estimatedTotalPages,
      total: estimatedTotalPages,
      message: 'پی ڈی ایف فائل یکجا ہو رہی ہے...',
    });

    const pdfBytes = this.assemblePdf(renderedPages, ptWidth, ptHeight);
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  }

  /**
   * Generates and immediately downloads the direct PDF file into the user's Downloads directory.
   */
  static async downloadDirectPDF(
    config: DiwanBookletConfig,
    onProgress?: (progress: PdfProgress) => void
  ): Promise<void> {
    const blob = await this.generateDirectPDFBlob(config, onProgress);
    const url = URL.createObjectURL(blob);
    const filename = `${this.sanitizeFilename(config.title || 'diwan')}_booklet.pdf`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 300);
  }

  /**
   * Generates a fully standalone, self-contained HTML document for the Diwan booklet.
   */
  static generateStandaloneBookletHTML(config: DiwanBookletConfig): string {
    const year = config.publicationYear || this.toUrduDigits(new Date().getFullYear());
    const size = config.pageSize || 'A4';

    let pageSizeCSS = 'A4';
    let maxContainerWidth = '820px';
    let minPageHeight = '297mm';
    let pagePadding = '30mm 25mm';

    if (size === 'A5') {
      pageSizeCSS = 'A5';
      maxContainerWidth = '580px';
      minPageHeight = '210mm';
      pagePadding = '22mm 18mm';
    } else if (size === 'whatsapp_hd') {
      pageSizeCSS = '450pt 800pt';
      maxContainerWidth = '540px';
      minPageHeight = '960px';
      pagePadding = '38px 24px';
    } else if (size === 'crown_octavo') {
      pageSizeCSS = '5.5in 8.5in';
      maxContainerWidth = '560px';
      minPageHeight = '8.5in';
      pagePadding = '20mm 16mm';
    } else if (size === 'royal_octavo') {
      pageSizeCSS = '6in 9in';
      maxContainerWidth = '610px';
      minPageHeight = '9in';
      pagePadding = '22mm 18mm';
    }

    let pagesHTML = '';
    let currentPageNum = 1;

    // Cover Page
    pagesHTML += `
      <section class="book-page cover-page" style="page-break-after: always; break-after: page;">
        <div class="mughal-border">
          <div class="inner-border">
            <div class="cover-content">
              <div class="fleuron top-fleuron">❦ ❦ ❦</div>
              <p class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              
              <div class="title-frame">
                <h1 class="book-title">${this.escapeHtml(config.title || 'دیوانِ کلام')}</h1>
                ${config.subtitle ? `<h2 class="book-subtitle">${this.escapeHtml(config.subtitle)}</h2>` : ''}
              </div>

              <div class="author-block">
                <p class="author-prefix">کلام و نگارشِ</p>
                <h3 class="author-name">${this.escapeHtml(config.poet || 'شاعر')}</h3>
              </div>

              <div class="cover-footer">
                <div class="seal-mark">⚜️</div>
                <p class="pub-year">سنۂ اشاعت: ${year}ء</p>
                <p class="likho-attribution">مرتب کردہ: قلم و قافیہ (اسٹوڈیو برائے شعر و ادب)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    currentPageNum++;

    // Dedication
    if (config.dedication && config.dedication.trim().length > 0) {
      pagesHTML += `
        <section class="book-page dedication-page" style="page-break-after: always; break-after: page;">
          <div class="page-header">
            <span class="running-title">${this.escapeHtml(config.title)}</span>
          </div>
          <div class="dedication-container">
            <h2 class="section-title">انتساب</h2>
            <div class="fleuron">❦</div>
            <div class="dedication-body">
              ${config.dedication
                .split('\n')
                .map((p) => `<p>${this.escapeHtml(p.trim())}</p>`)
                .join('')}
            </div>
          </div>
          <div class="page-footer">
            <span class="page-num">— ${this.toUrduDigits(currentPageNum)} —</span>
          </div>
        </section>
      `;
      currentPageNum++;
    }

    // TOC
    if (config.includeTOC && config.selectedDrafts.length > 0) {
      let poemPageTracker = currentPageNum + 1;
      const tocRows = config.selectedDrafts
        .map((draft, idx) => {
          const rowPage = this.toUrduDigits(poemPageTracker);
          poemPageTracker++;
          const formUrdu = this.getFormUrdu(draft.form);
          const meterInfo = config.includeMeters && draft.meterName ? ` (${draft.meterName})` : '';

          return `
            <tr class="toc-row">
              <td class="toc-num">${this.toUrduDigits(idx + 1)}</td>
              <td class="toc-title">
                <strong>${this.escapeHtml(draft.title || 'بے عنوان')}</strong>
                <span class="toc-meta">${formUrdu}${meterInfo}</span>
              </td>
              <td class="toc-dots"><span class="dots-leader"></span></td>
              <td class="toc-page-num">${rowPage}</td>
            </tr>
          `;
        })
        .join('');

      pagesHTML += `
        <section class="book-page toc-page" style="page-break-after: always; break-after: page;">
          <div class="page-header">
            <span class="running-title">${this.escapeHtml(config.title)}</span>
          </div>
          <h2 class="section-title">فہرستِ کلام</h2>
          <div class="fleuron">❦</div>
          <table class="toc-table">
            <tbody>
              ${tocRows}
            </tbody>
          </table>
          <div class="page-footer">
            <span class="page-num">— ${this.toUrduDigits(currentPageNum)} —</span>
          </div>
        </section>
      `;
      currentPageNum++;
    }

    // Poems
    config.selectedDrafts.forEach((draft, pIdx) => {
      const couplets = this.parsePoemCouplets(draft.content || '');
      let formUrdu = this.getFormUrdu(draft.form);
      if (config.includeGhazalNumber !== false) {
        formUrdu = `${formUrdu} ${this.toUrduDigits(pIdx + 1)}`;
      }

      const coupletsHTML = couplets
        .map((c) => {
          return `
            <div class="couplet-block">
              <div class="misra misra-first">${this.escapeHtml(c.misra1)}</div>
              ${c.misra2 ? `<div class="misra misra-second">${this.escapeHtml(c.misra2)}</div>` : ''}
              <div class="couplet-divider">✦</div>
            </div>
          `;
        })
        .join('');

      let bodyHTML = '';
      if (draft.form === 'prose') {
        const paragraphs = (draft.content || '')
          .split(/\n\s*\n/)
          .filter((p) => p.trim())
          .map((p) => `<p class="prose-paragraph">${this.escapeHtml(p.trim())}</p>`)
          .join('');
        bodyHTML = `<div class="prose-content">${paragraphs || '<p class="empty-poem">خالی نثری تحریر</p>'}</div>`;
      } else {
        bodyHTML = coupletsHTML || '<p class="empty-poem">خالی مسودہ</p>';
      }

      pagesHTML += `
        <section class="book-page poem-page" style="page-break-after: always; break-after: page;">
          <div class="page-header">
            <span class="running-author">${this.escapeHtml(config.poet)}</span>
            <span class="running-title">${this.escapeHtml(config.title)}</span>
          </div>

          <div class="poem-header">
            <div class="poem-form-badge">[ ${formUrdu} ]</div>
            <h2 class="poem-title">${this.escapeHtml(draft.title || 'بے عنوان')}</h2>
            ${
              config.includeMeters && (draft.meterName || draft.radif)
                ? `<div class="poem-meter-meta">
                    ${draft.meterName ? `<span><strong>بحر:</strong> ${this.escapeHtml(draft.meterName)}</span>` : ''}
                    ${draft.radif ? `<span><strong>ردیف:</strong> ${this.escapeHtml(draft.radif)}</span>` : ''}
                   </div>`
                : ''
            }
            <div class="fleuron">❦</div>
          </div>

          <div class="poem-body">
            ${bodyHTML}
          </div>

          <div class="page-footer">
            <span class="page-num">— ${this.toUrduDigits(currentPageNum)} —</span>
          </div>
        </section>
      `;
      currentPageNum++;
    });

    return `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(config.title || 'دیوانِ کلام')} — ${this.escapeHtml(config.poet || 'قلم و قافیہ')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gulzar&family=Noto+Nastaliq+Urdu:wght@400..700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <style>
    @page {
      size: ${pageSizeCSS};
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      background: #faf7f2;
      color: #1a1612;
      font-family: 'Noto Nastaliq Urdu', 'Gulzar', 'Amiri', serif;
      direction: rtl;
      text-align: right;
    }

    .book-container {
      max-width: ${maxContainerWidth};
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .book-page {
      width: 100%;
      min-height: ${minPageHeight};
      padding: ${pagePadding};
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
    }

    .no-print-toolbar {
      position: sticky;
      top: 0;
      background: #8a5615;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      font-family: system-ui, -apple-system, sans-serif;
    }

    .no-print-toolbar button {
      background: #ffffff;
      color: #8a5615;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      transition: all 0.2s;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8decb;
      padding-bottom: 8px;
      margin-bottom: 24px;
      font-size: 11pt;
      color: #8a5615;
    }

    .page-footer {
      border-top: 1px solid #e8decb;
      padding-top: 10px;
      margin-top: 30px;
      text-align: center;
    }

    .page-num {
      font-size: 12pt;
      color: #8a5615;
      font-weight: bold;
    }

    .fleuron {
      text-align: center;
      color: #8a5615;
      font-size: 14pt;
      margin: 10px 0;
    }

    .section-title {
      font-size: 24pt;
      text-align: center;
      color: #8a5615;
      margin: 0;
      line-height: 2.2;
    }

    .cover-page {
      padding: 15mm;
      justify-content: center;
    }

    .mughal-border {
      border: 3px double #8a5615;
      height: 100%;
      padding: 8px;
      display: flex;
      flex-direction: column;
    }

    .inner-border {
      border: 1px solid #b3823d;
      height: 100%;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
    }

    .bismillah {
      font-size: 16pt;
      color: #8a5615;
      margin: 15px 0 30px 0;
      font-family: 'Amiri', serif;
    }

    .book-title {
      font-size: 34pt;
      color: #8a5615;
      margin: 0 0 10px 0;
      font-weight: 700;
      line-height: 2.2;
    }

    .book-subtitle {
      font-size: 16pt;
      color: #5a4225;
      margin: 0;
      font-weight: normal;
      line-height: 2.2;
    }

    .author-block {
      margin: 40px 0;
    }

    .author-prefix {
      font-size: 13pt;
      color: #7a6652;
      margin: 0 0 5px 0;
    }

    .author-name {
      font-size: 26pt;
      color: #1a1612;
      margin: 0;
      font-weight: bold;
      line-height: 2.2;
    }

    .cover-footer {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #e8decb;
    }

    .seal-mark {
      font-size: 24pt;
      margin-bottom: 5px;
    }

    .pub-year {
      font-size: 12pt;
      color: #8a5615;
      margin: 4px 0;
      font-weight: bold;
    }

    .likho-attribution {
      font-size: 9.5pt;
      color: #8a7a6a;
      margin: 4px 0 0 0;
    }

    .dedication-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
    }

    .dedication-body {
      font-size: 16pt;
      line-height: 2.6;
      color: #332b24;
      text-align: center;
      max-width: 500px;
      margin-top: 20px;
    }

    .toc-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .toc-row td {
      padding: 8px 4px;
      vertical-align: middle;
      font-size: 13pt;
      line-height: 2.2;
    }

    .toc-num {
      width: 35px;
      color: #8a5615;
      font-weight: bold;
    }

    .toc-title {
      white-space: nowrap;
    }

    .toc-meta {
      font-size: 10pt;
      color: #7a6652;
      margin-right: 8px;
    }

    .toc-dots {
      width: 100%;
      padding: 0 10px !important;
    }

    .dots-leader {
      display: block;
      border-bottom: 1px dotted #b3823d;
      margin-bottom: 6px;
    }

    .toc-page-num {
      width: 40px;
      text-align: left;
      font-weight: bold;
      color: #8a5615;
    }

    .poem-header {
      text-align: center;
      margin-bottom: ${config.spacing === 'luxurious' ? '48px' : config.spacing === 'comfortable' ? '30px' : '40px'};
      padding-top: 15px;
    }

    .poem-form-badge {
      display: inline-block;
      font-size: ${config.fontSize === 'compact' ? '9.5pt' : config.fontSize === 'royal' ? '13pt' : config.fontSize === 'large' ? '12pt' : '10.5pt'};
      background: #f4ecdf;
      border: 1px solid #d4c2a5;
      color: #8a5615;
      padding: 4px 22px;
      border-radius: 20px;
      font-weight: bold;
      margin-bottom: ${config.spacing === 'luxurious' ? '45px' : config.spacing === 'comfortable' ? '28px' : '38px'};
      letter-spacing: 0.5px;
    }

    .poem-title {
      font-size: ${config.fontSize === 'compact' ? '20pt' : config.fontSize === 'royal' ? '32pt' : config.fontSize === 'large' ? '28pt' : '24pt'};
      color: #8a5615;
      margin: 16px 0 24px 0;
      line-height: 2.4;
      padding-top: 6px;
    }

    .poem-meter-meta {
      font-size: ${config.fontSize === 'compact' ? '9.5pt' : config.fontSize === 'royal' ? '13pt' : config.fontSize === 'large' ? '12pt' : '10.5pt'};
      color: #6a5845;
      margin: 16px 0 22px 0;
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .poem-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 10px 0;
    }

    .couplet-block {
      width: 100%;
      max-width: 580px;
      text-align: center;
      margin-bottom: ${config.spacing === 'luxurious' ? '32px' : config.spacing === 'comfortable' ? '18px' : '25px'};
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .misra {
      font-size: ${config.fontSize === 'compact' ? '15pt' : config.fontSize === 'royal' ? '23pt' : config.fontSize === 'large' ? '20pt' : '17.5pt'};
      line-height: ${config.spacing === 'luxurious' ? '3.1' : config.spacing === 'comfortable' ? '2.6' : '2.85'};
      color: #1a1612;
      letter-spacing: 0.3px;
    }

    .misra-second {
      margin-top: -2px;
    }

    .couplet-divider {
      color: #b3823d;
      font-size: 9pt;
      margin-top: 6px;
      opacity: 0.7;
    }

    .prose-content {
      width: 100%;
      max-width: 660px;
      margin: 0 auto;
      text-align: right;
    }

    .prose-paragraph {
      font-size: ${config.fontSize === 'compact' ? '13pt' : config.fontSize === 'royal' ? '18pt' : config.fontSize === 'large' ? '16pt' : '14.5pt'};
      line-height: 2.6;
      color: #1a1612;
      margin-bottom: 22px;
      text-align: justify;
      text-justify: inter-word;
      text-indent: 26px;
    }

    @media print {
      body {
        background: #ffffff !important;
      }

      .no-print-toolbar {
        display: none !important;
      }

      .book-container {
        box-shadow: none !important;
        max-width: 100% !important;
        margin: 0 !important;
      }

      .book-page {
        page-break-after: always !important;
        break-after: page !important;
        min-height: 100vh !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-toolbar">
    <div>
      <strong>📖 ${this.escapeHtml(config.title || 'دیوانِ کلام')}</strong> — کتابچہ پیش منظر
    </div>
    <div>
      <button onclick="window.print()">🖨️ پرنٹر پر بھیجیں</button>
    </div>
  </div>

  <div class="book-container">
    ${pagesHTML}
  </div>
</body>
</html>`;
  }

  /**
   * Generates and triggers browser download of the standalone HTML book file.
   */
  static downloadStandaloneBooklet(config: DiwanBookletConfig): void {
    const html = this.generateStandaloneBookletHTML(config);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const filename = `${this.sanitizeFilename(config.title || 'diwan')}_booklet.html`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  private static getFormUrdu(form?: string): string {
    const map: Record<string, string> = {
      ghazal: 'غزل',
      nazm: 'نظم',
      rubai: 'رباعی',
      qataa: 'قطعہ',
      fard: 'فرد / متفرق شعر',
      prose: 'نثر',
    };
    return map[form || 'ghazal'] || 'کلام';
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private static sanitizeFilename(str: string): string {
    return str.replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_').slice(0, 40);
  }
}
