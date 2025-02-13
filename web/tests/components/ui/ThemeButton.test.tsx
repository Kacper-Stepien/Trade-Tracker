import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeButton from "../../../src/components/ui/ThemeButton";
import { renderWithTheme } from "../../helpers";

describe("ThemeButton", () => {
  beforeEach(() => {
    renderWithTheme(<ThemeButton />);
  });

  it("should renders the switch", () => {
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("should toogles theme when clicked", async () => {
    const switchButton = screen.getByRole("checkbox");
    expect(switchButton).not.toBeChecked();
    await userEvent.click(switchButton);
    await waitFor(() => {
      expect(switchButton).toBeChecked();
    });
    await userEvent.click(switchButton);
    await waitFor(() => {
      expect(switchButton).not.toBeChecked();
    });
  });
});
