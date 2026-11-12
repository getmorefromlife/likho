/**
 * Google Drive & Google Docs Integration Service for Likho
 *
 * Provides:
 * 1. Rich RTL Nastaliq Urdu formatting for individual poems and entire Diwans for Google Docs.
 * 2. 1-Click Clipboard copy for instant pasting into docs.google.com/document/create.
 * 3. MS Word / Google Docs compliant HTML document export (.doc / .html).
 * 4. Google Drive REST API v3 client-side sync & backup (using drive.file scope for absolute privacy).
 */

import { PoemDraft } from '../types/editor';
import { StorageService } from './storageService';

export interface GoogleDriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

export interface GoogleDriveSyncResult {
  success: boolean;
  backupFileId?: string;
  docFileId?: string;
  error?: string;
}

export class GoogleDriveService {
  /**
   * Escape HTML entities to protect against injection
   */
  static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Format an individual poem into a Google Docs compliant RTL HTML document
   */
  static formatPoemForGoogleDoc(draft: PoemDraft): { html: string; plain: string } {
    const title = draft.title?.trim() || 'لا عنوان کلام';
    const lines = draft.content.split('\n').map((l) => l.trim());
    const validLines = lines.filter((l) => l.length > 0);
    const dateFormatted = new Date(draft.updatedAt || draft.createdAt || Date.now()).toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Build plain text version
    const plainLines: string[] = [
      title,
      '='.repeat(title.length * 2),
      draft.meterName ? `بحر: ${draft.meterName}` : '',
      `تاریخ: ${dateFormatted}`,
      '',
    ];

    // Build rich HTML version
    let htmlContent = `
<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
<meta charset="utf-8">
<title>${this.escapeHtml(title)}</title>
<style>
  body {
    font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaliq', 'Urdu Typesetting', 'Arial', sans-serif;
    direction: rtl;
    text-align: center;
    background-color: #ffffff;
    color: #1a1a1a;
    padding: 40px;
    line-height: 2.6;
  }
  .poem-header {
    margin-bottom: 30px;
    border-bottom: 2px solid #d4af37;
    padding-bottom: 15px;
  }
  .poem-title {
    font-size: 26pt;
    font-weight: bold;
    color: #8c6d1f;
    margin: 0 0 10px 0;
  }
  .poem-meta {
    font-size: 11pt;
    color: #666666;
    margin: 0;
  }
  .couplet {
    margin-bottom: 24px;
    padding: 8px 0;
  }
  .misra {
    font-size: 18pt;
    margin: 4px 0;
  }
  .separator {
    color: #d4af37;
    font-size: 12pt;
    margin: 10px 0;
  }
  .footer {
    margin-top: 40px;
    font-size: 10pt;
    color: #888888;
    border-top: 1px solid #eeeeee;
    padding-top: 10px;
  }
</style>
</head>
<body>
<div class="poem-header">
  <h1 class="poem-title">${this.escapeHtml(title)}</h1>
  <p class="poem-meta">${draft.meterName ? `بحر: ${this.escapeHtml(draft.meterName)} | ` : ''}تاریخ: ${dateFormatted}</p>
</div>
<div class="poem-body">
`;

    // Process verses as couplets
    for (let i = 0; i < validLines.length; i += 2) {
      const firstMisra = validLines[i];
      const secondMisra = validLines[i + 1];

      plainLines.push(firstMisra);
      if (secondMisra) {
        plainLines.push(secondMisra);
        plainLines.push('❦');
      }
      plainLines.push('');

      htmlContent += `  <div class="couplet">\n`;
      htmlContent += `    <div class="misra">${this.escapeHtml(firstMisra)}</div>\n`;
      if (secondMisra) {
        htmlContent += `    <div class="misra">${this.escapeHtml(secondMisra)}</div>\n`;
        htmlContent += `    <div class="separator">❦</div>\n`;
      }
      htmlContent += `  </div>\n`;
    }

    htmlContent += `
</div>
<div class="footer">
  <p>مرتب کردہ بذریعہ قلم و قافیہ (Likho) — خودکار عروضی و شعری اسٹوڈیو</p>
</div>
</body>
</html>`;

    return {
      html: htmlContent.trim(),
      plain: plainLines.filter((l) => l !== undefined).join('\n'),
    };
  }

  /**
   * Format the entire Diwan / portfolio into a comprehensive Google Docs book
   */
  static formatDiwanForGoogleDoc(drafts: PoemDraft[], diwanTitle = 'دیوانِ قلم و قافیہ'): { html: string; plain: string } {
    const today = new Date().toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const plainLines: string[] = [
      diwanTitle,
      '='.repeat(diwanTitle.length * 2),
      `کل کلام: ${drafts.length}`,
      `تاریخِ برآمد: ${today}`,
      '',
      'فہرستِ کلام:',
      '------------',
    ];

    drafts.forEach((d, idx) => {
      plainLines.push(`${idx + 1}. ${d.title || 'لا عنوان'} (${d.content.split('\n').filter((l) => l.trim()).length} مصرعے)`);
    });
    plainLines.push('', '========================================', '');

    let htmlContent = `
<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
<meta charset="utf-8">
<title>${this.escapeHtml(diwanTitle)}</title>
<style>
  body {
    font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaliq', 'Urdu Typesetting', 'Arial', sans-serif;
    direction: rtl;
    text-align: center;
    background-color: #ffffff;
    color: #1a1a1a;
    padding: 50px 40px;
    line-height: 2.6;
  }
  .cover-page {
    margin-bottom: 80px;
    padding-bottom: 60px;
    border-bottom: 3px double #d4af37;
    page-break-after: always;
  }
  .main-title {
    font-size: 36pt;
    font-weight: bold;
    color: #8c6d1f;
    margin: 30px 0 15px 0;
  }
  .sub-title {
    font-size: 14pt;
    color: #555555;
    margin-bottom: 20px;
  }
  .toc {
    margin: 40px auto;
    max-width: 500px;
    text-align: right;
    border: 1px solid #e0e0e0;
    padding: 20px 30px;
    border-radius: 12px;
    background: #faf8f5;
    page-break-after: always;
  }
  .toc-title {
    font-size: 18pt;
    font-weight: bold;
    color: #8c6d1f;
    border-bottom: 1px solid #d4af37;
    padding-bottom: 8px;
    margin-bottom: 15px;
    text-align: center;
  }
  .toc-item {
    font-size: 13pt;
    margin: 6px 0;
    display: flex;
    justify-content: space-between;
  }
  .poem-entry {
    margin: 60px 0;
    page-break-after: always;
  }
  .poem-title {
    font-size: 24pt;
    font-weight: bold;
    color: #8c6d1f;
    margin-bottom: 5px;
  }
  .poem-meta {
    font-size: 11pt;
    color: #777777;
    margin-bottom: 25px;
  }
  .couplet {
    margin-bottom: 22px;
  }
  .misra {
    font-size: 18pt;
    margin: 4px 0;
  }
  .separator {
    color: #d4af37;
    font-size: 12pt;
    margin: 10px 0;
  }
</style>
</head>
<body>

<div class="cover-page">
  <div style="font-size: 24pt; color: #d4af37;">﷽</div>
  <h1 class="main-title">${this.escapeHtml(diwanTitle)}</h1>
  <p class="sub-title">شاعری کا خودکار مجموعہ — برآمد شدہ از قلم و قافیہ</p>
  <p style="font-size: 12pt; color: #888888;">تاریخِ اشاعت: ${today} | کل تخلیقات: ${drafts.length}</p>
</div>

<div class="toc">
  <div class="toc-title">فہرستِ کلام</div>
`;

    drafts.forEach((d, idx) => {
      const pTitle = d.title?.trim() || `کلام نمبر ${idx + 1}`;
      const lineCount = d.content.split('\n').filter((l) => l.trim()).length;
      htmlContent += `  <div class="toc-item"><span>${idx + 1}. ${this.escapeHtml(pTitle)}</span><span style="color:#888;">${Math.ceil(lineCount / 2)} اشعار</span></div>\n`;
    });

    htmlContent += `</div>\n\n<div class="diwan-body">\n`;

    drafts.forEach((draft, idx) => {
      const pTitle = draft.title?.trim() || `کلام نمبر ${idx + 1}`;
      const validLines = draft.content.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

      plainLines.push(`[${idx + 1}] ${pTitle}`);
      if (draft.meterName) plainLines.push(`بحر: ${draft.meterName}`);
      plainLines.push('-------------------------');

      htmlContent += `<div class="poem-entry">\n`;
      htmlContent += `  <h2 class="poem-title">${this.escapeHtml(pTitle)}</h2>\n`;
      if (draft.meterName) {
        htmlContent += `  <p class="poem-meta">بحر: ${this.escapeHtml(draft.meterName)}</p>\n`;
      }

      for (let i = 0; i < validLines.length; i += 2) {
        const first = validLines[i];
        const second = validLines[i + 1];
        plainLines.push(first);
        if (second) {
          plainLines.push(second);
          plainLines.push('❦');
        }
        plainLines.push('');

        htmlContent += `  <div class="couplet">\n`;
        htmlContent += `    <div class="misra">${this.escapeHtml(first)}</div>\n`;
        if (second) {
          htmlContent += `    <div class="misra">${this.escapeHtml(second)}</div>\n`;
          htmlContent += `    <div class="separator">❦</div>\n`;
        }
        htmlContent += `  </div>\n`;
      }

      htmlContent += `</div>\n\n`;
    });

    htmlContent += `</div>\n</body>\n</html>`;

    return {
      html: htmlContent.trim(),
      plain: plainLines.join('\n'),
    };
  }

  /**
   * Copy formatted Urdu poetry to clipboard as both rich HTML and plain text
   * so that when pasted into Google Docs (Ctrl+V), it retains full RTL Nastaliq formatting!
   */
  static async copyForGoogleDocs(htmlContent: string, plainContent: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const textBlob = new Blob([plainContent], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        });
        await navigator.clipboard.write([item]);
        return true;
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(plainContent);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Clipboard write failed, using fallback:', err);
      try {
        const textArea = document.createElement('textarea');
        textArea.value = plainContent;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Download as a .doc document that Google Drive natively opens as a Google Doc
   */
  static downloadAsGoogleDocFile(filename: string, htmlContent: string): void {
    // Wrap with Word/Google Docs namespace headers
    const docWrapper = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
</head>
${htmlContent}
</html>`;

    const blob = new Blob([docWrapper], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Direct 1-click helper: Copy formatted text and open docs.google.com/document/create
   */
  static async copyAndLaunchGoogleDocs(draft: PoemDraft): Promise<boolean> {
    const formatted = this.formatPoemForGoogleDoc(draft);
    const copied = await this.copyForGoogleDocs(formatted.html, formatted.plain);
    window.open('https://docs.google.com/document/create', '_blank', 'noopener,noreferrer');
    return copied;
  }

  /**
   * Direct 1-click helper: Copy entire Diwan and open docs.google.com/document/create
   */
  static async copyDiwanAndLaunchGoogleDocs(drafts: PoemDraft[], title?: string): Promise<boolean> {
    const formatted = this.formatDiwanForGoogleDoc(drafts, title);
    const copied = await this.copyForGoogleDocs(formatted.html, formatted.plain);
    window.open('https://docs.google.com/document/create', '_blank', 'noopener,noreferrer');
    return copied;
  }

  /**
   * Export JSON backup blob for Google Drive
   */
  static downloadDriveBackupJson(): void {
    const json = StorageService.exportBackup();
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `qalam_diwan_backup_${dateStr}.json`;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
