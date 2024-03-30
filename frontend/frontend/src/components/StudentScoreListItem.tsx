import {Divider, IconButton, ListItem, ListItemText, TextField} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { t } from "i18next";

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

export function StudentScoreListItem({key, studentName, submissionFiles}: StudentScoreListItemProps) {
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
                    <>
                        <ListItemText sx={{maxWidth: 100}} primary={studentName}/>
                        <ListItemText sx={{maxWidth: 110}}
                                      primary={submissionFiles.length ? submissionFiles.length + " " + t("submissions") : t("no_submissions")}/>
                        <ListItem sx={{maxWidth: 100}}>
                            <TextField hiddenLabel defaultValue="0" variant="filled" size="small"/>
                            <ListItemText sx={{maxWidth: 100}} primary="/20"/>
                        </ListItem>
                        <ListItem sx={{maxWidth: 100}}>
                            <IconButton edge="end" aria-label="download">
                                <DownloadIcon/>
                            </IconButton>
                        </ListItem>
                    </>
                </ListItem>
            </ListItem>
            <Divider color={"text.main"}></Divider>
        </>
    );
}