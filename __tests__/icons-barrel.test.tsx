import { render, screen } from "@testing-library/react";
import { Home } from "@mui/icons-material";

test("Home icon from the barrel", () => {
  render(<Home />);
  expect(screen.getByTestId("HomeIcon")).toBeTruthy();
});
