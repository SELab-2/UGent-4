import {initReactI18next} from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const english = {
    logo: "./src/assets/logo_UGent_EN_RGB_2400_white.png",
    logo_blue: "./src/assets/logo_UGent_EN_RGB_2400_color.png",
    login: "Log in with your UGent account",
    back : "Back"
};
const dutch = {
    logo: "./src/assets/logo_UGent_NL_RGB_2400_wit.png",
    logo_blue: "./src/assets/logo_UGent_NL_RGB_2400_kleur.png",
    login: "Log in met je UGent account",
    back : "Terug"
};

i18n.use(initReactI18next).use(LanguageDetector).init({ fallbackLng: "en",
                                        debug:true, interpolation: {escapeValue: false},
                    resources: {en: {translation: english}, nl: {translation: dutch}}});

export default i18n;