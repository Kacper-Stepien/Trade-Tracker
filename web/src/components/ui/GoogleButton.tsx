import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const GoogleButton = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    window.location.assign(`${apiUrl}/auth/google/login`);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<FcGoogle />}
      onClick={handleGoogleLogin}
    >
      {t("continueWithGoogle")}
    </Button>
  );
};

export default GoogleButton;
