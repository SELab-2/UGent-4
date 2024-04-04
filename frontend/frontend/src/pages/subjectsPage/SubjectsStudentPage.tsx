import { Header } from "../../components/Header";
import { Box, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { useParams } from "react-router-dom";
import instance from "../../axiosConfig.ts";
import {useEffect, useState} from "react";


export function SubjectsStudentPage() {
    let { courseId } = useParams();
    courseId = String(courseId);

    const [assignments, setAssignments] = useState([]);
    const [user, setUser] = useState({user: 0, is_lesgever: false, first_name: "", last_name: "", email: ""});

    useEffect(() => {
        async function fetchData() {
            try {
                const assignmentsResponse = await instance.get(`/projecten/?vak=${courseId}`);
                const userResponse = await instance.get("/gebruikers/me/");
    
                setAssignments(assignmentsResponse.data);
                setUser(userResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);
    
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Naam Vak"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                 nodes={[<ProjectsView gebruiker={user} archived={false} assignments={assignments}
                                 deleteAssignment={() => undefined} archiveAssignment={() => undefined}
                                 changeVisibilityAssignment={() => undefined}/>,
                                 <ProjectsView gebruiker={user} archived={true} assignments={assignments}
                                 deleteAssignment={() => undefined} archiveAssignment={() => undefined}
                                 changeVisibilityAssignment={() => undefined}/>]}/>
                </Box>
            </Stack>
        </>
    );
}
