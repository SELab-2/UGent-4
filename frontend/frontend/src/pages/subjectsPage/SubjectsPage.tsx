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
    opgave_bestand: File | null,
    vak: number,
    max_score: number,
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
    const [assignments, setAssignments] = useState<any[]>([]);
    const [user, setUser] = useState({user: 0, is_lesgever: false, first_name: "", last_name: "", email: ""});

    useEffect(() => {
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
        fetchData();
    }, []);

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
    const doDelete = () => {
        setAssignments(assignments.filter((_, i) => i !== deleteIndex));
    }
    const archiveAssignment = (index: number) => {
        setArchiveIndex(index);
        setOpenArchivePopup(true);
    }
    const doArchive = () => {
        const newAssignments = assignments.map((a, i) => i==archiveIndex? archiveSingleAssignment(a): a);
        setAssignments(newAssignments);
    }
    const changeVisibilityAssignment = (index: number) => {
        const newAssignments = assignments.map((a, i) => i==index? changeVisibilitySingleAssignment(a): a);
        setAssignments(newAssignments);
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
                                        changeVisibilityAssignment={changeVisibilityAssignment}/>,
                                        <ProjectsView gebruiker={user} archived={true} assignments={assignments}
                                        deleteAssignment={deleteAssignment} archiveAssignment={archiveAssignment}
                                        changeVisibilityAssignment={changeVisibilityAssignment}/>]}/>
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
                                changeVisibilityAssignment={() => undefined}/>,
                                <ProjectsView gebruiker={user} archived={true} assignments={assignments}
                                deleteAssignment={() => undefined} archiveAssignment={() => undefined}
                                changeVisibilityAssignment={() => undefined}/>]}/>
                </Box>
            </Stack>
            }
        </>
        
    );
}

function archiveSingleAssignment(assignment: Project): Project {
    return {
        project_id: assignment.project_id,
        titel: assignment.titel,
        beschrijving: assignment.beschrijving,
        opgave_bestand: assignment.opgave_bestand,
        vak: assignment.vak,
        max_score: assignment.max_score,
        deadline: assignment.deadline,
        extra_deadline: assignment.extra_deadline,
        zichtbaar: assignment.zichtbaar,
        gearchiveerd: true,
    }
}

function changeVisibilitySingleAssignment(assignment: Project): Project {
    return {
        project_id: assignment.project_id,
        titel: assignment.titel,
        beschrijving: assignment.beschrijving,
        opgave_bestand: assignment.opgave_bestand,
        vak: assignment.vak,
        max_score: assignment.max_score,
        deadline: assignment.deadline,
        extra_deadline: assignment.extra_deadline,
        zichtbaar: !assignment.zichtbaar,
        gearchiveerd: assignment.gearchiveerd,
    }
}