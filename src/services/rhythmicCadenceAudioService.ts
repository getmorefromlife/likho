/**
 * Acoustic Bahar Rhythm & Cadence Audio Service (صوتی بحری تال و ترنم)
 *
 * Uses the browser's native Web Audio API (zero external sound files or dependencies)
 * to synthesize authentic rhythmic acoustic percussion for Urdu meter patterns:
 * - Long Syllables (= / بلند / سبب): Resonant, deep acoustic drum tone (مثلِ دُھن / بھاری تال).
 * - Short Syllables (- / کوتاہ / وتد): Crisp, light percussive snap (مثلِ تالی / کھلی تال).
 *
 * Strict Right-to-Left cadence sequencing with real-time syllable and rukn synchronization.
 */

export interface PlaybackTick {
  syllableGlobalIndex: number;
  ruknIndex: number;
  symbol: string;
}

export type CadenceTempo = 'slow' | 'medium' | 'fast';

export const CADENCE_TEMPO_BPM: Record<CadenceTempo, number> = {
  slow: 75,
  medium: 100,
  fast: 130,
};

export const CADENCE_TEMPO_LABELS: Record<CadenceTempo, string> = {
  slow: 'سست (75 BPM)',
  medium: 'متوازن (100 BPM)',
  fast: 'تیز (130 BPM)',
};

class RhythmicCadenceAudioService {
  private ctx: AudioContext | null = null;
  private isCurrentlyPlaying = false;
  private isCurrentlyPaused = false;
  private timerId: number | null = null;
  private currentStepIndex = 0;
  private scheduleQueue: {
    syllableGlobalIndex: number;
    ruknIndex: number;
    symbol: string;
    durationUnits: number;
  }[] = [];
  private onTickCallback: ((tick: PlaybackTick | null) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private activeBpm = 100;
  private isLoopEnabled = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Synthesize a deep resonant acoustic beat for a long syllable (=)
   */
  private playLongSyllableSound(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Frequency sweeps from warm 170Hz down to resonant 60Hz
    osc.frequency.setValueAtTime(170, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.22);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  /**
   * Synthesize a crisp high percussive sound for a short syllable (-)
   */
  private playShortSyllableSound(ctx: AudioContext, time: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Crisp strike frequency around 340Hz decaying quickly
    osc.frequency.setValueAtTime(340, time);
    osc.frequency.exponentialRampToValueAtTime(180, time + 0.11);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  /**
   * Builds the sequence of syllables grouped by Rukn.
   * If afailList or groupedPatternList is provided, maps each syllable to its Rukn.
   */
  public parseCadenceSchedule(
    pattern: string,
    afailList?: string[]
  ): {
    syllableGlobalIndex: number;
    ruknIndex: number;
    symbol: string;
    durationUnits: number;
  }[] {
    const chunks = pattern.trim().split(/[\s/]+/);
    const queue: {
      syllableGlobalIndex: number;
      ruknIndex: number;
      symbol: string;
      durationUnits: number;
    }[] = [];

    let globalIdx = 0;
    chunks.forEach((chunk, ruknIdx) => {
      const symbols = chunk.replace(/[^=\-x]/gu, '').split('');
      symbols.forEach((sym) => {
        const isLong = sym === '=';
        // Long syllable has 2 acoustic units of time; short has 1
        queue.push({
          syllableGlobalIndex: globalIdx,
          ruknIndex: afailList && afailList[ruknIdx] ? ruknIdx : 0,
          symbol: sym,
          durationUnits: isLong ? 2 : 1,
        });
        globalIdx++;
      });
      // Slight pause between Arkan (feet)
      if (ruknIdx < chunks.length - 1) {
        queue.push({
          syllableGlobalIndex: -1,
          ruknIndex: ruknIdx,
          symbol: 'pause',
          durationUnits: 1,
        });
      }
    });

    return queue;
  }

  public play(
    pattern: string,
    options: {
      afailList?: string[];
      bpm?: number;
      tempo?: CadenceTempo;
      loop?: boolean;
      onTick?: (tick: PlaybackTick | null) => void;
      onEnd?: () => void;
    } = {}
  ) {
    this.stop();

    this.activeBpm =
      options.bpm || (options.tempo ? CADENCE_TEMPO_BPM[options.tempo] : 100);
    this.isLoopEnabled = Boolean(options.loop);
    this.onTickCallback = options.onTick || null;
    this.onEndCallback = options.onEnd || null;

    this.scheduleQueue = this.parseCadenceSchedule(pattern, options.afailList);
    if (this.scheduleQueue.length === 0) return;

    this.isCurrentlyPlaying = true;
    this.isCurrentlyPaused = false;
    this.currentStepIndex = 0;

    this.step();
  }

  private step() {
    if (!this.isCurrentlyPlaying || this.isCurrentlyPaused) return;

    if (this.currentStepIndex >= this.scheduleQueue.length) {
      if (this.isLoopEnabled) {
        this.currentStepIndex = 0;
        // 2-unit breath pause before looping
        const unitMs = (60 / this.activeBpm / 2) * 1000;
        if (this.onTickCallback) this.onTickCallback(null);
        this.timerId = window.setTimeout(() => this.step(), unitMs * 2);
        return;
      }
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const item = this.scheduleQueue[this.currentStepIndex];
    const ctx = this.getAudioContext();
    const now = ctx.currentTime;

    if (item.symbol === '=') {
      this.playLongSyllableSound(ctx, now);
      if (this.onTickCallback && item.syllableGlobalIndex >= 0) {
        this.onTickCallback({
          syllableGlobalIndex: item.syllableGlobalIndex,
          ruknIndex: item.ruknIndex,
          symbol: item.symbol,
        });
      }
    } else if (item.symbol === '-' || item.symbol === 'x') {
      this.playShortSyllableSound(ctx, now);
      if (this.onTickCallback && item.syllableGlobalIndex >= 0) {
        this.onTickCallback({
          syllableGlobalIndex: item.syllableGlobalIndex,
          ruknIndex: item.ruknIndex,
          symbol: item.symbol,
        });
      }
    } else {
      // Pause
      if (this.onTickCallback) {
        this.onTickCallback(null);
      }
    }

    const unitMs = (60 / this.activeBpm / 2) * 1000;
    const stepDurationMs = item.durationUnits * unitMs;

    this.currentStepIndex++;
    this.timerId = window.setTimeout(() => {
      this.step();
    }, stepDurationMs);
  }

  public pause() {
    this.isCurrentlyPaused = true;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.onTickCallback) {
      this.onTickCallback(null);
    }
  }

  public resume() {
    if (this.isCurrentlyPlaying && this.isCurrentlyPaused) {
      this.isCurrentlyPaused = false;
      this.step();
    }
  }

  public stop() {
    this.isCurrentlyPlaying = false;
    this.isCurrentlyPaused = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentStepIndex = 0;
    if (this.onTickCallback) {
      this.onTickCallback(null);
    }
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying && !this.isCurrentlyPaused;
  }

  public isPaused(): boolean {
    return this.isCurrentlyPlaying && this.isCurrentlyPaused;
  }
}

export const rhythmicCadenceAudioService = new RhythmicCadenceAudioService();
