import {ListItem, ListItemButton, ListItemText, Divider, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {t} from "i18next";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface AssignmentListItemSubjectsPageProps {
    key: string;
    projectName: string;
    dueDate?: Date;
    submissions: number;
    score: number;
    isStudent: boolean;
    visible: boolean;
}

/*
* This component is used to display a single assignment in the list of assignments
* @param key: string - the key of the assignment
* @param projectName: string - the name of the project
* @param dueDate: Date - the due date of the project
* @param submissions: number - number of submissions for the project
* @param score: number - assigned score on the project
* @param isStudent: boolean - if the user is a student or a teacher
*/

export function AssignmentListItemSubjectsPage({key,projectName, dueDate, submissions, score, isStudent, visible}:AssignmentListItemSubjectsPageProps) {
    const navigate = useNavigate();
    const handleProjectClick = () => {
        console.log("Project clicked");
        navigate(`/${key}`)
    }

    return (
        <>
            <ListItem key={projectName} sx={{margin:0}} disablePadding={true}>
                <ListItemButton onClick={handleProjectClick} sx={{
                    width: "100%",
                    height: 30,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingX: 1,
                    paddingY: 3,
                    borderRadius:2,
                }}>
                    {isStudent?
                        <>
                            <ListItemText sx={{maxWidth:100}} primary={projectName}/>
                            <ListItemText sx={{maxWidth:110}} primary={dueDate? dueDate.toLocaleDateString() : t("no_deadline")}/>
                            <ListItemText sx={{maxWidth:100}} primary={submissions + " indieningen"}/>
                            <ListItemText sx={{maxWidth:50}} primary={score + "/20"}/>
                        </>
                        :
                        <>
                            <ListItemText sx={{maxWidth:100}} primary={projectName}/>
                            <ListItemText sx={{maxWidth:110}} primary={dueDate? dueDate.toLocaleDateString() : t("no_deadline")}/>
                            <ListItem sx={{maxWidth:110}}>
                                {visible?
                                    <IconButton edge="end" aria-label="visible">
                                        <VisibilityOutlinedIcon/>
                                    </IconButton>
                                    :
                                    <IconButton edge="end" aria-label="not-visible">
                                        <VisibilityOffOutlinedIcon/>
                                    </IconButton>
                                }
                                <IconButton edge="end" aria-label="archive">
                                    <ArchiveOutlinedIcon/>
                                </IconButton>
                                <IconButton edge="end" aria-label="delete">
                                    <DeleteOutlinedIcon/>
                                </IconButton>
                            </ListItem>
                        </>
                    }
                </ListItemButton>
            </ListItem>
            <Divider color={"text.main"}></Divider>
        </>
    );
}