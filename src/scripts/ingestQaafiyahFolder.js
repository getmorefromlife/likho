import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QAAFIYAH_DIR = path.resolve(__dirname, '../../qaafiyah 2');
const WITH_HELP_DIR = path.resolve(__dirname, '../../dictionaryqaafiya app/Qaafiyah Expert 1.1_WithHelpFile');
const URDU_DICT_PATH = path.resolve(WITH_HELP_DIR, 'Urdu_Dict.txt');
const FARSI_DIR = path.resolve(WITH_HELP_DIR, 'FARSI QAAFIYEH');
const VOCABULARY_PATH = path.resolve(__dirname, '../data/qaafiyahVocabulary.json');

// Normalizer helpers
function cleanWord(word) {
  if (!word) return '';
  return word
    .replace(/[\u200B-\u200F\uFEFF]/g, '') // remove zero-width
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // remove diacritics & honorifics
    .replace(/[0-9\u0660-\u0669\u06F0-\u06F9]/g, '') // remove numbers
    .replace(/ك/g, 'ک')
    .replace(/[يی]/g, 'ی')
    .replace(/ه/g, 'ہ')
    .replace(/[^\u0600-\u06FF\s\-]/g, '') // keep only Urdu characters
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFromOdt(filePath) {
  try {
    const pyScript = `
import zipfile, xml.etree.ElementTree as ET, sys
try:
    with zipfile.ZipFile(sys.argv[1], 'r') as z:
        content = z.read('content.xml')
        tree = ET.fromstring(content)
        texts = [elem.text for elem in tree.iter() if elem.text]
        print(' '.join(texts))
except Exception as e:
    pass
`;
    const output = execFileSync('python3', ['-c', pyScript, filePath], {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return output.split(/\s+/).filter(Boolean);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return [];
  }
}

function extractFromTxt(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split(/\r?\n|\s+/).filter(Boolean);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return [];
  }
}

function runIngestion() {
  console.log('🚀 Starting strictly deduplicated ingestion of Qaafiyah Expert 1.1 master Urdu_Dict.txt + exported folders...');

  const uniqueWordsMap = new Map();
  let txtCount = 0;
  let odtCount = 0;
  let totalRawCount = 0;
  let masterDictCount = 0;

  // 1. Ingest Master Urdu_Dict.txt (UTF-16LE) if present
  if (fs.existsSync(URDU_DICT_PATH)) {
    const rawBuf = fs.readFileSync(URDU_DICT_PATH);
    const text = rawBuf.toString('utf16le').replace(/^\uFEFF/, '');
    const lines = text.split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#LID'));
    masterDictCount = lines.length;
    totalRawCount += lines.length;
    for (const line of lines) {
      // Split compound lines into individual lexical tokens so every rhyme word is single-token clean
      const tokens = line.split(/\s+/).filter(Boolean);
      for (const tok of tokens) {
        const cleaned = cleanWord(tok);
        if (cleaned.length >= 2 && !cleaned.includes(' ') && !uniqueWordsMap.has(cleaned)) {
          uniqueWordsMap.set(cleaned, tok.trim());
        }
      }
    }
  }

  // 2. Scan exported .txt and .odt files across qaafiyah 2, WithHelpFile, and FARSI QAAFIYEH
  const scanDirs = [QAAFIYAH_DIR, WITH_HELP_DIR, FARSI_DIR].filter((d) => fs.existsSync(d));

  for (const dir of scanDirs) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f === 'Urdu_Dict.txt' || f.startsWith('.')) continue;
      const fullPath = path.join(dir, f);
      if (!fs.statSync(fullPath).isFile()) continue;

      let words = [];
      if (f.endsWith('.txt')) {
        txtCount++;
        words = extractFromTxt(fullPath);
      } else if (f.endsWith('.odt')) {
        odtCount++;
        words = extractFromOdt(fullPath);
      } else {
        continue;
      }

      totalRawCount += words.length;
      for (const raw of words) {
        const cleaned = cleanWord(raw);
        if (cleaned.length >= 2 && !cleaned.includes(' ') && !uniqueWordsMap.has(cleaned)) {
          uniqueWordsMap.set(cleaned, raw.trim());
        }
      }
    }
  }

  console.log(`\n📊 Extraction Statistics:`);
  console.log(`  - Master Urdu_Dict.txt lines scanned: ${masterDictCount}`);
  console.log(`  - Exported TXT files scanned: ${txtCount}`);
  console.log(`  - Exported ODT files scanned: ${odtCount}`);
  console.log(`  - Total raw words encountered: ${totalRawCount}`);
  console.log(`  - Strictly deduplicated unique words: ${uniqueWordsMap.size}`);

  // A word list supplies vocabulary, never pronunciation evidence.
  fs.writeFileSync(VOCABULARY_PATH, JSON.stringify([...uniqueWordsMap.keys()].sort(), null, 2), 'utf-8');
  console.log(`Saved ${uniqueWordsMap.size} unweighted vocabulary entries. Source dictionary weights were not changed.`);
}

runIngestion();
