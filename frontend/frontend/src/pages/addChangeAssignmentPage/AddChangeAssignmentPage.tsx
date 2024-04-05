import {Box, Button, Card, Divider, IconButton, ListItem, Stack, TextField, Tooltip, Typography} from "@mui/material";
import {Header} from "../../components/Header.tsx";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
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
import RestrictionPopup, {restrictionType} from "./RestrictionPopup.tsx";

//TODO: fix api integration
//TODO: add restriction functionality
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

const initialAllowedTypes: restrictionType[] = ['dockerTest', 'fileSize', 'fileType'];

interface assignment {
    title: string,
    description: string,
    assignmentFile: File | null,
    dueDate: Dayjs,
    restrictions: restriction[],
    groups: boolean,
    visible: boolean,
}

export interface restriction {
    type: string,
    value: string[] | number | File | undefined,
}

interface errorChecks {
    title: boolean,
    description: boolean,
    dueDate: boolean,
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

    // State for the error checks of the assignment
    const [assignmentErrors, setAssignmentErrors] = useState<errorChecks>({
        title: false,
        description: false,
        dueDate: false
    });

    // State for the restriction popup
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<restrictionType>('dockerTest');
    const [dockerfile, setDockerFile] = useState<File>();
    const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>([]);
    const [maxSize, setMaxSize] = useState<number>();
    const [allowedTypes, setAllowedTypes] = useState<restrictionType[]>(initialAllowedTypes);

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

    // Limit the types of restrictions that can be added by one for each type and set the type to the first allowed type,
    // then open the restriction popup.
    const handleAddRestriction = () => {
        //found at https://upmostly.com/typescript/typescripts-array-filter-method-explained
        const currentRestrictionTypes = restrictions.map((restriction) => restriction.type as restrictionType);
        setAllowedTypes(initialAllowedTypes.filter((type) => !currentRestrictionTypes.includes(type)));
        if (allowedTypes.length !== 0) {
            setType(allowedTypes[0])
            setOpen(true);
        }
    }

    // Remove the restriction at the given index, tied to the remove button in the restriction list.
    const removeRestriction = (index: number) => {
        setRestrictions(restrictions.filter((_, i) => i !== index));
    }

// Handle the submission of the form, check if all required fields are filled in, and send the data to the API.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAssignmentErrors({title: title === "", description: description === "", dueDate: dueDate === null});
        if (title === "" || description === "" || dueDate === null) {
            return;
        }
        let optionalFile: File | null = null;
        if (assignmentFile !== undefined) {
            optionalFile = assignmentFile;
        }
        const newAssignment: assignment = {
            title: title,
            description: description,
            assignmentFile: optionalFile,
            dueDate: dueDate,
            restrictions: restrictions,
            groups: groups,
            visible: visible,
        }
        //TODO: send data to api
        alert("Form Submitted");
        console.info('Form submitted', title, description, dueDate, restrictions, groups, visible, assignmentFile)
    }

    // Remove the types of restrictions that are already added to the assignment from the allowed types.
    useEffect(() => {
        const currentRestrictionTypes = restrictions.map((restriction) => restriction.type as restrictionType);
        setAllowedTypes(initialAllowedTypes.filter((type) => !currentRestrictionTypes.includes(type)));
        setType(allowedTypes[0]);
        console.log(allowedTypes)
    }, [restrictions]);

    return (
        <>
            <Stack direction={"column"} paddingX={2}>
                <Header variant={"default"} title={title}/>
                <Stack direction={"column"} marginTop={11} component={"form"} onSubmit={handleSubmit}>
                    <Box aria-label={"title_and_upload"}
                         padding={2}
                         paddingRight={0}
                         gap={1}
                         display={'flex'}
                         flexDirection={"row"}
                         width={'98%'}
                         justifyContent={"space-between"}>
                        <Box aria-label={'title'} display={'flex'} flexDirection={"row"} gap={2}
                             alignItems={"center"}>
                            <Typography variant={'h6'} color={"text.primary"}
                                        fontWeight={"bold"}>{t('assignmentName')}</Typography>
                            <TextField type="text" placeholder={"Title"} error={assignmentErrors.title}
                                       helperText={assignmentErrors.title ? t('name') + " " + t('is_required') : ""}
                                       onChange={(event) => setTitle(event.target.value)}/>
                        </Box>
                        <Box padding={0} marginRight={3} display={"flex"} flexDirection={"column"}
                             alignItems={"flex-start"}>
                            <FileUploadButton name={t('upload_assignment')} path={assignmentFile}
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
                            <DateTimePicker value={dueDate} disablePast
                                            sx={{width: 230}}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                            slotProps={{
                                                textField: {
                                                    error: assignmentErrors.dueDate,
                                                    helperText: assignmentErrors.dueDate ? "Deadline" + " " + t('is_required') : "",
                                                },
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
                                       error={assignmentErrors.description}
                                       helperText={assignmentErrors.description ? t("descriptionName") + " " + t('is_required') : ""}
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
                                                                variant={"body1"}>{restriction.value instanceof File ? restriction.value.name : restriction.value instanceof Array ? restriction.value.join(', ') : typeof restriction.value === 'number' ? restriction.value.toString() + 'mb' : ''
                                                            }</Typography>
                                                            <IconButton size={'small'}
                                                                        onClick={() => removeRestriction(index)}>
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
                                    <IconButton color={"primary"}
                                                disabled={allowedTypes.length === 0}
                                                onClick={handleAddRestriction}><AddIcon/></IconButton>
                                </Tooltip>
                            </Box>
                        </Card>
                    </Box>
                    <Box aria-label={'main actions'} marginTop={3} display={"flex"} flexDirection={'row'}
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
                                <IconButton type="submit" aria-label={"submit"}
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
                <RestrictionPopup open={open} setOpen={setOpen}
                                  type={type} setType={setType}
                                  restrictions={restrictions} setRestrictions={setRestrictions}
                                  allowedFileTypes={allowedFileTypes} setAllowedFileTypes={setAllowedFileTypes}
                                  dockerfile={dockerfile} setDockerFile={setDockerFile}
                                  maxSize={maxSize} setMaxSize={setMaxSize}
                                  allowedTypes={allowedTypes}
                />
            </Stack>
        </>
    );
}