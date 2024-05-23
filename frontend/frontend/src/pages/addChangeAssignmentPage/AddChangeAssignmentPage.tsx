import {
    Card,
    Divider,
    EvenlySpacedRow,
} from '../../components/CustomComponents.tsx'
import {
    Box,
    CircularProgress,
    IconButton,
    ListItem,
    Skeleton,
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
import { User } from '../subjectsPage/AddChangeSubjectPage.tsx'

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

    //State for loading the data or showing skeletons
    const [loading, setLoading] = useState(false)
    const [userLoading, setUserLoading] = useState(true)

    // State for the different fields of the assignment
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState<Dayjs | null>(null)
    const [extraDueDate, setExtraDueDate] = useState<Dayjs | null>(null)
    const [oldRestrictions, setOldRestrictions] = useState<restriction[]>([])
    const [restrictions, setRestrictions] = useState<restriction[]>([])
    const [visible, setVisible] = useState(true)
    const [assignmentFile, setAssignmentFile] = useState<File>()
    const [maxScore, SetMaxScore] = useState<number>(20)
    const [cleared, setCleared] = useState<boolean>(false)
    const [filename, setFilename] = useState<string>('indiening.zip')
    const [groupSize, setGroupSize] = useState<number>(1)

    const [user, setUser] = useState<User>()
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
    const [cancelConfirmation, setCancelConfirmation] = useState(false)

    const closeSaveConfirmation = () => {
        setSaveConfirmation(false)
    }

    const closeCancel = () => {
        setCancelConfirmation(false)
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
        //get the data
        const fetchUser = async () => {
            setUserLoading(true)
            const userResponse = await instance.get('/gebruikers/me/')
            setUser(userResponse.data)
            setUserLoading(false)
        }
        const fetchData = async () => {
            //begin loading -> set loading to true
            setLoading(true)
            //get the assignment
            await instance
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
                        setDueDate(dayjs(assignment.deadline))
                        console.log('deadline' + assignment.deadline)
                    }
                    if (assignment.extra_deadline !== null) {
                        setExtraDueDate(dayjs(assignment.extra_deadline))
                        console.log(
                            'extra deadline' + assignment.extra_deadline
                        )
                    }
                })
                .catch((error) => {
                    console.error(error)
                })

            //get the restrictions
            await instance
                .get(`/restricties/?project=${assignmentId}`)
                .then(async (response) => {
                    const restrictions = response.data
                    console.log('returned restrictions ' + restrictions)
                    for (const restr of restrictions) {
                        await instance
                            .get(
                                `/restricties/${restr.restrictie_id}/script/`,
                                {
                                    responseType: 'blob',
                                }
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
                    setOldRestrictions(restrictions)
                    setRestrictions(restrictions)
                })
                .catch((error) => {
                    console.error(error)
                })

            //get the assignment file
            await instance
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

            //end loading -> set loading to false
            setLoading(false)
        }

        //if there is an assignmentId, get the data else use the default values
        fetchUser().catch((error) => {
            console.error(error)
        })
        if (assignmentId !== undefined) {
            fetchData().catch((error) => {
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

        //delete removed restrictions
        oldRestrictions.forEach((oldRestriction) => {
            if (!restrictions.includes(oldRestriction)) {
                instance
                    .delete(
                        '/restricties/' + oldRestriction.restrictie_id + '/'
                    )
                    .catch((error) => {
                        console.error(error)
                    })
            }
        })

        restrictions.forEach((restriction) => {
            const formData = new FormData()
            formData.append('project', projectId)

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
                if (restriction.file !== undefined) {
                    formData.append('script', restriction.file)
                }
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
        formData.append('max_groep_grootte', groupSize.toString())

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
            {/* Rendering different UI based on user role */}
            {userLoading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress color={'primary'} data-cy="loadingAnimation" />
                    <Box></Box>
                </Box>
            ) : (
                <>
                    {user?.is_lesgever ? (
                        // Rendering UI for teacher
                        <>
                            {/* Stack container for layout */}
                            <Stack direction={'column'} paddingX={2}>
                                {/*very ugly but it works functionally*/}
                                {loading ? (
                                    <Header variant={'default'} title={''} />
                                ) : (
                                    <Header variant={'default'} title={title} />
                                )}
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
                                            {/* Here the user gets to specify the assignment name */}
                                            <Typography
                                                variant={'h5'}
                                                color={'text.primary'}
                                                fontWeight={'bold'}
                                            >
                                                {t('assignmentName')}
                                            </Typography>
                                            {loading ? (
                                                <Skeleton
                                                    variant={'text'}
                                                    width={200}
                                                    height={60}
                                                />
                                            ) : (
                                                <TextField
                                                    id='projectName'
                                                    type="text"
                                                    placeholder={t('name')}
                                                    error={
                                                        assignmentErrors.title
                                                    }
                                                    value={title}
                                                    helperText={
                                                        assignmentErrors.title
                                                            ? t('name') +
                                                              ' ' +
                                                              t('is_required')
                                                            : ''
                                                    }
                                                    onChange={(event) =>
                                                        setTitle(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </Box>
                                        {/* File Upload button */}
                                        <Box
                                            padding={0}
                                            marginRight={3}
                                            display={'flex'}
                                            flexDirection={'column'}
                                            alignItems={'flex-start'}
                                        >
                                            {loading ? (
                                                <FileUploadButton
                                                    name={t(
                                                        'upload_assignment'
                                                    )}
                                                    tooltip={t('uploadToolTip')}
                                                    onFileChange={() => {
                                                        console.log('loading')
                                                    }}
                                                    fileTypes={['.pdf', '.zip']}
                                                    path={
                                                        new File(
                                                            [],
                                                            'loading...'
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <FileUploadButton
                                                    name={t(
                                                        'upload_assignment'
                                                    )}
                                                    path={assignmentFile}
                                                    onFileChange={
                                                        handleFileChange
                                                    }
                                                    fileTypes={['.pdf', '.zip']}
                                                    tooltip={t('uploadToolTip')}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    {/* Deadline section.
                    There is both the normal deadline, 
                    and an extra deadline in case people need more time. */}
                                    <Box
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
                                            {/* This section renders the normal deadline. */}
                                            <Typography
                                                variant={'h5'}
                                                color={'text.primary'}
                                                fontWeight={'bold'}
                                            >
                                                Deadline:
                                            </Typography>
                                            {loading ? (
                                                <Skeleton
                                                    variant={'text'}
                                                    width={200}
                                                    height={60}
                                                />
                                            ) : (
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
                                                            minutes:
                                                                renderTimeViewClock,
                                                            seconds:
                                                                renderTimeViewClock,
                                                        }}
                                                        onError={(newError) =>
                                                            SetDeadlineError(
                                                                newError
                                                            )
                                                        }
                                                        slotProps={{
                                                            field: {
                                                                clearable: true,
                                                                onClear: () =>
                                                                    setCleared(
                                                                        true
                                                                    ),
                                                            },
                                                            textField: {
                                                                helperText:
                                                                    errorMessage,
                                                            },
                                                        }}
                                                        onChange={(newValue) =>
                                                            setDueDate(newValue)
                                                        }
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Box>
                                        <Box
                                            aria-label={'secondary_deadline'}
                                            display={'flex'}
                                            flexDirection={'row'}
                                            gap={2}
                                            alignItems={'center'}
                                        >
                                            {/* This section renders the extra deadline. */}
                                            <Typography
                                                variant={'h5'}
                                                color={'text.primary'}
                                                fontWeight={'bold'}
                                            >
                                                Extra Deadline:
                                            </Typography>
                                            {loading ? (
                                                <Skeleton
                                                    variant={'text'}
                                                    width={200}
                                                    height={60}
                                                />
                                            ) : (
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
                                                            minutes:
                                                                renderTimeViewClock,
                                                            seconds:
                                                                renderTimeViewClock,
                                                        }}
                                                        slotProps={{
                                                            field: {
                                                                clearable: true,
                                                                onClear: () =>
                                                                    setCleared(
                                                                        true
                                                                    ),
                                                            },
                                                            textField: {
                                                                error: deadlineCheckError,
                                                                helperText:
                                                                    deadlineCheckError
                                                                        ? t(
                                                                              'deadlineCheck'
                                                                          )
                                                                        : '',
                                                            },
                                                        }}
                                                        onChange={(newValue) =>
                                                            setExtraDueDate(
                                                                newValue
                                                            )
                                                        }
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Box>
                                    </Box>
                                    {/* Description section */}
                                    <Card aria-label={'description'}>
                                        <Box
                                            padding={2}
                                            maxHeight={'18svh'}
                                            minHeight={'18svh'}
                                        >
                                            <Typography
                                                variant={'h5'}
                                                color={'text.primary'}
                                                fontWeight={'bold'}
                                            >
                                                {t('description')}
                                            </Typography>
                                            {loading ? (
                                                <Skeleton
                                                    variant={'text'}
                                                    width={'100%'}
                                                    height={60}
                                                />
                                            ) : (
                                                <TextField
                                                    id='description'
                                                    type="text"
                                                    placeholder={'Description'}
                                                    variant={'standard'}
                                                    multiline
                                                    value={description}
                                                    onChange={(event) =>
                                                        setDescription(
                                                            event.target.value
                                                        )
                                                    }
                                                    fullWidth
                                                    error={
                                                        assignmentErrors.description
                                                    }
                                                    // Show an error message if the description is not filled in.
                                                    helperText={
                                                        assignmentErrors.description
                                                            ? t(
                                                                  'descriptionName'
                                                              ) +
                                                              ' ' +
                                                              t('is_required')
                                                            : ''
                                                    }
                                                    sx={{
                                                        overflowY: 'auto',
                                                        maxHeight: '23svh',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Card>
                                    {/* Restrictions section */}
                                    <Box
                                        aria-label={'restrictions'}
                                        marginTop={3}
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'flex-end'}
                                        gap={1}
                                        width={{ s: '70%', md: '60%' }}
                                    >
                                        <Card
                                            sx={{
                                                backgroundColor:
                                                    'background.default',
                                                width: '70%',
                                                height: '28svh',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    backgroundColor:
                                                        'secondary.main',
                                                    height: 48,
                                                    padding: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant={'h5'}
                                                    fontWeight={'bold'}
                                                >
                                                    {t('restrictions')}
                                                </Typography>
                                                <EvenlySpacedRow
                                                    items={[
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={'bold'}
                                                        >
                                                            {t('name')}
                                                        </Typography>,
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={'bold'}
                                                        >
                                                            {t('must_pass')}
                                                        </Typography>,
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={'bold'}
                                                        >
                                                            {t('remove')}
                                                        </Typography>,
                                                    ]}
                                                />
                                            </Box>
                                            <Divider />
                                            {/*This list will render the restrictions that are added to the assignment.*/}
                                            <Box sx={{ marginTop: -1.1 }}>
                                                <List
                                                    sx={{
                                                        maxHeight: '18vh',
                                                        overflowY: 'auto',
                                                    }}
                                                >
                                                    {loading ? (
                                                        <CircularProgress
                                                            color={'primary'}
                                                        />
                                                    ) : (
                                                        <>
                                                            {restrictions.map(
                                                                (
                                                                    restriction,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <>
                                                                            <Divider />
                                                                            <ListItem
                                                                                sx={{
                                                                                    maxHeight:
                                                                                        '45px',
                                                                                }}
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <RestrictionCard
                                                                                    restriction={
                                                                                        restriction
                                                                                    }
                                                                                    restrictions={
                                                                                        restrictions
                                                                                    }
                                                                                    setRestrictions={
                                                                                        setRestrictions
                                                                                    }
                                                                                />
                                                                            </ListItem>
                                                                        </>
                                                                    )
                                                                }
                                                            )}
                                                        </>
                                                    )}
                                                </List>
                                            </Box>
                                        </Card>
                                        <Box
                                            height={'fit-content'}
                                            width={'fit-content'}
                                            display={'flex'}
                                            flexDirection={'column'}
                                            justifyContent={'flex-end'}
                                            alignItems={'flex-end'}
                                        >
                                            <AddRestrictionButton
                                                // When this button is clicked, a pop up will show.
                                                // This popup will allow you to choose to make a restriction yourself,
                                                // create one starting from a template,
                                                // or choose a file from the system.
                                                restrictions={restrictions}
                                                setRestrictions={(
                                                    newRestrictions
                                                ) =>
                                                    setRestrictions(
                                                        newRestrictions
                                                    )
                                                }
                                                userid={user.user}
                                            ></AddRestrictionButton>
                                        </Box>
                                    </Box>
                                    {/* Main actions section */}
                                    <Box
                                        aria-label={'main actions'}
                                        marginTop={3}
                                        display={'flex'}
                                        flexDirection={'row'}
                                        width={'100%'}
                                        flexWrap={'wrap'}
                                        justifyContent={'space-between'}
                                    >
                                        <Box
                                            aria-label={'visibility_and_groups'}
                                            display={'flex'}
                                            flexDirection={'row'}
                                            gap={10}
                                            flexWrap={'wrap'}
                                            alignItems={'center'}
                                            padding={2}
                                        >
                                            <Box
                                                aria-label={'main actions'}
                                                display={'flex'}
                                                flexDirection={'row'}
                                                alignItems={'center'}
                                            >
                                                <Tooltip
                                                    title={t('visibility')}
                                                >
                                                    {visible ? (
                                                        <IconButton
                                                            // Allows the teacher to select whether
                                                            // the assignment is visible to students or not.
                                                            id='setInVisible'
                                                            color={'info'}
                                                            onClick={() =>
                                                                setVisible(
                                                                    !visible
                                                                )
                                                            }
                                                        >
                                                            <VisibilityIcon
                                                                fontSize={
                                                                    'medium'
                                                                }
                                                            />
                                                        </IconButton>
                                                    ) : (
                                                        <IconButton
                                                            id='setVisible'
                                                            color={'info'}
                                                            onClick={() =>
                                                                setVisible(
                                                                    !visible
                                                                )
                                                            }
                                                        >
                                                            <VisibilityOffIcon
                                                                fontSize={
                                                                    'medium'
                                                                }
                                                            />
                                                        </IconButton>
                                                    )}
                                                </Tooltip>
                                                {assignmentId && !loading && (
                                                    <Tooltip
                                                        title={t('remove')}
                                                    >
                                                        <IconButton
                                                            color={'warning'}
                                                            onClick={
                                                                openDeleteConfirmation
                                                            }
                                                        >
                                                            <DeleteForeverIcon
                                                                fontSize={
                                                                    'medium'
                                                                }
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                            {/* change group size allowed, no need for extra group switch*/}
                                            {!assignmentId && (
                                                <Box
                                                    aria-label={'groupSize'}
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    gap={1}
                                                    height={40}
                                                    alignItems={'center'}
                                                >
                                                    <Typography
                                                        fontWeight={'bold'}
                                                        color={'text.primary'}
                                                    >
                                                        {t('n_of_members')}
                                                    </Typography>
                                                    {loading ? (
                                                        <Skeleton
                                                            variant={'text'}
                                                            width={60}
                                                            height={60}
                                                        />
                                                    ) : (
                                                        <TextField
                                                            id='groupSize'
                                                            sx={{ width: 80 }}
                                                            label={'Group Size'}
                                                            type={'number'}
                                                            required
                                                            value={groupSize}
                                                            onChange={(event) =>
                                                                setGroupSize(
                                                                    parseInt(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                            {/* This section allows the teacher to set the maximum score for the assignment.*/}
                                            <Box
                                                aria-label={'maxScore'}
                                                display={'flex'}
                                                flexDirection={'row'}
                                                gap={1}
                                                height={40}
                                                alignItems={'center'}
                                            >
                                                <Typography
                                                    fontWeight={'bold'}
                                                    color={'text.primary'}
                                                >
                                                    Max Score
                                                </Typography>
                                                {loading ? (
                                                    <Skeleton
                                                        variant={'text'}
                                                        width={60}
                                                        height={60}
                                                    />
                                                ) : (
                                                    <TextField
                                                        id='maxScore'
                                                        sx={{ width: 80 }}
                                                        required
                                                        label={'Max Score'}
                                                        type={'number'}
                                                        value={maxScore}
                                                        onChange={(event) => {
                                                            if (
                                                                event.target
                                                                    .value !==
                                                                ''
                                                            ) {
                                                                const newScore =
                                                                    Math.max(
                                                                        parseInt(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        ),
                                                                        0
                                                                    )
                                                                SetMaxScore
                                                                    ? SetMaxScore(
                                                                          newScore
                                                                      )
                                                                    : undefined
                                                            } else {
                                                                SetMaxScore
                                                                    ? SetMaxScore(
                                                                          parseInt(
                                                                              event
                                                                                  .target
                                                                                  .value
                                                                          )
                                                                      )
                                                                    : undefined
                                                            }
                                                        }}
                                                    />
                                                )}
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
                                                    onClick={() =>
                                                        setCancelConfirmation(
                                                            true
                                                        )
                                                    }
                                                    sx={{
                                                        backgroundColor:
                                                            'secondary.main',
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <ClearIcon
                                                        fontSize={'medium'}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('submit')}>
                                                <IconButton
                                                    id='save'
                                                    type="submit"
                                                    aria-label={'submit'}
                                                    sx={{
                                                        backgroundColor:
                                                            'primary.main',
                                                        borderRadius: 2,
                                                        color: 'background.default',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'secondary.main',
                                                            color: 'text.primary',
                                                        },
                                                    }}
                                                >
                                                    <SaveIcon
                                                        fontSize={'medium'}
                                                    />
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
                                {/* Confirmation popup for canceling changes*/}
                                <WarningPopup
                                    title={t('undo_changes_warning')}
                                    content={t('cant_be_undone')}
                                    buttonName={t('confirm')}
                                    open={cancelConfirmation}
                                    handleClose={closeCancel}
                                    doAction={handleCancel}
                                />
                            </Stack>
                        </>
                    ) : (
                        navigate('*')
                    )}
                </>
            )}
        </>
    )
}
