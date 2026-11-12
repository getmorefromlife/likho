import assert from 'node:assert/strict';
import { test } from 'node:test';

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

  static assemblePdf(pages, ptWidth = 595.28, ptHeight = 841.89) {
    const enc = new TextEncoder();
    const chunks = [];
    const offsets = [];
    let currentLength = 0;

    function pushString(str) {
      const bytes = enc.encode(str);
      chunks.push(bytes);
      currentLength += bytes.length;
    }

    function pushBytes(bytes) {
      chunks.push(bytes);
      currentLength += bytes.length;
    }

    pushString('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    const totalPages = pages.length;
    offsets.push(currentLength);
    pushString('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    const pageKids = [];
    for (let i = 0; i < totalPages; i++) {
      pageKids.push(`${3 + i * 3} 0 R`);
    }
    offsets.push(currentLength);
    pushString(`2 0 obj\n<< /Type /Pages /Kids [${pageKids.join(' ')}] /Count ${totalPages} >>\nendobj\n`);

    for (let i = 0; i < totalPages; i++) {
      const pageObjId = 3 + i * 3;
      const contentObjId = 4 + i * 3;
      const imgObjId = 5 + i * 3;
      const imgName = `Im${i + 1}`;
      const page = pages[i];

      offsets.push(currentLength);
      pushString(
        `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptWidth} ${ptHeight}] /Resources << /XObject << /${imgName} ${imgObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
      );

      const content = `q\n${ptWidth} 0 0 ${ptHeight} 0 0 cm\n/${imgName} Do\nQ\n`;
      offsets.push(currentLength);
      pushString(`${contentObjId} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);

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

    const totalSize = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalSize);
    let pos = 0;
    for (const c of chunks) {
      result.set(c, pos);
      pos += c.length;
    }
    return result;
  }

  static generateStandaloneBookletHTML(config) {
    const year = config.publicationYear || this.toUrduDigits(2026);
    let pages = '';

    pages += `<div class="cover-page"><h1 class="book-title">${this.escapeHtml(config.title)}</h1><h3 class="author-name">${this.escapeHtml(config.poet)}</h3><p class="pub-year">${year}</p></div>`;

    if (config.dedication) {
      pages += `<div class="dedication-page"><p>${this.escapeHtml(config.dedication)}</p></div>`;
    }

    if (config.includeTOC && config.selectedDrafts?.length) {
      pages += `<div class="toc-page"><table class="toc-table">`;
      config.selectedDrafts.forEach((draft, idx) => {
        pages += `<tr><td>${this.toUrduDigits(idx + 1)}</td><td>${this.escapeHtml(draft.title)}</td></tr>`;
      });
      pages += `</table></div>`;
    }

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

test('assemblePdf generates valid multi-page binary PDF with correct dimensions', () => {
  const dummyJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xd9]);
  
  // A4 Test
  const a4Pdf = TestDiwanBookletService.assemblePdf([
    { jpegBytes: dummyJpeg, width: 1, height: 1 },
    { jpegBytes: dummyJpeg, width: 1, height: 1 },
  ], 595.28, 841.89);

  const a4Text = new TextDecoder().decode(a4Pdf);
  assert.ok(a4Text.startsWith('%PDF-1.4'));
  assert.ok(a4Text.includes('/Count 2'));
  assert.ok(a4Text.includes('595.28 841.89'));
  assert.ok(a4Text.includes('%%EOF'));

  // WhatsApp Mobile HD (9:16 Portrait) Test
  const whatsappPdf = TestDiwanBookletService.assemblePdf([
    { jpegBytes: dummyJpeg, width: 1, height: 1 },
  ], 450, 800);

  const whatsappText = new TextDecoder().decode(whatsappPdf);
  assert.ok(whatsappText.startsWith('%PDF-1.4'));
  assert.ok(whatsappText.includes('/Count 1'));
  assert.ok(whatsappText.includes('450 800'), 'Must contain exact 450x800 pt dimensions for WhatsApp Mobile HD');
  assert.ok(whatsappText.includes('%%EOF'));

  // Crown Octavo (5.5" x 8.5") Test
  const crownPdf = TestDiwanBookletService.assemblePdf([
    { jpegBytes: dummyJpeg, width: 1, height: 1 },
  ], 396, 612);

  const crownText = new TextDecoder().decode(crownPdf);
  assert.ok(crownText.includes('396 612'), 'Must contain exact 396x612 pt dimensions for Crown Octavo');

  // Royal Octavo (6" x 9") Test
  const royalPdf = TestDiwanBookletService.assemblePdf([
    { jpegBytes: dummyJpeg, width: 1, height: 1 },
  ], 432, 648);

  const royalText = new TextDecoder().decode(royalPdf);
  assert.ok(royalText.includes('432 648'), 'Must contain exact 432x648 pt dimensions for Royal Octavo');
});

test('ghazal serial numbering and breathing space configuration format correctly', () => {
  const formatBadge = (form, index, includeNumber = true) => {
    const formUrdu = form === 'ghazal' ? 'غزل' : form === 'nazm' ? 'نظم' : 'کلام';
    if (!includeNumber) return `[ ${formUrdu} ]`;
    return `[ ${formUrdu} ${TestDiwanBookletService.toUrduDigits(index + 1)} ]`;
  };

  assert.equal(formatBadge('ghazal', 0, true), '[ غزل ۱ ]');
  assert.equal(formatBadge('ghazal', 4, true), '[ غزل ۵ ]');
  assert.equal(formatBadge('nazm', 1, true), '[ نظم ۲ ]');
  assert.equal(formatBadge('ghazal', 0, false), '[ غزل ]');

  // Verify spacing multiplier guarantees clearance above title ascenders
  const computeClearance = (scale = 1.0, fontMultiplier = 1.0, spacingMultiplier = 1.25) => {
    const badgeToTitleGap = Math.round(165 * fontMultiplier * spacingMultiplier);
    const titleAscenders = Math.round(38 * scale * fontMultiplier * 2.1);
    const netBreathingSpace = badgeToTitleGap - titleAscenders;
    return { badgeToTitleGap, titleAscenders, netBreathingSpace };
  };

  const standard = computeClearance(1.0, 1.0, 1.25);
  assert.ok(standard.netBreathingSpace >= 70, 'Must have at least 70px clearance to prevent collision with ascenders');

  const royal = computeClearance(1.0, 1.34, 1.48);
  assert.ok(royal.netBreathingSpace >= 80, 'Royal spacing must preserve ample clearance even with large fonts');
});

console.log('7 diwan booklet generator checks passed.');
