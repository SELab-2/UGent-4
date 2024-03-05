import { Header } from "../../components/Header";
import { Box, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ArchivedProjectsView} from "./ArchivedProjectsView.tsx";
import {ProjectsView} from "./ProjectsView.tsx";

interface SubjectsStudentProps {
    courseId: string;
}

export function SubjectsStudentPage({courseId}: SubjectsStudentProps) {
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Naam Vak"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                 nodes={[<ProjectsView courseId={courseId} isStudent={true} />,<ArchivedProjectsView/>]}/>
                </Box>
            </Stack>
        </>
    );
}