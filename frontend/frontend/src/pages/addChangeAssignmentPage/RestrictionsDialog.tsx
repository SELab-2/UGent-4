import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import { Card,Button,SecundaryButton } from '../../components/CustomComponents.tsx'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import {
    Box,
    Stack,
    ButtonGroup,
    FormControl,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { t, use } from 'i18next'
import { restriction } from './AddChangeAssignmentPage.tsx'
import Switch from '@mui/material/Switch'
import WarningPopup from '../../components/WarningPopup.tsx'
import RestrictionsTemplateUI from './RestrictionTemplateUI.tsx'
import instance from '../../axiosConfig.ts'
import theme from "../../Theme.ts";

interface RestrictionsDialogProps {
    restrictions: restriction[]
    setRestrictions: (restriction: restriction[]) => void
    closeParentDialog: () => void
}

enum restrictionExtension {
    Shell = '.sh',
    Python = '.py',
}

export interface Template {
    template_id: number
    user: number
    bestand: number
}

const code = `

#@param
# Schrijf in dit veld je voornaam.
naam=""

#@param
# Schrijf in dit veld je leeftijd.
leeftijd=0

#@param
# Ben je lesgever?
lesgever=False

#@param
# Welke bestanden moeten aanwezig zijn?
bestanden=["main.py", "test.py"]

# de constante pi, nodig voor wanneer we de omtrek berekenen van het object dat de student indient.
pi=3.14159

#code...`

/**
 * Dialog component for managing restrictions related to file uploads.
 * @param {Object} props - Props object.
 * @param {Function} props.closeParentDialog - Function to close the parent dialog.
 * @returns {React.ReactElement} - Dialog component.
 */
export default function RestrictionsDialog({
    restrictions,
    setRestrictions,
    closeParentDialog,
}: RestrictionsDialogProps) {
    const [openTextEditor, setOpenTextEditor] = useState(false)
    const [openTemplateInterface, setOpenTemplateInterface] = useState(false)
    const [mustPass, setMustPass] = useState(false)
    const [openTemplateInUI, setOpenTemplateInUI] = useState(false)
    const [textFieldContent, setTextFieldContent] = useState('')
    const [restrictionName, setRestrictionName] = useState('')
    const [restrictionType, setRestrictionType] =
        useState<restrictionExtension>(restrictionExtension.Shell)
    const [nameError, setNameError] = useState(false)
    const [popupOpen, setPopupOpen] = useState(false)

    // function to handle the uploaded files and send them to the parent component
    const handleUploadedFiles = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const newRestrictions: restriction[] = []

        if (files.length > 0) {
            console.log(files)
            for (const file of files) {
                const newRestriction: restriction = {
                    script: file.name,
                    file: file,
                    moet_slagen: mustPass,
                }
                newRestrictions.push(newRestriction)
            }
        }
        setRestrictions([...restrictions, ...newRestrictions])
        closeParentDialog()
    }

    //handle the submission of the form
    const handleSubmit = () => {
        if (restrictionName === '') {
            setNameError(true)
            return
        }

        const newRestriction: restriction = {
            script: restrictionName + restrictionType,
            file: new File(
                [textFieldContent],
                restrictionName + restrictionType,
                { type: 'text/plain' }
            ),
            moet_slagen: mustPass,
        }
        setRestrictions([...restrictions, newRestriction])
        handleCloseTextEditor()
    }

    const handleClickOpenTextEditor = () => {
        setOpenTextEditor(true)
    }

    const handleClickOpenTemplateInterface = () => {
        setOpenTemplateInterface(true)
    }

    const handleSaveTemplate = async (filename: string, 
                                        fileExtension: restrictionExtension, 
                                        code: string, 
                                        templateMetaData: Template) => {
        var file = new File([code], 
                            `${filename}.${fileExtension}`, 
                            {type: "text/plain"});
        try {
            await instance.post(`/templates/`, {
                template_id: templateMetaData.template_id,
                user: templateMetaData.user,
                bestand: file,
            })
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

    // Buttons array for the vertical button group
    const buttons = [
        <Button id='upload' key="Upload" component={'label'}>
            Upload
            <input hidden type="file" multiple onChange={handleUploadedFiles} />
        </Button>,
        <Button
            id='newScript'
            key="New_Script"
            onClick={() => {
                handleClickOpenTextEditor()
            }}
        >
            {t('new_script')}
        </Button>,
    ]

    React.useEffect(() => {
        let templates: Template[] = []
        async function fetchData() {
            
            try {
                const response =
                    await instance.get<Template[]>('/vakken/?in=true')
                templates = response.data
                
                
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData().catch((e) => {
            console.error(e)
        })
        console.log("templates:")
        console.log(templates)
        console.log("----------")
        
    }, [])

    const templateButtons = [
        <Button
            id='fileExtensionCheck'
            key="FileExtensionCheck"
            onClick={() => {
                setTextFieldContent(code)
                if (openTemplateInUI) {
                    handleClickOpenTemplateInterface()
                } else {
                    handleClickOpenTextEditor()
                }
            }}
        >
            File Extension Check
        </Button>,
        <Button
            id='filesPresentCheck'
            key="FilesPresentCheck"
            onClick={() => {
                setTextFieldContent(code)
                if (openTemplateInUI) {
                    handleClickOpenTemplateInterface()
                } else {
                    handleClickOpenTextEditor()
                }
            }}
        >
            Files Present Check
        </Button>,
    ]

    const handleCloseTextEditor = () => {
        setOpenTextEditor(false)
        closeParentDialog()
    }

    const handleCloseTemplateInterface = () => {
        setOpenTemplateInterface(false)
        closeParentDialog()
    }

    return (
        <React.Fragment>
            {/* File input for uploading files */}
            <input
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
                variant={'outlined'}
                color={'primary'}
            >
                {buttons}
            </ButtonGroup>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                {/* This box will contain the templates */}
                <Typography variant={'body2'}>
                    {t('open_with_ui') + ':'}
                </Typography>
                <Switch
                    value={openTemplateInUI}
                    onChange={() => setOpenTemplateInUI(!openTemplateInUI)}
                />
                <ButtonGroup
                    orientation="vertical"
                    aria-label="Vertical button group"
                    variant={'outlined'}
                    color={'primary'}
                >
                    {templateButtons}
                </ButtonGroup>
            </Box>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                <Typography variant={'body2'}>
                    {t('must_pass') + ':'}
                </Typography>
                <Switch
                    id='mustPassSwitch'
                    value={mustPass}
                    onChange={() => setMustPass(!mustPass)}
                />
            </Box>
            {/* This is the template interface. */}
            <Dialog fullScreen open={openTemplateInterface} onClose={handleCloseTemplateInterface}>
                <RestrictionsTemplateUI restrictionCode={code} handleCloseTemplateInterface={handleCloseTemplateInterface} templateFileName='template_example.sh'/>
            </Dialog>
            {/* This is the code editor. */}
            <Dialog fullScreen open={openTextEditor} onClose={handleCloseTextEditor}>
                <Stack>
                    <AppBar sx={{ position: 'relative' }} elevation={0}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleCloseTextEditor}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {/* name of template */}
                    <Box
                        padding='30px'
                        display={'flex'}
                        gap={3}
                        alignItems={'center'}
                    >
                        <Typography
                            variant={'h5'}
                            color={'text.primary'}
                            fontWeight={'bold'}
                        >
                            {t('name')}
                        </Typography>
                            <Box padding='14px'
                                sx={{
                                    border: `1.5px solid gray`,
                                    borderRadius: 1,
                                    '&:hover': {
                                        border: `1.5px solid ${theme.palette.primary.main}`,
                                    }
                                }}>
                            <TextField
                                // Specify the name of the test script.
                                value={restrictionName}
                                required
                                error={nameError}
                                helperText={
                                    nameError
                                        ? t('is_required')
                                        : ''
                                }
                                variant={'standard'}
                                sx={{
                                    marginTop: -1.2,
                                    borderRadius: 1,
                                }}
                                onChange={(e) => {
                                    setNameError(false)
                                    setRestrictionName(
                                        e.target.value
                                    )
                                }}
                            />
                            </Box>
                    </Box>
                    <Box
                        padding='30px'
                        display={'flex'}
                        gap={5}
                        alignItems={'center'}
                    >

                        <Typography
                            variant={'h5'}
                            color={'text.primary'}
                            fontWeight={'bold'}
                        >
                            Type
                        </Typography>
                        <Box padding='5px'
                             sx={{
                                 border: `1.5px solid gray`,
                                 borderRadius: 1,
                                 '&:hover': {
                                    border: `1.5px solid ${theme.palette.primary.main}`,
                                 }
                             }}
                            >
                            <FormControl
                                size="small"
                            >
                                <Select
                                    // Select the file extension of the test script.
                                    // This can be for instance .py or .sh.
                                    label={t('restrictionType')}
                                    labelId={t('restrictionType')}
                                    value={restrictionType}
                                    required
                                    autoWidth
                                    variant={'standard'}
                                    sx={{
                                        borderRadius: 1,
                                        padding: 0.5,
                                    }}
                                    onChange={(e) =>
                                        setRestrictionType(
                                            e.target
                                                .value as restrictionExtension
                                        )
                                    }
                                >
                                    <MenuItem
                                        value={
                                            restrictionExtension.Shell
                                        }
                                        color={'secondary.contrastText'}
                                    >
                                        {restrictionExtension.Shell}
                                    </MenuItem>
                                    <MenuItem
                                        value={
                                            restrictionExtension.Python
                                        }
                                    >
                                        {
                                            restrictionExtension.Python
                                        }
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    {/* TextField for entering test code */}
                    <Box padding='20px'>
                        <Card>
                            <Box aria-label={'Content'} padding={3}>
                                <TextField
                                    fullWidth
                                    value={textFieldContent}
                                    onChange={(e) =>
                                        setTextFieldContent(e.target.value)
                                    }
                                    id="filled-textarea"
                                    multiline
                                    label={'Test-Content'}
                                    variant="standard"
                                    sx={{
                                        overflowY: 'auto',
                                        maxHeight: '100%',
                                    }}
                                />
                            </Box>
                        </Card>
                    </Box>
                    <Stack direction="row" padding='20px' spacing='20px'>
                        <Button
                            autoFocus
                            color="inherit"
                            onClick={() => handleSaveTemplate(restrictionName, restrictionType, textFieldContent, {template_id: 1, user: 1, bestand: 0})} // bestand if maakt niet uit, wordt toch niet gebruikt
                        >
                            save template
                        </Button>
                        <SecundaryButton
                            autoFocus
                            onClick={() => setPopupOpen(true)}
                        >
                            save
                        </SecundaryButton>
                    </Stack>
                </Stack>
            </Dialog>
            <WarningPopup
                title={t('add_restriction') + '?'}
                content={t('this_can_not_be_undone')}
                buttonName={t('add')}
                open={popupOpen}
                handleClose={() => setPopupOpen(false)}
                doAction={handleSubmit}
            />
        </React.Fragment>
    )
}
