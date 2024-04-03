import {Box, Card, Stack, TextField, Typography, IconButton,Grid} from "@mui/material";
import Button from '@mui/material/Button';
import {Header} from "../../components/Header.tsx";
import {ChangeEvent, useState} from "react";
import { useParams } from "react-router-dom";
import List from '@mui/material/List';
import {ListItem, ListItemButton, ListItemText, Divider} from "@mui/material";
//import {Dayjs} from "dayjs";
import {t} from "i18next";
import {DateTimePicker, LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import 'dayjs/locale/nl';
import FileUploadButton from "../../components/FileUploadButton";
import ClearIcon from '@mui/icons-material/Clear';

import Dialog from '@mui/material/Dialog';

import instance from '../../axiosConfig.ts';

interface Student {
  id: number;
  studentnumber: number;
  name:string;
}

interface Teacher {
  id: number;
  name:string;
}

export function AddChangeSubjectPage() {
  const params = useParams()
  // State for the different fields of the subject
  const [title, setTitle] = useState("");
  const [num, setNum] = useState("");
  const [students, setStudents]  = useState({list:[1,2,3]});
  //const students = [1,2,3].map((id) => getstudent(id));
  const [teachers, setTeachers]  = useState([4,5,6]);
  //const teachers = [1,2,3].map((id) => getteacher(id));

  instance.get('vakken/').then((res) => {

    setTitle("success");
    console.log("success");
    //setStudents([10,11]);
    console.log(res);
  }).catch((err) => {
    setTitle("zever");
    //setStudents({list:[1,2,7]});
    console.log("vvvvvvv");
    console.log(err);
    console.log("^^^^^^^");
    // console.log(params.courseId);
  }
  );



  // instance.get('/vakken/' + params.courseId).then((res) => {
  //   //setStudents([10,11]);
  //   console.log(res);
  // }).catch((err) => {
  //   setTitle("zever");
  //   //setStudents({list:[1,2,7]});
  //   console.log(err);
  //   console.log(params.courseId);
  // }
  // );




  return (<>
      <Stack direction={"column"} >
        <Header variant={"default"} title={title}/>
        <Stack direction={"column"} spacing={1} marginTop={11} sx={{width: "100%", height: "70 %", backgroundColor: "background.default"}}>




          <Box aria-label={'title'} display={'flex'} flexDirection={"row"} gap={2} alignItems={"center"}>
              <Typography variant={'h6'} color={"text.primary"}
                          fontWeight={"bold"}>{t("subject_name")+":"}</Typography>
              <TextField type="text" placeholder={t("title")}
                         onChange={(event) => setTitle(event.target.value)}/>
          </Box>

          <Box display={"flex"} flexDirection={"column"} padding={2}>
            <Typography>{t("students")+":"}</Typography>
            <Box padding={2} display={"flex"} flexDirection={"row"} alignItems={'center'} gap={1}>
              <List disablePadding={true} sx={{'& > :not(style)': {marginBottom: '8px', width: "75vw"}}}>
                {students.list.map((id) => {
                  const [open, setOpen] = useState(false);

                  const handleClickOpen = () => {
                    setOpen(true);
                  };
                  const handleClose = (value: string) => {
                    setOpen(false);
                    setSelectedValue(value);
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
                      borderRadius:2,
                  }}>
                  <ListItemText sx={{maxWidth:100}} primary={getstudent(id).name}/>
                  <ListItemText sx={{maxWidth:100}} primary={getstudent(id).studentnumber}/>
                  <ListItemText sx={{maxWidth:100}} primary={id}/>
                  <IconButton aria-label={'delete_file'} size={'small'} onClick={handleClickOpen}
                              sx={{marginBottom: 1}}>
                      <ClearIcon color={'error'}/>
                  </IconButton>
                  <Dialog onClose={handleClose} open={open}>
                    <Box padding={2} alignItems={'center'} gap={1}>
                      <Typography> {t("delete_student")+"?"} </Typography>
                      <Typography> {t("this_can_not_be_undone")} </Typography>
                      <Box display={'flex'} flexDirection={"row"}>
                        <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation onClick={handleClose}>
                          {t("cancel")}
                        </Button>
                        <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation>
                          {t("delete")}
                        </Button>
                      </Box>
                    </Box>
                  </Dialog>

                  </ListItemButton>
                  <Divider color={"text.main"}></Divider>
                  </>
                )})}
              </List>
              <Box display={"flex"} flexDirection={"column"}>
                <FileUploadButton name={t("upload_students")}
                                  fileTypes={['.pdf', '.zip']}
                                  tooltip={t('uploadToolTip')}
                />
                <Box display={"flex"} flexDirection={"row"}>
                  <TextField type="text" placeholder={t("studentnumber")}
                           onChange={(event) => setNum(event.target.value)}/>
                  <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation>
                  {t("add")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>


          <Box display={"flex"} flexDirection={"column"} padding={2}>
            <Typography>{t("teachers")+":"}</Typography>
            <Box padding={2} display={"flex"} flexDirection={"row"} alignItems={'center'} gap={1}>
              <List disablePadding={true} sx={{'& > :not(style)': {marginBottom: '8px', width: "75vw"}}}>
                {teachers.map((id) => {
                  const [open, setOpen] = useState(false);

                  const handleClickOpen = () => {
                    setOpen(true);
                  };
                  const handleClose = (value: string) => {
                    setOpen(false);
                    setSelectedValue(value);
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
                      borderRadius:2,
                  }}>
                  <ListItemText sx={{maxWidth:100}} primary={getteacher(id).name}/>
                  <ListItemText sx={{maxWidth:100}} primary={id}/>
                  <IconButton aria-label={'delete_file'} size={'small'} onClick={handleClickOpen}
                              sx={{marginBottom: 1}}>
                      <ClearIcon color={'error'}/>
                  </IconButton>
                  <Dialog onClose={handleClose} open={open}>
                    <Box padding={2} alignItems={'center'} gap={1}>
                      <Typography> {t("delete_teacher")+"?"} </Typography>
                      <Typography> {t("this_can_not_be_undone")} </Typography>
                      <Box display={'flex'} flexDirection={"row"}>
                        <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation onClick={handleClose}>
                          {t("cancel")}
                        </Button>
                        <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation>
                          {t("delete")}
                        </Button>
                      </Box>
                    </Box>
                  </Dialog>

                  </ListItemButton>
                  <Divider color={"text.main"}></Divider>
                  </>
                )})}
              </List>
              <Box display={"flex"} flexDirection={"column"}>
                <FileUploadButton name={t("upload_teachers")}
                                  fileTypes={['.pdf', '.zip']}
                                  tooltip={t('uploadToolTip')}
                />
                <Box display={"flex"} flexDirection={"row"}>
                  <TextField type="text" placeholder={t("teacher")}
                           onChange={(event) => setNum(event.target.value)}/>
                  <Button variant={"contained"} color={"secondary"} size={'small'} disableElevation>
                  {"add"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

        </Stack>
      </Stack>
    </>);
}

function getstudent(id: number): Student {
  return {
      id: id,
      studentnumber: 123456,
      name: "naam"
  }
}

function getteacher(id: number): Teacher {
  return {
      id: id,
      name: "teacher"
  }
}
