import { Header } from '../../components/Header.tsx'
import FileUploadButton from '../../components/FileUploadButton.tsx'
import { SubmissionListItemStudentPage } from '../../components/SubmissionListItemStudentPage.tsx'
import { SubmissionListItemTeacherPage } from '../../components/SubmissionListItemTeacherPage.tsx'
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Divider,
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
import { GroupAccessComponent } from '../../components/GroupAccessComponent.tsx'
import dayjs from 'dayjs'
import DownloadIcon from '@mui/icons-material/Download'
import WarningPopup from '../../components/WarningPopup.tsx'

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
    const [submissionFile, setSubmissionFile] = useState<File>()
    const [submit, setSubmit] = useState(false)
    //state for loading the page
    const [loading, setLoading] = useState(true)
    const [userLoading, setUserLoading] = useState(true)

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
            setLoading(true)
            const userResponse = await instance.get('/gebruikers/me/')
            setUser(userResponse.data)
            setUserLoading(false)
        }

        async function fetchData() {
            try {
                const assignmentResponse = await instance.get(
                    `/projecten/${assignmentId}/`
                )
                const newAssignment: Project = assignmentResponse.data
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
                setAssignment(newAssignment)
                if (user) {
                    if (user.is_lesgever) {
                        const groupsResponse = await instance.get(
                            `/groepen/?project=${assignmentId}`
                        )
                        setGroups(groupsResponse.data)
                    } else {
                        const groupResponse = await instance.get<[Group]>(
                            `/groepen/?student=${user.user}&project=${assignmentId}`
                        )
                        if (groupResponse.data.length > 0){
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

    // Function to download all submissions as a zip file
    const downloadAllSubmissions = () => {
        const zip = new JSZip()
        const downloadPromises: Promise<void>[] = []
        submissions.forEach(submission => {
            downloadPromises.push(
                new Promise(async (resolve, reject) => {
                    try {
                        // Get the submission details
                        const submissionResponse = await instance.get(
                            `/indieningen/${submission.indiening_id}/`
                        );
                        const newSubmission = submissionResponse.data;
                        // Get the submission file
                        const fileResponse = await instance.get(
                            `/indieningen/${submission.indiening_id}/indiening_bestand/`,
                            { responseType: 'blob' }
                        );
                        let filename = 'indiening.zip';
                        if (newSubmission.bestand) {
                            filename = newSubmission.bestand.replace(/^.*[\\/]/, '');
                        }
                        const blob = new Blob([fileResponse.data], {
                            type: fileResponse.headers['content-type'],
                        });
                        const file = new File([blob], filename, {
                            type: fileResponse.headers['content-type'],
                        });
                        newSubmission.bestand = file;
                        newSubmission.filename = filename;
                        // Add the file to the zip
                        zip.file(filename, fileResponse.data);
                        resolve(newSubmission);
                    } catch (err) {
                        console.error(`Error downloading submission:`, err);
                        reject(err);
                    }
                })
            );
        })
        Promise.all(downloadPromises)
            .then(() => {
                zip.generateAsync({ type: 'blob' })
                    .then((blob) => {
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'all_submissions_' + assignment?.titel + '_.zip'
                        document.body.appendChild(a)
                        a.click()
                        a.remove()
                    })
                    .catch((err) => {
                        console.error('Error generating zip file:', err)
                    })
            })
            .catch((err) => {
                console.error('Error downloading submissions:', err)
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
                    <CircularProgress color={'primary'} />
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
                                spacing={4}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'background.default',
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
                                            {assignment?.beschrijving}
                                        </Typography>
                                    </Stack>
                                </Box>
                                {/*deadline and group button */}
                                <Box
                                    sx={{
                                        padding: '20px',
                                        backgroundColor: 'background.default',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
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
                                                variant={'h6'}
                                                color={'text.primary'}
                                            >
                                                {assignment
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
                                        <GroupAccessComponent
                                            assignmentid={parseInt(
                                                assignmentId
                                            )}
                                            courseid={parseInt(courseId)}
                                        />
                                    )}
                                </Box>

                                {/* Assignment description */}
                                <Card
                                    elevation={1}
                                    sx={{
                                        color: 'text.primary',
                                        padding: '20px',
                                        backgroundColor: 'background.default',
                                        borderRadius: 2,
                                    }}
                                >
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
                                <Card
                                    elevation={1}
                                    sx={{
                                        color: 'text.primary',
                                        backgroundColor: 'background.default',
                                        borderRadius: 2,
                                        padding: '20px',
                                    }}
                                >
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        justifyContent={'space-between'}
                                        pl={3}
                                        pr={3}
                                    >
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {t('group')}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {t('time')}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Score
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Status
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {t('download')}
                                        </Typography>
                                    </Box>
                                    <Box
                                        style={{
                                            maxHeight: '40vh',
                                            overflow: 'auto',
                                        }}
                                    >
                                        <Divider color={'text.main'}></Divider>
                                        {loading ? (
                                            [...Array(3)].map((_, index) => (
                                                <Skeleton
                                                    key={index}
                                                    variant="text"
                                                    width={'100%'}
                                                    height={50}
                                                    sx={{ margin: 0 }}
                                                />
                                            ))
                                        ) : (
                                            <List disablePadding={true}>
                                                {groups.map((group) => (
                                                    <Box key={group.groep_id}>
                                                        <Divider
                                                            color={'text.main'}
                                                        ></Divider>
                                                        <Box
                                                            display={'flex'}
                                                            flexDirection={
                                                                'row'
                                                            }
                                                            justifyContent={
                                                                'space-between'
                                                            }
                                                            pl={3}
                                                            pr={3}
                                                        >
                                                            <SubmissionListItemTeacherPage
                                                                relative_group_id={(
                                                                    group.groep_id -
                                                                    Math.min(
                                                                        ...groups.map(
                                                                            (
                                                                                group
                                                                            ) =>
                                                                                group.groep_id
                                                                        )
                                                                    ) +
                                                                    1
                                                                ).toString()}
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
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </List>
                                        )}
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
                                            <Button
                                                sx={{
                                                    bgcolor: 'secondary.main',
                                                    textTransform: 'none',
                                                }}
                                                onClick={downloadAllSubmissions}
                                            >
                                                <Typography color="secondary.contrastText">
                                                    {t('export')}{' '}
                                                    {t('submissions')}
                                                </Typography>
                                            </Button>
                                        )}
                                        <Box style={{ flexGrow: 1 }} />
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
                                            <Button
                                                sx={{
                                                    bgcolor: 'secondary.main',
                                                    textTransform: 'none',
                                                }}
                                                onClick={adjustScores}
                                            >
                                                <Typography color="secondary.contrastText">
                                                    {t('adjust_scores')}
                                                </Typography>
                                            </Button>
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
                                spacing={4}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                {/*assignment description*/}
                                <Box
                                    aria-label={'assignment-box'}
                                    sx={{
                                        padding: '5px',
                                    }}
                                >
                                    <Stack direction={'column'}>
                                        {loading ? (
                                            <Skeleton
                                                variant="text"
                                                width={200}
                                                height={50}
                                            />
                                        ) : (
                                            <>
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
                                                <Typography
                                                    color={'text.primary'}
                                                >
                                                    {assignment?.beschrijving}
                                                </Typography>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                                {/*deadline and groep button */}
                                <Box
                                    sx={{
                                        padding: '20px',
                                        backgroundColor: 'background.default',
                                    }}
                                >
                                    <Stack direction={'row'}>
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
                                                <>
                                                    {assignment !== undefined &&
                                                        assignment.deadline !==
                                                            null && (
                                                            <Typography
                                                                variant="h6"
                                                                color={
                                                                    'text.primary'
                                                                }
                                                            >
                                                                {assignment
                                                                    ? dayjs(
                                                                          assignment.deadline
                                                                      ).format(
                                                                          'DD/MM/YYYY-HH:MM'
                                                                      )
                                                                    : 'no deadline'}
                                                            </Typography>
                                                        )}
                                                </>
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
                                                {assignment?.student_groep && (
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
                                                color={'text.primary'}
                                            >
                                                {assignment
                                                    ? dayjs(
                                                          assignment.extra_deadline
                                                      ).format(
                                                          'DD/MM/YYYY-HH:MM'
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
                                        disabled={assignment === undefined}
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
                                                    : t('no_assignmentfile')}
                                            </>
                                        )}
                                    </Button>
                                </Box>

                                {/* Assignment */}
                                <Card
                                    elevation={1}
                                    sx={{
                                        color: 'text.primary',
                                        padding: '20px',
                                        backgroundColor: 'background.default',
                                        borderRadius: 2,
                                    }}
                                >
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
                                <Card
                                    elevation={1}
                                    sx={{
                                        color: 'text.primary',
                                        backgroundColor: 'background.default',
                                        borderRadius: 2,
                                        padding: 2,
                                    }}
                                >
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        justifyContent={'space-between'}
                                        pl={3}
                                        pr={3}
                                    >
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {t('submission')}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {t('time')}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            Status
                                        </Typography>
                                    </Box>
                                    <Box
                                        style={{
                                            maxHeight: '40vh',
                                        }}
                                    >
                                        <Divider color={'text.main'}></Divider>
                                        <List
                                            disablePadding={true}
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
                                                                    submission
                                                                ) => (
                                                                    <Box
                                                                        key={
                                                                            submission.indiening_id
                                                                        }
                                                                    >
                                                                        <Divider
                                                                            color={
                                                                                'text.main'
                                                                            }
                                                                        ></Divider>
                                                                        <Box
                                                                            display={
                                                                                'flex'
                                                                            }
                                                                            flexDirection={
                                                                                'row'
                                                                            }
                                                                            justifyContent={
                                                                                'space-between'
                                                                            }
                                                                            pl={
                                                                                3
                                                                            }
                                                                            pr={
                                                                                3
                                                                            }
                                                                        >
                                                                            <SubmissionListItemStudentPage
                                                                                realId={submission.indiening_id.toString()}
                                                                                visualId={(
                                                                                    submission.indiening_id -
                                                                                    Math.min(
                                                                                        ...submissions.map(
                                                                                            (
                                                                                                submission
                                                                                            ) =>
                                                                                                submission.indiening_id
                                                                                        )
                                                                                    ) +
                                                                                    1
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
                                <Box
                                    sx={{
                                        width: '100%',
                                        backgroundColor: 'background.default',
                                    }}
                                >
                                    <Stack
                                        direction={'row'}
                                        alignItems={'flex-start'}
                                        justifyContent={'flex-end'}
                                        width={'100%'}
                                    >
                                        {
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
                                                onFileChange={handleFileChange}
                                                fileTypes={[
                                                    '.zip',
                                                    '.pdf',
                                                    '.txt',
                                                ]}
                                                tooltip={t('uploadToolTip')}
                                            />
                                        }
                                        <Box
                                            sx={{
                                                padding: 1.2,
                                                mr: 3,
                                            }}
                                        >
                                            <Tooltip title={t('upload')}>
                                                <Button
                                                    variant={'contained'}
                                                    disableElevation
                                                    sx={{
                                                        textTransform: 'none',
                                                    }}
                                                    onClick={uploadIndiening}
                                                >
                                                    <Typography
                                                        padding={0}
                                                        margin={0}
                                                    >
                                                        {t('submit')}
                                                    </Typography>
                                                </Button>
                                            </Tooltip>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Stack>
                            <WarningPopup
                                title={t('error')}
                                content={
                                    t('noGroup') +
                                    (assignment?.student_groep
                                        ? t('chooseGroup')
                                        : t('contactTeacher'))
                                }
                                buttonName={
                                    assignment?.student_groep
                                        ? t('join')
                                        : t('ok')
                                }
                                open={openNoGroup}
                                handleClose={() => setOpenNoGroup(false)}
                                doAction={handleNoGroupError}
                            />
                        </>
                    )}
                </>
            )}
        </>
    )
}
