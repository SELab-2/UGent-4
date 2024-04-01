import {IconButton, Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";
import AddIcon from "@mui/icons-material/Add";

interface CourseCardProps {
    isStudent: boolean;
}

export function CoursesView({isStudent}: CourseCardProps) {
    //TODO: get courses from state
    const courses = getCourses();
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

//fix courses with state
function getCourses(): string[] {
    return []
}