import { Header } from "../../components/Header";
import { Box, IconButton, Stack } from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ProjectsView} from "./ProjectsView.tsx";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";

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

export function SubjectsTeacherPage() {
    let { courseId } = useParams();
    courseId = String(courseId);

    const navigate = useNavigate();

    const addProject = () => {
        console.log("add project");
        navigate("/add_change_assignment");
    }

    const course = getCourse(courseId);
    
    const [assignments, setAssignments] = useState<Assignment[]>(course.assignments.map((assignmentId) => getAssignment(assignmentId)));

    const deleteAssignment = (index: number) => {
        setAssignments(assignments.filter((_, i) => i !== index));
    }
    const archiveAssignment = (index: number) => {
        const newAssignments = assignments.map((a, i) => i==index? archiveSingleAssignment(a): a);
        setAssignments(newAssignments);
    }
    
    return (
        <>
            <Stack direction={"column"} spacing={0} sx={{width:"99%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"editable"} title={"Naam Vak"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10 }}>
                    <TabSwitcher titles={["current_projects","archived"]}
                                 nodes={[<ProjectsView isStudent={false} archived={false} assignments={assignments}
                                    deleteAssignment={deleteAssignment} archiveAssignment={archiveAssignment}/>,
                                    <ProjectsView isStudent={false} archived={true} assignments={assignments}
                                    deleteAssignment={deleteAssignment} archiveAssignment={archiveAssignment}/>]}/>
                </Box>
                <Box display="flex" flexDirection="row-reverse" sx={{ width: '100%', height:"30%" }}>
                    <IconButton onClick={addProject} color="primary" edge="end" aria-label="add-project" >
                        <AddCircleIcon sx={{fontSize: 60, height: "100%"}} />
                    </IconButton>
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

function archiveSingleAssignment(assignment: Assignment): Assignment {
    return {
        id: assignment.id,
        name: assignment.name,
        deadline: assignment.deadline,
        submissions: assignment.submissions,
        score: assignment.score,
        visible: assignment.visible,
        archived: true,
    }
}