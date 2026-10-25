import { render, screen } from "@testing-library/react";
import { Button } from "@mui/material";

test("Button from the barrel", () => {
  render(<Button>Hi</Button>);
  expect(screen.getByRole("button", { name: "Hi" })).toBeTruthy();
});
