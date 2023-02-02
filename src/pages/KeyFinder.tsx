import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

export default function KeyFinder() {
  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <CssBaseline />
      <Typography component="h1" variant="h5">Key Finder</Typography>
    </Container>
  );
}
