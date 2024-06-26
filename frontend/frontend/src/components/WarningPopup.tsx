import { Button, SecondaryButton } from './CustomComponents'
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { t } from 'i18next'

// Props for the WarningPopup component
interface WarningPopupProps {
    title: string
    content: string
    buttonName: string
    open: boolean
    handleClose: () => void
    doAction: () => void
}

/**
 * A reusable component for displaying a warning popup dialog.
 * This component is typically used to confirm an action before proceeding.
 * @param {WarningPopupProps} props - Props for the WarningPopup component
 */
export default function WarningPopup({
    title,
    content,
    buttonName,
    open,
    handleClose,
    doAction,
}: WarningPopupProps) {
    /**
     * Handles the action button click event.
     * Executes the provided action function and then closes the dialog.
     */
    const hanldeAction = () => {
        doAction()
        handleClose()
    }
    return (
        <>
            {/* Warning popup dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="popUpTitle" sx={{ textAlign: 'center' }}>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="popUpText">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <SecondaryButton id="cancelButton" onClick={handleClose}>
                        {t('cancel')}
                    </SecondaryButton>
                    {/* Action button */}
                    <Button id="confirm" onClick={hanldeAction} autoFocus>
                        {buttonName}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
