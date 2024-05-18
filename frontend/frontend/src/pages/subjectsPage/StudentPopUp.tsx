import { User } from './AddChangeSubjectPage'
import * as React from 'react'
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import {Button, SecundaryButton} from '../../components/CustomComponents'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import DialogContent from '@mui/material/DialogContent'
import { t } from 'i18next'

interface StudentPopUpProps {
    students: User[]
    text: string
}

export default function StudentPopUp({ students, text }: StudentPopUpProps) {
    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            {/* Students Button */}
            <SecundaryButton
                onClick={() => {
                    setOpen(true)
                }}
            >
                {t(text)}
            </SecundaryButton>
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
                        <Typography variant="body1">{t('loading') + ' ' + t('students') + '...'}</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
