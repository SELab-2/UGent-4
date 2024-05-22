import { Box, Typography } from '@mui/material'
import { t } from 'i18next'

export default function FourOFourPage() {
    return (
        <>
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
                <Box
                    className="background-image"
                    component="div"
                    height="100%"
                    width="100%"
                    top={0}
                    left={0}
                    sx={{
                        backgroundImage: `url(/assets/ufo-logo-3375276369.png)`,
                        opacity: 0.2,
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
                <Box
                    component="div"
                    className="contentContainer"
                    display="flex"
                    position={'relative'}
                    flexDirection="column"
                    alignItems="center"
                    justifyContent={'center'}
                    alignSelf={'center'}
                    maxWidth="60%"
                    maxHeight="60%"
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
                            component="img"
                            src={t('logo_blue')}
                            alt="logo"
                            sx={{
                                maxHeight: '20%',
                                maxWidth: '30%',
                            }}
                        />
                        <Box
                            component="div"
                            display="flex"
                            flexDirection="column"
                            maxWidth={'40%'}
                            maxHeight={'30%'}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'error.main',
                                    maxWidth: '100%',
                                    maxHeight: '50%',
                                }}
                            >
                                {"404"}
                            </Typography>
                            <Typography
                                variant={'h5'}
                                sx={{
                                    color: 'error.main',
                                    maxWidth: '100%',
                                    maxHeight: '50%',
                                }}
                            >
                                {"Error: Page not found"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}