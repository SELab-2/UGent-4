import { Button } from './CustomComponents'
import { Box, Typography } from '@mui/material'
import { t } from 'i18next'
import Switch from '@mui/material/Switch'
import { useEffect, useState } from 'react'
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
    const [allowGroups, setAllowGroups] = useState(false)

    // Handle click event to navigate to the groups page
    const handleClick = () => {
        navigate(`/course/${courseid}/assignment/${assignmentid}/groups`)
    }

    useEffect(() => {
        //set max group size to 1 if groups are not allowed and register all students to a group of their own
    }, [allowGroups])

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
                {allowGroups ? (
                    <Button onClick={handleClick}>{t('groups')}</Button>
                    <Button
                        id='groupButton'
                        variant={'contained'}
                        disableElevation
                        onClick={handleClick}
                        color={'secondary'}
                    >
                        {t('groups')}
                    </Button>
                ) : (
                    // Show text indicating groups are not allowed
                    <Typography color={'text.primary'} variant={'body1'}>
                        {t('groups')}
                    </Typography>
                )}
                {/* Switch to toggle group access */}
                <Switch
                    id='groupSwitch'
                    checked={allowGroups}
                    onChange={() => setAllowGroups(!allowGroups)}
                    color={'primary'}
                />
            </Box>
        </>
    )
}
