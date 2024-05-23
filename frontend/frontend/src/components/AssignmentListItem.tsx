import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import { SubmissionStatus } from '../pages/submissionPage/SubmissionPage.tsx'

interface AssignmentListItemProps {
    id: string
    courseId: string
    projectName: string
    dueDate?: string
    status: SubmissionStatus
    isStudent: boolean
}

/*
 * This component is used to display a single assignment in the list of assignments
 * @param key: string - the key of the assignment
 * @param projectName: string - the name of the project
 * @param dueDate: Date - the due date of the project
 * @param status: boolean - the status of the project
 * @param isStudent: boolean - if the user is a student or a teacher
 */

export function AssignmentListItem({
    id,
    courseId,
    projectName,
    dueDate,
    status,
    isStudent,
}: AssignmentListItemProps) {
    const navigate = useNavigate()

    // Function to handle click event on the project.
    const handleProjectClick = () => {
        console.log('Project clicked')
        navigate(`/course/${courseId}/assignment/${id}`)
    }

    return (
        <>
            <ListItem
                id={`project${id}`}
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
                    {/* Project Name */}
                    <ListItemText>
                        <Typography
                            data-cy="projectName"
                            maxWidth={170}
                            noWrap
                            textOverflow={'ellipsis'}
                        >
                            {projectName}
                        </Typography>
                    </ListItemText>
                    {/* Due Date */}
                    <ListItemText
                        id="dueDate"
                        sx={{ maxWidth: 150 }}
                        primary={dueDate ? dueDate : t('no_deadline')}
                    />
                    {/* Status Icon (for students only) */}
                    {isStudent && (
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            {status === SubmissionStatus.PASSED ? (
                                <CheckCircleOutlineIcon
                                    id="check"
                                    sx={{ color: 'success.main' }}
                                />
                            ) : status === SubmissionStatus.FAIL ? (
                                <HighlightOffIcon
                                    id="cross"
                                    sx={{ color: 'error.main' }}
                                />
                            ) : (
                                <AccessAlarmIcon
                                    id="clock"
                                    sx={{ color: 'warning.main' }}
                                />
                            )}
                        </ListItemIcon>
                    )}
                </ListItemButton>
            </ListItem>
        </>
    )
}