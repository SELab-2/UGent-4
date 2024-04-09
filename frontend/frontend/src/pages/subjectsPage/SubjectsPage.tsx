import { Header } from "../../components/Header";
import { Box, IconButton, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WarningPopup from "../../components/WarningPopup.tsx";
import {t, use} from "i18next";
import instance from "../../axiosConfig.ts";
import {useEffect, useState} from "react";


interface Project {
    project_id: number,
    titel: string,
    beschrijving: string,
    opgave_bestand: File,
    vak: number,
    max_score: number,
    max_groep_grootte: number,
    deadline: Date,
    extra_deadline: Date,
    zichtbaar: boolean,
    gearchiveerd: boolean,
}

export function SubjectsPage() {
    let { courseId } = useParams();
    courseId = String(courseId);

    const navigate = useNavigate();

    const [course, setCourse] = useState<any>(null);
    const [assignments, setAssignments] = useState<Project[]>([]);
    const [user, setUser] = useState({user: 0, is_lesgever: false, first_name: "", last_name: "", email: ""});

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const courseResponse = await instance.get(`/vakken/${courseId}/`);
            const assignmentsResponse = await instance.get(`/projecten/?vak=${courseId}`);
            setCourse(courseResponse.data);
            setAssignments(assignmentsResponse.data);
            
            const userResponse = await instance.get("/gebruikers/me/");
            setUser(userResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const addProject = () => {
        console.log("add project");
        navigate(`/course_teacher/${courseId}/assignment/edit/`);
    }    
    
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(0);
    const [openArchivePopup, setOpenArchivePopup] = useState(false);
    const [archiveIndex, setArchiveIndex] = useState(0);

    const deleteAssignment = (index: number) => {
        setDeleteIndex(index);
        setOpenDeletePopup(true);
    }
    const doDelete = async () => {
        //setAssignments(assignments.filter((_, i) => i !== deleteIndex));
        try {
            const deletedAssignment = assignments[deleteIndex];
            await instance.delete(`/projecten/${deletedAssignment.project_id}/`);
            await fetchData();
        } catch(error) {
            console.error("Error deleting data:", error);
        }
    }
    const archiveAssignment = (index: number) => {
        setArchiveIndex(index);
        setOpenArchivePopup(true);
    }
    const doArchive = async () => {
        //const newAssignments = assignments.map((a, i) => i==archiveIndex? archiveSingleAssignment(a): a);
        //setAssignments(newAssignments);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const assignment = assignments[archiveIndex];
            const archivedAssignment = archiveSingleAssignment(assignment);
            await instance.put(`/projecten/${assignment.project_id}/`, archivedAssignment, config).catch((error) => {
                console.error(error);
                console.log(error.response.data);
            });
            await fetchData();
        } catch(error) {
            console.error("Error updating data:", error);
        }
    }
    const changeVisibilityAssignment = async (index: number) => {
        //const newAssignments = assignments.map((a, i) => i==index? changeVisibilitySingleAssignment(a): a);
        //setAssignments(newAssignments);
        try {
            const changedVisibilityAssignment = changeVisibilitySingleAssignment(assignments[index]);
            await instance.put(`/projecten/${changedVisibilityAssignment.project_id}/`, changedVisibilityAssignment);
            await fetchData();
        } catch(error) {
            console.error("Error updating data:", error);
        }
    }
    
    if (!course) {
        return null;
    }

    return (
        <>
            {user.is_lesgever?
                <Stack direction={"column"} spacing={0} sx={{width:"99%" ,height:"100%", backgroundColor:"background.default"}}>
                    <Header variant={"editable"} title={course.naam} />
                    <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                        <TabSwitcher titles={["current_projects","archived"]}
                                    nodes={[<ProjectsView gebruiker={user} archived={false} assignments={assignments}
                                        deleteAssignment={deleteAssignment} archiveAssignment={archiveAssignment}
                                        changeVisibilityAssignment={changeVisibilityAssignment} courseId={courseId}/>,
                                        <ProjectsView gebruiker={user} archived={true} assignments={assignments}
                                        deleteAssignment={deleteAssignment} archiveAssignment={archiveAssignment}
                                        changeVisibilityAssignment={changeVisibilityAssignment} courseId={courseId}/>]}/>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" sx={{ width: '100%', height:"30%" }}>
                        <IconButton onClick={addProject} color="primary" edge="end" aria-label="add-project" >
                            <AddCircleIcon sx={{fontSize: 60, height: "100%"}} />
                        </IconButton>
                    </Box>
                    <WarningPopup title={t("delete_project_warning")} content={t("cant_be_undone")}
                    buttonName={t("delete")} open={openDeletePopup} handleClose={() => setOpenDeletePopup(false)} doAction={doDelete}/>
                    <WarningPopup title={t("archive_project_warning")} content={t("cant_be_undone")}
                    buttonName={t("archive")} open={openArchivePopup} handleClose={() => setOpenArchivePopup(false)} doAction={doArchive}/>
                </Stack>
            :
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={course.naam} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                nodes={[<ProjectsView gebruiker={user} archived={false} assignments={assignments}
                                deleteAssignment={() => undefined} archiveAssignment={() => undefined}
                                changeVisibilityAssignment={() => undefined} courseId={courseId}/>,
                                <ProjectsView gebruiker={user} archived={true} assignments={assignments}
                                deleteAssignment={() => undefined} archiveAssignment={() => undefined}
                                changeVisibilityAssignment={() => undefined} courseId={courseId}/>]}/>
                </Box>
            </Stack>
            }
        </>
        
    );
}

function archiveSingleAssignment(assignment: Project): FormData {
    const formData = new FormData();
    formData.append('titel', assignment.titel);
    formData.append('beschrijving', assignment.beschrijving);

    //TODO upload correct file
    const blob = new Blob(["fileContent"], { type: 'text/plain' });
    const file = new File([blob], 'example.txt', { type: 'text/plain' });
    formData.append('opgave_bestand', file);
    
    formData.append('vak', assignment.vak.toString());
    formData.append('max_score', assignment.max_score.toString());
    formData.append('max_groep_grootte', assignment.max_groep_grootte.toString());
    if(assignment.deadline != null) formData.append('deadline', assignment.deadline.toString());
    if(assignment.extra_deadline != null) formData.append('extra_deadline', assignment.extra_deadline.toString());
    formData.append('zichtbaar', assignment.zichtbaar.toString());
    formData.append('gearchiveerd', "true");
    return formData;
}

function changeVisibilitySingleAssignment(assignment: Project): Project {
    return {
        ...assignment,
        zichtbaar: !assignment.zichtbaar,
    }
}
