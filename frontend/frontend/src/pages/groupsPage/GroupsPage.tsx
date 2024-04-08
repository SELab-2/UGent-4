import {Header} from "../../components/Header.tsx";
import {
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slide,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import {t} from "i18next";
import {FormEvent, forwardRef, ReactElement, Ref, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import instance from "../../axiosConfig.ts";
import {TransitionProps} from '@mui/material/transitions';
import Dialog from "@mui/material/Dialog";
import CancelIcon from "@mui/icons-material/Cancel";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {Add} from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import WarningPopup from "../../components/WarningPopup.tsx";
import {group} from "../addChangeAssignmentPage/AddChangeAssignmentPage.tsx";

// Typescript typing for hashmap
type Hashmap = Map<number, string>;

// Props for the GroupsPage component, used to pass state to parent component. Is necessery for when a project does
// not have a project id yet, then the project adding page will handle the state.
interface groupProps {
    groups: group[],
    setGroups: (groups: group[]) => void,
    groupSize: number,
    setGroupSize: (groupSize: number) => void,
    open: boolean,
    setOpen: (open: boolean) => void,
}

// Transition component for the slide in animation
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props}  />;
});


export function GroupsPage({groups, groupSize, setGroups, setGroupSize, open, setOpen}: groupProps) {
    const studentNames: Hashmap = useMemo(() => new Map(), []);
    //state for new groups and new groupSize, don't change the old groups and groupSize until the user clicks save
    const [newGroups, setNewGroups] = useState(groups);
    const [newGroupSize, setNewGroupSize] = useState(groupSize);
    const [currentGroup, setCurrentGroup] = useState('');
    const [availableStudents, setAvailableStudents] = useState<number[]>([]);

    // confirmation dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);

    // handle confirmation dialog
    const confirmSave = () => {
        setGroups(newGroups);
        setGroupSize(newGroupSize);
        setOpen(false);
    }

    // close the confirmation dialog
    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    }


    // handle submission when the user clicks save
    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setConfirmOpen(true);

    };

    // Get the project id from the url
    const {courseId} = useParams<{ courseId: string }>();

    // Close the dialog
    const handleClose = () => {
        clearState();
        setOpen(false);
    };

    // Change max group size
    const handleGroupSizeChange = (newValue: number) => {
        setNewGroupSize(newValue);
        setNewGroups(() => {
            const newGroups = [];
            for (let i = 0; i < Math.ceil(availableStudents.length / newValue); i++) {
                newGroups.push({
                    studenten: [],
                });
            }
            return newGroups;
        })
        setCurrentGroup('0');
        instance.get('/vakken/' + courseId).then((response) => {
            setAvailableStudents(response.data.studenten);
        });

    };


    // Get student names from backend and map their id to their name
    useEffect(() => {
        instance.get('/vakken/' + courseId).then(async (response) => {
            for (const student of response.data.studenten) {
                await instance.get('/gebruikers/' + student).then((response) => {
                    studentNames.set(student, response.data.first_name + " " + response.data.last_name);
                    console.log("available names:" + Array.from(studentNames.entries()));
                });
            }
            let newAvailableStudenten = response.data.studenten;
            newAvailableStudenten = newAvailableStudenten.filter((student: number) => !newGroups.some((group) => group.studenten.includes(student)));
            setAvailableStudents(newAvailableStudenten);
        });
    }, [courseId, newGroups]);

    useEffect(() => {
        if (newGroups.length === 0) {
            setNewGroups(() => {
                const newGroups = [];
                for (let i = 0; i < Math.ceil(availableStudents.length / newGroupSize); i++) {
                    newGroups.push({
                        studenten: [],
                    });
                }
                return newGroups;
            })
            setCurrentGroup('0');
        }

    }, [availableStudents.length, newGroupSize, newGroups.length]);

    useEffect(() => {
        setNewGroups(groups);
        setNewGroupSize(groupSize);
    }, [groups, groupSize]);


    //Handle current group change
    const handleCurrentGroupChange = (event: SelectChangeEvent) => {
        setCurrentGroup(event.target.value as string);
    };

    // Randomise groups
    const randomGroups = () => {
        const students = Array.from(studentNames.keys());
        const newGroups: group[] = [];
        for (let i = 0; i < Math.ceil(students.length / newGroupSize); i++) {
            newGroups.push({
                studenten: [],
            });
        }
        for (let i = 0; i < students.length; i++) {
            let randomGroup = Math.floor(Math.random() * newGroups.length);
            while (newGroups[randomGroup].studenten.length >= newGroupSize) {
                randomGroup = Math.floor(Math.random() * newGroups.length);
            }
            newGroups[randomGroup].studenten.push(students[i]);
        }

        setNewGroups(newGroups);
    };

    const clearState = () => {
        setNewGroups(groups);
        setNewGroupSize(groupSize);
    }

    // assign a student to a group
    const assignStudent = (studentId: number, groupId: number) => {
        // First, create a new copy of the availableStudents array without the studentId
        const updatedAvailableStudents = availableStudents.filter((student) => student !== studentId);
        setAvailableStudents(updatedAvailableStudents);
        console.log('group id: ' + groupId);
        // Then, create a new copy of the newGroups array with the updated group
        const updatedNewGroups = newGroups.map((group, index) => {
            if (index === groupId) {
                // Create a new copy of the group with the updated studenten array
                console.log("group.studenten: " + group.studenten);
                return {
                    ...group,
                    studenten: [...group.studenten, studentId]
                };
            }
            return group;
        });

        // Finally, update the state with the new copy
        setNewGroups(updatedNewGroups);
    };


    // remove a student from a group
    const removeStudent = (studentId: number, groupId: number) => {
        // First, create a new copy of the availableStudents array with the studentId
        const updatedAvailableStudents = [...availableStudents, studentId];
        setAvailableStudents(updatedAvailableStudents);

        // Then, create a new copy of the newGroups array with the updated group
        const updatedNewGroups = newGroups.map((group, index) => {
            if (index === groupId) {
                // Create a new copy of the group with the updated studenten array
                return {
                    ...group,
                    studenten: group.studenten.filter((student) => student !== studentId)
                };
            }
            return group;
        });

        // Finally, update the state with the new copy
        setNewGroups(updatedNewGroups);
    };

    return (
        <>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-label={'groups'}>
                <Box
                    component={"form"}
                    onSubmit={handleSave}
                    sx={{
                        backgroundColor: 'background.default',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Header variant={"default"} title={"Project 1: groepen"}></Header>
                    <Stack marginTop={12} direction={"column"} spacing={4}
                           sx={{width: "100%", height: "70 %", backgroundColor: "background.default"}}>
                        <DialogContent>
                            <Box sx={{
                                gap: 5,
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
                                            <Typography color="text.primary" fontWeight={'bold'}>
                                                {t("amount")} {t("members")}/{t("group")}
                                            </Typography>
                                        </Grid>
                                        <Grid item minWidth={3}>
                                            <TextField aria-label={'maxGroupSize'} value={newGroupSize}
                                                       type={'number'}
                                                       onChange={(newValue) => {
                                                           if (parseInt(newValue.target.value) < 1) return;
                                                           handleGroupSizeChange(parseInt(newValue.target.value))
                                                       }}
                                                       variant="outlined"
                                                       sx={{width: 80}}/>
                                        </Grid>
                                    </Grid>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={10} marginY={6}>
                                    <Button variant={'contained'} disableElevation
                                            sx={{backgroundColor: 'secondary.main', padding: 1}}
                                            onClick={randomGroups}
                                    >
                                        <Typography color="text.primary" fontWeight={'bold'}>
                                            {t("random")} {t("groups")}
                                        </Typography>
                                    </Button>
                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                        <Typography color="text.primary" fontWeight={'bold'}>
                                            {t("students_choose")}
                                        </Typography>
                                        <Switch/>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box
                                sx={{
                                    marginTop: -3,
                                    overflowY: "auto",
                                    padding: "20px",
                                    backgroundColor: "background.default",
                                }}
                            >
                                <Box aria-label={'group_assigner'} display={'flex'} flexDirection={'row'}
                                     maxWidth={600}
                                     justifyContent={'space-between'} gap={6} pl={3} pr={3}
                                     alignItems={'flex-start'}
                                >
                                    <Table aria-label={'studentTable'} stickyHeader sx={{maxHeight: '50svh'}}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography fontWeight={'bold'}>{t('studenten')}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {availableStudents.map((student) => (
                                                <TableRow key={student}>
                                                    <TableCell>{studentNames.get(student)}
                                                        <IconButton onClick={() => {
                                                            assignStudent(student, parseInt(currentGroup));
                                                        }}>
                                                            <Add/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Table aria-label={'groupTable'} stickyHeader sx={{maxHeight: '5    0svh'}}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography fontWeight={'bold'}>{t('group')}</Typography>
                                                    <Select aria-label={'groupSelect'} value={currentGroup}
                                                            sx={{width: 200}}
                                                            onChange={handleCurrentGroupChange} label={t('group')}>
                                                        {newGroups.map((_, index) => (
                                                            <MenuItem key={index.toString()}
                                                                      value={index.toString()}>{t('group') + (index + 1)}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(newGroups.length > 0) && newGroups[parseInt(currentGroup)].studenten.map((student) => (
                                                <TableRow key={student}>
                                                    <TableCell>{studentNames.get(student)}
                                                        <IconButton onClick={() => {
                                                            removeStudent(student, parseInt(currentGroup));
                                                        }}>
                                                            <CancelIcon/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))

                                            }
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Box>
                        </DialogContent>
                    </Stack>
                    <Box aria-label={'save/cancel'}
                         sx={{
                             position: "fixed",
                             bottom: 0,
                             width: "100%",
                             alignItems: 'flex-end',
                             gap: 5,
                             paddingRight: 10
                         }}>
                        <DialogActions>
                            <Box pr={5} pb={5} display={'flex'} gap={1}>
                                <Tooltip title={t('cancel')}>
                                    <IconButton
                                        onClick={handleClose}
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
                        </DialogActions>
                    </Box>
                </Box>
                {/* Warning popup for when the user wants to confirm the group changes */}
                <WarningPopup title={t('change_groups')} content={t('cant_be_undone')} buttonName={t('confirm')}
                              open={confirmOpen}
                              handleClose={handleCloseConfirm} doAction={confirmSave}/>
            </Dialog>
        </>
    );
}