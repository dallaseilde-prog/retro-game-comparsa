export class AudioController {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  playTone(f, t, d) {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = t;
    o.frequency.setValueAtTime(f, this.ctx.currentTime);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + d);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + d);
  }
  playJump() { this.playTone(400, 'square', 0.1); }
  playCollect() { this.playTone(800, 'sine', 0.1); }
  playDie() { this.playTone(200, 'sawtooth', 0.3); }
  playWin() { this.playTone(600, 'triangle', 0.2); }
}
