import { restriction } from '../pages/addChangeAssignmentPage/AddChangeAssignmentPage.tsx'
import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface RestrictionCardProps {
    restriction: restriction
    restrictions: restriction[]
    setRestrictions: (restriction: restriction[]) => void
}

export function RestrictionCard({
    restriction,
    restrictions,
    setRestrictions,
}: RestrictionCardProps) {
    //handle the removal of the restriction from the list
    const handleRemove = () => {
        setRestrictions(restrictions.filter((r) => r !== restriction))
    }

    return (
        <>
            <Box
                display={'flex'}
                flexDirection={'row'}
                width={'100%'}
                justifyContent={'space-between'}
            >
                <Typography variant={'body2'}>
                    {restriction.script.replace(/^.*[\\/]/, '')}
                </Typography>
                <IconButton onClick={handleRemove}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </>
    )
}
