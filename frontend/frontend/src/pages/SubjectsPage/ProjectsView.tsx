import {Box, Typography} from "@mui/material";
import List from '@mui/material/List';
import {AssignmentListItemSubjectsPage} from "../../components/AssignmentListItemSubjectsPage.tsx";

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
    const assignments = course.assignments.map((assignmentId) => getAssignment(assignmentId));

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
                        <Typography variant={"h4"}>Submissions</Typography>
                        <Typography variant={"h4"}>Score</Typography>
                    </>
                    :
                    <>
                        <Typography variant={"h4"}>Project</Typography>
                        <Typography variant={"h4"}>Deadline</Typography>
                        <Typography variant={"h4"}>Edit</Typography>
                    </>
                }
            </Box>
            <Box aria-label={"assignmentList"}
                sx={{backgroundColor: "background.default",
                    height: 400,
                    display: "flex",
                    flexDirection: "column",
                    padding:1,
                    borderRadius:2,
                    paddingBottom:0
                }}>
                <Box display={"flex"} flexDirection={"row"}>
                    <Box sx={{width:"100%", height: 380, overflow:"auto"}}>
                        <List disablePadding={true}>
                            {assignments.filter((assignment) => assignment.archived == archived)
                            .map((assignment) => (
                                <AssignmentListItemSubjectsPage key={assignment.id} projectName={assignment.name} dueDate={assignment.deadline} submissions={assignment.submissions} score={assignment.score} isStudent={isStudent} visible={assignment.visible}/>
                            ))}
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
        name: "assignmentName",
        deadline: new Date(2022, 11, 17),
        submissions: 2,
        score: 10,
        visible: true,
        archived: false,
    }
}