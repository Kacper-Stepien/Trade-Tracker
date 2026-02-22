import createTheme from "@mui/material/styles/createTheme";
import { alpha } from "@mui/material/styles";

import { PaletteMode } from "@mui/material";

export const PRODUCT_STATUS_COLORS = {
  sold: "#10b981",
  unsold: "#f59e0b",
  loss: "#f43f5e",
} as const;

const lightPalette = {
  mode: "light" as PaletteMode,
  primary: {
    main: "#f25c54",
  },
  secondary: {
    main: "#64ffda",
  },

  background: {
    default: "#fafafa",
    paper: "#ededf1",
  },
  text: {
    primary: "#333333",
    secondary: "#333333",
  },
  error: {
    main: "#E63946",
  },
};

const darkPalette = {
  mode: "dark" as PaletteMode,
  primary: {
    main: "#64ffda",
  },
  secondary: {
    main: "#f25c54",
  },
  background: {
    default: "#1a1a1a",
    paper: "#1E1E1E",
  },
  text: {
    primary: "#EAEAEA",
    secondary: "#6FFFE9",
  },
  error: {
    main: "#f25c54",
  },
};

export const lightTheme = createTheme({
  palette: lightPalette,
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${alpha(theme.palette.primary.main, 0.6)} ${alpha(
            theme.palette.background.default,
            0.5,
          )}`,
        },
        "*::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          borderRadius: "999px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.primary.main, 0.6),
          borderRadius: "999px",
          border: `2px solid ${alpha(theme.palette.background.default, 0.7)}`,
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.8),
        },
      }),
    },
  },
});

export const darkTheme = createTheme({
  palette: darkPalette,
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${alpha(theme.palette.primary.main, 0.65)} ${alpha(
            theme.palette.background.default,
            0.7,
          )}`,
        },
        "*::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: alpha(theme.palette.background.default, 0.65),
          borderRadius: "999px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.primary.main, 0.65),
          borderRadius: "999px",
          border: `2px solid ${alpha(theme.palette.background.default, 0.85)}`,
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.85),
        },
      }),
    },
  },
});
