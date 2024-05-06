import { Stack } from '@mui/material'
import { CourseCard } from '../../components/CourseCard.tsx'
import { Course } from './MainPage.tsx'

interface CourseCardProps {
    isStudent: boolean
    archivedCourses: Course[]
    pinnedCourses: number[]
    pinCourse: (courseId: number) => void
}

export function ArchivedView({
    isStudent,
    archivedCourses,
    pinnedCourses,
    pinCourse,
}: CourseCardProps) {
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
                        width={{ xs: '100%', md: '90%' }}
                        sx={{
                            gap: 2,
                            overflowY: { sm: 'auto' },
                            maxHeight: '78svh',
                        }}
                    >
                        {/* Map the list of the cirrent courses to CourseCards. */}
                        {archivedCourses.map((course) => {
                            return (
                                <CourseCard
                                    courseId={course.vak_id.toString()}
                                    archived={true}
                                    isStudent={isStudent}
                                    pinned={pinnedCourses.includes(
                                        course.vak_id
                                    )}
                                    pinEvent={() => pinCourse(course.vak_id)}
                                />
                            )
                        })}
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}
