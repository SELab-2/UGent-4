import {
    Box,
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
import { EvenlySpacedRow } from './CustomComponents.tsx'
import { Project } from '../pages/scoresPage/ProjectScoresPage.tsx'

interface SubmissionListItemTeacherPageProps {
    group_name: string
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
    group_name,
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
    const [assignment, setAssignment] = useState<Project>()
    useEffect(() => {
        async function fetchData() {
            try {
                const submissionsResponse = await instance.get(
                    `/indieningen/?groep=${group_id}`
                )
                const lastSubmission = submissionsResponse.data.sort(
                    (a: Submission, b: Submission) => {
                        return dayjs(a.tijdstip).isBefore(dayjs(b.tijdstip))
                            ? -1
                            : 1
                    }
                )[submissionsResponse.data.length - 1]
                if (lastSubmission) {
                    const lastSubmissionResponse = await instance.get(
                        `indieningen/${lastSubmission.indiening_id}/`
                    )
                    //Get the submission file
                    const newSubmission: Submission =
                        lastSubmissionResponse.data
                    newSubmission.filename =
                        lastSubmissionResponse.data.bestand.replace(
                            /^.*[\\/]/,
                            ''
                        )
                    newSubmission.bestand = await instance
                        .get(
                            `/indieningen/${lastSubmission.indiening_id}/indiening_bestand/`,
                            {
                                responseType: 'blob',
                            }
                        )
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
                    setSubmitted(newSubmission)
                }
                if (lastSubmission) {
                    const scoreResponse = await instance.get(
                        `/scores/?indiening=${lastSubmission.indiening_id}`
                    )
                    setScore(scoreResponse.data[scoreResponse.data.length - 1])
                    console.log(score?.score)
                }

                const assignmentResponse = await instance.get(
                    `/projecten/${assignment_id}/`
                )
                setAssignment(assignmentResponse.data)
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
            a.download = submitted.filename ? submitted.filename : 'opgave.zip'
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
            <ListItem id={group_id} sx={{ maxHeight: '40px' }} disablePadding>
                <ListItemButton
                    sx={{ maxHeight: '40px' }}
                    onClick={handleSubmissionClick}
                    disabled={!submitted}
                >
                    <EvenlySpacedRow
                        items={[
                            <ListItemText
                                sx={{
                                    color: 'primary.main',
                                    '&:hover': {
                                        color: 'primary.light',
                                    },
                                }}
                                primary={group_name}
                            />,
                            <ListItemText
                                primary={
                                    submitted
                                        ? dayjs(submitted.tijdstip).format(
                                              'DD/MM/YYYY HH:mm'
                                          )
                                        : '-'
                                }
                            />,
                            <ListItemText
                                primary={
                                    score
                                        ? `${Number(score.score)}` +
                                          '/' +
                                          (assignment
                                              ? assignment.max_score
                                              : '20')
                                        : t('no_score_yet')
                                }
                            />,
                            <Box sx={{ maxWidth: '24px' }}>
                                <ListItemIcon>
                                    {!submitted?.status ? (
                                        <HighlightOffIcon
                                            sx={{ color: 'error.main' }}
                                        />
                                    ) : submitted.status > 0 ? (
                                        <CheckCircleOutlineIcon
                                            sx={{ color: 'success.main' }}
                                        />
                                    ) : (
                                        <HighlightOffIcon
                                            sx={{ color: 'error.main' }}
                                        />
                                    )}
                                </ListItemIcon>
                            </Box>,
                            <Box sx={{ maxWidth: '24px' }}>
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
                                            <DownloadIcon
                                                sx={{ color: 'gray' }}
                                            />
                                        )}
                                    </div>
                                </ListItemIcon>
                            </Box>,
                        ]}
                    ></EvenlySpacedRow>
                </ListItemButton>
            </ListItem>
        </>
    )
}
