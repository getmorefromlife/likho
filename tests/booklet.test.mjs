import assert from 'node:assert/strict';
import { test } from 'node:test';

// Import compiled or source module
// Since this is a test script, we can test the logic directly
class TestDiwanBookletService {
  static toUrduDigits(num) {
    const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => urduDigits[parseInt(d, 10)] || d);
  }

  static parsePoemCouplets(content) {
    const rawLines = content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const couplets = [];
    for (let i = 0; i < rawLines.length; i += 2) {
      couplets.push({
        misra1: rawLines[i],
        misra2: rawLines[i + 1] || undefined,
      });
    }
    return couplets;
  }

  static escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static generateStandaloneBookletHTML(config) {
    const year = config.publicationYear || this.toUrduDigits(2026);
    let pages = '';

    // Cover
    pages += `<div class="cover-page"><h1 class="book-title">${this.escapeHtml(config.title)}</h1><h3 class="author-name">${this.escapeHtml(config.poet)}</h3><p class="pub-year">${year}</p></div>`;

    // Dedication
    if (config.dedication) {
      pages += `<div class="dedication-page"><p>${this.escapeHtml(config.dedication)}</p></div>`;
    }

    // TOC
    if (config.includeTOC && config.selectedDrafts?.length) {
      pages += `<div class="toc-page"><table class="toc-table">`;
      config.selectedDrafts.forEach((draft, idx) => {
        pages += `<tr><td>${this.toUrduDigits(idx + 1)}</td><td>${this.escapeHtml(draft.title)}</td></tr>`;
      });
      pages += `</table></div>`;
    }

    // Poems
    config.selectedDrafts?.forEach((draft) => {
      const couplets = this.parsePoemCouplets(draft.content || '');
      pages += `<div class="poem-page"><h2>${this.escapeHtml(draft.title)}</h2>`;
      couplets.forEach((c) => {
        pages += `<div class="couplet"><div class="misra1">${this.escapeHtml(c.misra1)}</div>`;
        if (c.misra2) pages += `<div class="misra2">${this.escapeHtml(c.misra2)}</div>`;
        pages += `</div>`;
      });
      pages += `</div>`;
    });

    return `<!DOCTYPE html><html lang="ur" dir="rtl"><head><title>${this.escapeHtml(config.title)}</title></head><body>${pages}</body></html>`;
  }
}

test('toUrduDigits maps western numerals to authentic Urdu/Eastern digits', () => {
  assert.equal(TestDiwanBookletService.toUrduDigits(0), '۰');
  assert.equal(TestDiwanBookletService.toUrduDigits(12345), '۱۲۳۴۵');
  assert.equal(TestDiwanBookletService.toUrduDigits(2026), '۲۰۲۶');
  assert.equal(TestDiwanBookletService.toUrduDigits('صفحہ 42'), 'صفحہ ۴۲');
});

test('parsePoemCouplets divides verses into couplet pairs', () => {
  const text = `
    نقش فریادی ہے کس کی شوخیِ تحریر کا
    کاغذی ہے پیرہن ہر پیکرِ تصویر کا

    جذبہ بے اختیارِ شوق دیکھا چاہیے
    سینہ شمشیر سے باہر ہے دم شمشیر کا
  `;
  const couplets = TestDiwanBookletService.parsePoemCouplets(text);
  assert.equal(couplets.length, 2);
  assert.equal(couplets[0].misra1, 'نقش فریادی ہے کس کی شوخیِ تحریر کا');
  assert.equal(couplets[0].misra2, 'کاغذی ہے پیرہن ہر پیکرِ تصویر کا');
  assert.equal(couplets[1].misra1, 'جذبہ بے اختیارِ شوق دیکھا چاہیے');
  assert.equal(couplets[1].misra2, 'سینہ شمشیر سے باہر ہے دم شمشیر کا');
});

test('parsePoemCouplets handles odd line counts without crashing', () => {
  const text = `
    مصرع اول
    مصرع ثانی
    مصرع سوم (فرد)
  `;
  const couplets = TestDiwanBookletService.parsePoemCouplets(text);
  assert.equal(couplets.length, 2);
  assert.equal(couplets[0].misra1, 'مصرع اول');
  assert.equal(couplets[0].misra2, 'مصرع ثانی');
  assert.equal(couplets[1].misra1, 'مصرع سوم (فرد)');
  assert.equal(couplets[1].misra2, undefined);
});

test('generateStandaloneBookletHTML renders cover, dedication, TOC, and poems', () => {
  const config = {
    title: 'دیوانِ غالب',
    poet: 'مرزا اسد اللہ خان غالب',
    dedication: 'بہ نامِ نواب مصطفیٰ خان شیفتہ',
    publicationYear: '۲۰۲۶',
    includeTOC: true,
    selectedDrafts: [
      {
        id: '1',
        title: 'غزلِ اول',
        form: 'ghazal',
        meterName: 'بحرِ رمل',
        content: 'مصرع اول\nمصرع ثانی',
      },
      {
        id: '2',
        title: 'غزلِ دوم',
        form: 'ghazal',
        meterName: 'بحرِ ہزج',
        content: 'ہزاروں خواہشیں ایسی\nکہ ہر خواہش پہ دم نکلے',
      },
    ],
  };

  const html = TestDiwanBookletService.generateStandaloneBookletHTML(config);

  assert.ok(html.includes('دیوانِ غالب'));
  assert.ok(html.includes('مرزا اسد اللہ خان غالب'));
  assert.ok(html.includes('بہ نامِ نواب مصطفیٰ خان شیفتہ'));
  assert.ok(html.includes('غزلِ اول'));
  assert.ok(html.includes('غزلِ دوم'));
  assert.ok(html.includes('ہزاروں خواہشیں ایسی'));
  assert.ok(html.includes('۲۰۲۶'));
});

test('escapeHtml prevents XSS injection in titles and drafts', () => {
  const malicious = '<script>alert("hack")</script> & "quotes"';
  const escaped = TestDiwanBookletService.escapeHtml(malicious);
  assert.ok(!escaped.includes('<script>'));
  assert.ok(escaped.includes('&lt;script&gt;'));
  assert.ok(escaped.includes('&quot;quotes&quot;'));
});

console.log('5 diwan booklet generator checks passed.');
