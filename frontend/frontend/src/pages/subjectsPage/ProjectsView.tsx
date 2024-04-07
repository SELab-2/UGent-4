import {Box, Typography} from "@mui/material";
import List from '@mui/material/List';
import {t} from "i18next";
import {AssignmentListItemSubjectsPage} from "./AssignmentListItemSubjectsPage.tsx";

interface ProjectsViewProps {
    gebruiker: Gebruiker;
    archived: boolean;
    assignments: Project[];
    deleteAssignment: (index: number) => void;
    archiveAssignment: (index: number) => void;
    changeVisibilityAssignment: (index: number) => void;
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

export function ProjectsView({
                                 gebruiker,
                                 archived,
                                 assignments,
                                 deleteAssignment,
                                 archiveAssignment,
                                 changeVisibilityAssignment
                             }: ProjectsViewProps) {
    const groups = assignments.map((assignment) => getGroepVanStudentVoorProject(gebruiker.user, assignment.project_id));
    const submissions = groups.map((group) => getLaatseIndieningVanGroep(group.groep_id));
    const scores = submissions.map((submission) => getScoreVoorIndiening(submission.indiening_id));

    return (
        <>
            <Box aria-label={"courseHeader"}
                 sx={{
                     backgroundColor: "secondary.main",
                     margin: 0,
                     height: 50,
                     display: "flex",
                     flexDirection: "row",
                     justifyContent: "space-between",
                     padding: 3,
                 }}>
                {!gebruiker.is_lesgever ?
                    <>
                        <Typography variant={"h4"}>Project</Typography>
                        <Typography variant={"h4"}>Deadline</Typography>
                        <Typography variant={"h4"}>{t("submissions")}</Typography>
                        <Typography variant={"h4"}>Score</Typography>
                    </>
                    :
                    <>
                        <Typography variant={"h4"}>Project</Typography>
                        <Typography variant={"h4"}>Deadline</Typography>
                        <Typography variant={"h4"}>{t("edit")}</Typography>
                    </>
                }
            </Box>
            <Box aria-label={"assignmentList"}
                 sx={{
                     backgroundColor: "background.default",
                     height: 340,
                     display: "flex",
                     flexDirection: "column",
                     padding: 1,
                     borderRadius: 2,
                     paddingBottom: 0
                 }}>
                <Box display={"flex"} flexDirection={"row"}>
                    <Box sx={{width: "100%", height: 320, overflow: "auto"}}>
                        <List disablePadding={true}>
                            {assignments
                                .map((assignment, index) => ({...assignment, index}))
                                .filter((assignment) => assignment.gearchiveerd == archived)
                                .map((assignment) => (
                                    <AssignmentListItemSubjectsPage key={assignment.project_id}
                                                                    projectName={assignment.titel}
                                                                    dueDate={assignment.deadline}
                                                                    submission={submissions[assignment.index]}
                                                                    score={scores[assignment.index]}
                                                                    maxScore={assignment.max_score}
                                                                    isStudent={!gebruiker.is_lesgever}
                                                                    archived={archived} visible={assignment.zichtbaar}
                                                                    deleteEvent={() => deleteAssignment(assignment.index)}
                                                                    archiveEvent={() => archiveAssignment(assignment.index)}
                                                                    visibilityEvent={() => changeVisibilityAssignment(assignment.index)}/>
                                ))}
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

function getGroepVanStudentVoorProject(gebruikerId: number, projectId: number): Groep {
    return {
        groep_id: 0,
        studenten: [gebruikerId, 1, 2, 3],
        project: projectId,
    }
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