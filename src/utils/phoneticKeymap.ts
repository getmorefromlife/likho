/**
 * In-App Urdu Phonetic Keyboard Engine (CRULP / NLA Standard)
 * Enables seamless Urdu typing on standard physical QWERTY keyboards
 */

export const URDU_PHONETIC_NORMAL: Record<string, string> = {
  a: 'ا', // Alif
  b: 'ب', // Bay
  c: 'چ', // Chey
  d: 'د', // Daal
  e: 'ع', // Ain
  f: 'ف', // Fay
  g: 'گ', // Gaf
  h: 'ح', // Bari Hey
  i: 'ی', // Choti Yeh
  j: 'ج', // Jeem
  k: 'ک', // Kaaf
  l: 'ل', // Laam
  m: 'م', // Meem
  n: 'ن', // Noon
  o: 'ہ', // Gol Hey
  p: 'پ', // Pay
  q: 'ق', // Qaaf
  r: 'ر', // Ray
  s: 'س', // Seen
  t: 'ت', // Tay
  u: 'ء', // Hamza
  v: 'ط', // Toay
  w: 'و', // Waw
  x: 'ش', // Sheen
  y: 'ے', // Bari Yeh
  z: 'ز', // Zay
};

export const URDU_PHONETIC_SHIFT: Record<string, string> = {
  A: 'آ', // Alif Madda
  B: 'ؓ', // Razi-Allahu-Anhu
  C: 'ث', // Say
  D: 'ڈ', // Daal with Toye
  E: 'ؑ', // Alaihis-Salam
  F: '\u064E', // Zabar (Fatha)
  G: 'غ', // Ghain
  H: 'ھ', // Do-Chashmi Hey
  I: '\u0650', // Zer (Kasra)
  J: 'ض', // Zuaad
  K: 'خ', // Khay
  L: 'ؒ', // Rahmatullah-Alayh
  M: '\u0651', // Tashdeed
  N: 'ں', // Noon Ghunnah
  O: 'ۃ', // Teh Marbuta
  P: '\u064F', // Pesh (Damma)
  Q: '\u0652', // Jazm / Sukun
  R: 'ڑ', // Aray
  S: 'ص', // Suaad
  T: 'ٹ', // Tay with Toye
  U: 'ئ', // Hamza on Yeh
  V: 'ظ', // Zoay
  W: '\u0654', // Hamza Above
  X: 'ژ', // Zhay
  Y: 'ۓ', // Bari Yeh with Hamza
  Z: 'ذ', // Zaal
};

export const URDU_PHONETIC_PUNCTUATION: Record<string, string> = {
  '?': '؟', // Urdu Question Mark
  ',': '،', // Urdu Comma
  ';': '؛', // Urdu Semicolon
  '.': '۔', // Urdu Full Stop (Khatma)
  '-': '۔', // Urdu Full Stop / Khatma (Hyphen/Dash)
};

/**
 * Translates a physical keyboard keypress into an Urdu character based on CRULP phonetic layout
 */
export function translateKeyToUrdu(e: React.KeyboardEvent | KeyboardEvent): string | null {
  // Never intercept OS / browser shortcuts (Ctrl+C, Ctrl+V, Cmd+Z, Alt+Tab, etc.)
  if (e.ctrlKey || e.altKey || e.metaKey) {
    return null;
  }

  const key = e.key;

  // Single character check
  if (key.length !== 1) {
    return null;
  }

  // Check shifted letters (A-Z)
  if (URDU_PHONETIC_SHIFT[key]) {
    return URDU_PHONETIC_SHIFT[key];
  }

  // Check normal letters (a-z)
  if (URDU_PHONETIC_NORMAL[key]) {
    return URDU_PHONETIC_NORMAL[key];
  }

  // Check punctuation
  if (URDU_PHONETIC_PUNCTUATION[key]) {
    return URDU_PHONETIC_PUNCTUATION[key];
  }

  return null;
}

export interface PhoneticKeyInfo {
  normalKey: string;
  normalUrdu: string;
  shiftKey: string;
  shiftUrdu: string;
}

/**
 * Key cheat-sheet entries ordered by QWERTY keyboard layout
 */
export const PHONETIC_KEYBOARD_LAYOUT: PhoneticKeyInfo[][] = [
  // Top Row (QWERTY)
  [
    { normalKey: 'q', normalUrdu: 'ق', shiftKey: 'Q', shiftUrdu: 'ْ (جزم)' },
    { normalKey: 'w', normalUrdu: 'و', shiftKey: 'W', shiftUrdu: 'ٔ (ہمزہ)' },
    { normalKey: 'e', normalUrdu: 'ع', shiftKey: 'E', shiftUrdu: 'ؑ (علیہ السلام)' },
    { normalKey: 'r', normalUrdu: 'ر', shiftKey: 'R', shiftUrdu: 'ڑ' },
    { normalKey: 't', normalUrdu: 'ت', shiftKey: 'T', shiftUrdu: 'ٹ' },
    { normalKey: 'y', normalUrdu: 'ے', shiftKey: 'Y', shiftUrdu: 'ۓ' },
    { normalKey: 'u', normalUrdu: 'ء', shiftKey: 'U', shiftUrdu: 'ئ' },
    { normalKey: 'i', normalUrdu: 'ی', shiftKey: 'I', shiftUrdu: 'ِ (زیر)' },
    { normalKey: 'o', normalUrdu: 'ہ', shiftKey: 'O', shiftUrdu: 'ۃ' },
    { normalKey: 'p', normalUrdu: 'پ', shiftKey: 'P', shiftUrdu: 'ُ (پیش)' },
  ],
  // Middle Row (ASDFGHJKL)
  [
    { normalKey: 'a', normalUrdu: 'ا', shiftKey: 'A', shiftUrdu: 'آ' },
    { normalKey: 's', normalUrdu: 'س', shiftKey: 'S', shiftUrdu: 'ص' },
    { normalKey: 'd', normalUrdu: 'د', shiftKey: 'D', shiftUrdu: 'ڈ' },
    { normalKey: 'f', normalUrdu: 'ف', shiftKey: 'F', shiftUrdu: 'َ (زبر)' },
    { normalKey: 'g', normalUrdu: 'گ', shiftKey: 'G', shiftUrdu: 'غ' },
    { normalKey: 'h', normalUrdu: 'ح', shiftKey: 'H', shiftUrdu: 'ھ' },
    { normalKey: 'j', normalUrdu: 'ج', shiftKey: 'J', shiftUrdu: 'ض' },
    { normalKey: 'k', normalUrdu: 'ک', shiftKey: 'K', shiftUrdu: 'خ' },
    { normalKey: 'l', normalUrdu: 'ل', shiftKey: 'L', shiftUrdu: 'ؒ' },
  ],
  // Bottom Row (ZXCVBNM)
  [
    { normalKey: 'z', normalUrdu: 'ز', shiftKey: 'Z', shiftUrdu: 'ذ' },
    { normalKey: 'x', normalUrdu: 'ش', shiftKey: 'X', shiftUrdu: 'ژ' },
    { normalKey: 'c', normalUrdu: 'چ', shiftKey: 'C', shiftUrdu: 'ث' },
    { normalKey: 'v', normalUrdu: 'ط', shiftKey: 'V', shiftUrdu: 'ظ' },
    { normalKey: 'b', normalUrdu: 'ب', shiftKey: 'B', shiftUrdu: 'ؓ' },
    { normalKey: 'n', normalUrdu: 'ن', shiftKey: 'N', shiftUrdu: 'ں' },
    { normalKey: 'm', normalUrdu: 'م', shiftKey: 'M', shiftUrdu: 'ّ (تشدید)' },
  ],
];
