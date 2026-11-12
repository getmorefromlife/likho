import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const temporary = await mkdtemp(join(tmpdir(), 'likho-voice-'));
const memory = new Map();

try {
  globalThis.localStorage = {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, value) => {
      memory.set(k, String(value));
    },
    removeItem: (k) => {
      memory.delete(k);
    },
    clear: () => {
      memory.clear();
    },
  };

  await build({
    entryPoints: [
      'src/services/voiceRecitationService.ts',
      'src/services/storageService.ts',
    ],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: temporary,
  });

  const { formatDurationMMSS, toUrduNumerals } = await import(
    pathToFileURL(join(temporary, 'voiceRecitationService.js'))
  );
  const { StorageService } = await import(
    pathToFileURL(join(temporary, 'storageService.js'))
  );

  let passed = 0;
  const test = (name, fn) => {
    memory.clear();
    fn();
    passed++;
    console.log(`✓ ${name}`);
  };

  test('formatDurationMMSS formats seconds to MM:SS string correctly', () => {
    assert.equal(formatDurationMMSS(0), '00:00');
    assert.equal(formatDurationMMSS(9), '00:09');
    assert.equal(formatDurationMMSS(45), '00:45');
    assert.equal(formatDurationMMSS(60), '01:00');
    assert.equal(formatDurationMMSS(125), '02:05');
    assert.equal(formatDurationMMSS(3600), '60:00');
  });

  test('toUrduNumerals converts Western Arabic digits to Urdu numerals', () => {
    assert.equal(toUrduNumerals('0123456789'), '۰۱۲۳۴۵۶۷۸۹');
    assert.equal(toUrduNumerals('02:05'), '۰۲:۰۵');
    assert.equal(toUrduNumerals('شعر 1'), 'شعر ۱');
  });

  test('StorageService persists and retrieves drafts with valid voiceRecording metadata', () => {
    const initialDraft = StorageService.createBlankDraft();
    initialDraft.title = 'کلام برائے ترنم ٹیسٹ';
    initialDraft.voiceRecording = {
      id: 'rec-test-123',
      blobDataUrl: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8=',
      mimeType: 'audio/webm',
      durationSeconds: 42,
      recordedAt: Date.now(),
      title: 'کلام برائے ترنم ٹیسٹ',
      poet: 'شاعر',
      mode: 'tarannum',
      withMetronome: true,
    };

    const saved = StorageService.saveDraft(initialDraft);
    assert.equal(saved, true, 'Draft with valid voiceRecording must save successfully');

    const loaded = StorageService.loadPortfolio();
    assert.equal(loaded.status, 'valid');
    const found = loaded.drafts.find((d) => d.id === initialDraft.id);
    assert.ok(found, 'Draft must be found in loaded drafts');
    assert.ok(found.voiceRecording, 'voiceRecording must be preserved');
    assert.equal(found.voiceRecording.durationSeconds, 42);
    assert.equal(found.voiceRecording.mode, 'tarannum');
    assert.equal(found.voiceRecording.withMetronome, true);
  });

  test('StorageService rejects malformed voiceRecording payloads to protect portfolio', () => {
    const validDraft = StorageService.createBlankDraft();
    StorageService.saveDraft(validDraft);

    // Attempt to save draft with invalid voiceRecording (durationSeconds is NaN)
    const corruptedDraft = {
      ...validDraft,
      voiceRecording: {
        id: 'rec-corrupt',
        blobDataUrl: 'data:audio/webm;base64,xxx',
        mimeType: 'audio/webm',
        durationSeconds: NaN, // Invalid!
        recordedAt: Date.now(),
      },
    };

    const saved = StorageService.saveDraft(corruptedDraft);
    assert.equal(saved, false, 'Malformed voice recording metadata must be rejected');
  });

  console.log(`${passed} voice recitation & storage checks passed.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
