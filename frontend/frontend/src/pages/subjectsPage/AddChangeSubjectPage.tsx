import {
    Box,
    Divider,
    IconButton,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import { Header } from '../../components/Header.tsx'
import React, { useEffect, useState, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import List from '@mui/material/List'
import { t } from 'i18next'
import 'dayjs/locale/nl'
import FileUploadButton from '../../components/FileUploadButton'
import ClearIcon from '@mui/icons-material/Clear'

import Dialog from '@mui/material/Dialog'

import instance from '../../axiosConfig.ts'

import ErrorPage from '../ErrorPage.tsx'

import Papa from 'papaparse'

export interface User {
    user: number
    is_lesgever: boolean
    first_name: string
    last_name: string
    email: string
}

export interface UserListDAO {
    data: User[]
}

export interface UserDAO {
    data: User
}

function UserList(users: User[], setSelected: React.Dispatch<React.SetStateAction<number>>, setOpen: React.Dispatch<React.SetStateAction<boolean>>) {
    return (
        <>
            <List
                disablePadding={true}
                sx={{
                    '& > :not(style)': {
                        marginBottom: '8px',
                        width: '75vw',
                    },
                }}
            >
                {users.map((user) => {
                    const handleClickOpen = () => {
                        setSelected(user.user)
                        setOpen(true)
                    }

                    return (
                        <>
                            <ListItemButton
                                sx={{
                                    width: '100%',
                                    height: 30,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingX: 1,
                                    paddingY: 3,
                                    borderRadius: 2,
                                }}
                            >
                                <ListItemText
                                    sx={{ maxWidth: 100 }}
                                    primary={user.first_name}
                                />
                                <ListItemText
                                    sx={{ maxWidth: 100 }}
                                    primary={user.last_name}
                                />
                                <ListItemText
                                    sx={{ maxWidth: 100 }}
                                    primary={user.email}
                                />
                                <IconButton
                                    aria-label={'delete_file'}
                                    size={'small'}
                                    onClick={handleClickOpen}
                                    sx={{ marginBottom: 1 }}
                                >
                                    <ClearIcon color={'error'} />
                                </IconButton>
                            </ListItemButton>
                            <Divider color={'text.main'}></Divider>
                        </>
                    )
                })}
            </List>
        </>
    )
}

function UploadPart(file: File | undefined, handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void, setEmail: React.Dispatch<React.SetStateAction<string>>, handleAdd: () => void) {
    return (
        <>
            <Box display={'flex'} flexDirection={'column'}>
                <FileUploadButton
                    name={t('upload_students')}
                    fileTypes={['.csv']}
                    tooltip={t('uploadToolTip')}
                    onFileChange={handleFileChange}
                    path={file != null ? file : undefined}
                />
                <Box display={'flex'} flexDirection={'row'}>
                    <TextField
                        type="text"
                        placeholder={t('studentnumber')}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        size={'small'}
                        disableElevation
                        onClick={handleAdd}
                    >
                        {t('add')}
                    </Button>
                </Box>
            </Box>
        </>
    )
}

function DialogWindow(handleClose: () => void, open:boolean, handleRemove: () => void, str:string) {
    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <Box padding={2} alignItems={'center'} gap={1}>
                    <Typography> {str + '?'} </Typography>
                    <Box display={'flex'} flexDirection={'row'}>
                        <Button
                            variant={'contained'}
                            color={'secondary'}
                            size={'small'}
                            disableElevation
                            onClick={handleClose}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            variant={'contained'}
                            color={'secondary'}
                            size={'small'}
                            disableElevation
                            onClick={handleRemove}
                        >
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
    // State for the different fields of the subject
    const [title, setTitle] = useState<string>('')
    const [emailStudent, setEmailStudent] = useState<string>('')
    const [emailTeacher, setEmailTeacher] = useState<string>('')
    const [students , setStudents] = useState<User[]>([])
    const [teachers, setTeachers] = useState<User[]>([])
    const [selectedStudent, setSelectedStudent] = useState<number>(0)
    const [openStudent, setOpenStudent] = useState<boolean>(false)
    const [selectedTeacher, setSelectedTeacher] = useState<number>(0)
    const [openTeacher, setOpenTeacher] = useState<boolean>(false)
    const [studentFile, setStudentFile] = useState<File>()
    const [teacherFile, setTeacherFile] = useState<File>()
    const [user, setUser] = useState<User>({
        user: 0,
        is_lesgever: false,
        first_name: '',
        last_name: '',
        email: '',
    })
    const [userLoaded, setUserLoaded] = useState<boolean>(false)
    const vakID = params.courseId

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
                        return oldstudents
                    }
                    return addUser(false, res.data[0], oldstudents)
                })
            })
            .catch((err) => {
                console.log(err)
            })

        handleUploadStudent()
    }

    const handleStudentFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        console.log("e")
        console.log(e)
        if (e.target.files==null){
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
            const csv : UserListDAO = Papa.parse(target.result, {
                header: true,
            })

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

        reader.readAsText(studentFile)
    }

    const handleCloseTeacher = (): void => {
        setOpenTeacher(false)
    }

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
                        return oldteachers
                    }

                    return addUser(true, res.data[0], oldteachers)
                })
            })
            .catch((err) => {
                console.log(err)
            })
        handleUploadTeacher()
    }

    const handleTeacherFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files==null){
            setTeacherFile(undefined)
        }else if (e.target.files.length) {
            const inputFile = e.target.files[0]
            setTeacherFile(inputFile)
        } else {
            //this clears selected file
            setTeacherFile(undefined)
        }
    }

    const handleUploadTeacher = (): void => {
        const reader = new FileReader()

        reader.onload = async ({ target }) => {
            const csv : UserListDAO = Papa.parse(target.result, {
                header: true,
            })
            console.log("csv")
            console.log(csv)
            console.log(typeof csv)
            console.log("csv.data")
            console.log(csv.data)
            console.log(typeof csv.data)
            for (let i = 0; i < csv.data.length; i++) {
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

        reader.readAsText(teacherFile)
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
            return olduser
        }
        for (const teacher of olduser) {
            if (teacher.user == id) {
                found = true
            }
        }
        if (found) {
            return olduser
        } else {
            return [...olduser, userData]
        }
    }

    const handleSave = (): void => {
        const studentIDs = students.map((student) => student.user)
        const teacherIDs = teachers.map((teacher) => teacher.user)
        instance
            .put('vakken/' + vakID + '/', {
                naam: title,
                studenten: studentIDs,
                lesgevers: teacherIDs,
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        instance
            .get('/gebruikers/me/')
            .then((res) => {
                setUser(res.data)
                setUserLoaded(true)
            })
            .catch((err) => {
                console.log(err)
            })
        instance
            .get('vakken/' + vakID)
            .then((res) => {
                setTitle(res.data.naam)
                for (const id of res.data.studenten) {
                    instance
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
                    instance
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
    }, [vakID])

    if (!userLoaded) {
        return <>Loading...</>
    }

    if (!user.is_lesgever) {
        return ErrorPage()
    }

    return (
        <>
            <Stack direction={'column'}>
                <Header variant={'default'} title={title} />
                <Stack
                    direction={'column'}
                    spacing={1}
                    marginTop={11}
                    sx={{
                        width: '100%',
                        height: '70 %',
                        backgroundColor: 'background.default',
                    }}
                >
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        size={'small'}
                        disableElevation
                        onClick={handleSave}
                    >
                        {t('save')}
                    </Button>

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
                            {t('subject_name') + ':'}
                        </Typography>
                        <TextField
                            type="text"
                            placeholder={t('title')}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} padding={2}>
                        <Typography>{t('students') + ':'}</Typography>
                        <Box
                            padding={2}
                            display={'flex'}
                            flexDirection={'row'}
                            alignItems={'center'}
                            gap={1}
                        >
                            {UserList(
                                students,
                                setSelectedStudent,
                                setOpenStudent
                            )}
                            {UploadPart(
                                studentFile,
                                handleStudentFileChange,
                                setEmailStudent,
                                handleAddStudent
                            )}
                        </Box>
                    </Box>

                    {DialogWindow(
                        handleCloseStudent,
                        openStudent,
                        handleRemoveStudent,
                        t('delete_student')
                    )}

                    <Box display={'flex'} flexDirection={'column'} padding={2}>
                        <Typography>{t('teachers') + ':'}</Typography>
                        <Box
                            padding={2}
                            display={'flex'}
                            flexDirection={'row'}
                            alignItems={'center'}
                            gap={1}
                        >
                            {UserList(
                                teachers,
                                setSelectedTeacher,
                                setOpenTeacher
                            )}
                            {UploadPart(
                                teacherFile,
                                handleTeacherFileChange,
                                setEmailTeacher,
                                handleAddTeacher
                            )}
                        </Box>
                    </Box>

                    {DialogWindow(
                        handleCloseTeacher,
                        openTeacher,
                        handleRemoveTeacher,
                        t('delete_teacher')
                    )}
                </Stack>
            </Stack>
        </>
    )
}
