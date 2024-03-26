import {IconButton, Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useEffect, useState } from "react";
interface CourseCardProps {
    isStudent: boolean;
}

export function CoursesView({isStudent}: CourseCardProps) {
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("https://sel2-4.ugent.be/api/vakken/");
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
                <Stack direction={"column"} spacing={1} width={"100%"}>
                    <Stack flexDirection={"row"} flexWrap={"wrap"} width={"100%"}
                           sx={{
                               overflowY: {sm: "auto"},
                               maxHeight: "65vh",
                           }}>
                        {courses.map((course: any) => (
                        <CourseCard key={course.vak_id} courseId={course.vak_id} archived={false} isStudent={isStudent} />
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
