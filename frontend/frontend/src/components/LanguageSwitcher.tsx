import { useTranslation } from 'react-i18next'
import { MenuItem } from '@mui/material'

// Define language options with their corresponding titles
const locales = {
    en: { title: 'English' },
    nl: { title: 'Nederlands' },
}

/**
 * Component to switch between different language options.
 * This component renders a list of menu items, each representing a language option.
 */
export function LanguageSwitcher() {
    const { i18n } = useTranslation()
    return (
        <>
            {/* Map through language options and render a MenuItem for each */}
            {Object.keys(locales).map((locale) => (
                <MenuItem
                    id={locale}
                    key={locale}
                    onClick={() => {
                        i18n.changeLanguage(locale).then(() =>
                            window.location.reload()
                        )
                    }}
                >
                    {locale}
                </MenuItem>
            ))}
        </>
    )
}
