import { ChangeEvent, useState } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AudioTrackIcon from "@mui/icons-material/Audiotrack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CssBaseline from "@mui/material/CssBaseline";

import { useAudioCtx } from "../util/AudioProvider";
import TunerPitchPipe from "../components/tuner/TunerPitchPipe.component";
import TunerComponent from "../components/tuner/Tuner.component";

interface TunerBottomNavigationProps {
  handleChange: (event: ChangeEvent<{}>, newValue: string) => void;
  chosenValue: string;
}
export function TunerBottomNavigation({
  handleChange,
  chosenValue,
}: TunerBottomNavigationProps) {
  return (
    <BottomNavigation
      value={chosenValue}
      onChange={handleChange}
      showLabels={true}
      sx={{
        bottom: 0,
        position: "fixed",
        width: "100%",
      }}
    >
      <BottomNavigationAction
        label="Tuning Pitch Pipe"
        value="pitchPipe"
        icon={<AudioTrackIcon />}
      />
      <BottomNavigationAction
        label="Visual Tuner"
        value="visualTuner"
        icon={<VisibilityIcon />}
      />
    </BottomNavigation>
  );
}

export default function Tuner() {
  const matchesMd = useMediaQuery((t: Theme) => t.breakpoints.up("md"));
  const matchesLg = useMediaQuery((t: Theme) => t.breakpoints.up("lg"));
  const theme = useTheme();
  const { audioCtx } = useAudioCtx();
  const [activeSection, setActiveSection] = useState("pitchPipe");
  const [instrument, setInstrument] = useState<"guitar" | "piano">("guitar");
  const [instrumentVariant, setInstrumentVariant] = useState<
    "inline" | "split"
  >("inline");

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    event.preventDefault();
    setActiveSection(newValue);
  };

  return (
    <Container
      maxWidth={matchesMd ? (matchesLg ? "lg" : "md") : "sm"}
      sx={{ mt: 12 }}
    >
      <CssBaseline />
      <Typography component="h1" variant="h5">
        Tuner
      </Typography>
      <Paper
        elevation={7}
        sx={{
          padding: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {activeSection == "pitchPipe" && audioCtx && (
          <TunerPitchPipe instrument={instrument} variant={instrumentVariant} />
        )}
        {activeSection == "visualTuner" && <TunerComponent />}
        <TunerBottomNavigation
          handleChange={handleChange}
          chosenValue={activeSection}
        />
      </Paper>
    </Container>
  );
}
