import {useTranslation} from "react-i18next";
import {MenuItem} from "@mui/material";

const locales = {
    "en": {title: "English"},
    "nl": {title: "Nederlands"}
}

export function LanguageSwitcher() {
    const {i18n} = useTranslation();
    return (
        <>
            {Object.keys(locales).map((locale) => (
                <MenuItem key={locale} onClick={() => {
                    i18n.changeLanguage(locale).then(() => window.location.reload());
                }
                }>
                    {locale}
                </MenuItem>))}
        </>
    );
}