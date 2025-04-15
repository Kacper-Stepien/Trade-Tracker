import type { Preview } from "@storybook/react";
import { lightTheme, darkTheme } from "../src/utils/themes/themes";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/utils/i18n/index";
import React from "react";
import { ThemeProvider } from "../src/context/ThemeContext/ThemeContext";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Select light or dark mode",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: ["light", "dark"],
      showName: true,
    },
  },
};

const preview: Preview = {
  decorators: [
    (Story, { globals }) => {
      const theme = globals.theme === "dark" ? darkTheme : lightTheme;

      return (
        <I18nextProvider i18n={i18n}>
          <ThemeProvider forcedTheme={theme}>
            <Story />
          </ThemeProvider>
        </I18nextProvider>
      );
    },
  ],
};

export default preview;
