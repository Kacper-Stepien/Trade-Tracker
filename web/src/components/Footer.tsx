import { Grid } from "@mui/material";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  return (
    <Grid
      container
      bgcolor={theme.palette.background.paper}
      color={theme.palette.text.primary}
      padding={2}
    >
      Footer
    </Grid>
  );
}
