import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import MetronomeComponent from "../components/metronome/Metrnome.component";
import { Theme, useMediaQuery } from "@mui/material";

export default function Metronome() {
  const matchesMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const matchesLg = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  
  return (
    <Container maxWidth={matchesMd ? matchesLg ? 'lg' : 'md' : "sm"} sx={{ mt: 12 }}>
      <CssBaseline />
      <Typography component="h1" variant="h5">
        Metronome
      </Typography>
      <MetronomeComponent />
    </Container>
  );
}
