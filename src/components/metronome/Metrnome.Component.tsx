import { PlayArrow, Square } from "@mui/icons-material";
import { Box, Button, Grid, TextField, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/system";
import { useEffect, useState } from "react";

import { useAudioCtx } from "../../util/AudioProvider";
import { getSessionStoreNumber } from "../../util/utils";
import { Metronome, OnMetronomeTickProps } from "./Metronome";
import MetronomeDots from "./MetronomeDots.component";

/**
 * Display a guitar head stock and allow click/touch to play each note.
 * @param param0
 * @returns
 */
export default function MetronomeComponent() {
  const BPM_VAL_SESSION_KEY = "metronome.bpm";
  const BEATS_VAL_SESSION_KEY = "metronome.beatsInBar";
  const [bpm, setBpm] = useState(
    getSessionStoreNumber(BPM_VAL_SESSION_KEY, 120)
  );
  const [beatsPerBar, setBeatsPerBar] = useState(
    getSessionStoreNumber(BEATS_VAL_SESSION_KEY, 4)
  );
  const [data, setData] = useState<OnMetronomeTickProps>();
  const [isRunning, setIsRunning] = useState(false);
  const [accentBeats, setAccentBeats] = useState<number[]>([]);
  const { audioCtx } = useAudioCtx();
  const [metronome] = useState(
    new Metronome(bpm, { beatsPerBar, audioCtx, accentBeats, onTick: setData })
  );

  // For Responsive Layout
  const matchesMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const matchesLg = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const inputSize = matchesMd ? (matchesLg ? undefined : "medium") : "small";

  // Actions
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

  // Set the accent beats on the metronome object and in react state.
  // adds or removes the beat based on its existance in the accentBeats array.
  function handleBeatDotClick(beatNumber: number) {
    const foundIndex = accentBeats.indexOf(beatNumber, 0);
    let newBeats = [...accentBeats];
    if (foundIndex > -1) {
      newBeats.splice(foundIndex, 1);
    } else {
      newBeats.push(beatNumber);
    }
    metronome.accentBeats = newBeats;
    setAccentBeats(newBeats);
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            autoFocus
            fullWidth
            required
            id="bpm"
            label="BPM"
            name="bpm"
            margin="normal"
            size={inputSize}
            type="number"
            value={bpm}
            inputProps={{ sx: {fontSize: matchesMd ? 100 : 50 }}}
            // InputLabelProps={{sx: {fontSize: 20}}}
            onChange={(e) => handleBPMChange(Number(e.currentTarget.value))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            id="beatsPerBar"
            name="beatsPerBar"
            label="Beats in bar"
            type="number"
            margin="normal"
            size={inputSize}
            value={beatsPerBar}
            inputProps={{ sx: {fontSize: matchesMd ? 100 : 50 }}}
            onChange={(e) =>
              handleBeatsInBarChange(Number(e.currentTarget.value))
            }
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleToggleClick}
        sx={{ mt: 2, mb: 2, fontSize: matchesMd ? 100 : undefined }}
      >
        {isRunning ? <Square/> : <PlayArrow/>}
      </Button>
      <MetronomeDots
        beatsPerBar={beatsPerBar}
        currentBeatInBar={data?.beatNumber || 0}
        accentBeats={accentBeats}
        onClick={handleBeatDotClick}
      />
    </Box>
  );
}
