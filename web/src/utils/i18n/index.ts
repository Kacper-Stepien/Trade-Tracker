import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enLang from "./locales/en.json";
import plLang from "./locales/pl.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enLang,
      },
      pl: {
        translation: plLang,
      },
    },
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
