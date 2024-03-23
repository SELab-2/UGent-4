import {Box, Typography} from "@mui/material";
import List from '@mui/material/List';
import {t} from "i18next";
import {AssignmentListItemSubjectsPage} from "../../components/AssignmentListItemSubjectsPage.tsx";
import { useState } from "react";

interface ProjectsViewProps {
    courseId: string;
    isStudent: boolean;
    archived: boolean;
}

interface Course {
    id: string;
    name: string;
    teacher: string;
    students: string[];
    //list of assignment ids
    assignments: string[];
    archived: boolean;
}

interface Assignment {
    id: string;
    name: string;
    deadline?: Date;
    submissions: number;
    score: number;
    visible: boolean;
    archived: boolean;
}

export function ProjectsView({courseId, isStudent, archived}: ProjectsViewProps) {
    const course = getCourse(courseId);
    const assignmentsTemp = course.assignments.map((assignmentId) => getAssignment(assignmentId));
    
    const [assignments, setAssignments] = useState<Assignment[]>(assignmentsTemp.filter((assignment) => !assignment.archived));
    const [archivedAssignments, setArchivedAssignments] = useState<Assignment[]>(assignmentsTemp.filter((assignment) => assignment.archived));

    const deleteAssignment = (index: number) => {
        setAssignments(assignments.filter((_, i) => i !== index));
    }
    const deleteArchivedAssignment = (index: number) => {
        setArchivedAssignments(archivedAssignments.filter((_, i) => i !== index));
    }
    const archiveAssignment = (index: number) => {
        setArchivedAssignments([...archivedAssignments, assignments[index]]);
        deleteAssignment(index);
    }

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
                {isStudent?
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
                            {!archived?
                                assignments
                                .map((assignment, index) => (
                                    <AssignmentListItemSubjectsPage key={assignment.id} projectName={assignment.name}
                                        dueDate={assignment.deadline} submissions={assignment.submissions} score={assignment.score}
                                        isStudent={isStudent} archived={assignment.archived} visible={assignment.visible}
                                        deleteEvent={() => deleteAssignment(index)}
                                        archiveEvent={() => archiveAssignment(index)}/>
                                ))
                                :
                                archivedAssignments
                                .map((assignment, index) => (
                                    <AssignmentListItemSubjectsPage key={assignment.id} projectName={assignment.name}
                                        dueDate={assignment.deadline} submissions={assignment.submissions} score={assignment.score}
                                        isStudent={isStudent} archived={assignment.archived} visible={assignment.visible}
                                        deleteEvent={() => deleteArchivedAssignment(index)}
                                        archiveEvent={() => archiveAssignment(index)}/>
                                ))
                            }
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

//TODO: use api to get data, for now use mock data
function getCourse(courseId: string): Course {
    return {
        id: courseId,
        name: "courseName",
        teacher: "teacher",
        students: ["student1", "student2"],
        archived: false,
        assignments: ["assignment1", "assignment2", "assignment3", "assignment4", "assignment5", "assignment6", "assignment7", "assignment8", "assignment9"]
    }
}

function getAssignment(assignmentId: string): Assignment {
    return {
        id: assignmentId,
        name: assignmentId,
        deadline: new Date(2022, 11, 17),
        submissions: 2,
        score: 10,
        visible: true,
        archived: Number(assignmentId.slice(-1))%2==0,
    }
}