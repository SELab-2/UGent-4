import { Header } from '../../components/Header.tsx'
import { useParams } from 'react-router-dom'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { Button, Card, Divider } from '../../components/CustomComponents.tsx'
import StudentPopUp from '../subjectsPage/StudentPopUp.tsx'
import {
    Box,
    CircularProgress,
    ListItem,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import DownloadIcon from '@mui/icons-material/Download'
import List from '@mui/material/List'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import instance from '../../axiosConfig.ts'
import { getAssignment } from '../addChangeAssignmentPage/AddChangeAssignmentPage.tsx'
import ErrorPage from '../ErrorPage.tsx'
import { User } from '../subjectsPage/AddChangeSubjectPage.tsx'

/**
 * Page for viewing a specific submission
 * The page should take the necessary data from the backend according to the id present in the url and the logged-in user
 * The page should display the deadline, the assignment, the filename and the restrictions of the submission
 * The page should also allow the user to download the submission and any restriction artifacts that are present
 */

// Define an enum for submission status
enum SubmissionStatus {
    FAIL = -1,
    PENDING = 0,
    PASSED = 1,
}

// Define the structure of a submission
export interface Submission {
    indiening_id: number
    groep: number
    bestand: File
    tijdstip: Dayjs
    status: SubmissionStatus
    result: string
    filename?: string
}

// Define the structure of a restriction
interface Restriction {
    restrictie_id: number
    project: number
    script: string
    moet_slagen: boolean
    artifact?: number
}

export function SubmissionPage() {
    // Extract assignmentId and submissionId from URL parameters
    const { assignmentId, submissionId } = useParams() as {
        assignmentId: string
        submissionId: string
    }
    // state variables
    const [submission, setSubmission] = useState<Submission>()
    const [project, setProject] = useState<getAssignment>()
    const [restrictions, setRestrictions] = useState<Restriction[]>([])
    const [fetchError, setFetchError] = useState(false)
    const [students, setStudents] = useState<User[]>([])
    const [user, setUser] = useState({
        user: 0,
        is_lesgever: false,
        first_name: '',
        last_name: '',
        email: '',
    })

    //state to manage proper loading
    const [loading, setLoading] = useState(true)
    const [studentsLoading, setStudentsLoading] = useState(true)

    // Function to download an artifact
    const downloadArtifacts = () => {
        //TODO: test when changes are pulled to the backend
        instance
            .get(`/indieningen/${submissionId}/artefacten/`, {
                responseType: 'blob',
            })
            .then((res) => {
                const url = window.URL.createObjectURL(res.data)
                const a = document.createElement('a')
                a.href = url
                a.download = 'artifacts.zip'
                document.body.appendChild(a)
                a.click()
                a.remove()
            })
    }

    // Function to download the submission
    const downloadSubmission = () => {
        if (submission?.bestand) {
            const url = window.URL.createObjectURL(submission?.bestand)
            const a = document.createElement('a')
            a.href = url
            a.download = submission.filename
                ? submission.filename
                : 'opgave.zip'
            document.body.appendChild(a)
            a.click()
            a.remove()
        }
    }

    useEffect(() => {
        //get the project data

        const fetchdata = async () => {
            setLoading(true)
            try {
                const res = await instance.get<getAssignment>(
                    `/projecten/${assignmentId}/`
                )
                setProject(res.data)

                //Get the restrictions for the submission
                const restrictions = await instance.get<Restriction[]>(
                    `/restricties/?project=${assignmentId}`
                )
                setRestrictions(restrictions.data)

                const submissionResponse = await instance.get(
                    `indieningen/${submissionId}/`
                )
                //Get the submission file
                const newSubmission: Submission = submissionResponse.data

                if (newSubmission.result !== 'No tests: OK') {
                    const regex = /Testing (.*):/g
                    const matches = newSubmission.result.match(regex)
                    if (matches !== null) {
                        matches.map((match) => {
                            match.replace(':', '\n')
                            return match
                        })
                    }
                }
                newSubmission.filename =
                    submissionResponse.data.bestand.replace(/^.*[\\/]/, '')
                newSubmission.bestand = await instance
                    .get(`/indieningen/${submissionId}/indiening_bestand`, {
                        responseType: 'blob',
                    })
                    .then((res) => {
                        let filename = 'indiening.zip'
                        if (newSubmission.filename) {
                            filename = newSubmission.filename
                        }
                        const blob = new Blob([res.data], {
                            type: res.headers['content-type'],
                        })
                        const file: File = new File([blob], filename, {
                            type: res.headers['content-type'],
                        })
                        return file
                    })
                setSubmission(newSubmission)
                // Get the current user
                const userResponse = await instance.get('/gebruikers/me/')
                setUser(userResponse.data)
            } catch (err) {
                console.error(err)
                setFetchError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchdata().catch((err) => {
            console.error(err)
            setFetchError(true)
        })
    }, [assignmentId, submissionId])

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const response = await instance.get(
                    '/indieningen/' + submissionId + '/'
                )
                if (response.data.status === 0) {
                    setSubmission(response.data)
                    console.log('Data:', response.data)
                } else {
                    console.log('Status is not 0, stopping requests.')
                    clearInterval(intervalId)
                }
            } catch (err) {
                console.error('Error:', err)
                clearInterval(intervalId)
            }
        }, 2000) // 2000 milliseconds = 2 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId)
    }, [submissionId])

    useEffect(() => {
        async function fetchStudents() {
            setStudentsLoading(true)
            const groupId = submission?.groep
            const groupResponse = await instance.get(`groepen/${groupId}`)
            const temp_students = []
            for (const s of groupResponse.data.studenten || []) {
                try {
                    const userResponse = await instance.get(`/gebruikers/${s}/`)
                    temp_students.push(userResponse.data)
                } catch (error) {
                    console.error('Error fetching student data:', error)
                    setFetchError(true)
                }
            }
            // Update the state with the fetched data
            setStudents(temp_students)
            setStudentsLoading(false)
        }

        // Fetch students
        fetchStudents().catch((error) =>
            console.error('Error fetching students data:', error)
        )
    }, [submission])

    if (fetchError) {
        return <ErrorPage />
    }

    // Render the submission page
    return (
        <>
            <Grid2 container spacing={2}>
                <Header
                    variant={'not_main'}
                    title={
                        loading ? '' : project?.titel + ': ' + t('submission')
                    }
                />
                <Box
                    sx={{
                        marginTop: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                        gap: 2,
                        overflowY: 'auto',
                        padding: 2,
                        position: 'relative',
                    }}
                >
                    <Box
                        aria-label={'assignment-box'}
                        sx={{
                            padding: '20px',
                        }}
                    >
                        <Stack direction={'column'}>
                            <Typography
                                variant={'h5'}
                                color={'text.primary'}
                                aria-label={'title'}
                                sx={{
                                    fontWeight: 'bold',
                                }}
                            >
                                {t('assignment')}
                            </Typography>
                            <Typography color={'text.primary'}>
                                {project?.beschrijving}
                            </Typography>
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 90,
                            right: 50,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            zIndex: 1,
                            marginTop: '-40px',
                        }}
                    >
                        {project?.max_groep_grootte === 1 ? (
                            <Typography variant="body1">
                                {user.first_name + ' ' + user.last_name}
                            </Typography>
                        ) : (
                            <StudentPopUp
                                students={studentsLoading ? [] : students}
                                text="group_members"
                            />
                        )}
                    </Box>
                    {project?.deadline && (
                        <Box
                            aria-label={'deadline'}
                            sx={{
                                padding: '20px',
                            }}
                        >
                            <Typography variant={'h5'} color="text.primary">
                                <strong>Deadline </strong>
                                {project?.deadline
                                    ? dayjs(project.deadline).format(
                                          'DD/MM/YYYY HH:mm'
                                      )
                                    : 'error'}
                            </Typography>
                        </Box>
                    )}
                    {project?.extra_deadline && (
                        <Box
                            aria-label={'extradeadline'}
                            sx={{
                                padding: '20px',
                            }}
                        >
                            <Typography variant={'h5'} color="text.primary">
                                <strong>Extra Deadline </strong>
                                {project?.extra_deadline
                                    ? dayjs(project.extra_deadline).format(
                                          'DD/MM/YYYY HH:mm'
                                      )
                                    : 'error'}
                            </Typography>
                        </Box>
                    )}
                    <Box
                        // This box shows the filename of the submission and
                        // allows the user to download the submission.
                        aria-label={'file-box'}
                        color={'text.primary'}
                        sx={{
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'background.default',
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant={'h5'}
                            fontWeight={'bold'}
                            aria-label={'title'}
                            margin={0}
                        >
                            {t('filename')}
                        </Typography>
                        <Button
                            startIcon={<DownloadIcon />}
                            onClick={downloadSubmission}
                        >
                            {loading ? (
                                <Skeleton
                                    variant={'text'}
                                    width={120}
                                    sx={{ bgcolor: 'secondary.main' }}
                                />
                            ) : (
                                <>
                                    {submission ? submission.filename : 'error'}
                                </>
                            )}
                        </Button>
                    </Box>
                    <Card
                        // This card shows the restrictions for the submission.
                        aria-label={'restrictions'}
                        sx={{
                            padding: '20px',
                            maxWidth: '60%',
                            height: '20vh',
                        }}
                    >
                        <Typography variant={'h5'} fontWeight={'bold'}>
                            {t('restrictions')}
                        </Typography>
                        <Box sx={{ padding: 1 }}>
                            <List sx={{ maxHeight: '13vh', overflowY: 'auto' }}>
                                {loading ? (
                                    [...Array(3).keys()].map((index) => (
                                        <Skeleton
                                            width={'100%'}
                                            height={30}
                                            key={index}
                                            variant={'text'}
                                        />
                                    ))
                                ) : (
                                    <>
                                        {restrictions.length > 0 ? (
                                            restrictions.map(
                                                (restriction, index) => {
                                                    return (
                                                        <Box key={index}>
                                                            <ListItem
                                                                sx={{
                                                                    gap: 4,
                                                                    justifyContent:
                                                                        'space-between',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant={
                                                                        'body1'
                                                                    }
                                                                    fontWeight={
                                                                        'bold'
                                                                    }
                                                                >
                                                                    {
                                                                        restriction.script
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant={
                                                                        'body1'
                                                                    }
                                                                >
                                                                    {
                                                                        restriction.restrictie_id
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant={
                                                                        'body1'
                                                                    }
                                                                >
                                                                    {restriction.moet_slagen
                                                                        ? 'Moet slagen'
                                                                        : 'Mag falen'}
                                                                </Typography>
                                                                {restriction.artifact && (
                                                                    <Button
                                                                        onClick={
                                                                            downloadArtifacts
                                                                        }
                                                                        startIcon={
                                                                            <DownloadIcon />
                                                                        }
                                                                    >
                                                                        Download
                                                                        artifact
                                                                    </Button>
                                                                )}
                                                            </ListItem>
                                                            <Divider />
                                                        </Box>
                                                    )
                                                }
                                            )
                                        ) : (
                                            <Box
                                                width={'100%'}
                                                display={'flex'}
                                                justifyContent={'center'}
                                            >
                                                <Typography fontWeight={'bold'}>
                                                    {t('no_restrictions')}
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </List>
                        </Box>
                    </Card>
                    <Box
                        // This box shows the status and result of the submission.
                        aria-label={'result-box'}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'background.default',
                            color: 'text.primary',
                            gap: 2,
                        }}
                    >
                        <Box
                            // This box shows the status of the submission.
                            aria-label={'status-box'}
                            sx={{
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'background.default',
                                color: 'text.primary',
                                gap: 2,
                            }}
                        >
                            <Typography variant={'h5'} fontWeight={'bold'}>
                                {t('status') + ':'}
                            </Typography>
                            {loading ? (
                                <Skeleton
                                    variant={'text'}
                                    width={120}
                                    height={40}
                                />
                            ) : (
                                <Typography
                                    variant={'body1'}
                                    color={
                                        submission?.status ===
                                        SubmissionStatus.PASSED
                                            ? 'green'
                                            : 'red'
                                    }
                                >
                                    {submission?.status ===
                                    SubmissionStatus.PENDING
                                        ? t('pending')
                                        : submission?.status ===
                                            SubmissionStatus.PASSED
                                          ? t('passed')
                                          : t('failed')}
                                </Typography>
                            )}
                        </Box>
                        <Card
                            // This card shows the result of the submission.
                            aria-label={'result-box'}
                            sx={{
                                padding: '20px',
                                color: 'text.primary',
                                gap: 2,
                                maxHeight: '15vh',
                            }}
                        >
                            <Typography variant={'h5'} fontWeight={'bold'}>
                                {t('result')}
                            </Typography>
                            <Box sx={{ padding: 1 }}>
                                {submission?.status ===
                                    SubmissionStatus.FAIL && (
                                    <Typography
                                        variant={'body1'}
                                        color={'error'}
                                    >
                                        {submission.result}
                                    </Typography>
                                )}
                                {submission?.status ===
                                    SubmissionStatus.PASSED && (
                                    <Typography
                                        variant={'body1'}
                                        color={'success'}
                                    >
                                        {submission.result}
                                    </Typography>
                                )}
                                {submission?.status ===
                                    SubmissionStatus.PENDING && (
                                    <CircularProgress color={'primary'} />
                                )}
                            </Box>
                        </Card>
                    </Box>
                </Box>
            </Grid2>
        </>
    )
}
