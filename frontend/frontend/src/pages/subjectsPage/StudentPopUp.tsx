import { User } from './AddChangeSubjectPage'
import * as React from 'react'
import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material'
import { SecondaryButton } from '../../components/CustomComponents'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import DialogContent from '@mui/material/DialogContent'
import { t } from 'i18next'

interface StudentPopUpProps {
    students: User[]
    text: string
    noGroup: boolean
}

export default function StudentPopUp({
    students,
    text,
    noGroup,
}: StudentPopUpProps) {
    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            {/* Students Button */}
            <SecondaryButton
                onClick={() => {
                    setOpen(true)
                }}
            >
                {t(text)}
            </SecondaryButton>
            {/* Students Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    {t(text)}
                    {/* Close Button */}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {noGroup ? (
                        <>
                            <Typography variant="body1">
                                {t('noGroup')}
                            </Typography>
                            <Typography variant="body1">
                                {t('contactTeacher')}
                            </Typography>
                        </>
                    ) : (
                        <>
                            {/* List of Students */}
                            {students.length > 0 ? (
                                <List>
                                    {students.map((student) => (
                                        <ListItem key={student.user}>
                                            <ListItemText
                                                primary={`${student.first_name} ${student.last_name}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body1">
                                    {t('loading') + ' ' + t('students') + '...'}
                                </Typography>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
