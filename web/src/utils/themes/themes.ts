import { createTheme } from "@mui/material/styles";

import { PaletteMode } from "@mui/material";

const lightPalette = {
  mode: "light" as PaletteMode,
  primary: {
    main: "#01835d",
  },
  secondary: {
    main: "#33d3ac",
  },
  background: {
    default: "#e0f2f1",
    paper: "#b2dfdb",
  },
  text: {
    primary: "#333333",
    secondary: "#6FFFE9",
  },
  error: {
    main: "#E63946",
  },
};

const darkPalette = {
  mode: "dark" as PaletteMode,
  primary: {
    main: "#019267",
  },
  secondary: {
    main: "#33d3ac",
  },
  background: {
    default: "#121212",
    paper: "#1E1E1E",
  },
  text: {
    primary: "#EAEAEA",
    secondary: "#6FFFE9",
  },
  error: {
    main: "#E63946",
  },
};

export const lightTheme = createTheme({
  palette: lightPalette,
});

export const darkTheme = createTheme({
  palette: darkPalette,
});
