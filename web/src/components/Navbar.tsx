import { AppBar, Grid, Stack, Toolbar } from "@mui/material";
import ChangeLanguageButton from "./ui/ChangeLanguageButton";
import ThemeButton from "./ui/ThemeButton";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h2>TradeTracker</h2>
          <Stack direction="row" spacing={2}>
            <ThemeButton />
            <ChangeLanguageButton />
          </Stack>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
