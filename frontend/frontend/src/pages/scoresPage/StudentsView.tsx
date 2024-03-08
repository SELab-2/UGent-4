import {Box, Typography, Divider} from "@mui/material";
import List from '@mui/material/List';
import { StudentScoreListItem } from "../../components/StudentScoreListItem.tsx";

interface StudentsViewProps {
    projectId: string;
}

interface Assignment {
    id: string;
    name: string;
    teacher: string;
    //list of student ids
    students: string[];
}

interface Student {
    id: string;
    name: string;
}

interface StudentProject {
    id: string;
    studentId: string;
    submissions: string[];
}

interface Submission {
    id: string;
    file: string;
}

export function StudentsView({projectId}: StudentsViewProps) {   
    const project = getProject(projectId);
    const students = project.students.map((studentProjectId) => getStudentOnProject(studentProjectId));

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
                    <Typography maxWidth={100}>Student</Typography>
                    <Typography maxWidth={100}>Time</Typography>
                    <Typography maxWidth={100}>Score</Typography>
                    <Typography maxWidth={100}>Download</Typography>
                </>
            </Box>
            <Divider color={"text.main"}></Divider>
            <Box aria-label={"studentList"}
                sx={{backgroundColor: "background.default",
                    height: 500,
                    display: "flex",
                    flexDirection: "column",
                    padding:1,
                    borderRadius:2,
                    paddingBottom:0
                }}>
                <Box display={"flex"} flexDirection={"row"}>
                    <Box sx={{width:"100%", height: 480, overflow:"auto"}}>
                        <List disablePadding={true}>
                            {students.map((studentOnProject) => (
                                <StudentScoreListItem key={studentOnProject.id} studentName={getStudent(studentOnProject.studentId).name} submissionFiles={studentOnProject.submissions.map((submissionId) => getSubmission(submissionId).file)}/>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

//TODO: use api to get data, for now use mock data
function getProject(projectId: string): Assignment {
    return {
        id: projectId,
        name: "courseName",
        teacher: "teacher",
        students: ["student1", "student2", "student3"],
    }
}

function getStudentOnProject(studentProjectId: string): StudentProject {
    return {
        id: studentProjectId,
        studentId: "student",
        submissions: ["submission1", "submission2"],
    }
}

function getStudent(studentId: string): Student {
    return {
        id: studentId,
        name: "studentName",
    }
}

function getSubmission(submissionId: string): Submission {
    return {
        id: submissionId,
        file: "file",
    }
}