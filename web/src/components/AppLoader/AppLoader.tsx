import { CircularProgress, Stack } from "@mui/material";
import Logo from "../ui/Logo/Logo";
import { useTheme } from "../../hooks/useTheme";

const LOADER_SIZE = "3rem";
const SPACING = 4;

export default function AppLoader() {
  const { theme } = useTheme();
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="100vh"
      spacing={SPACING}
      bgcolor={theme.palette.background.default}
      color={theme.palette.text.primary}
    >
      <Logo />

      <CircularProgress color="primary" size={LOADER_SIZE} />
    </Stack>
  );
}
