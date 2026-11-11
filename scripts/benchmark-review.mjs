#!/usr/bin/env node
/**
 * Freeze and blind-packet tooling for the Likho prosody benchmark.
 *
 * The pilot benchmark file contains engine metre assignments, target patterns
 * and acceptance results. Reviewers must not see those. This script derives a
 * separate freeze of the evidence (text, provenance, source revisions) and
 * builds reviewer packets from the freeze only, so engine output cannot leak
 * through a copy step.
 *
 * Subcommands:
 *   freeze [--sources|--offline]   Build freeze.json from benchmark.json
 *   packets                        Build reviewer packets and adjudication template
 *   verify                         Check freeze, packets and cross-file consistency
 *
 * Generated artifacts are data, not review. A packet is a blank worksheet until
 * a named, qualified reviewer fills and signs it.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const FREEZE_SCHEMA_VERSION = '1.0.0';
export const REVIEWER_SLOTS = ['reviewer-a', 'reviewer-b'];
export const PILOT_DIR = 'data/benchmarks/prosody/pilot-2026-10';
export const BENCHMARK_FILE = `${PILOT_DIR}/benchmark.json`;
export const FREEZE_FILE = `${PILOT_DIR}/freeze.json`;
export const PACKET_DIR = `${PILOT_DIR}/packets`;

const UNICODE_PUNCTUATION = /[\p{P}\p{S}\s]/gu;

/** Keys that would reveal an engine analysis, metre answer or acceptance result. */
export const FORBIDDEN_ITEM_KEYS = [
  'analyses',
  'expectation',
  'target',
  'adjudication',
  'reviewerDecisions',
  'uncertainty',
  'notes',
  'distance',
  'actualPattern',
  'meterNotes',
  'classification',
  'goldStatus',
  'supported',
  'readings',
  'sourceIds',
  'rules',
  'meterId',
  'tokenIndex',
  'readingPattern',
  'alternativeReadings',
  'admissibleAnalysisIds'
];

export const UNCERTAINTY_CODES = [
  ['none', 'No unresolved ambiguity remains. Appears alone.'],
  ['word-boundary', 'The reading depends on how adjacent words are joined or separated.'],
  ['izafat', 'An izafat mark, or its absence, changes the reading.'],
  ['hamza', 'A hamza-bearing form affects the syllable or weight.'],
  ['shadda', 'A shadda affects the consonant length or weight.'],
  ['nasalization', 'A noon ghunna or nasalized vowel affects the reading.'],
  ['aspiration', 'An aspirated consonant affects the onset or weight.'],
  ['consonant-cluster', 'A cluster is metrically ambiguous or requires a lexical reading.'],
  ['terminal-pause', 'The line ending is read with a pause or terminal shortening.'],
  ['caesura', 'The mid-line boundary permits a documented caesura variant.'],
  ['meter-variant', 'A named variant such as initial-short, caesura-short or terminal-short is used.'],
  ['meter-ambiguity', 'More than one supported metre or analysis is admissible.'],
  ['source-orthography', 'The source spelling differs from the usual or normalized form.'],
  ['punctuation', 'Source punctuation affects tokenization or line boundaries.'],
  ['unsupported-vocabulary', 'A word lacks attested pronunciation evidence.'],
  ['script-variant', 'Unicode, script or character-form variation affects the text.'],
  ['other', 'A specific uncertainty not covered above; explain in the note.']
];

const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');
export const textSha256 = text => sha256(Buffer.from(text, 'utf8'));
const fileSha256 = path => sha256(readFileSync(path));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const looseText = text => text.normalize('NFC').replace(UNICODE_PUNCTUATION, '');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/**
 * Build the sealed evidence freeze. Deliberately copies only source evidence:
 * never target, expectation, analyses, readings, uncertainty or review state.
 */
export function buildFreeze(benchmarkData, options) {
  const { benchmarkSha256, frozenAt, sourceChecks = null, freezeVersion = '1.0.0' } = options || {};
  assert(isObject(benchmarkData), 'Benchmark data must be an object.');
  assert(isObject(benchmarkData.benchmark), 'Benchmark header is missing.');
  assert(Array.isArray(benchmarkData.items) && benchmarkData.items.length > 0, 'Benchmark has no items.');
  assert(typeof benchmarkSha256 === 'string' && /^[0-9a-f]{64}$/.test(benchmarkSha256), 'A benchmark SHA-256 is required.');
  assert(typeof frozenAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(frozenAt), 'A freeze date is required.');

  const seen = new Set();
  const items = benchmarkData.items.map(item => {
    assert(isObject(item), 'Every benchmark item must be an object.');
    assert(typeof item.id === 'string' && item.id, 'Every item needs an id.');
    assert(!seen.has(item.id), `Duplicate item id ${item.id}.`);
    seen.add(item.id);
    assert(typeof item.text === 'string' && item.text, `Item ${item.id} has no text.`);
    assert(isObject(item.source), `Item ${item.id} has no source.`);
    assert(isObject(item.provenance), `Item ${item.id} has no provenance.`);

    const check = sourceChecks ? sourceChecks[item.id] || null : null;
    return {
      id: item.id,
      text: item.text,
      textSha256: textSha256(item.text),
      language: item.language,
      script: item.script,
      unicodeNormalization: item.unicodeNormalization,
      source: {
        kind: item.source.kind,
        title: item.source.title,
        author: item.source.author,
        authorDeathYear: item.source.authorDeathYear,
        publicationYear: item.source.publicationYear,
        url: item.source.url,
        revisionId: item.source.revisionId,
        retrievedAt: item.source.retrievedAt,
        rightsStatus: item.source.rightsStatus,
        rightsBasis: item.source.rightsBasis,
        license: item.source.license
      },
      provenance: {
        poemId: item.provenance.poemId,
        poemTitle: item.provenance.poemTitle,
        verseLineIndex: item.provenance.verseLineIndex,
        coupletIndex: item.provenance.coupletIndex,
        half: item.provenance.half,
        textStatus: item.provenance.textStatus
      },
      sourceCheck: check
    };
  });

  const checked = items.filter(item => item.sourceCheck && item.sourceCheck.exactMatch === true).length;
  return {
    schemaVersion: FREEZE_SCHEMA_VERSION,
    freeze: {
      id: `${benchmarkData.benchmark.id}-freeze`,
      version: freezeVersion,
      benchmarkId: benchmarkData.benchmark.id,
      benchmarkVersion: benchmarkData.benchmark.version,
      benchmarkFile: BENCHMARK_FILE,
      benchmarkSha256,
      frozenAt,
      status: 'frozen-awaiting-review',
      itemCount: items.length,
      immutability:
        'These ten items and their pinned source revisions are fixed for the internal review. Do not edit this file, the benchmark file it seals, or the reviewer packets while annotation is in progress. Any correction creates a new freeze version and new packets.',
      sourceVerification: {
        performed: Boolean(sourceChecks),
        method:
          'HTTPS GET of the pinned Wikisource oldid with action=raw, then exact substring match of the item text against the returned wikitext.',
        checkedAt: sourceChecks ? frozenAt : null,
        itemsChecked: sourceChecks ? items.length : 0,
        itemsMatchingExactly: sourceChecks ? checked : 0,
        complete: Boolean(sourceChecks) && checked === items.length
      }
    },
    items
  };
}

/** Build one blank packet for a reviewer slot. Items are identical across slots. */
export function buildPacket(freeze, slot, options) {
  const { freezeSha256, createdAt, protocolVersion = '0.1.1' } = options || {};
  assert(REVIEWER_SLOTS.includes(slot), `Unknown reviewer slot ${slot}.`);
  assert(isObject(freeze) && Array.isArray(freeze.items) && freeze.items.length, 'Freeze has no items.');
  assert(typeof freezeSha256 === 'string' && /^[0-9a-f]{64}$/.test(freezeSha256), 'A freeze SHA-256 is required.');
  assert(typeof createdAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(createdAt), 'A packet date is required.');

  return {
    schemaVersion: FREEZE_SCHEMA_VERSION,
    packet: {
      id: `${freeze.freeze.id}-${slot}`,
      reviewerSlot: slot,
      status: 'awaiting-review',
      createdAt,
      freeze: {
        id: freeze.freeze.id,
        version: freeze.freeze.version,
        sha256: freezeSha256,
        frozenAt: freeze.freeze.frozenAt
      },
      protocol: {
        id: 'LKH-PRO-PROTOCOL',
        version: protocolVersion,
        path: 'docs/PROSODY_BENCHMARK_PROTOCOL.md'
      },
      instructionsPath: 'docs/PROSODY_BENCHMARK_REVIEW_2026-10.md',
      reviewer: {
        id: null,
        name: null,
        qualification: null,
        independent: null,
        conflictStatement: null,
        assignedAt: null
      },
      task: {
        mode: 'metre-blind-first-pass',
        description:
          'Analyse each line independently. Record the metre and scansion you can defend, word readings and licensed rules, your verdict, uncertainty and elapsed minutes. Do not consult the pilot benchmark file, engine output, the other reviewer, or any prior result.',
        timeUnit: 'minutes',
        requiredPerItem: ['metre', 'pattern', 'wordReadings', 'verdict', 'uncertaintyCodes', 'minutes', 'decidedAt']
      },
      withheld: [
        'Engine metre assignment and target pattern',
        'Engine scansion distance and actual pattern',
        'Engine word readings and alternative readings',
        'Engine acceptance classification and admissible-analysis ids',
        'Engine uncertainty codes and notes',
        'Adjudication state and the other reviewer worksheet'
      ],
      uncertaintyCodes: UNCERTAINTY_CODES.map(([code, useWhen]) => ({ code, useWhen }))
    },
    items: freeze.items.map(item => ({
      id: item.id,
      text: item.text,
      language: item.language,
      script: item.script,
      source: item.source,
      provenance: item.provenance,
      itemCategory: 'natural-line',
      response: {
        status: 'awaiting-review',
        metre: { id: null, nameUrdu: null, nameEnglish: null, pattern: null },
        wordReadings: [],
        verdict: null,
        uncertaintyCodes: [],
        uncertaintyNote: null,
        minutes: null,
        notes: null,
        decidedAt: null,
        reviewerSignature: null
      }
    }))
  };
}

/** Blank adjudication record. Populated only after both packets are submitted. */
export function buildAdjudicationTemplate(freeze, options) {
  const { freezeSha256, createdAt, protocolVersion = '0.1.1' } = options || {};
  return {
    schemaVersion: FREEZE_SCHEMA_VERSION,
    adjudication: {
      id: `${freeze.freeze.id}-adjudication`,
      status: 'awaiting-submissions',
      createdAt,
      freeze: { id: freeze.freeze.id, version: freeze.freeze.version, sha256: freezeSha256 },
      protocol: { id: 'LKH-PRO-PROTOCOL', version: protocolVersion, path: 'docs/PROSODY_BENCHMARK_PROTOCOL.md' },
      adjudicator: null,
      note:
        'Do not fill this record until both reviewer packets are submitted. The adjudicator must not be either annotator and must not have seen engine output before reviewing both worksheets.'
    },
    items: freeze.items.map(item => ({
      id: item.id,
      reviewerA: null,
      reviewerB: null,
      agreement: null,
      resolution: {
        status: 'pending',
        selectedWorksheet: null,
        finalMetreId: null,
        finalPattern: null,
        rationale: null,
        residualUncertainty: null,
        decidedAt: null,
        adjudicatorSignature: null
      }
    }))
  };
}

function findForbiddenKeys(value, path, found) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => findForbiddenKeys(entry, `${path}[${index}]`, found));
    return;
  }
  if (!isObject(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    const next = path ? `${path}.${key}` : key;
    if (FORBIDDEN_ITEM_KEYS.includes(key)) found.push(next);
    findForbiddenKeys(entry, next, found);
  }
}

const ALLOWED_RESPONSE_KEYS = new Set([
  'status', 'metre', 'wordReadings', 'verdict', 'uncertaintyCodes', 'uncertaintyNote',
  'minutes', 'notes', 'decidedAt', 'reviewerSignature'
]);
const ALLOWED_METRE_KEYS = new Set(['id', 'nameUrdu', 'nameEnglish', 'pattern']);
const ALLOWED_WORD_READING_KEYS = new Set(['token', 'pattern', 'rule', 'note']);

/** The response block is the reviewer's own form; only allow the documented fields. */
function findUnexpectedResponseFields(response, path, found) {
  if (!isObject(response)) {
    found.push(path);
    return;
  }
  for (const key of Object.keys(response)) {
    if (!ALLOWED_RESPONSE_KEYS.has(key)) found.push(`${path}.${key}`);
  }
  if (isObject(response.metre)) {
    for (const key of Object.keys(response.metre)) {
      if (!ALLOWED_METRE_KEYS.has(key)) found.push(`${path}.metre.${key}`);
    }
  }
  for (const [index, reading] of (Array.isArray(response.wordReadings) ? response.wordReadings : []).entries()) {
    if (!isObject(reading)) {
      found.push(`${path}.wordReadings[${index}]`);
      continue;
    }
    for (const key of Object.keys(reading)) {
      if (!ALLOWED_WORD_READING_KEYS.has(key)) found.push(`${path}.wordReadings[${index}].${key}`);
    }
  }
}

/** Verify freeze, packets and the sealed benchmark agree, and that packets leak nothing. */
export function verifyReviewArtifacts(rootDir) {
  const errors = [];
  const fail = (code, path, message) => errors.push({ code, path, message });
  const readJson = path => JSON.parse(readFileSync(resolve(rootDir, path), 'utf8'));

  let benchmark;
  let freeze;
  try {
    benchmark = readJson(BENCHMARK_FILE);
    freeze = readJson(FREEZE_FILE);
  } catch (error) {
    fail('artifact-unreadable', '$', `Could not read benchmark or freeze: ${error.message}`);
    return { ok: false, errors, stats: {} };
  }

  const benchmarkSha = fileSha256(resolve(rootDir, BENCHMARK_FILE));
  const freezeSha = fileSha256(resolve(rootDir, FREEZE_FILE));
  if (freeze.freeze?.benchmarkSha256 !== benchmarkSha) {
    fail('freeze-benchmark-hash', '$.freeze.benchmarkSha256', 'Freeze does not seal the current benchmark file.');
  }
  if (freeze.freeze?.itemCount !== freeze.items?.length) {
    fail('freeze-item-count', '$.freeze.itemCount', 'Freeze item count does not match its items array.');
  }

  const benchmarkById = new Map((benchmark.items || []).map(item => [item.id, item]));
  const freezeById = new Map((freeze.items || []).map(item => [item.id, item]));
  if (benchmarkById.size !== freezeById.size) {
    fail('freeze-item-set', '$.items', 'Freeze and benchmark item sets differ in size.');
  }

  for (const [id, frozen] of freezeById) {
    const source = benchmarkById.get(id);
    if (!source) {
      fail('freeze-item-extra', `$.items[${id}]`, 'Frozen item is not present in the benchmark.');
      continue;
    }
    if (frozen.text !== source.text) fail('freeze-text-mismatch', `$.items[${id}].text`, 'Frozen text differs from the benchmark text.');
    if (frozen.textSha256 !== textSha256(frozen.text || '')) fail('freeze-text-hash', `$.items[${id}].textSha256`, 'Frozen text hash does not match the frozen text.');
    if (frozen.source?.revisionId !== source.source?.revisionId) fail('freeze-revision-mismatch', `$.items[${id}].source.revisionId`, 'Frozen source revision differs from the benchmark.');
    if (frozen.source?.url !== source.source?.url) fail('freeze-source-url', `$.items[${id}].source.url`, 'Frozen source URL differs from the benchmark.');
    if (looseText(frozen.text || '') !== looseText(source.text || '')) fail('freeze-text-normalization', `$.items[${id}].text`, 'Frozen text differs after punctuation and spacing normalization.');
    const forbidden = [];
    findForbiddenKeys(frozen, `$.items[${id}]`, forbidden);
    if (forbidden.length) fail('freeze-leaks-engine-data', `$.items[${id}]`, `Freeze contains engine-data keys: ${forbidden.join(', ')}.`);
  }
  for (const id of benchmarkById.keys()) {
    if (!freezeById.has(id)) fail('freeze-item-missing', '$.items', `Benchmark item ${id} is not frozen.`);
  }
  if (freeze.freeze?.sourceVerification?.complete !== true) {
    fail('freeze-source-unverified', '$.freeze.sourceVerification', 'Pinned source revisions were not verified against Wikisource for this freeze.');
  }

  const reviewInstructionsPath = resolve(rootDir, 'docs/PROSODY_BENCHMARK_REVIEW_2026-10.md');
  if (!existsSync(reviewInstructionsPath)) {
    fail('missing-review-instructions', '$.reviewInstructionsPath', 'Reviewer instructions document docs/PROSODY_BENCHMARK_REVIEW_2026-10.md is missing. Packets reference this document; it must exist before verification passes.');
  }

  const slotBodies = new Map();
  for (const slot of REVIEWER_SLOTS) {
    const packetPath = `${PACKET_DIR}/${slot}.json`;
    let packet;
    try {
      packet = readJson(packetPath);
    } catch (error) {
      fail('packet-unreadable', packetPath, `Could not read packet: ${error.message}`);
      continue;
    }
    if (packet.packet?.reviewerSlot !== slot) fail('packet-slot', `${packetPath}.packet.reviewerSlot`, 'Packet reviewer slot does not match its file name.');
    if (packet.packet?.status !== 'awaiting-review') fail('packet-status', `${packetPath}.packet.status`, 'Packet is not in the awaiting-review state.');
    if (packet.packet?.freeze?.sha256 !== freezeSha) fail('packet-freeze-hash', `${packetPath}.packet.freeze.sha256`, 'Packet was not built from this freeze.');
    if (packet.packet?.reviewer?.id !== null || packet.packet?.reviewer?.independent !== null) {
      fail('packet-reviewer-preset', `${packetPath}.packet.reviewer`, 'Packet must not pre-assign a reviewer or an independence claim.');
    }
    if (!Array.isArray(packet.items) || packet.items.length !== freezeById.size) {
      fail('packet-item-count', `${packetPath}.items`, 'Packet item count does not match the freeze.');
    }
    const body = [];
    for (const [index, item] of (packet.items || []).entries()) {
      const itemPath = `${packetPath}.items[${index}]`;
      const frozen = freezeById.get(item.id);
      if (!frozen) {
        fail('packet-item-unknown', `${itemPath}.id`, 'Packet item is not in the freeze.');
        continue;
      }
      if (item.text !== frozen.text) fail('packet-text-mismatch', `${itemPath}.text`, 'Packet text differs from the freeze.');
      if (item.source?.revisionId !== frozen.source.revisionId) fail('packet-revision-mismatch', `${itemPath}.source.revisionId`, 'Packet source revision differs from the freeze.');
      if (item.provenance?.poemId !== frozen.provenance.poemId) fail('packet-provenance-mismatch', `${itemPath}.provenance`, 'Packet provenance differs from the freeze.');
      const forbidden = [];
      for (const [key, value] of Object.entries(item)) {
        if (key === 'response') continue;
        findForbiddenKeys(value, `${itemPath}.${key}`, forbidden);
      }
      if (forbidden.length) fail('packet-leaks-engine-data', itemPath, `Packet contains engine-data keys: ${forbidden.join(', ')}.`);
      const unexpected = [];
      findUnexpectedResponseFields(item.response, `${itemPath}.response`, unexpected);
      if (unexpected.length) fail('packet-response-unknown-field', `${itemPath}.response`, `Unexpected response fields: ${unexpected.join(', ')}.`);
      if (item.response?.status !== 'awaiting-review') fail('packet-response-status', `${itemPath}.response.status`, 'Packet response is not awaiting review.');
      if ((item.response?.wordReadings || []).length) fail('packet-response-prefilled', `${itemPath}.response.wordReadings`, 'Packet already contains readings.');
      if (item.response?.minutes !== null) fail('packet-response-prefilled', `${itemPath}.response.minutes`, 'Packet already contains timing.');
      body.push(item);
    }
    if ((packet.items || []).length !== freezeById.size) {
      fail('packet-item-missing', `${packetPath}.items`, 'Packet is missing frozen items.');
    }
    slotBodies.set(slot, JSON.stringify(body));
  }
  if (slotBodies.size === REVIEWER_SLOTS.length) {
    const [a, b] = REVIEWER_SLOTS.map(slot => slotBodies.get(slot));
    if (a !== b) fail('packet-slot-divergence', PACKET_DIR, 'Reviewer packets differ in item content; they must be identical apart from the slot header.');
  }

  return {
    ok: errors.length === 0,
    errors,
    stats: {
      items: freezeById.size,
      freezeSha256: freezeSha,
      benchmarkSha256: benchmarkSha,
      sourceVerified: freeze.freeze?.sourceVerification?.itemsMatchingExactly ?? 0
    }
  };
}

/** Fetch a pinned Wikisource revision as raw wikitext. */
async function fetchSource(item) {
  const url = `${item.source.url}&action=raw`;
  const response = await fetch(url, { headers: { 'User-Agent': 'LikhoBenchmark/0.1 (research)' } });
  const body = await response.text();
  return { urlUsed: url, httpStatus: response.status, exactMatch: response.ok && body.includes(item.text) };
}

function renderMarkdown(packet) {
  const lines = [];
  lines.push(`# Annotation worksheet — ${packet.packet.reviewerSlot}`);
  lines.push('');
  lines.push(`Packet: \`${packet.packet.id}\``);
  lines.push(`Freeze: \`${packet.packet.freeze.id}\` version ${packet.packet.freeze.version}`);
  lines.push(`Protocol: ${packet.packet.protocol.version}`);
  lines.push(`Status: **${packet.packet.status}**`);
  lines.push('');
  lines.push('Do not consult the benchmark file, engine output, the other reviewer or prior results. Record times in whole minutes.');
  lines.push('');
  lines.push('Reviewer: ____________________  Qualification: ____________________  Independent: yes / no');
  lines.push('');
  lines.push('Conflict statement: ____________________________________________________________');
  lines.push('');
  for (const item of packet.items) {
    lines.push(`## ${item.id}`);
    lines.push('');
    lines.push(`**Text:** ${item.text}`);
    lines.push('');
    lines.push(`**Source:** ${item.source.title} — ${item.source.author}, revision ${item.source.revisionId}`);
    lines.push(`**URL:** ${item.source.url}`);
    lines.push(`**Position:** couplet ${item.provenance.coupletIndex}, ${item.provenance.half} half, verse line ${item.provenance.verseLineIndex}`);
    lines.push('');
    lines.push('- Metre (name and id, if known):');
    lines.push('- Scansion pattern:');
    lines.push('- Word readings (token → pattern → licensed rule):');
    lines.push('- Verdict (admissible / inadmissible / unresolved / out-of-scope):');
    lines.push('- Uncertainty codes and note:');
    lines.push('- Elapsed minutes:');
    lines.push('- Notes:');
    lines.push('- Signature and date:');
    lines.push('');
  }
  return lines.join('\n');
}

function renderPacketReadme(packet) {
  return `# Reviewer packets — ${packet.packet.freeze.id}

Status: **awaiting independent reviewers**. No reviewer has been assigned and no annotation exists yet.

Files:

- \`reviewer-a.json\`, \`reviewer-b.json\` — authoritative submission templates. Fill only the \`response\` block of each item and the \`packet.reviewer\` block.
- \`reviewer-a.md\`, \`reviewer-b.md\` — printable working copies of the same items. Transcribe decisions into the JSON.
- \`adjudication-template.json\` — do not fill until both reviewer packets are submitted.

Rules:

1. Give each reviewer only their own packet and \`docs/PROSODY_BENCHMARK_REVIEW_2026-10.md\`.
2. Do not give reviewers \`benchmark.json\`, \`freeze.json\`, engine output, prior results or each other's packet.
3. Both packets contain identical item content. Only the slot header differs.
4. Record elapsed minutes per item, including source verification and write-up.
5. A packet stays \`awaiting-review\` until a named, qualified, independent reviewer signs it.

The pilot items were originally selected because the engine accepted them. That selection bias is known and must be reported with any result. It cannot support an accuracy claim.
`;
}

async function runFreeze(rootDir, { sources, offline }) {
  if (!sources && !offline) {
    throw new Error('Pass --sources to verify pinned Wikisource revisions, or --offline to record an unverified freeze.');
  }
  const benchmarkPath = resolve(rootDir, BENCHMARK_FILE);
  const benchmarkData = JSON.parse(readFileSync(benchmarkPath, 'utf8'));
  const benchmarkSha256 = fileSha256(benchmarkPath);
  const frozenAt = new Date().toISOString().slice(0, 10);
  let sourceChecks = null;
  if (sources) {
    sourceChecks = {};
    for (const item of benchmarkData.items) {
      const result = await fetchSource(item);
      sourceChecks[item.id] = { checkedAt: frozenAt, ...result };
      console.log(`${item.id} ${result.exactMatch ? 'exact match' : 'MISMATCH'} (HTTP ${result.httpStatus})`);
    }
  }
  const freeze = buildFreeze(benchmarkData, { benchmarkSha256, frozenAt, sourceChecks });
  writeFileSync(resolve(rootDir, FREEZE_FILE), JSON.stringify(freeze, null, 2) + '\n');
  console.log(`Wrote ${FREEZE_FILE}`);
  console.log(`Items ${freeze.items.length}, source verified ${freeze.freeze.sourceVerification.itemsMatchingExactly}/${freeze.items.length}`);
}

function runPackets(rootDir) {
  const freezePath = resolve(rootDir, FREEZE_FILE);
  const freeze = JSON.parse(readFileSync(freezePath, 'utf8'));
  const freezeSha256 = fileSha256(freezePath);
  const createdAt = new Date().toISOString().slice(0, 10);
  const packetDir = resolve(rootDir, PACKET_DIR);
  mkdirSync(packetDir, { recursive: true });
  for (const slot of REVIEWER_SLOTS) {
    const packet = buildPacket(freeze, slot, { freezeSha256, createdAt });
    writeFileSync(join(packetDir, `${slot}.json`), JSON.stringify(packet, null, 2) + '\n');
    writeFileSync(join(packetDir, `${slot}.md`), renderMarkdown(packet));
  }
  const adjudication = buildAdjudicationTemplate(freeze, { freezeSha256, createdAt });
  writeFileSync(join(packetDir, 'adjudication-template.json'), JSON.stringify(adjudication, null, 2) + '\n');
  writeFileSync(join(packetDir, 'README.md'), renderPacketReadme(buildPacket(freeze, 'reviewer-a', { freezeSha256, createdAt })));
  console.log(`Wrote packets for ${REVIEWER_SLOTS.join(', ')} and adjudication-template.json`);
  console.log(`Freeze SHA-256 ${freezeSha256}`);
}

async function main() {
  const rootDir = process.cwd();
  const [command, ...flags] = process.argv.slice(2);
  if (command === 'freeze') {
    await runFreeze(rootDir, { sources: flags.includes('--sources'), offline: flags.includes('--offline') });
  } else if (command === 'packets') {
    runPackets(rootDir);
  } else if (command === 'verify') {
    const result = verifyReviewArtifacts(rootDir);
    if (result.ok) {
      console.log(`Review artifacts valid: ${result.stats.items} items`);
      console.log(`Freeze SHA-256 ${result.stats.freezeSha256}`);
      console.log(`Benchmark SHA-256 ${result.stats.benchmarkSha256}`);
      console.log(`Source revisions verified ${result.stats.sourceVerified}/${result.stats.items}`);
    } else {
      console.error('Review artifacts invalid:');
      for (const error of result.errors) console.error(`  ${error.code} ${error.path}: ${error.message}`);
      process.exitCode = 1;
    }
  } else {
    console.error('Usage: node scripts/benchmark-review.mjs <freeze [--sources|--offline]|packets|verify>');
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
