import {ListItem, ListItemText, ListItemIcon, ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import {t} from "i18next";
interface SubmissionListItemTeacherPageProps {
    id: string;
    studentName: string;
    submitted?: Date;
    score: number;
}

/*
* This component is used to display a single submission in the list of submissions
* @param id: string - the id of the student
* @param studentName: string - the name of the student
* @param submitted: Date - the due date of the submission. empty when the student hasn't submitted yet
* @param score: number - assigned score on the project
*/

export function SubmissionListItemTeacherPage({id, studentName, submitted, score}:SubmissionListItemTeacherPageProps) {
    const navigate = useNavigate();

    const handleStudentDownloadClick = () => {
        console.log("Submission download clicked");
        navigate(`/${id}/download/`)
    }
    const handleSubmissionClick = () => {
        console.log("Submission clicked");
        navigate(`/${id}`) // naar submission page
    }

    return (
        <>
            <ListItem id={studentName}sx={{ margin: 0 }} disablePadding={true}>
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
                    <ListItemText
                        sx={{
                            maxWidth: 10,
                            color: "primary.main",
                            "&:hover": {
                                color: "primary.light",
                            },
                        }}
                        primary={studentName}
                    />
                    <ListItemText sx={{ maxWidth: 40 }} primary={submitted ? submitted.toLocaleDateString() : t("time")} />
                    <ListItemText sx={{ maxWidth: 50 }} primary={submitted ? score + "/20" : "-"} />
                    <ListItemIcon sx={{ minWidth: 35 }}>
                        {submitted ? (
                            <DownloadIcon
                                onClick={handleStudentDownloadClick}
                                sx={{
                                    color: "primary.main",
                                    "&:hover": {
                                        color: "primary.light",
                                    },
                                }}
                            />
                        ) : (
                            <DownloadIcon sx={{ color: "gray" }} />
                        )}
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            {/*<Divider color={"text.main"} />*/}
        </>
    );
}