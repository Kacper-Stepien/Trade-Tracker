import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  const { t } = useTranslation();

  return (
    <Button variant="outlined" startIcon={<FcGoogle />}>
      {t("continueWithGoogle")}
    </Button>
  );
};

export default GoogleButton;
