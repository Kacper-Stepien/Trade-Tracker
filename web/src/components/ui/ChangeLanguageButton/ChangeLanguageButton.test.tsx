import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangeLanguageButton from "./ChangeLanguageButton";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../utils/i18n/index";
import { ReactNode } from "react";

const renderWithI18n = (ui: ReactNode) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

describe("ChangeLanguageButton", () => {
  beforeEach(() => {
    localStorage.clear();
    renderWithI18n(<ChangeLanguageButton />);
  });

  it("should render button with current language", () => {
    expect(screen.getByRole("button")).toHaveTextContent(
      i18n.language.toUpperCase()
    );
  });

  it("should open the language menu when clicked", async () => {
    const button = screen.getByRole("button");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should change language when a menu item is clicked", async () => {
    const button = screen.getByRole("button");
    await userEvent.click(button);
    const newLanguage = i18n.language === "en" ? "pl" : "en";
    const languageOption = screen.getByText(newLanguage.toUpperCase());
    expect(i18n.language).not.toBe(newLanguage);
    await userEvent.click(languageOption);
    expect(i18n.language).toBe(newLanguage);
  });

  it("should close the menu when clicking outside", async () => {
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should save selected language in localStorage", async () => {
    const button = screen.getByRole("button");
    await userEvent.click(button);

    const newLanguage = i18n.language === "en" ? "pl" : "en";
    const languageOption = screen.getByText(newLanguage.toUpperCase());
    await userEvent.click(languageOption);
    expect(localStorage.getItem("i18nextLng")).toBe(newLanguage);
  });
});
