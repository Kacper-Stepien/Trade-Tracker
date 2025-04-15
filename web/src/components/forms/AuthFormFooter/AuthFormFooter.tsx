import { Divider, Stack } from "@mui/material";
import GoogleButton from "../../ui/GoogleButton/GoogleButton";
import { useTranslation } from "react-i18next";

const AuthFormFooter = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Divider>{t("or")}</Divider>
      <GoogleButton />
    </Stack>
  );
};

export default AuthFormFooter;
