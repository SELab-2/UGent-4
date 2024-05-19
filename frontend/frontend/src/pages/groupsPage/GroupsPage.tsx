import { Header } from '../../components/Header.tsx'
import { Button, Card } from '../../components/CustomComponents.tsx'
import {
    Autocomplete,
    Box,
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
    const confirmSave = async () => {
        if (newGroups[0].groep_id === undefined) {
            // delete the old groups and replace them with the new groups
            await instance
                .get('/groepen/?project=' + assignmentId)
                .then(async (response) => {
                    for (const group of response.data) {
                        await instance
                            .delete('/groepen/' + group.groep_id + '/')
                            .catch((error) => {
                                console.log(error)
                            })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })

            for (const group of newGroups) {
                if (group.studenten.length !== 0) {
                    instance
                        .post('/groepen', {
                            studenten: group.studenten,
                            project: parseInt(assignmentId),
                        })
                        .catch((error) => {
                            console.log(error)
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
                            project: parseInt(assignmentId),
                        })
                        .catch((error) => {
                            console.log(error)
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
        setFilteredStudents(availableStudents)
        setCurrentGroup('0')
        setNewGroups(() => {
            const newGroups = []
            for (
                let i = 0;
                i < Math.ceil(availableStudents.length / newValue);
                i++
            ) {
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
                    setFilteredStudents(availableStudents)
                })
                .catch((error) => {
                    console.error(error)
                })
            setLoading(false)
        }
        fetchCourse()
            .catch((error) => {
                console.error(error)
            })
            .catch((error) => {
                console.log(error)
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
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    }
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
                    console.log(error)
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

        fetchData()
            .catch((error) => {
                console.error(error)
            })
            .catch((error) => {
                console.log(error)
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
        setFilteredStudents(availableStudents)
    }, [newGroups, studentNames])

    // Create new groups when the group size changes
    useEffect(() => {
        if (newGroups.length === 0) {
            setAvailableStudents(() => Array.from(studentNames.keys()))
            setFilteredStudents(availableStudents)
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
        setFilteredStudents(availableStudents)
        // Then, create a new copy of the newGroups array with the updated group
        const updatedNewGroups = newGroups.map((group, index) => {
            if (index === groupId) {
                // Create a new copy of the group with the updated studenten array
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

    const [filteredStudents, setFilteredStudents] = useState(availableStudents)

    // for filtering students
    const handleAutocompleteChange = (_: unknown, value: number | null) => {
        if (value) {
            setFilteredStudents([value])
        }
    }

    const resetAutocompleteChange = () => {
        setFilteredStudents(availableStudents)
    }

    const filterOptions = (
        _: unknown,
        { inputValue }: { inputValue: string }
    ) => {
        return availableStudents.filter((option) => {
            const label = studentNames.get(option)
            return label?.toLowerCase().startsWith(inputValue.toLowerCase())
        })
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
                                variant="h5"
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
                                                // The teacher can specify the maximum group size
                                                // If a number smaller than 1 is entered, the input will be ignored
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
                                        // If a teacher doesn't want to create groups manually,
                                        // they can randomize the groups with a single click.variant={'contained'}
                                        onClick={randomGroups}
                                    >
                                        {t('random')} {t('groups')}
                                    </Button>
                                )}
                                <Box
                                    // If the students are allowed to choose their own groups,
                                    // the teacher can enable this feature with a switch.
                                    display={'flex'}
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    gap={2}
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
                                justifyContent={'flex-start'} // Change to flex-start
                                alignItems={'flex-start'}
                                sx={{
                                    '& > *:not(:last-child)': {
                                        marginRight: '40px', // Add right margin of 20 pixels
                                    },
                                }}
                            >
                                <Card>
                                    <Box
                                        bgcolor={'primary.light'}
                                        padding={'17px'}
                                    >
                                        <Stack direction={'row'}>
                                            <Grid
                                                container
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <Grid item>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {t('group')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    {loading ? (
                                                        <Skeleton
                                                            variant={'text'}
                                                            width={80}
                                                            height={80}
                                                        />
                                                    ) : (
                                                        <Select
                                                            aria-label={
                                                                'groupSelect'
                                                            }
                                                            value={currentGroup}
                                                            sx={{ width: 120 }}
                                                            onChange={
                                                                handleCurrentGroupChange
                                                            }
                                                            label={t('group')}
                                                        >
                                                            {newGroups.map(
                                                                (_, index) => (
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
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Box>
                                    <TableContainer sx={{ maxHeight: '55vh' }}>
                                        <Table
                                            // The teacher can see the students in the specified group
                                            // on the right side of the screen.
                                            aria-label={'groupTable'}
                                            stickyHeader
                                            sx={{ maxHeight: '5    0svh' }}
                                        >
                                            <TableBody>
                                                {loading ? (
                                                    [...Array(3)].map(
                                                        (_, index) => (
                                                            <Skeleton
                                                                key={index}
                                                                variant="text"
                                                                width={'100%'}
                                                                height={50}
                                                                sx={{
                                                                    margin: 0,
                                                                }}
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <>
                                                        {newGroups[
                                                            parseInt(
                                                                currentGroup
                                                            )
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
                                                                            <IconButton // The teacher can remove students from the group by clicking on the cross icon
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
                                </Card>
                                <Card>
                                    <Box
                                        bgcolor={'primary.light'}
                                        padding={'17px'}
                                    >
                                        <Stack direction={'row'}>
                                            <Grid container alignItems="center">
                                                <Grid>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {t('studenten')}
                                                    </Typography>
                                                </Grid>
                                                <Box paddingLeft={1}></Box>
                                                <Grid>
                                                    <Box
                                                        sx={{ width: '200px' }}
                                                    >
                                                        {loading ? (
                                                            <Skeleton
                                                                variant={'text'}
                                                                width={160}
                                                                height={80}
                                                            />
                                                        ) : (
                                                            <Autocomplete
                                                                options={
                                                                    availableStudents
                                                                }
                                                                getOptionLabel={(
                                                                    student
                                                                ) => {
                                                                    const name =
                                                                        studentNames.get(
                                                                            student
                                                                        )
                                                                    return name !=
                                                                        null
                                                                        ? name
                                                                        : '' // This checks for both null and undefined
                                                                }}
                                                                onChange={
                                                                    handleAutocompleteChange
                                                                }
                                                                filterOptions={
                                                                    filterOptions
                                                                }
                                                                renderInput={(
                                                                    student
                                                                ) => (
                                                                    <TextField
                                                                        {...student}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Box>
                                    <TableContainer sx={{ maxHeight: '55vh' }}>
                                        <Table
                                        // The teacher can see the available students
                                        // on the left side of the screen.
                                        // They are displayed in a table with a sticky header.aria-label={'studentTable'}
                                        >
                                            <TableBody>
                                                {loading ? (
                                                    [...Array(3)].map(
                                                        (_, index) => (
                                                            <Skeleton
                                                                key={index}
                                                                variant="text"
                                                                width={'100%'}
                                                                height={50}
                                                                sx={{
                                                                    margin: 0,
                                                                }}
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <>
                                                        <Stack
                                                            direction={'row'}
                                                        >
                                                            {chunkArray(
                                                                filteredStudents,
                                                                Math.ceil(
                                                                    Math.sqrt(
                                                                        filteredStudents.length
                                                                    )
                                                                )
                                                            ).map(
                                                                (students) => (
                                                                    <Box>
                                                                        {students.map(
                                                                            (
                                                                                student
                                                                            ) => (
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
                                                                                        ) ===
                                                                                        ''
                                                                                            ? student
                                                                                            : studentNames.get(
                                                                                                  student
                                                                                              )}
                                                                                        <IconButton // people can be added to groups by clicking on the plus icon
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
                                                                                                resetAutocompleteChange()
                                                                                            }}
                                                                                        >
                                                                                            <Add />
                                                                                        </IconButton>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        )}
                                                                    </Box>
                                                                )
                                                            )}
                                                        </Stack>
                                                    </>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
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
                                    // The teacher can cancel the group changes by clicking on the cross icon.
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
                                            // The teacher can save the group changes by clicking on the save icon.type="submit"
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

function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk: T[] = arr.slice(i, i + chunkSize)
        result.push(chunk)
    }
    return result
}
