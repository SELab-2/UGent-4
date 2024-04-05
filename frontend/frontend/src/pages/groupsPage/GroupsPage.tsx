import {Header} from "../../components/Header.tsx";
import {Box, Divider, Grid, List, Stack, TextField, Typography} from "@mui/material";
import Switch from '@mui/material/Switch';
import { GroupListItem } from "../../components/GroupListItem.tsx";
import {t} from "i18next";

const groups = [
    {
      id: '1',
      name: 'Jane',
      members: ['Josh', 'Alice','Joost','Michiel','Andy']
    },
    {
      id: '2',
      name: 'John',
      members: ['Emily', 'Michael']
    },
    {
      id: '3',
      name: 'Emma',
      members: ['James', 'Olivia']
    },
    {
      id: '4',
      name: 'Jack',
      members: ['Sophia', 'William']
    },
    {
      id: '5',
      name: 'Ava',
      members: ['Alexander', 'Charlotte']
    },
    {
      id: '6',
      name: 'Liam',
      members: ['Grace', 'Henry']
    },
    {
      id: '7',
      name: 'Ella',
      members: ['Daniel', 'Chloe']
    },
    {
      id: '8',
      name: 'Noah',
      members: ['Mia', 'Samuel']
    },
    {
      id: '9',
      name: 'Sophie',
      members: ['Ethan', 'Madison']
    },
    {
      id: '10',
      name: 'Luke',
      members: ['Avery', 'Benjamin']
    },
    {
      id: '11',
      name: 'Mila',
      members: ['Jackson', 'Victoria']
    }
];
  
  
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
                    {t("groups")}
                </Typography>
                    <Stack direction={"row"}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Typography color="text.primary">
                                   {t("amount")} {t("members")}/{t("group")}
                                </Typography>
                            </Grid>
                            <Grid item minWidth={3}>
                                <TextField variant="outlined" sx={{width: 60}}/>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography color="text.primary">
                            {t("random")} {t("groups")}
                        </Typography>
                        <Switch/>
                        <Typography color="text.primary">
                          {t("students_choose")}
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
                    <List>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                        <Typography sx={{fontWeight: 'bold'}}>Student</Typography>
                        <Typography sx={{fontWeight: 'bold'}}>{t("group_members")}</Typography>
                    </Box>
                    <Box style={{maxHeight: 300, overflow: 'auto'}}>
                            <Divider/>

                            {groups.map((group) =>
                                <GroupListItem 
                                    id={group.id}
                                    studentName={group.name}
                                    groupMemberNames={group.members}
                                    ></GroupListItem>
                            )}
                    </Box>
                    </List>
                </Box>
            </Stack>
        </>
    );
}