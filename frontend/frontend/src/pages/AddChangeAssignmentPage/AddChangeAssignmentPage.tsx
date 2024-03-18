import {Box, Card, Stack, TextField, Typography} from "@mui/material";
import {Header} from "../../components/Header.tsx";
import {ChangeEvent, useState} from "react";
import {Dayjs} from "dayjs";
import {t} from "i18next";
import {DateTimePicker, LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import 'dayjs/locale/nl';
import FileUploadButton from "../../components/FileUploadButton";


//TODO: fix api integration

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
    artifact: string,
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

    return (
        <>
            <Stack direction={"column"}>
                <Header variant={"default"} title={title}/>
                <Stack direction={"column"} spacing={1} marginTop={11}>
                    <Box aria-label={"title_and_upload"}
                         padding={2}
                         gap={1}
                         display={'flex'}
                         flexDirection={"row"}
                         width={'100%'}
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
                    <Card aria-label={'description'} elevation={1} sx={{backgroundColor: 'background.default'}}>
                        <Box padding={2} maxHeight={"20 svh"}>
                            <Typography variant={'h6'} color={"text.primary"}
                                        fontWeight={"bold"}>{t('description')}</Typography>
                            <TextField type="text" placeholder={"Description"} variant={'standard'} multiline
                                       value={description} onChange={(event) => setDescription(event.target.value)}
                                       fullWidth
                                       sx={{overflowY: 'auto', maxHeight: '25svh'}}/>
                        </Box>
                    </Card>
                    <Box aria-label={'restrictions'} padding={2} display={'flex'} flexDirection={'column'}>

                    </Box>
                </Stack>
            </Stack>
        </>
    );
}