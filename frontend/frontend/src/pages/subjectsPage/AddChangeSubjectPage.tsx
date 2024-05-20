import {
    Button,
    Card,
    Divider,
    EvenlySpacedRow,
    SecondaryButton,
} from '../../components/CustomComponents.tsx'

import {
    Box,
    CircularProgress,
    IconButton,
    ListItem,
    ListItemText,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { Header } from '../../components/Header'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import List from '@mui/material/List'
import { t } from 'i18next'
import 'dayjs/locale/nl'
import FileUploadButton from '../../components/FileUploadButton'
import ClearIcon from '@mui/icons-material/Clear'
import Dialog from '@mui/material/Dialog'
import instance from '../../axiosConfig.ts'
import Papa, { ParseResult } from 'papaparse'

export interface User {
    user: number
    is_lesgever: boolean
    first_name: string
    last_name: string
    email: string
}

// This function takes a list of users and will render it.
// It can be used for both the teachers and the students.
function UserList(
    loading: boolean,
    users: User[],
    setSelected: React.Dispatch<React.SetStateAction<number>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
    return (
        <Box marginTop={3}>
            <List
                disablePadding={true}
                sx={{
                    minHeight: '30vh',
                    maxHeight: '30vh',
                    overflowY: 'auto',
                }}
            >
                {loading ? (
                    [...Array(5)].map((_, index) => (
                        <ListItem key={index} sx={{ padding: 0, margin: 0 }}>
                            <Skeleton
                                variant={'text'}
                                width={'100%'}
                                height={60}
                            />
                        </ListItem>
                    ))
                ) : (
                    <>
                        {users.map((user) => {
                            const handleClickOpen = () => {
                                setSelected(user.user)
                                setOpen(true)
                            }
                            {
                                /* The list of users is mapped onto buttons
                    This makes it possible to click through on a person. */
                            }
                            return (
                                <>
                                    <Divider />
                                    <ListItem>
                                        <EvenlySpacedRow
                                            items={[
                                                <ListItemText
                                                    primary={
                                                        user.first_name +
                                                        ' ' +
                                                        user.last_name
                                                    }
                                                />,
                                                <Box
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    gap={1}
                                                    alignItems={'center'}
                                                >
                                                    <ListItemText
                                                        sx={{
                                                            textOverflow:
                                                                'ellipsis',
                                                        }}
                                                        primary={user.email}
                                                    />
                                                    <IconButton
                                                        disabled={
                                                            users.length == 1 &&
                                                            users[0].is_lesgever
                                                        }
                                                        aria-label={
                                                            'delete_file'
                                                        }
                                                        size={'small'}
                                                        onClick={
                                                            handleClickOpen
                                                        }
                                                        sx={{
                                                            '&:disabled': {
                                                                color: 'text.primary',
                                                            },
                                                            color: 'error.main',
                                                        }}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Box>,
                                            ]}
                                        />
                                    </ListItem>
                                </>
                            )
                        })}
                    </>
                )}
            </List>
        </Box>
    )
}

// This function will render the UI for adding extra students or teachers.
// It can either be done by uploading a file or by typing in the email.
function UploadPart(
    file: File | undefined,
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    handleAdd: () => void,
    str: string,
    textFieldRef: React.RefObject<HTMLInputElement>
) {
    return (
        <>
            <Box display={'flex'} flexDirection={'column'} padding={'10px'}>
                <Stack direction={'column'} spacing={2}>
                    <Stack direction={'row'} spacing={2} alignItems="center">
                        <Box>
                            {/* This box allows you to add extra people by their email. */}
                            <TextField
                                type="text"
                                placeholder={t('email')}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                inputRef={textFieldRef}
                            />
                        </Box>
                        <Box>
                            <SecondaryButton size={'small'} onClick={handleAdd}>
                                {t('add')}
                            </SecondaryButton>
                        </Box>
                    </Stack>
                    <FileUploadButton
                        name={str}
                        fileTypes={['.csv']}
                        tooltip={t('uploadToolTip')}
                        onFileChange={handleFileChange}
                        path={file != null ? file : undefined}
                    />
                </Stack>
            </Box>
        </>
    )
}

// When you try to delete someone from the list, a pop-up will appear.
// This pop-up will ask you if you are sure you want to delete the person.
// This function will render the pop-up.
function DialogWindow(
    handleClose: () => void,
    open: boolean,
    handleRemove: () => void,
    str: string
) {
    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <Box padding={2} alignItems={'center'} gap={1}>
                    <Typography> {str + '?'} </Typography>
                    <Box display={'flex'} flexDirection={'row'}>
                        <SecondaryButton size={'small'} onClick={handleClose}>
                            {t('cancel')}
                        </SecondaryButton>
                        <Box padding={'7px'} />
                        <Button size={'small'} onClick={handleRemove}>
                            {t('delete')}
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}

export function AddChangeSubjectPage() {
    const params = useParams()
    const navigate = useNavigate()

    // State for the different fields of the subject
    const [title, setTitle] = useState<string>('')
    const [emailStudent, setEmailStudent] = useState<string>('')
    const [emailTeacher, setEmailTeacher] = useState<string>('')
    const [students, setStudents] = useState<User[]>([])
    const [teachers, setTeachers] = useState<User[]>([])
    const [selectedStudent, setSelectedStudent] = useState<number>(0)
    const [openStudent, setOpenStudent] = useState<boolean>(false)
    const [selectedTeacher, setSelectedTeacher] = useState<number>(0)
    const [openTeacher, setOpenTeacher] = useState<boolean>(false)
    const [studentFile, setStudentFile] = useState<File>()
    const [teacherFile, setTeacherFile] = useState<File>()
    const [user, setUser] = useState<User>()
    const studentRef = useRef<HTMLInputElement>(null)
    const teacherRef = useRef<HTMLInputElement>(null)

    const [vakID, setVakID] = useState(params.courseId)

    // state for spinners
    const [loading, setLoading] = useState(false)
    const [userLoading, setUserLoading] = useState(true)

    const handleCloseStudent = (): void => {
        setOpenStudent(false)
    }

    const handleRemoveStudent = (): void => {
        setStudents((oldstudents: User[]): User[] => {
            for (let i = 0; i < oldstudents.length; i++) {
                if (oldstudents[i].user == selectedStudent) {
                    oldstudents.splice(i, 1)
                    return oldstudents
                }
            }
            return oldstudents
        })
        setOpenStudent(false)
    }

    const handleAddStudent = (): void => {
        instance
            .get('gebruikers/?email=' + emailStudent)
            .then((res) => {
                setStudents((oldstudents) => {
                    if (res.data.length == 0) {
                        alert(t('this_user_doesnt_exist'))
                        return oldstudents
                    }
                    return addUser(false, res.data[0], oldstudents)
                })
            })
            .catch((err) => {
                console.log(err)
            })

        handleUploadStudent()

        if (studentRef.current) {
            studentRef.current.value = '';
            setEmailStudent('')
        }
    }

    const handleStudentFileChange = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        if (e.target.files == null) {
            setStudentFile(undefined)
        } else if (e.target.files.length) {
            const inputFile = e.target.files[0]
            setStudentFile(inputFile)
        } else {
            //this clears selected file
            setStudentFile(undefined)
        }
    }

    const handleUploadStudent = (): void => {
        const reader = new FileReader()

        reader.onload = async ({ target }) => {
            if (target == null) {
                return
            }
            if (typeof target.result != 'string') {
                return
            }
            const csv: ParseResult<User> = Papa.parse(target.result, {
                header: true,
            })
            // This will loop through the csv file and add the students to the list.
            for (let i = 0; i < csv.data.length; i++) {
                if (csv.data[i].email != '') {
                    instance
                        .get('gebruikers/?email=' + csv.data[i].email)
                        .then((res) => {
                            setStudents((oldstudents) => {
                                if (res.data.length == 0) {
                                    return oldstudents
                                }

                                return addUser(false, res.data[0], oldstudents)
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        }
        if (studentFile != undefined) {
            reader.readAsText(studentFile)
        }
    }

    const handleCloseTeacher = (): void => {
        setOpenTeacher(false)
    }

    // This function will remove a teacher from the list.
    // It does so by looping through the list and removing the teacher with the correct ID.
    const handleRemoveTeacher = () => {
        setTeachers((oldteacher) => {
            for (let i = 0; i < oldteacher.length; i++) {
                if (oldteacher[i].user == selectedTeacher) {
                    oldteacher.splice(i, 1)
                    return oldteacher
                }
            }
            return oldteacher
        })
        setOpenTeacher(false)
    }

    const handleAddTeacher = (): void => {
        instance
            .get('gebruikers/?email=' + emailTeacher)
            .then((res) => {
                setTeachers((oldteachers) => {
                    //This is like this to prevent the same user being in the list twice

                    if (res.data.length == 0) {
                        alert(t('this_user_doesnt_exist'))
                        return oldteachers
                    }

                    return addUser(true, res.data[0], oldteachers)
                })
            })
            .catch((err) => {
                console.log(err)
            })
        handleUploadTeacher()

        if (teacherRef.current) {
            teacherRef.current.value = '';
            setEmailTeacher('')
        }
    }

    const handleTeacherFileChange = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        if (e.target.files == null) {
            setTeacherFile(undefined)
        } else if (e.target.files.length) {
            const inputFile = e.target.files[0]
            setTeacherFile(inputFile)
        } else {
            //this clears selected file
            setTeacherFile(undefined)
        }
    }

    // This function will upload a file with teachers.
    const handleUploadTeacher = (): void => {
        const reader = new FileReader()

        reader.onload = async ({ target }) => {
            if (target == null) {
                return
            }
            if (typeof target.result != 'string') {
                return
            }
            const csv: ParseResult<User> = Papa.parse(target.result, {
                header: true,
            })
            for (let i = 0; i < csv.data.length; i++) {
                // This will loop through the csv file and add the teachers to the list.
                if (csv.data[i].email != '') {
                    instance
                        .get('gebruikers/?email=' + csv.data[i].email)
                        .then((res) => {
                            setTeachers((oldteachers) => {
                                if (res.data.length == 0) {
                                    return oldteachers
                                }

                                return addUser(true, res.data[0], oldteachers)
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        }
        if (teacherFile != undefined) {
            reader.readAsText(teacherFile)
        }
    }

    const addUser = (
        isLesgever: boolean,
        userData: User,
        olduser: User[]
    ): User[] => {
        //This is like this to prevent the same user being in the list twice
        let found = false
        const id = userData.user
        if (userData.is_lesgever != isLesgever) {
            if (userData.is_lesgever){
                alert(t('cant_add_teachers_to_student_list'))
            } else {
                alert(t('cant_add_students_to_teacher_list'))
            }
            return olduser
        }
        for (const teacher of olduser) {
            if (teacher.user == id) {
                found = true
            }
        }
        if (found) {
            alert(t('cant_add_users_twice'))
            return olduser
        } else {
            return [...olduser, userData]
        }
    }

    const handleSave = (): void => {
        const studentIDs = students.map((student) => student.user)
        const teacherIDs = teachers.map((teacher) => teacher.user)
        if (vakID == undefined) {
            instance
                .post('vakken/', {
                    naam: title,
                    studenten: studentIDs,
                    lesgevers: teacherIDs,
                })
                .then((res) => {
                    setVakID(res.data.vak_id)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            instance
                .put('vakken/' + vakID + '/', {
                    naam: title,
                    studenten: studentIDs,
                    lesgevers: teacherIDs,
                })
                .catch((err) => {
                    console.log(err)
                    alert(err.response.data)
                })
        }
    }

    useEffect(() => {
        async function fetchUser() {
            setUserLoading(true)
            const userResponse = await instance.get('/gebruikers/me/')
            setUser(userResponse.data)
            setUserLoading(false)
        }
        async function fetchData() {
            setLoading(true)
            await instance
                .get('vakken/' + vakID)
                .then(async (res) => {
                    setTitle(res.data.naam)
                    for (const id of res.data.studenten) {
                        await instance
                            .get('gebruikers/' + id)
                            .then((res) => {
                                setStudents((oldstudents) => {
                                    //This is like this to prevent the same user being in the list twice
                                    let found = false
                                    const id = res.data.user
                                    for (const student of oldstudents) {
                                        if (student.user == id) {
                                            found = true
                                        }
                                    }
                                    if (found) {
                                        return oldstudents
                                    } else {
                                        return [...oldstudents, res.data]
                                    }
                                })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                    for (const id of res.data.lesgevers) {
                        await instance
                            .get('gebruikers/' + id)
                            .then((res) => {
                                setTeachers((oldteachers) => {
                                    //This is like this to prevent the same user being in the list twice
                                    let found = false
                                    const id = res.data.user
                                    for (const teacher of oldteachers) {
                                        if (teacher.user == id) {
                                            found = true
                                        }
                                    }
                                    if (found) {
                                        return oldteachers
                                    } else {
                                        return [...oldteachers, res.data]
                                    }
                                })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            setLoading(false)
        }
        fetchUser().catch((err) => {
            console.log(err)
        })
        if (vakID != undefined) {
            fetchData().catch((err) => {
                console.log(err)
            })
        }
    }, [vakID])

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
                    <CircularProgress color={'primary'} />
                    <Box></Box>
                </Box>
            ) : (
                <>
                    {user?.is_lesgever ? (
                        // Rendering UI for teacher
                        <>
                            <Stack direction={'column'}>
                                <Header
                                    variant={'default'}
                                    title={loading ? '' : title}
                                />
                                <Stack
                                    direction={'column'}
                                    spacing={5}
                                    marginTop={11}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: 'background.default',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor:
                                                'background.default',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}
                                    >
                                        <Box
                                            // This box contains the title of the subject.
                                            // This title can be changed if necessary.
                                            aria-label={'title'}
                                            display={'flex'}
                                            flexDirection={'row'}
                                            gap={2}
                                            alignItems={'center'}
                                        >
                                            <Typography
                                                variant={'h5'}
                                                color={'text.primary'}
                                                fontWeight={'bold'}
                                            >
                                                {t('subject_name') + ':'}
                                            </Typography>
                                            {loading ? (
                                                <Skeleton
                                                    variant={'text'}
                                                    width={200}
                                                    height={60}
                                                />
                                            ) : (
                                                <TextField
                                                    type="text"
                                                    value={title}
                                                    placeholder={t('name')}
                                                    onChange={(event) =>
                                                        setTitle(
                                                            event.target.value
                                                        )
                                                    }
                                                    sx={{ height: 60 }}
                                                />
                                            )}
                                        </Box>
                                        <Box
                                            padding={'20px'}
                                            display={'flex'}
                                            flexDirection={'row'}
                                            gap={2}
                                        >
                                            <SecondaryButton
                                                /* This is the large save button on the top of the page */
                                                onClick={() =>
                                                    navigate(`/course/${vakID}`)
                                                }
                                            >
                                                {t('cancel')}
                                            </SecondaryButton>

                                            <Button
                                                /* This is the large save button on the top of the page */
                                                onClick={handleSave}
                                            >
                                                {t('save')}
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Stack direction={'row'} gap={10}>
                                        <Box width={'50%'}>
                                            <Stack direction={'column'}>
                                                <Card>
                                                    <Box
                                                        bgcolor={
                                                            'primary.light'
                                                        }
                                                        padding={'20px'}
                                                    >
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {t('students')}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            marginTop: -3.1,
                                                        }}
                                                    >
                                                        {UserList(
                                                            loading,
                                                            students,
                                                            setSelectedStudent,
                                                            setOpenStudent
                                                        )}
                                                    </Box>
                                                </Card>
                                                <Box marginTop={2}>
                                                    {UploadPart(
                                                        studentFile,
                                                        handleStudentFileChange,
                                                        setEmailStudent,
                                                        handleAddStudent,
                                                        t('upload_students'),
                                                        studentRef,
                                                    )}
                                                </Box>
                                                {DialogWindow(
                                                    handleCloseStudent,
                                                    openStudent,
                                                    handleRemoveStudent,
                                                    t('delete_student'),
                                                )}
                                            </Stack>
                                        </Box>
                                        <Box width={'50%'}>
                                            <Stack direction={'column'}>
                                                <Card>
                                                    <Box
                                                        bgcolor={
                                                            'primary.light'
                                                        }
                                                        padding={'20px'}
                                                    >
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {t('teachers')}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            marginTop: -3.1,
                                                        }}
                                                    >
                                                        {UserList(
                                                            loading,
                                                            teachers,
                                                            setSelectedTeacher,
                                                            setOpenTeacher
                                                        )}
                                                    </Box>
                                                </Card>
                                                <Box marginTop={1}>
                                                    {UploadPart(
                                                        teacherFile,
                                                        handleTeacherFileChange,
                                                        setEmailTeacher,
                                                        handleAddTeacher,
                                                        t('upload_teachers'),
                                                        teacherRef,
                                                    )}
                                                </Box>
                                                {DialogWindow(
                                                    handleCloseTeacher,
                                                    openTeacher,
                                                    handleRemoveTeacher,
                                                    t('delete_teacher')
                                                )}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Stack>
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
