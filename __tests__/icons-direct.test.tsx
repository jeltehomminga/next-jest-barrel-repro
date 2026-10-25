import { render, screen } from "@testing-library/react";
import Home from "@mui/icons-material/Home";

test("Home icon from its own path", () => {
  render(<Home />);
  expect(screen.getByTestId("HomeIcon")).toBeTruthy();
});
