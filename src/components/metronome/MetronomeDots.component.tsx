import { Circle } from "@mui/icons-material";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/system";

interface MetronomeDotsProps {
  beatsPerBar: number;
  currentBeatInBar: number;
  accentBeats: number[];
  onClick?: (beat: number) => void;
}

/**
 * Visual Representation of Beats in a given bar of metronome beats.
 * Will handle repose to clicks.
 *
 * @param param0
 * @param param0.beatsPerBar - Number of beats in a single bar of metronome beats
 * @param param0.currentBeatInBar - The number of the current beat in a metronome bar
 * @param param0.accentBeats - Am array of beat numbers that should be marked as "accents"
 * @returns
 */
export default function MetronomeDots({
  beatsPerBar,
  currentBeatInBar,
  accentBeats,
  onClick,
}: MetronomeDotsProps) {
  const ACCENT_COLOR = "secondary";
  const INACTIVE_COLOR = "default";
  const ACTIVE_COLOR = "primary";
  const ACCENT_ACTIVE_COLOR = "success";
  // For responsive layout
  const matchesSm = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const matchesMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const matchesLg = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  // prettier-ignore
  const circleSize = matchesSm ? matchesMd ? matchesLg ? 1200 : 900 : 200 : 100;

  function getColor(beat: number) {
    const isAccent = accentBeats.indexOf(beat) > -1;
    if (beat === currentBeatInBar && isAccent) {
      return ACCENT_ACTIVE_COLOR;
    } else if (beat === currentBeatInBar) {
      return ACTIVE_COLOR;
    }
    return isAccent ? ACCENT_COLOR : INACTIVE_COLOR;
  }

  return (
    <Box
      sx={{
        marginTop: 0,
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
      children={[...Array(beatsPerBar).keys()].map((beat) => (
        <Typography key={`metronome_beat_${beat}`}>
          <IconButton
            aria-label="delete"
            color={getColor(beat)}
            onClick={() => (onClick ? onClick(beat) : undefined)}
            sx={matchesSm ? {} : { m: 0 }}
          >
            <Circle sx={{ fontSize: circleSize / beatsPerBar }} />
          </IconButton>
        </Typography>
      ))}
    />
  );
}
