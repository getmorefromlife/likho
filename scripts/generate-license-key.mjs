#!/usr/bin/env node
/**
 * Likho Pro — Offline License Key Generator (CLI Tool for Software Owner)
 *
 * Usage:
 *   node scripts/generate-license-key.mjs "Customer Name" [lifetime|patron|annual]
 *
 * Examples:
 *   node scripts/generate-license-key.mjs "Ahmad Faraz" lifetime
 *   node scripts/generate-license-key.mjs "Faiz Ahmad Faiz" patron
 */

const MASTER_SECRET = 'LIKHO_PRO_2026_SOVEREIGN_OFFLINE_SECRET_KEY_v1';

function computeKeySignature(payload) {
  const input = `${MASTER_SECRET}:${payload}:${MASTER_SECRET}`;
  let h1 = 0x811c9dc5;
  let h2 = 0xcbf29ce4;

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code;
    h2 = Math.imul(h2, 0x100000001b3);
  }

  const u1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const u2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (u1.slice(0, 4) + u2.slice(4, 8)).toUpperCase();
}

function generateKey(tier = 'lifetime', customerName = 'Customer') {
  const tierPrefix = tier === 'lifetime' ? 'LP' : tier === 'patron' ? 'PA' : 'AN';
  const seed = `${customerName}:${Date.now()}`;
  const rawToken = computeKeySignature(seed).slice(0, 6);
  const seg1 = `${tierPrefix}${rawToken.slice(0, 2)}`;
  const seg2 = rawToken.slice(2, 6);
  const payload = `LKHO-${seg1}-${seg2}`;
  const sig = computeKeySignature(payload);
  const seg3 = sig.slice(0, 4);
  const seg4 = sig.slice(4, 8);
  return `${payload}-${seg3}-${seg4}`;
}

const customer = process.argv[2] || 'محترم شاعر / صارف';
const tierArg = (process.argv[3] || 'lifetime').toLowerCase();
const tier = tierArg === 'patron' ? 'patron' : tierArg === 'annual' ? 'annual' : 'lifetime';

const key = generateKey(tier, customer);
const tierUrdu =
  tier === 'lifetime'
    ? 'لائف ٹائم پرو لائسنس (Lifetime Pro)'
    : tier === 'patron'
    ? 'ادبی سرپرست لائسنس (Patron Edition)'
    : 'سالانہ پرو لائسنس (Annual Pass)';

console.log(`
===============================================================
👑 قلم و قافیہ پرو (Likho Pro) — آفیشل لائسنس کلید برائے کسٹمر
===============================================================
خریدار (Customer Name): ${customer}
لائسنس کا درجہ (Tier):  ${tierUrdu}
تاریخِ اجراء (Issued):    ${new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' })} (${new Date().toLocaleDateString('en-US')})

🔑 آپ کی مصدقہ لائسنس کی:
   ${key}
===============================================================

📋 WhatsApp / Email پر گاہک کو بھیجنے کے لیے تیار جوابی پیغام:
---------------------------------------------------------------
محترم ${customer} صاحب!

قلم و قافیہ پرو (Likho Pro) خریدنے کا بہت شکریہ۔ آپ کا مصدقہ اور مستقل لائسنس کوڈ درج ذیل ہے:

🔑 لائسنس کوڈ: ${key}
👑 درجہ: ${tierUrdu}

ایکٹیویشن کا طریقہ:
۱۔ قلم و قافیہ ویب سائٹ (یا ایپ) کھولیں۔
۲۔ اوپر دائیں جانب موجود "پرو حاصل کریں" پر کلک کریں۔
۳۔ نیچے دیے گئے خانے "لائسنس کی ایکٹیویشن" میں اپنا یہ کوڈ درج کر کے "ایکٹیویٹ کریں" کا بٹن دبائیں۔

آپ کا پرو ورژن بغیر انٹرنیٹ، تاحیات اور مکمل رازداری کے ساتھ فعال ہو جائے گا۔

نیک تمناؤں اور پرخلوص دعاؤں کے ساتھ،
انتظامیہ قلم و قافیہ (Likho Studio)
---------------------------------------------------------------
`);

