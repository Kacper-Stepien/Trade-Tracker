import createTheme from "@mui/material/styles/createTheme";

import { PaletteMode } from "@mui/material";

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
