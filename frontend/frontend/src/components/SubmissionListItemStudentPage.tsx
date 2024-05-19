import { EvenlySpacedRow } from './CustomComponents.tsx'
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'

interface SubmissionListItemStudentPageProps {
    realId: string
    visualId: string
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
    realId,
    visualId,
    timestamp,
    status,
    assignment_id,
    course_id,
}: SubmissionListItemStudentPageProps) {
    const navigate = useNavigate()

    // Function to handle submission click event
    const handleSubmissionClick = () => {
        console.log('Submission clicked')
        if (realId) {
            navigate(
                `/course/${course_id}/assignment/${assignment_id}/submission/${realId}`
            )
        }
    }

    return (
        <>
            <ListItem key={realId} sx={{ maxHeight: '30px' }} disablePadding>
                <ListItemButton
                    sx={{ maxHeight: '30px' }}
                    onClick={handleSubmissionClick}
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
                                primary={visualId}
                            />,
                            <ListItemText
                                primary={timestamp ? timestamp : t('time')}
                            />,
                            <Box sx={{ maxWidth: '24px' }}>
                                <ListItemIcon sx={{ minWidth: 35 }}>
                                    {status ? (
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
                        ]}
                    />
                </ListItemButton>
            </ListItem>
        </>
    )
}
