import {Box, Card, CardActionArea, CardContent, Divider, IconButton, Typography} from "@mui/material";
import {t} from "i18next";
import List from '@mui/material/List';
import {AssignmentListItem} from "./AssignmentListItem";
import {useNavigate} from "react-router-dom";
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { useState, useEffect } from "react";
import axios from "axios";
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
    const [course, setCourse] = useState<Course | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`https://sel2-4.ugent.be/api/vakken/${courseId}`);
                setCourse(response.data);
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        const fetchAssignments = async () => {
            try {
                const assignmentPromises = course?.assignments.map(async (assignmentId: string) => {
                    const response = await axios.get(`https://sel2-4.ugent.be/api/projecten/${assignmentId}`);
                    return response.data;
                });

                const assignmentData = await Promise.all(assignmentPromises || []);
                setAssignments(assignmentData);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchCourse();
    }, [courseId]);

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
            {course && (
                <Card elevation={1} sx={{ width: { xs: "100%", md: "60%" }, minWidth: 350, maxWidth: 420, backgroundColor: "background.default", borderRadius: 5, padding: 0, margin: 1 }}>
                    <CardContent sx={{ margin: 0, padding: 0 }}>
                        <CardActionArea onClick={handleCardClick}>
                            <Box aria-label={"courseHeader"} sx={{ backgroundColor: "secondary.main", margin: 0, height: 50, display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 3 }}>
                                <Box width={"50%"} height={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                                    <Typography variant={"h4"}>{course.name}</Typography>
                                    <Typography variant={"subtitle1"}>{course.teacher}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant={"subtitle1"}>{t("students")}{course.students.length}</Typography>
                                </Box>
                            </Box>
                        </CardActionArea>
                        <Box aria-label={"assignmentList"} sx={{ backgroundColor: "background.default", height: 150, display: "flex", flexDirection: "column", padding: 1, borderRadius: 2, paddingBottom: 0 }}>
                            {/* Assignment list rendering */}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
