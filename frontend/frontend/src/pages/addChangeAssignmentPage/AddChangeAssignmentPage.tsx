import {Box, Button, Card, Divider, IconButton, ListItem, Stack, TextField, Tooltip, Typography} from "@mui/material";
import {Header} from "../../components/Header.tsx";
import {ChangeEvent, FormEvent, useEffect, useMemo, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {t} from "i18next";
import {DateTimePicker, DateTimeValidationError, LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
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
import {useNavigate, useParams} from "react-router-dom";
import instance from "../../axiosConfig.ts";
import {GroupsPage} from "../groupsPage/GroupsPage.tsx";
import WarningPopup from "../../components/WarningPopup.tsx";

//TODO: add restriction functionality
/**
 * This page is used to add or change an assignment.
 * The page should only be accessible to teachers of the course.
 * The page should contain a form to fill in the details of the assignment.
 * The form should contain the following fields:
 * - Title
 * - Description
 * - Due date with datepicker
 * - Extra deadline with datepicker
 * - Restrictions
 * - Groups
 * - Visible
 * - Max score
 * The form should also contain a button to upload the assignment file for ease of use.
 * Groups are managed with a popup, should be managed with a different api call.
 * restrictions use a different api call as well.
 */

const initialAllowedTypes: restrictionType[] = ['dockerTest', 'fileSize', 'fileType'];

interface getAssignment {
    project_id: number,
    titel: string,
    beschrijving: string,
    opgave_bestand: File,
    vak: number,
    max_score: number,
    max_groep_grootte: number,
    deadline: string | null,
    extra_deadline: string | null,
    zichtbaar: boolean,
    gearchiveerd: boolean,
}

export interface restriction {
    type: string,
    value: string[] | number | File | undefined,
}

interface errorChecks {
    title: boolean,
    description: boolean,
    deadlineCheck: boolean,
}

export interface group {
    groep_id?: number,
    studenten: number[],
    project?: number,

}

export function AddChangeAssignmentPage() {
    const navigate = useNavigate();

    // State for the different fields of the assignment
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [extraDueDate, setExtraDueDate] = useState<Dayjs | null>(null);
    const [restrictions, setRestrictions] = useState<restriction[]>([]);
    const [allowGroups, setAllowGroups] = useState(false);
    const [visible, setVisible] = useState(false);
    const [assignmentFile, setAssignmentFile] = useState<File>();
    const [maxScore, SetMaxScore] = useState<number>(20);
    const [cleared, setCleared] = useState<boolean>(false);

    // State for the error checks of the assignment
    const [assignmentErrors, setAssignmentErrors] = useState<errorChecks>({
        title: false,
        description: false,
        deadlineCheck: false
    });
    const [deadlineError, SetDeadlineError] = useState<DateTimeValidationError | null>(null);

    // State for the restriction popup
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<restrictionType>('dockerTest');
    const [dockerfile, setDockerFile] = useState<File>();
    const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>([]);
    const [maxSize, setMaxSize] = useState<number>();
    const [allowedTypes, setAllowedTypes] = useState<restrictionType[]>(initialAllowedTypes);

    // State for groups
    const [groupOpen, setGroupOpen] = useState(false);
    const [groupSize, setGroupSize] = useState(1);
    const [groups, setGroups] = useState<group[]>([]);

    const handleGroupOpen = () => {
        setGroupOpen(true);
    }

    //confirmation dialogs
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [saveConfirmation, setSaveConfirmation] = useState(false);

    const closeSaveConfirmation = () => {
        setSaveConfirmation(false);
    }

    //open the delete confirmation dialog
    const openDeleteConfirmation = () => {
        setDeleteConfirmation(true);
    }

    const closeDeletion = () => {
        setDeleteConfirmation(false);
    }

    const handleRemove = async () => {
        if (assignmentId !== undefined) {
            await instance.delete(`/projecten/${assignmentId}`).catch((error) => {
                console.error(error);
            });
        }
        alert("Assignment Removed");
        navigate(-1);
    }

    //url parameters
    const {courseId, assignmentId} = useParams();

    //handle the cancelation of changes, should save the groups if they are changed
    const handleCancel = () => {
        if (assignmentId !== undefined) {
            if (groups[0].groep_id !== undefined) {
                for (const group of groups) {
                    instance.put('/groepen/' + group.groep_id + "/", group).catch((error) => {
                        console.error(error);
                    });
                }
            } else {
                instance.get<group[]>(`/groepen/?project=${assignmentId}`).then((response) => {
                    for (const group of response.data) {
                        instance.delete(`/groepen/${group.groep_id}`).catch((error) => {
                            console.error(error);
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });

                for (const group of groups) {
                    instance.post('/groepen/', group).catch((error) => {
                        console.error(error);
                    });
                }
            }
        }
        if (assignmentId !== undefined) {
            navigate('/course_teacher/' + courseId + '/assignment/' + assignmentId);
        } else {
            navigate('/course_teacher/' + courseId);
        }
    }

    //set the initial values of the assignment if it is an edit
    useEffect(() => {
            if (assignmentId !== undefined) {
                instance.get<getAssignment>(`/projecten/${assignmentId}`).then((response) => {
                    const assignment = response.data;
                    console.log("returned assignment " + assignment.titel + " " + assignment.beschrijving);
                    setTitle(assignment.titel);
                    setDescription(assignment.beschrijving);
                    //TODO: file from api is not a file but string
                    //setAssignmentFile(assignment.opgave_bestand);
                    console.log('bestand' + assignment.opgave_bestand);
                    SetMaxScore(assignment.max_score);
                    console.log('max score' + assignment.max_score);
                    setGroupSize(assignment.max_groep_grootte);
                    console.log('group size' + assignment.max_groep_grootte);
                    if (assignment.max_groep_grootte > 1) {
                        setAllowGroups(true);
                    }
                    setVisible(assignment.zichtbaar);
                    if (assignment.deadline !== null) {
                        setDueDate(dayjs(assignment.deadline, 'YYYY-MM-DDTHH:mm:ss'));
                        console.log('deadline' + assignment.deadline);
                    }
                    if (assignment.extra_deadline !== null) {
                        setExtraDueDate(dayjs(assignment.extra_deadline, 'YYYY-MM-DDTHH:mm:ss'));
                        console.log('extra deadline' + assignment.extra_deadline);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
        , [assignmentId]);

    // make the datepickers clearable
    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => {
        };
    }, [cleared]);

    // Get groups from api if groups are allowed / clear groups if groups are not allowed
    useEffect(() => {
        if (allowGroups) {
            if (assignmentId !== undefined) {
                instance.get<group[]>(`/groepen/?project=${assignmentId}`).then((response) => {
                    setGroups(response.data);
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                setGroups([]);
            }
        } else {
            setGroups([]);
        }
    }, [allowGroups, assignmentId]);


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

    function deadlineCheck() {
        if (dueDate === null && extraDueDate === null) {
            return false;
        } else if (dueDate !== null && extraDueDate !== null) {
            return extraDueDate.isAfter(dueDate);
        } else if (dueDate !== null && extraDueDate === null) {
            return false;
        }
        return true;
    }

// Handle the submission of the form, check if all required fields are filled in, and send the data to the API.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //Don't make api calls if the form is not filled in correctly.
        setAssignmentErrors({title: title === "", description: description === "", deadlineCheck: deadlineCheck()});
        if (title === "" || description === "") {
            return;
        }
        setSaveConfirmation(true)
    }

    // Upload the assignment to the API.
    //TODO: put/post does not work yet
    const uploadAssignment = async () => {
        let optionalFile: File | null = null;
        if (assignmentFile !== undefined) {
            optionalFile = assignmentFile;
        }
        const formData = new FormData();
        formData.append('titel', title);
        formData.append('beschrijving', description);
        formData.append('vak', parseInt(courseId as string).toString());
        if (optionalFile) {
            formData.append('opgave_bestand', optionalFile);
        }
        formData.append('zichtbaar', visible.toString());

        if (allowGroups) {
            formData.append('max_groep_grootte', groupSize.toString());
        } else {
            formData.append('max_groep_grootte', '1');
        }

        // Add optional fields
        if (maxScore !== 20) {
            formData.append('max_score', maxScore.toString());
        }
        if (dueDate !== null) {
            formData.append('deadline', dueDate.format());
        }
        if (extraDueDate !== null) {
            formData.append('extra_deadline', extraDueDate.format());
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        if (assignmentId !== undefined) {
            formData.append('project_id', assignmentId);
            await instance.put('/projecten/' + parseInt(assignmentId) + "/", formData, config).catch((error) => {
                console.error(error)
            });

            if (allowGroups) {
                for (const group of groups) {
                    if (group.groep_id !== undefined) {
                        await instance.put('/groepen/' + group.groep_id + '/', group).catch((error) => {
                            console.error(error);
                        });
                    } else {
                        await instance.post('/groepen/', group).catch((error) => {
                            console.error(error);
                        });
                    }
                }
            } else {
                await instance.get<group[]>(`/groepen/?project=${assignmentId}`).then((response) => {
                    for (const group of response.data) {
                        instance.delete(`/groepen/${group.groep_id}`).catch((error) => {
                            console.error(error);
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });

                await instance.get('/vakken/' + courseId).then((response) => {
                    const course = response.data;
                    for (const student of course.studenten) {
                        const newGroup: group = {
                            studenten: [student],
                            project: parseInt(assignmentId),
                        }
                        instance.post('/groepen/', newGroup).catch((error) => {
                            console.error(error);
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }

        } else {
            //if there is no assignmentId, it is a new assignment
            let newAssgnmentId: number;
            await instance.post('/projecten/', formData, config).then((response) => {
                    newAssgnmentId = response.data.project_id;
                }
            ).catch((error) => {
                console.error(error)
            });


            if (allowGroups) {
                for (const group of groups) {
                    await instance.post('/groepen/', group).catch((error) => {
                        console.error(error);
                    });
                }
            } else {
                await instance.get('/vakken/' + courseId).then((response) => {
                    const course = response.data;
                    for (const student of course.studenten) {
                        const newGroup: group = {
                            studenten: [student],
                            project: newAssgnmentId,
                        }
                        instance.post('/groepen/', newGroup).catch((error) => {
                            console.error(error);
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }

        console.info('Form submitted', title, description, dueDate, restrictions, allowGroups, visible, assignmentFile)
        setSaveConfirmation(false);
        if (assignmentId !== undefined) {
            navigate('/course_teacher/' + courseId + '/assignment/' + assignmentId);
        } else {
            navigate('/course_teacher/' + courseId);
        }
    }

    // Handle the error messages for the date picker.
    const errorMessage = useMemo(() => {
        switch (deadlineError) {
            case 'disablePast': {
                return t('not_before_now')
            }

            default: {
                return '';
            }
        }
    }, [deadlineError]);

    // Remove the types of restrictions that are already added to the assignment from the allowed types.
    useEffect(() => {

        const currentRestrictionTypes = restrictions.map((restriction) => restriction.type as restrictionType);
        const newAllowedRestrictions = initialAllowedTypes.filter((type) => !currentRestrictionTypes.includes(type));
        setAllowedTypes(newAllowedRestrictions);

        if (newAllowedRestrictions.length !== 0) {
            setType(newAllowedRestrictions[0]);
        }

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
                                       value={title}
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
                    <Box aria-label={'deadline'} padding={2} display={'flex'}
                         flexDirection={{xs: 'column', sm: 'column', md: 'row'}}
                         gap={5}>
                        <Box aria-label={'initial_deadline'} display={'flex'} flexDirection={'row'} gap={2}
                             alignItems={'center'}>
                            <Typography variant={'h6'} color={"text.primary"}
                                        fontWeight={"bold"}>Deadline:</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
                                <DateTimePicker value={dueDate} disablePast
                                                label={t('optional')}
                                                sx={{width: 230}}
                                                viewRenderers={{
                                                    hours: renderTimeViewClock,
                                                    minutes: renderTimeViewClock,
                                                    seconds: renderTimeViewClock,
                                                }}
                                                onError={(newError) => SetDeadlineError(newError)}
                                                slotProps={{
                                                    field: {clearable: true, onClear: () => setCleared(true)},
                                                    textField: {
                                                        helperText: errorMessage,
                                                    },
                                                }
                                                }
                                                onChange={(newValue) => setDueDate(newValue)}/>
                            </LocalizationProvider>
                        </Box>
                        <Box aria-label={'secondary_deadline'} display={'flex'} flexDirection={'row'} gap={2}
                             alignItems={'center'}>
                            <Typography variant={'h6'} color={"text.primary"}
                                        fontWeight={"bold"}>Extra Deadline:</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
                                <DateTimePicker value={extraDueDate} disablePast
                                                label={t('optional')}
                                                sx={{width: 230}}
                                                viewRenderers={{
                                                    hours: renderTimeViewClock,
                                                    minutes: renderTimeViewClock,
                                                    seconds: renderTimeViewClock,
                                                }}
                                                slotProps={{
                                                    field: {clearable: true, onClear: () => setCleared(true)},
                                                    textField: {
                                                        error: deadlineCheck(),
                                                        helperText: deadlineCheck() ? t('deadlineCheck') : ''
                                                    },
                                                }}
                                                onChange={(newValue) => setExtraDueDate(newValue)}/>
                            </LocalizationProvider>
                        </Box>
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
                        <Box aria-label={'visibility_and_groups'} display={'flex'} flexDirection={'row'} gap={10}
                             alignItems={'center'}
                             padding={2}>
                            <Box aria-label={'main actions'} display={'flex'} flexDirection={'row'}
                                 alignItems={'center'}>
                                {allowGroups ?
                                    <Button variant={"contained"} disableElevation
                                            onClick={handleGroupOpen}
                                            color={"secondary"}>{t('groups')}</Button> :
                                    <Typography color={'text.primary'} variant={"body1"}>{t('groups')}</Typography>}
                                <Switch checked={allowGroups} onChange={() => setAllowGroups(!allowGroups)}
                                        color={'primary'}/>
                                {visible ?
                                    <IconButton color={"info"}
                                                onClick={() => setVisible(!visible)}><VisibilityIcon
                                        fontSize={'medium'}/></IconButton> :
                                    <IconButton color={"info"}
                                                onClick={() => setVisible(!visible)}><VisibilityOffIcon
                                        fontSize={'medium'}/></IconButton>}
                                <Tooltip title={t('remove')}>
                                    <IconButton color={"info"} onClick={openDeleteConfirmation}><DeleteForeverIcon
                                        fontSize={'medium'}/></IconButton>
                                </Tooltip>
                            </Box>
                            <Box aria-label={'maxScore'} display={'flex'} flexDirection={'row'} gap={1}
                                 alignItems={'center'}>
                                <Typography fontWeight={'bold'} color={"text.primary"}>Max Score</Typography>
                                <TextField
                                    sx={{width: 80}}
                                    required
                                    label={"Max Score"}
                                    type={'number'}
                                    value={maxScore}
                                    onChange={(event) => {
                                        if (event.target.value !== '') {
                                            const newScore = Math.max(parseInt(event.target.value), 0);
                                            SetMaxScore ? SetMaxScore(newScore) : undefined;
                                        } else {
                                            SetMaxScore ? SetMaxScore(parseInt(event.target.value)) : undefined;
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box aria-label={'submit_and_cancel'} display={'flex'} flexDirection={'row'} gap={1}
                             alignItems={'center'}>
                            <Tooltip title={t('cancel')}>
                                <IconButton onClick={handleCancel}
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
                <GroupsPage groups={groups} setGroups={setGroups} groupSize={groupSize} setGroupSize={setGroupSize}
                            open={groupOpen}
                            setOpen={setGroupOpen}/>
                <WarningPopup title={t('remove') + ' Project?'} content={t('cant_be_undone')}
                              buttonName={t('remove')} open={deleteConfirmation} handleClose={closeDeletion}
                              doAction={handleRemove}/>
                <WarningPopup title={t('save_project_warning')} content={t('visible_for_everyone')}
                              buttonName={t('confirm')} open={saveConfirmation}
                              handleClose={closeSaveConfirmation} doAction={uploadAssignment}/>
            </Stack>
        </>
    );
}