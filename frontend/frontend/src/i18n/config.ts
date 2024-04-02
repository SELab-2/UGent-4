import {initReactI18next} from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import english from './en';
import dutch from './nl';

i18n.use(initReactI18next).use(LanguageDetector).init({
    fallbackLng: "en",
    debug: true, interpolation: {escapeValue: false},
    resources: {en: {translation: english}, nl: {translation: dutch}}
});

export default i18n;