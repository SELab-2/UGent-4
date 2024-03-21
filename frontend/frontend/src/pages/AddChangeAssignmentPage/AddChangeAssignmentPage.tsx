import {Box, Button, Card, Divider, IconButton, ListItem, Stack, TextField, Tooltip, Typography} from "@mui/material";
import {Header} from "../../components/Header.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {Dayjs} from "dayjs";
import {t} from "i18next";
import {DateTimePicker, LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import 'dayjs/locale/nl';
import FileUploadButton from "../../components/FileUploadButton";
import List from "@mui/material/List";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from "@mui/icons-material/Add";
import Switch from "@mui/material/Switch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';

//TODO: fix api integration
//TODO: add logic for all form state manipulations

/**
 * This page is used to add or change an assignment.
 * The page should only be accessible to teachers of the course.
 * The page should contain a form to fill in the details of the assignment.
 * The form should contain the following fields:
 * - Title
 * - Description
 * - Due date with datepicker
 * - Restrictions
 * - Groups
 * - Visible
 * The form should also contain a button to upload the assignment file for ease of use.
 */

interface assignment {
    title: string,
    description: string,
    assignmentFile: File,
    dueDate: Dayjs,
    restrictions: restriction[],
    groups: boolean,
    visible: boolean,
}

interface restriction {
    type: string,
    value: string,
}

export function AddChangeAssignmentPage() {
    // State for the different fields of the assignment
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [restrictions, setRestrictions] = useState<restriction[]>([]);
    const [groups, setGroups] = useState(false);
    const [visible, setVisible] = useState(false);
    const [assignmentFile, setAssignmentFile] = useState<File>();

    /**
     * Function to upload the details of the assignment through a text file
     * @param {ChangeEvent<HTMLInputElement>} event - The event object
     */
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAssignmentFile(event.target.files[0]);
            console.log(assignmentFile?.name);
        }
    };

    const handleAddRestriction = () => {

    }

    useEffect(() => {
        //TODO: fetch data from api
        console.log(assignmentFile);
        setRestrictions([{type: "test", value: "test"}, {type: "test2", value: "test2"}, {
            type: "test3",
            value: "test3"
        }, {type: "test4", value: "test4"}])
    }, [assignmentFile]);

    return (
        <>
            <Stack direction={"column"} paddingX={2}>
                <Header variant={"default"} title={title}/>
                <Stack direction={"column"} marginTop={11}>
                    <Box aria-label={"title_and_upload"}
                         padding={2}
                         paddingRight={0}
                         gap={1}
                         display={'flex'}
                         flexDirection={"row"}
                         width={'98%'}
                         justifyContent={"space-between"}>
                        <Box aria-label={'title'} display={'flex'} flexDirection={"row"} gap={2} alignItems={"center"}>
                            <Typography variant={'h6'} color={"text.primary"}
                                        fontWeight={"bold"}>{t('assignmentName')}</Typography>
                            <TextField type="text" placeholder={"Title"}
                                       onChange={(event) => setTitle(event.target.value)}/>
                        </Box>
                        <Box padding={0} marginRight={3} display={"flex"} flexDirection={"column"}
                             alignItems={"flex-start"}>
                            <FileUploadButton name={t('upload')} path={assignmentFile}
                                              onFileChange={handleFileChange}
                                              fileTypes={['.pdf', '.zip']}
                                              tooltip={t('uploadToolTip')}
                            />
                        </Box>
                    </Box>
                    <Box aria-label={'deadline'} padding={2} display={'flex'} flexDirection={'row'}
                         alignItems={'center'} gap={2}>
                        <Typography variant={'h6'} color={"text.primary"}
                                    fontWeight={"bold"}>Deadline:</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
                            <DateTimePicker value={dueDate}
                                            sx={{width: 230}}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                            onChange={(newValue) => setDueDate(newValue)}/>
                        </LocalizationProvider>
                    </Box>
                    <Card aria-label={'description'} elevation={1}
                          sx={{backgroundColor: 'background.default'}}>
                        <Box padding={2} maxHeight={"20svh"} minHeight={'20svh'}>
                            <Typography variant={'h6'} color={"text.primary"}
                                        fontWeight={"bold"}>{t('description')}</Typography>
                            <TextField type="text" placeholder={"Description"} variant={'standard'} multiline
                                       value={description} onChange={(event) => setDescription(event.target.value)}
                                       fullWidth
                                       sx={{overflowY: 'auto', maxHeight: '25svh'}}/>
                        </Box>
                    </Card>
                    <Box aria-label={'restrictions'} marginTop={3} display={"flex"} flexDirection={'row'}>
                        <Card
                            sx={{
                                padding: 1,
                                backgroundColor: "background.default",
                                width: '70%',
                                height: "28svh",
                            }}>
                            <Typography variant={"h6"} fontWeight={"bold"}>{t("restrictions")}</Typography>
                            <Box sx={{padding: 1}}>
                                <List sx={{maxHeight: "18vh", overflowY: "auto"}}>
                                    {
                                        restrictions.map((restriction, index) => {
                                            return (
                                                <Box key={index}>
                                                    <ListItem
                                                        sx={{gap: 4, justifyContent: "space-between"}}>
                                                        <Typography variant={"body1"}
                                                                    fontWeight={"bold"}>{restriction.type}</Typography>
                                                        <Box display={'flex'} flexDirection={'row'}
                                                             alignItems={'center'} gap={1}>
                                                            <Typography
                                                                variant={"body1"}>{restriction.value}</Typography>
                                                            <IconButton size={'small'}>
                                                                <ClearIcon fontSize={'small'}
                                                                           color={'error'}></ClearIcon>
                                                            </IconButton>
                                                        </Box>
                                                    </ListItem>
                                                    <Divider/>
                                                </Box>
                                            );
                                        })
                                    }
                                </List>
                            </Box>
                            <Box width={'100%'} display={'flex'} justifyContent={'flex-end'}>
                                <Tooltip title={t('add_restriction')}>
                                    <IconButton color={"primary"} onClick={handleAddRestriction}><AddIcon/></IconButton>
                                </Tooltip>
                            </Box>
                        </Card>
                    </Box>
                    <Box aria-label={'main actions'} marginTop={5} display={"flex"} flexDirection={'row'}
                         width={'100%'} justifyContent={'space-between'}>
                        <Box aria-label={'visibility_and_groups'} display={'flex'} flexDirection={'row'} gap={1}
                             alignItems={'center'}
                             padding={2}>
                            {groups ?
                                <Button variant={"contained"} disableElevation
                                        color={"secondary"}>{t('groups')}</Button> :
                                <Typography color={'text.primary'} variant={"body1"}>{t('groups')}</Typography>}
                            <Switch checked={groups} onChange={() => setGroups(!groups)} color={'primary'}/>
                            {visible ?
                                <IconButton color={"info"}
                                            onClick={() => setVisible(!visible)}><VisibilityIcon
                                    fontSize={'medium'}/></IconButton> :
                                <IconButton color={"info"}
                                            onClick={() => setVisible(!visible)}><VisibilityOffIcon
                                    fontSize={'medium'}/></IconButton>}
                            <Tooltip title={t('remove')}>
                                <IconButton color={"info"}><DeleteForeverIcon fontSize={'medium'}/></IconButton>
                            </Tooltip>
                        </Box>
                        <Box aria-label={'submit_and_cancel'} display={'flex'} flexDirection={'row'} gap={1}
                             alignItems={'center'}>
                            <Tooltip title={t('cancel')}>
                                <IconButton
                                    sx={{backgroundColor: 'secondary.main', borderRadius: 2}}>
                                    <ClearIcon
                                        fontSize={'medium'}/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('submit')}>
                                <IconButton
                                    sx={{
                                        backgroundColor: 'primary.main', borderRadius: 2,
                                        color: 'background.default',
                                        "&:hover": {
                                            backgroundColor: 'secondary.main',
                                            color: 'text.primary'
                                        },
                                    }}>
                                    <SaveIcon
                                        fontSize={'medium'}/></IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Stack>
            </Stack>
        </>
    );
}