
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
import ClearIcon from '@mui/icons-material/Clear'

export interface Group {
    groep_id?: number
    studenten: number[]
    project: number
}

export function ChooseGroup() {

    const [groups,setGroups]=useState([1,2,3]);
    const [open,setOpen] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    }


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
                    <List
                        disablePadding={true}
                        sx={{
                            '& > :not(style)': {
                                marginBottom: '8px',
                            },
                        }}
                    >
                        {groups.map((id) => {
                            const group=getGroup(id)
                            return (
                                <>
                                    <ListItem
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
                                            primary={group.groep_id}
                                        />


                                        <Link href="#" onClick={()=>{setOpen(true)}} >
                                            {group.studenten.length}
                                        </Link>
                                        <IconButton
                                            size={'small'}
                                            sx={{ marginBottom: 1 }}
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

function getGroup(id: number): Group {
    return {
        groep_id: id,
        studenten: [1,2,3],
        project: 5
    }
}