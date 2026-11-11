import { PoeticMeter } from '../types/editor';
import { CLASSICAL_BUHUR } from './prosodyMeters';
const examples: Record<string, NonNullable<PoeticMeter['famousVerse']>> = {
  'hazaj-musamman-salim': { misra1: 'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے', misra2: 'بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے', poet: 'مرزا غالب' },
  'ramal-musamman-mahzoof': { misra1: 'نقش فریادی ہے کس کی شوخیِ تحریر کا', misra2: 'کاغذی ہے پیرہن ہر پیکرِ تصویر کا', poet: 'مرزا غالب' },
};
export const CLASSICAL_METERS: PoeticMeter[] = CLASSICAL_BUHUR.map(meter => ({
  id: meter.id, nameUrdu: meter.nameUrdu, nameEnglish: meter.nameEnglish,
  pattern: meter.afailList.join(' '), syllabicCode: meter.patternsList.join(' / '),
  description: meter.allowTerminalShort ? 'اس وزن میں آخری زائد ہجائے کوتاہ کی گنجائش ہے۔' : 'اس وزن کے آخر میں زائد ہجائے کوتاہ جائز نہیں۔',
  famousVerse: examples[meter.id],
}));
