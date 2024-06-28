import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t, i18n } = useTranslation();

  const changeLanguageHandler = (lang) => {
    i18n.changeLanguage("en");
  };
  return (
    <div>
      <p>{t("welcomeToReact")}</p>
      <button onClick={changeLanguageHandler}>zmień język</button>
    </div>
  );
}
