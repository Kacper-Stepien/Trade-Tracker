import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import { Stack, Typography } from "@mui/material";

export default function Logo() {
  return (
    <Stack
      direction={"row"}
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ cursor: "pointer" }}
    >
      <ShowChartRoundedIcon fontSize="large" aria-label="Trade Tracker Logo" />
      <Typography variant="h5" component="span">
        Trade Tracker
      </Typography>
    </Stack>
  );
}
