import { Stack } from '@mui/material'
import { CourseCard } from '../../components/CourseCard.tsx'
import { Course } from './MainPage.tsx'

interface CourseCardProps {
    userid: number
    isStudent: boolean
    archivedCourses: Course[]
    pinnedCourses: number[]
    pinCourse: (courseId: number) => void
}

export function ArchivedView({
    userid,
    isStudent,
    archivedCourses,
    pinnedCourses,
    pinCourse,
}: CourseCardProps) {
    return (
        <>
            <Stack
                flexDirection={{ xs: 'column-reverse', md: 'row' }}
                width={'100%'}
            >
                <Stack
                    direction={'column'}
                    width={'100%'}
                    alignItems={'center'}
                >
                    <Stack
                        flexDirection={'row'}
                        flexWrap={'wrap'}
                        width={'95%'}
                        sx={{
                            gap: 1,
                            overflowY: { sm: 'auto' },
                            maxHeight: '78svh',
                        }}
                    >
                        {/* Map the list of the cirrent courses to CourseCards. */}
                        {archivedCourses.map((course) => {
                            return (
                                <CourseCard
                                    userid={userid}
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
