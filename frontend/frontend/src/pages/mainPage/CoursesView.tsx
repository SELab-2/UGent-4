import { IconButton, Stack } from '@mui/material'
import { CourseCard } from '../../components/CourseCard.tsx'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Course } from './MainPage.tsx'

interface CourseCardProps {
    isStudent: boolean
    activecourses: Course[]
}

export function CoursesView({ isStudent, activecourses }: CourseCardProps) {
    const navigate = useNavigate()

    return (
        <>
            <Stack
                flexDirection={{ xs: 'column-reverse', md: 'row' }}
                minWidth={{ md: '62svw', lg: '73svw' }}
            >
                <Stack
                    direction={'column'}
                    width={'100%'}
                    alignItems={'flex-start'}
                >
                    <Stack
                        flexDirection={'row'}
                        flexWrap={'wrap'}
                        width={'90%'}
                        sx={{
                            gap: 1,
                            overflowY: { md: 'auto' },
                            maxHeight: '72svh',
                        }}
                    >
                        {/* Map the list of the current courses to CourseCards.
                        A CourseCard displays brief information about the course such as the title, deadlines, ...*/}
                        {activecourses.map((course: Course) => (
                            <CourseCard
                                key={course.naam}
                                courseId={course.vak_id.toString()}
                                archived={false}
                                isStudent={isStudent}
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
