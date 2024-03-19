import { Header } from "../../components/Header";
import { Box, IconButton, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { redirect, useNavigate, useParams } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export function SubjectsTeacherPage() {
    let { courseId } = useParams();
    courseId = String(courseId);

    const navigate = useNavigate();

    const addProject = () => {
        console.log("add project");
        navigate("/add_change_assignment");
    }

    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"editable"} title={"Naam Vak"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                 nodes={[<ProjectsView courseId={courseId} isStudent={false} archived={false} />,
                                 <ProjectsView courseId={courseId} isStudent={false} archived={true} />]}/>
                </Box>
                <Box display="flex" flexDirection="row-reverse" sx={{ width: '100%', height:"30%" }}>
                    <IconButton onClick={addProject} color="primary" edge="end" aria-label="add-project" >
                        <AddCircleIcon sx={{fontSize: 60, height: "100%"}} />
                    </IconButton>
                </Box>
            </Stack>
        </>
    );
}