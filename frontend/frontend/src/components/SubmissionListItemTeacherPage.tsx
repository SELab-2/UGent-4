import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useEffect, useState } from 'react'
import instance from '../axiosConfig'
import { Submission } from '../pages/submissionPage/SubmissionPage.tsx'
import { t } from 'i18next'
import dayjs from 'dayjs'

interface SubmissionListItemTeacherPageProps {
    relative_group_id: string
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
    relative_group_id,
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
                const lastSubmissionResponse = await instance.get(`indieningen/${lastSubmission.indiening_id}/`)
                //Get the submission file
                const newSubmission: Submission = lastSubmissionResponse.data
                newSubmission.filename = lastSubmissionResponse.data.bestand.replace(
                    /^.*[\\/]/,
                    ''
                )
                newSubmission.bestand = await instance
                    .get(`/indieningen/${lastSubmission.indiening_id}/indiening_bestand`, {
                        responseType: 'blob',
                    }).then((res) => {
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
                setSubmitted(newSubmission)
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
        if (submitted?.bestand) {
            const url = window.URL.createObjectURL(submitted?.bestand)
            const a = document.createElement('a')
            a.href = url
            a.download = submitted.filename
                ? submitted.filename
                : 'opgave.zip'
            document.body.appendChild(a)
            a.click()
            a.remove()
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
                        height: 40,
                        paddingX: 4,
                        paddingY: 3,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                    onClick={handleSubmissionClick}
                >
                    {/* Display group id */}
                    <ListItemText
                        sx={{
                            maxWidth: '24%',
                            color: 'primary.main',
                            '&:hover': {
                                color: 'primary.light',
                            },
                        }}
                        primary={relative_group_id}
                    />
                    {/* Display submission timestamp */}
                    <ListItemText
                        sx={{ minWidth: '24%' }}
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
                        sx={{ minWidth: '24%' }}
                        primary={
                            score
                                ? `${Number(score.score)}` + '/20'
                                : t('no_score_yet')
                        }
                    />
                    {/* Display submission status icon */}
                    <ListItemIcon sx={{ minWidth: '24%' }}>
                        {!submitted?.status ? (
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
                    <ListItemText sx={{ maxWidth: 35 }}>
                        <ListItemIcon>
                            <div onClick={handleDownloadClick}>
                                {submitted ? (
                                    <DownloadIcon
                                        sx={{
                                            color: 'primary.main',
                                            '&:hover': {
                                                color: 'primary.light',
                                            },
                                        }}
                                    />
                                ) : (
                                    <DownloadIcon sx={{ color: 'gray' }} />
                                )}
                            </div>
                        </ListItemIcon>
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        </>
    )
}
