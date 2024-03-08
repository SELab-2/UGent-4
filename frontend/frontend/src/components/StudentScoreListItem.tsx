import {ListItem, ListItemButton, ListItemText, Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {t} from "i18next";

interface StudentScoreListItemProps {
    key: string;
    studentName: string;
    submissionFiles: string[];
}

/*
* This component is used to display a single assignment in the list of assignments
* @param key: string - the key of the studentOnProject
* @param studentName: string - the name of the student
* @param submissionFiles: string[] - a list of all files submitted by this student
*/

export function StudentScoreListItem({key, studentName, submissionFiles}:StudentScoreListItemProps) {
    const navigate = useNavigate();
    const handleProjectClick = () => {
        console.log("Project clicked");
        navigate(`/${key}`)
    }

    return (
        <>
            <ListItem key={studentName} sx={{margin:0}} disablePadding={true}>
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
                    <>
                        <ListItemText sx={{maxWidth:100}} primary={studentName}/>
                        <ListItemText sx={{maxWidth:110}} primary={submissionFiles.length? submissionFiles.length + " indieningen" : "geen indieningen"}/>
                        <ListItemText sx={{maxWidth:100}} primary={"0/20"}/>
                        <ListItemText sx={{maxWidth:100}} primary={"download button"}/>
                    </>
                </ListItemButton>
            </ListItem>
            <Divider color={"text.main"}></Divider>
        </>
    );
}