import {Header} from "../../components/Header.tsx";
import {Grid ,TextField,Box,List, Button, Stack, Typography, Card, Divider, ListItem, ListItemText} from "@mui/material";
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

export function GroupListItem({name}:GroupListItemProps) {
    return (
        <>
         <Card elevation={1} sx={{
                color:"text.primary", 
                padding: '0px',
                backgroundColor: "background.default",
                borderRadius:5,
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
            <Stack marginTop={15} direction={"column"} spacing={4} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
            <Typography variant="h6" sx={{ textDecoration: 'underline' }} color="text.primary">
                                Groepen:
            </Typography>
            <Stack direction={"row"}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Typography sx={{ textDecoration: 'underline' }} color="text.primary">
                                Leden per groep:
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" sx={{ width: "50px"}} />
                        </Grid>
                    </Grid>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ textDecoration: 'underline' }} color="text.primary">
                    Willekeurige groepen:
                </Typography>
                <Switch />
                <Typography sx={{ textDecoration: 'underline' }} color="text.primary">
                    Studenten kunnen kiezen:
                </Typography>
                <Switch />
            </Stack>

           
            <List sx={{ '& > :not(style)': { marginBottom: '8px' ,width: "100vh" } }}>
                <ListItem>
                    <ListItemText><strong>Naam Student</strong></ListItemText>
                    <ListItemText><strong>Ingeschreven groep</strong></ListItemText>
                </ListItem>
                <Divider/>
                
                {groups.map((res) =>
                    <GroupListItem name={res.name}></GroupListItem>
                )}
                
            </List>

            </Stack>
        </>
    );
}