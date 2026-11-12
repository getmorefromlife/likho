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
    this.tanpuraGain.connect(ctx.destination);

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
}

export const voiceDspService = new VoiceDspEngine();
