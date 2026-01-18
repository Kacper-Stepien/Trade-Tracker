import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import { Stack, Typography } from "@mui/material";
import { useTheme } from "../../../hooks/useTheme";

interface LogoProps {
  size?: "small" | "medium";
}

export default function Logo({ size = "medium" }: LogoProps) {
  const { theme } = useTheme();

  const isSmall = size === "small";

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ cursor: "pointer" }}
    >
      <ShowChartRoundedIcon
        fontSize={isSmall ? "medium" : "large"}
        aria-label="Trade Tracker Logo"
        sx={{ color: theme.palette.primary.main }}
      />
      <Typography
        variant={isSmall ? "h6" : "h5"}
        component="span"
        sx={{ fontWeight: 500, whiteSpace: "nowrap" }}
      >
        Trade Tracker
      </Typography>
    </Stack>
  );
}
