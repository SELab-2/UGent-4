import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'

interface AssignmentListItemProps {
    id: string
    courseId: string
    projectName: string
    dueDate?: string
    status: boolean
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
                    <ListItemText
                        sx={{ maxWidth: 100 }}
                        primary={projectName}
                    />
                    {/* Due Date */}
                    <ListItemText
                        sx={{ maxWidth: 150 }}
                        primary={dueDate ? dueDate : t('no_deadline')}
                    />
                    {/* Status Icon (for students only) */}
                    {isStudent && (
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
                    )}
                </ListItemButton>
            </ListItem>
        </>
    )
}
