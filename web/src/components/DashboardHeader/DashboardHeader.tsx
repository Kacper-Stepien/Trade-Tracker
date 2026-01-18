import { AppBar, Toolbar, Stack } from "@mui/material";
import UserMenu from "../UserMenu/UserMenu";
import ThemeButton from "../ui/ThemeButton/ThemeButton";
import ChangeLanguageButton from "../ui/ChangeLanguageButton/ChangeLanguageButton";
import { useTheme } from "../../hooks/useTheme";

export default function DashboardHeader() {
  const { theme } = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <UserMenu />
          <ThemeButton />
          <ChangeLanguageButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
