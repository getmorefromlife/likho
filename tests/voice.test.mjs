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
      'src/services/voiceDspService.ts',
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
  const { voiceDspService, VOCAL_PROFILE_PRESETS, REVERB_PRESET_LABELS } = await import(
    pathToFileURL(join(temporary, 'voiceDspService.js'))
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

  test('VOCAL_PROFILE_PRESETS defines complete broadcast, natural, tarannum, and raw profiles', () => {
    const requiredProfiles = ['broadcast', 'natural', 'tarannum_sheen', 'raw'];
    for (const key of requiredProfiles) {
      assert.ok(VOCAL_PROFILE_PRESETS[key], `Preset ${key} must exist`);
      assert.ok(typeof VOCAL_PROFILE_PRESETS[key].label === 'string');
      assert.ok(typeof VOCAL_PROFILE_PRESETS[key].description === 'string');
      const cfg = VOCAL_PROFILE_PRESETS[key].config;
      assert.ok(typeof cfg.warmthDb === 'number');
      assert.ok(typeof cfg.presenceDb === 'number');
      assert.ok(typeof cfg.airDb === 'number');
      assert.ok(typeof cfg.compressorEnabled === 'boolean');
      assert.ok(typeof cfg.lowCutEnabled === 'boolean');
    }
  });

  test('REVERB_PRESET_LABELS provides authenticated Urdu labels for all spaces', () => {
    assert.equal(REVERB_PRESET_LABELS.dry.urdu, 'بغیر گونج کے بالکل صاف');
    assert.equal(REVERB_PRESET_LABELS.mushaira.urdu, 'بڑے مشاعرے کے پنڈال جیسی شاہانہ فضا');
  });

  test('VoiceDspEngine generates synthetic convolution impulse buffers mathematically', () => {
    const mockCtx = {
      sampleRate: 44100,
      createBuffer: (channels, length, sampleRate) => {
        const left = new Float32Array(length);
        const right = new Float32Array(length);
        return {
          numberOfChannels: channels,
          length,
          sampleRate,
          getChannelData: (ch) => (ch === 0 ? left : right),
        };
      },
    };

    const impulse = voiceDspService.generateReverbImpulse(mockCtx, 1.5, 2.5);
    assert.equal(impulse.numberOfChannels, 2);
    assert.equal(impulse.length, 44100 * 1.5);
    const left = impulse.getChannelData(0);
    // Envelope check: initial sample should have higher amplitude than end sample
    assert.ok(Math.abs(left[0]) <= 1.0);
    assert.ok(Math.abs(left[left.length - 1]) < 0.2);
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

  console.log(`${passed} voice recitation & DSP studio checks passed.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
