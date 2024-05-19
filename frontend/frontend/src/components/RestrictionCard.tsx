import { restriction } from '../pages/addChangeAssignmentPage/AddChangeAssignmentPage.tsx'
import { Box, IconButton, Switch, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import { t } from 'i18next'

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

    const [mustPass, setMustPass] = React.useState(false)

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
                <Typography id='script' variant={'body2'}>
                    {restriction.script.replace(/^.*[\\/]/, '')}
                </Typography>
                {/*<Box>
                    <Typography variant={'body2'}>
                        {t('must_pass') + ':'}
                    </Typography>
                    <Switch
                        id="mustPassSwitch"
                        value={mustPass}
                        onChange={() => setMustPass(!mustPass)}
                    />
                </Box>*/}
                <Switch
                    id="mustPassSwitch"
                    value={mustPass}
                    onChange={() => setMustPass(!mustPass)}
                />
                        
                <IconButton id='closeButton' onClick={handleRemove}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </>
    )
}
