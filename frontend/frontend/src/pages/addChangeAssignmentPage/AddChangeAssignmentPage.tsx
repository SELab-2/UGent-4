import {
    Box,
    Card,
    IconButton,
    ListItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { Header } from '../../components/Header.tsx'
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { t } from 'i18next'
import {
    DateTimePicker,
    DateTimeValidationError,
    LocalizationProvider,
    renderTimeViewClock,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs'
import 'dayjs/locale/nl'
import FileUploadButton from '../../components/FileUploadButton'
import List from '@mui/material/List'
import ClearIcon from '@mui/icons-material/Clear'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SaveIcon from '@mui/icons-material/Save'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../axiosConfig.ts'
import WarningPopup from '../../components/WarningPopup.tsx'
import AddRestrictionButton from './AddRestrictionButton.tsx'
import { RestrictionCard } from '../../components/RestrictionCard.tsx'

//TODO: add restriction functionality
/**
 * This page is used to add or change an assignment.
 * The page should only be accessible to teachers of the course.
 * The page should contain a form to fill in the details of the assignment.
 * The form should contain the following fields:
 * - Title
 * - Description
 * - Due date with datepicker
 * - Extra deadline with datepicker
 * - Restrictions
 * - Groups
 * - Visible
 * - Max score
 * The form should also contain a button to upload the assignment file for ease of use.
 * Groups are managed with a popup, should be managed with a different api call.
 * restrictions use a different api call as well.
 */

export interface getAssignment {
    project_id: number
    titel: string
    beschrijving: string
    opgave_bestand: string
    vak: number
    max_score: number
    max_groep_grootte: number
    deadline: string | null
    extra_deadline: string | null
    zichtbaar: boolean
    gearchiveerd: boolean
    file?: File
}

export interface restriction {
    restrictie_id?: number
    project?: number
    script: string
    file?: File
    moet_slagen: boolean
}

interface errorChecks {
    title: boolean
    description: boolean
    deadlineCheck: boolean
}

export function AddChangeAssignmentPage() {
    const navigate = useNavigate()

    // State for the different fields of the assignment
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState<Dayjs | null>(null)
    const [extraDueDate, setExtraDueDate] = useState<Dayjs | null>(null)
    const [restrictions, setRestrictions] = useState<restriction[]>([])
    const [visible, setVisible] = useState(false)
    const [assignmentFile, setAssignmentFile] = useState<File>()
    const [maxScore, SetMaxScore] = useState<number>(20)
    const [cleared, setCleared] = useState<boolean>(false)
    const [filename, setFilename] = useState<string>('indiening.zip')

    // State for the error checks of the assignment
    const [assignmentErrors, setAssignmentErrors] = useState<errorChecks>({
        title: false,
        description: false,
        deadlineCheck: false,
    })
    const [deadlineError, SetDeadlineError] =
        useState<DateTimeValidationError | null>(null)

    //confirmation dialogs
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [saveConfirmation, setSaveConfirmation] = useState(false)

    const closeSaveConfirmation = () => {
        setSaveConfirmation(false)
    }

    //open the delete confirmation dialog
    const openDeleteConfirmation = () => {
        setDeleteConfirmation(true)
    }

    const closeDeletion = () => {
        setDeleteConfirmation(false)
    }

    const handleRemove = async () => {
        if (assignmentId !== undefined) {
            await instance
                .delete(`/projecten/${assignmentId}`)
                .catch((error) => {
                    console.error(error)
                })
        }
        alert('Assignment Removed')
        navigate(-1)
    }

    //url parameters
    const { courseId, assignmentId } = useParams()

    //handle the cancelation of changes
    const handleCancel = () => {
        if (assignmentId !== undefined) {
            navigate('/course/' + courseId + '/assignment/' + assignmentId)
        } else {
            navigate('/course/' + courseId)
        }
    }

    //set the initial values of the assignment if it is an edit
    useEffect(() => {
        if (assignmentId !== undefined) {
            instance
                .get<getAssignment>(`/projecten/${assignmentId}`)
                .then((response) => {
                    const assignment = response.data
                    console.log(
                        'returned assignment ' +
                            assignment.titel +
                            ' ' +
                            assignment.beschrijving
                    )
                    setTitle(assignment.titel)
                    setDescription(assignment.beschrijving)

                    console.log('bestand' + assignment.opgave_bestand)
                    setFilename(() => assignment.opgave_bestand)
                    SetMaxScore(assignment.max_score)
                    console.log('max score' + assignment.max_score)

                    setVisible(assignment.zichtbaar)
                    if (assignment.deadline !== null) {
                        setDueDate(
                            dayjs(assignment.deadline, 'YYYY-MM-DDTHH:mm:ss')
                        )
                        console.log('deadline' + assignment.deadline)
                    }
                    if (assignment.extra_deadline !== null) {
                        setExtraDueDate(
                            dayjs(
                                assignment.extra_deadline,
                                'YYYY-MM-DDTHH:mm:ss'
                            )
                        )
                        console.log(
                            'extra deadline' + assignment.extra_deadline
                        )
                    }
                })
                .catch((error) => {
                    console.error(error)
                })

            //get the restrictions
            instance
                .get(`/restricties/?project=${assignmentId}`)
                .then(async (response) => {
                    const restrictions = response.data
                    console.log('returned restrictions ' + restrictions)
                    for (const restr of restrictions) {
                        await instance
                            .get(
                                `/restricties/${restr.restrictie_id}/script/`,
                                { responseType: 'blob' }
                            )
                            .then((response) => {
                                const blob = new Blob([response.data], {
                                    type: response.headers['content-type'],
                                })
                                restr.file = new File([blob], filename, {
                                    type: response.headers['content-type'],
                                })
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                    }
                    setRestrictions(restrictions)
                })
                .catch((error) => {
                    console.error(error)
                })

            //get the assignment file
            instance
                .get(`/projecten/${assignmentId}/opgave_bestand/`, {
                    responseType: 'blob',
                })
                .then((response) => {
                    const blob = new Blob([response.data], {
                        type: response.headers['content-type'],
                    })
                    const file: File = new File([blob], filename, {
                        type: response.headers['content-type'],
                    })

                    setAssignmentFile(file)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [assignmentId, filename])

    // make the datepickers clearable
    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false)
            }, 1500)

            return () => clearTimeout(timeout)
        }
        return () => {}
    }, [cleared])

    /**
     * Function to upload the details of the assignment through a text file
     * @param {ChangeEvent<HTMLInputElement>} event - The event object
     */
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAssignmentFile(event.target.files[0])
            console.log(assignmentFile?.name)
        }
    }

    const [deadlineCheckError, setDeadlineCheck] = useState<boolean>(false)

    useEffect(() => {
        if (dueDate === null && extraDueDate === null) {
            setDeadlineCheck(false)
        } else if (dueDate !== null && extraDueDate !== null) {
            setDeadlineCheck(extraDueDate.diff(dueDate) < 0)
        } else if (dueDate !== null && extraDueDate === null) {
            setDeadlineCheck(false)
        } else {
            setDeadlineCheck(true)
        }
    }, [dueDate, extraDueDate])

    // Handle the submission of the form, check if all required fields are filled in, and send the data to the API.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //Don't make api calls if the form is not filled in correctly.
        setAssignmentErrors({
            title: title === '',
            description: description === '',
            deadlineCheck: deadlineCheckError,
        })
        if (title === '' || description === '' || deadlineCheckError) {
            return
        }
        setSaveConfirmation(true)
    }

    //handle restrictionupload
    const handleRestrictionUpload = (projectId: string) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }

        restrictions.forEach((restriction) => {
            const formData = new FormData()
            formData.append('project', projectId)
            if (restriction.file !== undefined) {
                formData.append('script', restriction.file)
            }
            formData.append('moet_slagen', restriction.moet_slagen.toString())
            if (restriction.restrictie_id !== undefined) {
                formData.append(
                    'restrictie_id',
                    restriction.restrictie_id.toString()
                )
                instance
                    .patch(
                        '/restricties/' + restriction.restrictie_id + '/',
                        formData,
                        config
                    )
                    .catch((error) => {
                        console.error(error)
                    })
            } else {
                instance
                    .post('/restricties/', formData, config)
                    .catch((error) => {
                        console.error(error)
                    })
            }
        })
    }

    // Upload the assignment to the API. patch if it is an edit, post if it is a new assignment.
    const uploadAssignment = async () => {
        let optionalFile: File | null = null
        if (assignmentFile !== undefined) {
            optionalFile = assignmentFile
        }
        const formData = new FormData()
        formData.append('titel', title)
        formData.append('beschrijving', description)
        formData.append('vak', parseInt(courseId as string).toString())
        if (optionalFile) {
            formData.append('opgave_bestand', optionalFile)
        }
        formData.append('zichtbaar', visible.toString())

        // Add optional fields
        if (maxScore !== 20) {
            formData.append('max_score', maxScore.toString())
        }
        if (dueDate !== null) {
            formData.append('deadline', dueDate.format())
        }
        if (extraDueDate !== null) {
            formData.append('extra_deadline', extraDueDate.format())
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        if (assignmentId !== undefined) {
            formData.append('project_id', assignmentId)
            await instance
                .patch(
                    '/projecten/' + parseInt(assignmentId) + '/',
                    formData,
                    config
                )
                .catch((error) => {
                    console.error(error)
                })

            //upload the restrictions
            handleRestrictionUpload(assignmentId.toString())
        } else {
            //if there is no assignmentId, it is a new assignment
            let project_id: number = 0

            await instance
                .post('/projecten/', formData, config)
                .then((response) => (project_id = response.data.project_id))
                .catch((error) => {
                    console.error(error)
                })

            //upload the restrictions
            handleRestrictionUpload(project_id.toString())
        }

        console.info(
            'Form submitted',
            title,
            description,
            dueDate,
            restrictions,
            visible,
            assignmentFile
        )
        setSaveConfirmation(false)
        if (assignmentId !== undefined) {
            navigate('/course/' + courseId + '/assignment/' + assignmentId)
        } else {
            navigate('/course/' + courseId)
        }
    }

    // Handle the error messages for the date picker.
    const errorMessage = useMemo(() => {
        switch (deadlineError) {
            case 'disablePast': {
                return t('not_before_now')
            }

            default: {
                return ''
            }
        }
    }, [deadlineError])

    return (
        <>
            {/* Stack container for layout */}
            <Stack direction={'column'} paddingX={2}>
                <Header variant={'default'} title={title} />

                {/* Form for submitting assignment */}
                <Stack
                    direction={'column'}
                    marginTop={11}
                    component={'form'}
                    onSubmit={handleSubmit}
                >
                    <Box
                        aria-label={'title_and_upload'}
                        padding={2}
                        paddingRight={0}
                        gap={1}
                        display={'flex'}
                        flexDirection={'row'}
                        width={'98%'}
                        justifyContent={'space-between'}
                    >
                        <Box
                            aria-label={'title'}
                            display={'flex'}
                            flexDirection={'row'}
                            gap={2}
                            alignItems={'center'}
                        >
                            <Typography
                                variant={'h6'}
                                color={'text.primary'}
                                fontWeight={'bold'}
                            >
                                {t('assignmentName')}
                            </Typography>
                            <TextField
                                id='titleField'
                                type="text"
                                placeholder={'Title'}
                                error={assignmentErrors.title}
                                value={title}
                                helperText={
                                    assignmentErrors.title
                                        ? t('name') + ' ' + t('is_required')
                                        : ''
                                }
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </Box>
                        {/* File Upload button */}
                        <Box
                            id='uploadButton'
                            padding={0}
                            marginRight={3}
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'flex-start'}
                        >
                            <FileUploadButton
                                name={t('upload_assignment')}
                                path={assignmentFile}
                                onFileChange={handleFileChange}
                                fileTypes={['.pdf', '.zip']}
                                tooltip={t('uploadToolTip')}
                            />
                        </Box>
                    </Box>
                    {/* Deadline section */}
                    <Box
                        data-test-id="deadline-id"
                        aria-label={'deadline'}
                        padding={2}
                        display={'flex'}
                        flexDirection={{
                            xs: 'column',
                            sm: 'column',
                            md: 'row',
                        }}
                        gap={5}
                    >
                        <Box
                            aria-label={'initial_deadline'}
                            display={'flex'}
                            flexDirection={'row'}
                            gap={2}
                            alignItems={'center'}
                        >
                            <Typography
                                id='deadline'
                                variant={'h6'}
                                color={'text.primary'}
                                fontWeight={'bold'}
                            >
                                Deadline:
                            </Typography>
                            <LocalizationProvider  
                                dateAdapter={AdapterDayjs}
                                adapterLocale="nl"
                            >
                                <DateTimePicker
                                    format="DD/MM/YYYY HH:mm"
                                    value={dueDate}
                                    disablePast
                                    label={t('optional')}
                                    sx={{ width: 250 }}
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}
                                    onError={(newError) =>
                                        SetDeadlineError(newError)
                                    }
                                    slotProps={{
                                        field: {
                                            clearable: true,
                                            onClear: () => setCleared(true),
                                        },
                                        textField: {
                                            helperText: errorMessage,
                                            inputProps: {
                                                id: 'deadlineField',
                                            },
                                        },
                                    }}
                                    onChange={(newValue) =>
                                        setDueDate(newValue)
                                    }
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box
                            aria-label={'secondary_deadline'}
                            display={'flex'}
                            flexDirection={'row'}
                            gap={2}
                            alignItems={'center'}
                        >
                            <Typography
                                id='extraDeadline'
                                variant={'h6'}
                                color={'text.primary'}
                                fontWeight={'bold'}
                            >
                                Extra Deadline:
                            </Typography>
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="nl"
                            >
                                <DateTimePicker
                                    format="DD/MM/YYYY HH:mm"
                                    value={extraDueDate}
                                    disablePast
                                    label={t('optional')}
                                    sx={{ width: 250 }}
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}
                                    slotProps={{
                                        field: {
                                            clearable: true,
                                            onClear: () => setCleared(true),
                                        },
                                        textField: {
                                            error: deadlineCheckError,
                                            helperText: deadlineCheckError
                                                ? t('deadlineCheck')
                                                : '',
                                            inputProps: {
                                                id: 'extraDeadlineField',
                                            },
                                        },
                                    }}
                                    onChange={(newValue) =>
                                        setExtraDueDate(newValue)
                                    }
                                />
                            </LocalizationProvider>
                        </Box>
                    </Box>
                    {/* Description section */}
                    <Card
                        aria-label={'description'}
                        elevation={1}
                        sx={{ backgroundColor: 'background.default' }}
                    >
                        <Box
                            padding={2}
                            maxHeight={'20svh'}
                            minHeight={'20svh'}
                        >
                            <Typography
                                variant={'h6'}
                                color={'text.primary'}
                                fontWeight={'bold'}
                            >
                                {t('description')}
                            </Typography>
                            <TextField
                                id='descriptionField'
                                type="text"
                                placeholder={'Description'}
                                variant={'standard'}
                                multiline
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                fullWidth
                                error={assignmentErrors.description}
                                helperText={
                                    assignmentErrors.description
                                        ? t('descriptionName') +
                                          ' ' +
                                          t('is_required')
                                        : ''
                                }
                                sx={{ overflowY: 'auto', maxHeight: '25svh' }}
                            />
                        </Box>
                    </Card>
                    {/* Restrictions section */}
                    <Box
                        aria-label={'restrictions'}
                        marginTop={3}
                        display={'flex'}
                        flexDirection={'row'}
                    >
                        <Card
                            sx={{
                                padding: 1,
                                backgroundColor: 'background.default',
                                width: '70%',
                                height: '28svh',
                            }}
                        >
                            <Typography variant={'h6'} fontWeight={'bold'}>
                                {t('restrictions')}
                            </Typography>
                            <Box sx={{ padding: 1 }}>
                                <List
                                    sx={{
                                        maxHeight: '18vh',
                                        overflowY: 'auto',
                                    }}
                                >
                                    {restrictions.map((restriction, index) => {
                                        return (
                                            <ListItem key={index}>
                                                <RestrictionCard
                                                    restriction={restriction}
                                                    restrictions={restrictions}
                                                    setRestrictions={
                                                        setRestrictions
                                                    }
                                                />
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Box>
                            <Box
                                width={'100%'}
                                display={'flex'}
                                justifyContent={'flex-end'}
                            >
                                <Tooltip title={t('add_restriction')}>
                                    {/*<IconButton color={"primary"}
                                                disabled={allowedTypes.length === 0}
                                onClick={handleAddRestriction}><AddIcon/></IconButton>*/}
                                    <AddRestrictionButton
                                        restrictions={restrictions}
                                        setRestrictions={(newRestrictions) =>
                                            setRestrictions(newRestrictions)
                                        }
                                    ></AddRestrictionButton>
                                    {/*<Button>Show restrictions</Button>*/}
                                </Tooltip>
                            </Box>
                        </Card>
                    </Box>
                    {/* Main actions section */}
                    <Box
                        aria-label={'main actions'}
                        marginTop={3}
                        display={'flex'}
                        flexDirection={'row'}
                        width={'100%'}
                        justifyContent={'space-between'}
                    >
                        <Box
                            aria-label={'visibility_and_groups'}
                            display={'flex'}
                            flexDirection={'row'}
                            gap={10}
                            alignItems={'center'}
                            padding={2}
                        >
                            <Box
                                aria-label={'main actions'}
                                display={'flex'}
                                flexDirection={'row'}
                                alignItems={'center'}
                            >
                                {visible ? (
                                    <IconButton
                                        id='visibilityOn'
                                        color={'info'}
                                        onClick={() => setVisible(!visible)}
                                    >
                                        <VisibilityIcon fontSize={'medium'} />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        id='visibilityOff'
                                        color={'info'}
                                        onClick={() => setVisible(!visible)}
                                    >
                                        <VisibilityOffIcon
                                            fontSize={'medium'}
                                        />
                                    </IconButton>
                                )}
                                <Tooltip title={t('remove')}>
                                    <IconButton
                                        id='delete'
                                        color={'warning'}
                                        onClick={openDeleteConfirmation}
                                    >
                                        <DeleteForeverIcon
                                            fontSize={'medium'}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box
                                aria-label={'maxScore'}
                                display={'flex'}
                                flexDirection={'row'}
                                gap={1}
                                alignItems={'center'}
                            >
                                <Typography
                                    id='maxScore'
                                    fontWeight={'bold'}
                                    color={'text.primary'}
                                >
                                    Max Score:
                                </Typography>
                                <TextField
                                    id='maxScoreField'
                                    sx={{ width: 80 }}
                                    required
                                    label={'Max Score'}
                                    type={'number'}
                                    value={maxScore}
                                    onChange={(event) => {
                                        if (event.target.value !== '') {
                                            const newScore = Math.max(
                                                parseInt(event.target.value),
                                                0
                                            )
                                            SetMaxScore
                                                ? SetMaxScore(newScore)
                                                : undefined
                                        } else {
                                            SetMaxScore
                                                ? SetMaxScore(
                                                      parseInt(
                                                          event.target.value
                                                      )
                                                  )
                                                : undefined
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* Submit and Cancel buttons */}
                        <Box
                            aria-label={'submit_and_cancel'}
                            display={'flex'}
                            flexDirection={'row'}
                            gap={1}
                            alignItems={'center'}
                        >
                            <Tooltip title={t('cancel')}>
                                <IconButton
                                    id='cancel'
                                    onClick={handleCancel}
                                    sx={{
                                        backgroundColor: 'secondary.main',
                                        borderRadius: 2,
                                    }}
                                >
                                    <ClearIcon fontSize={'medium'} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t('submit')}>
                                <IconButton
                                    id='submit'
                                    type="submit"
                                    aria-label={'submit'}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        borderRadius: 2,
                                        color: 'background.default',
                                        '&:hover': {
                                            backgroundColor: 'secondary.main',
                                            color: 'text.primary',
                                        },
                                    }}
                                >
                                    <SaveIcon fontSize={'medium'} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Stack>

                {/* Popup for adding restrictions */}

                {/* Confirmation popup for deleting project */}

                <WarningPopup
                    title={t('remove') + ' Project?'}
                    content={t('cant_be_undone')}
                    buttonName={t('remove')}
                    open={deleteConfirmation}
                    handleClose={closeDeletion}
                    doAction={handleRemove}
                />
                {/* Confirmation popup for saving project */}
                <WarningPopup
                    title={t('save_project_warning')}
                    content={t('visible_for_everyone')}
                    buttonName={t('confirm')}
                    open={saveConfirmation}
                    handleClose={closeSaveConfirmation}
                    doAction={uploadAssignment}
                />
            </Stack>
        </>
    )
}
