import {Header} from "../../components/Header.tsx";
import {Box, Stack} from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {CourseCard} from "../../components/CourseCard.tsx";

export function MainPage() {
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Naam Platform"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_courses","archived"]} nodes={[<CourseCard courseId={"a"} archived={false}/>]}/>
                </Box>
            </Stack>
        </>
    );
}

//TODO: use api to check user role
function getRole(id:string):string{
    return "teacher";
}