/**
 * Meter Reference Atlas Data Model (اطلسِ بحور و حوالہ جات)
 *
 * Reconciles all 50 named meter forms from CLASSICAL_BUHUR by stable ID,
 * distinguishing metrical families (بحور) and the 12 rubai forms (اوزانِ رباعی),
 * and provides the complete Phase B exemplar reference entry for
 * `ramal-musamman-mahzoof` (بحرِ رمل مثمن محذوف).
 *
 * Review status is explicitly tracked so draft/source-checked material is never
 * misrepresented as independently adjudicated or certified.
 */

import { CLASSICAL_BUHUR, ClassicalMeterDef } from './prosodyMeters';

export type ContentReviewStage =
  | 'catalog-only'
  | 'draft-prototype'
  | 'source-checked'
  | 'poet-reviewed'
  | 'teaching-ready';

export const REVIEW_STAGE_LABELS: Record<ContentReviewStage, string> = {
  'catalog-only': 'فہرست میں شامل — تفصیلی مضمون زیرِ تیاری',
  'draft-prototype': 'ابتدائی تعلیمی مسودہ — علمی نظرثانی باقی',
  'source-checked': 'ماخذ سے اخذ شدہ مسودہ — علمی و شعری نظرثانی باقی',
  'poet-reviewed': 'شاعر کی نظرثانی شدہ — آزاد علمی تصدیق باقی',
  'teaching-ready': 'تدریس کے لیے منظور شدہ',
};

export interface SynchronizedWordLayer {
  word: string;
  pronunciation: string;
  syllableParts: string[];
  pattern: string;
  ruleExplanationUrdu: string;
}

export interface SynchronizedFootLayer {
  ruknIndex: number;
  ruknName: string;
  pattern: string;
  syllableSliceUrdu: string;
  boundaryNoteUrdu: string;
}

export interface WorkedVerseExample {
  id: string;
  misra1: string;
  misra2: string;
  poet: string;
  sourceCitation: string;
  rightsStatus: string;
  reviewStage: ContentReviewStage;
  wordsMisra1: SynchronizedWordLayer[];
  feetMisra1: SynchronizedFootLayer[];
}

export interface CounterExampleMutation {
  constructedLine: string;
  labelUrdu: string;
  changedSegment: string;
  brokenFootIndex: number;
  expectedFootPattern: string;
  actualFootPattern: string;
  explanationUrdu: string;
}

export interface NeighboringFormComparison {
  meterId: string;
  nameUrdu: string;
  patternSummary: string;
  differenceExplanationUrdu: string;
}

export interface MeterPracticeExercise {
  id: string;
  promptUrdu: string;
  verseLine: string;
  poet: string;
  sourceCitation: string;
  questionUrdu: string;
  options: {
    label: string;
    isCorrect: boolean;
    feedbackUrdu: string;
  }[];
  hintLadderUrdu: string[];
}

export interface MeterAtlasEntry {
  id: string;
  nameUrdu: string;
  nameEnglish: string;
  familyUrdu: string;
  isRubai: boolean;
  afailList: string[];
  patternsList: string[];
  fullRawPattern: string;
  sourceCitation: string;
  allowTerminalShort: boolean;
  initialFlexible: boolean;
  caesuraAfter?: number;
  reviewStage: ContentReviewStage;
  overviewUrdu: string;
  licensesAndConditionsUrdu: string[];
  workedExample?: WorkedVerseExample;
  counterExample?: CounterExampleMutation;
  neighborComparisons?: NeighboringFormComparison[];
  practiceExercise?: MeterPracticeExercise;
}

function inferMeterFamilyUrdu(meter: ClassicalMeterDef): { familyUrdu: string; isRubai: boolean } {
  if (meter.id.startsWith('rubai-')) {
    return { familyUrdu: 'اوزانِ رباعی (ہزج کے مخصوص اوزان)', isRubai: true };
  }
  const prefix = meter.id.split('-')[0];
  const familyMap: Record<string, string> = {
    ramal: 'خاندانِ بحرِ رمل',
    hazaj: 'خاندانِ بحرِ ہزج',
    mutaqarib: 'خاندانِ بحرِ متقارب',
    mutadarak: 'خاندانِ بحرِ متدارک',
    rajaz: 'خاندانِ بحرِ رجز',
    muzara: 'خاندانِ بحرِ مضارع',
    mujtas: 'خاندانِ بحرِ مجتث',
    khafeef: 'خاندانِ بحرِ خفیف',
    kamil: 'خاندانِ بحرِ کامل',
    munsareh: 'خاندانِ بحرِ منسرح',
    saree: 'خاندانِ بحرِ سریع',
  };
  return {
    familyUrdu: familyMap[prefix] || 'کلاسیکی بحر',
    isRubai: false,
  };
}

function formatHandbookSourceCitation(sourceCode: string): string {
  if (sourceCode.startsWith('handbook:6.1:')) {
    const idx = sourceCode.split(':').at(-1);
    return `Pritchett & Khaliq, Urdu Meter: A Practical Handbook, §6.1 (جدولِ بحور، نمبر ${idx})`;
  }
  if (sourceCode.startsWith('handbook:6.3:rubai:')) {
    const idx = sourceCode.split(':').at(-1);
    return `Pritchett & Khaliq, Urdu Meter: A Practical Handbook, §6.3 (اوزانِ رباعی، نمبر ${idx})`;
  }
  if (sourceCode === 'handbook:6.2:mutadarak') {
    return 'Pritchett & Khaliq, Urdu Meter: A Practical Handbook, §6.2 (متدارک مثمن مقطوع محذوف)';
  }
  return sourceCode;
}

const RAMAL_MUSAMMAN_MAHZOOF_ARTICLE: Partial<MeterAtlasEntry> = {
  reviewStage: 'source-checked',
  overviewUrdu:
    'بحرِ رمل مثمن محذوف اردو غزل اور نظم کی نمایاں ترین بحروں میں سے ہے۔ اس میں ایک مصرعے کے اندر چار ارکان ہوتے ہیں: پہلے تین ارکان سالم «فَاعِلَاتُن» (=-==) اور چوتھا آخری رکن محذوف ہو کر «فَاعِلُن» (=-=) آتا ہے۔',
  licensesAndConditionsUrdu: [
    'ہر مصرعے میں کل ۱۵ ہجے (پہلے تین ارکان میں ۴، ۴ ہجے اور آخری رکن میں ۳ ہجے) ہوتے ہیں۔',
    'تسبیغ / زائد ہجائے کوتاہ (Terminal Short): اس وزن میں مصرعے کے بالکل آخر میں ایک زائد ہجائے کوتاہ (-) کی گنجائش موجود ہے (جیسے آخری رکن فَاعِلُن =-= کے بعد ایک ساکن حرف کا اضافہ ہو کر فَاعِلَان =-=- بننا)۔',
    'اس بحر میں پہلے ہجے کی تخفیف (خَبن: فَاعِلَاتُن کو فَعِلَاتُن کرنا) جائز نہیں؛ وہ بحرِ رمل مثمن مخبون کا الگ وزن ہے۔',
  ],
  workedExample: {
    id: 'ghalib-1-1-matla',
    misra1: 'نقش فریادی ہے کس کی شوخیِ تحریر کا',
    misra2: 'کاغذی ہے پیرہن ہر پیکرِ تصویر کا',
    poet: 'مرزا اسد اللہ خاں غالب',
    sourceCitation:
      'دیوانِ غالب (نسخۂ حمیدیہ / ویکی ماخذ، نظرثانی 197184) · Pritchett, Ghalib 1.1',
    rightsStatus: 'عوامی ملکیت (Public Domain)',
    reviewStage: 'source-checked',
    wordsMisra1: [
      {
        word: 'نقش',
        pronunciation: 'نَقْش',
        syllableParts: ['نَق', 'ش'],
        pattern: '=-',
        ruleExplanationUrdu:
          'پہلا ہجا «نَق» بند بھاری (=) ہے؛ آخر میں دو ساکن حروف (ق، ش) جمع ہونے کی وجہ سے «ش» ہجائے کوتاہ (-) شمار ہوتا ہے۔',
      },
      {
        word: 'فریادی',
        pronunciation: 'فَرْیَادِی',
        syllableParts: ['فَر', 'یا', 'دی'],
        pattern: '===',
        ruleExplanationUrdu:
          'تینوں ہجے بھاری (===) ہیں: «فَر» (بند ہجا)، «یا» (الفِ ممدودہ)، اور «دی» (یائے معروف، یہاں اشباع برقرار رہتا ہے)۔',
      },
      {
        word: 'ہے',
        pronunciation: 'ہَے',
        syllableParts: ['ہے'],
        pattern: '-',
        ruleExplanationUrdu:
          'یک ہجائی لفظ «ہے» میں یائے مجہول کی جائز تخفیف سے یہاں ہلکا وزن (-) لیا گیا ہے۔',
      },
      {
        word: 'کس',
        pronunciation: 'کِس',
        syllableParts: ['کِس'],
        pattern: '=',
        ruleExplanationUrdu: 'حرفِ صحیح + مختصر مصوتہ + ساکن حرف (CVC) = بھاری ہجا (=)۔',
      },
      {
        word: 'کی',
        pronunciation: 'کِی',
        syllableParts: ['کی'],
        pattern: '=',
        ruleExplanationUrdu:
          'یک ہجائی حرفِ اضافت «کی» یہاں اپنے پورے معیاری بھاری وزن (=) پر قائم ہے۔',
      },
      {
        word: 'شوخیِ',
        pronunciation: 'شَوخِیِ',
        syllableParts: ['شو', 'خِ', 'یِ'],
        pattern: '=--',
        ruleExplanationUrdu:
          'یائے آخر کے ساتھ زیرِ اضافت (شوخیِ تحریر) کی وجہ سے «خی» کا لمبا مصوتہ ہلکا ہو کر دو کوتاہ ہجوں (- -) میں ڈھل گیا۔',
      },
      {
        word: 'تحریر',
        pronunciation: 'تَحْرِیر',
        syllableParts: ['تَح', 'ری', 'ر'],
        pattern: '==-',
        ruleExplanationUrdu:
          '«تَح» (=)، «ری» (=)، اور لمبے مصوتے کے بعد آخری ساکن «ر» ہجائے کوتاہ (-) ہے۔',
      },
      {
        word: 'کا',
        pronunciation: 'کَا',
        syllableParts: ['کا'],
        pattern: '=',
        ruleExplanationUrdu: 'مصرعے کے آخر میں الف پر ختم ہونے والا بھاری ہجا (=)۔',
      },
    ],
    feetMisra1: [
      {
        ruknIndex: 1,
        ruknName: 'فَاعِلَاتُن',
        pattern: '=-==',
        syllableSliceUrdu: 'نَق (=) · ش (-) · فَر (=) · یا (=)',
        boundaryNoteUrdu:
          'پہلا رکن لفظ «فریادی» کے درمیان مکمل ہوتا ہے؛ آخری ہجا «دی» اگلے رکن کا آغاز کرتا ہے۔',
      },
      {
        ruknIndex: 2,
        ruknName: 'فَاعِلَاتُن',
        pattern: '=-==',
        syllableSliceUrdu: 'دی (=) · ہے (-) · کِس (=) · کی (=)',
        boundaryNoteUrdu:
          '«فریادی» کا آخری ہجا «دی» دوسرے رکن کا پہلا بھاری ہجا بنتا ہے، اور «ہے» تخفیف کے ساتھ ہلکا (-) آتا ہے۔',
      },
      {
        ruknIndex: 3,
        ruknName: 'فَاعِلَاتُن',
        pattern: '=-==',
        syllableSliceUrdu: 'شو (=) · خِ (-) · یِ (=؟ نہیں: یِ تَح) → شو (=) · خِ (-) · یِے/تَح (=) · ری (=)',
        boundaryNoteUrdu:
          'لفظ «شوخیِ» میں اضافت کی قرأت (= - =) یا «تَحریر» کے ساتھ مل کر تیسرا رکن «فَاعِلَاتُن» (=-==) مکمل ہوتا ہے۔',
      },
      {
        ruknIndex: 4,
        ruknName: 'فَاعِلُن',
        pattern: '=-=',
        syllableSliceUrdu: 'ری (=) · ر (-) · کا (=)',
        boundaryNoteUrdu:
          'آخری رکن «فَاعِلُن» (=-=) میں «تحریر» کا «ری» (=) اور «ر» (-) جمع «کا» (=) آتے ہیں۔',
      },
    ],
  },
  counterExample: {
    constructedLine: 'نقش فریادی ہے کس کی شوخی تحریر کا',
    labelUrdu: 'منفی تعلیمی تغیر (فرضی غیر موزوں صورت — اضافت کے بغیر)',
    changedSegment: 'شوخی تحریر (بغیر زیرِ اضافت)',
    brokenFootIndex: 3,
    expectedFootPattern: '=-==',
    actualFootPattern: '===',
    explanationUrdu:
      'اگر «شوخیِ تحریر» میں «شوخی» کے نیچے زیرِ اضافت نہ ہو تو «شوخی» کا وزن «==» رہتا ہے اور تیسرا رکن «فَاعِلَاتُن» (=-==) کے درمیانی ہلکے ہجے (-) سے محروم ہو کر وزن سے خارج ہو جاتا ہے۔',
  },
  neighborComparisons: [
    {
      meterId: 'ramal-musaddas-mahzoof',
      nameUrdu: 'بحرِ رمل مسدس محذوف',
      patternSummary: 'فَاعِلَاتُن فَاعِلَاتُن فَاعِلُن (=-== / =-== / =-=)',
      differenceExplanationUrdu:
        'مثمن میں ایک مصرعے کے اندر ۴ ارکان ہوتے ہیں، جب کہ مسدس میں ۳ ارکان (دو بار فَاعِلَاتُن اور آخر میں فَاعِلُن) ہوتے ہیں۔',
    },
    {
      meterId: 'ramal-musamman-makhboon-mahzoof',
      nameUrdu: 'بحرِ رمل مثمن مخبون محذوف',
      patternSummary: 'فَاعِلَاتُن فَعِلَاتُن فَعِلَاتُن فَعِلُن (=-== / --== / --== / --=)',
      differenceExplanationUrdu:
        'سالم رمل میں ہر رکن کا پہلا ہجا بھاری (=) ہوتا ہے، جب کہ مخبون میں پہلے کے بعد آنے والے ارکان دو ہلکے ہجوں (--) سے شروع ہوتے ہیں۔',
    },
  ],
  practiceExercise: {
    id: 'ramal-practice-1',
    promptUrdu:
      'ذیل کے مصرعے کو غور سے پڑھیں اور پہلے خود اس کے ارکان اور وزن پر غور کریں (جواب پہلے سے ظاہر نہیں کیا گیا):',
    verseLine: 'کاغذی ہے پیرہن ہر پیکرِ تصویر کا',
    poet: 'مرزا غالب',
    sourceCitation: 'دیوانِ غالب · Pritchett 1.1',
    questionUrdu:
      'اس مصرعے کے پہلے رکن «فَاعِلَاتُن» (=-==) میں کون سے الفاظ یا ہجے شامل ہوتے ہیں؟',
    options: [
      {
        label: 'صرف لفظ «کاغذی» (کا · غَ · ذی = तीन ہجے)',
        isCorrect: false,
        feedbackUrdu:
          'غور کریں: «کاغذی» کا وزن «=-=» (کا =، غَ -، ذی =) ہے جو تین ہجے ہیں، جب کہ پہلے رکن «فَاعِلَاتُن» (=-==) کے لیے چوتھا بھاری ہجا (=) بھی درکار ہے۔',
      },
      {
        label: 'لفظ «کاغذی» (=-=) اور لفظ «ہے» (=) مل کر «فَاعِلَاتُن» (=-==) بناتے ہیں',
        isCorrect: true,
        feedbackUrdu:
          'بالکل درست! «کاغذی» کے تین ہجے (کا =، غَ -، ذی =) اور اس کے بعد «ہے» کا بھاری ہجا (=) مل کر پہلا رکن «فَاعِلَاتُن» (=-==) مکمل کرتے ہیں۔',
      },
      {
        label: '«کاغذی ہے پیرہن» پورا پہلے رکن میں آتا ہے',
        isCorrect: false,
        feedbackUrdu:
          'نہیں: «پیرہن» کے ہجے دوسرے رکن «فَاعِلَاتُن» میں شامل ہوتے ہیں، کیونکہ پہلا رکن چوتھے ہجے («ہے») پر مکمل ہو جاتا ہے۔',
      },
    ],
    hintLadderUrdu: [
      'اشارہ ۱ (توجہ کا مقام): پہلے لفظ «کاغذی» کے ہجے الگ کریں: کا · غَ · ذی۔',
      'اشارہ ۲ (اصول): رکن «فَاعِلَاتُن» میں چار ہجے (=-==) ہوتے ہیں۔ عروض میں رکن کی سرحد اور لفظ کی سرحد کا ایک ہونا ضروری نہیں۔',
    ],
  },
};

export const METER_REFERENCE_ATLAS: MeterAtlasEntry[] = CLASSICAL_BUHUR.map((meter) => {
  const { familyUrdu, isRubai } = inferMeterFamilyUrdu(meter);
  const baseEntry: MeterAtlasEntry = {
    id: meter.id,
    nameUrdu: meter.nameUrdu,
    nameEnglish: meter.nameEnglish,
    familyUrdu,
    isRubai,
    afailList: meter.afailList,
    patternsList: meter.patternsList,
    fullRawPattern: meter.fullRawPattern,
    sourceCitation: formatHandbookSourceCitation(meter.source),
    allowTerminalShort: meter.allowTerminalShort,
    initialFlexible: Boolean(meter.initialFlexible),
    caesuraAfter: meter.caesuraAfter,
    reviewStage: 'catalog-only',
    overviewUrdu: `${meter.nameUrdu} (${familyUrdu}) میں ${meter.afailList.length} ارکان شامل ہیں: ${meter.afailList.join(' · ')}۔`,
    licensesAndConditionsUrdu: [
      meter.allowTerminalShort
        ? 'اس وزن کے آخر میں ایک زائد ہجائے کوتاہ (-) کی گنجائش موجود ہے۔'
        : 'اس وزن کے آخر میں زائد ہجائے کوتاہ جائز نہیں۔',
      ...(meter.initialFlexible
        ? ['اس وزن کے پہلے رکن کے ابتدائی بھاری ہجے (=) کی جگہ ہلکا ہجا (-) لانے کی گنجائش ہے۔']
        : []),
      ...(meter.caesuraAfter
        ? [`اس وزن میں رکن نمبر ${meter.caesuraAfter} کے اختتام پر لفظ کی سرحد کے ساتھ وقفے (Caesura) کی گنجائش ہے۔`]
        : []),
    ],
  };

  if (meter.id === 'ramal-musamman-mahzoof') {
    return {
      ...baseEntry,
      ...RAMAL_MUSAMMAN_MAHZOOF_ARTICLE,
    };
  }

  return baseEntry;
});

export function getMeterAtlasEntry(meterId: string): MeterAtlasEntry | undefined {
  return METER_REFERENCE_ATLAS.find((m) => m.id === meterId);
}

