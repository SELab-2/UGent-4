import { Header } from '../../components/Header.tsx'
import FileUploadButton from '../../components/FileUploadButton.tsx'
import { SubmissionListItemStudentPage } from '../../components/SubmissionListItemStudentPage.tsx'
import {
    Score,
    SubmissionListItemTeacherPage,
} from '../../components/SubmissionListItemTeacherPage.tsx'
import {
    Button,
    Card,
    Divider,
    EvenlySpacedRow,
    SecondaryButton,
} from '../../components/CustomComponents.tsx'
import {
    Box,
    CircularProgress,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    List,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import { t } from 'i18next'
import instance from '../../axiosConfig.ts'
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import JSZip from 'jszip'
import { Submission } from '../submissionPage/SubmissionPage.tsx'
import { Project } from '../scoresPage/ProjectScoresPage.tsx'
import dayjs from 'dayjs'
import DownloadIcon from '@mui/icons-material/Download'
import WarningPopup from '../../components/WarningPopup.tsx'
import { User } from '../subjectsPage/AddChangeSubjectPage.tsx'
import StudentPopUp from '../subjectsPage/StudentPopUp.tsx'
import axios, { AxiosResponse } from 'axios'
import { GroupAccessComponent } from '../../components/GroupAccessComponent.tsx'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'

// group interface
export interface Group {
    groep_id: number
    studenten: number[]
    project: number
}

export function AssignmentPage() {
    const navigate = useNavigate()
    let { courseId, assignmentId } = useParams()
    assignmentId = String(assignmentId)
    courseId = String(courseId)

    const adjustScores = () => {
        console.log('adjust scores')
        navigate(`/course/${courseId}/assignment/${assignmentId}/scoring`)
    }

    const goToGroups = () => {
        console.log('go to scores')
        navigate(`/course/${courseId}/assignment/${assignmentId}/groups/choose`)
    }

    // State variables
    const [user, setUser] = useState({
        user: 0,
        is_lesgever: false,
        first_name: '',
        last_name: '',
        email: '',
    })
    const [assignment, setAssignment] = useState<Project>()
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [singleStudents, setSingleStudents] = useState<User[]>([])
    const [submissionFile, setSubmissionFile] = useState<File>()
    const [submit, setSubmit] = useState(false)
    const [students, setStudents] = useState<User[]>([])
    const [lastSubmission, setLastSubmission] = useState<Submission>()
    const [score, setScore] = useState<Score>()

    //state for loading the page
    const [loading, setLoading] = useState(true)
    const [userLoading, setUserLoading] = useState(true)
    const [studentsLoading, setStudentsLoading] = useState(true)

    // state for the warning popup
    const [openNoGroup, setOpenNoGroup] = useState(false)

    // Function to handle the error when the user has no group
    function handleNoGroupError() {
        if (assignment?.student_groep) {
            navigate(
                `/course/${courseId}/assignment/${assignmentId}/groups/choose`
            )
        } else {
            setOpenNoGroup(false)
        }
    }

    useEffect(() => {
        async function fetchUser() {
            setUserLoading(true)
            const userResponse = await instance.get('/gebruikers/me/')
            setUser(userResponse.data)
            setUserLoading(false)
        }

        async function fetchData() {
            try {
                setLoading(true)
                const assignmentResponse = await instance.get(
                    `/projecten/${assignmentId}/`
                )
                const newAssignment: Project = assignmentResponse.data
                if (assignmentResponse.data.opgave_bestand) {
                    newAssignment.filename =
                        assignmentResponse.data.opgave_bestand.replace(
                            /^.*[\\/]/,
                            ''
                        )
                    newAssignment.opgave_bestand = await instance
                        .get(`/projecten/${assignmentId}/opgave_bestand/`, {
                            responseType: 'blob',
                        })
                        .then((res) => {
                            let filename = 'indiening.zip'
                            if (newAssignment.filename) {
                                filename = newAssignment.filename
                            }
                            const blob = new Blob([res.data], {
                                type: res.headers['content-type'],
                            })
                            const file: File = new File([blob], filename, {
                                type: res.headers['content-type'],
                            })
                            return file
                        })
                }
                setAssignment(newAssignment)
                if (user) {
                    if (user.is_lesgever) {
                        const groupsResponse = await instance.get(
                            `/groepen/?project=${assignmentId}`
                        )
                        setGroups(groupsResponse.data)
                        if (newAssignment.max_groep_grootte == 1) {
                            const userPromises: Promise<AxiosResponse<User>>[] =
                                groupsResponse.data.map((group: Group) =>
                                    instance.get(
                                        '/gebruikers/' + group.studenten[0]
                                    )
                                )

                            const temp_students = await axios.all(userPromises)

                            setSingleStudents(
                                temp_students.map((res) => res.data)
                            )
                        }
                    } else {
                        const groupResponse = await instance.get<[Group]>(
                            `/groepen/?student=${user.user}&project=${assignmentId}`
                        )
                        if (groupResponse.data.length > 0) {
                            const submissionsResponse = await instance.get(
                                `/indieningen/?project=${assignmentId}&groep=${groupResponse.data[0].groep_id}`
                            )
                            setSubmissions(submissionsResponse.data)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                navigate('/error')
            } finally {
                setLoading(false)
            }
        }

        // Ensure fetchUser completes before fetchData starts
        ;(async () => {
            if (user.user === 0) {
                await fetchUser()
            }
            await fetchData() // Use await here to ensure fetchData waits for fetchUser to complete
        })()
    }, [assignmentId, courseId, user.is_lesgever, submit, user])

    useEffect(() => {
        async function fetchStudents() {
            setStudentsLoading(true)
            const groupResponse = await instance.get(
                `groepen/?student=${user.user}&project=${assignmentId}`
            )

            if (groupResponse.data.length > 0) {
                const group: Group = groupResponse.data[0]

                const studentPromises: Promise<AxiosResponse<User>>[] =
                    group.studenten.map((id: number) =>
                        instance.get('/gebruikers/' + id)
                    )

                const temp_students = await axios.all(studentPromises)
                setStudents(temp_students.map((res) => res.data))
            }

            setStudentsLoading(false)
        }
        // Fetch students
        if (!user.is_lesgever && user.user !== 0) {
            fetchStudents().catch((error) =>
                console.error('Error fetching students data:', error)
            )
        }
    }, [user, assignment, groups, assignmentId])

    useEffect(() => {
        async function fetchScore() {
            if (submissions) {
                setLastSubmission(submissions[submissions.length - 1])
                if (lastSubmission) {
                    const scoreResponse = await instance.get(
                        `/scores/?indiening=${lastSubmission.indiening_id}`
                    )
                    setScore(scoreResponse.data[scoreResponse.data.length - 1])
                    console.log('scoreresponse', scoreResponse.data)
                    console.log('score', score?.score)
                }
            }
        }
        fetchScore().catch((error) =>
            console.error('Error fetching score', error)
        )
    }, [submissions])

    // Function to download all submissions as a zip file
    const downloadAllSubmissions = () => {
        const zip = new JSZip()
        const downloadPromises = submissions.map(async (submission) => {
            try {
                // Get the submission details
                const submissionResponse = await instance.get(
                    `/indieningen/${submission.indiening_id}/`
                )
                const newSubmission = submissionResponse.data

                // Get the submission file
                const fileResponse = await instance.get(
                    `/indieningen/${submission.indiening_id}/indiening_bestand/`,
                    { responseType: 'blob' }
                )

                let filename = 'indiening.zip'
                if (newSubmission.bestand) {
                    filename = newSubmission.bestand.replace(/^.*[\\/]/, '')
                }

                const blob = new Blob([fileResponse.data], {
                    type: fileResponse.headers['content-type'],
                })
                newSubmission.bestand = new File([blob], filename, {
                    type: fileResponse.headers['content-type'],
                })
                newSubmission.filename = filename

                // Add the file to the zip
                zip.file(filename, fileResponse.data)

                return newSubmission
            } catch (err) {
                console.error(
                    `Error downloading submission for id ${submission.indiening_id}:`,
                    err
                )
                throw err
            }
        })

        Promise.allSettled(downloadPromises)
            .then((results) => {
                const errors = results.filter(
                    (result) => result.status === 'rejected'
                )
                if (errors.length > 0) {
                    console.error(
                        'Some submissions failed to download:',
                        errors
                    )
                }
                return zip.generateAsync({ type: 'blob' })
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `all_submissions_${assignment?.titel || 'assignment'}.zip`
                document.body.appendChild(a)
                a.click()
                a.remove()
            })
            .catch((err) => {
                console.error('Error generating zip file:', err)
            })
    }

    // Function to download the assignment file
    const downloadAssignment = () => {
        if (assignment?.opgave_bestand) {
            const url = window.URL.createObjectURL(assignment?.opgave_bestand)
            const a = document.createElement('a')
            a.href = url
            a.download = assignment.filename
                ? assignment.filename
                : 'opgave.zip'
            document.body.appendChild(a)
            a.click()
            a.remove()
        }
    }

    // Function to handle file change event
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSubmissionFile(event.target.files[0])
            console.log(submissionFile?.name)
        }
    }

    // Function to upload submission file
    // check for failures and open popup if no group
    const uploadIndiening = async () => {
        if (submissionFile) {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            const groupResponse = await instance.get(
                `/groepen/?student=${user.user}&project=${assignmentId}`
            )
            if (groupResponse.data) {
                const group = groupResponse.data[0]
                if (group) {
                    const formData = new FormData()
                    formData.append('groep', group.groep_id)
                    formData.append('bestand', submissionFile)

                    await instance
                        .post('/indieningen/', formData, config)
                        .catch((error) => {
                            console.error(error)
                        })
                    setSubmissionFile(undefined)
                } else {
                    setOpenNoGroup(true)
                    console.error(
                        'Group not found for assingmentId: ',
                        assignmentId
                    )
                }
            }
            setSubmit(!submit)
        }
    }

    return (
        <>
            {/* Rendering different UI based on user role */}
            {userLoading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress
                        color={'primary'}
                        data-cy="loadingAnimation"
                    />
                </Box>
            ) : (
                <>
                    {user.is_lesgever ? (
                        // Rendering UI for teacher
                        <>
                            <Header
                                variant={loading ? 'default' : 'editable'}
                                title={
                                    loading
                                        ? ''
                                        : assignment
                                          ? assignment.titel
                                          : ''
                                }
                            />
                            <Stack
                                marginTop={15}
                                direction={'column'}
                                spacing={3}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                {/*deadline and group button */}
                                <Box
                                    sx={{
                                        padding: '20px',
                                        backgroundColor: 'background.default',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '98%',
                                    }}
                                >
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="text.primary"
                                            fontWeight={'bold'}
                                        >
                                            Deadline:
                                        </Typography>
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                width={180}
                                                height={50}
                                            />
                                        ) : (
                                            <Typography
                                                variant="h6"
                                                color={
                                                    assignment &&
                                                    assignment.deadline &&
                                                    dayjs().isAfter(
                                                        dayjs(
                                                            assignment.deadline
                                                        )
                                                    ) &&
                                                    !assignment.extra_deadline
                                                        ? 'error.main'
                                                        : 'text.primary'
                                                }
                                            >
                                                {assignment &&
                                                assignment.deadline
                                                    ? dayjs(
                                                          assignment.deadline
                                                      ).format(
                                                          'DD/MM/YYYY HH:mm'
                                                      )
                                                    : t('no_deadline')}
                                            </Typography>
                                        )}
                                    </Box>
                                    {loading ? (
                                        <Skeleton
                                            variant="text"
                                            width={100}
                                            height={50}
                                            sx={{
                                                bgcolor: 'secondary.main',
                                                marginRight: 8,
                                            }}
                                        />
                                    ) : (
                                        <>
                                            {(assignment?.max_groep_grootte
                                                ? assignment.max_groep_grootte
                                                : 1) > 1 && (
                                                <GroupAccessComponent
                                                    assignmentid={parseInt(
                                                        assignmentId
                                                    )}
                                                    courseid={parseInt(
                                                        courseId
                                                    )}
                                                />
                                            )}
                                        </>
                                    )}
                                </Box>
                                {/*extra deadline*/}
                                {assignment?.extra_deadline && (
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                        pl={2.5}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="text.primary"
                                            fontWeight={'bold'}
                                        >
                                            Extra Deadline:
                                        </Typography>
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                width={180}
                                                height={50}
                                            />
                                        ) : (
                                            <Typography
                                                variant="h6"
                                                color={
                                                    assignment &&
                                                    assignment.deadline &&
                                                    dayjs().isAfter(
                                                        dayjs(
                                                            assignment.deadline
                                                        )
                                                    ) &&
                                                    assignment.extra_deadline &&
                                                    dayjs().isAfter(
                                                        dayjs(
                                                            assignment.extra_deadline
                                                        )
                                                    )
                                                        ? 'error.main'
                                                        : 'text.primary'
                                                }
                                            >
                                                {assignment
                                                    ? dayjs(
                                                          assignment.extra_deadline
                                                      ).format(
                                                          'DD/MM/YYYY HH:mm'
                                                      )
                                                    : 'no deadline'}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Assignment description */}
                                <Card sx={{ padding: '20px', width: '95%' }}>
                                    <Stack direction={'column'}>
                                        <Typography
                                            sx={{
                                                textDecoration: 'underline',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {t('assignment')}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                width={'100%'}
                                                height={50}
                                            />
                                        ) : (
                                            <Typography>
                                                {assignment
                                                    ? assignment.beschrijving
                                                    : ''}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Card>

                                {/* This renders a list of submissions.
                        It shows metadata about the submissions and allows the teacher to download them.
                        The metadata includes group number, submission time, score, and status.
                        */}
                                <Card sx={{ width: '95%' }}>
                                    <Box
                                        aria-label={'courseHeader'}
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            height: 20,
                                            padding: 3,
                                        }}
                                    >
                                        <EvenlySpacedRow
                                            items={[
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {t('group')}
                                                </Typography>,
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {t('time')}
                                                </Typography>,
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Score
                                                </Typography>,
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Status
                                                </Typography>,
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {t('download')}
                                                </Typography>,
                                            ]}
                                        />
                                    </Box>
                                    <Divider />
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            top: '-6px',
                                            height: 340,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: 320,
                                                overflow: 'auto',
                                            }}
                                        >
                                            <List disablePadding>
                                                {loading ? (
                                                    [...Array(3)].map(
                                                        (_, index) => (
                                                            <Skeleton
                                                                key={index}
                                                                variant="text"
                                                                width={'100%'}
                                                                height={50}
                                                                sx={{
                                                                    margin: 0,
                                                                }}
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <>
                                                        {groups.map(
                                                            (group, index) => (
                                                                <>
                                                                    {index !=
                                                                    0 ? (
                                                                        <Divider />
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                    <SubmissionListItemTeacherPage
                                                                        group_name={
                                                                            assignment
                                                                                ? assignment.max_groep_grootte >
                                                                                  1
                                                                                    ? t(
                                                                                          'group'
                                                                                      ) +
                                                                                      ' ' +
                                                                                      (
                                                                                          index +
                                                                                          1
                                                                                      ).toString()
                                                                                    : singleStudents[
                                                                                            index
                                                                                        ]
                                                                                      ? singleStudents[
                                                                                            index
                                                                                        ]
                                                                                            .first_name +
                                                                                        ' ' +
                                                                                        singleStudents[
                                                                                            index
                                                                                        ]
                                                                                            .last_name
                                                                                      : ''
                                                                                : ''
                                                                        }
                                                                        group_id={group.groep_id.toString()}
                                                                        assignment_id={
                                                                            assignmentId
                                                                                ? assignmentId
                                                                                : ''
                                                                        }
                                                                        course_id={
                                                                            courseId
                                                                                ? courseId
                                                                                : ''
                                                                        }
                                                                    />
                                                                </>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </List>
                                        </Box>
                                    </Box>
                                </Card>

                                {/*Export- and edit-button*/}
                                <Box
                                    sx={{
                                        padding: '20px',
                                        backgroundColor: 'background.default',
                                    }}
                                >
                                    <Stack direction={'row'}>
                                        {submissions.length > 0 && (
                                            <SecondaryButton
                                                onClick={downloadAllSubmissions}
                                            >
                                                <Typography color="secondary.contrastText">
                                                    {t('export')}{' '}
                                                    {t('submissions')}
                                                </Typography>
                                            </SecondaryButton>
                                        )}
                                        <Box paddingLeft={'20px'} />
                                        {loading ? (
                                            <Skeleton
                                                variant={'rectangular'}
                                                width={100}
                                                height={30}
                                                sx={{
                                                    padding: 0,
                                                    margin: 0,
                                                    borderRadius: 1,
                                                    bgcolor: 'secondary.main',
                                                }}
                                            />
                                        ) : (
                                            <SecondaryButton
                                                id='adjustScores'
                                                onClick={adjustScores}
                                            >
                                                {t('adjust_scores')}
                                            </SecondaryButton>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </>
                    ) : (
                        // Rendering UI for student
                        <>
                            <Header
                                variant={'not_main'}
                                title={
                                    loading
                                        ? ''
                                        : assignment
                                          ? assignment.titel
                                          : ''
                                }
                            />
                            <Stack
                                alignContent={'center'}
                                marginTop={15}
                                direction={'column'}
                                spacing={3}
                                sx={{
                                    width: '99%',
                                    height: '99%',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                {/*deadline and groep button */}
                                <Box
                                    sx={{
                                        padding: '20px',
                                        backgroundColor: 'background.default',
                                    }}
                                >
                                    <Stack
                                        direction={'row'}
                                        position="relative"
                                    >
                                        <Box
                                            display={'flex'}
                                            flexDirection={'row'}
                                            alignItems={'center'}
                                            gap={1}
                                        >
                                            <Typography
                                                variant="h6"
                                                color="text.primary"
                                                fontWeight={'bold'}
                                            >
                                                Deadline:
                                            </Typography>
                                            {loading ? (
                                                <Skeleton
                                                    variant="text"
                                                    width={180}
                                                    height={50}
                                                />
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    color={
                                                        assignment &&
                                                        assignment.deadline &&
                                                        dayjs().isAfter(
                                                            dayjs(
                                                                assignment.deadline
                                                            )
                                                        ) &&
                                                        !assignment.extra_deadline
                                                            ? 'error.main'
                                                            : 'text.primary'
                                                    }
                                                >
                                                    {assignment &&
                                                    assignment.deadline
                                                        ? dayjs(
                                                              assignment.deadline
                                                          ).format(
                                                              'DD/MM/YYYY HH:mm'
                                                          )
                                                        : t('no_deadline')}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box style={{ flexGrow: 1 }} />
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                width={50}
                                                height={50}
                                                sx={{
                                                    bgcolor: 'secondary.main',
                                                    marginRight: 3,
                                                }}
                                            />
                                        ) : (
                                            <>
                                                {assignment?.student_groep ? (
                                                    <Button
                                                        sx={{
                                                            bgcolor:
                                                                'secondary.main',
                                                            textTransform:
                                                                'none',
                                                        }}
                                                        onClick={goToGroups}
                                                    >
                                                        <Typography color="secondary.contrastText">
                                                            {t('group')}
                                                        </Typography>
                                                    </Button>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            position:
                                                                'absolute',
                                                            top: 90,
                                                            right: 50,
                                                            display: 'flex',
                                                            justifyContent:
                                                                'flex-end',
                                                            zIndex: 1,
                                                            marginTop: '-40px',
                                                        }}
                                                    >
                                                        {assignment?.max_groep_grootte ===
                                                        1 ? (
                                                            <Typography variant="body1">
                                                                {user.first_name +
                                                                    ' ' +
                                                                    user.last_name}
                                                            </Typography>
                                                        ) : (
                                                            <>
                                                                <StudentPopUp
                                                                    students={
                                                                        studentsLoading
                                                                            ? []
                                                                            : students
                                                                    }
                                                                    text="group_members"
                                                                    noGroup={
                                                                        students.length ==
                                                                        0
                                                                    }
                                                                />
                                                            </>
                                                        )}
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                                {/*extra deadline*/}
                                {assignment?.extra_deadline && (
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                        pl={2.5}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="text.primary"
                                            fontWeight={'bold'}
                                        >
                                            Extra Deadline:
                                        </Typography>
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                width={180}
                                                height={50}
                                            />
                                        ) : (
                                            <Typography
                                                variant="h6"
                                                color={
                                                    assignment &&
                                                    assignment.deadline &&
                                                    dayjs().isAfter(
                                                        dayjs(
                                                            assignment.deadline
                                                        )
                                                    ) &&
                                                    assignment.extra_deadline &&
                                                    dayjs().isAfter(
                                                        dayjs(
                                                            assignment.extra_deadline
                                                        )
                                                    )
                                                        ? 'error.main'
                                                        : 'text.primary'
                                                }
                                            >
                                                {assignment
                                                    ? dayjs(
                                                          assignment.extra_deadline
                                                      ).format(
                                                          'DD/MM/YYYY HH:mm'
                                                      )
                                                    : 'no deadline'}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                                {/*download opgave*/}
                                <Box
                                    aria-label={'file-box'}
                                    color={'text.primary'}
                                    sx={{
                                        padding: 1,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'background.default',
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant={'h6'}
                                        fontWeight={'bold'}
                                        aria-label={'title'}
                                        margin={0}
                                    >
                                        {t('assignment') +
                                            ' ' +
                                            t('file').toLowerCase() +
                                            ':'}
                                    </Typography>
                                    <Button
                                        startIcon={<DownloadIcon />}
                                        onClick={downloadAssignment}
                                        disabled={
                                            assignment === undefined ||
                                            assignment.filename === undefined
                                        }
                                    >
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                width={100}
                                                height={50}
                                                sx={{
                                                    bgcolor: 'secondary.main',
                                                }}
                                            />
                                        ) : (
                                            <>
                                                {assignment
                                                    ? assignment.filename
                                                        ? assignment.filename
                                                        : t('no_assignmentfile')
                                                    : t('no_assignmentfile')}
                                            </>
                                        )}
                                    </Button>
                                </Box>
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    gap={1}
                                    sx={{
                                        padding: 1,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'background.default',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                        fontWeight={'bold'}
                                    >
                                        Score:
                                    </Typography>
                                    {submissions.length > 0 ? (
                                        <Typography
                                            variant="h6"
                                            color={'text.primary'}
                                        >
                                            {score
                                                ? `${score.score}/${assignment?.max_score} (${(100 * score.score) / Number(assignment?.max_score)}%)`
                                                : t('no_score_yet')}
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="h6"
                                            color={'text.primary'}
                                        >
                                            {t('no_score_yet')}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Assignment */}
                                <Card sx={{ padding: '20px', width: '95%' }}>
                                    <Stack direction={'column'}>
                                        <Typography
                                            sx={{
                                                textDecoration: 'underline',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {t('assignment') + ':'}
                                        </Typography>
                                        <Typography>
                                            {loading ? (
                                                <Skeleton
                                                    variant="text"
                                                    width={'100%'}
                                                    height={50}
                                                />
                                            ) : (
                                                <>
                                                    {assignment
                                                        ? assignment.beschrijving
                                                        : ''}
                                                </>
                                            )}
                                        </Typography>
                                    </Stack>
                                </Card>

                                {/* Submissions */}
                                <Card sx={{ width: '97%' }}>
                                    <Box
                                        aria-label={'courseHeader'}
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            height: 20,
                                            padding: 3,
                                        }}
                                    >
                                        <EvenlySpacedRow
                                            items={[
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {t('submission')}
                                                </Typography>,
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {t('time')}
                                                </Typography>,
                                                <Typography
                                                    variant={'h5'}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    Status
                                                </Typography>,
                                            ]}
                                        />
                                    </Box>
                                    <Divider />
                                    <Box
                                        style={{
                                            position: 'relative',
                                            top: '-6px',
                                            maxHeight: 340,
                                        }}
                                    >
                                        <List
                                            sx={{
                                                height: '100%',
                                                minHeight: '20vh',
                                                maxHeight: '30vh',
                                                overflowY: 'auto',
                                            }}
                                        >
                                            {loading ? (
                                                [...Array(3)].map(
                                                    (_, index) => (
                                                        <Skeleton
                                                            key={index}
                                                            variant="text"
                                                            width={'100%'}
                                                            height={50}
                                                            sx={{ margin: 0 }}
                                                        />
                                                    )
                                                )
                                            ) : (
                                                <>
                                                    {submissions.length > 0 ? (
                                                        submissions
                                                            .sort((a, b) =>
                                                                a.tijdstip <
                                                                b.tijdstip
                                                                    ? 1
                                                                    : -1
                                                            )
                                                            .map(
                                                                (
                                                                    submission,
                                                                    index
                                                                ) => (
                                                                    <Box
                                                                        key={
                                                                            submission.indiening_id
                                                                        }
                                                                    >
                                                                        {index !=
                                                                        0 ? (
                                                                            <Divider />
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                        <SubmissionListItemStudentPage
                                                                            realId={submission.indiening_id.toString()}
                                                                            visualId={(
                                                                                submissions.length -
                                                                                index
                                                                            ).toString()}
                                                                            timestamp={dayjs(
                                                                                submission.tijdstip
                                                                            ).format(
                                                                                'DD/MM/YYYY HH:mm'
                                                                            )}
                                                                            status={
                                                                                submission.status >
                                                                                0
                                                                            }
                                                                            assignment_id={
                                                                                assignmentId
                                                                                    ? assignmentId
                                                                                    : ''
                                                                            }
                                                                            course_id={
                                                                                courseId
                                                                                    ? courseId
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                )
                                                            )
                                                    ) : (
                                                        <Box
                                                            display={'flex'}
                                                            flexDirection={
                                                                'row'
                                                            }
                                                            justifyContent={
                                                                'center'
                                                            }
                                                            alignItems={
                                                                'center'
                                                            }
                                                            paddingY={2}
                                                            height={'100%'}
                                                            width={'100%'}
                                                        >
                                                            <Typography>
                                                                {t(
                                                                    'no_submissions'
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        </List>
                                    </Box>
                                </Card>

                                {/*Upload button, this is what the student will see. */}
                                <Grid container spacing={2}>
                                    {loading ||
                                    !assignment?.deadline ||
                                    (!dayjs().isAfter(
                                        dayjs(assignment.deadline)
                                    ) &&
                                        !assignment.extra_deadline) ||
                                    (assignment.extra_deadline &&
                                        !dayjs().isAfter(
                                            dayjs(assignment.extra_deadline)
                                        )) ? (
                                        <>
                                            <Grid item>
                                                <FileUploadButton
                                                    name={t('upload')}
                                                    path={
                                                        loading
                                                            ? new File(
                                                                  [],
                                                                  t('loading') +
                                                                      '...'
                                                              )
                                                            : submissionFile
                                                    }
                                                    onFileChange={
                                                        handleFileChange
                                                    }
                                                    fileTypes={['*']}
                                                    tooltip={t('uploadToolTip')}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        top: '8px',
                                                        ml: 2,
                                                    }}
                                                >
                                                    <Tooltip
                                                        title={t('upload')}
                                                    >
                                                        <SecondaryButton
                                                            onClick={
                                                                uploadIndiening
                                                            }
                                                        >
                                                            <Typography>
                                                                {t('submit')}
                                                            </Typography>
                                                        </SecondaryButton>
                                                    </Tooltip>
                                                </Box>
                                            </Grid>
                                        </>
                                    ) : null}
                                </Grid>
                            </Stack>
                            {assignment?.student_groep ? (
                                <WarningPopup
                                    title={t('error')}
                                    content={t('noGroup')}
                                    buttonName={t('join')}
                                    open={openNoGroup}
                                    handleClose={() => setOpenNoGroup(false)}
                                    doAction={handleNoGroupError}
                                />
                            ) : (
                                <Dialog
                                    open={openNoGroup}
                                    onClose={() => setOpenNoGroup(false)}
                                >
                                    <DialogTitle>{t('error')}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            {t('noGroup') +
                                                ' ' +
                                                t('contactTeacher')}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={() =>
                                                setOpenNoGroup(false)
                                            }
                                            color="primary"
                                            autoFocus
                                        >
                                            {t('ok')}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    )
}
