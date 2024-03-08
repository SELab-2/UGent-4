import {Box, Card, CardActionArea, CardContent, Divider, IconButton, Typography} from "@mui/material";
import {t} from "i18next";
import List from '@mui/material/List';
import {AssignmentListItem} from "./AssignmentListItem";
import {useNavigate} from "react-router-dom";
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
/*
* CourseCard component displays a card with course information and a list of assignments
* @param courseId: string, the id of the course
* @param archived: boolean, whether the course is archived
* @param isStudent: boolean, whether the user is a student
*/

//TODO: fix archived with state so that the card moves to ArchivedView when archived

interface CourseCardProps {
    courseId: string;
    archived: boolean;
    isStudent: boolean;
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
}

export function CourseCard({courseId, archived, isStudent}: CourseCardProps) {
    const course = getCourse(courseId)
    const assignments = course.assignments.map((assignmentId) => getAssignment(assignmentId))
    const navigate = useNavigate();

    const handleCardClick = () => {
        console.log("Card clicked");
        navigate(`/${courseId}`);
    }

    const archive = () => {
        console.log("Archive clicked");
        //update db
    }

    return (
        <>
            <Card elevation={1}
                  sx={{
                      width: {xs: "100%", md: "60%"},
                      minWidth: 300,
                      maxWidth: 420,
                      backgroundColor: "background.default",
                      borderRadius: 5,
                      padding: 0,
                      margin: 2,
                  }}
            >
                <CardContent sx={{margin: 0, padding: 0}}>
                    <CardActionArea onClick={handleCardClick}>
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
                            <Box width={"50%"} height={"100%"} display={"flex"} flexDirection={"column"}
                                 justifyContent={"center"}>
                                <Typography variant={"h4"}>{course.name}</Typography>
                                <Typography variant={"subtitle1"}>{course.teacher}</Typography>
                            </Box>
                            <Box>
                                <Typography variant={"subtitle1"}>{t("students")}{course.students.length}</Typography>
                            </Box>
                        </Box>
                    </CardActionArea>
                    <Box aria-label={"assignmentList"}
                         sx={{
                             backgroundColor: "background.default",
                             height: 150,
                             display: "flex",
                             flexDirection: "column",
                             padding: 1,
                             borderRadius: 2,
                             paddingBottom: 0
                         }}>
                        {isStudent ?
                            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                                <Typography width={30}>Project</Typography>
                                <Typography width={30}>Deadline</Typography>
                                <Typography width={30}>Status</Typography>
                            </Box> :
                            <>
                                {archived ?
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3}
                                         pr={3} width={{xs: "81%", sm: "85%"}}>
                                        <Typography maxWidth={100}>Project</Typography>
                                        <Typography minWidth={50}>Deadline</Typography>
                                    </Box>
                                    :
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3}
                                         pr={3} width={{xs: "71%", sm: "75%"}}>
                                        <Typography maxWidth={100}>Project</Typography>
                                        <Typography minWidth={50}>Deadline</Typography>
                                    </Box>
                                }</>
                        }
                        <Divider color={"text.main"}></Divider>
                        <Box display={"flex"} flexDirection={"row"}>
                            {isStudent ?
                                <Box sx={{width: "100%", height: 130, overflow: "auto"}}>
                                    <List disablePadding={true}>
                                        {assignments.map((assignment) => (
                                            <AssignmentListItem key={assignment.id} id={assignment.id}
                                                                projectName={assignment.name}
                                                                dueDate={assignment.deadline}
                                                                status={assignment.id === "assignment1"}
                                                                isStudent={isStudent}/>
                                        ))}
                                    </List>
                                </Box> :
                                <>{!archived ?
                                    <Box sx={{width: "90%", height: 130}}>
                                        <List disablePadding={true}>
                                            {assignments.map((assignment) => (
                                                <AssignmentListItem key={assignment.id} id={assignment.id}
                                                                    projectName={assignment.name}
                                                                    dueDate={assignment.deadline}
                                                                    status={assignment.id === "assignment1"}
                                                                    isStudent={isStudent}/>
                                            ))}
                                        </List>
                                    </Box> :
                                    <Box sx={{width: "100%", height: 130}}>
                                        <List disablePadding={true}>
                                            {assignments.map((assignment) => (
                                                <AssignmentListItem key={assignment.id} id={assignment.id}
                                                                    projectName={assignment.name}
                                                                    dueDate={assignment.deadline}
                                                                    status={assignment.id === "assignment1"}
                                                                    isStudent={isStudent}/>
                                            ))}
                                        </List>
                                    </Box>
                                }
                                    {!archived &&
                                        <Box display={"flex"} flexDirection={"column"} paddingRight={1}
                                             sx={{flexGrow: 1, alignItems: "flex-end", alignSelf: "flex-end"}}>
                                            <IconButton onClick={archive}
                                                        sx={{
                                                            backgroundColor: "secondary.main",
                                                            borderRadius: 2,
                                                            alignSelf: "flex-end"
                                                        }}><ArchiveOutlinedIcon/></IconButton>
                                        </Box>}
                                </>
                            }
                        </Box>
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
        deadline: new Date(2022, 11, 17)
    }
}