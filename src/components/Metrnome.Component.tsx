import { SettingsSystemDaydreamTwoTone } from "@mui/icons-material";
import { Button, Input, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAudioCtx } from "../util/AudioProvider";
import { Metronome, OnMetronomeTickProps } from "./Metronome";

interface MetronomeComponentParams {
  audioCtx?: AudioContext;
}

/**
 * Display a guitar head stock and allow click/touch to play each note.
 * @param param0
 * @returns
 */
export default function MetronomeComponent({}: MetronomeComponentParams) {
  const { audioCtx } = useAudioCtx();
  const [bpm, setBpm] = useState(120);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [data, setData] = useState<OnMetronomeTickProps>();
  const [isRunning, setIsRunning] = useState(false);
  const [metronome, setMetronome] = useState(new Metronome(bpm, { beatsPerBar, audioCtx, onTick }));

  useEffect(() => {
    setMetronome(
      new Metronome(120, { beatsPerBar, audioCtx, onTick })
    );
  }, [audioCtx])

  function onTick(d: OnMetronomeTickProps) {
    setData(d);
  }

  function handleClick() {
    isRunning ? metronome.stop() : metronome.start();
    setIsRunning(!isRunning);
  }

  return (
    <div>
      <Button onClick={handleClick}>{isRunning ? "Stop" : "Start"}</Button>
      <Input
        value={beatsPerBar}
        onChange={(e) => {
          const bpb = Number(e.currentTarget.value)
          metronome.beatsPerBar = bpb;
          setBeatsPerBar(bpb);
        }}
      />
      <Typography align="center" variant="body1">{`${isRunning}`}</Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
