import React, { memo, useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";

import { useAudioCtx } from "../../util/AudioProvider";
import {
  createGuitarStrings,
  IGuitarStrings,
  INote,
} from "../../util/AudioProcessor";

interface TunerPitchPipeParams {
  instrument: "guitar" | "piano";
  variant: "inline" | "split";
}

interface PlayNoteParams {
  frequency: number;
  duration?: number;
}

/**
 * Display a guitar head stock and allow click/touch to play each note.
 * @param param0
 * @returns
 */
export default function TunerPitchPipe({
  instrument,
  variant,
}: TunerPitchPipeParams) {
  const { audioCtx } = useAudioCtx();
  const [chosen, setChosen] = useState<INote>();
  let osc = audioCtx.createOscillator();
  let timer: string | number | NodeJS.Timeout | undefined;

  // Safely stop the oscillator and swollow errors after logging
  const stopOsc = () => {
    try {
      osc.stop();
    } catch (e) {
      console.log(`Already stopped: ${e}`);
    }
  };

  // Compare rounded values because javascript math does it's own thing - approximation is close enough.
  const isFreqEqual = (freq: number) =>
    Math.round(osc.frequency.value) === Math.round(freq);

  // Compound action that sets the new note and plays or stops the tone.
  function setChosenAndPlay(newNote?: INote) {
    setChosen(newNote === chosen ? undefined : newNote);
    if (newNote) {
      playNote({ frequency: newNote.freq });
    }
  }

  /**
   * Set the oscilator's frequency and play the note:
   *   - if the oscillator is already playing the current note, it will stop
   *   - if provided a durration, the oscillator will stop after the provided number of milliseconds
   * @param frequency
   * @param duration
   * @returns
   */
  function playNote({ frequency, duration }: PlayNoteParams) {
    // stopy any timers from executing, which can cause unwated behavior.
    if (timer) clearTimeout(timer);

    // stop the previous oscillator
    stopOsc();

    // Create new oscillator and start
    osc = audioCtx.createOscillator();
    osc.type = "square";
    osc.frequency.value = frequency; // value in hertz
    osc.connect(audioCtx.destination);
    osc.start();

    // Wait for duration before stopping the oscillator.
    if (duration) {
      timer = setTimeout(stopOsc, duration);
    }
  }

  // autostart when chosen is already available
  if (chosen) playNote({ frequency: chosen?.freq });

  useEffect(() => () => stopOsc());

  return (
    <>
      {instrument === "guitar" && (
        <GuitarTunerPitchPipe
          audioCtx={audioCtx}
          chosen={chosen}
          setChosen={setChosenAndPlay}
        />
      )}
      {instrument === "piano" && (
        <p>This is a piano</p>
      )}
    </>
  );
}

function GuitarTunerPitchPipe({
  chosen,
  setChosen,
  audioCtx,
}: {
  chosen?: INote;
  setChosen: (note?: INote) => void;
  audioCtx: AudioContext;
}) {
  const notes = createGuitarStrings(audioCtx.sampleRate);
  const strings = useMemo(() => {
    return Object.keys(notes).map((noteName) => {
      const note = notes[noteName as keyof IGuitarStrings];
      const color =
        chosen?.noteName === note.noteName ? "primary" : "secondary";
      const variant =
        chosen?.noteName === note.noteName ? "contained" : "outlined";
      return (
        <Button
          key={`tuning_peg_${noteName}`}
          variant={variant}
          color={color}
          onClick={() => setChosen(note)}
        >
          {noteName}
        </Button>
      );
    });
  }, [chosen]);

  return <div>{strings}</div>;
}
