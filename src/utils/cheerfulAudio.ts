/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Cheerful synthesized background music engine using Web Audio API
// Zero external asset dependencies, zero network requests, instant startup on user click

export class CheerfulMusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.25; // comfortable background level
  private timerId: any = null;
  private currentStep: number = 0;

  // Cheerful, upbeat major melody notes in Hz (C Major Pentatonic & Heptatonic)
  // C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, G5
  private readonly notes: { [key: string]: number } = {
    C3: 130.81,
    E3: 164.81,
    F3: 174.61,
    G3: 196.00,
    A3: 220.00,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    G5: 783.99,
  };

  // 16-step upbeat, cheerful rhythm pattern (approx 106 BPM)
  private readonly melodyPattern: (string | null)[] = [
    'E5', 'G5', 'C5', 'E5',   // Bar 1: energetic upbeat bell chime
    'D5', 'G4', 'B4', 'D5',   // Bar 2: bright resolution
    'C5', 'E5', 'A4', 'C5',   // Bar 3: cheerful swing
    'G4', 'C5', 'D5', 'E5',   // Bar 4: melodic lift
    'F5', 'E5', 'D5', 'C5',   // Bar 5: walking progression
    'D5', 'B4', 'G4', 'B4',   // Bar 6: playful cadence
    'C5', 'G4', 'E4', 'G4',   // Bar 7: warm acoustic chime
    'C5', 'E5', 'D5', 'C5'    // Bar 8: happy turnaround
  ];

  private readonly bassPattern: (string | null)[] = [
    'C3', null, 'G3', null,
    'G3', null, 'D3', null,
    'A3', null, 'E3', null,
    'F3', null, 'G3', null,
    'F3', null, 'C3', null,
    'G3', null, 'B3', null,
    'C3', null, 'G3', null,
    'C3', null, 'G3', null
  ];

  public init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  public play() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Step every 240ms (~125 BPM 8th notes, cheerful & lively)
    const stepInterval = 240;
    this.timerId = setInterval(() => {
      this.tick();
    }, stepInterval);
  }

  private tick() {
    if (!this.ctx || !this.masterGain || !this.isPlaying || this.isMuted) {
      this.currentStep = (this.currentStep + 1) % this.melodyPattern.length;
      return;
    }

    const now = this.ctx.currentTime;
    const melodyNote = this.melodyPattern[this.currentStep];
    const bassNote = this.bassPattern[this.currentStep];

    // Play high melody note (cute xylophone / kalimba chime tone)
    if (melodyNote && this.notes[melodyNote]) {
      this.playChime(this.notes[melodyNote], now, 0.22, 0.12);
    }

    // Play soft bass note on beats
    if (bassNote && this.notes[bassNote]) {
      this.playBass(this.notes[bassNote], now, 0.35, 0.08);
    }

    this.currentStep = (this.currentStep + 1) % this.melodyPattern.length;
  }

  private playChime(freq: number, time: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Triangle gives a clean, cheerful toy piano / kalimba timbre
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Filter to warm the high notes
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);

    // Fast pluck envelope
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playBass(freq: number, time: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sine gives a warm, round gentle bass foundation
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.volume, now + 0.1);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && !this.isMuted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public destroy() {
    this.pause();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {
        // ignore
      }
      this.ctx = null;
    }
  }
}
