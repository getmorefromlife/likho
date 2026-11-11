/**
 * Client-Side Multi-Format File Ingestion Service (ODT, TXT, CSV)
 * Extracts, cleans, strictly deduplicates, and saves user-uploaded words into IndexedDB.
 */

import { AroozLexiconService } from './aroozLexiconService';
import { cleanQafiyaWord } from './qafiyaEngine';

export interface FileIngestionReport {
  fileName: string;
  fileType: 'txt' | 'csv' | 'odt';
  totalRawWords: number;
  uniqueWords: string[];
  addedToLexicon: number;
  persisted: boolean;
  duplicateCount: number;
}

/**
 * Parses plain text files (.txt) with UTF-8 encoding
 */
export async function parseTxtFile(file: File): Promise<string[]> {
  const text = await file.text();
  return text.split(/\r?\n|\s+/).filter(Boolean);
}

/**
 * Parses CSV / TSV files, handling comma, tab, and semicolon delimiters
 */
export async function parseCsvFile(file: File): Promise<string[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/);
  const words: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    // Split by comma, tab, or semicolon
    const parts = trimmed.split(/[,;\t]/);
    for (const part of parts) {
      const clean = part.replace(/^["']|["']$/g, '').trim();
      if (clean) words.push(clean);
    }
  }

  return words;
}

/**
 * Lightweight native client-side ODT extraction:
 * Reads zip structure, decompresses content.xml via native DecompressionStream('deflate-raw'),
 * and extracts all Urdu text paragraphs via DOMParser.
 */
export async function parseOdtFile(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Search for content.xml in ZIP Local File Headers (Magic: 0x04034b50 -> 'PK\x03\x04')
  let offset = 0;
  let contentXmlText: string | null = null;

  while (offset + 30 < bytes.length) {
    // Check 'PK\x03\x04' signature
    if (
      bytes[offset] === 0x50 &&
      bytes[offset + 1] === 0x4b &&
      bytes[offset + 2] === 0x03 &&
      bytes[offset + 3] === 0x04
    ) {
      const compMethod = bytes[offset + 8] | (bytes[offset + 9] << 8);
      const compSize =
        bytes[offset + 18] |
        (bytes[offset + 19] << 8) |
        (bytes[offset + 20] << 16) |
        (bytes[offset + 21] << 24);
      const fileNameLen = bytes[offset + 26] | (bytes[offset + 27] << 8);
      const extraFieldLen = bytes[offset + 28] | (bytes[offset + 29] << 8);

      const fileNameBytes = bytes.slice(offset + 30, offset + 30 + fileNameLen);
      const fileName = new TextDecoder().decode(fileNameBytes);

      const fileDataStart = offset + 30 + fileNameLen + extraFieldLen;
      const fileDataEnd = fileDataStart + compSize;

      if (fileName === 'content.xml' && fileDataEnd <= bytes.length) {
        const compressedData = bytes.slice(fileDataStart, fileDataEnd);

        if (compMethod === 0) {
          // Uncompressed
          contentXmlText = new TextDecoder().decode(compressedData);
        } else if (compMethod === 8) {
          // Deflate compressed: decode with native DecompressionStream
          try {
            const ds = new DecompressionStream('deflate-raw');
            const writer = ds.writable.getWriter();
            writer.write(compressedData);
            writer.close();
            const response = new Response(ds.readable);
            contentXmlText = await response.text();
          } catch (e) {
            console.warn('DecompressionStream error, trying fallback:', e);
          }
        }
        break;
      }

      offset = fileDataEnd;
    } else {
      offset++;
    }
  }

  if (!contentXmlText) {
    // Fallback: search for Urdu text runs in raw bytes
    const rawText = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    const urduRuns = rawText.match(/[\u0600-\u06FF]{2,}/g) || [];
    return urduRuns;
  }

  // Parse XML text with DOMParser
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentXmlText, 'text/xml');
    const textElements = doc.querySelectorAll('p, span, text');
    const words: string[] = [];

    textElements.forEach((el) => {
      const text = el.textContent || '';
      const tokens = text.split(/\s+/).filter(Boolean);
      words.push(...tokens);
    });

    if (words.length > 0) return words;
  } catch (err) {
    console.warn('DOMParser failed on content.xml:', err);
  }

  // Fallback regex extraction on contentXmlText
  return (contentXmlText.match(/[\u0600-\u06FF]{2,}/g) || []);
}

/**
 * Universal file ingestion processor:
 * Cleans, strictly deduplicates, computes scansion, and registers into the active lexicon.
 */
export async function processFileIngestion(file: File): Promise<FileIngestionReport> {
  const name = file.name.toLowerCase();
  let rawWords: string[] = [];
  let fileType: 'txt' | 'csv' | 'odt' = 'txt';

  if (name.endsWith('.odt')) {
    fileType = 'odt';
    rawWords = await parseOdtFile(file);
  } else if (name.endsWith('.csv') || name.endsWith('.tsv')) {
    fileType = 'csv';
    rawWords = await parseCsvFile(file);
  } else {
    fileType = 'txt';
    rawWords = await parseTxtFile(file);
  }

  // STRICT DEDUPLICATION: Map of cleanWord -> originalWord
  const uniqueMap = new Map<string, string>();
  let duplicates = 0;

  for (const raw of rawWords) {
    const clean = cleanQafiyaWord(raw);
    // Keep words with at least 2 Urdu characters
    if (clean.length >= 2) {
      if (uniqueMap.has(clean)) {
        duplicates++;
      } else {
        uniqueMap.set(clean, clean);
      }
    }
  }

  const uniqueWords = Array.from(uniqueMap.keys());

  // A word list contains no pronunciation evidence. Preserve it without inventing weights.
  const registration = await AroozLexiconService.registerVocabulary(uniqueWords);

  return {
    fileName: file.name,
    fileType,
    totalRawWords: rawWords.length,
    uniqueWords,
    addedToLexicon: registration.addedCount,
    persisted: registration.persisted,
    duplicateCount: duplicates,
  };
}
