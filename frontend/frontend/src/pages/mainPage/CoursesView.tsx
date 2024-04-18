import {IconButton, Stack} from "@mui/material";
import {CourseCard} from "../../components/CourseCard.tsx";
import AddIcon from "@mui/icons-material/Add";
import course from "./MainPage.tsx";
import {useNavigate} from "react-router-dom";

interface CourseCardProps {
    isStudent: boolean;
    activecourses: course[];
}

export function CoursesView({isStudent, activecourses}: CourseCardProps) {
    const navigate = useNavigate();

    return (
        <>
            <Stack flexDirection={{xs: "column-reverse", md: "row"}} minWidth={{md: "60svw", lg: '69svw'}}>
                <Stack direction={"column"} spacing={1} width={"100%"} alignItems={'center'}>
                    <Stack flexDirection={"row"} flexWrap={"wrap"} width={'90%'}
                           sx={{
                               gap: 2,
                               overflowY: {md: "auto"},
                               maxHeight: "72svh",
                           }}>
                        {/* Map the list of the cirrent courses to CourseCards.
                        A CourseCard displays brief information about the course such as the title, deadlines, ...*/}
                        {activecourses.map((course: course) => (
                            <CourseCard key={course.naam} courseId={course.vak_id.toString()} archived={false}
                                        isStudent={isStudent}/>
                        ))}
                    </Stack>
                    {!isStudent &&
                        <Stack flexDirection={"row"} justifyContent={"end"} width={"100%"} padding={0}>
                            {/* Teachers get an extra button to add courses. */}
                            <IconButton color={"primary"} aria-label={'add-button'}
                                        onClick={() => navigate('/course/edit')}>
                                <AddIcon fontSize={"large"}/>
                            </IconButton>
                        </Stack>}
                </Stack>
            </Stack>
        </>
    );
}
