/**
 * Likho Pro (قلم و قافیہ) - Diwan Booklet Export Service
 * Formats multi-poem collections into classical publication-ready A4/A5 books
 * with ornate title covers, table of contents, and print-optimized Nastaliq typography.
 */

import { PoemDraft } from '../types/editor';

export interface DiwanBookletConfig {
  title: string;
  poet: string;
  subtitle?: string;
  dedication?: string;
  publicationYear?: string;
  pageSize: 'A4' | 'A5';
  fontFamily: string;
  includeTOC: boolean;
  includeMeters: boolean;
  selectedDrafts: PoemDraft[];
}

export interface FormattedCouplet {
  misra1: string;
  misra2?: string;
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
   * Generates a fully standalone, self-contained HTML document for the Diwan booklet
   * complete with embedded Google Fonts, golden Mughal borders, table of contents,
   * and CSS paged media rules for high-resolution vector PDF printing.
   */
  static generateStandaloneBookletHTML(config: DiwanBookletConfig): string {
    const year = config.publicationYear || this.toUrduDigits(new Date().getFullYear());
    const isA5 = config.pageSize === 'A5';

    let pagesHTML = '';
    let currentPageNum = 1;

    // -------------------------------------------------------------------------
    // PAGE 1: ROYAL TITLE COVER (سرورقِ شاہانہ)
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // PAGE 2: OPTIONAL DEDICATION / PREFACE (انتساب و دیباچہ)
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // PAGE 3: TABLE OF CONTENTS (فہرستِ کلام)
    // -------------------------------------------------------------------------
    if (config.includeTOC && config.selectedDrafts.length > 0) {
      let poemPageTracker = currentPageNum + 1; // Estimates page index
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

    // -------------------------------------------------------------------------
    // PAGES 4+: POEM PAGES (صفحاتِ کلام)
    // -------------------------------------------------------------------------
    config.selectedDrafts.forEach((draft) => {
      const couplets = this.parsePoemCouplets(draft.content || '');
      const formUrdu = this.getFormUrdu(draft.form);

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

      pagesHTML += `
        <section class="book-page poem-page" style="page-break-after: always; break-after: page;">
          <div class="page-header">
            <span class="running-author">${this.escapeHtml(config.poet)}</span>
            <span class="running-title">${this.escapeHtml(config.title)}</span>
          </div>

          <div class="poem-header">
            <div class="poem-form-badge">${formUrdu}</div>
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
            ${coupletsHTML || '<p class="empty-poem">خالی مسودہ</p>'}
          </div>

          <div class="page-footer">
            <span class="page-num">— ${this.toUrduDigits(currentPageNum)} —</span>
          </div>
        </section>
      `;
      currentPageNum++;
    });

    // -------------------------------------------------------------------------
    // COMPLETE DOCUMENT WRAPPER WITH CSS PAGED MEDIA
    // -------------------------------------------------------------------------
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
      size: ${isA5 ? 'A5' : 'A4'};
      margin: 15mm 18mm 20mm 18mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
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
      max-width: ${isA5 ? '580px' : '820px'};
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .book-page {
      width: 100%;
      min-height: ${isA5 ? '210mm' : '297mm'};
      padding: ${isA5 ? '25mm 20mm' : '30mm 25mm'};
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
    }

    /* Print Controls Banner (Only visible in browser preview) */
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

    .no-print-toolbar button:hover {
      background: #fdf5e6;
      transform: translateY(-1px);
    }

    /* Headers and Footers */
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

    /* Cover Page Styling */
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

    /* Dedication Page */
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

    /* Table of Contents */
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

    /* Poem Page Styling */
    .poem-header {
      text-align: center;
      margin-bottom: 25px;
    }

    .poem-form-badge {
      display: inline-block;
      font-size: 10pt;
      background: #f4ecdf;
      border: 1px solid #d4c2a5;
      color: #8a5615;
      padding: 2px 14px;
      border-radius: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .poem-title {
      font-size: 22pt;
      color: #8a5615;
      margin: 0;
      line-height: 2.2;
    }

    .poem-meter-meta {
      font-size: 10.5pt;
      color: #6a5845;
      margin-top: 6px;
      display: flex;
      justify-content: center;
      gap: 16px;
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
      margin-bottom: 18px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .misra {
      font-size: 17pt;
      line-height: 2.7;
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

    /* Print Engine Media Query */
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
      <button onclick="window.print()">🖨️ پرنٹ / PDF محفوظ کریں</button>
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
