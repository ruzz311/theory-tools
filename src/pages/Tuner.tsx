import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import {
  Audiotrack as AudioTrackIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import { useAudioCtx } from "../util/AudioProvider";
import TunerPitchPipe from "../components/TunerPitchPipe";
import TunerComponent from "../components/TunerComponent";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material";

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
        width: "100%",
        bottom: 0,
        position: "fixed",
      }}
    >
      <BottomNavigationAction
        label="Tuning"
        value="tuningFork"
        icon={<AudioTrackIcon />}
      />
      <BottomNavigationAction
        label="Visual Tuner"
        value="visualTuner"
        icon={<VisibilityIcon />}
      />
      {/* <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} /> */}
    </BottomNavigation>
  );
}

export default function Tuner() {
  const theme = useTheme();
  const { audioCtx } = useAudioCtx();
  const [activeSection, setActiveSection] = useState("visualTuner");

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    // event.preventDefault();
    setActiveSection(newValue);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <CssBaseline />
      <Typography component="h1" variant="h5">
        Tuner
      </Typography>
      <Paper
        elevation={3}
        sx={{
          marginTop: theme.spacing(2),
          paddingRight: theme.spacing(2),
          paddingLeft: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // height: "100%"
        }}
      >
        {activeSection == "tuningFork" && audioCtx && (
          <TunerPitchPipe audioCtx={audioCtx} />
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
