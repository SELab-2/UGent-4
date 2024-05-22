import { Card, Divider } from './CustomComponents.tsx'
import {
    Box,
    CardActionArea,
    CardContent,
    IconButton,
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

import { CourseCardSkeleton } from './CourseCardSkeleton.tsx'
import { Submission } from '../pages/submissionPage/SubmissionPage.tsx'
import { Group } from '../pages/groupsPage/GroupsPage.tsx'
import axios from 'axios'
/*
 * CourseCard component displays a card with course information and a list of assignments
 * @param courseId: string, the id of the course
 * @param archived: boolean, whether the course is archived
 * @param isStudent: boolean, whether the user is a student
 */

//TODO: fix archived with state so that the card moves to ArchivedView when archived

interface CourseCardProps {
    userid: number
    courseId: string
    archived: boolean
    isStudent: boolean
    archiveEvent?: () => void
    pinned: boolean
    pinEvent: () => void
}

export function CourseCard({
    userid,
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
        jaartal: 0,
        studenten: [],
        lesgevers: [],
        gearchiveerd: false,
    })
    const [assignments, setAssignments] = useState<project[]>([])
    const [groupsWithSubmissions, setGroupsWithSubmissions] = useState<Group[]>(
        []
    )
    const [teachers, setTeachers] = useState<
        { first_name: string; last_name: string }[]
    >([])
    const [loading, setLoading] = useState<boolean>(true)

    const navigate = useNavigate()

    // Get all necessary data from backend
    useEffect(() => {
        async function fetchData() {
            // Set loading to true every time the data is requested
            setLoading(true)
            try {
                const courseResponse = await instance.get<Course>(
                    `/vakken/${courseId}/`
                )
                const assignmentsResponse = await instance.get<project[]>(
                    `/projecten/?vak=${courseId}`
                )

                setCourse(courseResponse.data)
                setAssignments(assignmentsResponse.data)

                //fetch submissions as well if user is student
                if (isStudent) {
                    const groups: Group[] = await instance
                        .get(`/groepen/?student=${userid}`)
                        .then((response) => response.data)
                    const submissionPromises = groups.map(async (group) => {
                        const response = await instance.get<Submission>(
                            `/indieningen/?project=${group.project}`
                        )
                        return response.data
                    })
                    const submissions = await axios.all(submissionPromises)

                    console.log(groups)
                    const validGroups = groups.filter((group) =>
                        submissions
                            .flat(Infinity)
                            .some(
                                (submission) =>
                                    submission.groep === group.groep_id
                            )
                    )

                    setGroupsWithSubmissions(validGroups)
                }

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
            // Set loading to false after data is fetched
            setLoading(false)
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
            {loading ? (
                // If course is not available, show a skeleton loading component
                <CourseCardSkeleton />
            ) : (
                // If course is available, show course details inside a card component
                <Card
                    id={`course${courseId}`}
                    elevation={1}
                    sx={{
                        width: { xs: '100%', md: '60%' },
                        minWidth: 350,
                        maxWidth: 460,
                        padding: 0,
                        margin: 1,
                    }}
                >
                    <CardContent sx={{ margin: 0, padding: 0 }}>
                        {/* Clickable area for the card */}
                        <CardActionArea onClick={handleCardClick}>
                            <Box
                                id="courseInfo"
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
                                    <Typography variant={'subtitle1'}>
                                        {t('students') + ': '}
                                        {course.studenten.length || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardActionArea>
                        {/* List of assignments */}
                        <Box
                            aria-label={'assignmentList'}
                            sx={{
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
                                    id="student"
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    pl={3}
                                    pr={3}
                                >
                                    <Typography id="project" width={30}>
                                        Project
                                    </Typography>
                                    <Typography
                                        id="deadline"
                                        pl={20}
                                        width={30}
                                    >
                                        Deadline
                                    </Typography>
                                    <Typography id="status" width={30}>
                                        Status
                                    </Typography>
                                </Box>
                            ) : (
                                // Display assignments for teachers
                                <>
                                    {archived ? (
                                        <Box
                                            id="teacherArchived"
                                            display={'flex'}
                                            flexDirection={'row'}
                                            justifyContent={'space-between'}
                                            pl={3}
                                            pr={3}
                                            width={{ xs: '81%', sm: '85%' }}
                                        >
                                            <Typography
                                                id="project"
                                                maxWidth={100}
                                            >
                                                Project
                                            </Typography>
                                            <Typography
                                                id="deadline"
                                                minWidth={80}
                                            >
                                                Deadline
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box
                                            id="teacherNonArchived"
                                            display={'flex'}
                                            flexDirection={'row'}
                                            justifyContent={'space-between'}
                                            pl={3}
                                            pr={3}
                                            width={{ xs: '71%', sm: '75%' }}
                                        >
                                            <Typography
                                                id="project"
                                                maxWidth={100}
                                            >
                                                Project
                                            </Typography>
                                            <Typography
                                                id="deadline"
                                                minWidth={90}
                                            >
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
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <List
                                            disablePadding={true}
                                            sx={{
                                                overflowY: 'auto',
                                                maxHeight: 130,
                                            }}
                                        >
                                            {assignments.length === 0 && (
                                                <Box
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                    py={6}
                                                    flexGrow={1}
                                                    height={'100%'}
                                                >
                                                    <Typography>
                                                        {t('no_projects')}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {assignments
                                                .filter(
                                                    (assignment) =>
                                                        assignment.zichtbaar
                                                )
                                                .map((assignment) => (
                                                    <AssignmentListItem
                                                        key={`project${assignment.project_id}`}
                                                        id={assignment.project_id.toString()}
                                                        courseId={courseId}
                                                        projectName={
                                                            assignment.titel
                                                        }
                                                        dueDate={
                                                            assignment.deadline
                                                                ? dayjs(
                                                                      assignment.deadline
                                                                  ).format(
                                                                      'DD/MM/YYYY HH:mm'
                                                                  )
                                                                : undefined
                                                        }
                                                        status={groupsWithSubmissions.some(
                                                            (group) =>
                                                                group.project ===
                                                                assignment.project_id
                                                        )}
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
                                                <List
                                                    disablePadding={true}
                                                    sx={{
                                                        overflowY: 'auto',
                                                        maxHeight: 130,
                                                    }}
                                                >
                                                    {assignments.map(
                                                        (assignment) => (
                                                            <AssignmentListItem
                                                                key={`project${assignment.project_id}`}
                                                                id={assignment.project_id.toString()}
                                                                courseId={
                                                                    courseId
                                                                }
                                                                projectName={
                                                                    assignment.titel
                                                                }
                                                                dueDate={
                                                                    assignment.deadline
                                                                        ? dayjs(
                                                                              assignment.deadline
                                                                          ).format(
                                                                              'DD/MM/YYYY HH:mm'
                                                                          )
                                                                        : undefined
                                                                }
                                                                status={
                                                                    groupsWithSubmissions.some(
                                                                        (
                                                                            group
                                                                        ) =>
                                                                            group.project ===
                                                                            assignment.project_id
                                                                    )
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
                                                                key={`project${assignment.project_id}`}
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
                                                                status={groupsWithSubmissions.some(
                                                                    (group) =>
                                                                        group.project ===
                                                                        assignment.project_id
                                                                )}
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
                                                    id="archiveButton"
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
