import { Header } from "../../components/Header";
import { Box, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ArchivedProjectsView} from "./ArchivedProjectsView.tsx";
import {ProjectsView} from "./ProjectsView.tsx";

export function SubjectsStudentPage() {
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Naam Vak"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                 nodes={[<ProjectsView />,<ArchivedProjectsView/>]}/>
                </Box>
            </Stack>
        </>
    );
}