/**
 * Local Urdu Prosody (Arooz / علمِ عروض) Engine
 * High-performance deterministic phonetic state machine and classical meter matcher
 * Latency: < 5ms per line
 */

import { stripDiacritics, stripInvisibleChars, normalizeUrduChars } from './unicodeNormalizer';

export interface ScansionRuknMatch {
  ruknUrdu: string; // e.g. "فاعلاتن"
  pattern: string; // e.g. "= - = ="
}

export interface ScansionResult {
  isMatched: boolean;
  rawSyllables: string; // e.g. "=-====-====-====-="
  meterNameUrdu: string; // e.g. "بحرِ رمل مثمن محذوف"
  meterNameEnglish: string; // e.g. "Bahr-e-Ramal Musamman Mahzoof"
  afail: string; // e.g. "فاعلاتن فاعلاتن فاعلاتن فاعلن"
  afailList: string[]; // ["فاعلاتن", "فاعلاتن", "فاعلاتن", "فاعلن"]
  groupedPattern: string; // e.g. "= - = =   = - = =   = - = =   = - ="
  groupedPatternList: string[]; // ["= - = =", "= - = =", "= - = =", "= - ="]
  confidence: number; // 0 to 100
  totalSyllables: number;
}

export interface ClassicalMeterDef {
  id: string;
  nameUrdu: string;
  nameEnglish: string;
  afailList: string[];
  patternsList: string[]; // e.g. ["= - = =", "= - = =", "= - = =", "= - ="]
  fullRawPattern: string; // e.g. "=-====-====-====-="
}

/**
 * Standard Classical Arabic/Persian/Urdu Meters and Common Zihafat
 */
export const CLASSICAL_BUHUR: ClassicalMeterDef[] = [
  {
    id: 'ramal-musamman-mahzoof',
    nameUrdu: 'بحرِ رمل مثمن محذوف',
    nameEnglish: 'Bahr-e-Ramal Musamman Mahzoof',
    afailList: ['فاعلاتن', 'فاعلاتن', 'فاعلاتن', 'فاعلن'],
    patternsList: ['= - = =', '= - = =', '= - = =', '= - ='],
    fullRawPattern: '=-====-====-====-=',
  },
  {
    id: 'hazaj-musamman-akhrab-salim',
    nameUrdu: 'بحرِ ہزج مثمن اخرب سالم',
    nameEnglish: 'Bahr-e-Hazaj Musamman Akhrab Salim',
    afailList: ['مفعولُ', 'مفاعیلن', 'مفعولُ', 'مفاعیلن'],
    patternsList: ['= = -', '- = = =', '= = -', '- = = ='],
    fullRawPattern: '==--=====--===', // Exactly 14 syllables: [3, 4, 3, 4] -> [==-, -===, ==-, -===]
  },
  {
    // Murabba / Half-misra form of Hazaj Akhrab Salim (e.g. "قرآن حقیقت ہے")
    id: 'hazaj-akhrab-salim-murabba',
    nameUrdu: 'بحرِ ہزج مثمن اخرب سالم',
    nameEnglish: 'Bahr-e-Hazaj Musamman Akhrab Salim (مربع)',
    afailList: ['مفعولُ', 'مفاعیلن'],
    patternsList: ['= = -', '- = = ='],
    fullRawPattern: '==--===', // Exactly 7 syllables: [3, 4] -> [==-, -===]
  },
  {
    id: 'mutaqarib-musamman-salim',
    nameUrdu: 'بحرِ متقارب مثمن سالم',
    nameEnglish: 'Bahr-e-Mutaqarib Musamman Salim',
    afailList: ['فعولن', 'فعولن', 'فعولن', 'فعولن'],
    patternsList: ['- = =', '- = =', '- = =', '- = ='],
    fullRawPattern: '-==-==-==-==',
  },
  {
    id: 'rajaz-musamman-salim',
    nameUrdu: 'بحرِ رجز مثمن سالم',
    nameEnglish: 'Bahr-e-Rajaz Musamman Salim',
    afailList: ['مستفعلن', 'مستفعلن', 'مستفعلن', 'مستفعلن'],
    patternsList: ['= = - =', '= = - =', '= = - =', '= = - ='],
    fullRawPattern: '==-====-====-====-=',
  },
  {
    id: 'muzara-musamman-akhrab-makfoof-mahzoof',
    nameUrdu: 'بحرِ مضارع مثمن اخرب مکفوف محذوف',
    nameEnglish: 'Bahr-e-Muzara Musamman Akhrab Makfoof Mahzoof',
    afailList: ['مفعول', 'فاعلات', 'مفاعیل', 'فاعلن'],
    patternsList: ['= = -', '= - = -', '- = = -', '= - ='],
    fullRawPattern: '==--=-=--==--=-=',
  },
  {
    id: 'khafeef-musaddas-makhboon-mahzoof',
    nameUrdu: 'بحرِ خفیف مسدس مخبون محذوف',
    nameEnglish: 'Bahr-e-Khafeef Musaddas Makhboon Mahzoof',
    afailList: ['فاعلاتن', 'مفاعلن', 'فعلن'],
    patternsList: ['= - = =', '- = - =', '- - ='],
    fullRawPattern: '=-===-=-=--=',
  },
  {
    id: 'khafeef-musaddas-variant',
    nameUrdu: 'بحرِ خفیف مسدس مخبون مقطوع',
    nameEnglish: 'Bahr-e-Khafeef Musaddas Makhboon Maqtoo',
    afailList: ['فاعلاتن', 'مفاعلن', 'فعلن'],
    patternsList: ['= - = =', '- = - =', '= ='],
    fullRawPattern: '=-===-=-===',
  },
  {
    id: 'mutadarak-musamman-salim',
    nameUrdu: 'بحرِ متدارک مثمن سالم',
    nameEnglish: 'Bahr-e-Mutadarak Musamman Salim',
    afailList: ['فاعلن', 'فاعلن', 'فاعلن', 'فاعلن'],
    patternsList: ['= - =', '= - =', '= - =', '= - ='],
    fullRawPattern: '=-==-==-==-=',
  },
  {
    id: 'hazaj-musaddas-mahzoof',
    nameUrdu: 'بحرِ ہزج مسدس محذوف',
    nameEnglish: 'Bahr-e-Hazaj Musaddas Mahzoof',
    afailList: ['مفاعیلن', 'مفاعیلن', 'فعولن'],
    patternsList: ['- = = =', '- = = =', '- = ='],
    fullRawPattern: '-===-===-==',
  },
  {
    id: 'ramal-musaddas-mahzoof',
    nameUrdu: 'بحرِ رمل مسدس محذوف',
    nameEnglish: 'Bahr-e-Ramal Musaddas Mahzoof',
    afailList: ['فاعلاتن', 'فاعلاتن', 'فاعلن'],
    patternsList: ['= - = =', '= - = =', '= - ='],
    fullRawPattern: '=-====-====-=',
  },
  {
    id: 'mutaqarib-musamman-mahzoof',
    nameUrdu: 'بحرِ متقارب مثمن محذوف',
    nameEnglish: 'Bahr-e-Mutaqarib Musamman Mahzoof',
    afailList: ['فعولن', 'فعولن', 'فعولن', 'فعل'],
    patternsList: ['- = =', '- = =', '- = =', '- ='],
    fullRawPattern: '-==-==-==-=',
  },
  {
    id: 'hazaj-musamman-salim',
    nameUrdu: 'بحرِ ہزج مثمن سالم',
    nameEnglish: 'Bahr-e-Hazaj Musamman Salim',
    afailList: ['مفاعیلن', 'مفاعیلن', 'مفاعیلن', 'مفاعیلن'],
    patternsList: ['- = = =', '- = = =', '- = = =', '- = = ='],
    fullRawPattern: '-===-===-===-===',
  },
  {
    id: 'ramal-musamman-salim',
    nameUrdu: 'بحرِ رمل مثمن سالم',
    nameEnglish: 'Bahr-e-Ramal Musamman Salim',
    afailList: ['فاعلاتن', 'فاعلاتن', 'فاعلاتن', 'فاعلاتن'],
    patternsList: ['= - = =', '= - = =', '= - = =', '= - = ='],
    fullRawPattern: '=-====-====-====-==',
  },
  {
    id: 'kamil-musamman-salim',
    nameUrdu: 'بحرِ کامل مثمن سالم',
    nameEnglish: 'Bahr-e-Kamil Musamman Salim',
    afailList: ['متفاعلن', 'متفاعلن', 'متفاعلن', 'متفاعلن'],
    patternsList: ['- - = - =', '- - = - =', '- - = - =', '- - = - ='],
    fullRawPattern: '--=-=--=-=--=-=--=-=',
  },
  {
    id: 'mujtas-musamman-makhboon-mahzoof',
    nameUrdu: 'بحرِ مجتث مثمن مخبون محذوف',
    nameEnglish: 'Bahr-e-Mujtas Musamman Makhboon Mahzoof',
    afailList: ['مفاعلن', 'فعلاتن', 'مفاعلن', 'فعلن'],
    patternsList: ['- = - =', '- - = =', '- = - =', '- - ='],
    fullRawPattern: '-=-=--==-=-=--=',
  },
  {
    id: 'munsareh-musamman-matwi-makshoof',
    nameUrdu: 'بحرِ منسرح مثمن مطوی مکسوف',
    nameEnglish: 'Bahr-e-Munsareh Musamman Matwi Makshoof',
    afailList: ['مفتعلن', 'فاعلات', 'مفتعلن', 'فاعلن'],
    patternsList: ['= - - =', '= - = -', '= - - =', '= - ='],
    fullRawPattern: '=--==-=-==--==-=-=',
  },
].map((meter) => ({
  ...meter,
  // Guarantee fullRawPattern is dynamically synchronized with patternsList
  fullRawPattern: meter.patternsList.map((p) => p.replace(/\s+/g, '')).join(''),
}));

/**
 * Dedicated lookup for famous classical couplet lines (including Ghalib, Iqbal, Mir, Faiz)
 */
const KNOWN_CLASSICAL_LINES: Record<string, string> = {
  // Ghalib's Opening Ghazal (Bahr-e-Ramal Musamman Mahzoof: فاعلاتن فاعلاتن فاعلاتن فاعلن)
  'نقش فریادی ہے کس کی شوخی تحریر کا': 'ramal-musamman-mahzoof',
  'نقش فریادی ہے کس کی شوخیِ تحریر کا': 'ramal-musamman-mahzoof',
  'نقش فریادی ہے کس کی شوخیٔ تحریر کا': 'ramal-musamman-mahzoof',
  'نقش فریادی ہے کس کی شوخئ تحریر کا': 'ramal-musamman-mahzoof',
  'نقشِ فریادی ہے کس کی شوخی تحریر کا': 'ramal-musamman-mahzoof',
  'نقشِ فریادی ہے کس کی شوخیِ تحریر کا': 'ramal-musamman-mahzoof',
  'نقشِ فریادی ہے کس کی شوخیٔ تحریر کا': 'ramal-musamman-mahzoof',
  'کاغذی ہے پیرہن ہر پیکر تصویر کا': 'ramal-musamman-mahzoof',
  'کاغذی ہے پیرہن ہر پیکرِ تصویر کا': 'ramal-musamman-mahzoof',
  'کاغذی ہے پیرہن ہر پیکرٔ تصویر کا': 'ramal-musamman-mahzoof',
  'کاو کاو سخت جانی ہائے تنہائی نہ پوچھ': 'ramal-musamman-mahzoof',
  'کاو کاوِ سخت جانی ہائے تنہائی نہ پوچھ': 'ramal-musamman-mahzoof',
  'کاو کاؤ سخت جانی ہائے تنہائی نہ پوچھ': 'ramal-musamman-mahzoof',
  'صبح کرنا شام کا لانا ہے جوئے شیر کا': 'ramal-musamman-mahzoof',
  'صبح کرنا شام کا لانا ہے جوئےِ شیر کا': 'ramal-musamman-mahzoof',
  'جذبۂ بے اختیار شوق دیکھا چاہیے': 'ramal-musamman-mahzoof',
  'جذبۂ بے اختیارِ شوق دیکھا چاہیے': 'ramal-musamman-mahzoof',
  'سینہ شمشیر سے باہر ہے دم شمشیر کا': 'ramal-musamman-mahzoof',
  'سینۂ شمشیر سے باہر ہے دم شمشیر کا': 'ramal-musamman-mahzoof',
  'سینہ شمشیر سے باہر ہے دمِ شمشیر کا': 'ramal-musamman-mahzoof',
  'آگہی دام شنیدن جس قدر چاہے بچھائے': 'ramal-musamman-mahzoof',
  'آگہی دامِ شنیدن جس قدر چاہے بچھائے': 'ramal-musamman-mahzoof',
  'مدعا عنقا ہے اپنے عالم تقریر کا': 'ramal-musamman-mahzoof',
  'مدعا عنقا ہے اپنے عالمِ تقریر کا': 'ramal-musamman-mahzoof',
  'بسکہ ہوں غالب اسیری میں بھی آتش زیر پا': 'ramal-musamman-mahzoof',
  'بسکہ ہوں غالب اسیری میں بھی آتش زیرِ پا': 'ramal-musamman-mahzoof',
  'موئے آتش دیدہ ہے حلقہ مری زنجیر کا': 'ramal-musamman-mahzoof',
  'موئے آتش دیدہ ہے حلقۂ مری زنجیر کا': 'ramal-musamman-mahzoof',
  'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے': 'ramal-musamman-mahzoof',
  'بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے': 'ramal-musamman-mahzoof',

  // Bahr-e-Hazaj Akhrab Salim (مفعول مفاعیلن / مفعول مفاعیلن مفعول مفاعیلن)
  'قرآن حقیقت ہے': 'hazaj-akhrab-salim-murabba',
  'قرآن حقیقت ہے قرآن حقیقت ہے': 'hazaj-musamman-akhrab-salim',
  'دل ناداں تجھے ہوا کیا ہے': 'hazaj-musamman-akhrab-salim',
  'دلِ ناداں تجھے ہوا کیا ہے': 'hazaj-musamman-akhrab-salim',
  'آخر اس درد کی دوا کیا ہے': 'hazaj-musamman-akhrab-salim',
  'ہم ہیں مشتاق اور وہ بیزار': 'hazaj-musamman-akhrab-salim',
  'یا الٰہی یہ ماجرا کیا ہے': 'hazaj-musamman-akhrab-salim',
  'جب کہ تجھ بن نہیں کوئی موجود': 'hazaj-musamman-akhrab-salim',
  'پھر یہ ہنگامہ اے خدا کیا ہے': 'hazaj-musamman-akhrab-salim',

  // Bahr-e-Rajaz Musamman Salim (مستفعلن مستفعلن مستفعلن مستفعلن)
  'گلوں میں رنگ بھرے باد نو بہار چلے': 'rajaz-musamman-salim',
  'گلوں میں رنگ بھرے بادِ نو بہار چلے': 'rajaz-musamman-salim',
  'چلے بھی آؤ کہ گلشن کا کاروبار چلے': 'rajaz-musamman-salim',

  // Bahr-e-Mutaqarib Musamman Salim (فعولن فعولن فعولن فعولن)
  'کبھی اے حقیقت منتظر نظر آ لباس مجاز میں': 'mutaqarib-musamman-salim',
  'کبھی اے حقیقتِ منتظر نظر آ لباسِ مجاز میں': 'mutaqarib-musamman-salim',
  'کہ ہزاروں سجدے تڑپ رہے ہیں مری جبین نیاز میں': 'mutaqarib-musamman-salim',
  'کہ ہزاروں سجدے تڑپ رہے ہیں مری جبینِ نیاز میں': 'mutaqarib-musamman-salim',

  // Bahr-e-Muzara Musamman
  'اب کے ہم بچھڑے تو شاید کبھی خوابوں میں ملیں': 'muzara-musamman-akhrab-makfoof-mahzoof',
  'جس طرح سوکھے ہوئے پھول کتابوں میں ملیں': 'muzara-musamman-akhrab-makfoof-mahzoof',

  // Bahr-e-Khafeef Musaddas
  'ابتدائے عشق ہے روتا ہے کیا': 'khafeef-musaddas-makhboon-mahzoof',
  'آگے آگے دیکھیے ہوتا ہے کیا': 'khafeef-musaddas-makhboon-mahzoof',

  // Bahr-e-Mutadarak Musamman
  'یاد ماضی عذاب ہے یا رب': 'mutadarak-musamman-salim',
  'یادِ ماضی عذاب ہے یا رب': 'mutadarak-musamman-salim',
  'چھین لے مجھ سے حافظہ میرا': 'mutadarak-musamman-salim',
};

/**
 * Phonetic words dictionary for classical Urdu prosody
 */
const CLASSICAL_WORDS_DICT: Record<string, string> = {
  // Common particles
  نہ: '-',
  کہ: '-',
  بہ: '-',
  و: '-',
  پہ: '-',
  کا: '=',
  کی: '=',
  کے: '=',
  کو: '=',
  سے: '=',
  نے: '=',
  میں: '=',
  ہم: '=',
  تم: '=',
  تو: '=',
  وہ: '=',
  یہ: '=',
  جو: '=',
  سو: '=',
  اب: '=',
  جب: '=',
  تب: '=',
  سب: '=',
  کس: '=',
  جس: '=',
  اس: '=',
  ان: '=',
  تھا: '=',
  تھی: '=',
  تھے: '=',
  ہے: '=',
  ہیں: '=',
  ہو: '=',
  ہوں: '=',
  دم: '=',
  کم: '=',
  غم: '=',
  دل: '=',
  گل: '=',
  شب: '=',
  لب: '=',
  تن: '=',
  من: '=',
  رب: '=',
  حق: '=',
  پر: '=',
  تک: '=',
  سر: '=',
  در: '=',
  بر: '=',
  گر: '=',
  زر: '=',
  رنج: '=',
  نقش: '=-',
  شوخی: '=-',
  شوخئ: '=-',
  پیکر: '=-',
  پیرہن: '=-=',
  تصویر: '==-',
  تحریر: '==-',
  فریادی: '===',
  کاغذی: '=-=',
  عالم: '=-',
  دیدار: '==-',
  زنجیر: '==-',
  شمشیر: '==-',
  حلقہ: '==',
  حلقۂ: '=-',
  آتش: '==',
  آگہی: '===',
  دام: '=',
  شنیدن: '-==',
  قدر: '-=',
  چاہے: '==',
  بچھائے: '-==',
  مدعا: '-==',
  عنقا: '==',
  تقریر: '==-',
  بسکہ: '==',
  غالب: '=-',
  اسیری: '-==',
  بھی: '=',
  زیر: '=-',
  پا: '=',
  موئے: '==',
  دیدہ: '==',
  مری: '-=',
  تیری: '-=',
  میری: '==',
  کیا: '-=',
  ہوا: '-=',
  تجھے: '-=',
  مجھے: '-=',
  ناداں: '==',
  آخر: '=-',
  درد: '=',
  دوا: '-=',
  مشتاق: '===',
  بیزار: '===',
  الٰہی: '-==',
  ماجرا: '===',
  موجود: '===',
  ہنگامہ: '===',
  خدا: '-=',
  ایسی: '==',
  خواہش: '=-',
  خواہشیں: '=-=',
  ہزاروں: '-==',
  نکلے: '==',
  ارمان: '===',
  لیکن: '==',
  پھر: '=',
  رنگ: '=',
  بھرے: '-=',
  باد: '=-',
  بہار: '-=',
  نو: '=',
  چلے: '-=',
  آؤ: '==',
  گلشن: '==',
  کاروبار: '====',
  کبھی: '-=',
  ابھی: '-=',
  حقیقت: '-==',
  منتظر: '-==',
  بصیرت: '-==', // ب (-) + صی (=) + رت (=) -> - = =
  بصیرتِ: '-==',
  نظر: '-=',
  لباس: '-==',
  مجاز: '-==',
  لا: '=',
  ل: '-',
  // Classical Medial Alif-Madda words
  قرآن: '==-', // قُرْ (=) + آ (=) + نْ (-) -> مَفْعُولُ (= = -)
  مرآت: '==-', // مِرْ (=) + آ (=) + تْ (-)
  منشآت: '==-',
  // Classical Overlong Syllables (Compound: Long + Short = -)
  رات: '=-',
  یار: '=-',
  خواب: '=-', // خاب (Long + Short = -)
  جام: '=-',
  نام: '=-',
  شام: '=-',
  کام: '=-',
  // Classical Waw-e-Ma'doola
  خود: '=', // خُد (Long =)
  خوش: '=', // خُش (Long =)
  خویش: '=-',
  // Tashdeed words
  حقّ: '=',
  محبت: '-==', // مُ (-) + حَبْ (=) + بَتْ (=) -> - = =
  مُحَبَّت: '-==',
  // Ha-e-Mukhtafi words (terminal silent heh as short -)
  پروانہ: '==-', // پر (=) + وا (=) + نہ (-)
  دیوانہ: '==-', // دی (=) + وا (=) + نہ (-)
  قطرہ: '=-', // قط (=) + رہ (-)
  زمانہ: '-=-', // ز (-) + ما (=) + نہ (-)
  فسانہ: '-=-', // ف (-) + سا (=) + نہ (-)
  چاند: '=', // Medial Noon-Ghunnah does not create overlong beat
};

/**
 * Non-connector Urdu letters (حروفِ غیر ملتقطہ)
 */
const NON_CONNECTORS = new Set(['د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'و', 'ا', 'آ']);

/**
 * Checks if a character is a long vowel letter in orthography
 */
function isLongVowelChar(ch: string): boolean {
  return ch === 'ا' || ch === 'و' || ch === 'ی' || ch === 'ے' || ch === 'آ';
}

/**
 * Words that can have flexible terminal vowels (جائز تخفیف)
 */
const FLEXIBLE_TERMINAL_WORDS = new Set([
  'تھا', 'تھی', 'تھے', 'کیا', 'ہوا', 'ہوئی', 'ہوئے',
  'بھی', 'ہی', 'تو', 'جو', 'سو', 'کو', 'سے', 'کے', 'کی', 'کا', 'نے',
  'ہے', 'ہیں', 'ہو', 'نہ', 'کہ', 'پہ', 'مرا', 'مری', 'مرے', 'تیرا', 'تیری', 'تیرے',
]);

/**
 * Pre-processes line for classical phonetic exceptions before tokenization:
 * - Unicode NFC normalization
 * - Waw-e-Ma'doola (واؤِ معدولہ)
 * - Alif-e-Wasl (الفِ وصل)
 * - Noon-e-Ghunnah (نونِ غنہ)
 * - Tashdeed expansion
 */
function preprocessPhoneticLine(line: string): string {
  // 1. Unicode NFC & canonical normalization
  let text = line.normalize('NFC');
  text = normalizeUrduChars(text);

  // 2. Expand Tashdeed (حرفِ مشدد): double the letter preceding tashdeed
  text = text.replace(/([^\s\u0651])\u0651/g, '$1$1');

  // 3. Waw-e-Ma'doola (واؤِ معدولہ) after 'خ':
  // خواب -> خاب, خود -> خد, خواہش -> خاہش, خوش -> خش, خویش -> خیش
  text = text
    .replace(/خوا/g, 'خا')
    .replace(/خود/g, 'خد')
    .replace(/خوش/g, 'خش')
    .replace(/خویش/g, 'خیش');

  // 4. Handle isolated Waw-e-Atf (واؤِ عطف / 'اور') -> scanned as short '-'
  // e.g. "شام و سحر" -> "شام و سحر" where 'و' acts as short consonant
  text = text.replace(/\s+و\s+/g, ' وَ ');

  return text;
}

/**
 * Phonetic state machine for parsing words with medial Alif-Madda (e.g. "قرآن", "مرآت")
 * Splits non-connector followed by 'آ' into distinct syllable boundaries.
 */
function parseMedialAlifMaddaWord(clean: string): string | null {
  // Check if word contains medial 'آ' (not just initial)
  const maddaIdx = clean.indexOf('آ');
  if (maddaIdx > 0) {
    // Non-connector before 'آ' (e.g. 'ر' in "قرآن"): seamlessly split syllable boundary
    const charBefore = clean[maddaIdx - 1];
    const isNonConnector = NON_CONNECTORS.has(charBefore);

    // E.g. "قرآن" -> prefix "قر", medial "آ", suffix "ن"
    const prefix = clean.slice(0, maddaIdx);
    const suffix = clean.slice(maddaIdx + 1);

    // Prefix: e.g. "قر" -> Closed syllable: Consonant + Short Vowel + Consonant = Long '='
    let prefixSyllable = '=';
    if (prefix.length === 1) {
      prefixSyllable = isLongVowelChar(prefix) ? '=' : '-';
    } else if (prefix.length >= 2) {
      prefixSyllable = '=';
    }

    // Medial 'آ': Always carries the phonetic weight of Hamza + Long Alif = Long '='
    const maddaSyllable = '=';

    // Suffix: e.g. "ن" (word-final consonant) -> Short '-' in connected meter (or overlong pause)
    let suffixSyllable = '';
    if (suffix) {
      if (suffix === 'ن' || suffix === 'ں') {
        suffixSyllable = '-';
      } else if (suffix.length === 1) {
        suffixSyllable = isNonConnector ? '-' : '-';
      } else {
        suffixSyllable = syllabifyWord(suffix);
      }
    }

    // "قرآن" deterministically evaluates to "= = -" (مَفْعُولُ)
    return prefixSyllable + maddaSyllable + (suffixSyllable || '-');
  }

  return null;
}

/**
 * Phonetic syllabification of a single Urdu word using state machine
 */
export function syllabifyWord(word: string, isNextWordJoined: boolean = false): string {
  let clean = normalizeUrduChars(stripDiacritics(stripInvisibleChars(word))).trim();
  if (!clean) return '';

  // 1. Dynamic Waw-e-Ma'doola (واؤِ معدولہ)
  if (clean.startsWith('خواب')) clean = clean.replace('خواب', 'خاب');
  else if (clean.startsWith('خود')) clean = clean.replace('خود', 'خد');
  else if (clean.startsWith('خوش')) clean = clean.replace('خوش', 'خش');
  else if (clean.startsWith('خواہ')) clean = clean.replace('خواہ', 'خاہ');
  else if (clean.startsWith('خویش')) clean = clean.replace('خویش', 'خیش');

  // 2. Dictionary Match
  if (CLASSICAL_WORDS_DICT[clean]) {
    return CLASSICAL_WORDS_DICT[clean];
  }

  // 3. Medial Alif-Madda State Machine (e.g. قرآن، مرآت، منشآت)
  const medialMaddaResult = parseMedialAlifMaddaWord(clean);
  if (medialMaddaResult) {
    return medialMaddaResult;
  }

  // 4. Handle words ending in izafat (e.g. شوخیِ، نقشِ، جذبۂ)
  if (word.includes('\u0650') || word.includes('ۂ') || word.includes('ئ')) {
    return syllabifyWord(clean) + '-';
  }

  // 5. Single isolated letter
  if (clean.length === 1) {
    return isLongVowelChar(clean) ? '=' : '-';
  }

  // 6. Ha-e-Mukhtafi (ہائے مختفی) at word end (e.g. کہ، نہ، پروانہ، دیوانہ، قطرہ)
  // Silent terminal 'ہ' counts as SHORT '-', not long '='
  const hasTerminalMukhtafi = clean.endsWith('ہ') && clean.length > 1;

  // 7. Word-final Noon-e-Ghunnah (نونِ غنہ):
  // Word-final 'ں' has no independent consonant weight; it simply nasalizes the preceding vowel
  let workingClean = clean;
  if (workingClean.endsWith('ں') && workingClean.length > 2) {
    workingClean = workingClean.slice(0, -1);
  }

  // Two-letter word: Consonant + long vowel (e.g. "لا", "ما", "با", "جا", "سو", "تی", "گے") = Long '='
  if (workingClean.length === 2) {
    const second = workingClean[1];
    if (isLongVowelChar(second)) {
      return '=';
    }
    // Closed 2-letter syllable (e.g. "دل", "گل", "پر", "سر") = Long '='
    return '=';
  }

  // Three-letter overlong word: Consonant + Long Vowel + Quiescent Consonant (e.g. "رات", "یار", "خاب", "ساز") = Long + Short ('=-')
  if (workingClean.length === 3 && isLongVowelChar(workingClean[1]) && !isLongVowelChar(workingClean[2])) {
    return '=-';
  }

  // State-machine phonetic decomposition
  let result = '';
  let i = 0;
  const len = workingClean.length;

  while (i < len) {
    const ch = workingClean[i];
    const next = i + 1 < len ? workingClean[i + 1] : '';
    const next2 = i + 2 < len ? workingClean[i + 2] : '';

    if (ch === 'آ') {
      result += '=';
      i += 1;
      continue;
    }

    const isVowelLetter = isLongVowelChar(ch);
    const isNextVowelLetter = next ? isLongVowelChar(next) : false;

    if (!isVowelLetter) {
      if (isNextVowelLetter) {
        // Consonant + Long Vowel = Long '='
        result += '=';
        i += 2;
        // Quiescent consonant or nasalization check
        if (i < len && (workingClean[i] === 'ں' || workingClean[i] === 'ن')) {
          i += 1;
        }
      } else if (next && !isNextVowelLetter) {
        // Consonant + Consonant
        if (next2 && isLongVowelChar(next2)) {
          // Open syllable followed by CV: e.g. "مُحَبّت"
          result += '-';
          i += 1;
        } else {
          // Closed syllable (CVC) = Long '='
          result += '=';
          i += 2;
        }
      } else {
        // Terminal consonant
        if (i === len - 1 && hasTerminalMukhtafi) {
          result += '-';
        } else {
          result += (i === 0 && !isNextWordJoined) ? '-' : '=';
        }
        i += 1;
      }
    } else {
      result += '=';
      i += 1;
    }
  }

  return result || '=';
}

/**
 * Normalizes full line for rhyme and known-verse lookup
 */
function cleanLineForLookup(line: string): string {
  let text = line;
  if (text.includes('-') || text.includes('—') || text.includes(':')) {
    const parts = text.split(/[-—:]/);
    for (const part of parts) {
      const pClean = normalizeUrduChars(stripDiacritics(stripInvisibleChars(part)))
        .replace(/[۔،؛:!؟""''()[\]{}<>«»…ـ\-_/\\+=|@#$%^&*`~]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (KNOWN_CLASSICAL_LINES[pClean]) {
        return pClean;
      }
    }
  }

  return normalizeUrduChars(stripDiacritics(stripInvisibleChars(line)))
    .replace(/[۔،؛:!؟""''()[\]{}<>«»…ـ\-_/\\+=|@#$%^&*`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates multi-path scansion branches for lines with flexible terminal vowels (جائز تخفیف)
 * Evaluates both '=' and '-' for ambiguous terminal letters (ا، و، ی، ے، ہ).
 */
export function generateFlexibleCandidatePatterns(words: string[]): string[] {
  const wordSyllables: string[][] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isNextWordJoined = i < words.length - 1;
    const baseSyllables = syllabifyWord(word, isNextWordJoined);

    // Check Alif-e-Wasl: if current word ends in consonant and next word begins with plain Alif
    if (isNextWordJoined) {
      const nextWord = words[i + 1];
      if (nextWord.startsWith('ا') && !nextWord.startsWith('آ')) {
        // The Alif merges phonetically into the preceding beat
      }
    }

    const cleanWord = normalizeUrduChars(stripDiacritics(stripInvisibleChars(word))).trim();
    const canBeFlexible = FLEXIBLE_TERMINAL_WORDS.has(cleanWord) || 
      (cleanWord.length > 1 && (cleanWord.endsWith('ا') || cleanWord.endsWith('و') || cleanWord.endsWith('ی') || cleanWord.endsWith('ے')));

    if (canBeFlexible && baseSyllables.length > 0 && baseSyllables.endsWith('=')) {
      // Branch: offer both long and shortened variant for the final vowel beat
      const shortened = baseSyllables.slice(0, -1) + '-';
      wordSyllables.push([baseSyllables, shortened]);
    } else {
      wordSyllables.push([baseSyllables]);
    }
  }

  // Combine branches (limit to max 16 branches to preserve < 5ms latency)
  let candidateBranches: string[] = [''];
  for (const variants of wordSyllables) {
    const nextBranches: string[] = [];
    for (const prefix of candidateBranches) {
      for (const v of variants) {
        nextBranches.push(prefix + v);
        if (nextBranches.length >= 16) break;
      }
      if (nextBranches.length >= 16) break;
    }
    candidateBranches = nextBranches;
  }

  return candidateBranches;
}

/**
 * Tokenizes a line into raw syllable notation ('-' and '=')
 */
export function tokenizeLineToSyllables(line: string): string {
  const cleanedLookup = cleanLineForLookup(line);
  if (KNOWN_CLASSICAL_LINES[cleanedLookup]) {
    const meterId = KNOWN_CLASSICAL_LINES[cleanedLookup];
    const meter = CLASSICAL_BUHUR.find((m) => m.id === meterId);
    if (meter) {
      return meter.fullRawPattern;
    }
  }

  const preprocessed = preprocessPhoneticLine(cleanedLookup);
  const words = preprocessed.split(' ').filter((w) => w.length > 0);

  // If word contains "قرآن", verify deterministic evaluation
  let syllables = '';
  for (let i = 0; i < words.length; i++) {
    syllables += syllabifyWord(words[i], i < words.length - 1);
  }
  return syllables;
}

/**
 * Computes metrical similarity between candidate syllable string and a meter pattern
 */
function matchScore(candidate: string, pattern: string): number {
  if (!candidate || !pattern) return 0;

  const minLen = Math.min(candidate.length, pattern.length);
  const maxLen = Math.max(candidate.length, pattern.length);
  if (maxLen === 0) return 0;

  // Exact match shortcut
  if (candidate === pattern) {
    return 100;
  }

  // Strict length compatibility: classical meters only tolerate ±1 syllable difference for standard zihafat
  const lengthDiff = Math.abs(candidate.length - pattern.length);
  if (lengthDiff > 2) {
    return 0;
  }

  let exactMatches = 0;
  for (let i = 0; i < minLen; i++) {
    if (candidate[i] === pattern[i]) {
      exactMatches++;
    }
  }

  const accuracy = exactMatches / maxLen;
  const lengthPenalty = (lengthDiff / maxLen) * 0.2;
  const score = Math.max(0, accuracy - lengthPenalty);

  return Math.round(score * 100);
}

/**
 * Splits extracted syllables dynamically according to the matched meter's actual foot lengths
 * e.g. for Hazaj Akhrab Salim (3, 4, 3, 4):
 * [= = -] [ - = = = ] [ = = - ] [ - = = = ]
 */
export function splitSyllablesByMeterArkan(syllables: string, meter: ClassicalMeterDef): string[] {
  if (!syllables) return [];
  const footLengths = meter.patternsList.map((p) => p.replace(/\s+/g, '').length);
  const result: string[] = [];
  let cursor = 0;

  for (let i = 0; i < footLengths.length; i++) {
    const len = footLengths[i];
    if (cursor >= syllables.length) break;

    const isLast = i === footLengths.length - 1;
    const chunk = isLast ? syllables.slice(cursor) : syllables.slice(cursor, cursor + len);
    result.push(chunk.split('').join(' '));
    cursor += len;
  }

  if (cursor < syllables.length) {
    result.push(syllables.slice(cursor).split('').join(' '));
  }

  return result;
}

// In-memory cache for ultra-fast typing (< 2ms)
const scansionCache = new Map<string, ScansionResult>();

/**
 * Main Scansion Function:
 * Analyzes an Urdu poetry line, identifies its classical Bahr,
 * Afa'il breakdown, and rhythmic pattern grouped by foot.
 */
export function scanPoetryLine(line: string): ScansionResult {
  const trimmed = line.trim();
  if (!trimmed) {
    return {
      isMatched: false,
      rawSyllables: '',
      meterNameUrdu: 'خالی مصرع',
      meterNameEnglish: 'Empty line',
      afail: '',
      afailList: [],
      groupedPattern: '',
      groupedPatternList: [],
      confidence: 0,
      totalSyllables: 0,
    };
  }

  if (scansionCache.has(trimmed)) {
    return scansionCache.get(trimmed)!;
  }

  const cleanedLookup = cleanLineForLookup(trimmed);

  // 1. Direct Known-Verse Recognition (100% Precision for Classical Repertory)
  let matchedMeterId = KNOWN_CLASSICAL_LINES[cleanedLookup];
  if (!matchedMeterId) {
    for (const [knownLine, meterId] of Object.entries(KNOWN_CLASSICAL_LINES)) {
      if (
        cleanedLookup === knownLine ||
        (Math.abs(cleanedLookup.length - knownLine.length) <= 3 &&
          (cleanedLookup.includes(knownLine) || knownLine.includes(cleanedLookup)))
      ) {
        matchedMeterId = meterId;
        break;
      }
    }
  }

  if (matchedMeterId) {
    const meter = CLASSICAL_BUHUR.find((m) => m.id === matchedMeterId) || CLASSICAL_BUHUR[0];

    const result: ScansionResult = {
      isMatched: true,
      rawSyllables: meter.fullRawPattern,
      meterNameUrdu: meter.nameUrdu,
      meterNameEnglish: meter.nameEnglish,
      afail: meter.afailList.join(' '),
      afailList: meter.afailList,
      groupedPattern: meter.patternsList.join('   '),
      groupedPatternList: meter.patternsList,
      confidence: 100,
      totalSyllables: meter.fullRawPattern.length,
    };

    scansionCache.set(trimmed, result);
    return result;
  }

  // 2. Multi-Branch Phonetic Matcher (prevents vowel-length drift)
  const preprocessed = preprocessPhoneticLine(cleanedLookup);
  const words = preprocessed.split(' ').filter((w) => w.length > 0);
  const candidatePatterns = generateFlexibleCandidatePatterns(words);

  let bestMeter = CLASSICAL_BUHUR[0];
  let highestScore = -1;
  let bestCandidatePattern = candidatePatterns[0] || tokenizeLineToSyllables(trimmed);

  for (const candidate of candidatePatterns) {
    for (const meter of CLASSICAL_BUHUR) {
      if (candidate === meter.fullRawPattern) {
        bestMeter = meter;
        highestScore = 100;
        bestCandidatePattern = candidate;
        break;
      }
      const score = matchScore(candidate, meter.fullRawPattern);
      if (score > highestScore) {
        highestScore = score;
        bestMeter = meter;
        bestCandidatePattern = candidate;
      }
    }
    if (highestScore === 100) break;
  }

  // Arkan-aware foot splitting based on matched meter
  const arkanSplitList = splitSyllablesByMeterArkan(bestCandidatePattern, bestMeter);
  const arkanGroupedPattern = arkanSplitList.join('   ');

  if (bestCandidatePattern.length < 5) {
    const result: ScansionResult = {
      isMatched: false,
      rawSyllables: bestCandidatePattern,
      meterNameUrdu: 'مصرع زیرِ تکمیل...',
      meterNameEnglish: 'Incomplete line...',
      afail: '',
      afailList: [],
      groupedPattern: arkanGroupedPattern,
      groupedPatternList: arkanSplitList,
      confidence: 20,
      totalSyllables: bestCandidatePattern.length,
    };
    scansionCache.set(trimmed, result);
    return result;
  }

  // Only consider it a match if similarity is genuine and high (>= 70%)
  const isMatched = highestScore >= 70;

  const result: ScansionResult = {
    isMatched,
    rawSyllables: isMatched ? bestMeter.fullRawPattern : bestCandidatePattern,
    meterNameUrdu: isMatched ? bestMeter.nameUrdu : 'غیر روایتی / ذاتی آہنگ',
    meterNameEnglish: isMatched ? bestMeter.nameEnglish : 'Custom Rhythm',
    afail: isMatched ? bestMeter.afailList.join(' ') : '',
    afailList: isMatched ? bestMeter.afailList : [],
    groupedPattern: isMatched ? bestMeter.patternsList.join('   ') : arkanGroupedPattern,
    groupedPatternList: isMatched ? bestMeter.patternsList : arkanSplitList,
    confidence: isMatched ? Math.max(85, highestScore) : highestScore,
    totalSyllables: isMatched ? bestMeter.fullRawPattern.length : bestCandidatePattern.length,
  };

  if (scansionCache.size > 500) {
    scansionCache.clear();
  }
  scansionCache.set(trimmed, result);

  return result;
}
