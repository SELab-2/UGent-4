import {Header} from "../../components/Header.tsx";
import UploadIcon from '@mui/icons-material/Upload';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import { AssignmentListItemTeacherPage } from "../../components/AssignmentListItemTeacherPage.tsx";
import { Box, Button, Card, Divider, Grid, List, ListItem, ListItemText, ListSubheader, Stack, TextField, Typography} from "@mui/material";
import {t} from "i18next";

const text = "Lorem ipsum dolor sit amet consectetur. Nisi magna dolor et nisi nibh et velit phasellus. Aliquam semper justo posuere suspendisse amet amet nam nec. Tellus magna in proin tempor hac sit. Faucibus laoreet nulla commodo quis. Porttitor sit facilisis sit dignissim quis. Malesuada etiam tempor donec et ante. Aliquam massa donec augue aliquam semper amet blandit sed faucibus. Et elementum duis adipiscing turpis mi. Senectus eu rutrum accumsan convallis metus mattis risus. Quam eget sapien tellus aliquam facilisi sit volutpat. Scelerisque auctor purus nam sit lacus amet ullamcorper amet. Turpis nulla quis in pretium. Maecenas aliquam ac ullamcorper suspendisse morbi cras. Mi nibh aliquet massa sit eget tristique a. Posuere pretium auctor tellus massa et eu egestas. Sit lorem proin aenean tortor morbi condimentum. Leo eu enim cursus tempus sed viverra laoreet. Nisl ornare velit molestie suspendisse. Hendrerit nibh mauris vulputate sit vitae. Tellus quisque non nibh proin nunc lacus scelerisque dui. Aliquam fermentum libero aliquet volutpat at. Vestibulum ultrices nec felis leo nibh viverra. Hendrerit ut nunc porta egestas sit velit dictumst dis porta. Donec quam aliquam commodo mattis purus. Tellus nulla lectus fusce in fames scelerisque at."

const students = [
    {
      id: '1',
      name: 'Lucas',
      submitted: new Date(2024, 11, 17),
      score: 12,
    },
    {
      id: '2',
      name: 'Sophia',
      submitted: undefined,
      score: 15,
    },
    {
      id: '3',
      name: 'Ethan',
      submitted: new Date(2024, 11, 19),
      score: 18,
    },
    {
      id: '4',
      name: 'Emma',
      submitted: new Date(2024, 11, 20),
      score: 10,
    },
    {
      id: '5',
      name: 'Liam',
      submitted: undefined,
      score: 17,
    },
    {
      id: '6',
      name: 'Olivia',
      submitted: new Date(2024, 11, 22),
      score: 14,
    },
    {
      id: '7',
      name: 'Noah',
      submitted: undefined,
      score: 9,
    },
    {
      id: '8',
      name: 'Ava',
      submitted: undefined,
      score: 16,
    },
    {
      id: '9',
      name: 'Mia',
      submitted: new Date(2024, 11, 25),
      score: 11,
    },
    {
      id: '10',
      name: 'William',
      submitted: undefined,
      score: 19,
    },
];

const deadline = "02/04/2024";

export function AssignmentTeacherPage() {
    return (
        <>
            <Header variant={"editable"} title={"Naam Project"}></Header>
            <Stack marginTop={15} direction={"column"} spacing={4}
                   sx={{width: "100%", height: "100%", backgroundColor: "background.default"}}>

                {/*deadline and groep button */}
                <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                    <Typography variant="h6" color="text.primary"><strong>Deadline </strong>{deadline}</Typography>
                </Box>

               {/*Opgave*/}
               <Card elevation={1} sx={{
                    color: "text.primary",
                    padding: '20px',
                    backgroundColor: "background.default",
                    borderRadius: 5,
                }}
                >
                    <Stack direction={"column"}>
                        <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>{t("assignment")}</Typography>
                        <Typography>{text}</Typography>
                    </Stack>
                </Card>

                {/*Indieningen*/}
                <Card elevation={1} sx={{
                    color: "text.primary",
                    backgroundColor: "background.default",
                    borderRadius: 5,
                    padding: '20px'
                    
                }}
                >
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                        <Typography sx={{ fontWeight: 'bold' }}>Student</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>{t("time")}</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>Score</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>{t("download")}</Typography>
                    </Box>
                    <Box style={{maxHeight: 300, overflow: 'auto'}}>
                        <Divider color={"text.main"}></Divider>
                        <List disablePadding={true} >
                                {students.map((student) => (
                                    <Box key={student.id}>
                                        <Divider color={"text.main"}></Divider>
                                        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                                        <AssignmentListItemTeacherPage
                                            id={student.id} 
                                            studentName={student.name}
                                            submitted={student.submitted}
                                            score={student.score}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                        </List>
                    </Box>
                </Card>


                    <AddRestrictionButton></AddRestrictionButton>

                    {/* <Button sx={{bgcolor: 'secondary.main'}}>
                        <AddIcon sx={{color: "secondary.contrastText"}}></AddIcon>
                    </Button> */}
             {/*Upload knop*/}
             <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                    <Stack direction={"row"}>
                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                            <Typography color="secondary.contrastText">{t("export")} {t("submissions")}</Typography>
                        </Button>
                        <div style={{flexGrow: 1}}/>
                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                            <Typography color="secondary.contrastText">{t("adjust_scores")}</Typography>
                        </Button>
                    </Stack>
                </Box>


            </Stack>
        </>
    );
}