import {ListItem, ListItemIcon, ListItemText, ListItemButton} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {useNavigate} from "react-router-dom";
import {t} from "i18next";

interface SubmissionListItemStudentPageProps {
    id: string;
    timestamp?: Date;
    status: boolean;
    assignment_id: string;
    course_id: string;
}

/*
* This component is used to display a single submission in the list of submissions
* @param key: string - the key of the submission
* @param projectName: string - the name of the project
* @param timestamp: Date - the due date of the project
* @param status: boolean - the status of the project
* @param isStudent: boolean - if the user is a student or a teacher
*/

export function SubmissionListItemStudentPage({id, timestamp, status, assignment_id, course_id}: SubmissionListItemStudentPageProps) {
    const navigate = useNavigate();
    const handleSubmissionClick = () => {
        console.log("Submission clicked");
        if (id){
            navigate(`/course/${course_id}/assignment/${assignment_id}/submission/${id}`);
        }
    }

    return (
        <>
            <ListItem key={id} sx={{margin: 0}} disablePadding={true}>
                <ListItemButton 
                    sx={{
                        width: "100%",
                        height: 30,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingX: 1,
                        paddingY: 3,
                        borderRadius: 2,
                    }}
                    onClick={handleSubmissionClick}
                >
                    <ListItemText sx={{
                        maxWidth: 110,
                        color: 'primary.main',
                         '&:hover': {
                        color: 'primary.light',
                        },
                     }} primary={id}/>
                    <ListItemText sx={{maxWidth: 110}} primary={timestamp ? timestamp.toLocaleDateString() : t("time")}/>
                    <ListItemIcon sx={{minWidth: 35}}>
                        {status ?
                        (<CheckCircleOutlineIcon sx={{color: "success.main"}}/>) :
                        (<HighlightOffIcon sx={{color: "error.main"}}/>)
                        }
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        </>
    );
}