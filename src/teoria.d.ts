declare module "teoria" {
  /** Declaration file generated by dts-gen */

  export type SolfegeString = 'daw' | 'de' | 'do' | 'di' | 'dai' | 'raw' | 'ra' | 're' | 'ri' | 'rai' | 'maw' | 'me' | 'mi' | 'mai' | 'faw' | 'fe' | 'fa' | 'fi' | 'fai' | 'saw' | 'se' | 'so' | 'si' | 'sai' | 'law' | 'le' | 'la' | 'li' | 'lai' | 'taw' | 'te' | 'ti' | 'tai' | 'daw' | 'de' | 'do' | 'di' | 'dai';

  export interface Duration {
    value: number;
    dots: number;
  }

  export class Chord {
    constructor(root: any, name: any);

    bass(): any;

    chordType(): any;

    dominant(additional: any): any;

    get(interval: any): any;

    interval(interval: any): any;

    notes(): any;

    parallel(additional: any): any;

    quality(): any;

    resetVoicing(): void;

    simple(): any;

    subdominant(additional: any): any;

    toString(): any;

    transpose(interval: any): any;

    voicing(voicing: any): any;
  }

  export class Interval {
    constructor(coord: any);

    add(interval: any): any;

    base(): any;

    direction(dir: any): any;

    equal(interval: any): any;

    greater(interval: any): any;

    invert(): Interval;

    isCompound(): any;

    name(): string;

    number(): number;

    octaves(): any;

    quality(lng: any): any;

    qualityValue(): any;

    semitones(): any;

    simple(ignore: any): any;

    smaller(interval: any): any;

    toString(ignore: any): any;

    type(): any;

    value(): any;

    static between(from: any, to: any): any;

    static from(from: any, to: any): any;

    static invert(sInterval: any): any;

    static toCoord(simple: any): any;
  }

  export class Note {
    constructor(coord: any, duration: Duration);

    accidental(): "x" | '#' | '' | 'b' | 'bb' | undefined;

    // x = 2, # = 1, b = -1, bb = -2
    accidentalValue(): 2 | 1 | 0 | -1 | -2;

    chord(chord: any): Chord;

    chroma(): number;

    durationInSeconds(bpm: number, beatUnit: any): number;

    durationName(): string;

    enharmonics(oneaccidental: boolean): Note[];

    fq(concertPitch?: number): number;

    helmholtz(): string;

    interval(interval: Interval | Note | string): Interval;

    key(white: boolean): number;

    midi(): number;

    name(): string;

    octave(): number;

    scale(scale: any): any;

    scaleDegree(scale: Scale): number;

    scientific(): string;

    solfege(scale: Scale, showOctaves: boolean): SolfegeString | string;

    toString(dont: boolean): string;

    transpose(interval: Interval | Note | string): Note;

    static fromFrequency(
      fq: number,
      concertPitch?: number
    ): { note: Note; cents: number };

    static fromKey(key: number): Note;

    static fromMIDI(note: any): Note;

    static fromString(name: any, dur: any): Note;
  }

  export class Scale {
    constructor(tonic: string | Note, scale: Scale | string | number[]);

    name?: string;
    
    tonic: Note

    get(i: string | number): Interval;

    // TODO: does this exist?
    interval(interval: Interval | Note | string): Interval;

    notes(): Note[];

    simple(): string[];

    solfege(index: number | string, showOctaves: boolean): SolfegeString | string; // returns solfege step

    transpose(interval: Interval | number): any;

    type(): 'ditonic' | 'tritonic' | 'tetratonic' | 'pentatonic' | 'hexatonic' | 'heptatonic' | 'octatonic';

    static KNOWN_SCALES: [
        "aeolian", "minor",
        "blues",
        "chromatic", "harmonicchromatic",
        "dorian",
        "doubleharmonic", "flamenco",
        "harmonicminor",
        "ionian", "major",
        "locrian",
        "lydian",
        "majorpentatonic",
        "melodicminor",
        "minorpentatonic",
        "mixolydian",
        "phrygian",
        "wholetone",
    ];
  }

  export function chord(name: any, symbol: any): Chord;

  export function interval(from: any, to: any): Interval;

  export function note(name: any, duration: Duration): Note;

  export function scale(tonic: string | Note, scale: Scale |string | number[]): Scale;

  export namespace interval {
    function between(from: any, to: any): Interval;

    function from(from: any, to: any): Interval;

    function invert(sInterval: any): Interval;

    function toCoord(simple: any): any;
  }

  export namespace note {
    function fromFrequency(
      fq: number,
      concertPitch: number
    ): { note: Note; cents: number };

    function fromKey(key: number): Note;

    function fromMIDI(note: any): Note;

    function fromString(name: string, dur?: Duration): Note;
  }
}