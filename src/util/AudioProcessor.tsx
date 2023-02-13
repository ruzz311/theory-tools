/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { noteToFrequency } from "music-fns";
import * as teoria from "teoria";
import { Note } from "teoria";

export interface INote {
  noteName: string;
  freq: number;
  offset: number;
  difference: number;
}

export interface IGuitarStrings {
  // e2: INote;
  // a2: INote;
  // d3: INote;
  // g3: INote;
  // b3: INote;
  // e4: INote;
  [key: string]: INote;
}

export const TUNING_PITCH = 440;

export const tunings: Record<string, string[]> = {
  standard: ["e2", "a2", "d3", "g3", "b3", "e4"],
  drop_d: ["d2", "a2", "d3", "g3", "b3", "e4"],
  seven_string_standard: ["f#2", "b2", "e2", "a2", "d3", "g3", "b3", "e4"],
};

/**
 * Create a note object useable with the tuner.  Uses global standard tuning pitch.
 *
 * @param sampleRate
 * @param noteName a valid note name such as 'e3' or 'Bb5'
 * @returns
 */
const createNote: (
  sampleRate: number,
  noteName: string,
  tuningPitch?: number
) => INote = (sampleRate, noteName, tuningPitch = TUNING_PITCH) => {
  const freq = noteToFrequency(noteName, { standard: tuningPitch });
  return {
    noteName,
    freq,
    offset: Math.round(sampleRate / freq),
    difference: 0,
  };
};

/**
 * Creates an object containing notes for a specific 6 string guitar tuning.
 * If a tuning name isn't provided or reccognized, standard tuning is used.
 *
 * @param sampleRate
 * @param tuningName defaults to 'standard' but acccepts ('standard', 'drop_d');
 * @returns
 */
export const createGuitarStrings: (
  sampleRate: number,
  tuningName?: string
) => IGuitarStrings = (sampleRate, tuningName = "standard") => {
  let chosen = tunings[tuningName] ? tunings[tuningName] : tunings["standard"];

  const strings = chosen.reduce(
    (prev, noteName, i) => ({
      ...prev,
      [noteName]: createNote(sampleRate, noteName),
    }),
    {} as IGuitarStrings
  );

  return strings;
};

/**
 * Takes the audio from getUserMedia and processes it to figure out how well
 * it maps to the strings of a guitar.
 *
 * Big thanks to Chris Wilson (@cwilso) for code and assistance.
 */

export interface IAudioDataParams {
  frequency: number;
  octave: number;
  note: Note;
  cents: number;
  noteName: string;
}

type IOnAudioDataHook = (data: IAudioDataParams) => void;

export default class AudioProcessor {
  FFTSIZE: number;
  stream: MediaStream | null;
  audioContext: AudioContext;
  analyser: AnalyserNode;
  gainNode: GainNode;
  microphone: MediaStreamAudioSourceNode | null;
  frequencyBufferLength: number;
  frequencyBuffer: Float32Array;
  strings: IGuitarStrings;
  stringsKeys: string[];
  lastRms: number;
  rmsThreshold: number;
  assessedStringsInLastFrame: boolean;
  assessStringsUntilTime: number;
  sendingAudioData: boolean;
  onAudioData?: IOnAudioDataHook;

  constructor(options: {
    onAudioData?: IOnAudioDataHook;
    audioContext?: AudioContext;
  }) {
    // Defer normal constructor behavior to created because we're only
    // allowed to take the prototype with us from the class.
    // Polymer(AudioProcessor.prototype);
    // this.created();

    // NOTE!!!! The caller needs to provide a function to process the output.
    // TODO: Make this a better interface than this, maybe ability to attach listeners?

    this.FFTSIZE = 2048;
    this.stream = null;
    this.audioContext = options?.audioContext || new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    this.microphone = null;

    this.gainNode.gain.value = 0;
    this.analyser.fftSize = this.FFTSIZE;
    this.analyser.smoothingTimeConstant = 0;

    this.frequencyBufferLength = this.FFTSIZE;
    this.frequencyBuffer = new Float32Array(this.frequencyBufferLength);

    this.strings = createGuitarStrings(this.audioContext.sampleRate);
    this.stringsKeys = Object.keys(this.strings);

    this.lastRms = 0;
    this.rmsThreshold = 0.006;
    this.assessedStringsInLastFrame = false;
    this.assessStringsUntilTime = 0;
    this.sendingAudioData = false;

    this.onAudioData = options.onAudioData;

    // Bind as we would have done for anything in the constructor so we can use
    // them without confusing what 'this' means. Yay window scoped.
    this.dispatchAudioData = this.dispatchAudioData.bind(this);
    this.sortStringKeysByDifference =
      this.sortStringKeysByDifference.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  async requestUserMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.sendingAudioData = true;
      this.stream = stream;
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      requestAnimationFrame(this.dispatchAudioData);
    } catch (err) {
      alert("Unable to access the microphone");
      console.error(err);
    }
  }

  /**
   * attached is executed when the dom for this class is ready.
   */
  attached() {
    // Set up the stream kill / setup code for visibility changes.
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    // Then call it.
    this.onVisibilityChange();
  }

  /**
   * detached is exectued before removing the dom for this class.
   */
  detached() {
    this.sendingAudioData = false;

    if (this.stream) {
      console.log(`detaching from stream...`);
      // Chrome 47+
      this.stream.getAudioTracks().forEach(track => {
        if ("stop" in track) {
          track.stop();
        }
      });

      // Chrome 46-
      if ("stop" in this.stream) {
        (this.stream as MediaStream & { stop: () => void }).stop();
      }
    }

    this.stream = null;
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    console.log(`detached from stream!`);
  }

  /**
   * onVisibilityChange runs when the view is hidden/blurred to prevent stream
   * processing while not in use.
   */
  onVisibilityChange() {
    if (document.hidden) {
      this.sendingAudioData = false;

      if (this.stream) {
        // Chrome 47+
        this.stream.getAudioTracks().forEach(track => {
          if ("stop" in track) {
            track.stop();
          }
        });

        // Chrome 46-
        if ("stop" in this.stream) {
          (this.stream as MediaStream & { stop: () => void }).stop();
        }
      }

      this.stream = null;
    } else {
      this.requestUserMedia();
    }
  }

  /**
   * Compare this.strings by the this.strings.difference value.
   *
   * @param a a string value matching one of keyof IGuitarStrings
   * @param b a string value matching one of keyof IGuitarStrings
   * @returns
   */
  sortStringKeysByDifference(a: string, b: string) {
    return this.strings[a]?.difference - this.strings[b]?.difference;
  }

  /**
   * Autocorrelate the audio data, which is basically where you
   * compare the audio buffer to itself, offsetting by one each
   * time, up to the half way point. You sum the differences and
   * you see how small the difference comes out.
   */
  // @ts-ignore
  autocorrelateAudioData(time) {
    let searchSize = this.frequencyBufferLength * 0.5;
    let offsetKey: keyof IGuitarStrings | null = null;
    let offset = 0;
    let difference = 0;
    const tolerance = 0.001;
    let rms = 0;
    const rmsMin = 0.008;
    let assessedStringsInLastFrame = this.assessedStringsInLastFrame;
    const ASSESSMENT_RATE = 250;

    // Fill up the data.
    this.analyser.getFloatTimeDomainData(this.frequencyBuffer);

    // Figure out the root-mean-square, or rms, of the audio. Basically
    // this seems to be the amount of signal in the buffer.
    for (let d = 0; d < this.frequencyBuffer.length; d++) {
      rms += this.frequencyBuffer[d] * this.frequencyBuffer[d];
    }

    rms = Math.sqrt(rms / this.frequencyBuffer.length);

    // If there's little signal in the buffer quit out.
    if (rms < rmsMin) return 0;

    // Only check for a new string if the volume goes up. Otherwise assume
    // that the string is the same as the last frame.
    if (rms > this.lastRms + this.rmsThreshold)
      this.assessStringsUntilTime = time + ASSESSMENT_RATE;

    if (time < this.assessStringsUntilTime) {
      this.assessedStringsInLastFrame = true;

      // Go through each string and figure out which is the most
      // likely candidate for the string being tuned based on the
      // difference to the "perfect" tuning.
      for (let o = 0; o < this.stringsKeys.length; o++) {
        offsetKey = this.stringsKeys[o] as keyof IGuitarStrings;
        offset = this.strings[offsetKey].offset;
        difference = 0;

        // Reset how often this string came out as the closest.
        if (assessedStringsInLastFrame === false)
          this.strings[offsetKey].difference = 0;

        // Now we know where the peak is, we can start
        // assessing this sample based on that. We will
        // step through for this string comparing it to a
        // "perfect wave" for this string.
        for (let i = 0; i < searchSize; i++) {
          difference += Math.abs(
            this.frequencyBuffer[i] - this.frequencyBuffer[i + offset]
          );
        }

        difference /= searchSize;

        // Weight the difference by frequency. So lower strings get
        // less preferential treatment (higher offset values). This
        // is because harmonics can mess things up nicely, so we
        // course correct a little bit here.
        this.strings[offsetKey].difference += difference * offset;
      }
    } else {
      this.assessedStringsInLastFrame = false;
    }

    // If this is the first frame where we've not had to reassess strings
    // then we will order by the string with the largest number of matches.
    if (
      assessedStringsInLastFrame === true &&
      this.assessedStringsInLastFrame === false
    ) {
      this.stringsKeys.sort(this.sortStringKeysByDifference);
    }

    // Next for the top candidate in the set, figure out what
    // the actual offset is from the intended target.
    // We'll do it by making a full sweep from offset - 10 -> offset + 10
    // and seeing exactly how long it takes for this wave to repeat itself.
    // And that will be our *actual* frequency.
    const searchRange = 10;
    const assumedString =
      this.strings[this.stringsKeys[0] as keyof IGuitarStrings];
    const searchStart = assumedString.offset - searchRange;
    const searchEnd = assumedString.offset + searchRange;
    let actualFrequency = assumedString.offset;
    let smallestDifference = Number.POSITIVE_INFINITY;

    for (let s = searchStart; s < searchEnd; s++) {
      difference = 0;

      // For each iteration calculate the difference of every element of the
      // array. The data in the buffer should be PCM, so values ranging
      // from -1 to 1. If they match perfectly then they'd essentially
      // cancel out. But this is real data so we'll be looking for small
      // amounts. If it's below tolerance assume a perfect match, otherwise
      // go with the smallest.
      //
      // A better version of this would be to curve match on the data.
      for (let i = 0; i < searchSize; i++) {
        difference += Math.abs(
          this.frequencyBuffer[i] - this.frequencyBuffer[i + s]
        );
      }

      difference /= searchSize;

      if (difference < smallestDifference) {
        smallestDifference = difference;
        actualFrequency = s;
      }

      if (difference < tolerance) {
        actualFrequency = s;
        break;
      }
    }

    this.lastRms = rms;

    return this.audioContext.sampleRate / actualFrequency;
  }

  // @ts-ignore
  dispatchAudioData(time) {
    // Always set up the next pass here, because we could
    // early return from this pass if there's not a lot
    // of exciting data to deal with.
    if (this.sendingAudioData) requestAnimationFrame(this.dispatchAudioData);

    const frequency = this.autocorrelateAudioData(time);

    if (frequency === 0) return;

    const { cents, note } = teoria.note.fromFrequency(frequency, TUNING_PITCH);

    const dataOutput: IAudioDataParams = {
      frequency: note.fq(),
      octave: note.octave(),
      note,
      cents,
      noteName: note.name(),
    };

    // Now tell anyone who's interested.
    if (this.onAudioData) this.onAudioData(dataOutput);
  }
}
