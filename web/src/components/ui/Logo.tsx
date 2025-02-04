import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import { Stack, Typography } from "@mui/material";

export default function Logo() {
  return (
    <Stack
      direction={"row"}
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <ShowChartRoundedIcon fontSize="large" />
      <Typography variant="h5">Trade Tracker</Typography>
    </Stack>
  );
}
