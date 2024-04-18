import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import AddIcon from '@mui/icons-material/Add'
import RestrictionsDialog from './RestrictionsDialog'
import { t } from 'i18next'

/**
 * Component for an "Add Restriction" button that opens a dialog for adding restrictions.
 * @returns {React.ReactElement} - The rendered component.
 */
export default function AddRestrictionButton() {
    const [open, setOpen] = React.useState(false)
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper')

    const handleClose = () => {
        setOpen(false)
    }

    // Focuses on the dialog description element when the dialog opens
    const descriptionElementRef = React.useRef<HTMLElement>(null)
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef
            if (descriptionElement !== null) {
                descriptionElement.focus()
            }
        }
    }, [open])

    return (
        <React.Fragment>
            {/* Add Restriction Button */}
            <Button
                sx={{ bgcolor: 'secondary.main' }}
                onClick={() => {
                    setOpen(true)
                    setScroll('paper')
                }}
            >
                <AddIcon sx={{ color: 'secondary.contrastText' }}></AddIcon>
            </Button>
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
                        closeParentDialog={handleClose}
                    ></RestrictionsDialog>
                </DialogContent>
                <DialogActions>
                    {/* Cancel Button */}
                    <Button onClick={handleClose}>{t('cancel')}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
