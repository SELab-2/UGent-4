import { Button } from '../../components/CustomComponents.tsx'
import { Box, Typography } from '@mui/material'
import { t } from 'i18next'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../../authConfig/authConfig.ts'

/*
LoginPage component is a simple page with a logo and a login button.
the button uses handleLogin function to handle authentication trough backend with Microsoft
The page is styled with mui components
 */

export function LoginPage() {
    const { instance } = useMsal()

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch((e) => {
            console.log(e)
        })
    }

    return (
        <>
            {/* Background container */}
            <Box
                position="fixed"
                top={0}
                left={0}
                height="100%"
                width="100%"
                component="div"
                sx={{
                    backgroundColor: 'secondary.main',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    backgroundSize: 'cover',
                }}
            >
                {/* Background image */}
                <Box
                    className="background-image"
                    component="div"
                    height="100%"
                    width="100%"
                    top={0}
                    left={0}
                    sx={{
                        backgroundImage: `url(/assets/ufo-logo-3375276369.png)`,
                        opacity: 0.25,
                        position: 'fixed',
                        backgroundSize: 'cover',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        padding: 0,
                        margin: 0,
                        zIndex: -1,
                    }}
                />
                {/* Content container */}
                <Box
                    component="div"
                    className="contentContainer"
                    display="flex"
                    position={'relative'}
                    flexDirection="column"
                    alignItems="center"
                    justifyContent={'center'}
                    alignSelf={'center'}
                >
                    <Box
                        component="div"
                        className="upperContainer"
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent={'center'}
                        alignSelf={'center'}
                    >
                        <Box
                            id='logo'
                            component="img"
                            src={t('logo_blue')}
                            alt="logo"
                            sx={{
                                maxHeight: '20%',
                                maxWidth: '20%',
                            }}
                        />
                        <Typography
                            variant="h3"
                            sx={{
                                color: 'text.primary',
                                maxWidth: '20%',
                                maxHeight: '20%',
                            }}
                        >
                            Pigeonhole
                        </Typography>
                    </Box>
                    {/* Lower container with login button */}
                    <Box
                        component={'div'}
                        className="lowerContainer"
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent={'center'}
                        alignSelf={'stretch'}
                    >
                        <Button onClick={handleLogin}>{t('login')}</Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
