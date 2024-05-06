import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useLocation, useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from './LanguageSwitcher.tsx'
import { useMsal } from '@azure/msal-react'
import axios from 'axios'
import Button from '@mui/material/Button'

/**
 * Header component
 * Header bar for each page, contains the logo, title, back button, edit button, and user menu
 * IMPORTANT: put margin on box that comes directly under the header because of the fixed position of the header
 * variants: "not_main" - pages that need a back button, "editable" - for pages that are editable, "default" - no extra buttons
 * @param {Props} variant, title - The variant and title of the header
 * @returns {JSX.Element} - The header component
 */

/**
 * Interface for Header props
 */
interface Props {
    variant: 'not_main' | 'editable' | 'default'
    title: string
}

/**
 * Header component
 * @param {Props} variant, title - The variant and title of the header
 */
export const Header = ({ variant, title }: Props) => {
    const { t } = useTranslation()
    const { instance } = useMsal()

    /**
     * Function to handle edit action
     */
    const handleEdit = () => {
        console.log('edit')
        navigate('edit')
    }

    const handleBack = () => {
        //cut of last part of the path
        let path = location.pathname.slice(
            0,
            location.pathname.lastIndexOf('/')
        )
        //cut of the last part of the path again if the last part was a number
        path = path.slice(0, path.lastIndexOf('/'))
        //navigate to the new path or main page if there is no path
        navigate(path || '/')
    }

    const navigate = useNavigate()
    const location = useLocation()

    /**
     * Function to handle logout action
     */
    const logout = () => {
        // Clear the token from the cache so axios can't get access to the api
        axios.defaults.headers.common['Authorization'] = null
        instance
            .logoutRedirect({
                postLogoutRedirectUri: '/',
            })
            .catch((e) => {
                console.error(e)
            })
    }

    return (
        <>
            <AppBar
                elevation={0}
                position="absolute"
                sx={{
                    margin: 'auto',
                    flexGrow: 1,
                    alignItems: 'space-between',
                    width: '100%',
                }}
            >
                <Toolbar>
                    {/* Logo and Home Button */}
                    <Box>
                        <Tooltip title={t('home')}>
                            <IconButton
                                onClick={() => navigate('/')}
                                sx={{ padding: 0, borderRadius: 5 }}
                            >
                                <Box
                                    component="img"
                                    src={t('logo')}
                                    alt="logo"
                                    sx={{
                                        height: 80,
                                        width: 80,
                                        display: 'block',
                                        padding: 0,
                                        margin: 0,
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        {/* Back Button (if variant is not default) */}
                        {variant !== 'default' && (
                            <Tooltip title={t('back')}>
                                <IconButton
                                    onClick={handleBack}
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="back"
                                    sx={{ mr: 2 }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    {/* Title */}
                    <Typography
                        maxWidth={'88%'}
                        variant="h5"
                        component="div"
                        overflow={'auto'}
                        sx={{
                            margin: 'auto',
                            textAlign: 'center',
                            pl: 10,
                        }}
                    >
                        {title}
                        {variant === 'editable' && (
                            <IconButton
                                onClick={handleEdit}
                                disableRipple={true}
                                sx={{
                                    marginBottom: 1,
                                    color: 'text.secondary',
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        )}
                    </Typography>
                    {/* User Menu */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <LanguageSwitcher />
                        <Button
                            variant={'text'}
                            onClick={logout}
                            sx={{
                                color: 'background.default',
                                paddingTop: 1,
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}
