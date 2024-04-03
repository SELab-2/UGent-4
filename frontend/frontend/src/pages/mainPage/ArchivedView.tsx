import {Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";
import course from "./MainPage.tsx";

interface CourseCardProps {
    isStudent: boolean;
    archivedCourses: course[];
}

export function ArchivedView({isStudent, archivedCourses}: CourseCardProps) {
    //TODO: get courses from state
    return (
        <>
            <Stack flexDirection={{xs: "column-reverse", md: "row"}} minWidth={{md: "60svw", lg: '75svw'}}>
                <Stack direction={"column"} spacing={1} width={"100%"} alignItems={'center'}>
                    <Stack flexDirection={"row"} flexWrap={"wrap"} width={{xs: '100%', md: "90%"}}
                           sx={{
                               gap: 2,
                               overflowY: {sm: "auto"},
                               maxHeight: "78svh",
                           }}>
                        {archivedCourses.map((course) => {
                            return <CourseCard courseId={course.vak_id.toString()} archived={true}
                                               isStudent={isStudent}/>
                        })}
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
}