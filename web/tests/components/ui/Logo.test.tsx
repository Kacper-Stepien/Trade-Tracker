import { render, screen } from "@testing-library/react";
import Logo from "../../../src/components/ui/Logo";

describe("Logo component", () => {
  it("renders the logo icon and text", () => {
    render(<Logo />);
    const icon = screen.getByLabelText(/logo/i);
    expect(icon).toBeInTheDocument();
    expect(screen.getByText("Trade Tracker")).toBeInTheDocument();
  });
});
