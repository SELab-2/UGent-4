import {Box, Divider, IconButton, ListItemButton, ListItemText, Stack, TextField, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import {Header} from "../../components/Header.tsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import List from '@mui/material/List';
import {t} from "i18next";
import 'dayjs/locale/nl';
import FileUploadButton from "../../components/FileUploadButton";
import ClearIcon from '@mui/icons-material/Clear';

import Dialog from '@mui/material/Dialog';

import instance from '../../axiosConfig.ts';

interface User {
    user: number,
    is_lesgever: boolean,
    first_name: string,
    last_name: string,
    email: string,

}

export function AddChangeSubjectPage() {
    const params = useParams()
    // State for the different fields of the subject
    const [title, setTitle] = useState("");
    const [numStudent, setNumStudent] = useState("");
    const [numTeacher, setNumTeacher] = useState("");
    const [students, setStudents] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [selectedStudent, setSelectedStudent] = useState(0);
    const [openStudent, setOpenStudent] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(0);
    const [openTeacher, setOpenTeacher] = useState(false);
    const vakID = params.courseId;

    const handleCloseStudent = () => {
        setOpenStudent(false);
    };

    const handleRemoveStudent = () => {
        setStudents((oldstudents) => {
            for (let i = 0; i < oldstudents.length; i++) {
                if (oldstudents[i].user == selectedStudent) {
                    oldstudents.splice(i, 1);
                    return oldstudents
                }
            }
            return oldstudents
        })
        setOpenStudent(false);
    };

    const handleUploadClickStudent = () => {
        if (!/^\+?(0|[1-9]\d*)$/.test(numStudent)) {
            //Test if numStudent is an int
            return
        }
        instance.get('gebruikers/' + numStudent).then((res) => {
            setStudents((oldstudents) => {
                //This is like this to prevent the same user being in the list twice
                let found = false;
                const id = res.data.user;
                if (res.data.is_lesgever) {
                    return oldstudents
                }
                for (const student of oldstudents) {
                    if (student.user == id) {
                        found = true;
                    }
                }
                if (found) {
                    return oldstudents
                } else {
                    return [...oldstudents, res.data]
                }

            });
        }).catch((err) => {
                console.log(err);
            }
        );
    };

    const handleCloseTeacher = () => {
        setOpenTeacher(false);
    };

    const handleRemoveTeacher = () => {
        setTeachers((oldteacher) => {
            for (let i = 0; i < oldteacher.length; i++) {
                if (oldteacher[i].user == selectedTeacher) {
                    oldteacher.splice(i, 1);
                    return oldteacher
                }
            }
            return oldteacher
        })
        setOpenTeacher(false);
    };

    const handleUploadClickTeacher = () => {
        if (!/^\+?(0|[1-9]\d*)$/.test(numTeacher)) {
            //Test if numTeacher is an int
            return
        }
        instance.get('gebruikers/' + numTeacher).then((res) => {
            setTeachers((oldteacher) => {
                //This is like this to prevent the same user being in the list twice
                let found = false;
                const id = res.data.user;
                if (!res.data.is_lesgever) {
                    return oldteacher
                }
                for (const teacher of oldteacher) {
                    if (teacher.user == id) {
                        found = true;
                    }
                }
                if (found) {
                    return oldteacher
                } else {
                    return [...oldteacher, res.data]
                }

            });
        }).catch((err) => {
                console.log(err);
            }
        );
    };

    const handleSave = () => {
        const studentIDs = students.map(student => student.user)
        const teacherIDs = teachers.map(teacher => teacher.user)
        instance.put('vakken/' + vakID + '/', {
            naam: title,
            studenten: studentIDs,
            lesgevers: teacherIDs
        }).catch((err) => {
                console.log(err);
            }
        );
    }

    useEffect(() => {
        instance.get('vakken/' + vakID).then((res) => {

            setTitle(res.data.naam);
            for (const id of res.data.studenten) {
                instance.get('gebruikers/' + id).then((res) => {
                    setStudents((oldstudents) => {
                        //This is like this to prevent the same user being in the list twice
                        let found = false;
                        const id = res.data.user;
                        for (const student of oldstudents) {
                            if (student.user == id) {
                                found = true;
                            }
                        }
                        if (found) {
                            return oldstudents
                        } else {
                            return [...oldstudents, res.data]
                        }

                    });

                }).catch((err) => {
                        console.log(err);
                    }
                );
            }
            for (const id of res.data.lesgevers) {
                instance.get('gebruikers/' + id).then((res) => {
                    setTeachers((oldteachers) => {
                        //This is like this to prevent the same user being in the list twice
                        let found = false;
                        const id = res.data.user;
                        for (const teacher of oldteachers) {
                            if (teacher.user == id) {
                                found = true;
                            }
                        }
                        if (found) {
                            return oldteachers
                        } else {
                            return [...oldteachers, res.data]
                        }

                    });

                }).catch((err) => {
                        console.log(err);
                    }
                );
            }
        }).catch((err) => {
                console.log(err);
            }
        );
    }, [vakID])


    return (<>
        <Stack direction={"column"}>
            <Header variant={"default"} title={title}/>
            <Stack direction={"column"} spacing={1} marginTop={11}
                   sx={{width: "100%", height: "70 %", backgroundColor: "background.default"}}>


                <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation onClick={handleSave}>
                    {t("save")}
                </Button>


                <Box aria-label={'title'} display={'flex'} flexDirection={"row"} gap={2} alignItems={"center"}>
                    <Typography variant={'h6'} color={"text.primary"}
                                fontWeight={"bold"}>{t("subject_name") + ":"}</Typography>
                    <TextField type="text" placeholder={t("title")}
                               onChange={(event) => setTitle(event.target.value)}/>
                </Box>

                <Box display={"flex"} flexDirection={"column"} padding={2}>
                    <Typography>{t("students") + ":"}</Typography>
                    <Box padding={2} display={"flex"} flexDirection={"row"} alignItems={'center'} gap={1}>
                        <List disablePadding={true} sx={{'& > :not(style)': {marginBottom: '8px', width: "75vw"}}}>
                            {students.map((student) => {

                                const handleClickOpen = () => {
                                    setSelectedStudent(student.user);
                                    setOpenStudent(true);
                                };


                                return (<>
                                        <ListItemButton sx={{
                                            width: "100%",
                                            height: 30,
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            paddingX: 1,
                                            paddingY: 3,
                                            borderRadius: 2,
                                        }}>
                                            <ListItemText sx={{maxWidth: 100}} primary={student.first_name}/>
                                            <ListItemText sx={{maxWidth: 100}} primary={student.last_name}/>
                                            <ListItemText sx={{maxWidth: 100}} primary={student.user}/>
                                            <IconButton aria-label={'delete_file'} size={'small'}
                                                        onClick={handleClickOpen}
                                                        sx={{marginBottom: 1}}>
                                                <ClearIcon color={'error'}/>
                                            </IconButton>

                                        </ListItemButton>
                                        <Divider color={"text.main"}></Divider>
                                    </>
                                )
                            })}
                        </List>
                        <Box display={"flex"} flexDirection={"column"}>
                            {/* TODO: de csv files moeten afgehandeld worden
                            <FileUploadButton name={t("upload_students")}
                                              fileTypes={['.pdf', '.zip']}
                                              tooltip={t('uploadToolTip')}
                                              
                        />*/}
                            <Box display={"flex"} flexDirection={"row"}>
                                <TextField type="text" placeholder={t("studentnumber")}
                                           onChange={(event) => setNumStudent(event.target.value)}/>
                                <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation
                                        onClick={handleUploadClickStudent}>
                                    {t("add")}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Dialog onClose={handleCloseStudent} open={openStudent}>
                    <Box padding={2} alignItems={'center'} gap={1}>
                        <Typography> {t("delete_student") + "?"} </Typography>
                        <Box display={'flex'} flexDirection={"row"}>
                            <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation
                                    onClick={handleCloseStudent}>
                                {t("cancel")}
                            </Button>
                            <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation
                                    onClick={handleRemoveStudent}>
                                {t("delete")}
                            </Button>
                        </Box>
                    </Box>
                </Dialog>

                <Box display={"flex"} flexDirection={"column"} padding={2}>
                    <Typography>{t("teachers") + ":"}</Typography>
                    <Box padding={2} display={"flex"} flexDirection={"row"} alignItems={'center'} gap={1}>
                        <List disablePadding={true} sx={{'& > :not(style)': {marginBottom: '8px', width: "75vw"}}}>
                            {teachers.map((teacher) => {

                                const handleClickOpen = () => {
                                    setSelectedTeacher(teacher.user);
                                    setOpenTeacher(true);
                                };

                                return (<>
                                        <ListItemButton sx={{
                                            width: "100%",
                                            height: 30,
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            paddingX: 1,
                                            paddingY: 3,
                                            borderRadius: 2,
                                        }}>
                                            <ListItemText sx={{maxWidth: 100}} primary={teacher.first_name}/>
                                            <ListItemText sx={{maxWidth: 100}} primary={teacher.last_name}/>
                                            <ListItemText sx={{maxWidth: 100}} primary={teacher.user}/>
                                            <IconButton aria-label={'delete_file'} size={'small'}
                                                        onClick={handleClickOpen}
                                                        sx={{marginBottom: 1}}>
                                                <ClearIcon color={'error'}/>
                                            </IconButton>

                                        </ListItemButton>
                                        <Divider color={"text.main"}></Divider>
                                    </>
                                )
                            })}
                        </List>
                        <Box display={"flex"} flexDirection={"column"}>
                            {/* TODO: fix dit voor de csv files
                            <FileUploadButton name={t("upload_teachers")}
                                              fileTypes={['.pdf', '.zip']}
                                              tooltip={t('uploadToolTip')}
                        />*/}
                            <Box display={"flex"} flexDirection={"row"}>
                                <TextField type="text" placeholder={t("teacher")}
                                           onChange={(event) => setNumTeacher(event.target.value)}/>
                                <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation
                                        onClick={handleUploadClickTeacher}>
                                    {t("add")}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Dialog onClose={handleCloseStudent} open={openTeacher}>
                    <Box padding={2} alignItems={'center'} gap={1}>
                        <Typography> {t("delete_teacher") + "?"} </Typography>
                        <Box display={'flex'} flexDirection={"row"}>
                            <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation
                                    onClick={handleCloseTeacher}>
                                {t("cancel")}
                            </Button>
                            <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation
                                    onClick={handleRemoveTeacher}>
                                {t("delete")}
                            </Button>
                        </Box>
                    </Box>
                </Dialog>

            </Stack>
        </Stack>
    </>);
}
