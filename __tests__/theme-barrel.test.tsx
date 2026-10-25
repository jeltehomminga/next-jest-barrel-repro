import { render, screen } from "@testing-library/react";
import { Button, ThemeProvider, createTheme } from "@mui/material";

test("Button plus theme helpers from the barrel", () => {
  render(
    <ThemeProvider theme={createTheme()}>
      <Button>Hi</Button>
    </ThemeProvider>,
  );
  expect(screen.getByRole("button", { name: "Hi" })).toBeTruthy();
});
