import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enLang from "./locales/en.json";
import esLang from "./locales/es.json";
import plLang from "./locales/pl.json";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/pl";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enLang,
      },
      es: {
        translation: esLang,
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
