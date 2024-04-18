import {
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Score } from '../../components/SubmissionListItemTeacherPage.tsx'

/**
 * This component is used to display a single assignment in the list of assignments.
 * @param projectName: string - the name of the project
 * @param dueDate: Date - the due date of the project
 * @param submissions: number - number of submissions for the project
 * @param score: number - assigned score on the project
 * @param isStudent: boolean - wether the user is a student or a teacher
 * @param archived: boolean - wether the assignment is archived
 * @param visible: boolean - wether the assignment is visible
 * @param deleteEvent: () => void - event to call to delete assignment
 * @param archiveEvent: () => void - event to call to archive assignment
 * @param visibilityEvent: () => void - event to call to change visibility of assignment
 */

interface AssignmentListItemSubjectsPageProps {
    projectName: string
    dueDate: Dayjs
    submissions: number
    score: Score
    maxScore: number
    isStudent: boolean
    archived: boolean
    visible: boolean
    deleteEvent: () => void
    archiveEvent: () => void
    visibilityEvent: () => void
    courseId: string
    assignmentId: string
}

export function AssignmentListItemSubjectsPage({
    projectName,
    dueDate,
    submissions,
    score,
    maxScore,
    isStudent,
    archived,
    visible,
    deleteEvent,
    archiveEvent,
    visibilityEvent,
    courseId,
    assignmentId,
}: AssignmentListItemSubjectsPageProps) {
    const navigate = useNavigate()
    const handleProjectClick = () => {
        console.log('Project clicked')
        if (isStudent) {
            navigate(`/course/${courseId}/assignment/${assignmentId}`)
        } else {
            navigate(`/course/${courseId}/assignment/${assignmentId}`)
        }
    }

    return (
        <>
            <ListItem
                key={projectName}
                sx={{ margin: 0 }}
                disablePadding={true}
            >
                <ListItemButton
                    onClick={handleProjectClick}
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
                >
                    {isStudent ? (
                        <>
                            <ListItemText
                                sx={{ maxWidth: 100 }}
                                primary={projectName}
                            />
                            <ListItemText
                                sx={{ maxWidth: 110 }}
                                primary={
                                    dueDate
                                        ? dayjs(dueDate).format('DD.MM.YYYY')
                                        : t('no_deadline')
                                }
                            />
                            <ListItemText
                                sx={{ maxWidth: 150 }}
                                primary={
                                    submissions > 0
                                        ? submissions > 1
                                            ? submissions +
                                              ' ' +
                                              t('submissions')
                                            : submissions +
                                              ' ' +
                                              t('submission')
                                        : t('no_submissions')
                                }
                            />
                            {submissions > 0 ? (
                                <ListItemText
                                    sx={{ maxWidth: 100 }}
                                    primary={
                                        score
                                            ? `${score.score}/${maxScore} (${(100 * score.score) / maxScore}%)`
                                            : t('no_score_yet')
                                    }
                                />
                            ) : (
                                <ListItemText
                                    sx={{ maxWidth: 100 }}
                                    primary={`0/${maxScore} (0%)`}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {/* In case of the user being the teacher: */}
                            <ListItemText
                                sx={{ maxWidth: 100 }}
                                primary={projectName}
                            />
                            <ListItemText
                                sx={{ maxWidth: 110 }}
                                primary={
                                    dueDate
                                        ? dayjs(dueDate).format('DD.MM.YYYY')
                                        : t('no_deadline')
                                }
                            />
                            <ButtonActions
                                archived={archived}
                                startVisible={visible}
                                deleteEvent={deleteEvent}
                                archiveEvent={archiveEvent}
                                visibilityEvent={visibilityEvent}
                            />
                        </>
                    )}
                </ListItemButton>
            </ListItem>
            <Divider color={'text.main'}></Divider>
        </>
    )
}

interface ButtonActionsProps {
    archived: boolean
    startVisible: boolean
    deleteEvent: () => void
    archiveEvent: () => void
    visibilityEvent: () => void
}

function ButtonActions({
    archived,
    startVisible,
    deleteEvent,
    archiveEvent,
    visibilityEvent,
}: ButtonActionsProps) {
    const [visible, setVisible] = useState(startVisible)

    const handleIconClick = (e, icon: string) => {
        e.stopPropagation()
        console.log(icon + ' clicked')
        switch (icon) {
            case 'visible':
                setVisible(!visible)
                visibilityEvent()
                break
            case 'archive':
                archiveEvent()
                break
            case 'delete':
                deleteEvent()
                break
            default:
                break
        }
    }

    return (
        <ListItem sx={{ maxWidth: 110 }}>
            {visible ? (
                <IconButton
                    onClick={(e) => handleIconClick(e, 'visible')}
                    edge="end"
                    aria-label="visible"
                >
                    <VisibilityOutlinedIcon />
                </IconButton>
            ) : (
                <IconButton
                    onClick={(e) => handleIconClick(e, 'visible')}
                    edge="end"
                    aria-label="not-visible"
                >
                    <VisibilityOffOutlinedIcon />
                </IconButton>
            )}
            {!archived && (
                <IconButton
                    onClick={(e) => handleIconClick(e, 'archive')}
                    edge="end"
                    aria-label="archive"
                >
                    <ArchiveOutlinedIcon />
                </IconButton>
            )}
            <IconButton
                onClick={(e) => handleIconClick(e, 'delete')}
                edge="end"
                aria-label="delete"
            >
                <DeleteOutlinedIcon />
            </IconButton>
        </ListItem>
    )
}
