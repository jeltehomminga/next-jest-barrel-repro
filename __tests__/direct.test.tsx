import { render, screen } from "@testing-library/react";
import Button from "@mui/material/Button";

test("Button from its own path", () => {
  render(<Button>Hi</Button>);
  expect(screen.getByRole("button", { name: "Hi" })).toBeTruthy();
});
