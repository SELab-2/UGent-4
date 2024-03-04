import {Box, Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";

interface CourseCardProps {
    isStudent: boolean;
}
export function CoursesView({isStudent}: CourseCardProps) {
    //TODO: get courses from state
    const courses = getCourses();
    return (
        <>
            <Stack flexDirection={"row"}>
                <Stack flexDirection={"row"} flexWrap={"wrap"}>
                    <CourseCard courseId={"course1"} archived={false} isStudent={isStudent}/>
                    <CourseCard courseId={"course2"} archived={false} isStudent={false}/>
                    <CourseCard courseId={"course3"} archived={true} isStudent={isStudent}/>
                    <CourseCard courseId={"course3"} archived={true} isStudent={false}/>
                </Stack>
                <Box aria-label={"calendarView"}>

                </Box>
            </Stack>
        </>
    );
}

//fix courses with state
function getCourses():string[]{
    return []
}