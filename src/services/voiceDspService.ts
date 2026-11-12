/**
 * Voice Recitation DSP & Acoustic Studio Processing Service
 * 
 * Provides broadcast-grade audio processing for Urdu poetry recitation & voiceovers:
 * 1. 80Hz Low-Cut Rumble filter & Software Noise Gate (silences room/fan hiss between verses).
 * 2. 3-Band Parametric Vocal EQ (Warmth, Clarity/Presence, Air/Sheen).
 * 3. Studio Dynamics Compressor evening out soft verses and loud tarannum climaxes.
 * 4. Authentic Mushaira Echo & Delay (Mushaira Delay, Slapback, Valley Echo).
 * 5. Synthetic Convolution Reverb (Dry, Chamber, Mushaira Hall, Cathedral).
 * 6. Live Earphone Monitoring (Logic Pro / Pro Tools style direct live input monitoring).
 * 7. Ambient Tanpura / Shruti Drone synthesizer for classical Indian vocal accompaniment.
 */

export type ReverbPreset = 'dry' | 'chamber' | 'mushaira' | 'cathedral';
export type EchoPreset = 'off' | 'mushaira' | 'slapback' | 'valley';
export type VocalProfilePreset = 'broadcast' | 'tarannum_sheen' | 'natural' | 'raw';
export type DuckingDepthPreset = 'subtle' | 'balanced' | 'deep';
export type DuckingSpeedPreset = 'fast' | 'cinematic';

export interface AutoDuckingConfig {
  enabled: boolean;
  depth: DuckingDepthPreset;
  speed: DuckingSpeedPreset;
  thresholdDb: number;
}

export const DUCKING_DEPTH_PRESETS: Record<
  DuckingDepthPreset,
  { label: string; db: number; linearGain: number; desc: string }
> = {
  subtle: {
    label: 'ہلکا (Subtle -6 dB)',
    db: -6,
    linearGain: 0.5,
    desc: 'موسیقی ہلکی سی مدہم ہو، ترنم کے ساتھ ہم آہنگ',
  },
  balanced: {
    label: 'متوازن براڈکاسٹ (-12 dB)',
    db: -12,
    linearGain: 0.25,
    desc: 'ریڈیو اور مشاعرے کے لیے معیاری توازن',
  },
  deep: {
    label: 'گہرا پوڈکاسٹ (-18 dB)',
    db: -18,
    linearGain: 0.125,
    desc: 'لفظوں کو نمایاں ترین رکھنے کے لیے گہری ڈکنگ',
  },
};

export const DUCKING_SPEED_PRESETS: Record<
  DuckingSpeedPreset,
  { label: string; attackSec: number; holdSec: number; releaseSec: number }
> = {
  fast: {
    label: 'تیز بحالی (400ms)',
    attackSec: 0.045,
    holdSec: 0.2,
    releaseSec: 0.4,
  },
  cinematic: {
    label: 'سنیمائی بحالی (950ms)',
    attackSec: 0.06,
    holdSec: 0.35,
    releaseSec: 0.95,
  },
};

/**
 * Pure Sidechain Envelope Follower for Auto Audio Ducking.
 * Smoothly attenuates background music/drone when vocal RMS exceeds thresholdDb,
 * holds briefly during micro-pauses, and swells smoothly back up between couplets.
 */
export class DuckingEnvelopeFollower {
  private currentGain = 1.0;
  private holdRemainingSec = 0;

  public reset(): void {
    this.currentGain = 1.0;
    this.holdRemainingSec = 0;
  }

  public getCurrentGain(): number {
    return this.currentGain;
  }

  public processFrame(
    rmsLinear: number,
    dtSeconds: number,
    config: AutoDuckingConfig
  ): number {
    if (!config.enabled || dtSeconds <= 0) {
      this.currentGain = 1.0;
      this.holdRemainingSec = 0;
      return 1.0;
    }

    const safeRms = Math.max(1e-6, rmsLinear);
    const rmsDb = 20 * Math.log10(safeRms);
    const speedMeta = DUCKING_SPEED_PRESETS[config.speed] || DUCKING_SPEED_PRESETS.cinematic;
    const depthMeta = DUCKING_DEPTH_PRESETS[config.depth] || DUCKING_DEPTH_PRESETS.balanced;

    const isVocalActive = rmsDb >= config.thresholdDb;

    if (isVocalActive) {
      this.holdRemainingSec = speedMeta.holdSec;
      const alpha = 1 - Math.exp(-dtSeconds / Math.max(0.01, speedMeta.attackSec));
      this.currentGain += (depthMeta.linearGain - this.currentGain) * alpha;
    } else if (this.holdRemainingSec > 0) {
      this.holdRemainingSec = Math.max(0, this.holdRemainingSec - dtSeconds);
    } else {
      const alpha = 1 - Math.exp(-dtSeconds / Math.max(0.05, speedMeta.releaseSec));
      this.currentGain += (1.0 - this.currentGain) * alpha;
    }

    this.currentGain = Math.max(depthMeta.linearGain, Math.min(1.0, this.currentGain));
    return this.currentGain;
  }
}

/**
 * Encode an AudioBuffer into a standard 16-bit PCM RIFF/WAVE Blob (100% client-side).
 */
export function encodeAudioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = Math.min(2, buffer.numberOfChannels);
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const dataByteSize = numFrames * blockAlign;
  const headerSize = 44;

  const arrayBuffer = new ArrayBuffer(headerSize + dataByteSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataByteSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // AudioFormat = 1 (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, dataByteSize, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export interface EchoConfig {
  preset: EchoPreset;
  delayTimeSeconds: number;
  feedback: number;
  wetLevel: number;
}

export const ECHO_PRESETS: Record<
  EchoPreset,
  { label: string; urdu: string; delayTime: number; feedback: number; wetLevel: number }
> = {
  off: {
    label: 'بغیر ایکو (Off)',
    urdu: 'کوئی گونج یا بازگشت نہیں',
    delayTime: 0,
    feedback: 0,
    wetLevel: 0,
  },
  mushaira: {
    label: 'مشاعرہ ایکو (Mushaira Echo)',
    urdu: 'روایتی مشاعرے کے اسپیکرز جیسی گونج (260ms)',
    delayTime: 0.26,
    feedback: 0.42,
    wetLevel: 0.38,
  },
  slapback: {
    label: 'تھرتھراہٹ (Slapback)',
    urdu: 'تیز مختصر ایکو جو آواز کو دوہرا تاثر دیتا ہے (120ms)',
    delayTime: 0.12,
    feedback: 0.22,
    wetLevel: 0.32,
  },
  valley: {
    label: 'طویل بازگشت (Valley Echo)',
    urdu: 'پہاڑوں کی وادی جیسی گہری بازگشت (440ms)',
    delayTime: 0.44,
    feedback: 0.58,
    wetLevel: 0.48,
  },
};

export interface VocalDspConfig {
  lowCutEnabled: boolean;
  noiseGateEnabled: boolean;
  warmthDb: number; // 180 Hz low-shelf (-6 to +9 dB)
  presenceDb: number; // 3.2 kHz peaking bell (-6 to +8 dB)
  airDb: number; // 10 kHz high-shelf (-6 to +8 dB)
  compressorEnabled: boolean;
  echoPreset: EchoPreset;
  echoWetLevel: number;
  reverbPreset: ReverbPreset;
  reverbWetLevel: number; // 0.0 to 1.0
  profilePreset: VocalProfilePreset;
}

export const VOCAL_PROFILE_PRESETS: Record<
  VocalProfilePreset,
  { label: string; description: string; config: Omit<VocalDspConfig, 'profilePreset'> }
> = {
  broadcast: {
    label: 'شاہی براڈکاسٹ (Broadcast Warmth)',
    description: 'بھاری ریڈیو آواز، کرکرا تلفظ، اور مختصر دالان گونج',
    config: {
      lowCutEnabled: true,
      noiseGateEnabled: true,
      warmthDb: 5.5,
      presenceDb: 4.5,
      airDb: 3.5,
      compressorEnabled: true,
      echoPreset: 'slapback',
      echoWetLevel: 0.22,
      reverbPreset: 'chamber',
      reverbWetLevel: 0.2,
    },
  },
  tarannum_sheen: {
    label: 'مشاعرہ و ترنم (Mushaira & Tarannum)',
    description: 'مشاعرہ گاہ کا روایتی ایکو، کھنکتی ریشمی چمک اور پرجوش سر',
    config: {
      lowCutEnabled: true,
      noiseGateEnabled: true,
      warmthDb: 3.0,
      presenceDb: 4.0,
      airDb: 6.5,
      compressorEnabled: true,
      echoPreset: 'mushaira',
      echoWetLevel: 0.38,
      reverbPreset: 'mushaira',
      reverbWetLevel: 0.32,
    },
  },
  natural: {
    label: 'قدرتی نکھار (Natural Studio)',
    description: 'اصلی اور متوازن صوتی اثر بغیر کسی مصنوعی تبدیلی کے',
    config: {
      lowCutEnabled: true,
      noiseGateEnabled: true,
      warmthDb: 1.0,
      presenceDb: 2.0,
      airDb: 1.5,
      compressorEnabled: true,
      echoPreset: 'off',
      echoWetLevel: 0,
      reverbPreset: 'chamber',
      reverbWetLevel: 0.12,
    },
  },
  raw: {
    label: 'خام و اصلی (Raw Mic)',
    description: 'مائیکروفون کی سیدھی آواز بغیر کسی فلٹر، ایکو یا گونج کے',
    config: {
      lowCutEnabled: false,
      noiseGateEnabled: false,
      warmthDb: 0,
      presenceDb: 0,
      airDb: 0,
      compressorEnabled: false,
      echoPreset: 'off',
      echoWetLevel: 0,
      reverbPreset: 'dry',
      reverbWetLevel: 0,
    },
  },
};

export const REVERB_PRESET_LABELS: Record<ReverbPreset, { label: string; urdu: string }> = {
  dry: { label: 'خشک / خام (Dry)', urdu: 'بغیر گونج کے بالکل صاف' },
  chamber: { label: 'نشست و دالان (Chamber)', urdu: 'گھریلو ادبی نشست جیسی معتدل گونج' },
  mushaira: { label: 'مشاعرہ گاہ (Mushaira Hall)', urdu: 'بڑے مشاعرے کے پنڈال جیسی شاہانہ فضا' },
  cathedral: { label: 'روحانی فضا (Cathedral)', urdu: 'طویل اور گہری صوفیانہ گونج' },
};

export class VoiceDspEngine {
  private ctx: AudioContext | null = null;
  private lowCutFilter: BiquadFilterNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null;
  private presenceFilter: BiquadFilterNode | null = null;
  private airFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // Echo / Delay Nodes
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private delayFilter: BiquadFilterNode | null = null;
  private echoWetGain: GainNode | null = null;

  // Reverb Nodes
  private convolver: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private reverbWetGain: GainNode | null = null;
  private masterProcessedGain: GainNode | null = null;

  // Live Earphone Monitoring Node (Logic Pro style)
  private liveMonitorGain: GainNode | null = null;
  private isMonitoringActive = false;

  // Cached synthetic reverb buffers
  private reverbBuffers: Map<ReverbPreset, AudioBuffer> = new Map();

  // Ambient Tanpura / Shruti Drone nodes
  private tanpuraGain: GainNode | null = null;
  private tanpuraOscillators: OscillatorNode[] = [];
  private tanpuraStringGains: GainNode[] = [];
  private tanpuraStopTimer: ReturnType<typeof setTimeout> | null = null;
  private tanpuraPluckTimer: ReturnType<typeof setInterval> | null = null;
  private isTanpuraPlaying = false;

  // Background Music Mixer & Sidechain Auto-Ducking
  private bgMusicBuffer: AudioBuffer | null = null;
  private bgMusicFileName = '';
  private bgMusicSource: AudioBufferSourceNode | null = null;
  private bgMusicGain: GainNode | null = null;
  private bgMusicVolume = 0.35;
  private bgMusicLoop = true;
  private isBgMusicPlaying = false;

  private duckingGainNode: GainNode | null = null;
  private duckingFollower = new DuckingEnvelopeFollower();
  private duckingTimer: ReturnType<typeof setInterval> | null = null;
  private duckingListener: ((gain: number) => void) | null = null;

  public duckingConfig: AutoDuckingConfig = {
    enabled: true,
    depth: 'balanced',
    speed: 'cinematic',
    thresholdDb: -34,
  };

  public currentConfig: VocalDspConfig = {
    profilePreset: 'broadcast',
    ...VOCAL_PROFILE_PRESETS.broadcast.config,
  };

  /**
   * Mathematically generate synthetic acoustic impulse responses for convolution reverb.
   * Completely offline and 100% free of external audio files.
   */
  public generateReverbImpulse(
    ctx: AudioContext,
    durationSeconds: number,
    decayRate: number
  ): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.max(1, Math.floor(sampleRate * durationSeconds));
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * decayRate);
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
  }

  private getOrCreateReverbBuffer(ctx: AudioContext, preset: ReverbPreset): AudioBuffer | null {
    if (preset === 'dry') return null;
    if (this.reverbBuffers.has(preset)) {
      return this.reverbBuffers.get(preset)!;
    }

    let buffer: AudioBuffer;
    if (preset === 'chamber') {
      buffer = this.generateReverbImpulse(ctx, 1.2, 3.8);
    } else if (preset === 'mushaira') {
      buffer = this.generateReverbImpulse(ctx, 2.4, 2.2);
    } else {
      // cathedral
      buffer = this.generateReverbImpulse(ctx, 3.8, 1.6);
    }

    this.reverbBuffers.set(preset, buffer);
    return buffer;
  }

  /**
   * Construct the complete real-time DSP audio processing graph
   */
  public buildDspGraph(
    ctx: AudioContext,
    sourceNode: AudioNode,
    config: VocalDspConfig
  ): {
    processedOutput: AudioNode;
    analyserInput: AudioNode;
  } {
    this.ctx = ctx;
    this.currentConfig = { ...config };

    // 1. High-Pass Low Cut Filter (80Hz rumble remover)
    this.lowCutFilter = ctx.createBiquadFilter();
    this.lowCutFilter.type = 'highpass';
    this.lowCutFilter.frequency.setValueAtTime(config.lowCutEnabled ? 85 : 10, ctx.currentTime);
    this.lowCutFilter.Q.setValueAtTime(0.707, ctx.currentTime);

    // 2. 3-Band Parametric Vocal EQ
    // 2a. Warmth (Low Shelf at 180Hz)
    this.warmthFilter = ctx.createBiquadFilter();
    this.warmthFilter.type = 'lowshelf';
    this.warmthFilter.frequency.setValueAtTime(180, ctx.currentTime);
    this.warmthFilter.gain.setValueAtTime(config.warmthDb, ctx.currentTime);

    // 2b. Presence & Diction Clarity (Peaking bell at 3.2kHz)
    this.presenceFilter = ctx.createBiquadFilter();
    this.presenceFilter.type = 'peaking';
    this.presenceFilter.frequency.setValueAtTime(3200, ctx.currentTime);
    this.presenceFilter.Q.setValueAtTime(1.2, ctx.currentTime);
    this.presenceFilter.gain.setValueAtTime(config.presenceDb, ctx.currentTime);

    // 2c. Air & Brilliance (High Shelf at 10kHz)
    this.airFilter = ctx.createBiquadFilter();
    this.airFilter.type = 'highshelf';
    this.airFilter.frequency.setValueAtTime(10000, ctx.currentTime);
    this.airFilter.gain.setValueAtTime(config.airDb, ctx.currentTime);

    // 3. Studio Dynamics Compressor
    this.compressor = ctx.createDynamicsCompressor();
    if (config.compressorEnabled) {
      this.compressor.threshold.setValueAtTime(-24, ctx.currentTime);
      this.compressor.knee.setValueAtTime(25, ctx.currentTime);
      this.compressor.ratio.setValueAtTime(3.8, ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      this.compressor.release.setValueAtTime(0.24, ctx.currentTime);
    } else {
      this.compressor.threshold.setValueAtTime(0, ctx.currentTime);
      this.compressor.ratio.setValueAtTime(1, ctx.currentTime);
    }

    // Connect serial EQ + dynamics chain
    sourceNode.connect(this.lowCutFilter);
    this.lowCutFilter.connect(this.warmthFilter);
    this.warmthFilter.connect(this.presenceFilter);
    this.presenceFilter.connect(this.airFilter);
    this.airFilter.connect(this.compressor);

    // 4. Authentic Mushaira Echo / Delay Unit
    this.delayNode = ctx.createDelay(1.0);
    this.delayFeedbackGain = ctx.createGain();
    this.delayFilter = ctx.createBiquadFilter();
    this.delayFilter.type = 'lowpass';
    this.delayFilter.frequency.setValueAtTime(2800, ctx.currentTime); // Warm analogue tape decay

    const echoData = ECHO_PRESETS[config.echoPreset] || ECHO_PRESETS.off;
    const delayTime = echoData.delayTime || 0.26;
    const feedback = echoData.feedback || 0.4;
    const echoWet = config.echoPreset === 'off' ? 0 : config.echoWetLevel || echoData.wetLevel;

    this.delayNode.delayTime.setValueAtTime(delayTime, ctx.currentTime);
    this.delayFeedbackGain.gain.setValueAtTime(feedback, ctx.currentTime);

    this.echoWetGain = ctx.createGain();
    this.echoWetGain.gain.setValueAtTime(echoWet, ctx.currentTime);

    // Echo loop: compressor -> delayNode -> filter -> feedbackGain -> delayNode
    this.compressor.connect(this.delayNode);
    this.delayNode.connect(this.delayFilter);
    this.delayFilter.connect(this.delayFeedbackGain);
    this.delayFeedbackGain.connect(this.delayNode);
    this.delayNode.connect(this.echoWetGain);

    // 5. Parallel Reverb Split: Dry / Wet Routing
    this.dryGain = ctx.createGain();
    this.reverbWetGain = ctx.createGain();
    this.masterProcessedGain = ctx.createGain();

    const reverbWet = Math.max(0, Math.min(1, config.reverbWetLevel));
    this.dryGain.gain.setValueAtTime(1.0, ctx.currentTime);
    this.reverbWetGain.gain.setValueAtTime(reverbWet, ctx.currentTime);

    // Dry path connects compressor direct to master
    this.compressor.connect(this.dryGain);
    this.dryGain.connect(this.masterProcessedGain);

    // Echo path connects to master
    this.echoWetGain.connect(this.masterProcessedGain);

    // Wet path (Convolution Reverb)
    if (config.reverbPreset !== 'dry') {
      this.convolver = ctx.createConvolver();
      const reverbBuffer = this.getOrCreateReverbBuffer(ctx, config.reverbPreset);
      if (reverbBuffer) {
        this.convolver.buffer = reverbBuffer;
      }
      this.compressor.connect(this.convolver);
      this.convolver.connect(this.reverbWetGain);
      this.reverbWetGain.connect(this.masterProcessedGain);
    }

    // 6. Live Earphone Monitoring (Logic Pro style)
    this.liveMonitorGain = ctx.createGain();
    this.liveMonitorGain.gain.setValueAtTime(this.isMonitoringActive ? 1.0 : 0.0, ctx.currentTime);
    this.masterProcessedGain.connect(this.liveMonitorGain);
    this.liveMonitorGain.connect(ctx.destination);

    return {
      processedOutput: this.masterProcessedGain,
      analyserInput: this.masterProcessedGain,
    };
  }

  /**
   * Toggle or set live earphone monitoring (Logic Pro direct monitor)
   */
  public setLiveMonitoring(enabled: boolean): void {
    this.isMonitoringActive = enabled;
    if (this.ctx && this.liveMonitorGain) {
      if (enabled && this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      this.liveMonitorGain.gain.setTargetAtTime(enabled ? 1.0 : 0.0, this.ctx.currentTime, 0.05);
    }
  }

  public getIsLiveMonitoring(): boolean {
    return this.isMonitoringActive;
  }

  /**
   * Update DSP parameters in real time without restarting recording
   */
  public updateParameters(config: Partial<VocalDspConfig>): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.currentConfig = { ...this.currentConfig, ...config };

    if (this.lowCutFilter && config.lowCutEnabled !== undefined) {
      this.lowCutFilter.frequency.setTargetAtTime(config.lowCutEnabled ? 85 : 10, now, 0.05);
    }
    if (this.warmthFilter && config.warmthDb !== undefined) {
      this.warmthFilter.gain.setTargetAtTime(config.warmthDb, now, 0.05);
    }
    if (this.presenceFilter && config.presenceDb !== undefined) {
      this.presenceFilter.gain.setTargetAtTime(config.presenceDb, now, 0.05);
    }
    if (this.airFilter && config.airDb !== undefined) {
      this.airFilter.gain.setTargetAtTime(config.airDb, now, 0.05);
    }
    if (this.compressor && config.compressorEnabled !== undefined) {
      this.compressor.ratio.setTargetAtTime(config.compressorEnabled ? 3.8 : 1, now, 0.05);
      this.compressor.threshold.setTargetAtTime(config.compressorEnabled ? -24 : 0, now, 0.05);
    }
    // Update Echo / Delay
    if (config.echoPreset !== undefined && this.delayNode && this.delayFeedbackGain && this.echoWetGain) {
      const echoData = ECHO_PRESETS[config.echoPreset] || ECHO_PRESETS.off;
      if (config.echoPreset === 'off') {
        this.echoWetGain.gain.setTargetAtTime(0, now, 0.05);
      } else {
        this.delayNode.delayTime.setTargetAtTime(echoData.delayTime, now, 0.05);
        this.delayFeedbackGain.gain.setTargetAtTime(echoData.feedback, now, 0.05);
        const wet = config.echoWetLevel !== undefined ? config.echoWetLevel : echoData.wetLevel;
        this.echoWetGain.gain.setTargetAtTime(wet, now, 0.05);
      }
    }
    // Update Reverb
    if (this.reverbWetGain && config.reverbWetLevel !== undefined) {
      const wet = Math.max(0, Math.min(1, config.reverbWetLevel));
      this.reverbWetGain.gain.setTargetAtTime(wet, now, 0.05);
    }
  }

  /**
   * Apply a preset profile (e.g. broadcast, natural, tarannum_sheen)
   */
  public applyProfilePreset(preset: VocalProfilePreset): VocalDspConfig {
    const target = VOCAL_PROFILE_PRESETS[preset];
    this.currentConfig = {
      profilePreset: preset,
      ...target.config,
    };
    this.updateParameters(target.config);
    return this.currentConfig;
  }

  /**
   * Ambient Tanpura / Shruti Drone Synthesizer
   * Creates classical Sa-Pa harmonic acoustic drone with 4 rich strings and subtle chorus.
   * Auto-resumes AudioContext, handles timers safely, and produces warm audible harmonics.
   */
  public async startTanpuraDrone(volume = 0.35, externalCtx?: AudioContext): Promise<void> {
    if (typeof window === 'undefined') return;

    // Clear any pending stop timer immediately so it doesn't kill the new sound!
    if (this.tanpuraStopTimer) {
      clearTimeout(this.tanpuraStopTimer);
      this.tanpuraStopTimer = null;
    }
    if (this.tanpuraPluckTimer) {
      clearInterval(this.tanpuraPluckTimer);
      this.tanpuraPluckTimer = null;
    }

    // Stop and disconnect old oscillators immediately
    for (const osc of this.tanpuraOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored
      }
    }
    this.tanpuraOscillators = [];
    this.tanpuraStringGains = [];

    // Ensure AudioContext exists and is running
    let ctx = externalCtx || this.ctx;
    if (!ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx();
    }
    this.ctx = ctx;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Ignored
      }
    }

    this.isTanpuraPlaying = true;

    // Master Tanpura Gain
    this.tanpuraGain = ctx.createGain();
    const safeVolume = Math.max(0.05, Math.min(1.0, volume));
    this.tanpuraGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.tanpuraGain.gain.linearRampToValueAtTime(safeVolume, ctx.currentTime + 0.15);
    this.tanpuraGain.connect(this.getOrCreateDuckingNode(ctx));

    // Warm resonant tone filter (preserves rich harmonics up to 2.4kHz so it cuts through small phone/laptop speakers)
    const toneFilter = ctx.createBiquadFilter();
    toneFilter.type = 'lowpass';
    toneFilter.frequency.setValueAtTime(2200, ctx.currentTime);
    toneFilter.Q.setValueAtTime(2.2, ctx.currentTime);
    toneFilter.connect(this.tanpuraGain);

    // 4-String Indian Classical Tanpura tuning (Pa, Sa, Sa, Kharaj Sa)
    // String 1: Pa (G3, 196.0 Hz)
    // String 2: Sa (C4, 261.63 Hz)
    // String 3: Sa detuned (262.35 Hz for acoustic jawari shimmer)
    // String 4: Kharaj Sa (C3, 130.81 Hz)
    const strings = [
      { freq: 196.0, type: 'sawtooth' as OscillatorType, baseGain: 0.35, lfoRate: 0.12 },
      { freq: 261.63, type: 'triangle' as OscillatorType, baseGain: 0.40, lfoRate: 0.16 },
      { freq: 262.35, type: 'sawtooth' as OscillatorType, baseGain: 0.30, lfoRate: 0.20 },
      { freq: 130.81, type: 'sawtooth' as OscillatorType, baseGain: 0.45, lfoRate: 0.09 },
      { freq: 392.00, type: 'triangle' as OscillatorType, baseGain: 0.18, lfoRate: 0.14 }, // High sparkle
    ];

    strings.forEach((str) => {
      const osc = ctx.createOscillator();
      const stringGain = ctx.createGain();

      osc.type = str.type;
      osc.frequency.setValueAtTime(str.freq, ctx.currentTime);

      // Acoustic LFO chorus
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(str.lfoRate, ctx.currentTime);
      lfoGain.gain.setValueAtTime(2.0, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      this.tanpuraOscillators.push(lfo);

      stringGain.gain.setValueAtTime(str.baseGain, ctx.currentTime);
      osc.connect(stringGain);
      stringGain.connect(toneFilter);

      osc.start();
      this.tanpuraOscillators.push(osc);
      this.tanpuraStringGains.push(stringGain);
    });

    // Meditative rhythmic string plucking accent (every 1.5 seconds cycles through the strings)
    let currentPluckIndex = 0;
    this.tanpuraPluckTimer = setInterval(() => {
      if (!this.isTanpuraPlaying || !this.ctx || this.tanpuraStringGains.length === 0) return;
      const targetGain = this.tanpuraStringGains[currentPluckIndex % 4];
      if (targetGain) {
        const now = this.ctx.currentTime;
        const currentVal = targetGain.gain.value;
        targetGain.gain.setValueAtTime(currentVal * 1.4, now);
        targetGain.gain.exponentialRampToValueAtTime(Math.max(0.05, currentVal), now + 0.9);
      }
      currentPluckIndex++;
    }, 1200);
  }

  public setTanpuraVolume(volume: number): void {
    if (this.tanpuraGain && this.ctx) {
      const safeVol = Math.max(0.01, Math.min(1, volume));
      this.tanpuraGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.05);
    }
  }

  public stopTanpuraDrone(): void {
    if (this.tanpuraPluckTimer) {
      clearInterval(this.tanpuraPluckTimer);
      this.tanpuraPluckTimer = null;
    }

    if (this.tanpuraGain && this.ctx) {
      try {
        this.tanpuraGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      } catch {
        // Ignored
      }
    }

    this.isTanpuraPlaying = false;

    // Clear previous timer if any
    if (this.tanpuraStopTimer) {
      clearTimeout(this.tanpuraStopTimer);
    }

    this.tanpuraStopTimer = setTimeout(() => {
      for (const osc of this.tanpuraOscillators) {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignored
        }
      }
      this.tanpuraOscillators = [];
      this.tanpuraStringGains = [];
      if (this.tanpuraGain) {
        try {
          this.tanpuraGain.disconnect();
        } catch {
          // Ignored
        }
        this.tanpuraGain = null;
      }
      this.tanpuraStopTimer = null;
    }, 200);
  }

  public getIsTanpuraPlaying(): boolean {
    return this.isTanpuraPlaying;
  }

  // =========================================================================
  // Auto Audio Ducking & Sidechain Envelope Follower
  // =========================================================================

  private getOrCreateDuckingNode(ctx: AudioContext): GainNode {
    if (!this.duckingGainNode || this.duckingGainNode.context !== ctx) {
      this.duckingGainNode = ctx.createGain();
      this.duckingGainNode.gain.setValueAtTime(1.0, ctx.currentTime);
      this.duckingGainNode.connect(ctx.destination);
    }
    return this.duckingGainNode;
  }

  public setAutoDuckingConfig(config: Partial<AutoDuckingConfig>): void {
    this.duckingConfig = { ...this.duckingConfig, ...config };
    if (!this.duckingConfig.enabled && this.duckingGainNode && this.ctx) {
      this.duckingFollower.reset();
      this.duckingGainNode.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
      this.duckingListener?.(1.0);
    }
  }

  public getCurrentDuckingGain(): number {
    return this.duckingFollower.getCurrentGain();
  }

  public startDuckingMonitor(
    analyser: AnalyserNode,
    onGainChange?: (gain: number) => void
  ): void {
    this.stopDuckingMonitor();
    this.duckingFollower.reset();
    this.duckingListener = onGainChange || null;

    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    const intervalMs = 30;
    const dtSec = intervalMs / 1000;

    this.duckingTimer = setInterval(() => {
      if (!this.ctx) return;
      analyser.getFloatTimeDomainData(dataArray);
      let sumSquares = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sumSquares += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sumSquares / Math.max(1, dataArray.length));
      const gain = this.duckingFollower.processFrame(rms, dtSec, this.duckingConfig);

      const node = this.getOrCreateDuckingNode(this.ctx);
      node.gain.setTargetAtTime(gain, this.ctx.currentTime, 0.02);
      this.duckingListener?.(gain);
    }, intervalMs);
  }

  public stopDuckingMonitor(): void {
    if (this.duckingTimer) {
      clearInterval(this.duckingTimer);
      this.duckingTimer = null;
    }
    this.duckingFollower.reset();
    if (this.duckingGainNode && this.ctx) {
      try {
        this.duckingGainNode.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.05);
      } catch {
        // Ignored
      }
    }
    this.duckingListener?.(1.0);
    this.duckingListener = null;
  }

  // =========================================================================
  // Background Music / Instrumental Track Mixer
  // =========================================================================

  public async loadBackgroundMusicFile(
    file: File,
    externalCtx?: AudioContext
  ): Promise<{ name: string; duration: number }> {
    let ctx = externalCtx || this.ctx;
    if (!ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx();
    }
    this.ctx = ctx;

    const arrayBuffer = await file.arrayBuffer();
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    this.bgMusicBuffer = decoded;
    this.bgMusicFileName = file.name;

    return {
      name: file.name,
      duration: decoded.duration,
    };
  }

  public getBackgroundMusicInfo(): { loaded: boolean; name: string; duration: number } {
    return {
      loaded: !!this.bgMusicBuffer,
      name: this.bgMusicFileName,
      duration: this.bgMusicBuffer ? this.bgMusicBuffer.duration : 0,
    };
  }

  public clearBackgroundMusic(): void {
    this.stopBackgroundMusic();
    this.bgMusicBuffer = null;
    this.bgMusicFileName = '';
  }

  public async startBackgroundMusic(
    volume = this.bgMusicVolume,
    loop = this.bgMusicLoop,
    externalCtx?: AudioContext
  ): Promise<void> {
    if (!this.bgMusicBuffer) return;
    this.stopBackgroundMusic();

    let ctx = externalCtx || this.ctx;
    if (!ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx();
    }
    this.ctx = ctx;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Ignored
      }
    }

    this.bgMusicVolume = Math.max(0, Math.min(1, volume));
    this.bgMusicLoop = loop;

    const source = ctx.createBufferSource();
    source.buffer = this.bgMusicBuffer;
    source.loop = loop;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.bgMusicVolume, ctx.currentTime + 0.35);

    source.connect(gainNode);
    gainNode.connect(this.getOrCreateDuckingNode(ctx));

    source.onended = () => {
      if (this.bgMusicSource === source) {
        this.isBgMusicPlaying = false;
      }
    };

    source.start();
    this.bgMusicSource = source;
    this.bgMusicGain = gainNode;
    this.isBgMusicPlaying = true;
  }

  public setBackgroundMusicVolume(volume: number): void {
    this.bgMusicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusicGain && this.ctx) {
      this.bgMusicGain.gain.setTargetAtTime(this.bgMusicVolume, this.ctx.currentTime, 0.05);
    }
  }

  public stopBackgroundMusic(): void {
    if (this.bgMusicSource) {
      try {
        this.bgMusicSource.stop();
        this.bgMusicSource.disconnect();
      } catch {
        // Ignored
      }
      this.bgMusicSource = null;
    }
    if (this.bgMusicGain) {
      try {
        this.bgMusicGain.disconnect();
      } catch {
        // Ignored
      }
      this.bgMusicGain = null;
    }
    this.isBgMusicPlaying = false;
  }

  public getIsBgMusicPlaying(): boolean {
    return this.isBgMusicPlaying;
  }

  // =========================================================================
  // Offline Master WAV Export (Bakes Voice + Background Music + Auto-Ducking)
  // =========================================================================

  public async extractWaveformPeaks(dataUrl: string, barCount = 72): Promise<number[]> {
    const response = await fetch(dataUrl);
    const arrayBuffer = await response.arrayBuffer();
    const tempCtx =
      this.ctx ||
      new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const decoded = await tempCtx.decodeAudioData(arrayBuffer);
    const channel = decoded.getChannelData(0);
    const safeBars = Math.max(12, Math.min(200, Math.floor(barCount)));
    const blockSize = Math.max(1, Math.floor(channel.length / safeBars));
    const rawPeaks: number[] = [];
    let maxPeak = 0.001;

    for (let i = 0; i < safeBars; i++) {
      const start = i * blockSize;
      const end = Math.min(channel.length, start + blockSize);
      let peak = 0;
      for (let j = start; j < end; j++) {
        const abs = Math.abs(channel[j]);
        if (abs > peak) peak = abs;
      }
      rawPeaks.push(peak);
      if (peak > maxPeak) maxPeak = peak;
    }

    return rawPeaks.map((p) => Math.max(0.08, Math.min(1, p / maxPeak)));
  }

  public async renderMasteredAudioBuffer(
    vocalDataUrl: string,
    options: {
      musicVolume?: number;
      musicLoop?: boolean;
      includeBgMusic?: boolean;
      trimStartSec?: number;
      trimEndSec?: number;
    } = {}
  ): Promise<AudioBuffer> {
    const response = await fetch(vocalDataUrl);
    const arrayBuffer = await response.arrayBuffer();

    const tempCtx =
      this.ctx ||
      new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const decodedVocal = await tempCtx.decodeAudioData(arrayBuffer);

    const sampleRate = decodedVocal.sampleRate;
    const startSec = Math.max(0, options.trimStartSec ?? 0);
    const endSec = Math.min(decodedVocal.duration, options.trimEndSec ?? decodedVocal.duration);
    const renderDuration = Math.max(0.1, endSec - startSec);
    const frameCount = Math.ceil(renderDuration * sampleRate);

    const offlineCtx = new OfflineAudioContext(2, frameCount, sampleRate);

    // 1. Vocal Track (sliced to trim window)
    const vocalSource = offlineCtx.createBufferSource();
    vocalSource.buffer = decodedVocal;
    vocalSource.connect(offlineCtx.destination);
    vocalSource.start(0, startSec, renderDuration);

    // 2. Background Music Track with Baked Auto-Ducking Envelope
    if (options.includeBgMusic !== false && this.bgMusicBuffer) {
      const musicSource = offlineCtx.createBufferSource();
      musicSource.buffer = this.bgMusicBuffer;
      musicSource.loop = options.musicLoop ?? this.bgMusicLoop;

      const musicGain = offlineCtx.createGain();
      const baseVol = options.musicVolume ?? this.bgMusicVolume;

      if (this.duckingConfig.enabled) {
        const vocalChannel = decodedVocal.getChannelData(0);
        const startSample = Math.floor(startSec * sampleRate);
        const stepSec = 0.03; // 30ms envelope resolution
        const stepSamples = Math.max(1, Math.floor(stepSec * sampleRate));
        const follower = new DuckingEnvelopeFollower();

        musicGain.gain.setValueAtTime(baseVol, 0);
        for (let t = 0; t < renderDuration; t += stepSec) {
          const offset = startSample + Math.floor(t * sampleRate);
          let sumSq = 0;
          let count = 0;
          for (let j = 0; j < stepSamples && offset + j < vocalChannel.length; j++) {
            const s = vocalChannel[offset + j];
            sumSq += s * s;
            count++;
          }
          const rms = count > 0 ? Math.sqrt(sumSq / count) : 0;
          const duckMul = follower.processFrame(rms, stepSec, this.duckingConfig);
          musicGain.gain.linearRampToValueAtTime(baseVol * duckMul, Math.min(renderDuration, t + stepSec));
        }
      } else {
        musicGain.gain.setValueAtTime(baseVol, 0);
      }

      // Gentle 0.4s Fade-In and 1.2s Fade-Out on background music
      const fadeInGain = offlineCtx.createGain();
      fadeInGain.gain.setValueAtTime(0.01, 0);
      fadeInGain.gain.linearRampToValueAtTime(1.0, Math.min(0.4, renderDuration * 0.2));
      if (renderDuration > 1.5) {
        fadeInGain.gain.setValueAtTime(1.0, renderDuration - 1.2);
        fadeInGain.gain.linearRampToValueAtTime(0.01, renderDuration);
      }

      musicSource.connect(musicGain);
      musicGain.connect(fadeInGain);
      fadeInGain.connect(offlineCtx.destination);
      musicSource.start(0);
    }

    return offlineCtx.startRendering();
  }

  public async renderMasteredWav(
    vocalDataUrl: string,
    options: {
      musicVolume?: number;
      musicLoop?: boolean;
      includeBgMusic?: boolean;
      trimStartSec?: number;
      trimEndSec?: number;
    } = {}
  ): Promise<Blob> {
    const renderedBuffer = await this.renderMasteredAudioBuffer(vocalDataUrl, options);
    return encodeAudioBufferToWav(renderedBuffer);
  }
}

export const voiceDspService = new VoiceDspEngine();
