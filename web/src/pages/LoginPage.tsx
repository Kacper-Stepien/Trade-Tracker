import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

export default function LoginPage() {
  const { t, i18n } = useTranslation();

  console.log(i18n.languages);
  console.log(i18n.language);

  return (
    <Box
      bgcolor={"background.default"}
      color={"text.primary"}
      sx={{ height: "100vh" }}
    >
      <Navbar />
      <p>{t("welcomeToReact")}</p>
    </Box>
  );
}
