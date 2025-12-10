// A simple synthesizer for retro sounds to avoid external assets
class AudioService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  toggle(on: boolean) {
    this.enabled = on;
  }

  private playTone(freq: number, type: OscillatorType, duration: number) {
    if (!this.ctx || !this.enabled) return;
    
    // Resume context if suspended (browser policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playKeypress() {
    // High pitched short blip
    this.playTone(600, 'square', 0.05);
  }

  playError() {
    // Low pitched buzzy sound
    this.playTone(150, 'sawtooth', 0.15);
  }

  playSuccess() {
    // Ascending arpeggio-ish sound
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    [440, 554, 659].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.05 + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.1);
    });
  }
}

export const audioService = new AudioService();
