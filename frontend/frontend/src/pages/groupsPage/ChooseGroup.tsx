
import {
    Link,
    Box,
    Card,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography,
    Dialog,
} from '@mui/material'
import List from '@mui/material/List'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {Header} from "../../components/Header.tsx";
import { t } from 'i18next'
import AddCircle from '@mui/icons-material/AddCircle'
import { useParams } from 'react-router-dom'
import instance from "../../axiosConfig.ts";

export interface Group {
    groep_id?: number
    studenten: number[]
    project: number
}

export interface User {
    user: number
    is_lesgever: boolean
    first_name: string
    last_name: string
    email: string
}


export function ChooseGroup() {

    const params = useParams()


    const [studenten,setStudenten]=useState<Record<number, User>>({});
    const [groups,setGroups]=useState<Group[]>([]);
    const [open,setOpen] = useState<boolean>(false);

    const [user, setUser] = useState<User>()

    //const assignmentId = params.assignmentId
    const assignmentId = 14

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(()=>{
        instance
            .get('/gebruikers/me/')
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        instance.get('projecten/'+assignmentId)
            .then((res) =>{
                instance.get('vakken/'+res.data.vak)
                    .then((res) => {
                        //setStudenten(res.data.studenten)
                        for (let i=0;i<res.data.studenten.length;i++){
                            const studentid=res.data.studenten[i]
                            instance.get('gebruikers/'+studentid)
                                .then((res) => {
                                    setStudenten((oldstudenten) => {
                                        console.log("insetStudenten")
                                        console.log(res.data)
                                        console.log(oldstudenten)
                                        //return oldstudenten
                                        return {...oldstudenten,[res.data.user]: res.data}
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
            })
            .catch((err) => {
                console.log(err)
            })


        instance.get('groepen/?project='+assignmentId)
            .then((res) => {
                for (let i=0;i<res.data.length;i++){
                    setGroups((oldGroups)=> {

                        let found = false
                        const id = res.data[i].groep_id
                        for (const group of oldGroups) {
                            if (group.groep_id == id) {
                                found = true
                            }
                        }
                        if (found) {
                            return oldGroups
                        } else {
                            return [...oldGroups,res.data[i]]
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })

    },[])


    return (
        <>
            <Stack direction={'column'}>
                <Header variant={'default'} title={"title"} />
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
                    <Card
                        elevation={1}
                        sx={{
                            color: 'text.primary',
                            backgroundColor: 'background.default',
                            borderRadius: 5,
                            padding: '20px',
                        }}
                    >
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            pl={3}
                            pr={3}
                        >
                            <Typography sx={{ fontWeight: 'bold' }}>
                                {t('group_number')}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                {t('members')}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>

                            </Typography>
                        </Box>
                    <List
                        disablePadding={true}
                        sx={{
                            '& > :not(style)': {
                                marginBottom: '8px',
                            },
                        }}
                    >
                        {groups.map((group: Group) => {
                            //const group=getGroup(id)

                            const handleJoin = () =>{
                                //console.log(groups)
                                setGroups((oldGroups)=>{
                                    console.log("setGroups")
                                    for (let i = 0; i < oldGroups.length; i++) {
                                        if(oldGroups[i].groep_id==group.groep_id){
                                            console.log(oldGroups[i])
                                            const newgroup={
                                                groep_id: group.groep_id,
                                                project: group.project,
                                                studenten: [...group.studenten,user.user],
                                            }
                                            oldGroups[i]=newgroup
                                            console.log(oldGroups[i])
                                        }
                                    }
                                    return oldGroups
                                })
                                //console.log(groups)
                            }

                            return (
                                <>
                                    <ListItem
                                        sx={{
                                            width: '100%',
                                            //minheight: 30,
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
                                            primary={group.groep_id}
                                        />

                                        <ListItemText
                                            sx={{ maxWidth: 100 }}
                                            primary={group.studenten}
                                        />

                                        <Box display={'flex'} flexDirection={'column'}>
                                            {group.studenten.map((studentid)=>{
                                                if(studenten[studentid]!=undefined){
                                                    return (
                                                        <>
                                                            <Typography>
                                                                {studenten[studentid].first_name+" "+studenten[studentid].last_name}
                                                            </Typography>
                                                        </>
                                                        )
                                                }
                                            })}

                                        </Box>

                                        <IconButton
                                            size={'small'}
                                            sx={{ marginBottom: 1 }}
                                            onClick={handleJoin}
                                        >
                                            <AddCircle />
                                        </IconButton>
                                    </ListItem>
                                    <Divider color={'text.main'}></Divider>
                                </>
                            )
                        })
                        }
                    </List>

                        <Dialog onClose={handleClose} open={open}>
                            <Box padding={2} alignItems={'center'} gap={1}>
                                <Typography> {"placeholder"} </Typography>
                            </Box>
                        </Dialog>


                    </Card>
                </Stack>
            </Stack>
        </>
    )
}

// function getGroup(id: number): Group {
//     return {
//         groep_id: id,
//         studenten: [17,18],
//         project: 5
//     }
// }