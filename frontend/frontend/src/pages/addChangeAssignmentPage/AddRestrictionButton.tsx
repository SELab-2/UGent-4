import * as React from 'react'
import { SecondaryButton } from '../../components/CustomComponents.tsx'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import AddIcon from '@mui/icons-material/Add'
import RestrictionsDialog from './RestrictionsDialog'
import { t } from 'i18next'
import { IconButton } from '@mui/material'
import { restriction } from './AddChangeAssignmentPage.tsx'

/**
 * Component for an "Add Restriction" button that opens a dialog for adding restrictions.
 * @returns {React.ReactElement} - The rendered component.
 */

interface AddRestrictionButtonProps {
    userid: number
    restrictions: restriction[]
    setRestrictions: (restriction: restriction[]) => void
}

export default function AddRestrictionButton({
    userid,
    restrictions,
    setRestrictions,
}: AddRestrictionButtonProps) {
    const [open, setOpen] = React.useState(false)
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper')

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            {/* Add Restriction Button */}
            <IconButton
                id="addRestrictionButton"
                sx={{
                    bgcolor: 'secondary.main',
                    marginRight: 1,
                }}
                onClick={() => {
                    setOpen(true)
                    setScroll('paper')
                }}
            >
                <AddIcon sx={{ color: 'secondary.contrastText' }}></AddIcon>
            </IconButton>
            {/* Add Restriction Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    {t('add_restriction')}
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <RestrictionsDialog
                        userid={userid}
                        closeParentDialog={handleClose}
                        restrictions={restrictions}
                        setRestrictions={setRestrictions}
                    ></RestrictionsDialog>
                </DialogContent>
                <DialogActions>
                    {/* Cancel Button */}
                    <SecondaryButton id="cancelButton" onClick={handleClose}>
                        {t('cancel')}
                    </SecondaryButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
