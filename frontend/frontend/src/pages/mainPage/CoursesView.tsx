import { IconButton, Stack, Tooltip } from '@mui/material'
import { CourseCard } from '../../components/CourseCard.tsx'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Course } from './MainPage.tsx'

interface CourseCardProps {
    userid: number
    isStudent: boolean
    activecourses: Course[]
    pinnedCourses: number[]
    archiveCourse: (courseId: number) => void
    pinCourse: (courseId: number) => void
}

export function CoursesView({
    userid,
    isStudent,
    activecourses,
    pinnedCourses,
    archiveCourse,
    pinCourse,
}: CourseCardProps) {
    const navigate = useNavigate()

    return (
        <>
            <Stack
                flexDirection={{ xs: 'column-reverse', md: 'row' }}
                width={'100%'}
            >
                <Stack
                    direction={'column'}
                    width={'100%'}
                    alignItems={'flex-start'}
                >
                    <Stack
                        flexDirection={'row'}
                        flexWrap={'wrap'}
                        width={'95%'}
                        sx={{
                            gap: 1,
                            overflowY: 'auto',
                            maxHeight: '72svh',
                        }}
                    >
                        {/* Map the list of the current courses to CourseCards.
                        A CourseCard displays brief information about the course such as the title, deadlines, ...*/}
                        {activecourses.map((course: Course) => (
                            <CourseCard
                                userid={userid}
                                key={course.naam}
                                courseId={course.vak_id.toString()}
                                archived={false}
                                isStudent={isStudent}
                                archiveEvent={() =>
                                    archiveCourse(course.vak_id)
                                }
                                pinned={pinnedCourses.includes(course.vak_id)}
                                pinEvent={() => pinCourse(course.vak_id)}
                            />
                        ))}
                    </Stack>
                    {!isStudent && (
                        <Stack
                            flexDirection={'row'}
                            justifyContent={'end'}
                            width={'100%'}
                            padding={0}
                        >
                            {/* Teachers get an extra button to add courses. */}
                            <Tooltip title={'Add course'} placement={'top'}>
                                <IconButton
                                    id='addCourse'
                                    color={'primary'}
                                    aria-label={'add-button'}
                                    onClick={() => navigate('/course/new')}
                                >
                                    <AddIcon fontSize={'large'} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </>
    )
}
