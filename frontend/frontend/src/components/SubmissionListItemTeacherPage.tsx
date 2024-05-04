import {
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useEffect, useState } from 'react'
import instance from '../axiosConfig'
import { Submission } from '../pages/submissionPage/SubmissionPage.tsx'
import dayjs from 'dayjs'

interface SubmissionListItemTeacherPageProps {
    group_id: string
    assignment_id: string
    course_id: string
}

export interface Score {
    score_id: number
    score: number
    indiening: number
}

/**
 * Component to display a single submission in the list of submissions for a teacher.
 * @param {SubmissionListItemTeacherPageProps} props - Props for SubmissionListItemTeacherPage component
 */
export function SubmissionListItemTeacherPage({
    group_id,
    assignment_id,
    course_id,
}: SubmissionListItemTeacherPageProps) {
    const navigate = useNavigate()

    // Function to handle a download click event
    const handleDownloadClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        console.log('Submission download clicked')
        downloadSubmission()
    }

    // State for submitted data and score
    const [submitted, setSubmitted] = useState<Submission>()
    const [score, setScore] = useState<Score>()
    useEffect(() => {
        async function fetchData() {
            try {
                const submissionsResponse = await instance.get(
                    `/indieningen/?groep=${group_id}`
                )
                const lastSubmission =
                    submissionsResponse.data[
                        submissionsResponse.data.length - 1
                    ]
                setSubmitted(lastSubmission)
                if (lastSubmission) {
                    const scoreResponse = await instance.get(
                        `/scores/?indiening=${lastSubmission.indiening_id}`
                    )
                    setScore(scoreResponse.data[scoreResponse.data.length - 1])
                    console.log(score?.score)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData().catch((err) => console.error(err))
    }, [group_id, score?.score])

    // Function to download the submission
    const downloadSubmission = () => {
        if (submitted) {
            instance
                .get(
                    `/indieningen/${submitted.indiening_id}/indiening_bestanden/`,
                    { responseType: 'blob' }
                )
                .then((res) => {
                    let filename = 'lege_indiening.zip'
                    if (submitted.indiening_bestanden.length > 0) {
                        filename =
                            submitted.indiening_bestanden[0].bestand.replace(
                                /^.*[\\/]/,
                                ''
                            )
                    }
                    const blob = new Blob([res.data], {
                        type: res.headers['content-type'],
                    })
                    const file: File = new File([blob], filename, {
                        type: res.headers['content-type'],
                    })
                    const url = window.URL.createObjectURL(file)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    // Function to handle submission click event
    const handleSubmissionClick = () => {
        console.log('Submission clicked')
        if (submitted) {
            navigate(
                `/course/${course_id}/assignment/${assignment_id}/submission/${submitted.indiening_id}`
            )
        }
    }

    return (
        <>
            <ListItem id={group_id} sx={{ margin: 0 }} disablePadding={true}>
                <ListItemButton
                    sx={{
                        width: '100%',
                        height: 30,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingX: 1,
                        paddingY: 3,
                        borderRadius: 2,
                    }}
                    onClick={handleSubmissionClick}
                >
                    {/* Display group id */}
                    <ListItemText
                        sx={{
                            maxWidth: 10,
                            color: 'primary.main',
                            '&:hover': {
                                color: 'primary.light',
                            },
                        }}
                        primary={group_id}
                    />
                    {/* Display submission timestamp */}
                    <ListItemText
                        sx={{ maxWidth: 150 }}
                        primary={
                            submitted
                                ? dayjs(submitted.tijdstip).format(
                                      'DD/MM/YYYY HH:mm'
                                  )
                                : '-'
                        }
                    />
                    {/* Display score */}
                    <ListItemText
                        sx={{ maxWidth: 50 }}
                        primary={score ? `${Number(score.score)}` + '/20' : '-'}
                    />
                    {/* Display submission status icon */}
                    <ListItemIcon sx={{ minWidth: 35 }}>
                        {submitted?.status ? (
                            <HighlightOffIcon sx={{ color: 'error.main' }} />
                        ) : (
                            submitted !== undefined && (
                                <CheckCircleOutlineIcon
                                    sx={{ color: 'success.main' }}
                                />
                            )
                        )}
                    </ListItemIcon>
                    {/* Display download icon */}
                    <ListItemIcon sx={{ minWidth: 35 }}>
                        <div onClick={handleDownloadClick}>
                            {submitted ? (
                                <DownloadIcon
                                    sx={{
                                        color: 'primary.main',
                                        '&:hover': { color: 'primary.light' },
                                    }}
                                />
                            ) : (
                                <DownloadIcon sx={{ color: 'gray' }} />
                            )}
                        </div>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        </>
    )
}
