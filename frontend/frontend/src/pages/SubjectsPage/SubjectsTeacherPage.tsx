import { Header } from "../../components/Header";
import { Box, IconButton, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";

interface Vak {
    vak_id: number,
    naam: string,
    studenten: number[],
    lesgevers: number[],
}

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

interface Gebruiker {
    user: number,
    is_lesgever: boolean,
    first_name: string,
    last_name: string,
    email: string,
}

export function SubjectsTeacherPage() {
    let { courseId } = useParams();
    courseId = String(courseId);

    const navigate = useNavigate();

    const addProject = () => {
        console.log("add project");
        navigate("/add_change_assignment");
    }

    const course = getVak(Number(courseId));
    
    const [assignments, setAssignments] = useState<Project[]>(getProjectenVoorVak(course.vak_id));

    const user = getGebruiker();

    const deleteAssignment = (index: number) => {
        setAssignments(assignments.filter((_, i) => i !== index));
    }
    const archiveAssignment = (index: number) => {
        const newAssignments = assignments.map((a, i) => i==index? archiveSingleAssignment(a): a);
        setAssignments(newAssignments);
    }
    const changeVisibilityAssignment = (index: number) => {
        const newAssignments = assignments.map((a, i) => i==index? changeVisibilitySingleAssignment(a): a);
        setAssignments(newAssignments);
    }
    
    return (
        <>
            <Stack direction={"column"} spacing={0} sx={{width:"99%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"editable"} title={"Naam Vak"} />
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
            </Stack>
        </>
    );
}

//TODO: use api to get data, for now use mock data
function getVak(courseId: number): Vak {
    return {
        vak_id: courseId,
        naam: "courseName",
        studenten: [0, 1, 2, 3],
        lesgevers: [0, 1],
    }
}

function getGebruiker(): Gebruiker {
    return {
        user: 0,
        is_lesgever: true,
        first_name: "goede",
        last_name: "leerkracht",
        email: "goede.leerkracht@ugent.be",
    }
}

function getProjectenVoorVak(courseId: number): Project[] {
    return [{
        project_id: 0,
        titel: "project 1",
        beschrijving: "eerste project",
        opgave_bestand: null,
        vak: courseId,
        max_score: 10,
        deadline: new Date(2022, 11, 17),
        extra_deadline: new Date(2022, 11, 17),
        zichtbaar: true,
        gearchiveerd: false,
    },
    {
        project_id: 1,
        titel: "project 2",
        beschrijving: "tweede project",
        opgave_bestand: null,
        vak: courseId,
        max_score: 20,
        deadline: new Date(2022, 11, 17),
        extra_deadline: new Date(2022, 11, 17),
        zichtbaar: true,
        gearchiveerd: false,
    },
    {
        project_id: 2,
        titel: "project 3",
        beschrijving: "derde project",
        opgave_bestand: null,
        vak: courseId,
        max_score: 20,
        deadline: new Date(2022, 11, 17),
        extra_deadline: new Date(2022, 11, 17),
        zichtbaar: true,
        gearchiveerd: false,
    },
    {
        project_id: 3,
        titel: "project 4",
        beschrijving: "project",
        opgave_bestand: null,
        vak: courseId,
        max_score: 20,
        deadline: new Date(2022, 11, 17),
        extra_deadline: new Date(2022, 11, 17),
        zichtbaar: true,
        gearchiveerd: false,
    },
    {
        project_id: 4,
        titel: "project 5",
        beschrijving: "project",
        opgave_bestand: null,
        vak: courseId,
        max_score: 20,
        deadline: new Date(2022, 11, 17),
        extra_deadline: new Date(2022, 11, 17),
        zichtbaar: true,
        gearchiveerd: false,
    },
    {
        project_id: 5,
        titel: "project 6",
        beschrijving: "project",
        opgave_bestand: null,
        vak: courseId,
        max_score: 20,
        deadline: new Date(2022, 11, 17),
        extra_deadline: new Date(2022, 11, 17),
        zichtbaar: true,
        gearchiveerd: false,
    }]
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