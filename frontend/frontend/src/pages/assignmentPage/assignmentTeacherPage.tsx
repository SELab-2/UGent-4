import {Header} from "../../components/Header.tsx";
import { Box, Button, Card, Divider, Grid, List, ListItem, ListItemText, Stack, TextField, Typography} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

const text = "Lorem ipsum dolor sit amet consectetur. Nisi magna dolor et nisi nibh et velit phasellus. Aliquam semper justo posuere suspendisse amet amet nam nec. Tellus magna in proin tempor hac sit. Faucibus laoreet nulla commodo quis. Porttitor sit facilisis sit dignissim quis. Malesuada etiam tempor donec et ante. Aliquam massa donec augue aliquam semper amet blandit sed faucibus. Et elementum duis adipiscing turpis mi. Senectus eu rutrum accumsan convallis metus mattis risus. Quam eget sapien tellus aliquam facilisi sit volutpat. Scelerisque auctor purus nam sit lacus amet ullamcorper amet. Turpis nulla quis in pretium. Maecenas aliquam ac ullamcorper suspendisse morbi cras. Mi nibh aliquet massa sit eget tristique a. Posuere pretium auctor tellus massa et eu egestas. Sit lorem proin aenean tortor morbi condimentum. Leo eu enim cursus tempus sed viverra laoreet. Nisl ornare velit molestie suspendisse. Hendrerit nibh mauris vulputate sit vitae. Tellus quisque non nibh proin nunc lacus scelerisque dui. Aliquam fermentum libero aliquet volutpat at. Vestibulum ultrices nec felis leo nibh viverra. Hendrerit ut nunc porta egestas sit velit dictumst dis porta. Donec quam aliquam commodo mattis purus. Tellus nulla lectus fusce in fames scelerisque at."

const restrictions = [
    {
        type: 'bestandstype',
        details: '.pdf .zip',
    },
    {
        type: 'bestandsgrootte',
        details: '< 0.25 gb',
    },
    {
        type: 'docker test',
        details: 'filename',
    },
]

interface restrictionProps {
    type: string,
    details: string,
}

export function Restriction({type, details}: restrictionProps) {
    return (
        <>
            <ListItem>
                <ListItemText>{type}</ListItemText>
                <ListItemText>{details}</ListItemText>
            </ListItem>
        </>
    );
}


export function AssignmentTeacherPage() {
    return (
        <>
            <Header variant={"default"} title={"Naam Project"}></Header>
            <Stack marginTop={15} direction={"column"} spacing={4}
                   sx={{width: "100%", height: "100%", backgroundColor: "background.default"}}>

                {/*opdracht and upload button*/}
                <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                    <Stack direction={"row"}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Typography variant="h6" sx={{ fontWeight: 'bold'}} color="text.primary">
                                    Naam Opdracht
                                </Typography>
                            </Grid>
                            <Grid item>
                                <TextField variant="outlined"/>
                            </Grid>
                        </Grid>
                        <div style={{flexGrow: 1}}/>
                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                            <Typography color="secondary.contrastText">upload opgavebestand</Typography>
                            <UploadIcon></UploadIcon>
                        </Button>
                    </Stack>
                </Box>

                {/*Deadline*/}
                <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Typography variant="h6" sx={{ fontWeight: 'bold'}} color="text.primary">
                                Deadline
                            </Typography>
                        </Grid>
                        <Grid item>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker/>
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
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
                        <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>Opgave</Typography>
                        <TextField multiline variant="outlined" defaultValue={text}/>
                    </Stack>
                </Card>

                {/*Restricties*/}
                <Card elevation={1} sx={{
                    color: "text.primary",
                    backgroundColor: "background.default",
                    borderRadius: 5,
                    padding: '20px'
                }}
                >
                    <List>
                        <ListItem>
                            <ListItemText><strong>Type restrictie</strong></ListItemText>
                            <ListItemText><strong>Details</strong></ListItemText>
                        </ListItem>
                        <Divider/>

                        {restrictions.map((res) =>
                            <Restriction type={res.type} details={res.details}></Restriction>
                        )}

                    </List>

                    <Button sx={{bgcolor: 'secondary.main'}}>
                        <AddIcon sx={{color: "secondary.contrastText"}}></AddIcon>
                    </Button>
                </Card>
                
                <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                    <Stack direction={"row"}>
                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                            <Typography color="secondary.contrastText">groepen</Typography>
                        </Button>
                        <div style={{flexGrow: 1}}/>
                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                            <SaveIcon sx={{color: "secondary.contrastText"}}></SaveIcon>
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
}