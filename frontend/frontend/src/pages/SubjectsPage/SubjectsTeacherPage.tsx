import { Header } from "../../components/Header";
import { Box, Button, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { useParams } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export function SubjectsTeacherPage() {
    let { courseId } = useParams();
    courseId = String(courseId);
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Naam Vak"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                 nodes={[<ProjectsView courseId={courseId} isStudent={false} archived={false} />,
                                 <ProjectsView courseId={courseId} isStudent={false} archived={true} />]}/>
                </Box>
                <Box display="flex" flexDirection="row-reverse" sx={{ width: '100%', height:"auto" }}>
                    <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />}/>
                </Box>
            </Stack>
        </>
    );
}