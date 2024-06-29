import { useTranslation } from "react-i18next";
import ChangeLanguageButton from "../components/ui/ChangeLanguageButton";

export default function LoginPage() {
  const { t, i18n } = useTranslation();

  console.log(i18n.languages);
  console.log(i18n.language);

  return (
    <div>
      <p>{t("welcomeToReact")}</p>
      <ChangeLanguageButton />
    </div>
  );
}
