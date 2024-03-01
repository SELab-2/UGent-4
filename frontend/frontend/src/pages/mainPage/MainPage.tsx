import {Header} from "../../components/Header.tsx";
import {Box, Stack} from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";

export function MainPage() {

    //TODO: use tabs to display different content
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Naam Platform"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={[]} nodes={[]}/>
                </Box>
            </Stack>
        </>
    );
}