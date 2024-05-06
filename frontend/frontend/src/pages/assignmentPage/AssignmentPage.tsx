import { Header } from '../../components/Header.tsx'
import FileUploadButton from '../../components/FileUploadButton.tsx'
import { SubmissionListItemStudentPage } from '../../components/SubmissionListItemStudentPage.tsx'
import { SubmissionListItemTeacherPage } from '../../components/SubmissionListItemTeacherPage.tsx'
import { Button, Card, Divider } from '../../components/CustomComponents.tsx'
import { Box, List, Stack, Typography } from '@mui/material'
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

    useEffect(() => {
        async function fetchData() {
            try {
                const userResponse = await instance.get('/gebruikers/me/')
                setUser(userResponse.data)
                const assignmentResponse = await instance.get(
                    `/projecten/${assignmentId}/`
                )
                setAssignment(assignmentResponse.data)
                if (userResponse.data) {
                    if (user.is_lesgever) {
                        const groupsResponse = await instance.get(
                            `/groepen/?project=${assignmentId}`
                        )
                        setGroups(groupsResponse.data)
                    } else {
                        const submissionsResponse = await instance.get(
                            `/indieningen/?vak=${courseId}`
                        )
                        setSubmissions(submissionsResponse.data)
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData().catch((err) => console.error(err))
    }, [assignmentId, courseId, user.is_lesgever, submissionFile])

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
                `/groepen/?student=${user.user}`
            )
            if (groupResponse.data) {
                const group = groupResponse.data.find(
                    (group: Group) => String(group.project) === assignmentId
                )
                if (group) {
                    const formData = new FormData()
                    formData.append('groep', group.groep_id)
                    formData.append('indiening_bestanden', submissionFile)

                    await instance
                        .post('/indieningen/', formData, config)
                        .catch((error) => {
                            console.error(error)
                        })
                    setSubmissionFile(undefined)
                } else {
                    console.error(
                        'Group not found for assingmentId: ',
                        assignmentId
                    )
                }
            }
        }
    }

    return (
        <>
            {/* Rendering different UI based on user role */}
            {user.is_lesgever ? (
                // Rendering UI for teacher
                <>
                    <Header
                        variant={'editable'}
                        title={assignment ? assignment.titel : ''}
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
                        {/*Opgave and groep button */}
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
                            <Stack direction={'column'}>
                                <Typography
                                    variant="h5"
                                    color={'text.primary'}
                                    sx={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t('assignment')}
                                </Typography>
                                <Typography color={'text.primary'}>
                                    {assignment ? assignment.beschrijving : ''}
                                </Typography>
                            </Stack>
                            <GroupAccessComponent
                                assignmentid={parseInt(assignmentId)}
                                courseid={parseInt(courseId)}
                            />
                        </Box>

                        {/*Deadline*/}
                        <Box
                            sx={{
                                padding: '20px',
                            }}
                        >
                            <Typography variant="h5" color="text.primary">
                                <strong>Deadline </strong>
                                {assignment
                                    ? dayjs(assignment.deadline).format(
                                          'DD/MM/YYYY HH:mm'
                                      )
                                    : 'no deadline'}
                            </Typography>
                        </Box>

                        {/*Indieningen*/}
                        <Box paddingLeft={'17px'} paddingRight={'17px'}>
                            <Card
                                sx={{
                                    color: 'text.primary',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                <Box
                                    bgcolor={'primary.light'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    sx={{
                                        padding: '20px',
                                    }}
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
                                    style={{ maxHeight: 300, overflow: 'auto' }}
                                >
                                    <List disablePadding={true}>
                                        {groups.map((group) => (
                                            <Box key={group.groep_id}>
                                                <Divider
                                                    color={'text.main'}
                                                ></Divider>
                                                <Box
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    justifyContent={
                                                        'space-between'
                                                    }
                                                >
                                                    <SubmissionListItemTeacherPage
                                                        group_id={
                                                            group.groep_id
                                                                ? group.groep_id.toString()
                                                                : ''
                                                        }
                                                        assignment_id={
                                                            assignmentId
                                                        }
                                                        course_id={courseId}
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </List>
                                </Box>
                            </Card>
                        </Box>

                        {/*<AddRestrictionButton></AddRestrictionButton>*/}

                        {/* <Button sx={{bgcolor: 'secondary.main'}}>
                            <AddIcon sx={{color: "secondary.contrastText"}}></AddIcon>
                        </Button> */}

                        {/*Export- en Aanpasknop*/}
                        <Box
                            sx={{
                                padding: '20px',
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Stack direction={'row'}>
                                {submissions.length > 0 && (
                                    <Button onClick={downloadAllSubmissions}>
                                        <Typography>
                                            {t('export')} {t('submissions')}
                                        </Typography>
                                    </Button>
                                )}
                                <div style={{ flexGrow: 1 }} />
                                <Button onClick={adjustScores}>
                                    <Typography>
                                        {t('adjust_scores')}
                                    </Typography>
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </>
            ) : (
                <>
                    <Header
                        variant={'not_main'}
                        title={assignment ? assignment.titel : ''}
                    ></Header>
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
                        {/*Opgave and groep button */}
                        <Box
                            sx={{
                                padding: '20px',
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Stack direction={'row'}>
                                <Stack direction={'column'}>
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                        sx={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {t('assignment')}
                                    </Typography>
                                    <Typography color="text.primary">
                                        {assignment
                                            ? assignment.beschrijving
                                            : ''}
                                    </Typography>
                                </Stack>
                                <div style={{ flexGrow: 1 }} />
                                <Button onClick={goToGroups}>
                                    <Typography>{t('group')}</Typography>
                                </Button>
                            </Stack>
                        </Box>

                        {/*Deadline*/}
                        <Box
                            sx={{
                                padding: '20px',
                            }}
                        >
                            <Typography variant="h6" color="text.primary">
                                <strong>Deadline </strong>
                                {assignment
                                    ? dayjs(assignment.deadline).format(
                                          'DD/MM/YYYY HH:mm'
                                      )
                                    : 'no deadline'}
                            </Typography>
                        </Box>
                        {/*Indieningen*/}
                        <Box paddingLeft={'17px'} paddingRight={'17px'}>
                            <Card
                                sx={{
                                    color: 'text.primary',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                <Box
                                    bgcolor={'primary.light'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    pl={3}
                                    pr={3}
                                    padding={'30px'}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {t('submission')}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {t('time')}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Status
                                    </Typography>
                                </Box>
                                <Box
                                    style={{ maxHeight: 300, overflow: 'auto' }}
                                >
                                    <List disablePadding={true}>
                                        {submissions.map((submission) => (
                                            <Box key={submission.indiening_id}>
                                                <SubmissionListItemStudentPage
                                                    id={submission.indiening_id.toString()}
                                                    timestamp={dayjs(
                                                        submission.tijdstip
                                                    ).format(
                                                        'DD/MM/YYYY HH:mm'
                                                    )}
                                                    status={!submission.status}
                                                    assignment_id={assignmentId}
                                                    course_id={courseId}
                                                />
                                                <Divider
                                                    color={'text.main'}
                                                ></Divider>
                                            </Box>
                                        ))}
                                    </List>
                                </Box>
                            </Card>
                        </Box>
                        {/*Upload knop*/}
                        <Box
                            sx={{
                                padding: '20px',
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Stack direction={'row'}>
                                {
                                    <FileUploadButton
                                        name={t('upload')}
                                        path={submissionFile}
                                        onFileChange={handleFileChange}
                                        fileTypes={['.zip', '.pdf', '.txt']}
                                        tooltip={t('uploadToolTip')}
                                    />
                                }
                                <Box sx={{ paddingY: '8px' }}>
                                    <Button onClick={uploadIndiening}>
                                        <Typography>Confirm Upload</Typography>
                                    </Button>
                                </Box>
                                <div style={{ flexGrow: 1 }} />
                            </Stack>
                        </Box>
                    </Stack>
                </>
            )}
        </>
    )
}
