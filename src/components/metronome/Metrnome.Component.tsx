import { Circle } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAudioCtx } from "../../util/AudioProvider";
import { Metronome, OnMetronomeTickProps } from "./Metronome";

/**
 * Display a guitar head stock and allow click/touch to play each note.
 * @param param0
 * @returns
 */
export default function MetronomeComponent() {
  const BPM_VAL_SESSION_KEY = "metronome.bpm";
  const BEATS_VAL_SESSION_KEY = "metronome.beatsInBar";

  const { audioCtx } = useAudioCtx();
  const [bpm, setBpm] = useState(
    Number(sessionStorage.getItem(BPM_VAL_SESSION_KEY) || 120)
  );
  const [beatsPerBar, setBeatsPerBar] = useState(
    Number(sessionStorage.getItem(BEATS_VAL_SESSION_KEY) || 4)
  );
  const [data, setData] = useState<OnMetronomeTickProps>();
  const [isRunning, setIsRunning] = useState(false);
  const [metronome] = useState(
    new Metronome(bpm, { beatsPerBar, audioCtx, onTick: setData })
  );

  function handleToggleClick() {
    isRunning ? metronome.stop() : metronome.start();
    setIsRunning(!isRunning);
  }

  function handleBPMChange(newBpm: number) {
    metronome.tempo = newBpm;
    sessionStorage.setItem(BPM_VAL_SESSION_KEY, `${newBpm}`);
    setBpm(newBpm);
  }

  function handleBeatsInBarChange(newBeatsPerBar: number) {
    metronome.beatsPerBar = newBeatsPerBar;
    sessionStorage.setItem(BEATS_VAL_SESSION_KEY, `${newBeatsPerBar}`);
    setBeatsPerBar(newBeatsPerBar);
  }

  // Stop the metronome on component unload
  useEffect(() => () => metronome.stop(), []);

  return (
    <Box
      component="form"
      onSubmit={(e) => e.preventDefault()}
      noValidate={false}
      sx={{ mt: 1 }}
    >
      <TextField
        margin="normal"
        required
        id="bpm"
        label="BPM"
        name="bpm"
        type="number"
        size="small"
        autoFocus
        onChange={(e) => handleBPMChange(Number(e.currentTarget.value))}
        value={bpm}
      />
      {/* <BpmInput val={bpm} onChange={handleBPMChange}/> */}
      <TextField
        margin="normal"
        required
        name="beatsPerBar"
        label="Beats in bar"
        type="number"
        id="beatsPerBar"
        size="small"
        value={beatsPerBar}
        onChange={(e) => handleBeatsInBarChange(Number(e.currentTarget.value))}
      />
      <MetronomeDot
        beatsPerBar={beatsPerBar}
        currentBeatInBar={data?.beatNumber || 0}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleToggleClick}
        sx={{ mt: 2, mb: 2 }}
      >
        {isRunning ? "Stop" : "Start"}
      </Button>
    </Box>
  );
}

interface MetronomeDotProps {
  beatsPerBar: number;
  currentBeatInBar: number;
}

function MetronomeDot({ beatsPerBar, currentBeatInBar }: MetronomeDotProps) {
  const dots = [...Array(beatsPerBar).keys()].map((beat) => {
    const isActive = beat === currentBeatInBar;
    const dotColor = isActive ? "primary" : "secondary";
    
    return <Circle color={dotColor} key={`metronome_beat_${beat}`} />;
  });

  return (
    <Box
      sx={{
        marginTop: 0,
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        alignItems: "center",
      }}
    >
      {dots}
    </Box>
  );
}
