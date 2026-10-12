/* ==========================================================================
   CODEC 2K26 — CINEMATIC AUDIO MANAGER
   Dynamic Procedural Web Audio Engine
   Haunted Gothic Mansion Ambiance: Ominous Cathedral Bell, Howling Wind,
   Detuned Minor Organ Drone, Distant Rolling Thunder, Spooky Spider Scurry,
   Gate Creak & Spatial Portal Whooshes
   ========================================================================== */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.masterGain = null;

    // Ambient Drone Oscillators & Filters
    this.droneGain = null;
    this.droneOscs = [];
    this.droneFilter = null;
    this.droneLfo = null;
    this.droneLfoGain = null;

    // Howling Wind Generator
    this.windGain = null;
    this.windNode = null;
    this.windFilter = null;
    this.windLfo = null;
    this.windLfoGain = null;

    // Shimmer Pad
    this.shimmerGain = null;
    this.shimmerOsc1 = null;
    this.shimmerOsc2 = null;

    this.harryPotterTimer = null;
    this.activeNoteOscillators = [];

    this.currentStage = 'exterior';
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  async toggle() {
    if (!this.ctx) this.init();
    if (!this.ctx) return false;

    this.isEnabled = !this.isEnabled;

    if (this.isEnabled) {
      if (this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume();
        } catch (e) {
          console.warn('AudioContext resume failed', e);
        }
      }
      if (this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0.85, now);
      }
      // 1. Play immediate signature mystical chime arpeggio
      this.playMysticActivation();
      // 2. Start dynamic, evolving gothic music-box & ambient soundtrack
      this.startAtmosphere();
    } else {
      await this.stopAtmosphere();
    }

    return this.isEnabled;
  }

  // Enchanted Mystical Crystal Chime (Played immediately on audio button toggle)
  playMysticActivation() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      // 3 ascending crystalline harmonic chimes: A4, C5, E5
      const notes = [
        { f: 440.0, time: 0.00, gain: 0.28 },
        { f: 523.25, time: 0.14, gain: 0.26 },
        { f: 659.25, time: 0.28, gain: 0.30 },
        { f: 880.0, time: 0.44, gain: 0.22 }
      ];

      notes.forEach(n => {
        const t = now + n.time;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, t);

        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(n.gain, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

        // Soft stereo pan
        if (this.ctx.createStereoPanner) {
          const pan = this.ctx.createStereoPanner();
          pan.pan.setValueAtTime((Math.random() * 0.8) - 0.4, t);
          osc.connect(g);
          g.connect(pan);
          pan.connect(this.masterGain);
        } else {
          osc.connect(g);
          g.connect(this.masterGain);
        }

        osc.start(t);
        osc.stop(t + 2.5);
      });
    } catch (e) {}
  }

  // Dynamic Evolving Gothic Atmosphere: Melodic Music-Box, Soft Breathing Pad & Ghost Wind
  startAtmosphere() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;

    try {
      // 1. SOFT BREATHING SUB PAD (Not a harsh saw buzz - velvety warm gentle breathing sine)
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.12, now + 2.0);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(180, now);
      this.droneFilter.Q.setValueAtTime(1.2, now);

      // Deep, peaceful root notes: D1 (36.7Hz) & A1 (55Hz)
      const roots = [36.7, 55.0, 73.4];
      this.droneOscs = roots.map(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(this.droneFilter);
        osc.start(now);
        return osc;
      });

      // Slow breathing LFO (undulates smoothly every 7 seconds)
      this.droneLfo = this.ctx.createOscillator();
      this.droneLfo.frequency.setValueAtTime(0.14, now); // 7s breath
      this.droneLfoGain = this.ctx.createGain();
      this.droneLfoGain.gain.setValueAtTime(0.045, now);
      this.droneLfo.connect(this.droneLfoGain);
      this.droneLfoGain.connect(this.droneGain.gain);
      this.droneLfo.start(now);

      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      // 2. GHOSTLY WHISPERING WIND (Soft, filtered, subtle)
      // 2. GHOSTLY WHISPERING AMBIENCE (Lightweight, non-blocking)
      this.startWind();

      // 3. HAUNTING HARRY POTTER HEDWIG'S THEME (Authentic Celesta Melodic Synthesis)
      this.startHarryPotterTheme();
    } catch (e) {
      console.warn('Atmosphere error', e);
    }
  }

  // =========================================================================
  // HARRY POTTER — HEDWIG'S THEME (AUTHENTIC CELESTA ENGINE)
  // Composed by John Williams, Synthesized with Zero-Lag Audio Hardware Clock
  // =========================================================================
  startHarryPotterTheme() {
    this.stopHarryPotterTheme();
    if (!this.isEnabled || !this.ctx) return;

    // Initialize Celesta Hall Shimmer Delay Bus (Lush Hogwarts Great Hall Acoustics)
    if (!this.celestaBus) {
      const now = this.ctx.currentTime;
      this.celestaBus = this.ctx.createGain();
      this.celestaBus.gain.setValueAtTime(1.0, now);

      this.celestaDelay = this.ctx.createDelay();
      this.celestaDelay.delayTime.setValueAtTime(0.24, now);

      this.celestaFeedback = this.ctx.createGain();
      this.celestaFeedback.gain.setValueAtTime(0.26, now);

      this.celestaFilter = this.ctx.createBiquadFilter();
      this.celestaFilter.type = 'lowpass';
      this.celestaFilter.frequency.setValueAtTime(2600, now);

      // Feedback loop with lowpass damping
      this.celestaBus.connect(this.masterGain);
      this.celestaBus.connect(this.celestaDelay);
      this.celestaDelay.connect(this.celestaFilter);
      this.celestaFilter.connect(this.celestaFeedback);
      this.celestaFeedback.connect(this.celestaDelay);
      this.celestaFilter.connect(this.masterGain);
    }

    // Hedwig's Theme in authentic 3/4 Misterioso waltz tempo
    // 1 Beat = 0.46s (~130 BPM in 3/4 time)
    const B = 0.46;
    const melody = [
      // Pickup measure (Beat 3 upbeat)
      { f: 493.88, b: 1.0, isRest: false },  // B4

      // Measure 1: E5 (dotted quarter: 1.5b) - G5 (eighth: 0.5b) - F#5 (quarter: 1.0b)
      { f: 659.25, b: 1.5, isRest: false },  // E5
      { f: 783.99, b: 0.5, isRest: false },  // G5
      { f: 739.99, b: 1.0, isRest: false },  // F#5

      // Measure 2: E5 (half note: 2.0b) - B5 (quarter: 1.0b)
      { f: 659.25, b: 2.0, isRest: false },  // E5
      { f: 987.77, b: 1.0, isRest: false },  // B5

      // Measure 3: A5 (dotted half note: 3.0b full measure)
      { f: 880.00, b: 3.0, isRest: false },  // A5

      // Measure 4: F#5 (dotted half note: 3.0b full measure)
      { f: 739.99, b: 3.0, isRest: false },  // F#5

      // Measure 5: E5 (dotted quarter: 1.5b) - G5 (eighth: 0.5b) - F#5 (quarter: 1.0b)
      { f: 659.25, b: 1.5, isRest: false },  // E5
      { f: 783.99, b: 0.5, isRest: false },  // G5
      { f: 739.99, b: 1.0, isRest: false },  // F#5

      // Measure 6: D#5 (half note: 2.0b) - F5 (quarter: 1.0b)
      { f: 622.25, b: 2.0, isRest: false },  // D#5
      { f: 698.46, b: 1.0, isRest: false },  // F5

      // Measure 7: B4 (dotted half note: 3.0b)
      { f: 493.88, b: 3.0, isRest: false },  // B4

      // Measure 8: Mystical Rest (1.5b) + B4 upbeat (1.0b)
      { f: 0,      b: 1.5, isRest: true  },  // Rest
      { f: 493.88, b: 1.0, isRest: false },  // B4 (upbeat)

      // Measure 9: E5 (1.5b) - G5 (0.5b) - F#5 (1.0b)
      { f: 659.25, b: 1.5, isRest: false },  // E5
      { f: 783.99, b: 0.5, isRest: false },  // G5
      { f: 739.99, b: 1.0, isRest: false },  // F#5

      // Measure 10: E5 (2.0b) - B5 (1.0b)
      { f: 659.25, b: 2.0, isRest: false },  // E5
      { f: 987.77, b: 1.0, isRest: false },  // B5

      // Measure 11: D6 (2.0b) - C#6 (1.0b)
      { f: 1174.66, b: 2.0, isRest: false }, // D6
      { f: 1108.73, b: 1.0, isRest: false }, // C#6

      // Measure 12: C6 (2.0b) - G#5 (1.0b)
      { f: 1046.50, b: 2.0, isRest: false }, // C6
      { f: 830.61,  b: 1.0, isRest: false }, // G#5

      // Measure 13: C6 (1.5b) - B5 (0.5b) - Bb5 (1.0b)
      { f: 1046.50, b: 1.5, isRest: false }, // C6
      { f: 987.77,  b: 0.5, isRest: false }, // B5
      { f: 932.33,  b: 1.0, isRest: false }, // Bb5

      // Measure 14: B5 (1.0b) - G5 (1.0b)
      { f: 987.77,  b: 1.0, isRest: false }, // B5
      { f: 783.99,  b: 1.0, isRest: false }, // G5

      // Measure 15: E5 (3.5b sustained resolution)
      { f: 659.25,  b: 3.5, isRest: false }  // E5
    ];

    const totalPhraseTime = melody.reduce((acc, m) => acc + (m.b * B), 0);
    const loopInterval = totalPhraseTime + 2.5; // 2.5s gentle starry breath before repeat

    // Schedule all notes directly onto the Web Audio hardware clock (0 latency, 0 drift)
    const schedulePhrase = (startTime) => {
      if (!this.isEnabled || !this.ctx) return;
      let noteTime = startTime;
      for (let i = 0; i < melody.length; i++) {
        const item = melody[i];
        const dur = item.b * B;
        if (!item.isRest && item.f > 0) {
          this.scheduleCelestaNote(item.f, noteTime, dur);
        }
        noteTime += dur;
      }
    };

    this.activeNoteOscillators = [];
    const initialTime = this.ctx.currentTime + 0.1;
    schedulePhrase(initialTime);

    // Audio clock recurring lookahead sync loop
    let nextLoopTime = initialTime + loopInterval;
    this.harryPotterInterval = setInterval(() => {
      if (!this.isEnabled || !this.ctx) return;
      if (this.ctx.currentTime >= nextLoopTime - 0.9) {
        schedulePhrase(nextLoopTime);
        nextLoopTime += loopInterval;
      }
    }, 300);
  }

  stopHarryPotterTheme() {
    if (this.harryPotterInterval) {
      clearInterval(this.harryPotterInterval);
      this.harryPotterInterval = null;
    }
    if (this.harryPotterTimer) {
      clearTimeout(this.harryPotterTimer);
      this.harryPotterTimer = null;
    }
    if (this.activeNoteOscillators) {
      this.activeNoteOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      this.activeNoteOscillators = [];
    }
  }

  // Pure Celesta Bell Acoustics (Authentic John Williams Timbre)
  // Steel Bar Strike + Wooden Resonator Cavity + 2x Octave Shimmer + 2.76x Strike Ring
  scheduleCelestaNote(freq, time, noteDuration = 0.9) {
    if (!this.ctx || !this.isEnabled) return;

    try {
      // 1. Warm Fundamental (Sine + soft filtered triangle for wooden resonator warmth)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, time);

      const oscWood = this.ctx.createOscillator();
      oscWood.type = 'triangle';
      oscWood.frequency.setValueAtTime(freq, time);

      const woodFilter = this.ctx.createBiquadFilter();
      woodFilter.type = 'lowpass';
      woodFilter.frequency.setValueAtTime(1400, time);

      // 2. Sweet Octave Harmonic with natural chorus shimmer (+2.5 cents)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.0, time);
      osc2.detune.setValueAtTime(2.5, time);

      // 3. Metallophone Inharmonic Bar Strike Mode (2.756x)
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 2.756, time);

      // 4. Crystalline Hammer Tap Sparkle (4.0x)
      const osc4 = this.ctx.createOscillator();
      osc4.type = 'sine';
      osc4.frequency.setValueAtTime(freq * 4.0, time);

      // Gain staging
      const noteMasterGain = this.ctx.createGain();
      const gWood = this.ctx.createGain();
      const g2 = this.ctx.createGain();
      const g3 = this.ctx.createGain();
      const g4 = this.ctx.createGain();

      // Delicate acoustic balance
      gWood.gain.setValueAtTime(0.06, time);
      gWood.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(noteDuration * 0.9, 0.8));

      g2.gain.setValueAtTime(0.22, time);
      g2.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(noteDuration * 1.8, 1.8));

      g3.gain.setValueAtTime(0.08, time);
      g3.gain.exponentialRampToValueAtTime(0.0001, time + 0.22); // fast strike ring

      g4.gain.setValueAtTime(0.04, time);
      g4.gain.exponentialRampToValueAtTime(0.0001, time + 0.07); // glass tap

      oscWood.connect(woodFilter);
      woodFilter.connect(gWood);
      gWood.connect(noteMasterGain);

      osc2.connect(g2);
      g2.connect(noteMasterGain);

      osc3.connect(g3);
      g3.connect(noteMasterGain);

      osc4.connect(g4);
      g4.connect(noteMasterGain);

      osc1.connect(noteMasterGain);

      // Natural Felt Hammer Strike (3ms attack) & warm singing bell decay
      const peakGain = 0.26;
      const decayDuration = Math.max(noteDuration * 1.8, 2.2);

      noteMasterGain.gain.setValueAtTime(0.0001, time);
      noteMasterGain.gain.linearRampToValueAtTime(peakGain, time + 0.003);
      noteMasterGain.gain.exponentialRampToValueAtTime(0.0001, time + decayDuration);

      // Stereo positioning across soundstage
      const dest = this.celestaBus || this.masterGain;
      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        const pan = Math.sin(freq * 0.015) * 0.28;
        panner.pan.setValueAtTime(pan, time);
        noteMasterGain.connect(panner);
        panner.connect(dest);
      } else {
        noteMasterGain.connect(dest);
      }

      osc1.start(time);
      oscWood.start(time);
      osc2.start(time);
      osc3.start(time);
      osc4.start(time);

      const stopTime = time + decayDuration + 0.05;
      osc1.stop(stopTime);
      oscWood.stop(stopTime);
      osc2.stop(stopTime);
      osc3.stop(stopTime);
      osc4.stop(stopTime);

      if (!this.activeNoteOscillators) this.activeNoteOscillators = [];
      this.activeNoteOscillators.push(osc1, oscWood, osc2, osc3, osc4);
      if (this.activeNoteOscillators.length > 100) {
        this.activeNoteOscillators.splice(0, 40);
      }
    } catch (e) {
      console.warn('Celesta note schedule error', e);
    }
  }

  startWind() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      // Lightweight, pre-computed gentle air noise (0.8s loop, non-blocking)
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.min(sampleRate, 44100);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.015 * white) / 1.015;
        output[i] = lastOut * 1.5;
      }

      this.windNode = this.ctx.createBufferSource();
      this.windNode.buffer = noiseBuffer;
      this.windNode.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.setValueAtTime(280, now);
      this.windFilter.Q.setValueAtTime(2.2, now);

      this.windLfo = this.ctx.createOscillator();
      this.windLfo.frequency.setValueAtTime(0.12, now); // ~8s gentle breeze
      this.windLfoGain = this.ctx.createGain();
      this.windLfoGain.gain.setValueAtTime(100, now);
      this.windLfo.connect(this.windLfoGain);
      this.windLfoGain.connect(this.windFilter.frequency);
      this.windLfo.start(now);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.001, now);
      this.windGain.gain.exponentialRampToValueAtTime(0.05, now + 1.8);

      this.windNode.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      this.windNode.start(now);
    } catch (e) {}
  }

  async stopAtmosphere() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      this.stopHarryPotterTheme();

      // Instantly mute all audio buses
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
      }
      if (this.celestaBus) {
        this.celestaBus.gain.cancelScheduledValues(now);
        this.celestaBus.gain.setValueAtTime(0, now);
      }
      if (this.droneGain) {
        this.droneGain.gain.cancelScheduledValues(now);
        this.droneGain.gain.setValueAtTime(0, now);
      }
      if (this.windGain) {
        this.windGain.gain.cancelScheduledValues(now);
        this.windGain.gain.setValueAtTime(0, now);
      }

      // Stop and clear all drone oscillators immediately
      if (this.droneOscs) {
        this.droneOscs.forEach(o => { try { o.stop(); } catch (e) {} });
        this.droneOscs = [];
      }
      try { this.droneLfo?.stop(); } catch (e) {}
      try { this.windNode?.stop(); } catch (e) {}
      try { this.windLfo?.stop(); } catch (e) {}

      // Suspend audio context hardware driver for 100% immediate silence
      try {
        await this.ctx.suspend();
      } catch (e) {}
    } catch (e) {
      console.warn('stopAtmosphere error', e);
    }
  }

  // Distant Rolling Thunder Strike (Synchronized with lightning flashes)
  playThunder() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;

    try {
      // 1. Initial thunder crack
      const sampleRate = this.ctx.sampleRate;
      const crackLength = Math.floor(sampleRate * 0.12);
      const crackBuf = this.ctx.createBuffer(1, crackLength, sampleRate);
      const crackData = crackBuf.getChannelData(0);
      for (let i = 0; i < crackLength; i++) {
        crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.025));
      }
      const crackSource = this.ctx.createBufferSource();
      crackSource.buffer = crackBuf;
      const crackFilter = this.ctx.createBiquadFilter();
      crackFilter.type = 'lowpass';
      crackFilter.frequency.setValueAtTime(600, now);
      const crackGain = this.ctx.createGain();
      crackGain.gain.setValueAtTime(0.45, now);
      crackSource.connect(crackFilter);
      crackFilter.connect(crackGain);
      crackGain.connect(this.masterGain);
      crackSource.start(now);

      // 2. Rolling deep sub-bass thunder rumble (sweeping down 65Hz -> 28Hz)
      const rumbleOsc = this.ctx.createOscillator();
      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.setValueAtTime(75, now);
      rumbleOsc.frequency.exponentialRampToValueAtTime(32, now + 2.2);

      const rumbleNoiseLen = Math.floor(sampleRate * 2.4);
      const rumbleNoiseBuf = this.ctx.createBuffer(1, rumbleNoiseLen, sampleRate);
      const rData = rumbleNoiseBuf.getChannelData(0);
      for (let i = 0; i < rumbleNoiseLen; i++) {
        rData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.7));
      }
      const rumbleNoise = this.ctx.createBufferSource();
      rumbleNoise.buffer = rumbleNoiseBuf;

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(140, now);
      rumbleFilter.frequency.linearRampToValueAtTime(45, now + 2.4);

      const rumbleGain = this.ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.5, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      rumbleOsc.connect(rumbleFilter);
      rumbleNoise.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.masterGain);

      rumbleOsc.start(now);
      rumbleNoise.start(now);
      rumbleOsc.stop(now + 2.6);
      rumbleNoise.stop(now + 2.6);
    } catch (e) {
      console.warn('Thunder audio error', e);
    }
  }

  // Spooky Corner Spider Chittering Scurry Sound
  playSpiderScare() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    try {
      // Fast, high-pitch skittering chirps
      for (let i = 0; i < 6; i++) {
        const t = now + i * 0.055;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400 + Math.random() * 600, t);
        osc.frequency.exponentialRampToValueAtTime(420, t + 0.05);

        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(g);
        g.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.055);
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
      oscLow.frequency.setValueAtTime(48, now);
      oscLow.frequency.exponentialRampToValueAtTime(26, now + 1.4);

      gainLow.gain.setValueAtTime(0.25, now);
      gainLow.gain.linearRampToValueAtTime(0.001, now + 1.4);

      const fLow = this.ctx.createBiquadFilter();
      fLow.type = 'lowpass';
      fLow.frequency.setValueAtTime(160, now);

      oscLow.connect(fLow);
      fLow.connect(gainLow);
      gainLow.connect(this.masterGain);

      oscLow.start(now);
      oscLow.stop(now + 1.4);

      // 2. High metallic creak friction
      const oscCreak = this.ctx.createOscillator();
      const gainCreak = this.ctx.createGain();
      oscCreak.type = 'triangle';
      oscCreak.frequency.setValueAtTime(340, now + 0.1);
      oscCreak.frequency.linearRampToValueAtTime(540, now + 0.6);
      oscCreak.frequency.linearRampToValueAtTime(240, now + 1.2);

      gainCreak.gain.setValueAtTime(0.001, now);
      gainCreak.gain.exponentialRampToValueAtTime(0.18, now + 0.35);
      gainCreak.gain.linearRampToValueAtTime(0.001, now + 1.2);

      oscCreak.connect(gainCreak);
      gainCreak.connect(this.masterGain);

      oscCreak.start(now + 0.1);
      oscCreak.stop(now + 1.2);
    } catch (e) {}
  }

  // Crisp Cyber UI Feedback Click / Tick
  playTick() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  playClick() {
    this.playTick();
  }

  // Camera Dolly Passing Doorway Whoosh
  playWhoosh() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.38);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) {}
  }

  // Portal / Chamber Door Approach & Focus Chime
  playChamberHover() {
    if (!this.ctx || !this.isEnabled) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
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
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.55);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.6);

      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(380, now);
      f.frequency.linearRampToValueAtTime(90, now + 0.6);

      osc.connect(f);
      f.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.6);
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
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.25);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  // Dynamic Scroll Atmospheric Shaping
  onScrollProgress(p) {
    if (!this.ctx || !this.isEnabled || !this.droneFilter) return;
    try {
      // Deeper resonant drone inside mansion rotunda
      const cutoff = 220 + p * 350;
      this.droneFilter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.1);

      if (this.windGain) {
        // Wind howls loud outside, becomes subterranean inside
        const windLevel = Math.max(0.05, 0.22 * (1 - Math.min(1, p * 1.5)));
        this.windGain.gain.setTargetAtTime(windLevel, this.ctx.currentTime, 0.1);
      }
    } catch (e) {}
  }
}

export const audioManager = new AudioManager();
