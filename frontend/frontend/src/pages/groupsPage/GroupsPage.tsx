import { Header } from '../../components/Header.tsx'
import {
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import Switch from '@mui/material/Switch'
import { t } from 'i18next'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../axiosConfig.ts'
import CancelIcon from '@mui/icons-material/Cancel'
import DialogActions from '@mui/material/DialogActions'
import { Add } from '@mui/icons-material'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import WarningPopup from '../../components/WarningPopup.tsx'

// group interface
export interface Group {
    groep_id?: number
    studenten: number[]
    project: number
}

// Typescript typing for hashmap
type Hashmap = Map<number, string>

export function GroupsPage() {
    const navigate = useNavigate()

    // Get the parameters from the URL
    const { courseId, assignmentId } = useParams() as {
        courseId: string
        assignmentId: string
    }

    const [studentNames, setStudentNames] = useState<Hashmap>(
        new Map<number, string>()
    )
    //state for new groups and new groupSize, don't change the old groups and groupSize until the user clicks save
    const [newGroups, setNewGroups] = useState<Group[]>([])
    const [newGroupSize, setNewGroupSize] = useState(1)
    const [currentGroup, setCurrentGroup] = useState('')
    const [availableStudents, setAvailableStudents] = useState<number[]>([])
    const [projectName, setProjectName] = useState('')
    // confirmation dialog state
    const [confirmOpen, setConfirmOpen] = useState(false)

    // state for correct loading of the page
    const [loading, setLoading] = useState(true)

    // handle confirmation dialog
    const confirmSave = () => {
        if (newGroups[0].groep_id === undefined) {
            // delete the old groups and replace them with the new groups
            instance
                .get('/groepen/?project=' + assignmentId)
                .then((response) => {
                    for (const group of response.data) {
                        instance
                            .delete('/groepen/' + group.groep_id + '/')
                            .catch((error) => {
                                console.log(error)
                            })
                    }
                })

            for (const group of newGroups) {
                if (group.studenten.length !== 0) {
                    instance
                        .post('/groepen', {
                            studenten: group.studenten,
                            vak: courseId,
                        })
                        .then((response) => {
                            console.log(response)
                        })
                }
            }
        } else {
            // update the old groups with the new groups
            for (const group of newGroups) {
                if (group.studenten.length !== 0) {
                    instance
                        .put('/groepen/' + group.groep_id + '/', {
                            groep_id: group.groep_id,
                            studenten: group.studenten,
                            vak: courseId,
                        })
                        .then((response) => {
                            console.log(response)
                        })
                }
            }
        }
        navigate('/course/' + courseId + '/assignment/' + assignmentId)
    }

    // close the confirmation dialog
    const handleCloseConfirm = () => {
        setConfirmOpen(false)
    }

    // handle submission when the user clicks save
    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setConfirmOpen(true)
    }

    // Close the dialog
    const handleCancel = () => {
        navigate('/course/' + courseId + '/assignment/' + assignmentId)
    }

    // Change max group size
    const handleGroupSizeChange = (newValue: number) => {
        setNewGroupSize(newValue)
        setAvailableStudents(() => Array.from(studentNames.keys()))
        setCurrentGroup('0')
        setNewGroups(() => {
            const newGroups = []
            console.log(
                'new amount of groups' +
                    Math.ceil(availableStudents.length / newValue)
            )
            for (
                let i = 0;
                i < Math.ceil(availableStudents.length / newValue);
                i++
            ) {
                console.log('new group' + i)
                newGroups.push({
                    studenten: [],
                    project: parseInt(assignmentId),
                })
            }
            return newGroups
        })
        async function fetchCourse() {
            setLoading(true)
            instance
                .get('/vakken/' + courseId)
                .then((response) => {
                    setAvailableStudents(response.data.studenten)
                })
                .catch((error) => {
                    console.error(error)
                })
            setLoading(false)
        }
        fetchCourse().catch((error) => {
            console.error(error)
        })
    }

    //get the current groups and group size from the backend
    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            // Get the student names
            await instance
                .get('/vakken/' + courseId)
                .then(async (response) => {
                    const newStudentNames = new Map<number, string>()

                    for (const student of response.data.studenten) {
                        await instance
                            .get('/gebruikers/' + student)
                            .then((response) => {
                                newStudentNames.set(
                                    student,
                                    response.data.first_name +
                                        ' ' +
                                        response.data.last_name
                                )
                                console.log(
                                    'available names:' +
                                        Array.from(newStudentNames.entries())
                                )
                            })
                    }

                    setStudentNames(() => newStudentNames)
                })
                .catch((error) => {
                    console.log('error fetching students')
                    console.error(error)
                })

            // Get the max group size and project name
            await instance
                .get('/projecten/' + assignmentId)
                .then((response) => {
                    setProjectName(response.data.titel)
                    setNewGroupSize(response.data.max_groep_grootte)
                })
                .catch((error) => {
                    console.log('error fetching project')
                    console.error(error)
                })

            // Get the existing groups
            await instance
                .get<Group[]>(`/groepen/?project=${assignmentId}`)
                .then((response) => {
                    const newgroups: Group[] = response.data
                    if (
                        newgroups.length <
                        Math.ceil(studentNames.size / newGroupSize)
                    ) {
                        for (
                            let i = newgroups.length;
                            i < Math.ceil(studentNames.size / newGroupSize);
                            i++
                        ) {
                            newgroups.push({
                                studenten: [],
                                project: parseInt(assignmentId),
                            })
                        }
                    }
                    setNewGroups(newgroups)
                })
                .catch((error) => {
                    console.log('error fetching groups')
                    console.error(error)
                })

            setLoading(false)
        }

        fetchData().catch((error) => {
            console.error(error)
        })
    }, [assignmentId, courseId, newGroupSize, studentNames.size])

    useEffect(() => {
        setAvailableStudents(() =>
            Array.from(studentNames.keys()).filter(
                (student) =>
                    !newGroups.some((group) =>
                        group.studenten.includes(student)
                    )
            )
        )
    }, [newGroups, studentNames])

    // Create new groups when the group size changes
    useEffect(() => {
        if (newGroups.length === 0) {
            setAvailableStudents(() => Array.from(studentNames.keys()))
            setCurrentGroup('0')
            setNewGroups(() => {
                const newGroups = []
                for (
                    let i = 0;
                    i < Math.ceil(availableStudents.length / newGroupSize);
                    i++
                ) {
                    newGroups.push({
                        studenten: [],
                        project: parseInt(assignmentId),
                    })
                }
                return newGroups
            })
        }
    }, [
        assignmentId,
        availableStudents.length,
        newGroupSize,
        newGroups.length,
        studentNames,
    ])

    //Handle current group change
    const handleCurrentGroupChange = (event: SelectChangeEvent) => {
        setCurrentGroup(event.target.value as string)
    }

    // Randomise groups
    const randomGroups = () => {
        const students = Array.from(studentNames.keys())
        const newGroups: Group[] = []
        for (let i = 0; i < Math.ceil(students.length / newGroupSize); i++) {
            newGroups.push({
                studenten: [],
                project: parseInt(assignmentId),
            })
        }
        for (let i = 0; i < students.length; i++) {
            let randomGroup = Math.floor(Math.random() * newGroups.length)
            while (newGroups[randomGroup].studenten.length >= newGroupSize) {
                randomGroup = Math.floor(Math.random() * newGroups.length)
            }
            newGroups[randomGroup].studenten.push(students[i])
        }

        setNewGroups(newGroups)
    }

    // assign a student to a group
    const assignStudent = (studentId: number, groupId: number) => {
        // First, create a new copy of the availableStudents array without the studentId
        const updatedAvailableStudents = availableStudents.filter(
            (student) => student !== studentId
        )
        setAvailableStudents(updatedAvailableStudents)
        console.log('group id: ' + groupId)
        // Then, create a new copy of the newGroups array with the updated group
        const updatedNewGroups = newGroups.map((group, index) => {
            if (index === groupId) {
                // Create a new copy of the group with the updated studenten array
                console.log('group.studenten: ' + group.studenten)
                return {
                    ...group,
                    studenten: [...group.studenten, studentId],
                }
            }
            return group
        })

        // Finally, update the state with the new copy
        setNewGroups(updatedNewGroups)
    }

    // remove a student from a group
    const removeStudent = (studentId: number, groupId: number) => {
        // First, create a new copy of the availableStudents array with the studentId
        const updatedAvailableStudents = [...availableStudents, studentId]
        setAvailableStudents(updatedAvailableStudents)

        // Then, create a new copy of the newGroups array with the updated group
        const updatedNewGroups = newGroups.map((group, index) => {
            if (index === groupId) {
                // Create a new copy of the group with the updated studenten array
                return {
                    ...group,
                    studenten: group.studenten.filter(
                        (student) => student !== studentId
                    ),
                }
            }
            return group
        })

        // Finally, update the state with the new copy
        setNewGroups(updatedNewGroups)
    }

    return (
        <>
            <Box
                component={'form'}
                onSubmit={handleSave}
                sx={{
                    backgroundColor: 'background.default',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}
            >
                <Header
                    variant={'default'}
                    title={loading ? '' : `${projectName}: ${t('groups')}`}
                ></Header>
                <Stack
                    marginTop={12}
                    direction={'column'}
                    spacing={4}
                    sx={{
                        width: '100%',
                        height: '70 %',
                        backgroundColor: 'background.default',
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                gap: 5,
                                padding: '20px',
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold' }}
                                color="text.primary"
                            >
                                {t('groups')}
                            </Typography>
                            <Stack direction={'row'}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Typography
                                            color="text.primary"
                                            fontWeight={'bold'}
                                        >
                                            {t('amount')} {t('members')}/
                                            {t('group')}
                                        </Typography>
                                    </Grid>
                                    <Grid item minWidth={3}>
                                        {loading ? (
                                            <Skeleton
                                                variant={'text'}
                                                width={80}
                                                height={80}
                                            />
                                        ) : (
                                            <TextField
                                                aria-label={'maxGroupSize'}
                                                value={newGroupSize}
                                                type={'number'}
                                                onChange={(newValue) => {
                                                    if (
                                                        parseInt(
                                                            newValue.target
                                                                .value
                                                        ) < 1
                                                    )
                                                        return
                                                    handleGroupSizeChange(
                                                        parseInt(
                                                            newValue.target
                                                                .value
                                                        )
                                                    )
                                                }}
                                                variant="outlined"
                                                sx={{ width: 80 }}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={10}
                                marginY={6}
                            >
                                {loading ? (
                                    <Skeleton
                                        variant={'rectangular'}
                                        width={220}
                                        height={45}
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            borderRadius: 1,
                                        }}
                                    />
                                ) : (
                                    <Button
                                        variant={'contained'}
                                        disableElevation
                                        sx={{
                                            backgroundColor: 'secondary.main',
                                            padding: 1,
                                        }}
                                        onClick={randomGroups}
                                    >
                                        <Typography
                                            color="text.primary"
                                            fontWeight={'bold'}
                                        >
                                            {t('random')} {t('groups')}
                                        </Typography>
                                    </Button>
                                )}
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                >
                                    <Typography
                                        color="text.primary"
                                        fontWeight={'bold'}
                                    >
                                        {t('students_choose')}
                                    </Typography>
                                    {loading ? (
                                        <Skeleton
                                            variant={'rectangular'}
                                            width={40}
                                            height={30}
                                            sx={{
                                                backgroundColor:
                                                    'secondary.main',
                                                borderRadius: 1,
                                            }}
                                        />
                                    ) : (
                                        <Switch />
                                    )}
                                </Box>
                            </Stack>
                        </Box>

                        <Box
                            sx={{
                                marginTop: -3,
                                padding: '20px',
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Box
                                aria-label={'group_assigner'}
                                display={'flex'}
                                flexDirection={'row'}
                                maxWidth={600}
                                justifyContent={'space-between'}
                                gap={6}
                                pl={3}
                                pr={3}
                                alignItems={'flex-start'}
                            >
                                <TableContainer sx={{ maxHeight: '55vh' }}>
                                    <Table
                                        aria-label={'studentTable'}
                                        stickyHeader
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography
                                                        fontWeight={'bold'}
                                                    >
                                                        {t('studenten')}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                [...Array(3)].map(
                                                    (_, index) => (
                                                        <Skeleton
                                                            key={index}
                                                            variant="text"
                                                            width={'100%'}
                                                            height={50}
                                                            sx={{ margin: 0 }}
                                                        />
                                                    )
                                                )
                                            ) : (
                                                <>
                                                    {availableStudents.map(
                                                        (student) => (
                                                            <TableRow
                                                                key={student}
                                                            >
                                                                <TableCell
                                                                    sx={{
                                                                        height: 20,
                                                                        display:
                                                                            'flex',
                                                                        flexDirection:
                                                                            'row',
                                                                        justifyContent:
                                                                            'space-between',
                                                                        alignItems:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    {studentNames.get(
                                                                        student
                                                                    ) === ''
                                                                        ? student
                                                                        : studentNames.get(
                                                                              student
                                                                          )}
                                                                    <IconButton
                                                                        disabled={
                                                                            newGroups[
                                                                                parseInt(
                                                                                    currentGroup
                                                                                )
                                                                            ]
                                                                                ? newGroups[
                                                                                      parseInt(
                                                                                          currentGroup
                                                                                      )
                                                                                  ]
                                                                                      .studenten
                                                                                      .length >=
                                                                                  newGroupSize
                                                                                : true
                                                                        }
                                                                        onClick={() => {
                                                                            assignStudent(
                                                                                student,
                                                                                parseInt(
                                                                                    currentGroup
                                                                                )
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Add />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TableContainer sx={{ maxHeight: '55vh' }}>
                                    <Table
                                        aria-label={'groupTable'}
                                        stickyHeader
                                        sx={{ maxHeight: '5    0svh' }}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography
                                                        fontWeight={'bold'}
                                                    >
                                                        {t('group')}
                                                    </Typography>
                                                    {loading ? (
                                                        <Skeleton
                                                            variant="text"
                                                            width={'80%'}
                                                            height={70}
                                                            sx={{ margin: 0 }}
                                                        />
                                                    ) : (
                                                        <>
                                                            <Select
                                                                aria-label={
                                                                    'groupSelect'
                                                                }
                                                                value={
                                                                    currentGroup
                                                                }
                                                                sx={{
                                                                    width: 200,
                                                                }}
                                                                onChange={
                                                                    handleCurrentGroupChange
                                                                }
                                                                label={t(
                                                                    'group'
                                                                )}
                                                            >
                                                                {newGroups.map(
                                                                    (
                                                                        _,
                                                                        index
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={index.toString()}
                                                                            value={index.toString()}
                                                                        >
                                                                            {t(
                                                                                'group'
                                                                            ) +
                                                                                (index +
                                                                                    1)}
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                [...Array(3)].map(
                                                    (_, index) => (
                                                        <Skeleton
                                                            key={index}
                                                            variant="text"
                                                            width={'100%'}
                                                            height={50}
                                                            sx={{ margin: 0 }}
                                                        />
                                                    )
                                                )
                                            ) : (
                                                <>
                                                    {newGroups[
                                                        parseInt(currentGroup)
                                                    ] &&
                                                        newGroups[
                                                            parseInt(
                                                                currentGroup
                                                            )
                                                        ].studenten.map(
                                                            (student) => (
                                                                <TableRow
                                                                    key={
                                                                        student
                                                                    }
                                                                >
                                                                    <TableCell
                                                                        sx={{
                                                                            height: 20,
                                                                            display:
                                                                                'flex',
                                                                            flexDirection:
                                                                                'row',
                                                                            justifyContent:
                                                                                'space-between',
                                                                            alignItems:
                                                                                'center',
                                                                        }}
                                                                    >
                                                                        {studentNames.get(
                                                                            student
                                                                        )}
                                                                        <IconButton
                                                                            onClick={() => {
                                                                                removeStudent(
                                                                                    student,
                                                                                    parseInt(
                                                                                        currentGroup
                                                                                    )
                                                                                )
                                                                            }}
                                                                        >
                                                                            <CancelIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
                <Box
                    aria-label={'save/cancel'}
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        width: '100%',
                        alignItems: 'flex-end',
                        gap: 5,
                        paddingRight: 10,
                    }}
                >
                    <DialogActions>
                        <Box pr={5} pb={5} display={'flex'} gap={1}>
                            <Tooltip title={t('cancel')}>
                                <IconButton
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
                                {loading ? (
                                    <Skeleton
                                        variant={'rectangular'}
                                        width={40}
                                        height={40}
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            borderRadius: 2,
                                        }}
                                    />
                                ) : (
                                    <>
                                        <IconButton
                                            type="submit"
                                            aria-label={'submit'}
                                            sx={{
                                                backgroundColor: 'primary.main',
                                                borderRadius: 2,
                                                color: 'background.default',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'secondary.main',
                                                    color: 'text.primary',
                                                },
                                            }}
                                        >
                                            <SaveIcon fontSize={'medium'} />
                                        </IconButton>
                                    </>
                                )}
                            </Tooltip>
                        </Box>
                    </DialogActions>
                </Box>
            </Box>
            {/* Warning popup for when the user wants to confirm the group changes */}
            <WarningPopup
                title={t('change_groups')}
                content={t('cant_be_undone')}
                buttonName={t('confirm')}
                open={confirmOpen}
                handleClose={handleCloseConfirm}
                doAction={confirmSave}
            />
        </>
    )
}
