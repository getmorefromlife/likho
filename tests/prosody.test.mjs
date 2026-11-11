import { build } from 'esbuild';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const temporary = await mkdtemp(join(tmpdir(), 'likho-prosody-'));
try {
  await build({ stdin: { contents: `export * from './src/services/aroozEngine'; export * from './src/services/meterRepairEngine'; export * from './src/services/urduPhonology'; export * from './src/services/prosodyEngine'; export * from './src/services/fileIngestionService'; export * from './src/services/qafiyaEngine'; export * from './src/services/wordIntentionService'; export * from './src/services/slotRhymeBuilder'; export * from './src/data/meterReferenceAtlas';`, resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: join(temporary, 'engine.mjs') });
  const e = await import(pathToFileURL(join(temporary, 'engine.mjs')));
  let passed = 0;
  async function test(name, fn) { await fn(); passed++; console.log(`✓ ${name}`); }
  const variants = word => e.scanWords(word)[0]?.variants || [];
  const meter = 'mutaqarib-musamman-salim';
  const exactFixture = 'مرا دل مرا دل مرا دل مرا دل';
  await test('pronunciation source has pinned revision, checksum, license and record IDs', async () => {
    const meta = e.AroozLexiconService.metadata;
    assert.ok(meta.words > 40000); assert.ok(meta.records > meta.words);
    assert.match(meta.sha256, /^[a-f0-9]{64}$/); assert.equal(meta.license, 'GPL-2.0');
    assert.ok(e.AroozLexiconService.getLexicalReadings('کلام')[0].sourceId.startsWith('aruuz:mastertable:'));
    assert.match(await readFile('public/licenses/Aruuz-GPL-2.0.txt', 'utf8'), /Version 2/);
  });
  const dictionaryCases = { 'کلام':'-=-', 'شاعر':'==', 'محبت':'-==', 'رات':'=-', 'خواب':'=-', 'خود':'=', 'خوشی':'-=', 'رنگ':'=-', 'قرآن':'==-', 'جہاں':'-=', 'جہان':'-=-', 'پھر':'=' };
  for (const [word, pattern] of Object.entries(dictionaryCases)) await test(`source pronunciation ${word}: ${pattern}`, () => assert.equal(variants(word)[0], pattern));
  const vocalized = { 'دِل':'=', 'قَلَم':'-=', 'مُحَبَّت':'-==', 'عِلْم':'=-', 'عَلَم':'-=', 'بَھر':'=', 'شَدَّت':'==', 'اَبَدًا':'--=', 'نُور':'=-', 'آب':'=-' };
  for (const [word, pattern] of Object.entries(vocalized)) await test(`vowels/phonemes ${word}: ${pattern}`, () => {
    const result = e.parsePronunciation(word); assert.equal(result.error, undefined); assert.equal(result.pattern, pattern);
  });
  await test('incomplete vowels and conflicting marks are not guessed', () => {
    assert.ok(e.parsePronunciation('زَند').error);
    assert.ok(e.parsePronunciation('بَِت').error);
    assert.ok(e.parsePronunciation('ھ').error);
    assert.ok(e.parsePronunciation('بْت').error);
    assert.deepEqual(variants('ژژژژژ'), ['']);
  });
  await test('hamza is a consonant and madda starts a distinct nucleus', () => {
    assert.equal(e.parsePronunciation('قُرْآن').pattern, '==-');
    assert.equal(e.parsePronunciation('جُرْأَت').pattern, '==');
  });
  await test('nasalization does not swallow a pronounced noon', () => {
    assert.equal(e.parsePronunciation('جَہاں').pattern, '-=');
    assert.equal(e.parsePronunciation('جَہان').pattern, '-=-');
  });
  await test('consonant izafat redivides the last syllable', () => {
    assert.deepEqual(variants('لبِ'), ['-=','--']);
    assert.ok(variants('ملکِ').includes('==')); assert.ok(variants('ملکِ').includes('=-'));
    assert.ok(variants('نظرِ').includes('--=')); assert.ok(!variants('نظرِ').includes('---'));
  });
  await test('izafat heh and yeh Unicode forms agree without recursion', () => {
    assert.deepEqual(variants('جذبۂ'), variants('جذبۂ'));
    assert.deepEqual(variants('جذبۂ'), variants('جذبہِ'));
    assert.ok(variants('شوخیِ').includes('=-='));
    assert.ok(variants('شوخیِ').includes('==-'));
  });
  await test('izafat after alif keeps its preceding long vowel', () => {
    assert.deepEqual(variants('وفائے'), ['-==','-=-']);
    assert.ok(!variants('وفائے').includes('--='));
  });
  await test('attested optional izafat shadda remains word-specific', () => {
    assert.ok(variants('فنِ').includes('==')); assert.ok(variants('فنِ').includes('-='));
    assert.ok(!variants('دلِ').includes('=='));
  });
  await test('modern short particles and fixed monosyllables are not blanket-flexible', () => {
    for (const word of ['کہ','نہ','بہ','پہ']) assert.deepEqual(variants(word), ['-']);
    for (const word of ['اے','کیوں']) assert.deepEqual(variants(word), ['=']);
    assert.ok(variants('کیا').includes('=')); assert.ok(variants('کیا').includes('-=')); assert.ok(!variants('کیا').includes('-'));
    assert.deepEqual(variants('ہے'), ['=','-']);
  });
  await test('a shortened final vowel never permits dropping a real syllable', () => {
    assert.deepEqual(variants('نکلے'), ['==','=-']);
    assert.deepEqual(variants('جائیں'), ['==','=-']);
    assert.deepEqual(variants('کلام'), ['-=-']);
  });
  await test('word grafting is licensed by neighboring words, not punctuation or ayn', () => {
    const joined = e.scanAgainstMeter('آخر اس', '=-='); assert.equal(joined.distance, 0);
    assert.ok(joined.selectedOptions[0].rules.includes('word-grafting'));
    assert.ok(e.scanAgainstMeter('آخر، اس', '=-=').distance > 0);
    assert.ok(!e.scanWords('آخر عہد')[0].options.some(o => o.rules.includes('word-grafting')));
    assert.equal(e.scanAgainstMeter('آپ اگر', '=-=').distance, 0);
  });
  await test('conjunctive waw resyllabifies consonants and locks the preceding alif', () => {
    assert.equal(e.scanAgainstMeter('دین و دل', '=-=').distance, 0);
    assert.deepEqual(e.scanWords('وفا و دل')[0].variants, ['-=']);
    assert.equal(e.scanAgainstMeter('دل و شام', '--=-').distance, 0);
  });
  await test('Arabic article combines through the same word-boundary rules', () => {
    assert.equal(e.scanAgainstMeter('عالم الغیب', '=-==-').distance, 0);
  });
  await test('productive polite verb endings require an attested stem and infinitive', () => {
    assert.ok(variants('چاہیے').includes('=-='));
    assert.ok(variants('دیکھیے').includes('=-='));
    assert.ok(variants('چاہے').includes('=='));
    assert.deepEqual(variants('ژژژیے'), ['']);
  });
  const corpus = [
    ['نقش فریادی ہے کس کی شوخیِ تحریر کا', 'ramal-musamman-mahzoof'],
    ['کاغذی ہے پیرہن ہر پیکرِ تصویر کا', 'ramal-musamman-mahzoof'],
    ['جذبۂ بے اختیارِ شوق دیکھا چاہیے', 'ramal-musamman-mahzoof'],
    ['ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے', 'hazaj-musamman-salim'],
    ['بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے', 'hazaj-musamman-salim'],
  ];
  for (const [line, target] of corpus) await test(`classical word-level benchmark: ${line}`, () => {
    const report = e.diagnoseAndRepairMeter(line, target); assert.deepEqual(report.uncertainWords, []);
    assert.equal(report.distance, 0); assert.equal(report.isCompliant, true);
    assert.equal(e.scanPoetryLine(line, target).rawSyllables, report.actualPattern);
    assert.equal(e.scanPoetryLine(line).meterNameUrdu, e.CLASSICAL_BUHUR.find(m => m.id === target).nameUrdu);
    assert.ok(report.wordSpans.every(w => w.sourceIds.length));
    assert.equal(report.actualPattern, report.wordSpans.map(w => w.syllables).join(''));
    const damaged = e.diagnoseAndRepairMeter(line + ' دل', target); assert.equal(damaged.isCompliant, false);
  });
  await test('a real Ghalib spelling error receives an exact, rescanned repair', () => {
    const report = e.diagnoseAndRepairMeter('بہت نکلے میرے ارمان لیکن پھر بھی کم نکلے','hazaj-musamman-salim');
    assert.ok(report.distance > 0);
    const repair = report.suggestions.find(s => s.replacementWord === 'مرے'); assert.ok(repair);
    assert.equal(repair.isExact, true); assert.equal(e.diagnoseAndRepairMeter(repair.repairedLine, 'hazaj-musamman-salim').isCompliant, true);
  });
  await test('punctuation, repeated-word identity, and whitespace survive an exact repair', () => {
    const line = '  میرا، دل  مرا دل مرا دل مرا دل!  ';
    const report = e.diagnoseAndRepairMeter(line, meter);
    const repair = report.suggestions.find(s => s.replacementWord === 'مرا'); assert.ok(repair);
    assert.equal(repair.repairedLine, '  مرا، دل  مرا دل مرا دل مرا دل!  ');
    assert.equal(repair.isExact, true);
    for (const span of report.wordSpans) assert.equal(line.slice(span.charStart, span.charEnd), span.word);
  });
  await test('partial repairs are labelled partial and every proposal improves one fixed meter', () => {
    const report = e.diagnoseAndRepairMeter('میرا دل میرا دل مرا دل مرا دل',meter);
    assert.ok(report.suggestions.some(s => !s.isExact));
    for (const repair of report.suggestions) {
      const next = e.scanMeter(repair.repairedLine, e.CLASSICAL_BUHUR.find(m => m.id === meter));
      assert.ok(next.distance < report.distance); assert.equal(repair.afterDistance, next.distance);
      assert.equal(repair.isExact, next.distance === 0); assert.notEqual(repair.repairedLine, 'میرا دل میرا دل مرا دل مرا دل');
    }
  });
  await test('unknown words, unsupported scripts, and numbers cannot disappear into a false match', () => {
    for (const suffix of ['ژژژژژ','abc','123','۱۲۳']) {
      const report = e.diagnoseAndRepairMeter(exactFixture + ' ' + suffix,meter);
      assert.equal(report.isCompliant, false); assert.ok(report.uncertainWords.includes(suffix)); assert.equal(report.suggestions.length,0);
    }
  });
  await test('empty input and punctuation have no invented weights', () => {
    for (const line of ['', ' ، ۔ ! ', '123']) {
      const report = e.diagnoseAndRepairMeter(line); assert.equal(report.actualPattern,''); assert.deepEqual(report.defects,[]); assert.deepEqual(report.suggestions,[]);
    }
  });
  await test('automatic prefixes stay incomplete, explicit targets diagnose missing positions', () => {
    const report = e.diagnoseAndRepairMeter('مرا'); assert.equal(report.isPrefix,true); assert.equal(report.defects.length,0); assert.equal(report.isCompliant,false);
    assert.ok(e.diagnoseAndRepairMeter('مرا',meter).defects.some(d => d.type === 'missing_syllable'));
  });
  await test('all 50 named forms have coherent feet, provenance, and no fabricated old templates', () => {
    assert.equal(e.CLASSICAL_BUHUR.length,50);
    assert.ok(!e.CLASSICAL_BUHUR.some(m => m.id === 'mutaqarib-musamman-maqbooz'));
    for (const m of e.CLASSICAL_BUHUR) {
      assert.equal(m.fullRawPattern,m.patternsList.join('')); assert.ok(m.afailList.every(Boolean)); assert.match(m.source,/^handbook:/);
      assert.ok(m.fullRawPattern.endsWith('=')); assert.ok(!m.fullRawPattern.includes('---'));
      assert.equal(e.splitSyllablesByMeterArkan(m.fullRawPattern+'==',m).join('').replace(/\s/g,''),m.fullRawPattern+'==');
    }
  });
  await test('terminal surplus is meter-specific and never erased from genuine output', () => {
    const m = e.CLASSICAL_BUHUR.find(m => m.id === meter);
    const scan = e.scanMeter(exactFixture + ' نہ',m); assert.equal(scan.distance,0); assert.ok(scan.notes.includes('terminal-short')); assert.ok(scan.pattern.endsWith('-'));
    const hazaj = corpus.find(([, id]) => id === 'hazaj-musamman-salim')[0];
    assert.ok(e.scanMeter(hazaj + ' نہ',e.CLASSICAL_BUHUR.find(m => m.id === 'hazaj-musamman-salim')).distance > 0);
  });
  await test('late pronunciation branches are not discarded at 16 candidates', () => {
    const line = Array(24).fill('ہے').join(' '), target = '-'.repeat(23)+'=';
    const scan = e.scanAgainstMeter(line,target); assert.equal(scan.distance,0); assert.equal(scan.pattern,target);
  });
  await test('companion and canvas use the same syllable analysis', () => {
    const line = corpus[0][0]; assert.equal(e.analyzeMisra(line).approxSyllables,e.scanPoetryLine(line).totalSyllables);
    assert.equal(e.estimateWordSyllableCount('ژژژژژ'),0);
  });
  await test('plain word-list import never overwrites source readings with guessed weights', async () => {
    const before = e.AroozLexiconService.getScansionVariants('کلام');
    const report = await e.processFileIngestion(new File(['کلام ژژژژژ ژژژژژ'],'words.txt'));
    assert.deepEqual(e.AroozLexiconService.getScansionVariants('کلام'),before);
    assert.equal(e.AroozLexiconService.getScansionVariants('ژژژژژ'),null);
    assert.ok(report.duplicateCount > 0); assert.equal(report.addedToLexicon,1);
  });
  await test('malformed weighted imports are atomic; valid user weights retain their provenance', async () => {
    const before = e.AroozLexiconService.getRevision();
    await assert.rejects(e.AroozLexiconService.bulkImport('{"ژژژ":["="],"ژژ":["WRONG"]}','json'));
    assert.equal(e.AroozLexiconService.getRevision(),before); assert.equal(e.AroozLexiconService.getScansionVariants('ژژژ'),null);
    const imported = await e.AroozLexiconService.bulkImport('{"ژژژ":["="]}','json');
    assert.equal(imported.persisted,false); // Node has no IndexedDB: no false persistence claim.
    assert.deepEqual(variants('ژژژ'),['=']); assert.equal(e.scanWords('ژژژ')[0].source,'user-entry');
    assert.ok(e.diagnoseAndRepairMeter(exactFixture+' ژژژ',meter).uncertainWords.includes('ژژژ'));
  });
  await test('a short grammatical syllable cannot vanish under a liaison label', () => {
    assert.deepEqual(e.scanWords('کہ اس')[0].variants,['-']);
    assert.deepEqual(e.scanWords('نہ و دل')[0].variants,['-']);
    assert.equal(e.scanAgainstMeter('کہ اس','=').distance,1);
  });
  await test('source exception anomalies do not override documented monosyllables', () => {
    assert.deepEqual(variants('جو'),['=','-']); assert.deepEqual(variants('جوئے'),['==','=-']);
    assert.deepEqual(variants('جَو'),['=']);
    assert.ok(e.AroozLexiconService.metadata.rejected['impossible-exception'] > 0);
  });
  await test('invisible formatting preserves original offsets and canonical pronunciation', () => {
    const raw = '  ک\u200bلام'; const span = e.extractWordSpans(raw)[0];
    assert.equal(span.syllables,'-=-'); assert.equal(raw.slice(span.charStart,span.charEnd),'ک\u200bلام');
  });
  await test('backup round trips retain source attribution and cannot demote the source dictionary', async () => {
    const backup = e.AroozLexiconService.exportLexiconAsJSON();
    assert.equal(JSON.parse(backup).schemaVersion,2);
    await e.AroozLexiconService.bulkImport(backup,'json');
    assert.equal(e.AroozLexiconService.getLexicalReadings('کلام')[0].source,'dictionary');
    assert.equal(e.AroozLexiconService.getLexicalReadings('ژژژ')[0].source,'user-entry');
  });
  await test('word traces distinguish an allowed option from an actually used shortening', () => {
    const scan = e.scanAgainstMeter('فریادی ہے', '===-');
    assert.equal(scan.distance,0);
    assert.ok(!scan.selectedOptions[0].rules.includes('final-vowel-flexibility'));
    assert.ok(scan.selectedOptions[1].rules.includes('monosyllable-flexibility'));
  });
  await test('quarantined source records remain inspectable and are never runtime evidence', async () => {
    const quarantine = JSON.parse(await readFile('src/data/prosody/aruuz-quarantine.json','utf8'));
    assert.equal(quarantine.length,e.AroozLexiconService.metadata.quarantinedRecords);
    assert.ok(quarantine.some(r => r.word === 'جو' && r.reason === 'impossible-exception'));
    assert.ok(!e.AroozLexiconService.getLexicalReadings('جو').some(r => r.pattern === '=='));
  });
  await test('caesura licensing constrains the lattice instead of discarding an equally good valid reading', async () => {
    await e.AroozLexiconService.bulkImport('{"ژژ":["=","=="],"ژژژژ":["==","="]}','json');
    const scan = e.scanAgainstMeter('ژژ ژژژژ','===',2);
    assert.equal(scan.distance,0); assert.deepEqual(scan.readings,['==','=']);
  });
  await test('a caesura short must end a word, while the meter still admits it at a real boundary', () => {
    const m = e.CLASSICAL_BUHUR.find(m => m.id === 'hazaj-musamman-akhrab-salim');
    const withBoundary = 'دل دل کہ کہ دل دل دل کہ دل دل کہ کہ دل دل دل';
    const crossingWord = 'دل دل کہ کہ دل دل دل مرا دل کہ کہ دل دل دل';
    assert.equal(e.scanMeter(withBoundary,m).distance,0);
    assert.ok(e.scanMeter(withBoundary,m).notes.includes('caesura-short'));
    assert.ok(e.scanMeter(crossingWord,m).distance > 0);
  });
  await test('invalid target fails clearly and results remain deterministic', () => {
    assert.throws(() => e.diagnoseAndRepairMeter('دل','missing-meter'),/Unknown meter/);
    assert.deepEqual(e.diagnoseAndRepairMeter('میرا دل مرا دل مرا دل مرا دل',meter),e.diagnoseAndRepairMeter('میرا دل مرا دل مرا دل مرا دل',meter));
  });
  await test('quarantined entries are searchable with reasons and source references', () => {
    const list = e.AroozLexiconService.getQuarantinedEntries();
    assert.equal(list.length, 1007);
    const search = e.AroozLexiconService.searchQuarantined('آرٹ');
    assert.ok(search.length >= 1);
    assert.equal(search[0].word, 'آرٹ');
    assert.equal(search[0].sourceId, 'aruuz:mastertable:513');
    assert.equal(search[0].reason, 'complex-coda-requires-lexical-reading');
  });
  await test('pronunciation proposals validate syntax, and only approved proposals become eligible for automated repair', async () => {
    // 1. Invalid syntax fails validation
    const invalid = await e.AroozLexiconService.saveProposal({ word: 'آرٹ', pattern: 'bad-syntax', status: 'unreviewed' });
    assert.equal(invalid.success, false);
    assert.ok(invalid.error);

    // 2. Unreviewed proposal stays in uncertain words and blocks automatic repair
    await e.AroozLexiconService.saveProposal({
      word: 'آرٹ',
      pattern: '=-',
      vocalized: 'آرْٹ',
      status: 'unreviewed',
      sourceReference: 'aruuz:mastertable:513',
      rejectionReason: 'complex-coda-requires-lexical-reading'
    });
    assert.equal(e.scanWords('آرٹ')[0].source, 'user-entry');
    const unreviewedDiagnosis = e.diagnoseAndRepairMeter('آرٹ میرا دل مرا دل مرا دل', meter);
    assert.ok(unreviewedDiagnosis.uncertainWords.includes('آرٹ'));
    assert.equal(unreviewedDiagnosis.suggestions.length, 0);

    // 3. Explicitly approved proposal transitions to reviewed-entry and enables automated repair
    await e.AroozLexiconService.saveProposal({
      word: 'آرٹ',
      pattern: '=-',
      vocalized: 'آرْٹ',
      status: 'approved',
      sourceReference: 'aruuz:mastertable:513',
      rejectionReason: 'complex-coda-requires-lexical-reading'
    });
    assert.equal(e.scanWords('آرٹ')[0].source, 'reviewed-entry');
    const approvedDiagnosis = e.diagnoseAndRepairMeter('آرٹ میرا دل مرا دل مرا دل', meter);
    assert.ok(!approvedDiagnosis.uncertainWords.includes('آرٹ'));
    assert.ok(approvedDiagnosis.suggestions.some(s => s.replacementWord === 'مرا'));

    // 4. Deleting proposal revokes reading and restores unresolved status
    await e.AroozLexiconService.deleteProposal('آرٹ');
    assert.equal(e.scanWords('آرٹ')[0].source, 'unresolved');
  });
  await test('backup proposals are bounded, keyed consistently and imported atomically', async () => {
    const backup = (proposals, customEntries = {}) => JSON.stringify({ schemaVersion: 2, proposals, customEntries });
    const proposal = { word: 'آرٹ', pattern: '=-', status: 'approved' };
    for (const bad of [
      { ...proposal, pattern: 'x'.repeat(9) },
      { ...proposal, pattern: 'invalid' },
      { ...proposal, status: 'trusted' },
      { ...proposal, word: 'دل' },
      { ...proposal, notes: {} }
    ]) {
      await assert.rejects(e.AroozLexiconService.bulkImport(backup({ 'آرٹ': bad }), 'json'));
      assert.equal(e.AroozLexiconService.getProposal('آرٹ'), undefined);
    }
    await assert.rejects(e.AroozLexiconService.bulkImport(backup({ 'آرٹ': proposal }, { 'دل': 'invalid' }), 'json'));
    assert.equal(e.AroozLexiconService.getProposal('آرٹ'), undefined);
    const imported = await e.AroozLexiconService.bulkImport(backup({ 'آرٹ': proposal }), 'json');
    assert.equal(imported.importedCount, 1);
    assert.equal(e.scanWords('آرٹ')[0].source, 'reviewed-entry');
    await e.AroozLexiconService.deleteProposal('آرٹ');
    assert.equal((await e.AroozLexiconService.saveProposal({ ...proposal, status: 'invalid' })).success, false);
  });
  await test('corrupted stored proposals in IndexedDB are individually skipped while valid proposals hydrate safely', async () => {
    const memoryStore = new Map();
    memoryStore.set('reviewed_lexicon_proposals_v1', {
      'آرٹ': { word: 'آرٹ', pattern: '=-', status: 'approved' },
      'دل': { word: 'دل', pattern: '????', status: 'approved' },
      'گل': { word: 'گل', pattern: 'x'.repeat(9), status: 'approved' },
      'بلبل': { word: 'بلبل', pattern: '-=-', status: 'bogus' },
      'شعر': { word: 'نظم', pattern: '=-', status: 'approved' },
      'قلم': { word: 'قلم', pattern: '-=', status: 'unreviewed' },
    });
    const originalIDB = globalThis.indexedDB;
    globalThis.indexedDB = {
      open: () => {
        const req = {
          result: {
            objectStoreNames: { contains: () => true },
            createObjectStore: () => {},
            close: () => {},
            transaction: () => ({
              objectStore: () => ({
                get: (key) => {
                  const r = { result: memoryStore.get(key) };
                  setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                  return r;
                },
                put: (val, key) => {
                  memoryStore.set(key, val);
                  const r = {};
                  setTimeout(() => r.onsuccess && r.onsuccess(), 0);
                  return r;
                }
              })
            })
          },
          _onsuccess: null,
          get onsuccess() { return this._onsuccess; },
          set onsuccess(fn) {
            this._onsuccess = fn;
            if (fn) setTimeout(() => fn({ target: this }), 0);
          },
          onerror: null,
          onupgradeneeded: null,
        };
        return req;
      }
    };

    const hydrated = new e.AroozLexiconService.constructor();
    try {
      await hydrated.initialize();

      // 1. Valid approved proposal hydrated and activated
      assert.equal(hydrated.getProposal('آرٹ')?.status, 'approved');
      assert.equal(hydrated.getLexicalReadings('آرٹ')[0].source, 'reviewed-entry');

      // 2. Valid unreviewed proposal hydrated and activated
      assert.equal(hydrated.getProposal('قلم')?.status, 'unreviewed');
      assert.equal(hydrated.getLexicalReadings('قلم')[0].source, 'user-entry');

      // 3. Corrupted records skipped individually
      assert.equal(hydrated.getProposal('دل'), undefined);
      assert.equal(hydrated.getProposal('گل'), undefined);
      assert.equal(hydrated.getProposal('بلبل'), undefined);
      assert.equal(hydrated.getProposal('شعر'), undefined);
      assert.equal(hydrated.getProposal('نظم'), undefined);
    } finally {
      globalThis.indexedDB = originalIDB;
    }
  });
  await test('rhyme engine distinguishes strict pronunciation matches from near and non-matching homographs', () => {
    // 1. Strict rhyme match: بصیرت (-ِیرَت) and حقیقت (-ِیقَت) vs near Redf-e-Qareeb حکومت (-ُومَت) vs non-matching رحمت (رَحْمَت)
    assert.equal(e.compareRhymeWords('بصیرت', 'حقیقت').tier, 'strict');
    assert.equal(e.compareRhymeWords('بصیرت', 'حکومت').tier, 'near');
    assert.equal(e.compareRhymeWords('بصیرت', 'رحمت').matches, false);

    // 2. Diphthong vs Ma'ruf: نُور / حُور are strict, while نُور vs غَور (اور) and تِیر vs خَیر (ایر) do not falsely match
    assert.equal(e.compareRhymeWords('نور', 'حور').tier, 'strict');
    assert.equal(e.compareRhymeWords('نور', 'غور').matches, false);
    assert.equal(e.compareRhymeWords('تیر', 'زنجیر').tier, 'strict');
    assert.equal(e.compareRhymeWords('تیر', 'خیر').matches, false);

    // 3. Mutaharrik vs Qayd (Sukun): سَحَر / قَمَر are strict, فِکْر / ذِکْر are strict, but قَمَر vs فِکْر is rejected
    assert.equal(e.compareRhymeWords('سحر', 'قمر').tier, 'strict');
    assert.equal(e.compareRhymeWords('فکر', 'ذکر').tier, 'strict');
    assert.equal(e.compareRhymeWords('قمر', 'فکر').matches, false);

    // 4. findRhymes separates strict, near, and uncertain tiers and excludes false orthographic rhymes
    const noorRes = e.findRhymes('نور');
    const strictNoorWords = noorRes.groups.filter(g => g.tier === 'strict').flatMap(g => g.words);
    const allNoorWords = noorRes.groups.flatMap(g => g.words);
    assert.ok(strictNoorWords.includes('حور'));
    assert.ok(strictNoorWords.includes('حضور'));
    assert.ok(!allNoorWords.includes('غور'));

    const baseeratRes = e.findRhymes('بصیرت');
    const strictBaseerat = baseeratRes.groups.filter(g => g.tier === 'strict').flatMap(g => g.words);
    const nearBaseerat = baseeratRes.groups.filter(g => g.tier === 'near').flatMap(g => g.words);
    assert.ok(strictBaseerat.includes('حقیقت'));
    assert.ok(strictBaseerat.includes('شریعت'));
    assert.ok(nearBaseerat.includes('حکومت'));
    assert.ok(nearBaseerat.includes('ضرورت'));
    assert.ok(!strictBaseerat.includes('رحمت'));
    assert.ok(!nearBaseerat.includes('رحمت'));
  });
  await test('poem rhyme scheme detector separates multi-word radif, nasal pairs, and verifies subsequent couplets', () => {
    // Multi-word radif ("ہوا ہے") with strict qafiya ("جلانا" / "بجھانا" -> کلام / سلام)
    const multiWordRadifPoem = [
      'دل میں اک شوقِ کلام آتا رہا ہے',
      'لب پہ ہر دم یہ سلام آتا رہا ہے',
      'زندگی کی راہ میں ہر موڑ پر اب',
      'تیرے وعدوں کا پیام آتا رہا ہے',
    ];
    const detected = e.detectPoemRhymeScheme(multiWordRadifPoem);
    assert.ok(detected);
    assert.equal(detected.detectedQafiyaWord, 'کلام');
    assert.equal(detected.secondQafiyaWord, 'سلام');
    assert.equal(detected.detectedRadif, 'آتا رہا ہے');
    assert.equal(detected.matchTier, 'strict');
    assert.equal(detected.verifiedLinesCount, 3);
    assert.deepEqual(detected.qafiyaWordsInPoem, ['کلام', 'سلام', 'پیام']);

    // Nasal contraction pair in matla (جہان / جہاں or گماں / جہاں)
    const nasalPoem = [
      'ستاروں سے آگے جہاں اور بھی ہیں',
      'ابھی عشق کے امتحاں اور بھی ہیں',
    ];
    const nasalDetected = e.detectPoemRhymeScheme(nasalPoem);
    assert.ok(nasalDetected);
    assert.equal(nasalDetected.detectedQafiyaWord, 'جہاں');
    assert.equal(nasalDetected.detectedRadif, 'اور بھی ہیں');
  });
  await test('repair engine enforces grammatical transposition boundaries, protects radif/qafiya, and ranks poetic license first', () => {
    // 1. Grammatical guards: never invert postposition ("دل میں" -> "میں دل") or explicit izafat ("شوخیِ تحریر" -> "تحریر شوخیِ")
    const postpositionLine = 'میرا دل میں مرا دل مرا دل';
    const postRep = e.diagnoseAndRepairMeter(postpositionLine, meter);
    assert.ok(!postRep.suggestions.some(s => s.category === 'transposition' && s.replacementWord === 'میں دل'));

    const izafatLine = 'شوخیِ تحریر میرا دل مرا دل';
    const izafatRep = e.diagnoseAndRepairMeter(izafatLine, meter);
    assert.ok(!izafatRep.suggestions.some(s => s.category === 'transposition' && s.originalWord.includes('شوخیِ')));

    // 2. Attested nasal contraction repair (جہان -> جہاں) and ranking poetic_license ahead of transpositions
    const nasalRepairLine = 'جہان دل مرا دل مرا دل مرا دل';
    const nasalRep = e.diagnoseAndRepairMeter(nasalRepairLine, meter);
    const jahanFix = nasalRep.suggestions.find(s => s.replacementWord === 'جہاں');
    assert.ok(jahanFix);
    assert.equal(jahanFix.isExact, true);
    assert.equal(jahanFix.category, 'poetic_license');
    assert.equal(nasalRep.suggestions[0].category, 'poetic_license');

    // 3. Radif and Qafiya slot protection: when context specifies radif and rhymeAnchorWord,
    //    repairs must never mutate the radif or replace the qafiya slot with a non-rhyming synonym
    const radifLine = 'میرا دل مرا دل مرا وفا ہے';
    const withRadifContext = e.diagnoseAndRepairMeter(radifLine, meter, {
      radif: 'ہے',
      rhymeAnchorWord: 'صدا', // rhymes with وفا (-= V:ا), whereas synonyms of وفا like اخلاص / سچائی do not rhyme with صدا
    });
    assert.ok(withRadifContext.suggestions.every(s => s.repairedLine.endsWith(' ہے')));
    assert.ok(!withRadifContext.suggestions.some(s => s.originalWord === 'وفا' && !s.preservesRhyme));
  });
  await test('word intention service surfaces compound splits (آگئے -> آ گئے فاعلن), direct readings, and poetic alternatives', () => {
    // 1. Unspaced compound verb آگئے offers spaced split "آ گئے" with فاعلن (=-=) and =--
    const agayeMenu = e.getWordIntentionMenuData('آگئے', 0, '');
    assert.ok(agayeMenu);
    assert.equal(agayeMenu.source, 'unresolved');
    const failunSplit = agayeMenu.compoundSplits.find(
      c => c.spacedText === 'آ گئے' && c.combinedPattern === '=-='
    );
    assert.ok(failunSplit);
    assert.equal(failunSplit.ruknLabel, 'فَاعِلُن');
    assert.equal(failunSplit.repairedLine, 'آ گئے');
    assert.ok(agayeMenu.compoundSplits.some(c => c.spacedText === 'آ گئے' && c.combinedPattern === '=--'));

    // Also works with decomposed Alef + Maddah (آگئے)
    const decomposedMenu = e.getWordIntentionMenuData('ا\u0653گئے', 0, '');
    assert.ok(decomposedMenu.compoundSplits.some(c => c.combinedPattern === '=-=' && c.ruknLabel === 'فَاعِلُن'));

    // 2. Direct readings for "گئے" in "آ گئے" expose both -= (full vowel) and -- (shortened final vowel)
    const gayeMenu = e.getWordIntentionMenuData('آ گئے', 1, '-=');
    assert.ok(gayeMenu);
    assert.ok(gayeMenu.directReadings.some(r => r.pattern === '-='));
    assert.ok(gayeMenu.directReadings.some(r => r.pattern === '--'));

    // 3. Pinning a word reading updates line scansion deterministically
    const baseScan = e.scanPoetryLine('آ گئے');
    const baseDiag = e.diagnoseAndRepairMeter('آ گئے');
    const pinnedResult = e.evaluateWithPinnedReadings('آ گئے', baseScan, baseDiag, { 1: '--' });
    assert.equal(pinnedResult.scansion.rawSyllables, '=--');
    assert.equal(pinnedResult.report.wordSpans[1].syllables, '--');

    // 4. Poetic spelling alternative surfaced for میرا -> مرا (-=)
    const meraMenu = e.getWordIntentionMenuData('میرا دل', 0, '==');
    assert.ok(meraMenu.poeticSpellings.some(p => p.alternativeWord === 'مرا' && p.alternativePattern === '-='));
  });
  await test('rhyme engine indexes full Qaafiyah Expert Urdu_Dict.txt vocabulary (58,604 normalized words) without fabricating weights and supports letter-count filtering', () => {
    const stats = e.getTotalRhymeVocabularyStats();
    assert.ok(stats.weightedLexiconWords >= 40430);
    assert.ok(stats.unweightedQaafiyahWords >= 18100);
    assert.ok(stats.totalUniqueWords >= 58600);

    // Exact 4-letter filter on کلام
    const exact4 = e.findRhymes('کلام', undefined, { mode: 'exact', count: 4 });
    assert.ok(exact4.totalMatches > 0);
    for (const grp of exact4.groups) {
      for (const w of grp.words) {
        assert.equal([...w].length, 4);
      }
    }

    // Max 3-letter filter on شام
    const max3 = e.findRhymes('شام', undefined, { mode: 'max', count: 3 });
    assert.ok(max3.totalMatches > 0);
    for (const grp of max3.groups) {
      for (const w of grp.words) {
        assert.ok([...w].length <= 3);
      }
    }
  });
  await test('50-meter reference atlas covers all 50 catalog forms with honest review stages, 6-layer worked examples, and practice exercises', () => {
    assert.equal(e.METER_REFERENCE_ATLAS.length, 50);
    const sourceChecked = e.METER_REFERENCE_ATLAS.filter(m => m.reviewStage === 'source-checked');
    const catalogOnly = e.METER_REFERENCE_ATLAS.filter(m => m.reviewStage === 'catalog-only');
    assert.equal(sourceChecked.length, 1);
    assert.equal(catalogOnly.length, 49);

    const ramal = e.getMeterAtlasEntry('ramal-musamman-mahzoof');
    assert.ok(ramal);
    assert.equal(ramal.reviewStage, 'source-checked');
    assert.equal(ramal.workedExample.wordsMisra1.length, 8);
    assert.equal(ramal.workedExample.feetMisra1.length, 4);
    assert.equal(ramal.counterExample.brokenFootIndex, 3);
    assert.ok(ramal.practiceExercise.options.some(o => o.isCorrect));
  });
  await test('slot rhyme builder supports per-box Urdu alphabet selection (custom_set, exclude_set, phonetic families) across 58,604 words', () => {
    assert.ok(e.URDU_ALPHABET.length >= 38);
    assert.ok(e.URDU_LETTER_FAMILIES.length >= 5);

    // 3-box slot: Box 1 = custom_set [ش, ج, م], Box 2 = locked 'ا', Box 3 = locked 'م'
    const customSlots = [
      { id: 's1', char: 'ش', state: 'custom_set', customChars: ['ش', 'ج', 'م'] },
      { id: 's2', char: 'ا', state: 'locked' },
      { id: 's3', char: 'م', state: 'locked' },
    ];
    const res = e.querySlotRhymes({ slots: customSlots, exactLength: true });
    const matchedWords = res.matches.map(m => m.word);
    assert.ok(matchedWords.includes('شام'));
    assert.ok(matchedWords.includes('جام'));
    assert.ok(!matchedWords.includes('نام'));

    // Exclude set: Box 1 excludes 'ش', Box 2 = 'ا', Box 3 = 'م'
    const excludeSlots = [
      { id: 's1', char: 'ش', state: 'exclude_set', customChars: ['ش'] },
      { id: 's2', char: 'ا', state: 'locked' },
      { id: 's3', char: 'م', state: 'locked' },
    ];
    const exRes = e.querySlotRhymes({ slots: excludeSlots, exactLength: true });
    const exWords = exRes.matches.map(m => m.word);
    assert.ok(!exWords.includes('شام'));
    assert.ok(exWords.includes('نام'));
  });
  console.log(`${passed} prosody checks passed.`);
} finally { await rm(temporary,{recursive:true,force:true}); }
