#!/usr/bin/env node
/**
 * Continuous Improvement: Merge Poet Scansion Corrections into Sovereign Lexicon
 *
 * Usage:
 *   node scripts/merge-corrections.mjs [path-to-corrections.json]
 *
 * Reads exported user/poet pronunciation proposals (or manual correction lists),
 * validates the scansion patterns, updates `src/data/sovereign/sovereign-scansion.json`,
 * and recomputes the SHA-256 checksum and metadata in `sovereign-metadata.json`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SCANSION_FILE = path.join(rootDir, 'src', 'data', 'sovereign', 'sovereign-scansion.json');
const METADATA_FILE = path.join(rootDir, 'src', 'data', 'sovereign', 'sovereign-metadata.json');

// Find input file
let inputFile = process.argv[2];
if (!inputFile) {
  // Check for common default files in root
  const candidates = [
    path.join(rootDir, 'likho-corrections.json'),
    path.join(rootDir, 'corrections.json'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      inputFile = c;
      break;
    }
  }
}

if (!inputFile || !fs.existsSync(inputFile)) {
  console.log(`
ℹ️  طریقہ استعمال (Usage):
   node scripts/merge-corrections.mjs <فائل کا راستہ / path-to-corrections.json>

مثال:
   node scripts/merge-corrections.mjs likho-corrections-2026-11-12.json

فارمیٹ (Accepted Formats):
   1. Likho Studio Export JSON:
      {
        "schemaVersion": 3,
        "reviewedProposals": {
          "لفظ": { "word": "لفظ", "pattern": "=-", "vocalized": "لَفْظ", "status": "approved" }
        }
      }
   2. Array of Corrections:
      [
        { "word": "لفظ", "pattern": "=-", "vocalized": "لَفْظ" }
      ]
   3. Key-Value mapping:
      {
        "لفظ": "=-"
      }
`);
  process.exit(0);
}

console.log(`📖 Reading corrections from: ${inputFile}`);
const rawInput = fs.readFileSync(inputFile, 'utf-8');
const parsed = JSON.parse(rawInput);

/**
 * Standardize extracted items to array of { word, pattern, vocalized, notes }
 */
const corrections = [];

if (Array.isArray(parsed)) {
  for (const item of parsed) {
    if (item && typeof item === 'object' && item.word && item.pattern) {
      corrections.push({
        word: String(item.word).trim(),
        pattern: String(item.pattern).trim().replace(/\s+/g, ''),
        vocalized: item.vocalized ? String(item.vocalized).trim() : String(item.word).trim(),
        notes: item.notes || 'شاعر کی تصدیق شدہ قرأت',
      });
    }
  }
} else if (parsed && typeof parsed === 'object') {
  if (parsed.reviewedProposals && typeof parsed.reviewedProposals === 'object') {
    for (const [key, prop] of Object.entries(parsed.reviewedProposals)) {
      if (prop && prop.pattern) {
        corrections.push({
          word: String(prop.word || key).trim(),
          pattern: String(prop.pattern).trim().replace(/\s+/g, ''),
          vocalized: prop.vocalized ? String(prop.vocalized).trim() : String(prop.word || key).trim(),
          notes: prop.notes || prop.sourceReference || 'شاعر کی تصدیق شدہ قرأت',
        });
      }
    }
  } else if (parsed.customEntries && typeof parsed.customEntries === 'object') {
    for (const [key, patterns] of Object.entries(parsed.customEntries)) {
      const pats = Array.isArray(patterns) ? patterns : [patterns];
      for (const p of pats) {
        if (p) {
          corrections.push({
            word: key.trim(),
            pattern: String(p).trim().replace(/\s+/g, ''),
            vocalized: key.trim(),
            notes: 'شاعر کی تجویز کردہ تقطیع',
          });
        }
      }
    }
  } else {
    // Simple key-value mapping { word: pattern } or { word: { pattern, ... } }
    for (const [word, val] of Object.entries(parsed)) {
      if (typeof val === 'string') {
        corrections.push({
          word: word.trim(),
          pattern: val.trim().replace(/\s+/g, ''),
          vocalized: word.trim(),
          notes: 'تصحیح',
        });
      } else if (val && typeof val === 'object' && val.pattern) {
        corrections.push({
          word: word.trim(),
          pattern: String(val.pattern).trim().replace(/\s+/g, ''),
          vocalized: val.vocalized ? String(val.vocalized).trim() : word.trim(),
          notes: val.notes || 'تصحیح',
        });
      }
    }
  }
}

if (corrections.length === 0) {
  console.error('❌ کوئی درست عروضی اندراج نہیں ملا۔ براہِ کرم فائل کا فارمیٹ چیک کریں۔');
  process.exit(1);
}

console.log(`🔍 Found ${corrections.length} correction entries. Validating...`);

// Validate scansion symbols
const patternRegex = /^[-=x]+$/;
const validCorrections = [];
for (const item of corrections) {
  if (!patternRegex.test(item.pattern)) {
    console.warn(`⚠️ غیر معتبر علامت نظر انداز کی گئی: ${item.word} -> "${item.pattern}"`);
    continue;
  }
  validCorrections.push(item);
}

console.log(`✅ ${validCorrections.length} valid corrections ready for merge.`);

// Load sovereign scansion dictionary
console.log(`📚 Loading Sovereign Scansion Lexicon: ${SCANSION_FILE}`);
const rawDict = fs.readFileSync(SCANSION_FILE, 'utf-8');
const scansionDict = JSON.parse(rawDict);

let updatedCount = 0;
let addedCount = 0;

for (const corr of validCorrections) {
  const word = corr.word;
  const newPattern = corr.pattern;
  const vocalized = corr.vocalized || word;
  const syllables = vocalized;
  const category = 'poet_reviewed';

  if (scansionDict[word]) {
    const existingList = scansionDict[word];
    const matchIdx = existingList.findIndex(([pat]) => pat === newPattern);
    if (matchIdx >= 0) {
      // Update vocalization or syllables
      existingList[matchIdx] = [newPattern, vocalized, syllables, category];
    } else {
      // Prepend so poet's reviewed scansion is the preferred reading
      existingList.unshift([newPattern, vocalized, syllables, category]);
    }
    updatedCount++;
    console.log(`  🔄 اپ ڈیٹ: ${word} [${newPattern}] (${vocalized})`);
  } else {
    scansionDict[word] = [[newPattern, vocalized, syllables, category]];
    addedCount++;
    console.log(`  ➕ نیا اندراج: ${word} [${newPattern}] (${vocalized})`);
  }
}

// Sort keys alphabetically
const sortedKeys = Object.keys(scansionDict).sort((a, b) => a.localeCompare(b, 'ur'));
const sortedDict = {};
let totalRecords = 0;
for (const k of sortedKeys) {
  sortedDict[k] = scansionDict[k];
  totalRecords += scansionDict[k].length;
}

const totalWords = sortedKeys.length;

// Write updated dictionary
console.log(`💾 Writing updated Sovereign Lexicon (${totalWords} words, ${totalRecords} records)...`);
const outputJson = JSON.stringify(sortedDict);
fs.writeFileSync(SCANSION_FILE, outputJson, 'utf-8');

// Compute SHA256
const sha256 = crypto.createHash('sha256').update(outputJson).digest('hex');

// Update metadata
const rawMeta = fs.existsSync(METADATA_FILE) ? fs.readFileSync(METADATA_FILE, 'utf-8') : '{}';
const meta = JSON.parse(rawMeta);
meta.words = totalWords;
meta.records = totalRecords;
meta.sha256 = sha256;
meta.lastUpdated = new Date().toISOString();

fs.writeFileSync(METADATA_FILE, JSON.stringify(meta, null, 2), 'utf-8');

console.log(`
🎉 کامیابی! تمام تجاویز کامیابی سے مستقل عروضی لغت میں شامل کر دی گئیں۔
════════════════════════════════════════════════════════
  • اپ ڈیٹ شدہ الفاظ: ${updatedCount}
  • نئے شامل کردہ الفاظ: ${addedCount}
  • کل الفاظ (Total Words): ${totalWords}
  • کل عروضی اندراجات (Total Records): ${totalRecords}
  • لغت کا SHA-256 چیک سم: ${sha256}
════════════════════════════════════════════════════════
`);
