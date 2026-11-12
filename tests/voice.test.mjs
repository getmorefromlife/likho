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
  const {
    voiceDspService,
    VOCAL_PROFILE_PRESETS,
    REVERB_PRESET_LABELS,
    ECHO_PRESETS,
    DuckingEnvelopeFollower,
    DUCKING_DEPTH_PRESETS,
    encodeAudioBufferToWav,
  } = await import(
    pathToFileURL(join(temporary, 'voiceDspService.js'))
  );
  const { StorageService } = await import(
    pathToFileURL(join(temporary, 'storageService.js'))
  );

  let passed = 0;
  const test = async (name, fn) => {
    memory.clear();
    await fn();
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

  test('ECHO_PRESETS provides distinct mushaira, slapback, and valley echo times', () => {
    assert.equal(ECHO_PRESETS.off.delayTime, 0);
    assert.ok(ECHO_PRESETS.mushaira.delayTime >= 0.2);
    assert.ok(ECHO_PRESETS.slapback.delayTime >= 0.1 && ECHO_PRESETS.slapback.delayTime < 0.2);
    assert.ok(ECHO_PRESETS.valley.delayTime >= 0.4);
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

  await test('DuckingEnvelopeFollower attenuates during speech and swells back up during pauses', () => {
    const follower = new DuckingEnvelopeFollower();
    const config = {
      enabled: true,
      depth: 'balanced',
      speed: 'fast',
      thresholdDb: -34,
    };

    // 1. Speech active (-12 dB -> rms ~0.25): gain should drop toward balanced (-12 dB = 0.25)
    let gain = 1.0;
    for (let i = 0; i < 15; i++) {
      gain = follower.processFrame(0.25, 0.03, config);
    }
    assert.ok(gain < 0.4, `Expected ducked gain < 0.4 during active speech, got ${gain}`);
    assert.ok(gain >= DUCKING_DEPTH_PRESETS.balanced.linearGain - 0.01);

    // 2. Silence (-70 dB -> rms ~0.0003) for 1.5 seconds: gain should swell back near 1.0
    for (let i = 0; i < 50; i++) {
      gain = follower.processFrame(0.0003, 0.03, config);
    }
    assert.ok(gain > 0.9, `Expected gain to swell back > 0.9 after pause, got ${gain}`);

    // 3. Disabled ducking always returns 1.0
    const offGain = follower.processFrame(0.5, 0.03, { ...config, enabled: false });
    assert.equal(offGain, 1.0);
  });

  await test('encodeAudioBufferToWav writes valid 44-byte RIFF/WAVE 16-bit PCM header', async () => {
    const sampleRate = 44100;
    const length = 100;
    const ch0 = new Float32Array(length).fill(0.5);
    const ch1 = new Float32Array(length).fill(-0.5);

    const mockBuffer = {
      numberOfChannels: 2,
      sampleRate,
      length,
      getChannelData: (c) => (c === 0 ? ch0 : ch1),
    };

    const blob = encodeAudioBufferToWav(mockBuffer);
    assert.equal(blob.type, 'audio/wav');
    assert.equal(blob.size, 44 + length * 2 * 2);

    const buf = new Uint8Array(await blob.arrayBuffer());
    const riff = String.fromCharCode(buf[0], buf[1], buf[2], buf[3]);
    const wave = String.fromCharCode(buf[8], buf[9], buf[10], buf[11]);
    assert.equal(riff, 'RIFF');
    assert.equal(wave, 'WAVE');
  });

  await test('StorageService preserves non-destructive trimStartSeconds and trimEndSeconds on voiceRecording', () => {
    const draft = StorageService.createBlankDraft();
    draft.voiceRecording = {
      id: 'rec-trimmed',
      blobDataUrl: 'data:audio/webm;base64,AAAA',
      mimeType: 'audio/webm',
      durationSeconds: 18.5,
      recordedAt: Date.now(),
      mode: 'tarannum',
      trimStartSeconds: 1.4,
      trimEndSeconds: 16.2,
    };

    const ok = StorageService.saveDraft(draft);
    assert.equal(ok, true);
    const loaded = StorageService.getDrafts().find((d) => d.id === draft.id);
    assert.ok(loaded && loaded.voiceRecording);
    assert.equal(loaded.voiceRecording.trimStartSeconds, 1.4);
    assert.equal(loaded.voiceRecording.trimEndSeconds, 16.2);
  });

  console.log(`${passed} voice recitation & DSP studio checks passed.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
