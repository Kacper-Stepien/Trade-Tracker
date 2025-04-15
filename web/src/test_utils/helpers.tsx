import { ReactNode } from "react";
import { ThemeProvider } from "../context/ThemeContext/ThemeContext";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../utils/i18n";

export const renderWithTheme = (ui: ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

export const renderWithI18n = (ui: ReactNode) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

export const renderWithProviders = (ui: ReactNode) =>
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nextProvider>
  );
