"use client";

// Same imports as __tests__/theme-barrel.test.tsx. next build and next dev
// rewrite them through optimizePackageImports (on by default for @mui/material).
import { Button, ThemeProvider, createTheme } from "@mui/material";

export default function Home() {
  return (
    <ThemeProvider theme={createTheme()}>
      <Button>Hi</Button>
    </ThemeProvider>
  );
}
