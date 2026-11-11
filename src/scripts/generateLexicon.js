/** Compatibility assets derived exclusively from the attributed pronunciation dictionary. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dictionary = JSON.parse(fs.readFileSync(path.join(root, 'src/data/prosody/aruuz-dictionary.json'), 'utf8'));
const expand = pattern => [...pattern].reduce((paths, symbol) => paths.flatMap(p => symbol === 'x' ? [p + '=', p + '-'] : [p + symbol]), ['']);
const lexicon = {};
for (const [word, rows] of Object.entries(dictionary)) {
  if (!rows.length || rows.some(r => !/^[-=x]{1,64}$/u.test(r[0]))) throw new Error(`Invalid source reading: ${word}`);
  lexicon[word] = [...new Set(rows.flatMap(row => expand(row[0])))];
}
fs.mkdirSync(path.join(root, 'public/data'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/data/urduLexiconData.json'), JSON.stringify(lexicon));
fs.writeFileSync(path.join(root, 'public/data/urdu_lexicon.json'), JSON.stringify(lexicon));
fs.copyFileSync(path.join(root, 'src/data/prosody/aruuz-dictionary.meta.json'), path.join(root, 'public/data/urdu_lexicon.meta.json'));
console.log(`Built ${Object.keys(lexicon).length} source-attributed lexicon keys; no spelling-length estimates.`);

// Editable corresponding source for the adapted GPL dictionary travels with the built app.
execFileSync('tar', ['-czf', path.join(root, 'public/licenses/likho-prosody-source.tar.gz'),
  'src/data/prosody/aruuz-dictionary.json', 'src/data/prosody/aruuz-dictionary.meta.json', 'src/data/prosody/aruuz-quarantine.json',
  'src/services/urduPhonology.ts', 'scripts/import-aruuz-lexicon.mjs',
  'public/licenses/Aruuz-NOTICE.txt', 'public/licenses/Aruuz-GPL-2.0.txt'], { cwd: root, env: { ...process.env, LC_ALL: 'C' } });
