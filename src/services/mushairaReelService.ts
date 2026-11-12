/**
 * Mushaira 9:16 Video Reel Renderer (HD Portrait WebM Export)
 *
 * Combines the poet's Urdu verses, title, calligraphic framing, animated waveform,
 * and mastered/ducked audio buffer into a shareable 9:16 portrait video (.webm)
 * for WhatsApp Status, Instagram Reels, and YouTube Shorts — 100% client-side.
 */

export type ReelThemeId = 'midnight_mushaira' | 'royal_parchment' | 'emerald_garden';

export interface ReelThemeSpec {
  id: ReelThemeId;
  label: string;
  bgTop: string;
  bgBottom: string;
  accent: string;
  textPrimary: string;
  textMuted: string;
  frameBorder: string;
}

export const REEL_THEMES: Record<ReelThemeId, ReelThemeSpec> = {
  midnight_mushaira: {
    id: 'midnight_mushaira',
    label: 'شبِ مشاعرہ',
    bgTop: '#12101a',
    bgBottom: '#23192d',
    accent: '#d4af37',
    textPrimary: '#f9f5eb',
    textMuted: '#c5b8d9',
    frameBorder: 'rgba(212, 175, 55, 0.45)',
  },
  royal_parchment: {
    id: 'royal_parchment',
    label: 'کاغذِ طلائی',
    bgTop: '#fbf6ec',
    bgBottom: '#f1e4cc',
    accent: '#8a5a19',
    textPrimary: '#241a10',
    textMuted: '#6d573d',
    frameBorder: 'rgba(138, 90, 25, 0.35)',
  },
  emerald_garden: {
    id: 'emerald_garden',
    label: 'سبزۂ سخن',
    bgTop: '#0d1f1a',
    bgBottom: '#16352c',
    accent: '#e3c068',
    textPrimary: '#f2f7f4',
    textMuted: '#a6c4b8',
    frameBorder: 'rgba(227, 192, 104, 0.4)',
  },
};

/**
 * Splits poem text into couplets (2-line stanzas) or groups of up to 2 lines
 * so each screen of the 9:16 reel remains spacious and legible in Nastaliq.
 */
export function splitPoemIntoCouplets(content: string): string[][] {
  const rawLines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('—') && !line.startsWith('---'));

  if (rawLines.length === 0) {
    return [['کلامِ شاعر']];
  }

  const couplets: string[][] = [];
  for (let i = 0; i < rawLines.length; i += 2) {
    couplets.push(rawLines.slice(i, i + 2));
  }
  return couplets;
}

/**
 * Maps normalized playback progress [0..1] to the active couplet index.
 */
export function computeReelActiveVerseIndex(progress01: number, coupletsCount: number): number {
  if (coupletsCount <= 1) return 0;
  const clamped = Math.max(0, Math.min(0.9999, progress01));
  return Math.min(coupletsCount - 1, Math.floor(clamped * coupletsCount));
}

function drawWrappedRtlLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, centerX, y);
    y += lineHeight;
  }
  return y;
}

export interface RenderReelParams {
  title: string;
  content: string;
  poetName?: string;
  audioBuffer: AudioBuffer;
  themeId: ReelThemeId;
  onProgress?: (percent: number) => void;
}

/**
 * Renders a 720x1280 (9:16 portrait) WebM video reel in real time using
 * Canvas captureStream + AudioContext MediaStreamDestination + MediaRecorder.
 */
export async function renderMushairaVideoReel(params: RenderReelParams): Promise<Blob> {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('اس براؤزر میں ویڈیو ریل ریکارڈنگ (MediaRecorder) دستیاب نہیں ہے۔');
  }

  const width = 720;
  const height = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('کینوس گرافکس تیار نہیں ہو سکی۔');
  }

  const canvasWithStream = canvas as HTMLCanvasElement & {
    captureStream?: (fps?: number) => MediaStream;
  };
  if (typeof canvasWithStream.captureStream !== 'function') {
    throw new Error('اس براؤزر میں کینوس ویڈیو اسٹریم (captureStream) سپورٹ نہیں ہے۔');
  }

  const theme = REEL_THEMES[params.themeId] || REEL_THEMES.midnight_mushaira;
  const couplets = splitPoemIntoCouplets(params.content);
  const durationSec = Math.max(0.5, params.audioBuffer.duration);
  const channelData = params.audioBuffer.getChannelData(0);
  const sampleRate = params.audioBuffer.sampleRate;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const dest = audioCtx.createMediaStreamDestination();
  const source = audioCtx.createBufferSource();
  source.buffer = params.audioBuffer;
  source.connect(dest);

  const videoStream = canvasWithStream.captureStream(30);
  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  const mimeCandidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  const selectedMime = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  const recorder = new MediaRecorder(combinedStream, {
    mimeType: selectedMime,
    videoBitsPerSecond: 2_200_000,
    audioBitsPerSecond: 128_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) {
      chunks.push(ev.data);
    }
  };

  const drawFrame = (elapsedSec: number) => {
    const progress = Math.max(0, Math.min(1, elapsedSec / durationSec));
    const activeIdx = computeReelActiveVerseIndex(progress, couplets.length);
    const activeCouplet = couplets[activeIdx] || couplets[0];

    // 1. Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, theme.bgTop);
    grad.addColorStop(1, theme.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Royal outer & inner frame
    ctx.strokeStyle = theme.frameBorder;
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, width - 56, height - 56);
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // 3. Header Badge & Title
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = theme.accent;
    ctx.font = '600 22px "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif';
    ctx.fillText('قلم و قافیہ  •  مشاعرہ ریل', width / 2, 105);

    ctx.fillStyle = theme.textPrimary;
    ctx.font = '700 38px "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif';
    const cleanTitle = (params.title || 'بلا عنوان کلام').trim();
    drawWrappedRtlLines(ctx, cleanTitle, width / 2, 185, width - 140, 62);

    if (params.poetName && params.poetName.trim().length > 0) {
      ctx.fillStyle = theme.textMuted;
      ctx.font = '500 24px "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif';
      ctx.fillText(params.poetName.trim(), width / 2, 265);
    }

    // Divider line
    ctx.strokeStyle = theme.frameBorder;
    ctx.beginPath();
    ctx.moveTo(160, 310);
    ctx.lineTo(width - 160, 310);
    ctx.stroke();

    // 4. Center Active Couplet
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '600 36px "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif';
    let verseY = activeCouplet.length === 1 ? 610 : 535;
    for (const misra of activeCouplet) {
      verseY = drawWrappedRtlLines(ctx, misra, width / 2, verseY, width - 130, 82);
      verseY += 28;
    }

    // Couplet indicator
    if (couplets.length > 1) {
      ctx.fillStyle = theme.textMuted;
      ctx.font = '500 20px sans-serif';
      ctx.fillText(`${activeIdx + 1} / ${couplets.length}`, width / 2, 920);
    }

    // 5. Reactive Golden Audio Bars
    const barCount = 28;
    const barWidth = 10;
    const gap = 8;
    const totalW = barCount * barWidth + (barCount - 1) * gap;
    const startX = (width - totalW) / 2;
    const baseSample = Math.floor(elapsedSec * sampleRate);

    ctx.fillStyle = theme.accent;
    for (let i = 0; i < barCount; i++) {
      const sampleOffset = Math.min(
        channelData.length - 1,
        Math.max(0, baseSample + i * 180)
      );
      const amp = Math.abs(channelData[sampleOffset] || 0);
      const barH = Math.max(10, Math.min(92, 12 + amp * 190));
      const x = startX + i * (barWidth + gap);
      const y = 1090 - barH / 2;
      ctx.fillRect(x, y, barWidth, barH);
    }

    // 6. Bottom Progress Track
    ctx.fillStyle = theme.frameBorder;
    ctx.fillRect(80, 1185, width - 160, 6);
    ctx.fillStyle = theme.accent;
    ctx.fillRect(80, 1185, (width - 160) * progress, 6);
  };

  return new Promise<Blob>((resolve, reject) => {
    let timerId: number | null = null;
    let settled = false;

    const cleanup = () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
      videoStream.getTracks().forEach((t) => t.stop());
      dest.stream.getTracks().forEach((t) => t.stop());
      void audioCtx.close().catch(() => undefined);
    };

    recorder.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('ویڈیو ریل بناتے وقت خرابی پیش آئی۔'));
    };

    recorder.onstop = () => {
      if (settled) return;
      settled = true;
      cleanup();
      params.onProgress?.(100);
      resolve(new Blob(chunks, { type: selectedMime }));
    };

    drawFrame(0);
    params.onProgress?.(0);
    recorder.start(200);
    const startTimeMs = performance.now();
    source.start(0);

    timerId = window.setInterval(() => {
      const elapsedSec = (performance.now() - startTimeMs) / 1000;
      drawFrame(elapsedSec);
      const pct = Math.min(99, Math.round((elapsedSec / durationSec) * 100));
      params.onProgress?.(pct);

      if (elapsedSec >= durationSec + 0.08) {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }
    }, 33);

    source.onended = () => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    };
  });
}

