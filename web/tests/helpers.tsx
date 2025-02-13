import { ReactNode } from "react";
import { ThemeProvider } from "../src/context/ThemeContext";
import { render } from "@testing-library/react";

export const renderWithTheme = (ui: ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);
