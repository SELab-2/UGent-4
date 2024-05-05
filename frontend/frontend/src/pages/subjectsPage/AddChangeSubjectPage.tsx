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
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
    users: User[],
    setSelected: React.Dispatch<React.SetStateAction<number>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
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
                    {/* The list of users is mapped onto buttons
                    This makes it possible to click through on a person. */}
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

// This function will render the UI for adding extra students or teachers.
// It can either be done by uploading a file or by typing in the email.
function UploadPart(
    file: File | undefined,
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    handleAdd: () => void,
    str: string
) {
    return (
        <>
            <Box display={'flex'} flexDirection={'column'}>
                <FileUploadButton
                    name={str}
                    fileTypes={['.csv']}
                    tooltip={t('uploadToolTip')}
                    onFileChange={handleFileChange}
                    path={file != null ? file : undefined}
                />
                <Box display={'flex'} flexDirection={'row'}>
                    {/* This box allows you to add extra people by their email. */}
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
    const [students, setStudents] = useState<User[]>([])
    const [teachers, setTeachers] = useState<User[]>([])
    const [selectedStudent, setSelectedStudent] = useState<number>(0)
    const [openStudent, setOpenStudent] = useState<boolean>(false)
    const [selectedTeacher, setSelectedTeacher] = useState<number>(0)
    const [openTeacher, setOpenTeacher] = useState<boolean>(false)
    const [studentFile, setStudentFile] = useState<File>()
    const [teacherFile, setTeacherFile] = useState<File>()

    const [vakID,setVakID]= useState(params.courseId)

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
        if(vakID==undefined){
            instance
                .post('vakken/'  , {
                    naam: title,
                    studenten: studentIDs,
                    lesgevers: teacherIDs,
                }).then((res) => {
                    setVakID(res.data.vak_id)
                })
                .catch((err) => {
                    console.log(err)
                })
        }else{
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

    }

    useEffect(() => {
        if(vakID!=undefined){
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
        }
    }, [vakID])

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
                        /* This is the large save button on the top of the page */
                        variant={'contained'}
                        color={'secondary'}
                        size={'small'}
                        disableElevation
                        onClick={handleSave}
                    >
                        {t('save')}
                    </Button>

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
                                handleAddStudent,
                                t('upload_students')
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
                                handleAddTeacher,
                                t('upload_teachers')
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
