import { AppBar, Grid, Stack, Toolbar } from "@mui/material";
import ChangeLanguageButton from "../ui/ChangeLanguageButton/ChangeLanguageButton";
import ThemeButton from "../ui/ThemeButton/ThemeButton";
import Logo from "../ui/Logo/Logo";
import UserMenu from "../UserMenu/UserMenu";

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
