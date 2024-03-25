import {ListItem, ListItemText, Divider, ListItemIcon} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import {t} from "i18next";
interface AssignmentListItemTeacherPageProps {
    id: string;
    studentName: string;
    submitted?: Date;
    score: number;
}

/*
* This component is used to display a single assignment in the list of assignments
* @param id: string - the id of the student
* @param studentName: string - the name of the student
* @param submitted: Date - the due date of the submission. empty when the student hasn't submitted yet
* @param score: number - assigned score on the project
*/

export function AssignmentListItemTeacherPage({id,studentName,submitted, score}:AssignmentListItemTeacherPageProps) {
    const navigate = useNavigate();
    const handleStudentClick = () => {
        console.log("Project clicked");
        navigate(`/${id}`)
    }
    const handleStudentDownloadClick = () => {
        console.log("Project clicked");
        navigate(`/${id}/download/`)
    }

    return (
        <>
            <ListItem id={studentName} sx={{margin:0}} disablePadding={true}>
                <ListItem sx={{
                    width: "100%",
                    height: 30,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingX: 1,
                    paddingY: 3,
                    borderRadius:2,
                }}>
                    <ListItemText onClick={handleStudentClick} sx={{
                                                                    maxWidth: 10,
                                                                    color: 'primary.main',
                                                                    '&:hover': {
                                                                    color: 'primary.light',
                                                                    },
                                                                }} primary={studentName}/>
                    <ListItemText sx={{maxWidth:40}} primary={submitted? submitted.toLocaleDateString() : t("niet ingediend")}/>
                    <ListItemText sx={{maxWidth:50}} primary={submitted? score+ "/20": t("-")}/>
                    <ListItemIcon sx={{minWidth: 35}}>
                    {submitted  ? (
                            <DownloadIcon  onClick={handleStudentDownloadClick} 
                                sx={{ 
                                    color: 'primary.main',
                                    '&:hover': {
                                    color: 'primary.light',
                                    }
                                }} 
                                />
                            ) : (
                        <DownloadIcon sx={{ color: 'gray' }} />
                        )}
                    </ListItemIcon>
                </ListItem>
            </ListItem>
            <Divider color={"text.main"}></Divider>
        </>
    );
}