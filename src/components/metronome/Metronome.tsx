export interface OnMetronomeTickProps {
  note: number;
  beatNumber: number;
  beatsPerBar: number;
  time: number;
  isAccented: boolean;
}

export interface MetronomeOptions {
  audioCtx: AudioContext;
  beatsPerBar?: number;
  accentBeats?: number[]; // array of beat steps to treat as "Accented" beats
  defaultFrequency?: number; // frequency value for unaccented, non-downbeats sound, defaults to 500
  downbeatFrequency?: number; // frequeency value of the downbeat, defaults to 1000
  accentBeatFrequency?: number; // frequency value of accented beats, defaults to the same value of 1500
  onTick?: (data: OnMetronomeTickProps) => unknown;
}

/**
 * Heavily inspired from reading:
 * https://grantjam.es/creating-a-simple-metronome-using-javascript-and-the-web-audio-api/
 * https://github.com/grantjames/metronome/blob/master/metronome.js
 * https://github.com/cwilso/metronome
 */
export class Metronome {
  audioCtx: AudioContext;
  tempo: number;
  noteQueue: { note: number; time: number }[];
  beatsPerBar: number;
  currentBeatInBar: number;
  isRunning: boolean;
  accentBeats: number[];
  accentBeatFrequency: number;
  downbeatFrequency: number;
  defaultFrequency: number;

  onTick?: (data: OnMetronomeTickProps) => unknown;

  private intervalId: string | number | NodeJS.Timeout | undefined;
  private nextNoteTime: number;
  private lookahead: number;
  private scheduleAheadTime: number;

  constructor(tempo = 120, options: MetronomeOptions) {
    this.audioCtx = options?.audioCtx;
    this.tempo = tempo;
    this.onTick = options?.onTick;
    this.beatsPerBar = options?.beatsPerBar || 4;
    this.defaultFrequency = options?.defaultFrequency || 500;
    this.downbeatFrequency = options?.downbeatFrequency || 1000;
    this.accentBeatFrequency = options?.accentBeatFrequency || 1400;
    this.accentBeats = options?.accentBeats || []; // beats that should be accented

    this.noteQueue = [];
    this.nextNoteTime = 0.0;
    this.currentBeatInBar = 0;
    this.isRunning = false;
    this.lookahead = 25; // milliseconds scheduling frequency (like timer resolution)
    this.scheduleAheadTime = 0.1; // seconds
  }

  private nextNote() {
    // Advance current note and time by a quarter note (crotchet if you're posh)
    var secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    this.currentBeatInBar++; // Advance the beat number, wrap to zero
    if (this.currentBeatInBar == this.beatsPerBar) {
      this.currentBeatInBar = 0;
    }
  }

  private scheduleNote(beatNumber: number, time: number) {
    const note = {
      note: beatNumber,
      beatNumber: beatNumber,
      beatsPerBar: this.beatsPerBar,
      time: time,
      isAccented: this.accentBeats.indexOf(beatNumber) !== -1,
    };
    // push the note on the queue, even if we're not playing.
    this.noteQueue.push(note);

    if (this.onTick) this.onTick(note);

    console.log("pushed note", { metronome: this, note });

    // create an oscillator
    const osc = this.audioCtx.createOscillator();
    if (note.isAccented) {
      debugger
      osc.frequency.value = this.accentBeatFrequency;
    } else {
      osc.frequency.value = beatNumber % this.beatsPerBar === 0 ? this.downbeatFrequency : this.defaultFrequency;
    }
    // create an envelope
    const envelope = this.audioCtx.createGain();
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
    // connect osc, envelope, and audioCtx
    osc.connect(envelope);
    envelope.connect(this.audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.03);
  }

  private scheduler() {
    while (
      this.nextNoteTime <
      this.audioCtx.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
      this.nextNote();
    }
  }

  start() {
    this.isRunning = true;
    this.currentBeatInBar = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.intervalId = setInterval(() => this.scheduler(), this.lookahead);
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.intervalId);
  }
}
