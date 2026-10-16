/**
 * Multi-format Export Engine for Urdu Literary Compositions
 */

export class ExportService {
  /**
   * Downloads clean UTF-8 text file with BOM for maximum OS compatibility
   */
  static exportPlainText(title: string, poet: string, content: string): void {
    const header = `قلم و قافیہ — کلام: ${title || 'بے عنوان'}\nشاعر: ${poet || 'نامعلوم'}\n${'='.repeat(40)}\n\n`;
    const fullText = header + content;
    const blob = new Blob(['\uFEFF' + fullText], { type: 'text/plain;charset=utf-8' });
    this.triggerDownload(blob, `${this.sanitizeFilename(title || 'kalam')}.txt`);
  }

  /**
   * Generates a Microsoft Word compatible RTF file with RTL paragraph direction and Nastaliq font tags
   */
  static exportRTF(title: string, poet: string, content: string): void {
    // RTF Header with Arabic/Urdu codepage 1256 and font definition
    let rtf = '{\\rtf1\\ansi\\ansicpg1256\\deff0\\deflang1065\n';
    rtf += '{\\fonttbl{\\f0\\fnil\\fcharset178 Noto Nastaliq Urdu;}{\\f1\\fnil\\fcharset178 Jameel Noori Nastaliq;}}\n';
    rtf += '{\\colortbl ;\\red44\\green36\\blue30;\\red180\\green130\\blue50;}\n';
    rtf += '\\viewkind4\\uc1\\pard\\rtlpar\\qc\\f0\\fs48\\b\\cf2 ';

    // Title
    rtf += this.encodeRTFUnicode(title || 'کلام') + '\\b0\\par\\fs28\\cf1 ';
    rtf += this.encodeRTFUnicode(`شاعر: ${poet || 'نامعلوم'}`) + '\\par\\par\\fs36 ';

    // Couplets
    const lines = content.split('\n');
    for (const line of lines) {
      if (!line.trim()) {
        rtf += '\\par\\par ';
      } else {
        rtf += this.encodeRTFUnicode(line.trim()) + '\\par ';
      }
    }

    rtf += '}';

    const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
    this.triggerDownload(blob, `${this.sanitizeFilename(title || 'kalam')}.rtf`);
  }

  /**
   * Copies formatted HTML with inline RTL styles directly to clipboard for Google Docs paste
   */
  static async copyForGoogleDocs(title: string, poet: string, content: string): Promise<boolean> {
    const lines = content.split('\n');
    let htmlContent = `
      <div dir="rtl" style="direction: rtl; text-align: center; font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaliq', 'Gulzar', serif; line-height: 2.8; color: #1e1b18; padding: 20px;">
        <h1 style="font-size: 28pt; margin-bottom: 8px; font-weight: 700; color: #8b5a2b;">${this.escapeHtml(title || 'کلام')}</h1>
        <p style="font-size: 16pt; color: #665c54; margin-bottom: 24px;">شاعر: ${this.escapeHtml(poet || 'نامعلوم')}</p>
        <div style="margin: 0 auto; max-width: 650px;">
    `;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        htmlContent += `<div style="height: 18px;"></div>`;
      } else {
        htmlContent += `<p style="font-size: 20pt; margin: 4px 0; letter-spacing: 0.5px;">${this.escapeHtml(line)}</p>`;
      }
    }

    htmlContent += `
        </div>
        <p style="margin-top: 32px; font-size: 11pt; color: #a89984;">مرتب شدہ بذریعہ قلم و قافیہ (Qalam & Qafiya)</p>
      </div>
    `;

    const plainText = `${title}\n${poet}\n\n${content}`;

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
        });
        await navigator.clipboard.write([item]);
        return true;
      } else {
        await navigator.clipboard.writeText(plainText);
        return true;
      }
    } catch (e) {
      console.error('Failed to copy to clipboard:', e);
      return false;
    }
  }

  /**
   * Generates a high-resolution PNG Calligraphy Card on Canvas
   */
  static async generateCalligraphyCard(
    title: string,
    poet: string,
    content: string,
    theme: 'parchment' | 'obsidian' | 'emerald' = 'parchment'
  ): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    const width = 1080;
    const height = 1350; // 4:5 Instagram / Social ratio
    canvas.width = width;
    canvas.height = height;

    // Theme color palettes
    let bgGradient: [string, string];
    let textColor: string;
    let accentColor: string;
    let borderColor: string;

    if (theme === 'obsidian') {
      bgGradient = ['#0c0e12', '#181b22'];
      textColor = '#f5f0e6';
      accentColor = '#dfb15b';
      borderColor = '#4a3b20';
    } else if (theme === 'emerald') {
      bgGradient = ['#09231b', '#0f3a2d'];
      textColor = '#f0fdf4';
      accentColor = '#facc15';
      borderColor = '#065f46';
    } else {
      // Parchment
      bgGradient = ['#fdfaf3', '#f3ede0'];
      textColor = '#2b2118';
      accentColor = '#9a6324';
      borderColor = '#d4af37';
    }

    // Fill background
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, bgGradient[0]);
    grad.addColorStop(1, bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Draw Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(55, 55);
    drawCorner(width - 55, 55);
    drawCorner(55, height - 55);
    drawCorner(width - 55, height - 55);
    ctx.restore();

    // Calligraphy Header: Brand watermark top
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';

    ctx.fillStyle = accentColor;
    ctx.font = '24px "Noto Nastaliq Urdu", "Gulzar", serif';
    ctx.fillText('قلم و قافیہ', width / 2, 110);

    // Title
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 44px "Noto Nastaliq Urdu", "Gulzar", serif';
    ctx.fillText(title || 'کلام', width / 2, 185);

    // Subtle divider
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 220);
    ctx.lineTo(width / 2 + 120, 220);
    ctx.stroke();

    // Content: Filter to non-empty lines
    const lines = content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Max 10 lines for card rendering
    const displayLines = lines.slice(0, 10);
    const lineHeight = 75;
    const totalContentHeight = displayLines.length * lineHeight;
    let startY = 270 + Math.max(0, (height - 480 - totalContentHeight) / 2);

    ctx.fillStyle = textColor;
    ctx.font = '36px "Noto Nastaliq Urdu", "Gulzar", serif';

    for (let i = 0; i < displayLines.length; i++) {
      ctx.fillText(displayLines[i], width / 2, startY);
      // Extra gap after every couplet (even index misra 2)
      startY += lineHeight + (i % 2 === 1 ? 25 : 0);
    }

    // Poet attribution bottom
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 30px "Noto Nastaliq Urdu", "Gulzar", serif';
    ctx.fillText(`شاعر: ${poet || 'نامعلوم'}`, width / 2, height - 120);

    return canvas.toDataURL('image/png');
  }

  private static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static sanitizeFilename(str: string): string {
    return str.replace(/[\\/:*?"<>|]/g, '').trim() || 'kalam';
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private static encodeRTFUnicode(str: string): string {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 128) {
        result += str.charAt(i);
      } else {
        // RTF unicode character format \uN?
        const signedCode = code > 32767 ? code - 65536 : code;
        result += `\\u${signedCode}?`;
      }
    }
    return result;
  }
}
