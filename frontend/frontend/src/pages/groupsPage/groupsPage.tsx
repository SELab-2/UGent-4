import {Header} from "../../components/Header.tsx";
import {Box, Card, Divider, Grid, List, ListItem, ListItemText, Stack, TextField, Typography} from "@mui/material";
import Switch from '@mui/material/Switch';


const groups = [
    {
        name: 'Jane'
    },
    {
        name: 'John'
    },
    {
        name: 'Alice'
    },
    {
        name: 'Bob'
    },
    {
        name: 'Emily'
    },
    {
        name: 'David'
    },
    {
        name: 'Sophia'
    },
    {
        name: 'Michael'
    },
    {
        name: 'Olivia'
    },
    {
        name: 'William'
    },
];


interface GroupListItemProps {
    name: string,
}

export function GroupListItem({name}: GroupListItemProps) {
    return (
        <>
            <Card elevation={1} sx={{
                color: "text.primary",
                padding: 0,
                backgroundColor: "background.default",
                borderRadius: 5,
                margin: 1
            }}
            >
                <ListItem>
                    <ListItemText>{name}</ListItemText>
                    <ListItemText>student1, student2..</ListItemText>
                </ListItem>
            </Card>
        </>
    );
}


export function GroupsPage() {
    return (
        <>
            <Header variant={"default"} title={"Project 1: groepen"}></Header>
            <Stack marginTop={12} direction={"column"} spacing={4}
                   sx={{width: "100%", height: "70 %", backgroundColor: "background.default"}}>
                <Box sx={{
                    padding: '20px',
                    backgroundColor: "background.default",
                }}
                >
                <Typography variant="h6" sx={{fontWeight: 'bold'}} color="text.primary">
                    Groepen
                </Typography>
                    <Stack direction={"row"}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Typography color="text.primary">
                                    Leden per groep
                                </Typography>
                            </Grid>
                            <Grid item minWidth={3}>
                                <TextField variant="outlined" sx={{width: 60}}/>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography color="text.primary">
                            Willekeurige groepen
                        </Typography>
                        <Switch/>
                        <Typography color="text.primary">
                            Studenten kunnen kiezen
                        </Typography>
                        <Switch/>
                    </Stack>
                </Box>

                <Box 
                    sx={{
                        overflowY: "auto",
                        padding: "20px",
                        backgroundColor: "background.default",
                    }}
                >
                    <List sx={{'& > :not(style)': {marginBottom: '8px', width: "150vh"}}}>
                        <ListItem>
                            <ListItemText sx={{ color:"text.primary" }}><strong>Naam Student</strong></ListItemText>
                            <ListItemText sx={{ color:"text.primary" }}><strong>Ingeschreven groep</strong></ListItemText>
                        </ListItem>
                        <Divider/>

                        {groups.map((res) =>
                            <GroupListItem name={res.name}></GroupListItem>
                        )}
                    </List>
                </Box>

            </Stack>
        </>
    );
}