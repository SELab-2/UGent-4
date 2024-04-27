import { IconButton, Stack } from '@mui/material'
import { CourseCard } from '../../components/CourseCard.tsx'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Course } from './MainPage.tsx'

interface CourseCardProps {
    isStudent: boolean
    activecourses: Course[]
    pinnedCourses: number[]
    archiveCourse: (courseId: number) => void
    pinCourse: (courseId: number) => void
}

export function CoursesView({ isStudent, activecourses, pinnedCourses, archiveCourse, pinCourse }: CourseCardProps) {
    const navigate = useNavigate()

    return (
        <>
            <Stack
                flexDirection={{ xs: 'column-reverse', md: 'row' }}
                minWidth={{ md: '60svw', lg: '69svw' }}
            >
                <Stack
                    direction={'column'}
                    spacing={1}
                    width={'100%'}
                    alignItems={'center'}
                >
                    <Stack
                        flexDirection={'row'}
                        flexWrap={'wrap'}
                        width={'90%'}
                        sx={{
                            gap: 2,
                            overflowY: { md: 'auto' },
                            maxHeight: '72svh',
                        }}
                    >
                        {/* Map the list of the cirrent courses to CourseCards.
                        A CourseCard displays brief information about the course such as the title, deadlines, ...*/}
                        {activecourses.sort((a: Course, b: Course) => {
                            if(pinnedCourses.includes(a.vak_id)){
                                if(pinnedCourses.includes(b.vak_id)){
                                    return 0
                                } else {
                                    return -1
                                }
                            } else {
                                if(pinnedCourses.includes(b.vak_id)){
                                    return 1
                                } else {
                                    return 0
                                }
                            }
                        })
                        .map((course: Course) => (
                            <CourseCard
                                key={course.naam}
                                courseId={course.vak_id.toString()}
                                archived={false}
                                isStudent={isStudent}
                                archiveEvent={() => archiveCourse(course.vak_id)}
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
                            <IconButton
                                color={'primary'}
                                aria-label={'add-button'}
                                onClick={() => navigate('/course/edit')}
                            >
                                <AddIcon fontSize={'large'} />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </>
    )
}
