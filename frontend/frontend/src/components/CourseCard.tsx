import {Box, Card, CardContent, Typography} from "@mui/material";

interface CourseCardProps {
    courseId: string;
    archived: boolean;
}

interface Course {
    id: string;
    name: string;
    description: string;
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
}


export function CourseCard({courseId, archived}: CourseCardProps) {
    const course = getCourse(courseId)

    return (
        <>
            <Card
                 sx={{
                     width: 500,
                     backgroundColor: "background.default",
                     borderRadius:5,
                     elevation: 3,
                     padding:0,
                     margin:0,
                 }}
            >
                <CardContent sx={{margin:0,padding:0}}>
                    <Box aria-label={"courseHeader"}
                         sx={{backgroundColor: "secondary.main",
                             margin:0,
                             height: 75,
                             display: "flex",
                             flexDirection: "row",
                             justifyContent: "space-between",
                             padding:3,
                         }}>
                        <Box width={"50%"} height={"50%"} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                            <Typography variant={"h4"}>{course.name}</Typography>
                        </Box>
                    </Box>
                    <Box aria-label={"assignmentList"}
                         sx={{backgroundColor: "background.default",
                             height: 100,
                             display: "flex",
                             flexDirection: "row",
                             justifyContent: "space-between",
                             padding:3,
                         }}>

                    </Box>
                </CardContent>
            </Card>
        </>
    );
}

//TODO: use api to get data, for now use mock data
function getCourse(courseId: string): Course {
    return {
        id: courseId,
        name: "courseName",
        description: "courseDescription",
        teacher: "teacher",
        students: ["student1", "student2"],
        archived: false,
        assignments: ["assignment1", "assignment2"]
    }
}

function getAssignment(assignmentId: string): Assignment {
    return {
        id: assignmentId,
        name: "assignmentName",
        deadline: new Date()
    }
}