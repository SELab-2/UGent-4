import { Header } from '../../components/Header'
import { Card, SecondaryButton } from '../../components/CustomComponents.tsx'
import {
    Box,
    CircularProgress,
    IconButton,
    Skeleton,
    Stack,
    styled,
    Tooltip,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { StudentsView } from './StudentsView.tsx'
import { t } from 'i18next'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import { ChangeEvent, useEffect, useState } from 'react'
import instance from '../../axiosConfig.ts'
import WarningPopup from '../../components/WarningPopup.tsx'
import ErrorPage from '../ErrorPage.tsx'
import JSZip from 'jszip'
import Papa from 'papaparse'
import { User } from '../subjectsPage/AddChangeSubjectPage.tsx'
import { Submission } from '../submissionPage/SubmissionPage.tsx'

const VisuallyHiddenInput = styled('input')({
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

export interface Project {
    project_id: number
    titel: string
    beschrijving: string
    opgave_bestand: File
    vak: number
    max_score: number
    max_groep_grootte: number
    student_groep?: boolean
    deadline: Date | null
    extra_deadline: Date | null
    zichtbaar: boolean
    gearchiveerd: boolean
    filename?: string
}

interface Groep {
    groep_id: number
    studenten: number[]
    project: number
}

export interface Indiening {
    indiening_id: number
    groep: number
    bestand: File
    tijdstip: Date
    status: number
    result: string
}

interface Score {
    score_id?: number
    score?: number
    indiening?: number
}

export interface ScoreGroep {
    group: Groep
    group_number: number
    lastSubmission?: Indiening
    score?: Score
}

export function ProjectScoresPage() {
    // Extract assignmentId and submissionId from URL parameters
    const { courseId, assignmentId } = useParams() as {
        courseId: string
        assignmentId: string
    }

    // State variables
    const [openSaveScoresPopup, setOpenSaveScoresPopup] = useState(false)
    const [openDeleteScoresPopup, setOpenDeleteScoresPopup] = useState(false)

    const [project, setProject] = useState<Project>()
    const [groepen, setGroepen] = useState<ScoreGroep[]>([])
    const [fetchError, setFetchError] = useState(false)
    const [user, setUser] = useState<User>()

    // State for loading the page properly
    const [loading, setLoading] = useState(true)
    const [userLoading, setUserLoading] = useState(true)

    const navigate = useNavigate()

    // Function to handle the 'Export Submissions' button
    const exportSubmissions = () => {
        console.log('export submissions')
        downloadAllSubmissions()
    }

    const uploadScores = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('upload scores')
        handleParse(e)
    }

    const saveScores = async () => {
        console.log('save scores')

        for (const groep of groepen) {
            const score = groep.score
            if (score !== undefined && groep.lastSubmission !== undefined) {
                try {
                    if (score.score_id !== undefined) {
                        await instance.put(`/scores/${score.score_id}/`, score)
                    } else {
                        await instance.post(`/scores/`, {
                            score: score.score,
                            indiening: groep.lastSubmission.indiening_id,
                        })
                    }
                } catch (error) {
                    console.error('Error updating data:', error)
                }
            }
        }

        navigate(`/course/${courseId}/assignment/${assignmentId}`)
    }

    const deleteScores = () => {
        console.log('delete scores')
        navigate(`/course/${courseId}/assignment/${assignmentId}`)
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setUserLoading(true)
                setLoading(true)
                const userResponse = await instance.get('/gebruikers/me/')
                setUser(userResponse.data)
                setUserLoading(false)
                const assignmentResponse = await instance.get(
                    `/projecten/${assignmentId}/`
                )
                setProject(assignmentResponse.data)
            } catch (error) {
                console.log('Error fetching data:', error)
                setFetchError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData().catch((e) => console.error(e))
    }, [assignmentId])

    const downloadAllSubmissions = () => {
        const zip = new JSZip()
        const downloadPromises: Promise<Submission>[] = []

        groepen
            .filter((groep) => groep.lastSubmission !== undefined)
            .map((groep) => groep.lastSubmission)
            .forEach((submission) => {
                downloadPromises.push(
                    (async () => {
                        try {
                            // Get the submission details
                            const submissionResponse = await instance.get(
                                `/indieningen/${submission?.indiening_id}/`
                            )
                            const newSubmission = submissionResponse.data
                            // Get the submission file
                            const fileResponse = await instance.get(
                                `/indieningen/${submission?.indiening_id}/indiening_bestand/`,
                                { responseType: 'blob' }
                            )
                            let filename = 'indiening.zip'
                            if (newSubmission.bestand) {
                                filename = newSubmission.bestand.replace(
                                    /^.*[\\/]/,
                                    ''
                                )
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
                            return newSubmission // Return the submission instead of resolving a promise
                        } catch (err) {
                            console.error(`Error downloading submission:`, err)
                            throw err // Throw error instead of rejecting a promise
                        }
                    })() // Immediately invoke the async function
                )
            })

        Promise.all(downloadPromises)
            .then(() => {
                zip.generateAsync({ type: 'blob' })
                    .then((blob) => {
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download =
                            'all_submissions_' + project?.titel + '_.zip'
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

    interface ScoreEntry {
        groep: string
        score: string
    }

    // Way to handle csv-file
    const handleParse = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null && e.target.files.length) {
            const inputFile = e.target.files[0]

            Papa.parse<ScoreEntry>(inputFile, {
                header: true,
                complete: (results) => {
                    const parsedData = results.data
                    setScores(parsedData)
                },
                error: (error) => {
                    console.error('Error parsing CSV file:', error)
                },
            })
        } else {
            alert('Enter a valid file')
        }
    }

    const setScores = (data: ScoreEntry[]) => {
        for (const entry of data) {
            const groupNumber = parseInt(entry.groep)
            const score = parseInt(entry.score)

            const index = groepen.findIndex(
                (groep) => groep.group_number === groupNumber
            )
            if (index !== -1) {
                changeScore(index, score)
            }
        }
        saveScores().catch((e) => console.error(e))
    }

    const changeScore = (index: number, score: number) => {
        const newGroepen = groepen
        newGroepen[index] = {
            ...newGroepen[index],
            score: {
                ...newGroepen[index].score,
                score: score,
            },
        }
        setGroepen(newGroepen)
    }

    if (fetchError) {
        return <ErrorPage />
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
                    <Box></Box>
                </Box>
            ) : (
                <>
                    {user?.is_lesgever ? (
                        // Rendering UI for teacher
                        <>
                            <Stack
                                direction={'column'}
                                spacing={0}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'background.default',
                                }}
                            >
                                <Header
                                    variant={'default'}
                                    title={
                                        loading
                                            ? ''
                                            : project?.titel + ': Scores'
                                    }
                                />
                                {/* Main content box */}

                                <Card
                                    sx={{
                                        marginTop: 12,
                                    }}
                                >
                                    {/* Render StudentsView component if project is defined */}
                                    {loading ? (
                                        <Box
                                            display={'flex'}
                                            justifyContent={'center'}
                                            flexGrow={1}
                                        >
                                            <CircularProgress
                                                color={'primary'}
                                            />
                                        </Box>
                                    ) : (
                                        <>
                                            {project && (
                                                <StudentsView
                                                    project={project}
                                                    groepen={groepen}
                                                    setGroepen={setGroepen}
                                                    changeScore={changeScore}
                                                />
                                            )}
                                        </>
                                    )}
                                </Card>
                                {/* Footer section with action buttons */}
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    sx={{
                                        marginTop: -4,
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        padding={'3px'}
                                        sx={{ width: '50%', height: 'auto' }}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                            marginY={6}
                                        >
                                            <SecondaryButton
                                                onClick={exportSubmissions}
                                            >
                                                {t('export_submissions')}
                                            </SecondaryButton>

                                            <SecondaryButton
                                                variant={'contained'}
                                            >
                                                {t('upload_scores')}
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    value={undefined}
                                                    accept={['.csv'].join(',')}
                                                    multiple={false}
                                                    onChange={uploadScores}
                                                />
                                            </SecondaryButton>
                                        </Stack>
                                    </Box>
                                    <Box
                                        display="flex"
                                        flexDirection="row-reverse"
                                        padding={'3px'}
                                        sx={{
                                            width: '50%',
                                            height: '40px',
                                            marginTop: 6,
                                        }}
                                    >
                                        {loading ? (
                                            <Skeleton
                                                variant="rectangular"
                                                width={40}
                                                height={40}
                                            />
                                        ) : (
                                            <>
                                                <Tooltip
                                                    title={t('save_scores')}
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            setOpenSaveScoresPopup(
                                                                true
                                                            )
                                                        }
                                                        sx={{
                                                            color: 'background.default',
                                                            '&:hover': {
                                                                color: 'text.primary',
                                                            },
                                                            backgroundColor:
                                                                'primary.main',
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                        <Box paddingLeft={'10px'} />
                                        <Tooltip title={t('cancel')}>
                                            <IconButton
                                                onClick={() =>
                                                    setOpenDeleteScoresPopup(
                                                        true
                                                    )
                                                }
                                                sx={{
                                                    backgroundColor:
                                                        'secondary.main',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                                {/* Popup for confirming saving scores */}
                                <WarningPopup
                                    title={t('edit_scores_warning')}
                                    content={t('visible_for_everyone')}
                                    buttonName={t('confirm')}
                                    open={openSaveScoresPopup}
                                    handleClose={() =>
                                        setOpenSaveScoresPopup(false)
                                    }
                                    doAction={saveScores}
                                />
                                {/* Popup for confirming deletion of scores */}
                                <WarningPopup
                                    title={t('undo_changes_warning')}
                                    content={t('cant_be_undone')}
                                    buttonName={t('confirm')}
                                    open={openDeleteScoresPopup}
                                    handleClose={() =>
                                        setOpenDeleteScoresPopup(false)
                                    }
                                    doAction={deleteScores}
                                />
                            </Stack>
                        </>
                    ) : (
                        navigate('*')
                    )}
                </>
            )}
        </>
    )
}
