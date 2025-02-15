import { AppBar, Grid, Stack, Toolbar } from "@mui/material";
import ChangeLanguageButton from "./ui/ChangeLanguageButton";
import ThemeButton from "./ui/ThemeButton";
import Logo from "./ui/Logo";
import UserMenu from "./UserMenu";

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
          <Logo />
          <Stack
            direction="row"
            spacing={2}
            aria-label="Navbar Actions"
            alignItems="center"
          >
            <UserMenu />
            <ThemeButton />
            <ChangeLanguageButton />
          </Stack>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
