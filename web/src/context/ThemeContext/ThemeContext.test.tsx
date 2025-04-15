import { screen } from "@testing-library/react";
import { useTheme } from "../../hooks/useTheme";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../test_utils/helpers";

const TestComponent = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <div>
      <p data-testid="mode">{mode}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    renderWithTheme(<TestComponent />);
  });

  it("should provide default theme mode as light", () => {
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("should toogle theme from light to dark", async () => {
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(screen.getByTestId("mode")).toHaveTextContent(/dark/);
  });

  it("should toogle theme correctly 3 times in a row", async () => {
    const button = screen.getByRole("button");
    const element = screen.getByTestId("mode");
    expect(element).toHaveTextContent(/light/);
    await userEvent.click(button);
    expect(element).toHaveTextContent(/dark/);
    await userEvent.click(button);
    expect(element).toHaveTextContent(/light/);
  });

  it("should save theme mode in localStorage", async () => {
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(JSON.parse(localStorage.getItem("theme")!)).toBe("dark");
  });
});
