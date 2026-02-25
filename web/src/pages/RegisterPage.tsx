import { useTranslation } from "react-i18next";

import { Grid } from "@mui/material";
import RegisterForm from "../components/forms/RegisterForm/RegisterForm";
import { PageHeader } from "../components/PageHeader/PageHeader";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <Grid
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
      <PageHeader title={t("registration")} marginBottom={0} />
      <RegisterForm />
    </Grid>
  );
}
