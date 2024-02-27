import {createTheme} from "@mui/material";

const theme = createTheme({
    palette:{
        primary:{
            main:'#1E64C8'
        },
        secondary:{
            main:'#D0E4FF'
        },
        background:{
            default:'#FCF8FD'
        },
        text:{
            primary:'#47464A'
        },
        error:{
            main:'#FF5445'
        },
        success:{
            main:'#81A476'
        }
    },
});

export default theme;