import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1E64C8',
            contrastText: '#FCF8FD'
        },
        secondary: {
            main: '#D0E4FF',
            contrastText: '#47464A'
        },
        background: {
            default: '#FCF8FD',
        },
        text: {
            primary: '#47464A',
            secondary: '#898991'
        },
        error: {
            main: '#FF5445'
        },
        success: {
            main: '#81A476'
        }
    },
});

export default theme;