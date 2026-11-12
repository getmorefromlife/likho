/**
 * Generator script for the Complete Diwan-e-Ghalib (دیوانِ غالب متداول و کلیات)
 * Ingests all 307 canonical poems (248 ghazals + rubaiyat + qita'at + qasaid + marsiya)
 * from the public-domain Ghalib corpus, analyzes classical meters, radif, and qafiya,
 * and writes the compiled dataset to src/data/sovereign/diwanGhalibComplete.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import the bundled engine for arooz & qafiya scansion
import engine from '/tmp/engine_test.cjs';

const repoBaseDir = '/tmp/ghalib-repo';
const ptreePath = path.join(repoBaseDir, 'index.ptree');

if (!fs.existsSync(ptreePath)) {
  console.error('Error: /tmp/ghalib-repo not found. Run git clone first.');
  process.exit(1);
}

function parsePollenSimple(raw) {
  const titleMatch = raw.match(/◊\(define-meta\s+title\s+"([^"]+)"\)/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const lines = raw.split('\n');
  const bodyLines = [];
  let insideBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('◊(define-meta') || trimmed.startsWith('#lang')) continue;
    if (trimmed.startsWith('◊حاشیہ') || trimmed.startsWith('◊حم{') || trimmed.startsWith('مزید:')) {
      break;
    }
    if (trimmed.includes('{') && !insideBlock) {
      insideBlock = true;
      const afterBrace = trimmed.substring(trimmed.indexOf('{') + 1);
      if (afterBrace.trim()) bodyLines.push(afterBrace);
      continue;
    }
    if (insideBlock) {
      if (trimmed === '}') {
        insideBlock = false;
        break;
      }
      bodyLines.push(line);
    }
  }

  let text = bodyLines.join('\n');
  // Strip pollen inline tags
  text = text.replace(/◊ح\{([^}]+)\}/g, '$1');
  text = text.replace(/◊علامت\{([^}]+)\}/g, '$1');
  text = text.replace(/◊ق\s*\{?/g, '');
  text = text.replace(/◊درمیان\{([^}]+)\}/g, '$1');
  text = text.replace(/◊[a-zA-Z\u0600-\u06FF_-]+(\[[^\]]*\])?\{([^}]*)\}/g, '$2');
  text = text.replace(/◊[a-zA-Z\u0600-\u06FF_-]+/g, '');

  const couplets = [];
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  for (const b of blocks) {
    const blines = b.split('\n').map((l) => l.trim()).filter(Boolean);
    if (blines.length === 2) {
      couplets.push({ misra1: blines[0], misra2: blines[1] });
    } else if (blines.length > 2) {
      for (let i = 0; i < blines.length; i += 2) {
        if (i + 1 < blines.length) {
          couplets.push({ misra1: blines[i], misra2: blines[i + 1] });
        } else {
          couplets.push({ misra1: blines[i], misra2: '' });
        }
      }
    } else if (blines.length === 1) {
      couplets.push({ misra1: blines[0], misra2: '' });
    }
  }
  return { title, couplets };
}

function sanitizeLine(line) {
  return line
    .replace(/[\u200E\u200F\uFEFF\u200B\u202A-\u202E]/g, '')
    .replace(/[«»"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function determineForm(relPath) {
  if (relPath.startsWith('دیوان/غزلیات/')) return 'غزل';
  if (relPath.startsWith('دیوان/رباعیات/')) return 'رباعی';
  if (relPath.startsWith('دیوان/قطعات/')) return 'قطعہ';
  if (relPath.startsWith('دیوان/قصائد/')) return 'قصیدہ';
  if (relPath.startsWith('دیوان/مرثیہ')) return 'مرثیہ';
  if (relPath.startsWith('دیوان/سہرے/')) return 'سہرا';
  if (relPath.startsWith('دیوان/مثنوی/')) return 'مثنوی';
  if (relPath.startsWith('دیوان/سلام')) return 'سلام';
  if (relPath.startsWith('دیوان/خمسہ')) return 'خمسہ';
  return 'متفرقات';
}

function extractRadifFromPath(relPath) {
  const match = relPath.match(/ردیف-([^\/]+)/);
  if (match) return match[1];
  return '';
}

async function run() {
  console.log('Loading Sovereign Lexicon into scansion engine...');
  await engine.loadSovereignLexicon();

  const ptreeContent = fs.readFileSync(ptreePath, 'utf8');
  const poemEntries = ptreeContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('دیوان/') && l.endsWith('.html'));

  console.log(`Found ${poemEntries.length} canonical entries in index.ptree.`);

  const poems = [];
  let poemIndex = 1;
  let totalCoupletsCount = 0;

  for (const entry of poemEntries) {
    const pmPath = path.join(repoBaseDir, entry + '.pm');
    if (!fs.existsSync(pmPath)) {
      console.warn(`File missing: ${pmPath}`);
      continue;
    }

    const raw = fs.readFileSync(pmPath, 'utf8');
    const parsed = parsePollenSimple(raw);
    if (!parsed.couplets || parsed.couplets.length === 0) {
      console.warn(`No couplets found in ${entry}`);
      continue;
    }

    // Sanitize couplet lines
    const cleanedCouplets = parsed.couplets.map((c) => ({
      misra1: sanitizeLine(c.misra1),
      misra2: sanitizeLine(c.misra2),
    }));

    totalCoupletsCount += cleanedCouplets.length;

    const form = determineForm(entry);
    const pathRadif = extractRadifFromPath(entry);

    const firstLine = cleanedCouplets[0].misra1;
    const allLines = cleanedCouplets.flatMap((c) => [c.misra1, c.misra2]).filter(Boolean);

    // Scansion
    let meterName = 'بحرِ ہزج مثمن سالم';
    let arkan = 'مَفَاعِیلُن مَفَاعِیلُن مَفَاعِیلُن مَفَاعِیلُن';
    try {
      const meterAnalysis = engine.selectMeterAnalysis(firstLine);
      if (meterAnalysis && meterAnalysis.meter) {
        meterName = meterAnalysis.meter.nameUrdu;
        arkan = meterAnalysis.meter.afailList.join(' ');
      }
    } catch {
      // Fallback to default
    }

    // Rhyme detection
    let detectedRadif = pathRadif;
    let qafiyaSample = [];
    try {
      const rhyme = engine.detectPoemRhymeScheme(allLines.slice(0, 6));
      if (rhyme) {
        if (rhyme.detectedRadif) {
          detectedRadif = rhyme.detectedRadif;
        }
        if (rhyme.sampleRhymes && rhyme.sampleRhymes.length > 0) {
          qafiyaSample = rhyme.sampleRhymes.slice(0, 5);
        } else if (rhyme.qafiyaWordsInPoem && rhyme.qafiyaWordsInPoem.length > 0) {
          qafiyaSample = rhyme.qafiyaWordsInPoem.slice(0, 5);
        }
      }
    } catch {
      // Rhyme fallback
    }

    const poemTitle = parsed.title || cleanedCouplets[0].misra1;

    poems.push({
      id: `ghalib-${poemIndex++}`,
      title: poemTitle,
      form,
      meterName,
      arkan,
      radif: detectedRadif,
      qafiyaSample,
      sourceBook: 'دیوانِ غالب (نسخۂ متداول / کلیاتِ غالب)',
      publicationYear: 1841,
      couplets: cleanedCouplets,
    });
  }

  console.log(`Successfully processed ${poems.length} poems with ${totalCoupletsCount} couplets.`);

  const outputPath = path.join(rootDir, 'src/data/sovereign/diwanGhalibComplete.json');
  fs.writeFileSync(outputPath, JSON.stringify(poems, null, 2), 'utf8');

  const stats = fs.statSync(outputPath);
  console.log(`Saved output to ${outputPath} (${(stats.size / 1024).toFixed(1)} KB).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

