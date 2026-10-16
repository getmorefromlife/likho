export type PoeticForm = 'ghazal' | 'nazm' | 'rubai' | 'qataa' | 'fard' | 'prose';

export interface QafiyaChip {
  id: string;
  word: string;
  isUsed: boolean;
  isManualOverride?: boolean;
}

export interface PoemMetadata {
  id: string;
  title: string;
  poet: string;
  form: PoeticForm;
  meterName?: string;
  meterRukn?: string;
  radif?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface PoemDraft extends PoemMetadata {
  content: string;
  qafiyaList: string[];
}

export interface PoeticMeter {
  id: string;
  nameUrdu: string;
  nameEnglish: string;
  pattern: string; // e.g. فعولن فعولن فعولن فعولن
  syllabicCode: string; // e.g. v - - / v - -
  description: string;
  famousVerse: {
    misra1: string;
    misra2: string;
    poet: string;
  };
}

export interface RhetoricalDevice {
  id: string;
  nameUrdu: string;
  nameEnglish: string;
  definition: string;
  sampleCouplet: {
    misra1: string;
    misra2: string;
    poet: string;
    explanation: string;
  };
}

export interface LiteraryWordLookup {
  word: string;
  meanings: string[];
  synonyms: string[];
  antonyms: string[];
  compounds: string[];
  sampleVerse?: {
    verse: string;
    poet: string;
  };
}
