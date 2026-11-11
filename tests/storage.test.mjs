import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const temporary = await mkdtemp(join(tmpdir(), 'likho-storage-'));
const originalStorage = globalThis.localStorage;
const originalError = console.error;
const memory = new Map();
let writes = 0;
const key = 'qalam_drafts_v1';
const item = { id: 'draft-initial-ghalib', title: 'نازہ UUUU', poet: 'اصل شاعر', form: 'ghazal', content: 'll ll میری عبارت', tags: [], qafiyaList: [], createdAt: 1, updatedAt: 1 };
try {
  globalThis.localStorage = {
    getItem: k => memory.get(k) ?? null,
    setItem: (k, value) => { writes++; memory.set(k, value); },
    removeItem: k => { memory.delete(k); },
  };
  console.error = () => {}; // Expected rejection paths; assertions below verify no mutation.
  await build({ entryPoints: ['src/services/storageService.ts'], bundle: true, platform: 'node', format: 'esm', outfile: join(temporary, 'storage.mjs') });
  const { StorageService: service } = await import(pathToFileURL(join(temporary, 'storage.mjs')));
  let passed = 0;
  const test = (name, fn) => { memory.clear(); writes = 0; fn(); passed++; console.log(`✓ ${name}`); };
  test('absent-key reads are pure; explicit initialization seeds exactly once', () => {
    assert.deepEqual(service.getDrafts(), []); assert.equal(writes, 0);
    assert.equal(service.initializeDrafts().length, 1); assert.equal(writes, 1);
    service.initializeDrafts(); service.getDrafts(); assert.equal(writes, 1);
  });
  test('valid sample edits and exact metadata are returned without writes or spelling changes', () => {
    const raw = '  ' + JSON.stringify([item]) + '\n'; memory.set(key, raw);
    assert.deepEqual(service.getDrafts(), [item]); assert.equal(memory.get(key), raw); assert.equal(writes, 0);
    assert.deepEqual(service.initializeDrafts(), [item]); assert.equal(writes, 0);
  });
  test('valid empty portfolio remains empty through initialization', () => {
    memory.set(key, '[]'); assert.deepEqual(service.initializeDrafts(), []); assert.equal(writes, 0);
  });
  test('save and delete preserve malformed original payloads byte-for-byte', () => {
    for (const raw of ['', '{broken', 'null', '{}', '[null]', JSON.stringify([{ ...item, content: 42 }]), JSON.stringify([item, item])]) {
      memory.set(key, raw);
      assert.deepEqual(service.initializeDrafts(), []);
      assert.equal(service.saveDraft(item), false); assert.equal(service.deleteDraft(item.id), false);
      assert.equal(memory.get(key), raw); assert.equal(writes, 0);
    }
  });
  test('ordinary save preserves unrelated drafts and all exact text', () => {
    const other = { ...item, id: 'other', content: 'متن ثانی' };
    memory.set(key, JSON.stringify([item, other]));
    assert.equal(service.saveDraft({ ...item, content: 'نیا مکمل متن' }), true);
    const saved = JSON.parse(memory.get(key));
    assert.equal(saved[0].content, 'نیا مکمل متن'); assert.equal(saved[0].title, item.title); assert.deepEqual(saved[1], other);
  });
  test('invalid incoming draft cannot corrupt a valid portfolio', () => {
    const raw = JSON.stringify([item]); memory.set(key, raw);
    assert.equal(service.saveDraft({ ...item, tags: null }), false); assert.equal(memory.get(key), raw); assert.equal(writes, 0);
  });
  test('deleting the final stored draft leaves a valid empty portfolio', () => {
    memory.set(key, JSON.stringify([item])); assert.equal(service.deleteDraft(item.id), true);
    assert.deepEqual(service.initializeDrafts(), []); assert.equal(memory.get(key), '[]'); assert.equal(writes, 1);
  });
  test('failed write returns false and leaves the previous bytes intact', () => {
    const raw = JSON.stringify([item]); memory.set(key, raw);
    const setItem = globalThis.localStorage.setItem;
    globalThis.localStorage.setItem = () => { throw new Error('Injected failure'); };
    try { assert.equal(service.saveDraft({ ...item, content: 'نیا متن' }), false); assert.equal(memory.get(key), raw); }
    finally { globalThis.localStorage.setItem = setItem; }
  });
  test('corrupt store is reported with its exact bytes and cannot be replaced implicitly', () => {
    const raw = '{broken-corrupt-original';
    memory.set(key, raw);
    const snapshot = service.readPortfolio();
    assert.equal(snapshot.status, 'corrupt'); assert.equal(snapshot.raw, raw);
    assert.equal(service.saveDraft(item), false); assert.equal(service.deleteDraft(item.id), false);
    assert.equal(memory.get(key), raw); assert.equal(writes, 0);
  });
  test('malformed and wrong-version backups are rejected before any write', () => {
    const raw = JSON.stringify([item]); memory.set(key, raw);
    for (const bad of [
      'not-json',
      JSON.stringify({ version: '2.0', drafts: [item] }),
      JSON.stringify({ version: '1.0', drafts: [{ ...item, content: 42 }] }),
      JSON.stringify({ version: '1.0', drafts: [item], prefs: { theme: 'neon' } }),
      JSON.stringify({ version: '1.0', drafts: [item, item] }),
      JSON.stringify({ version: '1.0' }),
    ]) {
      assert.equal(service.restoreBackup(bad).success, false);
      assert.equal(memory.get(key), raw); assert.equal(writes, 0);
    }
  });
  test('valid restore preserves exact previous drafts and prefs for recovery', () => {
    const raw = JSON.stringify([item]);
    const oldPrefs = '{"theme":"dark"}';
    memory.set(key, raw); memory.set('qalam_workspace_prefs', oldPrefs);
    const replacement = { ...item, id: 'restored', content: 'بحال شدہ متن' };
    const result = service.restoreBackup(JSON.stringify({ version: '1.0', drafts: [replacement], prefs: { theme: 'white' } }));
    assert.equal(result.success, true); assert.equal(result.recoverySaved, true);
    assert.equal(memory.get('qalam_recovery_drafts_v1'), raw);
    assert.equal(memory.get('qalam_recovery_prefs_v1'), oldPrefs);
    assert.deepEqual(JSON.parse(memory.get(key)), [replacement]);
    assert.equal(JSON.parse(memory.get('qalam_workspace_prefs')).theme, 'white');
  });
  test('quiet view preferences remain valid in portfolio backup restoration', () => {
    for (const activePreset of ['quiet', 'quiet_rhymes']) {
      const result = service.restoreBackup(JSON.stringify({ version: '1.0', drafts: [item], prefs: { activePreset } }));
      assert.equal(result.success, true);
      assert.equal(JSON.parse(memory.get('qalam_workspace_prefs')).activePreset, activePreset);
    }
  });
  test('restore stops before replacement when the recovery copy cannot be written', () => {
    const raw = JSON.stringify([item]); memory.set(key, raw);
    const setItem = globalThis.localStorage.setItem;
    globalThis.localStorage.setItem = (k, value) => {
      if (k === 'qalam_recovery_drafts_v1') throw new Error('recovery blocked');
      return setItem.call(globalThis.localStorage, k, value);
    };
    try {
      const result = service.restoreBackup(JSON.stringify({ version: '1.0', drafts: [{ ...item, id: 'new' }] }));
      assert.equal(result.success, false); assert.equal(result.recoverySaved, undefined);
      assert.equal(memory.get(key), raw); assert.equal(writes, 0);
    } finally { globalThis.localStorage.setItem = setItem; }
  });
  test('failed prefs commit rolls the drafts write back instead of accepting a partial restore', () => {
    const raw = JSON.stringify([item]); memory.set(key, raw);
    const oldPrefs = '{"theme":"dark"}'; memory.set('qalam_workspace_prefs', oldPrefs);
    const setItem = globalThis.localStorage.setItem;
    globalThis.localStorage.setItem = (k, value) => {
      if (k === 'qalam_workspace_prefs' && value.includes('white')) throw new Error('prefs blocked');
      return setItem.call(globalThis.localStorage, k, value);
    };
    try {
      const result = service.restoreBackup(JSON.stringify({ version: '1.0', drafts: [{ ...item, id: 'new' }], prefs: { theme: 'white' } }));
      assert.equal(result.success, false); assert.equal(result.partial, undefined);
      assert.equal(memory.get(key), raw); assert.equal(memory.get('qalam_workspace_prefs'), oldPrefs);
    } finally { globalThis.localStorage.setItem = setItem; }
  });
  test('active draft identity is persisted and can be cleared after deletion', () => {
    service.setActiveDraftId(item.id);
    assert.equal(service.getActiveDraftId(), item.id);
    service.setActiveDraftId(null);
    assert.equal(service.getActiveDraftId(), null);
  });
  console.log(`${passed} storage checks passed.`);
} finally {
  console.error = originalError;
  if (originalStorage === undefined) delete globalThis.localStorage; else globalThis.localStorage = originalStorage;
  await rm(temporary, { recursive: true, force: true });
}
