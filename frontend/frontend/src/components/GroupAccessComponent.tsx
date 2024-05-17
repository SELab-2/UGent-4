import { Button } from './CustomComponents'
import { Box } from '@mui/material'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'

interface GroupAccessComponentProps {
    assignmentid: number
    courseid: number
}

/**
 * Component to toggle group access for an assignment.
 * @param assignmentid ID of the assignment
 * @param courseid ID of the course
 */
export function GroupAccessComponent({
    assignmentid,
    courseid,
}: GroupAccessComponentProps) {
    const navigate = useNavigate()

    // Handle click event to navigate to the groups page
    const handleClick = () => {
        navigate(`/course/${courseid}/assignment/${assignmentid}/groups`)
    }

    return (
        <>
            <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                width={'20vw'}
                marginBottom={2}
            >
                {/* Button to navigate to groups page */}
                <Button onClick={handleClick}>{t('groups')}</Button>
            </Box>
        </>
    )
}
