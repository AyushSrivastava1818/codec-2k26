/* ==========================================================================
   CODEC 2K26 — CINEMATIC AUDIO MANAGER
   Dynamic Procedural Web Audio Engine
   Atmospheric Haunted Mansion Wind, Distant Thunder, Iron Gate Creak,
   Portal Whooshes, Rotunda Drone & Chamber Chimes
   ========================================================================== */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.masterGain = null;

    // Ambient Drone Oscillators & Filters
    this.droneGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;

    // Wind Generator
    this.windGain = null;
    this.windNode = null;

    // Rotunda Resonance
    this.rotundaGain = null;
    this.rotundaOsc = null;
    this.rotundaFilter = null;

    this.currentStage = 'exterior';
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = !this.isEnabled;

    if (this.isEnabled) {
      this.startAtmosphere();
    } else {
      this.stopAtmosphere();
    }

    return this.isEnabled;
  }

  startAtmosphere() {
    if (!this.ctx || !this.isEnabled) return;

    try {
      // 1. Deep Sub Drone (Mansion exterior & hall)
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 3);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(160, this.ctx.currentTime);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A1

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(110.3, this.ctx.currentTime); // Subtle beating

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // 2. Wind Buffer Generator
      this.startWind();
    } catch (e) {
      console.warn('Audio start failed', e);
    }
  }

  startWind() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      this.windNode = this.ctx.createBufferSource();
      this.windNode.buffer = noiseBuffer;
      this.windNode.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      windFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.windGain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 2.5);

      this.windNode.connect(windFilter);
      windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      this.windNode.start();
    } catch (e) {}
  }

  stopAtmosphere() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      if (this.droneGain) {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
        setTimeout(() => {
          try {
            this.droneOsc1?.stop();
            this.droneOsc2?.stop();
          } catch (e) {}
        }, 450);
      }
      if (this.windGain) {
        this.windGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
        setTimeout(() => {
          try {
            this.windNode?.stop();
          } catch (e) {}
        }, 450);
      }
    } catch (e) {}
  }

  // Heavy Gothic Mansion Gate Creaking & Mechanical Thud
  playGateOpenSound() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      // 1. Heavy low metallic rumble
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();
      oscLow.type = 'sawtooth';
      oscLow.frequency.setValueAtTime(45, now);
      oscLow.frequency.exponentialRampToValueAtTime(28, now + 1.2);

      gainLow.gain.setValueAtTime(0.08, now);
      gainLow.gain.linearRampToValueAtTime(0.001, now + 1.2);

      const fLow = this.ctx.createBiquadFilter();
      fLow.type = 'lowpass';
      fLow.frequency.setValueAtTime(140, now);

      oscLow.connect(fLow);
      fLow.connect(gainLow);
      gainLow.connect(this.masterGain);

      oscLow.start(now);
      oscLow.stop(now + 1.2);

      // 2. High metallic creak friction
      const oscCreak = this.ctx.createOscillator();
      const gainCreak = this.ctx.createGain();
      oscCreak.type = 'triangle';
      oscCreak.frequency.setValueAtTime(320, now + 0.1);
      oscCreak.frequency.linearRampToValueAtTime(480, now + 0.6);
      oscCreak.frequency.linearRampToValueAtTime(260, now + 1.0);

      gainCreak.gain.setValueAtTime(0.001, now);
      gainCreak.gain.exponentialRampToValueAtTime(0.045, now + 0.3);
      gainCreak.gain.linearRampToValueAtTime(0.001, now + 1.0);

      oscCreak.connect(gainCreak);
      gainCreak.connect(this.masterGain);

      oscCreak.start(now + 0.1);
      oscCreak.stop(now + 1.0);
    } catch (e) {}
  }

  // Camera Dolly Passing Doorway Whoosh
  playWhoosh() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.35);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Portal / Chamber Door Approach & Focus Chime
  playChamberHover() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // Chamber Portal Entrance Zoom
  playChamberEnter() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.55);

      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(320, now);
      f.frequency.linearRampToValueAtTime(80, now + 0.55);

      osc.connect(f);
      f.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  }

  // Chamber Exit Return Whoosh
  playChamberExit() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Update atmosphere filters based on current scroll progress
  onScrollProgress(p) {
    if (!this.ctx || !this.isEnabled || !this.droneFilter) return;
    try {
      // As user enters the deep rotunda, drone deepens and warm resonance opens up
      const cutoff = 140 + p * 220;
      this.droneFilter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.1);

      if (this.windGain) {
        // Wind is loudest outside (p < 0.3), attenuates inside (p > 0.45)
        const windLevel = Math.max(0.004, 0.035 * (1 - Math.min(1, p * 1.8)));
        this.windGain.gain.setTargetAtTime(windLevel, this.ctx.currentTime, 0.1);
      }
    } catch (e) {}
  }
}

export const audioManager = new AudioManager();
