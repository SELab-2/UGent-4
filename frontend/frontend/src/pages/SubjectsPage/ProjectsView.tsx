import {Box, Typography} from "@mui/material";
import List from '@mui/material/List';
import {t} from "i18next";
import {AssignmentListItemSubjectsPage} from "../../components/AssignmentListItemSubjectsPage.tsx";

interface ProjectsViewProps {
    isStudent: boolean;
    archived: boolean;
    assignments: Assignment[];
    deleteAssignment: (index: number) => void;
    archiveAssignment: (index: number) => void;
    archivedAssignments: Assignment[];
    deleteArchivedAssignment: (index: number) => void;
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

export function ProjectsView({isStudent, archived, assignments, deleteAssignment, archiveAssignment, archivedAssignments, deleteArchivedAssignment}: ProjectsViewProps) {
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
                                        isStudent={isStudent} archived={archived} visible={assignment.visible}
                                        deleteEvent={() => deleteAssignment(index)}
                                        archiveEvent={() => archiveAssignment(index)}/>
                                ))
                                :
                                archivedAssignments
                                .map((assignment, index) => (
                                    <AssignmentListItemSubjectsPage key={assignment.id} projectName={assignment.name}
                                        dueDate={assignment.deadline} submissions={assignment.submissions} score={assignment.score}
                                        isStudent={isStudent} archived={archived} visible={assignment.visible}
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