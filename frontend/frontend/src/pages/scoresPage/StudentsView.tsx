import {Box, Typography, Divider} from "@mui/material";
import List from '@mui/material/List';
import { StudentScoreListItem } from "../../components/StudentScoreListItem.tsx";
import {t} from "i18next";

interface StudentsViewProps {
    projectId: number;
}

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

interface Groep {
    groep_id: number,
    studenten: number[],
    project: number,
}

interface Score {
    score_id: number,
    score: number,
    indiening: number,
}

interface Gebruiker {
    user: number,
    is_lesgever: boolean,
    first_name: string,
    last_name: string,
    email: string,
}

interface Indiening {
    indiening_id: number,
    groep: number,
    tijdstip: Date,
    status: boolean,
    indiening_bestanden: Bestand[],
 }

 interface Bestand {
    indiening_bestand_id: number,
    indiening: number,
    bestand: File | null,
 }

export function StudentsView({projectId}: StudentsViewProps) {   
    const project = getProject(projectId);
    const groepen = getGroepenVoorProject(projectId);
    const indieningen = groepen.map((groep) => getLaatseIndieningVanGroep(groep.groep_id));
    const scores = indieningen.map((indiening) => getScoreVoorIndiening(indiening.indiening_id));

    return (
        <>
            <Box aria-label={"scoresHeader"}
                sx={{backgroundColor: "background.default",
                    margin:0,
                    height: 20,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding:3,
                }}>
                <>
                    <Typography maxWidth={100}>{t("group")}</Typography>
                    <Typography maxWidth={100}>{t("time")}</Typography>
                    <Typography maxWidth={100}>Score</Typography>
                    <Typography maxWidth={100}>Download</Typography>
                </>
            </Box>
            <Divider color={"text.main"}></Divider>
            <Box aria-label={"studentList"}
                sx={{backgroundColor: "background.default",
                    height: 450,
                    display: "flex",
                    flexDirection: "column",
                    padding:1,
                    borderRadius:2,
                    paddingBottom:0
                }}>
                <Box display={"flex"} flexDirection={"row"}>
                    <Box sx={{width:"100%", height: 430, overflow:"auto"}}>
                        <List disablePadding={true}>
                            {groepen.map((groep, index) => (
                                <StudentScoreListItem key={groep.groep_id} groepName={String(groep.groep_id)}
                                submissionFiles={indieningen[index].indiening_bestanden} startScore={scores[index].score}
                                maxScore={project.max_score}/>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

//TODO: use api to get data, for now use mock data
function getProject(projectId: number): Project {
    return {
        project_id: projectId,
        titel: "courseName",
        beschrijving: "project beschrijving",
        opgave_bestand: null,
        vak: 0,
        max_score: 20,
        deadline: new Date(2022, 11, 17),
        extra_deadline: new Date(2022, 11, 17),
        zichtbaar: true,
        gearchiveerd: false,
    }
}

function getGroepenVoorProject(projectId: number): Groep[] {
    return [{
        groep_id: 0,
        studenten: [0, 1, 2, 3],
        project: projectId,
    },
    {
        groep_id: 1,
        studenten: [4, 5, 6, 7],
        project: projectId,
    },
    {
        groep_id: 2,
        studenten: [8, 9, 10, 11],
        project: projectId,
    },
    ]
}

function getLaatseIndieningVanGroep(groepId: number): Indiening {
    return {
        indiening_id: 0,
        groep: groepId,
        tijdstip: new Date(2022, 11, 17),
        status: true,
        indiening_bestanden: [
            {
                indiening_bestand_id: 0,
                indiening: 0,
                bestand: null,
            },
            {
                indiening_bestand_id: 1,
                indiening: 0,
                bestand: null,
            }
        ],
     }
}

function getScoreVoorIndiening(indieningId: number): Score {
    return {
        score_id: 0,
        score: 10,
        indiening: indieningId,
    }
}