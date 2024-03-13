import {Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";

interface CourseCardProps {
    isStudent: boolean;
}

export function ArchivedView({isStudent}: CourseCardProps) {
    //TODO: get courses from state
    const courses = getCourses();
    return (
        <>
            <Stack flexDirection={{xs: "column-reverse", md: "row"}} minWidth={"500px"}>
                <Stack flexDirection={"row"} flexWrap={"wrap"} width={"100%"}
                       sx={{
                           overflowY: {sm: "auto"},
                           maxHeight: "78vh",
                       }}>
                    <CourseCard courseId={"course1"} archived={false} isStudent={isStudent}/>
                    <CourseCard courseId={"course2"} archived={false} isStudent={false}/>
                    <CourseCard courseId={"course3"} archived={true} isStudent={isStudent}/>
                    <CourseCard courseId={"course3"} archived={true} isStudent={false}/>
                </Stack>
            </Stack>
        </>
    );
}

//fix courses with state
function getCourses(): string[] {
    return []
}