import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  SCHEMA_VERSION,
  SUPPORTED_METER_MINIMUM,
  loadMeters,
  meterPatternVariants,
  validateBenchmark
} from '../scripts/validate-benchmark.mjs';

const root = process.cwd();
const pilotPath = join(root, 'data/benchmarks/prosody/pilot-2026-10/benchmark.json');
const schemaPath = join(root, 'data/benchmarks/prosody/schema/benchmark.schema.json');
const pilotText = await readFile(pilotPath, 'utf8');
const pilot = JSON.parse(pilotText);
const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
const meters = await loadMeters(root);
const validate = data => validateBenchmark(data, { meters, rootDir: root });
const clone = () => structuredClone(pilot);
const errorCodes = result => result.errors.map(error => error.code);

function expectError(result, code) {
  assert.equal(result.ok, false, `Expected an error before checking for ${code}.`);
  assert.ok(errorCodes(result).includes(code), `Expected ${code}; got ${errorCodes(result).join(', ') || 'none'}.`);
}

test('schema is parseable and exposes the item contract', () => {
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(schema.properties.schemaVersion.const, SCHEMA_VERSION);
  assert.ok(schema.$defs.item);
  for (const field of ['id', 'text', 'source', 'provenance', 'target', 'expectation', 'analyses', 'reviewerDecisions', 'adjudication', 'uncertainty']) {
    assert.ok(schema.$defs.item.required.includes(field), `Item schema must require ${field}.`);
  }
  assert.ok(schema.$defs.analysis.required.includes('readings'));
  assert.ok(schema.$defs.review.required.includes('blindToEngineOutput'));
});

test('the ten-item internal pilot validates with on-disk pins', () => {
  const result = validate(pilot);
  assert.equal(result.ok, true, JSON.stringify(result.errors, null, 2));
  assert.equal(result.errors.length, 0);
  assert.equal(result.stats.items, 10);
  assert.equal(result.stats.analyses, 10);
  assert.equal(result.stats.readings, 84);
  assert.equal(result.stats.sourceRevisions, 6);
  assert.deepEqual(result.stats.classifications, { admissible: 10 });
  assert.deepEqual(result.stats.authors, ['مرزا غالب']);
});

test('the pilot records six distinct target meters and no supported-form claim', () => {
  const meterIds = new Set(pilot.items.map(item => item.target.meterId));
  assert.deepEqual([...meterIds].sort(), [
    'hazaj-musamman-salim',
    'khafeef-musaddas-variant',
    'rajaz-musamman-matwi-makhboon',
    'ramal-musamman-mahzoof',
    'ramal-musamman-makhboon-maqtoo',
    'ramal-musamman-mashkool'
  ]);
  assert.ok(pilot.items.every(item => item.target.supported === false));
  assert.ok(pilot.items.every(item => item.expectation.goldStatus === 'pilot-unadjudicated'));
  assert.equal(pilot.benchmark.review.mode, 'single-annotator');
  assert.equal(pilot.benchmark.review.blindToEngineOutput, false);
  assert.equal(pilot.benchmark.review.annotationBasis, 'engine-assisted-internal');
});

test('meter variant generation covers initial, caesura and terminal variants', () => {
  const khafeef = meters.find(meter => meter.id === 'khafeef-musaddas-variant');
  assert.ok(meterPatternVariants(khafeef).some(variant => variant.notes.includes('initial-short')));
  const rajaz = meters.find(meter => meter.id === 'rajaz-musamman-matwi-makhboon');
  assert.ok(meterPatternVariants(rajaz).some(variant => variant.notes.includes('caesura-short')));
  const ramal = meters.find(meter => meter.id === 'ramal-musamman-mahzoof');
  assert.ok(meterPatternVariants(ramal).some(variant => variant.notes.includes('terminal-short')));
});

test('rejects a different schema version', () => {
  const data = clone();
  data.schemaVersion = '2.0.0';
  expectError(validate(data), 'schema-version');
});

test('rejects duplicate item identifiers', () => {
  const data = clone();
  data.items[1].id = data.items[0].id;
  expectError(validate(data), 'duplicate-item-id');
});

test('rejects duplicate item text', () => {
  const data = clone();
  data.items[1].text = data.items[0].text;
  expectError(validate(data), 'duplicate-item-text');
});

test('rejects non-NFC text', () => {
  const data = clone();
  data.items[0].text = '\u0627\u0653' + data.items[0].text.slice(1);
  assert.notEqual(data.items[0].text, data.items[0].text.normalize('NFC'));
  expectError(validate(data), 'text-not-nfc');
});

test('rejects a source oldid that does not match the revision field', () => {
  const data = clone();
  data.items[0].source.url = data.items[0].source.url.replace(/oldid=\d+/u, 'oldid=999999');
  expectError(validate(data), 'source-oldid-mismatch');
});

test('rejects a non-Wikisource host', () => {
  const data = clone();
  data.items[0].source.url = 'https://example.com/wiki/x?oldid=10301';
  expectError(validate(data), 'source-url-host');
});

test('rejects a public-domain item without a rights basis', () => {
  const data = clone();
  data.items[0].source.rightsBasis = '';
  expectError(validate(data), 'source-rights-basis');
});

test('rejects an unknown target meter', () => {
  const data = clone();
  data.items[0].target.meterId = 'not-a-meter';
  expectError(validate(data), 'target-meter-unknown');
});

test('rejects a target pattern that is not a documented meter variant', () => {
  const data = clone();
  data.items[0].target.targetPattern = '=';
  expectError(validate(data), 'target-pattern-unknown');
});

test('rejects a meter name that no longer matches the meter table', () => {
  const data = clone();
  data.items[0].target.meterNameEnglish = 'Wrong name';
  expectError(validate(data), 'target-meter-name-mismatch');
});

test('rejects a reading span that does not slice the exact token', () => {
  const data = clone();
  data.items[0].analyses[0].readings[0].charStart = 1;
  expectError(validate(data), 'reading-span-mismatch');
});

test('rejects concatenated readings that do not rebuild the actual pattern', () => {
  const data = clone();
  data.items[0].analyses[0].readings[0].readingPattern = '=';
  expectError(validate(data), 'analysis-pattern-mismatch');
});

test('rejects distance zero with different target and actual patterns', () => {
  const data = clone();
  const analysis = data.items[0].analyses[0];
  analysis.distance = 0;
  analysis.actualPattern = analysis.actualPattern.slice(0, -1) + (analysis.actualPattern.endsWith('=') ? '-' : '=');
  expectError(validate(data), 'analysis-distance-zero-pattern');
});

test('rejects an admissible analysis with positive distance', () => {
  const data = clone();
  data.items[0].analyses[0].distance = 1;
  expectError(validate(data), 'admissible-analysis-distance');
});

test('rejects a missing analysis reference in the expectation', () => {
  const data = clone();
  data.items[0].expectation.admissibleAnalysisIds = ['A9'];
  expectError(validate(data), 'expectation-analysis-missing');
});

test('rejects an invalid classification that still names an admissible analysis', () => {
  const data = clone();
  data.items[0].expectation.classification = 'invalid-against-target';
  expectError(validate(data), 'non-admissible-has-analysis-ids');
});

test('rejects an unknown reviewer in a decision', () => {
  const data = clone();
  data.items[0].reviewerDecisions[0].reviewerId = 'rev-missing';
  expectError(validate(data), 'decision-reviewer-unknown');
});

test('rejects an accept decision without an analysis', () => {
  const data = clone();
  data.items[0].reviewerDecisions[0].analysisId = null;
  expectError(validate(data), 'decision-accept-without-analysis');
});

test('rejects an unknown selected adjudication analysis', () => {
  const data = clone();
  data.items[0].adjudication.status = 'agreed';
  data.items[0].adjudication.selectedAnalysisId = 'A9';
  data.items[0].adjudication.adjudicatorId = 'rev-internal-1';
  data.items[0].adjudication.decidedAt = '2026-10-29';
  expectError(validate(data), 'adjudication-selected-unknown');
});

test('rejects a pilot item marked as adjudicated gold', () => {
  const data = clone();
  data.items[0].expectation.goldStatus = 'adjudicated-gold';
  expectError(validate(data), 'pilot-gold-claim');
});

test('rejects support claims in an internal pilot', () => {
  const data = clone();
  data.items[0].target.supported = true;
  expectError(validate(data), 'pilot-claims-support');
});

test('rejects a poem that leaks across splits', () => {
  const data = clone();
  data.items[1].provenance.split = 'dev';
  expectError(validate(data), 'poem-split-leak');
});

test('rejects the none uncertainty code combined with another code', () => {
  const data = clone();
  data.items[0].uncertainty.codes = ['none', 'izafat'];
  expectError(validate(data), 'uncertainty-none-exclusive');
});

test('rejects an unresolved item without a specific uncertainty code', () => {
  const data = clone();
  data.items[0].expectation.classification = 'unresolved';
  data.items[0].expectation.admissibleAnalysisIds = [];
  data.items[0].uncertainty.codes = ['none'];
  expectError(validate(data), 'unresolved-without-uncertainty');
});

test('rejects an analysis whose target differs from the item target on the same meter', () => {
  const data = clone();
  const meter = meters.find(candidate => candidate.id === data.items[0].target.meterId);
  const alternate = meterPatternVariants(meter).find(variant => variant.pattern !== data.items[0].target.targetPattern);
  assert.ok(alternate, 'Expected a documented alternate variant for this meter.');
  data.items[0].analyses[0].targetPattern = alternate.pattern;
  expectError(validate(data), 'analysis-target-mismatch');
});

test('rejects a reviewer whose independence flag contradicts their qualification', () => {
  const data = clone();
  data.benchmark.review.reviewers[0].independent = true;
  expectError(validate(data), 'reviewer-independence-mismatch');
});

test('rejects a blind-human basis that was not blind to engine output', () => {
  const data = clone();
  data.benchmark.review.annotationBasis = 'blind-human';
  expectError(validate(data), 'review-basis-conflict');
});

test('rejects measured effort without a minutes value', () => {
  const data = clone();
  data.benchmark.review.effortObservation.measured = true;
  data.benchmark.review.effortObservation.minutesPerItem = null;
  expectError(validate(data), 'effort-observation-inconsistent');
});

test('rejects an independent-double review with only one reviewer', () => {
  const data = clone();
  data.benchmark.review.mode = 'independent-double';
  expectError(validate(data), 'review-double-underpowered');
});

test('rejects complete adjudication without an adjudicator', () => {
  const data = clone();
  data.benchmark.review.adjudicationStatus = 'complete';
  expectError(validate(data), 'adjudication-complete-without-adjudicator');
});

test('rejects an engine source digest that does not match its file pins', () => {
  const data = clone();
  data.benchmark.engine.sourceDigest.digest = '0'.repeat(64);
  expectError(validate(data), 'source-digest-mismatch');
});

test('rejects a source file hash that does not match disk', () => {
  const data = clone();
  data.benchmark.engine.sourceDigest.files[0].sha256 = '0'.repeat(64);
  expectError(validate(data), 'source-file-hash-mismatch');
});

test('rejects a lexicon hash that does not match the runtime dictionary', () => {
  const data = clone();
  data.benchmark.engine.lexicon.sha256 = '0'.repeat(64);
  expectError(validate(data), 'lexicon-hash-mismatch');
});

test('rejects a frozen benchmark that claims a supported form below the evidence threshold', () => {
  const data = clone();
  data.benchmark.status = 'frozen';
  data.items[0].target.supported = true;
  const result = validate(data);
  expectError(result, 'supported-meter-underpowered');
  assert.equal(SUPPORTED_METER_MINIMUM, 10);
});

test('rejects a missing protocol path when a root directory is supplied', () => {
  const data = clone();
  data.benchmark.protocol.path = 'docs/DOES_NOT_EXIST.md';
  expectError(validate(data), 'protocol-path-missing');
});

test('the pilot has no validator warnings on the current tree', () => {
  const result = validate(pilot);
  assert.equal(result.ok, true);
  assert.deepEqual(result.warnings, []);
});
