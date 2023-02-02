import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";

export default function ProtectedPage() {
  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <CssBaseline />
      <Typography component="h1" variant="h5">Protected</Typography>
    </Container>
  );
}
