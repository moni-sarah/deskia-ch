// Audio helpers for Gemini Live: PCM16 capture @ 16kHz and playback @ 24kHz.

export function pcm16ToBase64(int16: Int16Array): string {
  const bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function base64ToInt16(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  // Copy to ensure aligned buffer
  const aligned = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(aligned).set(bytes);
  return new Int16Array(aligned);
}

export function floatToPcm16(float32: Float32Array): Int16Array {
  const out = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

export function downsampleTo16k(input: Float32Array, inputSampleRate: number): Float32Array {
  if (inputSampleRate === 16000) return input;
  const ratio = inputSampleRate / 16000;
  const newLen = Math.floor(input.length / ratio);
  const out = new Float32Array(newLen);
  for (let i = 0; i < newLen; i++) {
    const srcStart = Math.floor(i * ratio);
    const srcEnd = Math.floor((i + 1) * ratio);
    let sum = 0;
    let count = 0;
    for (let j = srcStart; j < srcEnd && j < input.length; j++) {
      sum += input[j];
      count++;
    }
    out[i] = count > 0 ? sum / count : 0;
  }
  return out;
}

/** Sequentially queue PCM16 @ 24kHz chunks for gap-free playback. */
export class PcmPlayer {
  private ctx: AudioContext;
  private nextStartTime = 0;
  private sources: AudioBufferSourceNode[] = [];
  readonly sampleRate = 24000;

  constructor() {
    this.ctx =
      new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
        sampleRate: this.sampleRate,
      });
  }

  resume() {
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  enqueue(int16: Int16Array) {
    const float = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float[i] = int16[i] / 0x8000;
    const buf = this.ctx.createBuffer(1, float.length, this.sampleRate);
    buf.getChannelData(0).set(float);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.ctx.destination);
    const start = Math.max(this.ctx.currentTime, this.nextStartTime);
    src.start(start);
    this.nextStartTime = start + buf.duration;
    this.sources.push(src);
    src.onended = () => {
      this.sources = this.sources.filter((s) => s !== src);
    };
  }

  /** Stop playback immediately and discard the queue (used for barge-in). */
  interrupt() {
    for (const s of this.sources) {
      try { s.stop(); } catch { /* already stopped */ }
    }
    this.sources = [];
    this.nextStartTime = 0;
  }

  close() {
    this.interrupt();
    void this.ctx.close();
  }
}
