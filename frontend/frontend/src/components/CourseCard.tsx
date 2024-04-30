import { Card, Divider } from './CustomComponents.tsx'
import {
    Box,
    CardActionArea,
    CardContent,
    IconButton,
    Skeleton,
    Typography,
} from '@mui/material'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import instance from '../axiosConfig.ts'
import { AssignmentListItem } from './AssignmentListItem.tsx'
import List from '@mui/material/List'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { Course, project } from '../pages/mainPage/MainPage.tsx'
import dayjs from 'dayjs'

/*
 * CourseCard component displays a card with course information and a list of assignments
 * @param courseId: string, the id of the course
 * @param archived: boolean, whether the course is archived
 * @param isStudent: boolean, whether the user is a student
 */

//TODO: fix archived with state so that the card moves to ArchivedView when archived

interface CourseCardProps {
    courseId: string
    archived: boolean
    isStudent: boolean
    archiveEvent?: () => void
    pinned: boolean
    pinEvent: () => void
}

export function CourseCard({
    courseId,
    archived,
    isStudent,
    archiveEvent,
    pinned,
    pinEvent,
}: CourseCardProps) {
    // State variables
    const [course, setCourse] = useState<Course>({
        vak_id: 0,
        naam: '',
        studenten: [],
        lesgevers: [],
        gearchiveerd: false,
    })
    const [assignments, setAssignments] = useState<project[]>([])
    const [teachers, setTeachers] = useState<
        { first_name: string; last_name: string }[]
    >([])
    const navigate = useNavigate()

    // Get all necessary data from backend
    useEffect(() => {
        async function fetchData() {
            try {
                const courseResponse = await instance.get<Course>(
                    `/vakken/${courseId}/`
                )
                const assignmentsResponse = await instance.get<project[]>(
                    `/projecten/?vak=${courseId}`
                )

                setCourse(courseResponse.data)
                setAssignments(assignmentsResponse.data)

                if (courseResponse.data && courseResponse.data.lesgevers) {
                    const lesgevers = []
                    for (const teacherId of courseResponse.data.lesgevers) {
                        try {
                            const response = await instance.get(
                                `/gebruikers/${teacherId}`
                            )
                            lesgevers.push(response.data)
                        } catch (error) {
                            console.error('Error fetching teacher:', error)
                        }
                    }
                    setTeachers(lesgevers)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData().catch((error) =>
            console.error('Error fetching data:', error)
        )
    }, [courseId])

    // Function to handle card click event.
    const handleCardClick = () => {
        console.log('Card clicked')
        navigate(`/course/${courseId}`)
    }

    const pinCourse = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        console.log('Course pinned/unpinned')
        pinEvent()
    }

    return (
        <>
            {!course ? (
                // If course is not available, show a skeleton loading component
                <Skeleton
                    variant={'rectangular'}
                    sx={{
                        width: { xs: '100%', md: '60%' },
                        minWidth: 350,
                        maxWidth: 420,
                        backgroundColor: 'background.default',
                        borderRadius: 5,
                        padding: 0,
                        margin: 1,
                    }}
                />
            ) : (
                // If course is available, show course details inside a card component
                <Card
                    sx={{
                        width: { xs: '100%', md: '60%' },
                        minWidth: 350,
                        maxWidth: 420,
                        padding: 0,
                        margin: 1,
                    }}
                >
                    <CardContent sx={{ margin: 0, padding: 0 }}>
                        {/* Clickable area for the card */}
                        <CardActionArea onClick={handleCardClick}>
                            <Box
                                aria-label={'courseHeader'}
                                sx={{
                                    backgroundColor: 'secondary.main',
                                    margin: 0,
                                    height: 70,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    padding: 2,
                                }}
                            >
                                {/* Course name and teachers */}
                                <Box
                                    width={'70%'}
                                    height={'100%'}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    gap={1}
                                >
                                    <Typography
                                        width={'100%'}
                                        height={'50%'}
                                        noWrap
                                        variant={'h5'}
                                    >
                                        {course.naam}
                                    </Typography>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        gap={1}
                                        height={'40%'}
                                    >
                                        <Typography variant={'subtitle1'}>
                                            {t('teachers') + ': '}
                                        </Typography>
                                        <Box
                                            display={'flex'}
                                            flexDirection={'column'}
                                            gap={0.5}
                                            overflow={'auto'}
                                        >
                                            {teachers.map((teacher, index) => (
                                                <Typography
                                                    key={index}
                                                    padding={0}
                                                    margin={0}
                                                    variant={'subtitle1'}
                                                >
                                                    {teacher.first_name +
                                                        ' ' +
                                                        teacher.last_name}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                                {/* Number of students enrolled */}
                                <Box>
                                    <Typography variant={'subtitle1'}>
                                        {t('students') + ': '}
                                        {course.studenten.length || 0}
                                    </Typography>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        sx={{
                                            flexGrow: 1,
                                            alignItems: 'flex-end',
                                            alignSelf: 'flex-end',
                                        }}
                                    >
                                        <IconButton
                                            onClick={pinCourse}
                                            sx={{
                                                backgroundColor:
                                                    'secondary.main',
                                                borderRadius: 2,
                                                alignSelf: 'flex-end',
                                            }}
                                        >
                                            {pinned ? (
                                                <PushPinIcon />
                                            ) : (
                                                <PushPinOutlinedIcon />
                                            )}
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </CardActionArea>
                        {/* List of assignments */}
                        <Box
                            aria-label={'assignmentList'}
                            sx={{
                                backgroundColor: 'back',
                                height: 150,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 1,
                                borderRadius: 2,
                                paddingBottom: 0,
                            }}
                        >
                            {isStudent ? (
                                // Display assignments for students
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    pl={3}
                                    pr={3}
                                >
                                    <Typography width={30}>Project</Typography>
                                    <Typography width={30}>Deadline</Typography>
                                    <Typography width={30}>Status</Typography>
                                </Box>
                            ) : (
                                // Display assignments for teachers
                                <>
                                    {archived ? (
                                        <Box
                                            display={'flex'}
                                            flexDirection={'row'}
                                            justifyContent={'space-between'}
                                            pl={3}
                                            pr={3}
                                            width={{ xs: '81%', sm: '85%' }}
                                        >
                                            <Typography maxWidth={100}>
                                                Project
                                            </Typography>
                                            <Typography minWidth={50}>
                                                Deadline
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box
                                            display={'flex'}
                                            flexDirection={'row'}
                                            justifyContent={'space-between'}
                                            pl={3}
                                            pr={3}
                                            width={{ xs: '71%', sm: '75%' }}
                                        >
                                            <Typography maxWidth={100}>
                                                Project
                                            </Typography>
                                            <Typography minWidth={50}>
                                                Deadline
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                            <Divider></Divider>
                            <Box display={'flex'} flexDirection={'row'}>
                                {isStudent ? (
                                    // Render assignment list for students
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 130,
                                            overflow: 'auto',
                                        }}
                                    >
                                        <List disablePadding={true}>
                                            {assignments
                                                .filter(
                                                    (assignment) =>
                                                        assignment.zichtbaar
                                                )
                                                .map((assignment) => (
                                                    <AssignmentListItem
                                                        key={
                                                            assignment.project_id
                                                        }
                                                        id={assignment.project_id.toString()}
                                                        courseId={courseId}
                                                        projectName={
                                                            assignment.titel
                                                        }
                                                        dueDate={
                                                            dayjs(
                                                                assignment.deadline
                                                            ).format(
                                                                'DD/MM/YYYY HH:mm'
                                                            ) || undefined
                                                        }
                                                        status={
                                                            assignment.project_id ===
                                                            1
                                                        } //TODO dit moet nog aangepast worden
                                                        isStudent={isStudent}
                                                    />
                                                ))}
                                        </List>
                                    </Box>
                                ) : (
                                    // Render assignment list for teachers
                                    <>
                                        {!archived ? (
                                            <Box
                                                sx={{
                                                    width: '90%',
                                                    height: 130,
                                                }}
                                            >
                                                <List disablePadding={true}>
                                                    {assignments.map(
                                                        (assignment) => (
                                                            <AssignmentListItem
                                                                key={
                                                                    assignment.project_id
                                                                }
                                                                id={assignment.project_id.toString()}
                                                                courseId={
                                                                    courseId
                                                                }
                                                                projectName={
                                                                    assignment.titel
                                                                }
                                                                dueDate={
                                                                    dayjs(
                                                                        assignment.deadline
                                                                    ).format(
                                                                        'DD/MM/YYYY HH:mm'
                                                                    ) ||
                                                                    undefined
                                                                }
                                                                status={
                                                                    assignment.project_id ===
                                                                    1
                                                                    //TODO: status has to check if there is already a submission
                                                                }
                                                                isStudent={
                                                                    isStudent
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </List>
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: 130,
                                                }}
                                            >
                                                <List disablePadding={true}>
                                                    {assignments
                                                        .filter(
                                                            (assignment) =>
                                                                assignment.zichtbaar
                                                        )
                                                        .map((assignment) => (
                                                            <AssignmentListItem
                                                                key={
                                                                    assignment.project_id
                                                                }
                                                                id={assignment.project_id.toString()}
                                                                courseId={
                                                                    courseId
                                                                }
                                                                projectName={
                                                                    assignment.titel
                                                                }
                                                                dueDate={
                                                                    dayjs(
                                                                        assignment.deadline
                                                                    ).format(
                                                                        'DD/MM/YYYY HH:mm'
                                                                    ) ||
                                                                    undefined
                                                                }
                                                                status={
                                                                    assignment.project_id ===
                                                                    1
                                                                }
                                                                isStudent={
                                                                    isStudent
                                                                }
                                                            />
                                                        ))}
                                                </List>
                                            </Box>
                                        )}
                                        {!archived && (
                                            <Box
                                                display={'flex'}
                                                flexDirection={'column'}
                                                paddingRight={1}
                                                sx={{
                                                    flexGrow: 1,
                                                    alignItems: 'flex-end',
                                                    alignSelf: 'flex-end',
                                                }}
                                            >
                                                <IconButton
                                                    onClick={archiveEvent}
                                                    sx={{
                                                        backgroundColor:
                                                            'secondary.main',
                                                        borderRadius: 2,
                                                        alignSelf: 'flex-end',
                                                    }}
                                                >
                                                    <ArchiveOutlinedIcon />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
