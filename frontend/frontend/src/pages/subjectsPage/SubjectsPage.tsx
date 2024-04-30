import { Header } from '../../components/Header'
import { Box, CircularProgress, IconButton, Stack } from '@mui/material'
import TabSwitcher from '../../components/TabSwitcher.tsx'
import { ProjectsView } from './ProjectsView.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import WarningPopup from '../../components/WarningPopup.tsx'
import { t } from 'i18next'
import instance from '../../axiosConfig.ts'
import { useEffect, useState } from 'react'
import ErrorPage from '../ErrorPage.tsx'
import { Course } from '../mainPage/MainPage.tsx'
import { CopyToClipboard } from '../../components/CopyToClipboard.tsx'

interface Project {
    project_id: number
    titel: string
    beschrijving: string
    opgave_bestand: File
    vak: number
    max_score: number
    max_groep_grootte: number
    deadline: Date
    extra_deadline: Date
    zichtbaar: boolean
    gearchiveerd: boolean
}

/**
 * This page is the main page of a course.
 * It mainly lists the projects with some brief info.
 * Besides it allows the user to select current or archived projects.
 * Any other UI on the course's page is also handled in this view
 */
export function SubjectsPage() {
    const { courseId, accept_invite } = useParams()
    const courseID = String(courseId)

    const navigate = useNavigate()

    const [course, setCourse] = useState<Course>()
    const [assignments, setAssignments] = useState<Project[]>([])
    const [user, setUser] = useState({
        user: 0,
        is_lesgever: false,
        first_name: '',
        last_name: '',
        email: '',
    })
    const [fetchError, setFetchError] = useState(false)
    const [userLoading, setUserLoading] = useState(true)

    //variable for invitation link popup close
    const [inviteOpen, setInviteOpen] = useState(false)

    async function confirmJoinCourse() {
        await instance.get(`/vakken/${courseID}/accept_invite/`)
        setInviteOpen(false)
        navigate(`/course/${courseID}`)
    }

    useEffect(() => {
        // Get the data for this course.
        async function fetchUser() {
            try {
                setUserLoading(true)
                const userResponse = await instance.get('/gebruikers/me/')
                setUser(userResponse.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                setFetchError(true)
            } finally {
                setUserLoading(false)
            }
        }
        async function fetchData() {
            try {
                const courseResponse = await instance.get(
                    `/vakken/${courseID}/`
                )
                const assignmentsResponse = await instance.get(
                    `/projecten/?vak=${courseID}`
                )
                setCourse(courseResponse.data)
                setAssignments(assignmentsResponse.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                setFetchError(true)
            }
        }
        // Fetch user first
        fetchUser().catch((error) =>
            console.error('Error fetching data:', error)
        )

        // check if the url is a special url for accepting an invitation
        if (accept_invite !== undefined) {
            if (user.is_lesgever) {
                navigate(`/course/${courseID}`)
            } else {
                setInviteOpen(true)
            }
        }

        // Fetch the course and assignments
        fetchData().catch((error) =>
            console.error('Error fetching data:', error)
        )
    }, [accept_invite, courseID, navigate, user.is_lesgever])

    const addProject = () => {
        console.log('add project')
        navigate(`/course/${courseID}/assignment/edit/`)
    }

    const [openDeletePopup, setOpenDeletePopup] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState(0)
    const [openArchivePopup, setOpenArchivePopup] = useState(false)
    const [archiveIndex, setArchiveIndex] = useState(0)

    const deleteAssignment = (index: number) => {
        setDeleteIndex(index)
        setOpenDeletePopup(true)
    }
    const doDelete = async () => {
        setAssignments(assignments.filter((_, i) => i !== deleteIndex))
        try {
            const deletedAssignment = assignments[deleteIndex]
            await instance.delete(`/projecten/${deletedAssignment.project_id}/`)
        } catch (error) {
            console.error('Error deleting data:', error)
        }
    }
    const archiveAssignment = (index: number) => {
        setArchiveIndex(index)
        setOpenArchivePopup(true)
    }
    const doArchive = async () => {
        const newAssignments = assignments.map((a, i) =>
            i == archiveIndex ? archiveSingleAssignment(a) : a
        )
        setAssignments(newAssignments)
        try {
            const assignment = assignments[archiveIndex]
            await instance.patch(`/projecten/${assignment.project_id}/`, {
                gearchiveerd: true,
            })
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }
    const changeVisibilityAssignment = async (index: number) => {
        const newAssignments = assignments.map((a, i) =>
            i == index ? changeVisibilitySingleAssignment(a) : a
        )
        setAssignments(newAssignments)
        try {
            const assignment = assignments[index]
            await instance.patch(`/projecten/${assignment.project_id}/`, {
                zichtbaar: !assignment.zichtbaar,
            })
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

    if (fetchError) {
        return <ErrorPage />
    }

    if (!course) {
        return null
    }

    return (
        <>
            {userLoading ? (
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ height: '100vh', width: '100vw' }}
                >
                    <CircularProgress color="primary" size={80} />
                </Box>
            ) : (
                <>
                    {user.is_lesgever ? (
                        <>
                            {/* The code below shows the page from the perspecitve of the teacher. */}
                            <Stack
                                direction={'column'}
                                spacing={0}
                                sx={{
                                    width: '99%',
                                    height: '100%',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                <Header
                                    variant={'editable'}
                                    title={course.naam}
                                />
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '70%',
                                        marginTop: 10,
                                    }}
                                >
                                    {/* Give the student the option to select current or archived projects. */}
                                    <TabSwitcher
                                        titles={[
                                            'current_projects',
                                            'archived',
                                        ]}
                                        nodes={[
                                            <ProjectsView
                                                gebruiker={user}
                                                archived={false}
                                                assignments={assignments}
                                                deleteAssignment={
                                                    deleteAssignment
                                                }
                                                archiveAssignment={
                                                    archiveAssignment
                                                }
                                                changeVisibilityAssignment={
                                                    changeVisibilityAssignment
                                                }
                                                courseId={courseID}
                                            />,
                                            <ProjectsView
                                                gebruiker={user}
                                                archived={true}
                                                assignments={assignments}
                                                deleteAssignment={
                                                    deleteAssignment
                                                }
                                                archiveAssignment={
                                                    archiveAssignment
                                                }
                                                changeVisibilityAssignment={
                                                    changeVisibilityAssignment
                                                }
                                                courseId={courseID}
                                            />,
                                        ]}
                                    />
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    sx={{ width: '100%', height: '30%' }}
                                >
                                    <CopyToClipboard
                                        invitationLink={
                                            window.location.href +
                                            '/accept_invitation'
                                        }
                                    />

                                    <IconButton
                                        onClick={addProject}
                                        color="primary"
                                        edge="end"
                                        aria-label="add-project"
                                    >
                                        <AddCircleIcon
                                            sx={{
                                                fontSize: 60,
                                                height: '100%',
                                            }}
                                        />
                                    </IconButton>
                                </Box>
                                <WarningPopup
                                    title={t('delete_project_warning')}
                                    content={t('cant_be_undone')}
                                    buttonName={t('delete')}
                                    open={openDeletePopup}
                                    handleClose={() =>
                                        setOpenDeletePopup(false)
                                    }
                                    doAction={doDelete}
                                />
                                <WarningPopup
                                    title={t('archive_project_warning')}
                                    content={t('cant_be_undone')}
                                    buttonName={t('archive')}
                                    open={openArchivePopup}
                                    handleClose={() =>
                                        setOpenArchivePopup(false)
                                    }
                                    doAction={doArchive}
                                />
                            </Stack>
                        </>
                    ) : (
                        <>
                            {/* The colon is the "else" of the ternary operator.
                This means that all the code below is applicable to the student's view. */}
                            <Stack
                                direction={'column'}
                                spacing={10}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                <Header
                                    variant={'default'}
                                    title={course.naam}
                                />
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '70%',
                                        marginTop: 10,
                                    }}
                                >
                                    <TabSwitcher
                                        titles={[
                                            'current_projects',
                                            'archived',
                                        ]}
                                        nodes={[
                                            <ProjectsView
                                                gebruiker={user}
                                                archived={false}
                                                assignments={assignments}
                                                deleteAssignment={() =>
                                                    undefined
                                                }
                                                archiveAssignment={() =>
                                                    undefined
                                                }
                                                changeVisibilityAssignment={() =>
                                                    undefined
                                                }
                                                courseId={courseID}
                                            />,
                                            <ProjectsView
                                                gebruiker={user}
                                                archived={true}
                                                assignments={assignments}
                                                deleteAssignment={() =>
                                                    undefined
                                                }
                                                archiveAssignment={() =>
                                                    undefined
                                                }
                                                changeVisibilityAssignment={() =>
                                                    undefined
                                                }
                                                courseId={courseID}
                                            />,
                                        ]}
                                    />
                                    <WarningPopup
                                        title={t('join_course')}
                                        content={t('acces')}
                                        buttonName={t('join')}
                                        open={inviteOpen}
                                        handleClose={() => navigate('/')}
                                        doAction={confirmJoinCourse}
                                    />
                                </Box>
                            </Stack>
                        </>
                    )}
                </>
            )}
        </>
    )
}

function archiveSingleAssignment(assignment: Project): Project {
    return {
        ...assignment,
        gearchiveerd: true,
    }
}

function changeVisibilitySingleAssignment(assignment: Project): Project {
    return {
        ...assignment,
        zichtbaar: !assignment.zichtbaar,
    }
}
