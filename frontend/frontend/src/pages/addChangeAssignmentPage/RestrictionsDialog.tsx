import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import {
    Button,
    Card,
    SecondaryButton,
} from '../../components/CustomComponents.tsx'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import CodeIcon from '@mui/icons-material/Code'
import {
    Alert,
    Box,
    Collapse,
    FormControl,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material'
import { t } from 'i18next'
import { restriction } from './AddChangeAssignmentPage.tsx'
import WarningPopup from '../../components/WarningPopup.tsx'
import RestrictionsTemplateUI from './RestrictionTemplateUI.tsx'
import instance from '../../axiosConfig.ts'
import BorderColorIcon from '@mui/icons-material/BorderColor'

interface RestrictionsDialogProps {
    userid: number
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
    bestand: string
}

/*const code = `

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

#code...`*/

/**
 * Dialog component for managing restrictions related to file uploads.
 * @param {Object} props - Props object.
 * @param {Function} props.closeParentDialog - Function to close the parent dialog.
 * @returns {React.ReactElement} - Dialog component.
 */
export default function RestrictionsDialog({
    userid,
    restrictions,
    setRestrictions,
    closeParentDialog,
}: RestrictionsDialogProps) {
    const [openTextEditor, setOpenTextEditor] = useState(false)
    const [openTemplateInterface, setOpenTemplateInterface] = useState(false)
    const [code, setCode] = useState('' /*code*/) // code is currently not used
    const [textFieldContent, setTextFieldContent] = useState('')
    const [restrictionName, setRestrictionName] = useState('')
    const [restrictionType, setRestrictionType] =
        useState<restrictionExtension>(restrictionExtension.Shell)
    const [nameError, setNameError] = useState(false)
    const [popupOpen, setPopupOpen] = useState(false)
    const [myTemplates, setMyTemplates] = useState<Template[]>([])

    const [saveAlert, setSaveAlert] = useState(false)
    const [saveErrorAlert, setSaveErrorAlert] = useState(false)
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
                    moet_slagen: false,
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
            moet_slagen: false,
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

    //upload the test script as a template for later use
    const handleSaveTemplate = async (
        filename: string,
        fileExtension: restrictionExtension,
        code: string
    ) => {
        // note how we don't write a dot between the filename and the file extension
        // this is because the file extension already starts with a dot
        const file = new File([code], `${filename}${fileExtension}`, {
            type: 'text/plain',
        })
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            const formdata = new FormData()

            formdata.append('user', userid.toString())
            formdata.append('bestand', file)

            const result = await instance.post(`/templates/`, formdata, config)
            if (result.status === 201) {
                setSaveAlert(true) // Show the alert
                setTimeout(() => {
                    setSaveAlert(false) // Hide the alert after 5 seconds
                }, 4000)
            }
        } catch (error) {
            setSaveErrorAlert(true)
            setTimeout(() => {
                setSaveErrorAlert(false)
            }, 4000)
            console.error('Error updating data:', error)
        }
    }

    // Buttons array for the vertical button group
    const buttons = [
        <Button id="upload" key="Upload" component={'label'}>
            Upload script
            <input hidden type="file" multiple onChange={handleUploadedFiles} />
        </Button>,
        <Button
            id="newScript"
            key="New_Script"
            onClick={() => {
                handleClickOpenTextEditor()
            }}
        >
            {t('new_script')}
        </Button>,
    ]

    React.useEffect(() => {
        async function fetchData() {
            try {
                const response = await instance.get<Template[]>(
                    `/templates/?lesgever_id=${userid}`
                )
                setMyTemplates(response.data)
                console.log('templates:')
                console.log(response.data)
                console.log('----------')
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData().catch((e) => {
            console.error(e)
        })
    }, [userid])

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
                data-cy="uploadInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                    handleUploadedFiles(e)
                }}
                multiple
            />
            {/* Vertical button group */}
            <Typography
                variant={'h6'}
                color={'secondary.contrastText'}
                data-cy="new_scripts_section"
            >
                {t('make_new_script') + ':'}
            </Typography>

            <Box
                paddingTop="5px"
                display={'flex'}
                gap={5}
                alignItems={'center'}
            >
                {buttons}
            </Box>
            <Box padding="20px" />
            <Typography
                variant={'h6'}
                color={'secondary.contrastText'}
                data-cy="existing_scripts_section"
            >
                {t('choose_existing') + ':'}
            </Typography>
            <Box
                paddingTop="5px"
                paddingBottom="5px"
                display={'flex'}
                gap={5}
                alignItems={'center'}
            >
                <Box
                    sx={{
                        maxHeight: 150,
                        overflowY: 'auto',
                    }}
                >
                    {/* This button groups shows the templates the teacher has made */}
                    <Stack direction={'column'}>
                        {myTemplates.map((template) => (
                            <Box marginY={0.5}>
                                <Tooltip title={t('add_restriction')}>
                                    <Button
                                        sx={{ borderRadius: '10px 0 0 10px' }}
                                        key={template.template_id}
                                        onClick={async () => {
                                            const response = await instance.get(
                                                `/templates/${template.template_id}/template/?content=true`
                                            )
                                            // This textFieldContent will be used when a template is opened in textmode
                                            setTextFieldContent(
                                                response.data.content
                                            )

                                            // The code will be used when a template is opened in the UI
                                            setCode(response.data.content)

                                            const templatename =
                                                template.bestand
                                                    .replace(/^.*[\\/]/, '')
                                                    .split('.')[0]
                                            const templateextension =
                                                '.' +
                                                template.bestand.split('.')[1]
                                            setRestrictionName(templatename)
                                            setRestrictionType(
                                                templateextension as restrictionExtension
                                            )
                                            handleSubmit()
                                        }}
                                    >
                                        <Typography
                                            width={200}
                                            textOverflow={'ellipsis'}
                                        >
                                            {template.bestand.replace(
                                                /^.*[\\/]/,
                                                ''
                                            )}
                                        </Typography>
                                    </Button>
                                </Tooltip>
                                <Tooltip title={t('openinUi')}>
                                    <IconButton
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            borderRadius: 0,
                                            padding: 1,
                                            margin: 0,
                                        }}
                                        aria-label={'openinUi'}
                                        onClick={async () => {
                                            const response = await instance.get(
                                                `/templates/${template.template_id}/template/?content=true`
                                            )
                                            // This textFieldContent will be used when a template is opened in textmode
                                            setTextFieldContent(
                                                response.data.content
                                            )

                                            // The code will be used when a template is opened in the UI
                                            setCode(response.data.content)

                                            const templatename =
                                                template.bestand
                                                    .replace(/^.*[\\/]/, '')
                                                    .split('.')[0]
                                            const templateextension =
                                                '.' +
                                                template.bestand.split('.')[1]
                                            setRestrictionName(templatename)
                                            setRestrictionType(
                                                templateextension as restrictionExtension
                                            )
                                            handleClickOpenTemplateInterface()
                                        }}
                                    >
                                        <BorderColorIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('openInEditor')}>
                                    <IconButton
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            borderRadius: '0 10px 10px 0',
                                            padding: 1,
                                            margin: 0,
                                        }}
                                        aria-label={'openinUi'}
                                        onClick={async () => {
                                            const response = await instance.get(
                                                `/templates/${template.template_id}/template/?content=true`
                                            )
                                            // This textFieldContent will be used when a template is opened in textmode
                                            setTextFieldContent(
                                                response.data.content
                                            )

                                            // The code will be used when a template is opened in the UI
                                            setCode(response.data.content)

                                            const templatename =
                                                template.bestand
                                                    .replace(/^.*[\\/]/, '')
                                                    .split('.')[0]
                                            const templateextension =
                                                '.' +
                                                template.bestand.split('.')[1]
                                            setRestrictionName(templatename)
                                            setRestrictionType(
                                                templateextension as restrictionExtension
                                            )
                                            handleClickOpenTextEditor()
                                        }}
                                    >
                                        <CodeIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>
            {/* This is the template interface. */}
            <Dialog
                fullScreen
                open={openTemplateInterface}
                onClose={handleCloseTemplateInterface}
            >
                <RestrictionsTemplateUI
                    restrictionCode={code}
                    handleCloseTemplateInterface={handleCloseTemplateInterface}
                    templateFileName={restrictionName + restrictionType}
                    restrictions={restrictions}
                    setRestrictions={setRestrictions}
                />
            </Dialog>
            {/* This is the code editor. */}
            <Dialog
                fullScreen
                open={openTextEditor}
                onClose={handleCloseTextEditor}
            >
                <Box>
                    <AppBar elevation={0} sx={{ position: 'relative' }}>
                        <Toolbar>
                            <Box
                                display={'flex'}
                                flexDirection={'row'}
                                alignItems={'center'}
                                width={'100%'}
                                justifyContent={'space-between'}
                            >
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    justifyContent={'flex-start'}
                                >
                                    <IconButton
                                        data-cy="closeIcon"
                                        edge="start"
                                        color="inherit"
                                        onClick={handleCloseTextEditor}
                                        aria-label="close"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        padding={1}
                                        justifyContent={'center'}
                                        gap={1}
                                    >
                                        <TextField
                                            // Specify the name of the test script.
                                            id='scriptName'
                                            label={t('name')}
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
                                                '& .MuiInputBase-root': {
                                                    color: 'secondary.main',
                                                },
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
                                        <FormControl
                                            sx={{ minWidth: 80 }}
                                            size="small"
                                        >
                                            <Select
                                                // Select the file extension of the test script.
                                                // This can be for instance .py or .sh.
                                                id='extension'
                                                label={t('restrictionType')}
                                                labelId={t('restrictionType')}
                                                value={restrictionType}
                                                variant={'standard'}
                                                required
                                                autoWidth
                                                sx={{
                                                    '& .MuiSelect-select': {
                                                        color: 'secondary.main',
                                                    },
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
                                                    color={'text.secondary'}
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
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <SecondaryButton
                                        id='saveTemplate'
                                        autoFocus
                                        color="inherit"
                                        onClick={() =>
                                            handleSaveTemplate(
                                                restrictionName,
                                                restrictionType,
                                                textFieldContent
                                            )
                                        } // bestand if maakt niet uit, wordt toch niet gebruikt
                                    >
                                        save as template
                                    </SecondaryButton>
                                    <Box paddingRight="10px" />
                                    <SecondaryButton
                                        id='saveScript'
                                        autoFocus
                                        color="inherit"
                                        onClick={() => setPopupOpen(true)}
                                    >
                                        save
                                    </SecondaryButton>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    {/* TextField for entering test code */}
                    <Box padding="20px">
                        <Card>
                            <Box aria-label={'Content'} padding={1}>
                                <TextField
                                    id='scriptContent'
                                    fullWidth
                                    value={textFieldContent}
                                    onChange={(e) =>
                                        setTextFieldContent(e.target.value)
                                    }
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
                </Box>
                <Box
                    display={'flex'}
                    flexDirection={'row-reverse'}
                    alignItems={'flex-end'}
                    justifyContent={'flex-start'}
                    flexGrow={1}
                >
                    {saveAlert && (
                        <Collapse in={saveAlert} timeout={500}>
                            <Alert
                                variant={'outlined'}
                                sx={{
                                    width: 'fit-content',
                                    margin: 1,
                                }}
                                severity="success"
                            >
                                {t('template_saved_successfully')}
                            </Alert>
                        </Collapse>
                    )}

                    {saveErrorAlert && (
                        <Collapse in={saveErrorAlert} timeout={500}>
                            <Alert
                                variant={'outlined'}
                                sx={{
                                    width: 'fit-content',
                                    margin: 1,
                                }}
                                severity="error"
                            >
                                {t('error') + ' ' + t('try_again')}
                            </Alert>
                        </Collapse>
                    )}
                </Box>
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
