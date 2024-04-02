import {IconButton, Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";
import AddIcon from "@mui/icons-material/Add";
import course from "./MainPage.tsx";

interface CourseCardProps {
    isStudent: boolean;
    activecourses: course[];
}

export function CoursesView({isStudent, activecourses}: CourseCardProps) {

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
                        {activecourses.map((course: course) => (
                            <CourseCard key={course.vak_id} courseId={course.naam} archived={false}
                                        isStudent={isStudent}/>
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
