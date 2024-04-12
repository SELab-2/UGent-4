import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {useNavigate} from "react-router-dom";
import {t} from "i18next";

interface AssignmentListItemStudentPageProps {
    id: string;
    studentName: string;
    dueDate?: Date;
    status: boolean;
}

/*
* This component is used to display a single assignment in the list of assignments
* @param key: string - the key of the assignment
* @param projectName: string - the name of the project
* @param dueDate: Date - the due date of the project
* @param status: boolean - the status of the project
* @param isStudent: boolean - if the user is a student or a teacher
*/

export function AssignmentListItemStudentPage({id, studentName, dueDate, status, assignmentUrl}: AssignmentListItemStudentPageProps) {
    const navigate = useNavigate();
    const handleProjectClick = () => {
        console.log("Project clicked");
        navigate(`${assignmentUrl}${id}`)
    }

    return (
        <>
            <ListItem key={studentName} sx={{margin: 0}} disablePadding={true}>
                <ListItem sx={{
                    width: "100%",
                    height: 30,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingX: 1,
                    paddingY: 3,
                    borderRadius: 2,
                }}>
                    <ListItemText onClick={handleProjectClick} sx={{
                        maxWidth: 110,
                        color: 'primary.main',
                        '&:hover': {
                            color: 'primary.light',
                        },
                    }} primary={studentName}/>
                    <ListItemText sx={{maxWidth: 110}}
                                  primary={dueDate ? dueDate.toLocaleDateString() : t("no_deadline")}/>
                    <ListItemIcon sx={{minWidth: 35}}>
                        {status ?
                            (<CheckCircleOutlineIcon sx={{color: "success.main"}}/>) :
                            (<HighlightOffIcon sx={{color: "error.main"}}/>)
                        }
                    </ListItemIcon>
                </ListItem>
            </ListItem>
        </>
    );
}