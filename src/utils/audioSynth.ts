// Mélodia AI — Musical Audio Synthesizer
// Produces genre-appropriate music with chords, arpeggios, bass, drums and reverb

type ProgressCallback = (percent: number) => void;
type EndCallback = () => void;

// Musical note frequencies (Hz)
const NOTES: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

interface GenreProfile {
  bpm: number;
  chordProgression: number[][];   // Arrays of frequencies for each chord
  bassNotes: number[];
  melodyNotes: number[];
  padType: OscillatorType;
  bassType: OscillatorType;
  melodyType: OscillatorType;
  swing: number;                  // 0-1, how much swing
  kickPattern: number[];          // steps where kick hits (0-15)
  snarePattern: number[];         // steps where snare hits
  hatPattern: number[];           // steps where hi-hat hits
  filterFreq: number;             // lowpass filter cutoff
}

const GENRE_PROFILES: Record<string, GenreProfile> = {
  Afrobeat: {
    bpm: 110,
    chordProgression: [
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.G3, NOTES.B3, NOTES.D4]
    ],
    bassNotes: [NOTES.C3, NOTES.A3, NOTES.F3, NOTES.G3],
    melodyNotes: [NOTES.C5, NOTES.D5, NOTES.E5, NOTES.G4, NOTES.A4, NOTES.C5, NOTES.E5, NOTES.D5],
    padType: 'triangle',
    bassType: 'sawtooth',
    melodyType: 'sine',
    swing: 0.15,
    kickPattern: [0, 4, 8, 12],
    snarePattern: [4, 12],
    hatPattern: [0, 2, 4, 6, 8, 10, 12, 14],
    filterFreq: 2200
  },
  Amapiano: {
    bpm: 113,
    chordProgression: [
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.E4, NOTES.G4, NOTES.B4]
    ],
    bassNotes: [NOTES.A3, NOTES.F3, NOTES.D3, NOTES.E3],
    melodyNotes: [NOTES.A4, NOTES.C5, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.A4, NOTES.G4, NOTES.A4],
    padType: 'sine',
    bassType: 'sine',         // Amapiano log-drum bass
    melodyType: 'sine',
    swing: 0.2,
    kickPattern: [0, 6, 10],
    snarePattern: [4, 12],
    hatPattern: [0, 2, 4, 6, 8, 10, 12, 14],
    filterFreq: 1800
  },
  Zouk: {
    bpm: 92,
    chordProgression: [
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.A3, NOTES.C4, NOTES.E4]
    ],
    bassNotes: [NOTES.D3, NOTES.G3, NOTES.C3, NOTES.A3],
    melodyNotes: [NOTES.D5, NOTES.F5, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.F4],
    padType: 'sine',
    bassType: 'triangle',
    melodyType: 'sine',
    swing: 0.1,
    kickPattern: [0, 6, 8, 14],
    snarePattern: [4, 12],
    hatPattern: [0, 2, 3, 4, 6, 8, 10, 12, 14],
    filterFreq: 2500
  },
  Highlife: {
    bpm: 120,
    chordProgression: [
      [NOTES.E4, NOTES.G4, NOTES.B4],
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.G3, NOTES.B3, NOTES.D4]
    ],
    bassNotes: [NOTES.E3, NOTES.A3, NOTES.D3, NOTES.G3],
    melodyNotes: [NOTES.E5, NOTES.G5, NOTES.A5, NOTES.G5, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.E5],
    padType: 'triangle',
    bassType: 'triangle',
    melodyType: 'sine',
    swing: 0.12,
    kickPattern: [0, 4, 8, 12],
    snarePattern: [4, 12],
    hatPattern: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    filterFreq: 3000
  },
  Gospel: {
    bpm: 85,
    chordProgression: [
      [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4],
      [NOTES.F3, NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.F4],
      [NOTES.C4, NOTES.E4, NOTES.G4]
    ],
    bassNotes: [NOTES.C3, NOTES.F3, NOTES.G3, NOTES.C3],
    melodyNotes: [NOTES.E5, NOTES.G5, NOTES.C5, NOTES.D5, NOTES.E5, NOTES.C5, NOTES.A4, NOTES.G4],
    padType: 'sine',
    bassType: 'triangle',
    melodyType: 'sine',
    swing: 0.08,
    kickPattern: [0, 8],
    snarePattern: [4, 12],
    hatPattern: [0, 2, 4, 6, 8, 10, 12, 14],
    filterFreq: 2000
  },
  RnB: {
    bpm: 82,
    chordProgression: [
      [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4],
      [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.F3, NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.F4]
    ],
    bassNotes: [NOTES.C3, NOTES.A3, NOTES.F3, NOTES.G3],
    melodyNotes: [NOTES.G4, NOTES.A4, NOTES.C5, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.A4, NOTES.G4],
    padType: 'sine',
    bassType: 'sine',
    melodyType: 'sine',
    swing: 0.18,
    kickPattern: [0, 6, 8, 14],
    snarePattern: [4, 12],
    hatPattern: [0, 2, 4, 6, 8, 10, 12, 14],
    filterFreq: 1600
  },
  Acoustique: {
    bpm: 78,
    chordProgression: [
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.E3, NOTES.G3, NOTES.B3],
      [NOTES.C3, NOTES.E3, NOTES.G3],
      [NOTES.D3, NOTES.F3, NOTES.A3]
    ],
    bassNotes: [NOTES.G3, NOTES.E3, NOTES.C3, NOTES.D3],
    melodyNotes: [NOTES.D5, NOTES.B4, NOTES.G4, NOTES.A4, NOTES.B4, NOTES.D5, NOTES.E5, NOTES.D5],
    padType: 'triangle',
    bassType: 'sine',
    melodyType: 'sine',
    swing: 0.05,
    kickPattern: [0, 8],
    snarePattern: [4, 12],
    hatPattern: [2, 6, 10, 14],
    filterFreq: 1400
  }
};

class MelodiaSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private scheduledNodes: AudioScheduledSourceNode[] = [];
  private progressInterval: number | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public stop() {
    this.isPlaying = false;

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.scheduledNodes.forEach(n => { try { n.stop(); } catch (e) { /* */ } });
    this.scheduledNodes = [];
    if (this.ctx) {
      try { this.ctx.close(); } catch (e) { /* */ }
      this.ctx = null;
    }
  }

  // Formant Vocal Singing Synthesizer (Web Audio Vocal Engine)
  private scheduleVocalSingingNote(ctx: AudioContext, dest: AudioNode, time: number, duration: number, freq: number, volume: number = 0.22) {
    try {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator(); // Vibrato LFO
      const lfoGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      // Vocal Vibrato effect (5.5Hz pitch vibrato)
      lfo.frequency.setValueAtTime(5.5, time);
      lfoGain.gain.setValueAtTime(freq * 0.025, time);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Formant Biquad Filters for Vowel "Ah / Oh" Singing Sound
      const f1 = ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(750, time); // Formant 1
      f1.Q.setValueAtTime(4, time);

      const f2 = ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(1250, time); // Formant 2
      f2.Q.setValueAtTime(4, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.1); // Singing attack
      gain.gain.setValueAtTime(volume * 0.85, time + Math.max(0.1, duration - 0.15));
      gain.gain.linearRampToValueAtTime(0, time + duration); // Singing release

      osc.connect(f1);
      osc.connect(f2);
      f1.connect(gain);
      f2.connect(gain);
      gain.connect(dest);

      lfo.start(time);
      osc.start(time);
      osc.stop(time + duration);
      lfo.stop(time + duration);
      this.scheduledNodes.push(osc, lfo);
    } catch (e) {
      // ignore node creation error
    }
  }



  // Create a simple convolver reverb impulse response
  private createReverb(ctx: AudioContext, duration: number = 1.5, decay: number = 2): ConvolverNode {
    const length = ctx.sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  // Create a noise burst for snare / hi-hat
  private scheduleNoise(ctx: AudioContext, dest: AudioNode, time: number, duration: number, volume: number, highpass: number) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(highpass, time);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    source.start(time);
    source.stop(time + duration);
    this.scheduledNodes.push(source);
  }

  public playTrack(
    genre: string,
    durationSeconds: number = 15,
    arg3?: string | ProgressCallback,
    arg4?: string | EndCallback,
    arg5?: string | ProgressCallback,
    arg6?: ProgressCallback,
    arg7?: EndCallback
  ) {
    let lyrics: string | undefined = undefined;
    let language: string | undefined = undefined;
    let voiceGender: string | undefined = undefined;
    let onProgress: ProgressCallback | undefined = undefined;
    let onEnd: EndCallback | undefined = undefined;

    if (typeof arg3 === 'function') {
      onProgress = arg3;
      if (typeof arg4 === 'function') onEnd = arg4;
    } else {
      lyrics = arg3;
      if (typeof arg4 === 'string') language = arg4;
      if (typeof arg5 === 'string') voiceGender = arg5;
      if (typeof arg5 === 'function') onProgress = arg5;
      if (typeof arg6 === 'function') onProgress = arg6;
      if (typeof arg7 === 'function') onEnd = arg7;
    }

    this.stop();
    const ctx = this.getContext();
    this.isPlaying = true;


    // Find profile or fallback
    const profileKey = Object.keys(GENRE_PROFILES).find(k =>
      genre.toLowerCase().includes(k.toLowerCase())
    ) || 'Afrobeat';
    const profile = GENRE_PROFILES[profileKey];

    const startTime = ctx.currentTime + 0.05;
    const beatDuration = 60 / profile.bpm;
    const sixteenthDuration = beatDuration / 4;
    const totalSixteenths = Math.floor(durationSeconds / sixteenthDuration);

    // === Audio Graph ===
    // Master output
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.55, startTime);
    // Fade in
    masterGain.gain.linearRampToValueAtTime(0.55, startTime + 1);

    // Reverb send
    const reverb = this.createReverb(ctx, 1.8, 2.5);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.18, startTime);

    // Dry + Wet mix
    const dryGain = ctx.createGain();
    dryGain.gain.setValueAtTime(0.82, startTime);

    dryGain.connect(masterGain);
    reverbGain.connect(reverb);
    reverb.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Master lowpass filter for warmth
    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(profile.filterFreq, startTime);
    masterFilter.Q.setValueAtTime(0.7, startTime);

    // === Schedule All Notes ===
    for (let i = 0; i < totalSixteenths; i++) {
      const swingOffset = (i % 2 === 1) ? sixteenthDuration * profile.swing : 0;
      const time = startTime + i * sixteenthDuration + swingOffset;
      const step16 = i % 16;
      const chordIdx = Math.floor((i / 16)) % profile.chordProgression.length;

      // --- PAD / CHORDS (sustaining notes, change every bar = 16 sixteenths) ---
      if (step16 === 0) {
        const chord = profile.chordProgression[chordIdx];
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          osc.type = profile.padType;
          osc.frequency.setValueAtTime(freq, time);
          // Slight detune for warmth
          osc.detune.setValueAtTime((Math.random() - 0.5) * 8, time);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.08, time + 0.15);
          gain.gain.setValueAtTime(0.08, time + beatDuration * 3.5);
          gain.gain.linearRampToValueAtTime(0, time + beatDuration * 4);
          osc.connect(gain);
          gain.connect(masterFilter);
          masterFilter.connect(dryGain);
          masterFilter.connect(reverbGain);
          osc.start(time);
          osc.stop(time + beatDuration * 4);
          this.scheduledNodes.push(osc);
        });
      }

      // --- BASS ---
      if (step16 === 0 || step16 === 6 || step16 === 10) {
        const bassFreq = profile.bassNotes[chordIdx];
        const osc = ctx.createOscillator();
        osc.type = profile.bassType;
        osc.frequency.setValueAtTime(bassFreq, time);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.28, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + sixteenthDuration * 3);
        // Sub-bass layer
        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(bassFreq / 2, time);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.15, time);
        subGain.gain.exponentialRampToValueAtTime(0.001, time + sixteenthDuration * 3);
        osc.connect(gain);
        gain.connect(dryGain);
        subOsc.connect(subGain);
        subGain.connect(dryGain);
        osc.start(time);
        osc.stop(time + sixteenthDuration * 3);
        subOsc.start(time);
        subOsc.stop(time + sixteenthDuration * 3);
        this.scheduledNodes.push(osc, subOsc);
      }

      // --- MELODY & VOCAL SINGING HARMONIES ---
      if (step16 % 3 === 1 || step16 % 5 === 2) {
        const melIdx = (i + chordIdx * 3) % profile.melodyNotes.length;
        const freq = profile.melodyNotes[melIdx];

        // Trigger Vocal Formant Singing Note
        this.scheduleVocalSingingNote(ctx, reverbGain, time, sixteenthDuration * 3, freq, 0.20);

        const osc = ctx.createOscillator();
        osc.type = profile.melodyType;
        osc.frequency.setValueAtTime(freq, time);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.14, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, time + sixteenthDuration * 2);
        osc.connect(gain);
        gain.connect(dryGain);
        gain.connect(reverbGain);
        osc.start(time);
        osc.stop(time + sixteenthDuration * 2);
        this.scheduledNodes.push(osc);
      }

      // --- KICK DRUM ---
      if (profile.kickPattern.includes(step16)) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.55, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
        osc.connect(gain);
        gain.connect(dryGain);
        osc.start(time);
        osc.stop(time + 0.18);
        this.scheduledNodes.push(osc);
      }

      // --- SNARE ---
      if (profile.snarePattern.includes(step16)) {
        // Tonal body
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(120, time + 0.05);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(gain);
        gain.connect(dryGain);
        osc.start(time);
        osc.stop(time + 0.1);
        this.scheduledNodes.push(osc);
        // Noise burst
        this.scheduleNoise(ctx, dryGain, time, 0.12, 0.2, 3000);
      }

      // --- HI-HAT ---
      if (profile.hatPattern.includes(step16)) {
        const vol = (step16 % 4 === 0) ? 0.12 : 0.06;
        this.scheduleNoise(ctx, dryGain, time, 0.04, vol, 7000);
      }
    }

    // Fade out at end
    const fadeOutTime = startTime + durationSeconds - 1.5;
    masterGain.gain.setValueAtTime(0.55, fadeOutTime);
    masterGain.gain.linearRampToValueAtTime(0, startTime + durationSeconds);

    // Progress tracking
    const startMs = Date.now();
    this.progressInterval = window.setInterval(() => {
      if (!this.isPlaying) {
        if (this.progressInterval) clearInterval(this.progressInterval);
        return;
      }
      const elapsed = (Date.now() - startMs) / 1000;
      const pct = Math.min(100, (elapsed / durationSeconds) * 100);
      if (onProgress) onProgress(pct);
      if (elapsed >= durationSeconds) {
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.stop();
        if (onEnd) onEnd();
      }
    }, 80);
  }
}

export const audioSynth = new MelodiaSynth();
