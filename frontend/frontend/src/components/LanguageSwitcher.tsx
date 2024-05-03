import { useTranslation } from 'react-i18next'
import { Box, Divider } from '@mui/material'
import Button from '@mui/material/Button'
import LanguageIcon from '@mui/icons-material/Language'

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
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                <Button
                    sx={{
                        color: 'background.default',
                        paddingTop: 1,
                        margin: 0,
                    }}
                    variant="text"
                    key={locales.en.title}
                    onClick={() => {
                        i18n.changeLanguage('en').then(() =>
                            window.location.reload()
                        )
                    }}
                >
                    {'En'}
                </Button>
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: 20,
                        width: '1px',
                        marginTop: 1,
                        padding: 0,
                        backgroundColor: 'background.default',
                    }}
                />
                <Button
                    sx={{
                        color: 'background.default',
                        paddingTop: 1,
                        margin: 0,
                    }}
                    variant="text"
                    key={locales.nl.title}
                    onClick={() => {
                        i18n.changeLanguage('nl').then(() =>
                            window.location.reload()
                        )
                    }}
                >
                    {'Nl'}
                </Button>
                <LanguageIcon />
            </Box>
        </>
    )
}
