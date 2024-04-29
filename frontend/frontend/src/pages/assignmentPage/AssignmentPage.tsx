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
import { Group } from '../groupsPage/GroupsPage.tsx'
import { Submission } from '../submissionPage/SubmissionPage.tsx'
import { Project } from '../scoresPage/ProjectScoresPage.tsx'
import { GroupAccessComponent } from '../../components/GroupAccessComponent.tsx'
import dayjs from 'dayjs'
import DownloadIcon from '@mui/icons-material/Download'

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
        navigate(`/course/${courseId}/assignment/${assignmentId}/groups`)
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

    //loading variables, used to display loaders when fetching data
    const [loading, setLoading] = useState(true)
    const [loadingUser, setLoadingUser] = useState(true)
    useEffect(() => {
        async function fetchData() {
            try {
                setLoadingUser(true)
                const userResponse = await instance.get('/gebruikers/me/')
                setUser(userResponse.data)
                setLoadingUser(false)
                setLoading(true)
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
                if (userResponse.data) {
                    if (user.is_lesgever) {
                        const groupsResponse = await instance.get(
                            `/groepen/?project=${assignmentId}`
                        )
                        setGroups(groupsResponse.data)
                    } else {
                        //FIXME : change to get submissions for student
                        const submissionsResponse = await instance.get(
                            `/indieningen/?vak=${courseId}`
                        )
                        setSubmissions(submissionsResponse.data)
                    }
                }
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData().catch((err) => console.error(err))
    }, [assignmentId, courseId, user.is_lesgever])

    // Function to download all submissions as a zip file
    const downloadAllSubmissions = () => {
        const zip = new JSZip()
        const downloadPromises: Promise<void>[] = []
        submissions.forEach((submission, index) => {
            // Iterating over submissions and creating promises for each download
            downloadPromises.push(
                new Promise((resolve, reject) => {
                    instance
                        .get(
                            `/indieningen/${submission.indiening_id}/indiening_bestanden/`,
                            { responseType: 'blob' }
                        )
                        .then((res) => {
                            let filename = 'lege_indiening_zip.zip'
                            if (submission.indiening_bestanden.length > 0) {
                                filename =
                                    submission.indiening_bestanden[0].bestand.replace(
                                        /^.*[\\/]/,
                                        ''
                                    )
                            }
                            if (filename !== 'lege_indiening_zip.zip') {
                                zip.file(filename, res.data)
                            }
                            resolve()
                        })
                        .catch((err) => {
                            console.error(
                                `Error downloading submission ${index + 1}:`,
                                err
                            )
                            reject(err)
                        })
                })
            )
        })
        Promise.all(downloadPromises)
            .then(() => {
                zip.generateAsync({ type: 'blob' })
                    .then((blob) => {
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'all_submissions.zip'
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
    const uploadIndiening = async () => {
        if (submissionFile) {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            const groupResponse = await instance.get(
                `/groepen/?project=${assignmentId}`
            )
            if (groupResponse.data) {
                const group = groupResponse.data[0]
                const formData = new FormData()
                formData.append('groep', group.groep_id)
                formData.append('indiening_bestanden', submissionFile)

                await instance
                    .post('/indieningen/', formData, config)
                    .catch((error) => {
                        console.error(error)
                    })
                setSubmissionFile(undefined)
            }
        }
    }

    return (
        <>
            {/* Rendering different UI based on user role */}
            {loadingUser ? (
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                >
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        marginTop={10}
                        width={'100%'}
                        height={'100%'}
                        alignItems={'center'}
                    >
                        <CircularProgress color={'primary'} />
                    </Box>
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
                                {/*deadline and groep button */}
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
                                                          'DD/MM/YYYY-HH:MM'
                                                      )
                                                    : 'no deadline'}
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

                                {/*Opgave*/}
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

                                {/*Indieningen*/}
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
                                                                group_id={
                                                                    group.groep_id
                                                                        ? group.groep_id.toString()
                                                                        : ''
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
                                                ))}
                                            </List>
                                        )}
                                    </Box>
                                </Card>

                                {/*Export- en Aanpasknop*/}
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
                        <>
                            {/* Rendering UI for student */}
                            <Header
                                variant={'not_main'}
                                title={
                                    loading
                                        ? ''
                                        : assignment
                                          ? assignment.titel
                                          : ''
                                }
                            ></Header>
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
                                                <Typography
                                                    variant="h6"
                                                    color={'text.primary'}
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
                                        </Box>
                                        <Box flexGrow={1} />
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
                                                    : 'error'}
                                            </>
                                        )}
                                    </Button>
                                </Box>
                                {/*Opgave*/}
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

                                {/*Indieningen*/}
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
                                                        submissions.map(
                                                            (submission) => (
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
                                                                        pl={3}
                                                                        pr={3}
                                                                    >
                                                                        <SubmissionListItemStudentPage
                                                                            id={submission.indiening_id.toString()}
                                                                            timestamp={dayjs(
                                                                                submission.tijdstip
                                                                            ).toDate()}
                                                                            status={
                                                                                !submission.status
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

                                {/*Upload knop*/}
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
                                        <FileUploadButton
                                            name={t('upload')}
                                            path={
                                                loading
                                                    ? new File(
                                                          [],
                                                          t('loading') + '...'
                                                      )
                                                    : submissionFile
                                            }
                                            onFileChange={handleFileChange}
                                            fileTypes={['.zip']}
                                            tooltip={t('uploadToolTip')}
                                        />
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
                        </>
                    )}
                </>
            )}
        </>
    )
}
