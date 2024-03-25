import {Header} from "../../components/Header.tsx";
import {AssignmentListItem} from "../../components/AssignmentListItem.tsx";
import {Box, Button, Card, Divider, List, Stack, Typography} from "@mui/material";

const text = "Lorem ipsum dolor sit amet consectetur. Nisi magna dolor et nisi nibh et velit phasellus. Aliquam semper justo posuere suspendisse amet amet nam nec. Tellus magna in proin tempor hac sit. Faucibus laoreet nulla commodo quis. Porttitor sit facilisis sit dignissim quis. Malesuada etiam tempor donec et ante. Aliquam massa donec augue aliquam semper amet blandit sed faucibus. Et elementum duis adipiscing turpis mi. Senectus eu rutrum accumsan convallis metus mattis risus. Quam eget sapien tellus aliquam facilisi sit volutpat. Scelerisque auctor purus nam sit lacus amet ullamcorper amet. Turpis nulla quis in pretium. Maecenas aliquam ac ullamcorper suspendisse morbi cras. Mi nibh aliquet massa sit eget tristique a. Posuere pretium auctor tellus massa et eu egestas. Sit lorem proin aenean tortor morbi condimentum. Leo eu enim cursus tempus sed viverra laoreet. Nisl ornare velit molestie suspendisse. Hendrerit nibh mauris vulputate sit vitae. Tellus quisque non nibh proin nunc lacus scelerisque dui. Aliquam fermentum libero aliquet volutpat at. Vestibulum ultrices nec felis leo nibh viverra. Hendrerit ut nunc porta egestas sit velit dictumst dis porta. Donec quam aliquam commodo mattis purus. Tellus nulla lectus fusce in fames scelerisque at."

const assignments = [
    {
        id: '1',
        name: '#1',
        deadline: new Date(2024, 11, 17)
    },
    {
        id: '2',
        name: '#2',
        deadline: new Date(2024, 10, 25)
    },
    {
        id: '3',
        name: '#3',
        deadline: new Date(2024, 9, 30)
    },
    {
        id: '4',
        name: '#4',
        deadline: new Date(2024, 8, 12)
    },
    {
        id: '5',
        name: '#5',
        deadline: new Date(2024, 7, 8)
    },
    {
        id: '6',
        name: '#6',
        deadline: new Date(2024, 6, 15)
    },
    {
        id: '7',
        name: '#7',
        deadline: new Date(2024, 5, 20)
    },
    {
        id: '8',
        name: '#8',
        deadline: new Date(2024, 4, 10)
    },
    {
        id: '9',
        name: '#9',
        deadline: new Date(2024, 3, 28)
    }
];

const deadline = "02/04/2024";

export function AssignmentStudentPage() {
    return (
        <>
            <Header variant={"not_main"} title={"Naam Opdracht"}></Header>
            <Stack marginTop={15} direction={"column"} spacing={4}
                   sx={{width: "100%", height: "100%", backgroundColor: "background.default"}}>
                
                {/*deadline and groep button */}
                <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                    <Stack direction={"row"}>
                        <Typography variant="h6" color="text.primary"><strong>Deadline </strong>{deadline}</Typography>
                        <div style={{flexGrow: 1}}/>
                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                            <Typography color="secondary.contrastText">groep</Typography>
                        </Button>
                    </Stack>
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
                        <Typography sx={{fontWeight: 'bold'}}>Indiening</Typography>
                        <Typography sx={{fontWeight: 'bold'}}>Tijdstip</Typography>
                        <Typography sx={{fontWeight: 'bold'}}>Status</Typography>
                    </Box>
                    <Box style={{maxHeight: 300, overflow: 'auto'}}>
                        <Divider color={"text.main"}></Divider>
                        <List disablePadding={true} >
                            {assignments.map((assignment) => (
                                <Box key={assignment.id}>
                                    <Divider color={"text.main"}></Divider>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                                    <AssignmentListItem id={assignment.id} projectName={assignment.name}
                                                        dueDate={assignment.deadline}
                                                        status={true}
                                                        isStudent={true}/>
                                    </Box>
                                </Box>
                            ))}
                        </List>
                    </Box>
                </Card>

                {/*Upload knop*/}
                <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                    <Stack direction={"row"}>
                        <Button sx={{bgcolor: 'primary.main', textTransform: 'none'}}>
                            <Typography color="primary.contrastText">Uploaden</Typography>
                        </Button>
                        <div style={{flexGrow: 1}}/>
                        <Button sx={{bgcolor: 'success.main', textTransform: 'none'}}>
                            <Typography color="primary.contrastText">Uploaden Geslaagd</Typography>
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
}
