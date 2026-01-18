import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("sidebar.dashboard")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Overview of your trading activity
      </Typography>
    </Box>
  );
}