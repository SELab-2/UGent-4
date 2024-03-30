import { Header } from "../../components/Header";
import { Box, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { useParams } from "react-router-dom";

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

export function SubjectsStudentPage() {
    let { courseId } = useParams();
    courseId = String(courseId);

    const course = getVak(Number(courseId));
    
    const assignments = getProjectenVoorVak(course.vak_id);

    const user = getGebruiker();
    
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
        is_lesgever: false,
        first_name: "flinke",
        last_name: "student",
        email: "flinke.student@ugent.be",
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