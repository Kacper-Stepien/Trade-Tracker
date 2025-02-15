import { CircularProgress, Stack } from "@mui/material";
import Logo from "./ui/Logo";
import { useTheme } from "../hooks/useTheme";

export default function AppLoader() {
  const { theme } = useTheme();
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="100vh"
      spacing={4}
      bgcolor={theme.palette.background.default}
      color={theme.palette.text.primary}
    >
      <Logo />

      <CircularProgress color="primary" size="3rem" />
    </Stack>
  );
}
