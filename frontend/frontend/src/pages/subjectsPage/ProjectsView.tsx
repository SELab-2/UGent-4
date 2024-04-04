import {Box, Typography} from "@mui/material";
import List from '@mui/material/List';
import {t} from "i18next";
import { AssignmentListItemSubjectsPage } from "../subjectsPage/AssignmentListItemSubjectsPage";
import instance from "../../axiosConfig";
import { useState, useEffect } from "react";

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

/*interface Groep {
    groep_id: number,
    studenten: number[],
    project: number,
}*/

/*interface Score {
    score_id: number,
    score: number,
    indiening: number,
}*/

interface Gebruiker {
    user: number,
    is_lesgever: boolean,
    first_name: string,
    last_name: string,
    email: string,
}

/*interface Indiening {
    indiening_id: number,
    groep: number,
    tijdstip: Date,
    status: boolean,
    indiening_bestanden: Bestand[],
 }*/

 /*interface Bestand {
    indiening_bestand_id: number,
    indiening: number,
    bestand: File | null,
 }*/

export function ProjectsView({gebruiker, archived, assignments, deleteAssignment, archiveAssignment, changeVisibilityAssignment}: ProjectsViewProps) {
    const [groups, setGroups] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [scores, setScores] = useState<any[]>([]);

    useEffect(() => {
        async function fetchGroup(projectId: String) {
            try {
                const groupResponse = await instance.get(`/groepen/?project=${projectId}`);
                return groupResponse.data;
            } catch (error) {
                console.error("Error fetching data:", error);
                return [];
            }
        }
        async function fetchSubmission(groupId: String) {
            try {
                const submissionsResponse = await instance.get(`/indieningen/?groep=${groupId}`);
                const lastSubmission = submissionsResponse.data[submissionsResponse.data.length - 1];
                return lastSubmission;
            } catch (e) {
                console.error("Error fetching data:", e);
                return [];
            }
        }
        async function fetchScore(submissionId: String){
            try {
                const scoreResponse = await instance.get(`/scores/?indiening=${submissionId}`);
                return scoreResponse.data
            } catch (e) {
                console.error("Error fetching data:", e);
                return [];
            }
        }

        async function fetchData() {
            try {
                const filteredGroupsPromises = assignments.map((assignment) => fetchGroup(assignment.project_id.toString()));
                const filteredGroupsArray = await Promise.all(filteredGroupsPromises);
                const allGroups = filteredGroupsArray.flat();
                setGroups(allGroups);
            
                const submissionPromises = groups.map((group) => fetchSubmission(group.groep_id.toString()));
                const submissionsArray = await Promise.all(submissionPromises);
                setSubmissions(submissionsArray);
                
                const scorePromises = submissions.map((submission) => fetchScore(submission.indiening_id.toString()));
                const scoresArray = await Promise.all(scorePromises);
                setScores(scoresArray);
            } catch (e) {
                console.error("Error fetching all data:", e);
            }
        }
        fetchData();
    }, [assignments, submissions, scores]);
    
    return (
        <>
            <Box aria-label={"courseHeader"}
                sx={{backgroundColor: "secondary.main",
                    margin:0,
                    height: 50,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding:3,
                }}>
                {!gebruiker.is_lesgever?
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
                sx={{backgroundColor: "background.default",
                    height: 340,
                    display: "flex",
                    flexDirection: "column",
                    padding:1,
                    borderRadius:2,
                    paddingBottom:0
                }}>
                <Box display={"flex"} flexDirection={"row"}>
                    <Box sx={{width:"100%", height: 320, overflow:"auto"}}>
                        <List disablePadding={true}>
                            {assignments
                            .map((assignment, index) => ({...assignment, index}))
                            .filter((assignment) => assignment.gearchiveerd == archived)
                            .map((assignment) => {
                                const submission = submissions[assignment.index];
                                const score = scores[assignment.index];
                                return (
                                <AssignmentListItemSubjectsPage key={assignment.project_id} projectName={assignment.titel}
                                        dueDate={new Date(assignment.deadline)} submission={submission}
                                        score={score} maxScore={Number(assignment.max_score)}
                                        isStudent={!gebruiker.is_lesgever} archived={archived} visible={assignment.zichtbaar}
                                        deleteEvent={() => deleteAssignment(assignment.index)}
                                        archiveEvent={() => archiveAssignment(assignment.index)}
                                        visibilityEvent={() => changeVisibilityAssignment(assignment.index)}/>
                            )})}
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
