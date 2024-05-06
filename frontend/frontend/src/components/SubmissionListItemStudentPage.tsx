import {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'

interface SubmissionListItemStudentPageProps {
    id: string
    timestamp?: string
    status: boolean
    assignment_id: string
    course_id: string
}

/*
 * This component is used to display a single submission in the list of submissions (for a student)
 * @param key: string - the key of the submission
 * @param projectName: string - the name of the project
 * @param timestamp: Date - the due date of the project
 * @param status: boolean - the status of the project
 * @param isStudent: boolean - if the user is a student or a teacher
 */

export function SubmissionListItemStudentPage({
    id,
    timestamp,
    status,
    assignment_id,
    course_id,
}: SubmissionListItemStudentPageProps) {
    const navigate = useNavigate()

    // Function to handle submission click event
    const handleSubmissionClick = () => {
        console.log('Submission clicked')
        if (id) {
            navigate(
                `/course/${course_id}/assignment/${assignment_id}/submission/${id}`
            )
        }
    }

    return (
        <>
            <ListItem id={`submission${id}`} key={id} sx={{ margin: 0 }} disablePadding={true}>
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
                    {/* Display submission id */}
                    <ListItemText
                        id='submissionId'
                        sx={{
                            maxWidth: 110,
                            color: 'primary.main',
                            '&:hover': {
                                color: 'primary.light',
                            },
                        }}
                        primary={id}
                    />
                    {/* Display submission timestamp */}
                    <ListItemText
                        id='submissionTimestamp'
                        sx={{ maxWidth: 150 }}
                        primary={
                            timestamp
                                ? timestamp
                                : t('time')
                        }
                    />
                    {/* Display submission status icon */}
                    <ListItemIcon sx={{ minWidth: 35 }}>
                        {status ? (
                            <CheckCircleOutlineIcon id='check'
                                sx={{ color: 'success.main' }}
                            />
                        ) : (
                            <HighlightOffIcon id='cross' sx={{ color: 'error.main' }} />
                        )}
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        </>
    )
}
