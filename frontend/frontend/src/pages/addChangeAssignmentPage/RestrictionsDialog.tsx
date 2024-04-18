import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { ButtonGroup, TextField } from '@mui/material'
import { t } from 'i18next'
import instance from '../../axiosConfig.ts'

/**
 * Transition component for the dialog animation.
 * @param {TransitionProps} props - Props for the transition component.
 * @returns {React.ReactElement} - Slide transition component.
 */
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

/**
 * Dialog component for managing restrictions related to file uploads.
 * @param {Object} props - Props object.
 * @param {Function} props.closeParentDialog - Function to close the parent dialog.
 * @returns {React.ReactElement} - Dialog component.
 */
export default function RestrictionsDialog({
    closeParentDialog,
}: {
    closeParentDialog: () => void
}) {
    const [open, setOpen] = React.useState(false)
    const fileInput = React.useRef<HTMLInputElement>(null)

    const handleUploadedFiles = (e) => {
        const files = e.target.files
        if (files.length > 0) {
            console.log(files)
            Array.from(files).forEach(async (file) => {
                console.log("there's at least one file")
                const formData = new FormData()
                const json = {
                    project: 1,
                    script: file,
                    moet_slagen: true,
                }
                formData.append('data', JSON.stringify(json))
                try {
                    await instance.post('/api/restricties/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    console.log('done')
                } catch (error) {
                    console.error('Error uploading file:', error)
                }
            })
        }
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    // Buttons array for the vertical button group
    const buttons = [
        <Button
            key="Upload"
            onClick={() => {
                fileInput.current?.click()
                closeParentDialog()
            }}
        >
            Upload
        </Button>,
        <Button
            key="New_Script"
            onClick={() => {
                handleClickOpen()
            }}
        >
            {t('new_script')}
        </Button>,
        <Button
            key="FileExtensionCheck"
            onClick={() => {
                handleClickOpen()
            }}
        >
            File Extension Check
        </Button>,
        <Button
            key="FilesPresentCheck"
            onClick={() => {
                handleClickOpen()
            }}
        >
            Files Present Check
        </Button>,
    ]

    const handleClose = () => {
        setOpen(false)
        closeParentDialog()
    }

    return (
        <React.Fragment>
            {/* File input for uploading files */}
            <input
                ref={fileInput}
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                    handleUploadedFiles(e)
                }}
                multiple
            />
            {/* Vertical button group */}
            <ButtonGroup
                orientation="vertical"
                aria-label="Vertical button group"
            >
                {buttons}
            </ButtonGroup>
            {/* Dialog component */}
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Test code
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                {/* TextField for entering test code */}
                <TextField id="filled-textarea" multiline variant="filled" />
            </Dialog>
        </React.Fragment>
    )
}
