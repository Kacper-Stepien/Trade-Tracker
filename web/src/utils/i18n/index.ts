import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "./locales/en.json";
import plLang from "./locales/pl.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLang,
    },
    pl: {
      translation: plLang,
    },
  },
  lng: "pl", // if you're using a language detector, do not define the lng option
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});
