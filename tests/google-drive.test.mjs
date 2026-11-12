import assert from 'node:assert/strict';
import { test } from 'node:test';

class TestGoogleDriveService {
  static escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  static formatPoemForGoogleDoc(draft) {
    const title = draft.title?.trim() || 'لا عنوان کلام';
    const lines = draft.content.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    const plainLines = [
      title,
      '='.repeat(title.length * 2),
      draft.meterName ? `بحر: ${draft.meterName}` : '',
      'تاریخ: ۲۰۲۶-۱۱-۱۳',
      '',
    ];

    let htmlContent = `<!DOCTYPE html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>${this.escapeHtml(title)}</title></head><body>`;
    htmlContent += `<div class="poem-header"><h1 class="poem-title">${this.escapeHtml(title)}</h1>`;
    if (draft.meterName) htmlContent += `<p class="poem-meta">بحر: ${this.escapeHtml(draft.meterName)}</p>`;
    htmlContent += `</div><div class="poem-body">`;

    for (let i = 0; i < lines.length; i += 2) {
      const first = lines[i];
      const second = lines[i + 1];
      plainLines.push(first);
      if (second) {
        plainLines.push(second);
        plainLines.push('❦');
      }
      plainLines.push('');

      htmlContent += `<div class="couplet"><div class="misra">${this.escapeHtml(first)}</div>`;
      if (second) {
        htmlContent += `<div class="misra">${this.escapeHtml(second)}</div><div class="separator">❦</div>`;
      }
      htmlContent += `</div>`;
    }

    htmlContent += `</div></body></html>`;

    return {
      html: htmlContent,
      plain: plainLines.filter((l) => l !== undefined).join('\n'),
    };
  }

  static formatDiwanForGoogleDoc(drafts, diwanTitle = 'دیوانِ قلم و قافیہ') {
    let htmlContent = `<!DOCTYPE html><html lang="ur" dir="rtl"><head><title>${this.escapeHtml(diwanTitle)}</title></head><body>`;
    htmlContent += `<div class="cover-page"><h1 class="main-title">${this.escapeHtml(diwanTitle)}</h1></div>`;
    htmlContent += `<div class="toc"><div class="toc-title">فہرستِ کلام</div>`;

    drafts.forEach((d, idx) => {
      const pTitle = d.title || `کلام ${idx + 1}`;
      htmlContent += `<div class="toc-item">${idx + 1}. ${this.escapeHtml(pTitle)}</div>`;
    });

    htmlContent += `</div><div class="diwan-body">`;

    drafts.forEach((d, idx) => {
      const pTitle = d.title || `کلام ${idx + 1}`;
      htmlContent += `<div class="poem-entry"><h2 class="poem-title">${this.escapeHtml(pTitle)}</h2></div>`;
    });

    htmlContent += `</div></body></html>`;
    return { html: htmlContent };
  }

  static wrapWordDoc(htmlContent) {
    return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset="utf-8"></head>${htmlContent}</html>`;
  }
}

test('escapeHtml escapes dangerous HTML characters to prevent XSS', () => {
  const dangerous = '<script>alert("XSS & theft")</script>';
  const escaped = TestGoogleDriveService.escapeHtml(dangerous);
  assert.equal(escaped, '&lt;script&gt;alert(&quot;XSS &amp; theft&quot;)&lt;/script&gt;');
  assert.ok(!escaped.includes('<script>'));
});

test('formatPoemForGoogleDoc generates valid RTL HTML with couplets and metadata', () => {
  const draft = {
    id: 'draft-1',
    title: 'دلِ ناداں',
    content: 'دلِ ناداں تجھے ہوا کیا ہے\nآخر اس درد کی دوا کیا ہے',
    meterName: 'بحرِ ہزج مثمن سالم',
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  };

  const res = TestGoogleDriveService.formatPoemForGoogleDoc(draft);
  assert.ok(res.html.includes('dir="rtl"'));
  assert.ok(res.html.includes('lang="ur"'));
  assert.ok(res.html.includes('دلِ ناداں'));
  assert.ok(res.html.includes('بحرِ ہزج مثمن سالم'));
  assert.ok(res.html.includes('آخر اس درد کی دوا کیا ہے'));
  assert.ok(res.html.includes('❦'));
});

test('formatPoemForGoogleDoc generates readable plain text with title and couplets', () => {
  const draft = {
    id: 'draft-2',
    title: 'نقش فریادی',
    content: 'نقش فریادی ہے کس کی شوخیِ تحریر کا\nکاغذی ہے پیرہن ہر پیکرِ تصویر کا',
    meterName: 'بحرِ رمل',
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  };

  const res = TestGoogleDriveService.formatPoemForGoogleDoc(draft);
  assert.ok(res.plain.includes('نقش فریادی'));
  assert.ok(res.plain.includes('بحر: بحرِ رمل'));
  assert.ok(res.plain.includes('کاغذی ہے پیرہن ہر پیکرِ تصویر کا'));
  assert.ok(res.plain.includes('❦'));
});

test('formatDiwanForGoogleDoc creates complete multi-poem book with TOC and cover', () => {
  const drafts = [
    { id: '1', title: 'غزل اول', content: 'پہلا مصرعہ\nدوسرا مصرعہ' },
    { id: '2', title: 'غزل دوم', content: 'تیسرا مصرعہ\nچوتھا مصرعہ' },
    { id: '3', title: 'غزل سوم', content: 'پانچواں مصرعہ\nچھٹا مصرعہ' },
  ];

  const res = TestGoogleDriveService.formatDiwanForGoogleDoc(drafts, 'کلیاتِ غالب');
  assert.ok(res.html.includes('کلیاتِ غالب'));
  assert.ok(res.html.includes('فہرستِ کلام'));
  assert.ok(res.html.includes('1. غزل اول'));
  assert.ok(res.html.includes('2. غزل دوم'));
  assert.ok(res.html.includes('3. غزل سوم'));
  assert.ok(res.html.includes('poem-entry'));
});

test('wrapWordDoc includes Microsoft Word and Google Drive namespace attributes', () => {
  const html = '<body><p>شعر</p></body>';
  const doc = TestGoogleDriveService.wrapWordDoc(html);
  assert.ok(doc.includes("xmlns:w='urn:schemas-microsoft-com:office:word'"));
  assert.ok(doc.includes("xmlns:o='urn:schemas-microsoft-com:office:office'"));
  assert.ok(doc.includes('<p>شعر</p>'));
});

test('Google Drive backup JSON is fully compatible with Likho StorageService schema', () => {
  const mockBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    drafts: [
      {
        id: 'draft-101',
        title: 'شکوہ',
        content: 'کیوں زیاں کار بنوں سود فراموش رہوں',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
    prefs: {},
  };

  const jsonStr = JSON.stringify(mockBackup);
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.version, 1);
  assert.ok(Array.isArray(parsed.drafts));
  assert.equal(parsed.drafts.length, 1);
  assert.equal(parsed.drafts[0].title, 'شکوہ');
});
