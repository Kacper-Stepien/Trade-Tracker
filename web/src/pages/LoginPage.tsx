import { useTranslation } from "react-i18next";

import { Grid } from "@mui/material";
import LoginForm from "../components/forms/LoginForm/LoginForm";
import { PageHeader } from "../components/PageHeader/PageHeader";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <Grid
      color={"text.primary"}
      height="100%"
      maxWidth={"800px"}
      width={"100%"}
      margin={4}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      padding={8}
      gap={4}
      borderRadius={2}
    >
      <PageHeader title={t("logging")} marginBottom={0} />
      <LoginForm />
    </Grid>
  );
}
