/** Reproducible, non-executing import of lexical tables only. No SQL server required. */
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
const file = process.argv[2];
if (!file) throw new Error('Usage: node scripts/import-aruuz-lexicon.mjs /path/to/AruuzDB.sql');
const bytes = await readFile(file);
if (createHash('sha256').update(bytes).digest('hex') !== 'fce73b822453c412ed79a3071486341ffb38e61d9a1d4bb689ede245d9f2d9f8') throw new Error('SQL checksum differs from the audited source revision');
const sql = bytes.toString('utf8').replace(/\r\n/g, '\n');
const temporary = await mkdtemp(join(tmpdir(), 'likho-dictionary-'));
try {
  await build({ entryPoints: ['src/services/urduPhonology.ts'], bundle: true, platform: 'node', format: 'esm', outfile: join(temporary, 'phonology.mjs') });
  const { parseDictionaryTaqti } = await import(pathToFileURL(join(temporary, 'phonology.mjs')));
  const tables = {};
  for (const table of ['mastertable', 'plurals', 'variations', 'exceptions']) {
    const rows = [];
    for (const match of sql.matchAll(new RegExp('INSERT INTO `' + table + '` VALUES (.*?);\\n', 'gs'))) {
      const text = match[1];
      let i = 0;
      while (i < text.length) {
        if (text[i++] !== '(') continue;
        const row = [];
        while (i < text.length) {
          let value = '';
          if (text[i] === "'") {
            i++;
            while (i < text.length) {
              const ch = text[i++];
              if (ch === '\\') { const escaped = text[i++]; value += ({ n: '\n', r: '\r', t: '\t', '0': '\0' })[escaped] ?? escaped; }
              else if (ch === "'") break;
              else value += ch;
            }
          } else {
            const start = i;
            while (i < text.length && !',)'.includes(text[i])) i++;
            value = text.slice(start, i);
          }
          row.push(value);
          if (text[i++] === ')') break;
        }
        rows.push(row);
      }
    }
    tables[table] = rows;
  }
  const normalize = w => w.normalize('NFC').replace(/[\u064b-\u065f\u0670\u06d6-\u06edـ]/gu, '').replace(/ك/g, 'ک').replace(/[يى]/g, 'ی').replace(/ه/g, 'ہ').trim();
  const entries = {};
  const languagesById = new Map(tables.mastertable.map(r => [r[0], r[4]]));
  const rejected = {};
  const quarantine = [];
  const counts = {};
  for (const table of ['mastertable', 'plurals', 'variations']) {
    counts[table] = { total: tables[table].length, accepted: 0, rejected: 0, multiword: 0 };
    for (const row of tables[table]) {
      const [id, rawWord, vocalized, taqti, language = ''] = row;
      const word = normalize(rawWord.replace(/\s+\d+\s*$/u, ''));
      if (!word || /\s/u.test(word)) { counts[table].multiword++; continue; }
      const parsed = parseDictionaryTaqti(taqti);
      if (!parsed.pattern || parsed.error || !/^[\u0621-\u063a\u0641-\u064a\u066e-\u06d3]+$/u.test(word)) {
        quarantine.push({ sourceId: `aruuz:${table}:${id}`, word, vocalized, divisions: taqti, reason: parsed.error || 'invalid-key' });
        counts[table].rejected++; rejected[parsed.error || 'invalid-key'] = (rejected[parsed.error || 'invalid-key'] || 0) + 1; continue;
      }
      // Pattern, vocalization, source pronunciation divisions, language, table, record ID.
      const entry = [parsed.pattern, vocalized.trim(), taqti.trim(), (!language || language === 'NULL') ? (languagesById.get(id) || '') : language, table, Number(id)];
      (entries[word] ||= []).push(entry);
      counts[table].accepted++;
    }
  }
  // Curated upstream exceptions are authoritative over automatically compiled source divisions.
  counts.exceptions = { total: tables.exceptions.length, accepted: 0 };
  for (const [id, rawWord, ...patterns] of tables.exceptions) {
    const word = normalize(rawWord);
    if (!word || /\s/u.test(word)) continue;
    // Reject internally impossible exception records (e.g. جو recorded as ==).
    // This is only an upper-bound sanity check; it never generates a weight.
    const availableUnits = [...word].reduce((n, ch) => n + (ch === 'آ' ? 2 : /[ھں]/u.test(ch) ? 0 : 1), 0);
    const recordedDoubling = Math.max(0, ...(entries[word] || []).map(r => (r[1].match(/ّ/gu) || []).length));
    const optionalDoubling = Math.max(recordedDoubling, /^(رکھ|چکھ|پک|اٹھ|لکھ|دکان|شکر)/u.test(word) ? 1 : 0);
    const valid = patterns.map(p => p.replace(/\s/gu, '')).filter(p => /^[-=x]+$/u.test(p) &&
      [...p].reduce((n, symbol) => n + (symbol === '=' ? 2 : 1), 0) <= availableUnits + optionalDoubling);
    if (!valid.length) {
      rejected['impossible-exception'] = (rejected['impossible-exception'] || 0) + 1;
      quarantine.push({ sourceId: `aruuz:exceptions:${id}`, word, patterns: patterns.filter(p => p !== 'NULL'), reason: 'impossible-exception' });
    }
    if (!valid.length) continue;
    entries[word] = valid.map(p => [p, '', '', '', 'exceptions', Number(id)]);
    counts.exceptions.accepted++;
  }
  for (const [word, readings] of Object.entries(entries)) {
    const seen = new Set();
    entries[word] = readings.filter(r => { const key = JSON.stringify(r.slice(0, 3)); if (seen.has(key)) return false; seen.add(key); return true; });
  }
  const sorted = Object.fromEntries(Object.keys(entries).sort().map(w => [w, entries[w]]));
  const metadata = {
    schemaVersion: 1, source: 'sayedzeeshan/Aruuz', license: 'GPL-2.0',
    revision: '058fcd6010fb0ef030f79b10466c43aa20b0d4b9',
    url: 'https://github.com/sayedzeeshan/Aruuz/blob/058fcd6010fb0ef030f79b10466c43aa20b0d4b9/Aruuz.Website/DB/AruuzDB.sql',
    sha256: createHash('sha256').update(bytes).digest('hex'), words: Object.keys(sorted).length,
    records: Object.values(sorted).reduce((n, r) => n + r.length, 0), tables: counts, rejected,
    quarantinedRecords: quarantine.length, quarantineFile: 'aruuz-quarantine.json',
    note: 'Source-attributed lexical readings, not independent scholarly certification. Unsupported pronunciations are rejected; no spelling-length fallback.'
  };
  await mkdir('src/data/prosody', { recursive: true });
  await writeFile('src/data/prosody/aruuz-dictionary.json', JSON.stringify(sorted));
  await writeFile('src/data/prosody/aruuz-quarantine.json', JSON.stringify(quarantine, null, 2) + '\n');
  await writeFile('src/data/prosody/aruuz-dictionary.meta.json', JSON.stringify(metadata, null, 2) + '\n');
  console.log(JSON.stringify(metadata, null, 2));
} finally { await rm(temporary, { recursive: true, force: true }); }
