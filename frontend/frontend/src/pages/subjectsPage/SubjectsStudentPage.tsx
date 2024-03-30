import { Header } from "../../components/Header";
import { Box, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { useParams } from "react-router-dom";

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

export function SubjectsStudentPage() {
    let { courseId } = useParams();
    courseId = String(courseId);

    const course = getCourse(courseId);
    
    const assignments = course.assignments.map((assignmentId) => getAssignment(assignmentId));
    
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Naam Vak"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                 nodes={[<ProjectsView isStudent={true} archived={false} assignments={assignments}
                                 deleteAssignment={() => undefined} archiveAssignment={() => undefined}
                                 changeVisibilityAssignment={() => undefined}/>,
                                 <ProjectsView isStudent={true} archived={true} assignments={assignments}
                                 deleteAssignment={() => undefined} archiveAssignment={() => undefined}
                                 changeVisibilityAssignment={() => undefined}/>]}/>
                </Box>
            </Stack>
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