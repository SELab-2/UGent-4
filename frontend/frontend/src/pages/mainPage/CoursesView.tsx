import {IconButton, Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../axiosConfig.ts";
import { useEffect, useState } from "react";
interface CourseCardProps {
    isStudent: boolean;
}

export function CoursesView({isStudent}: CourseCardProps) {
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/vakken/");
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }

        fetchData();
    }, []);
    return (
        <>
            <Stack flexDirection={{xs: "column-reverse", md: "row"}} minWidth={"500px"}>
                <Stack direction={"column"} spacing={1} width={"100%"} alignItems={'center'}>
                    <Stack flexDirection={"row"} flexWrap={"wrap"} width={'90%'}
                           sx={{
                               gap: 2,
                               overflowY: {md: "auto"},
                               maxHeight: "72svh",
                           }}>
                        <CourseCard courseId={"course1"} archived={false} isStudent={isStudent}/>
                        <CourseCard courseId={"course2"} archived={false} isStudent={false}/>
                        <CourseCard courseId={"course3"} archived={true} isStudent={isStudent}/>
                        <CourseCard courseId={"course3"} archived={true} isStudent={false}/>
                        {courses.map((course: any) => (
                        <CourseCard key={course.vak_id} courseId={course.vak_id} archived={false} isStudent={isStudent} />
                        // eerste dummy's tijdelijk houden (courses fetchen werkt nog niet)
                    ))}
                    </Stack>
                    {!isStudent &&
                        <Stack flexDirection={"row"} justifyContent={"end"} width={"100%"} padding={0}>
                            <IconButton color={"primary"} aria-label={'add-button'}>
                                <AddIcon fontSize={"large"}/>
                            </IconButton>
                        </Stack>}
                </Stack>
            </Stack>
        </>
    );
}
