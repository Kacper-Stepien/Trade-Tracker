import { useTranslation } from "react-i18next";

import { Grid, Typography } from "@mui/material";
import { useTheme } from "../hooks/useTheme";
import RegisterForm from "../components/forms/RegisterForm/RegisterForm";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Grid
      // bgcolor={theme.palette.background.paper}
      color={"text.primary"}
      height="100%"
      maxWidth={"800px"}
      width={"100%"}
      marginTop={4}
      marginBottom={4}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      padding={4}
      gap={4}
      borderRadius={2}
    >
      <Typography variant="h4">{t("registration")}</Typography>
      <RegisterForm />
    </Grid>
  );
}
