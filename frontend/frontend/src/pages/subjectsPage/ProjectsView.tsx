import {Box, Typography} from "@mui/material";
import List from '@mui/material/List';
import {t} from "i18next";
import { AssignmentListItemSubjectsPage } from "../subjectsPage/AssignmentListItemSubjectsPage";
import instance from "../../axiosConfig";
import { useState, useEffect } from "react";

interface ProjectStudent {
    assignment: any,
    group?: any,
    lastSubmission?: any,
    submissions?: any,
    score?: any,
}

export function ProjectsView({gebruiker, archived, assignments, deleteAssignment, archiveAssignment, changeVisibilityAssignment, courseId}) {
    const [projects, setProjects] = useState<ProjectStudent[]>([]);

    useEffect(() => {
        async function fetchGroup(assignment): Promise<ProjectStudent> {
            try {
                //TODO vul bij student gebruiker.user in
                const groupResponse = await instance.get(`/groepen/?project=${assignment.project_id.toString()}&student=6`);
                if(groupResponse.data.length == 0){
                    return {
                        assignment: assignment,
                    };
                }
                return {
                    assignment: assignment,
                    group: groupResponse.data[0],
                };
            } catch (error) {
                console.error("Error fetching data:", error);
                return {
                    assignment: assignment,
                };
            }
        }
        async function fetchSubmission(projectstudent: ProjectStudent): Promise<ProjectStudent> {
            if(!projectstudent.group){
                return projectstudent;
            }
            try {
                const submissionsResponse = await instance.get(`/indieningen/?groep=${projectstudent.group.groep_id.toString()}&project=${projectstudent.assignment.project_id.toString()}`);
                const lastSubmission = submissionsResponse.data[submissionsResponse.data.length - 1];
                return {
                    ...projectstudent,
                    lastSubmission: lastSubmission,
                    submissions: submissionsResponse.data.length,
                };
            } catch (e) {
                console.error("Error fetching data:", e);
                return projectstudent;
            }
        }
        async function fetchScore(projectstudent: ProjectStudent): Promise<ProjectStudent> {
            if(!projectstudent.group || !projectstudent.lastSubmission){
                return projectstudent;
            }
            try {
                const scoreResponse = await instance.get(`/scores/?indiening=${projectstudent.lastSubmission.indiening_id.toString()}`);
                return {
                    ...projectstudent,
                    score: scoreResponse.data[0],
                };
            } catch (e) {
                console.error("Error fetching data:", e);
                return projectstudent;
            }
        }

        async function fetchData() {
            try {
                const groupPromises = assignments.map((assignment) => fetchGroup(assignment));
                const groupArray = await Promise.all(groupPromises);

                const submissionPromises = groupArray.map((projectstudent) => fetchSubmission(projectstudent));
                const submissionArray = await Promise.all(submissionPromises);

                const scorePromises = submissionArray.map((projectstudent) => fetchScore(projectstudent));
                const scoreArray = await Promise.all(scorePromises);

                setProjects(scoreArray);
            } catch (e) {
                console.error("Error fetching all data:", e);
            }
        }
        fetchData();
    }, [assignments]);
    
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
                            {projects
                            .map((project, index) => ({...project, index}))
                            .filter((project) => project.assignment.gearchiveerd == archived)
                            .map((project) => 
                                <AssignmentListItemSubjectsPage key={project.assignment.project_id} projectName={project.assignment.titel}
                                    dueDate={new Date(project.assignment.deadline)} submissions={project.submissions}
                                    score={project.score} maxScore={Number(project.assignment.max_score)}
                                    isStudent={!gebruiker.is_lesgever} archived={archived} visible={project.assignment.zichtbaar}
                                    deleteEvent={() => deleteAssignment(project.index)}
                                    archiveEvent={() => archiveAssignment(project.index)}
                                    visibilityEvent={() => changeVisibilityAssignment(project.index)}
                                    courseId={courseId} assignmentId={project.assignment.project_id}/>
                            )}
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
