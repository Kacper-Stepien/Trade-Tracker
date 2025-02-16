import { Divider } from "@mui/material";
import GoogleButton from "../ui/GoogleButton";
import { useTranslation } from "react-i18next";

const FormFooter = () => {
  const { t } = useTranslation();

  return (
    <>
      <Divider>{t("or")}</Divider>
      <GoogleButton />
    </>
  );
};

export default FormFooter;
