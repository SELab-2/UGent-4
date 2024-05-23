import { createTheme } from '@mui/material'

const theme = createTheme({
    palette: {
        primary: {
            main: '#1E64C8',
            light: '#D0E4FF',
            dark: '#194F9C',
            contrastText: '#FCF8FD',
        },
        secondary: {
            main: '#D0E4FF',
            contrastText: '#47464A',
        },
        background: {
            default: '#FCF8FD',
            paper: '#FCF8FD',
        },
        text: {
            primary: '#47464A',
            secondary: '#cbc8cc',
        },
        error: {
            main: '#FF5445',
        },
        success: {
            main: '#81A476',
        },
        warning: {
            main: '#FFC107',
        },
        info: {
            main: '#47464A',
        },
    },
})

export default theme
