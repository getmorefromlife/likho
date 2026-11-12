import type { VoiceRecordingMeta } from '../types/editor';
import { voiceDspService, VocalDspConfig } from './voiceDspService';

/**
 * Supported MIME types across modern browsers (Chromium, Firefox, Safari iOS/macOS)
 */
export function getSupportedMimeType(): string {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') {
    return 'audio/webm';
  }

  const preferredTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/wav',
  ];

  for (const type of preferredTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return '';
}

/**
 * Format duration in seconds to standard MM:SS
 */
export function formatDurationMMSS(totalSeconds: number): string {
  const rounded = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert standard digits to Eastern Arabic / Urdu numerals
 */
export function toUrduNumerals(numStr: string): string {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numStr.replace(/\d/g, (d) => urduDigits[parseInt(d, 10)]);
}

export type RecitationRecordingState = 'inactive' | 'recording' | 'paused';

class VoiceRecitationService {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private recordedChunks: Blob[] = [];
  private startTime = 0;
  private pausedDuration = 0;
  private pauseStartTime = 0;
  private state: RecitationRecordingState = 'inactive';

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      typeof window.MediaRecorder !== 'undefined'
    );
  }

  public getState(): RecitationRecordingState {
    return this.state;
  }

  public async ensureAudioContext(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioContext = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch {
        // Ignored
      }
    }
    return this.audioContext;
  }

  public getAudioContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioContext = new AudioCtx();
      } catch {
        // Ignored
      }
    }
    return this.audioContext;
  }

  /**
   * Start microphone recording with live amplitude visualizer callback and optional DSP configuration
   */
  public async startRecording(
    onAmplitudeUpdate?: (levels: number[]) => void,
    dspConfig?: VocalDspConfig
  ): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('براؤزر میں مائیکروفون ریکارڈنگ کی سہولت دستیاب نہیں ہے۔');
    }

    // Stop any existing session
    this.cancelRecording();

    try {
      const useHardwareNoise = dspConfig ? dspConfig.noiseGateEnabled : true;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: useHardwareNoise,
          autoGainControl: false,
        },
        video: false,
      });

      let recordStream = this.mediaStream;

      // Set up Web Audio DSP chain and Analyser
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioContext = new AudioCtx();
        if (this.audioContext.state === 'suspended') {
          void this.audioContext.resume();
        }

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        const config = dspConfig || voiceDspService.currentConfig;
        const dspGraph = voiceDspService.buildDspGraph(this.audioContext, source, config);

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64; // Gives 32 frequency bins
        this.analyser.smoothingTimeConstant = 0.8;
        dspGraph.analyserInput.connect(this.analyser);
        voiceDspService.startDuckingMonitor(this.analyser);

        // Route processed studio audio to MediaStreamDestination so MediaRecorder captures the broadcast sound
        if (typeof this.audioContext.createMediaStreamDestination === 'function') {
          const destination = this.audioContext.createMediaStreamDestination();
          dspGraph.processedOutput.connect(destination);
          recordStream = destination.stream;
        }

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const pollVisualizer = () => {
          if (this.state === 'recording' && this.analyser) {
            this.analyser.getByteFrequencyData(dataArray);
            // Normalize 0-255 to 0.0-1.0
            const levels: number[] = [];
            for (let i = 0; i < bufferLength; i += 2) {
              levels.push(dataArray[i] / 255);
            }
            if (onAmplitudeUpdate) {
              onAmplitudeUpdate(levels);
            }
            this.animationFrameId = requestAnimationFrame(pollVisualizer);
          }
        };

        this.animationFrameId = requestAnimationFrame(pollVisualizer);
      } catch (audioCtxError) {
        console.warn('Web Audio DSP graph could not be initialized:', audioCtxError);
      }

      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      this.mediaRecorder = new MediaRecorder(recordStream, options);

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.startTime = Date.now();
      this.pausedDuration = 0;
      this.state = 'recording';
      this.mediaRecorder.start(250); // Emit chunks every 250ms
    } catch (err: unknown) {
      this.cleanup();
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Permission') || message.includes('denied') || message.includes('NotAllowedError')) {
        throw new Error('مائیکروفون کی اجازت نہیں ملی۔ براہ کرم براؤزر سیٹنگز میں مائیکروفون فعال فرمائیں۔');
      }
      throw new Error(`ریکارڈنگ شروع نہیں ہو سکی: ${message}`);
    }
  }

  /**
   * Pause ongoing recording
   */
  public pauseRecording(): void {
    if (this.mediaRecorder && this.state === 'recording') {
      this.mediaRecorder.pause();
      this.state = 'paused';
      this.pauseStartTime = Date.now();
    }
  }

  /**
   * Resume paused recording
   */
  public resumeRecording(): void {
    if (this.mediaRecorder && this.state === 'paused') {
      this.mediaRecorder.resume();
      this.state = 'recording';
      if (this.pauseStartTime > 0) {
        this.pausedDuration += Date.now() - this.pauseStartTime;
        this.pauseStartTime = 0;
      }
    }
  }

  /**
   * Stop recording, process audio data, and return VoiceRecordingMeta
   */
  public async stopRecording(options?: {
    title?: string;
    poet?: string;
    mode?: 'tarannum' | 'taht-ul-lafz';
    withMetronome?: boolean;
  }): Promise<VoiceRecordingMeta> {
    if (!this.mediaRecorder || this.state === 'inactive') {
      throw new Error('کوئی ریکارڈنگ فعال نہیں ہے۔');
    }

    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - this.startTime - this.pausedDuration) / 1000)
    );

    return new Promise<VoiceRecordingMeta>((resolve, reject) => {
      const recorder = this.mediaRecorder!;
      const mimeType = recorder.mimeType || getSupportedMimeType() || 'audio/webm';

      recorder.onstop = async () => {
        try {
          const finalBlob = new Blob(this.recordedChunks, { type: mimeType });
          const base64DataUrl = await this.blobToBase64(finalBlob);

          const result: VoiceRecordingMeta = {
            id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            blobDataUrl: base64DataUrl,
            mimeType,
            durationSeconds,
            recordedAt: Date.now(),
            title: options?.title,
            poet: options?.poet,
            mode: options?.mode || 'tarannum',
            withMetronome: options?.withMetronome || false,
          };

          this.cleanup();
          resolve(result);
        } catch (convErr) {
          this.cleanup();
          reject(convErr);
        }
      };

      try {
        recorder.stop();
      } catch (stopErr) {
        this.cleanup();
        reject(stopErr);
      }
    });
  }

  /**
   * Cancel and discard current recording session
   */
  public cancelRecording(): void {
    if (this.mediaRecorder && this.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        // Ignored during cancel
      }
    }
    this.cleanup();
  }

  /**
   * Direct download of a recorded voice file
   */
  public downloadRecording(recording: VoiceRecordingMeta, defaultTitle?: string): void {
    if (!recording.blobDataUrl) return;

    const extension = recording.mimeType.includes('mp4')
      ? 'mp4'
      : recording.mimeType.includes('ogg')
      ? 'ogg'
      : recording.mimeType.includes('wav')
      ? 'wav'
      : 'webm';

    const safeTitle = (defaultTitle || recording.title || 'کلام')
      .trim()
      .replace(/[\\/:*?"<>|\s]+/g, '_');

    const modeLabel = recording.mode === 'taht-ul-lafz' ? 'تحت_اللفظ' : 'ترنم';
    const filename = `${safeTitle}_${modeLabel}_${Date.now()}.${extension}`;

    const anchor = document.createElement('a');
    anchor.href = recording.blobDataUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('آڈیو فائل کو محفوظ ڈیٹا میں تبدیل نہیں کیا جا سکا۔'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  private cleanup(): void {
    voiceDspService.stopDuckingMonitor();
    voiceDspService.stopBackgroundMusic();
    voiceDspService.stopTanpuraDrone();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      void this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.analyser = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.state = 'inactive';
    this.startTime = 0;
    this.pausedDuration = 0;
    this.pauseStartTime = 0;
  }
}

export const voiceRecitationService = new VoiceRecitationService();
