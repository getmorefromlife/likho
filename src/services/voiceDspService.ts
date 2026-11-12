/**
 * Voice Recitation DSP & Acoustic Studio Processing Service
 * 
 * Provides real-time audio enhancement for Urdu poetry recitation & voiceovers:
 * 1. 80Hz Low-Cut / High-Pass filter removing microphone rumble and AC hum.
 * 2. 3-Band Parametric Vocal EQ (Warmth, Clarity/Presence, Air/Sheen).
 * 3. Studio Dynamics Compressor evening out soft verses and loud tarannum climaxes.
 * 4. Synthetic Convolution Reverb mimicking Mushaira Hall acoustics with zero audio files.
 * 5. Ambient Tanpura / Shruti Drone synthesizer for authentic classical accompaniment.
 */

export type ReverbPreset = 'dry' | 'chamber' | 'mushaira' | 'cathedral';
export type VocalProfilePreset = 'broadcast' | 'natural' | 'tarannum_sheen' | 'raw';

export interface VocalDspConfig {
  lowCutEnabled: boolean;
  warmthDb: number; // 200 Hz low-shelf (-6 to +6 dB)
  presenceDb: number; // 3.5 kHz peaking bell (-6 to +6 dB)
  airDb: number; // 10 kHz high-shelf (-6 to +6 dB)
  compressorEnabled: boolean;
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
    description: 'بھاری ریڈیو آواز، واضح تلفظ اور کمرے کے شور کا خاتمہ',
    config: {
      lowCutEnabled: true,
      warmthDb: 3.5,
      presenceDb: 4.0,
      airDb: 2.5,
      compressorEnabled: true,
      reverbPreset: 'chamber',
      reverbWetLevel: 0.18,
    },
  },
  tarannum_sheen: {
    label: 'ترنم و نغمگی (Tarannum & Lyrical)',
    description: 'مشاعرہ گاہ کی پروقار گونج، کھنکتی ریشمی چمک اور پرجوش سر',
    config: {
      lowCutEnabled: true,
      warmthDb: 2.0,
      presenceDb: 3.0,
      airDb: 5.0,
      compressorEnabled: true,
      reverbPreset: 'mushaira',
      reverbWetLevel: 0.28,
    },
  },
  natural: {
    label: 'قدرتی نکھار (Natural Studio)',
    description: 'اصلی اور متوازن صوتی اثر بغیر کسی مصنوعی تبدیلی کے',
    config: {
      lowCutEnabled: true,
      warmthDb: 0.5,
      presenceDb: 1.5,
      airDb: 1.0,
      compressorEnabled: true,
      reverbPreset: 'chamber',
      reverbWetLevel: 0.12,
    },
  },
  raw: {
    label: 'خام و اصلی (Raw Mic)',
    description: 'مائیکروفون کی سیدھی آواز بغیر کسی فلٹر یا گونج کے',
    config: {
      lowCutEnabled: false,
      warmthDb: 0,
      presenceDb: 0,
      airDb: 0,
      compressorEnabled: false,
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
  private convolver: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private masterProcessedGain: GainNode | null = null;

  // Cached synthetic reverb buffers to avoid recalculating
  private reverbBuffers: Map<ReverbPreset, AudioBuffer> = new Map();

  // Ambient Tanpura / Shruti Drone nodes
  private tanpuraGain: GainNode | null = null;
  private tanpuraOscillators: OscillatorNode[] = [];
  private isTanpuraPlaying = false;

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
      // Exponential decay envelope
      const envelope = Math.exp(-t * decayRate);
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
  }

  /**
   * Pre-render synthetic reverb impulse buffers
   */
  private getOrCreateReverbBuffer(ctx: AudioContext, preset: ReverbPreset): AudioBuffer | null {
    if (preset === 'dry') return null;
    if (this.reverbBuffers.has(preset)) {
      return this.reverbBuffers.get(preset)!;
    }

    let buffer: AudioBuffer;
    if (preset === 'chamber') {
      buffer = this.generateReverbImpulse(ctx, 1.2, 3.8);
    } else if (preset === 'mushaira') {
      buffer = this.generateReverbImpulse(ctx, 2.2, 2.4);
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
    this.lowCutFilter.frequency.setValueAtTime(config.lowCutEnabled ? 80 : 10, ctx.currentTime);
    this.lowCutFilter.Q.setValueAtTime(0.707, ctx.currentTime);

    // 2. 3-Band Parametric Vocal EQ
    // 2a. Warmth (Low Shelf at 200Hz)
    this.warmthFilter = ctx.createBiquadFilter();
    this.warmthFilter.type = 'lowshelf';
    this.warmthFilter.frequency.setValueAtTime(200, ctx.currentTime);
    this.warmthFilter.gain.setValueAtTime(config.warmthDb, ctx.currentTime);

    // 2b. Presence & Diction Clarity (Peaking bell at 3.5kHz)
    this.presenceFilter = ctx.createBiquadFilter();
    this.presenceFilter.type = 'peaking';
    this.presenceFilter.frequency.setValueAtTime(3500, ctx.currentTime);
    this.presenceFilter.Q.setValueAtTime(1.1, ctx.currentTime);
    this.presenceFilter.gain.setValueAtTime(config.presenceDb, ctx.currentTime);

    // 2c. Air & Brilliance (High Shelf at 10kHz)
    this.airFilter = ctx.createBiquadFilter();
    this.airFilter.type = 'highshelf';
    this.airFilter.frequency.setValueAtTime(10000, ctx.currentTime);
    this.airFilter.gain.setValueAtTime(config.airDb, ctx.currentTime);

    // 3. Studio Dynamics Compressor
    this.compressor = ctx.createDynamicsCompressor();
    if (config.compressorEnabled) {
      this.compressor.threshold.setValueAtTime(-22, ctx.currentTime);
      this.compressor.knee.setValueAtTime(25, ctx.currentTime);
      this.compressor.ratio.setValueAtTime(3.5, ctx.currentTime);
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

    // 4. Parallel Reverb Split: Dry / Wet Routing
    this.dryGain = ctx.createGain();
    this.wetGain = ctx.createGain();
    this.masterProcessedGain = ctx.createGain();

    const wetLevel = Math.max(0, Math.min(1, config.reverbWetLevel));
    this.dryGain.gain.setValueAtTime(1.0 - wetLevel * 0.4, ctx.currentTime);
    this.wetGain.gain.setValueAtTime(wetLevel, ctx.currentTime);

    // Dry path
    this.compressor.connect(this.dryGain);
    this.dryGain.connect(this.masterProcessedGain);

    // Wet path (Convolution Reverb)
    if (config.reverbPreset !== 'dry') {
      this.convolver = ctx.createConvolver();
      const reverbBuffer = this.getOrCreateReverbBuffer(ctx, config.reverbPreset);
      if (reverbBuffer) {
        this.convolver.buffer = reverbBuffer;
      }
      this.compressor.connect(this.convolver);
      this.convolver.connect(this.wetGain);
      this.wetGain.connect(this.masterProcessedGain);
    }

    return {
      processedOutput: this.masterProcessedGain,
      analyserInput: this.masterProcessedGain,
    };
  }

  /**
   * Update DSP parameters in real time without restarting recording
   */
  public updateParameters(config: Partial<VocalDspConfig>): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.currentConfig = { ...this.currentConfig, ...config };

    if (this.lowCutFilter && config.lowCutEnabled !== undefined) {
      this.lowCutFilter.frequency.setTargetAtTime(config.lowCutEnabled ? 80 : 10, now, 0.05);
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
      this.compressor.ratio.setTargetAtTime(config.compressorEnabled ? 3.5 : 1, now, 0.05);
      this.compressor.threshold.setTargetAtTime(config.compressorEnabled ? -22 : 0, now, 0.05);
    }
    if (this.wetGain && this.dryGain && config.reverbWetLevel !== undefined) {
      const wet = Math.max(0, Math.min(1, config.reverbWetLevel));
      this.wetGain.gain.setTargetAtTime(wet, now, 0.05);
      this.dryGain.gain.setTargetAtTime(1.0 - wet * 0.4, now, 0.05);
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
   * Creates classical Sa-Pa harmonic acoustic drone with subtle natural chorus
   */
  public startTanpuraDrone(ctx: AudioContext, volume = 0.22): void {
    this.stopTanpuraDrone();
    this.isTanpuraPlaying = true;

    this.tanpuraGain = ctx.createGain();
    this.tanpuraGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.tanpuraGain.gain.exponentialRampToValueAtTime(
      Math.max(0.01, Math.min(1, volume)),
      ctx.currentTime + 1.2
    );
    this.tanpuraGain.connect(ctx.destination);

    // Fundamental note: Classical C3 (Sa = 130.81 Hz), Pa (G3 = 196.00 Hz), Octave Sa (C4 = 261.63 Hz)
    const tones = [
      { freq: 130.81, type: 'sawtooth' as OscillatorType, gainVal: 0.18, lfoRate: 0.11 },
      { freq: 196.0, type: 'triangle' as OscillatorType, gainVal: 0.22, lfoRate: 0.17 },
      { freq: 261.63, type: 'sawtooth' as OscillatorType, gainVal: 0.15, lfoRate: 0.13 },
      { freq: 262.15, type: 'sine' as OscillatorType, gainVal: 0.25, lfoRate: 0.19 }, // Slight detune for shimmer
    ];

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(850, ctx.currentTime);
    lowpass.Q.setValueAtTime(1.5, ctx.currentTime);
    lowpass.connect(this.tanpuraGain);

    for (const t of tones) {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = t.type;
      osc.frequency.setValueAtTime(t.freq, ctx.currentTime);

      // Add gentle LFO chorus
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(t.lfoRate, ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      this.tanpuraOscillators.push(lfo);

      toneGain.gain.setValueAtTime(t.gainVal, ctx.currentTime);
      osc.connect(toneGain);
      toneGain.connect(lowpass);

      osc.start();
      this.tanpuraOscillators.push(osc);
    }
  }

  public setTanpuraVolume(volume: number): void {
    if (this.tanpuraGain && this.ctx) {
      const safeVol = Math.max(0.001, Math.min(1, volume));
      this.tanpuraGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.1);
    }
  }

  public stopTanpuraDrone(): void {
    if (this.tanpuraGain && this.ctx) {
      try {
        this.tanpuraGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.4);
      } catch {
        // Ignored
      }
    }

    setTimeout(() => {
      for (const osc of this.tanpuraOscillators) {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignored
        }
      }
      this.tanpuraOscillators = [];
      if (this.tanpuraGain) {
        try {
          this.tanpuraGain.disconnect();
        } catch {
          // Ignored
        }
        this.tanpuraGain = null;
      }
      this.isTanpuraPlaying = false;
    }, 450);
  }

  public getIsTanpuraPlaying(): boolean {
    return this.isTanpuraPlaying;
  }
}

export const voiceDspService = new VoiceDspEngine();
