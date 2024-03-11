import Grid2 from "@mui/material/Unstable_Grid2";
import {Header} from "../../components/Header.tsx";
import {useParams} from "react-router-dom";
import {t} from "i18next";
import {useEffect, useState} from "react";
import {Box, Card, Paper, Typography} from "@mui/material";
import dayjs, {Dayjs} from "dayjs";

interface Submission {
    //Dayjs is present in pull request for mainpage
    deadline: Dayjs;
    projectName: string;
    assignment: string;
    filename: string;


}

export function SubmissionPage() {
    const {project} = useParams();
    const [submission, setSubmission] = useState({
        deadline: dayjs(),
        projectName: "",
        assignment: "",
        filename: ""
    } as Submission);

    //TODO: fetch submission data from backend
    useEffect(() => {
        // fetch(`/api/submissions/${project}`)
        //     .then(res => res.json())
        //     .then(data => setSubmission(data));
        setSubmission({
            deadline: dayjs(),
            projectName: "project",
            assignment: "assignment",
            filename: "filename"
        });
    }, [project]);


    return (
        <>
            <Grid2 container spacing={2}>
                <Header variant={"not_main"} title={project + ": " + t("submission")}/>
                <Box sx={{marginTop: 12, display: "flex", flexDirection: "column", width: "100%", padding: 2, gap: 2}}>
                    <Paper aria-label={"deadline"}
                           elevation={1}
                           sx={{
                               backgroundColor: "background.default",
                               padding: 1,
                               minWidth: 100,
                               maxWidth: 200,
                               display: "flex",
                               flexDirection: "row",
                               alignItems: "center",
                               gap: 2
                           }}
                    >
                        <Typography variant={"h6"} fontWeight={"bold"}>Deadline:</Typography>
                        <Typography variant={"body1"}
                        >{submission.deadline.format("DD/MM/YYYY")}</Typography>
                    </Paper>
                    <Card aria-label={'assignment-box'}
                          sx={{width: "99 %", maxHeight: "70%", backgroundColor: "background.default", padding: 1}}>
                        <Typography variant={"h6"} fontWeight={"bold"} aria-label={"title"}>
                            {t("assignment")}
                        </Typography>
                        <Box maxHeight={"90%"} width={"100%"}>
                            <Typography>

                            </Typography>
                        </Box>
                    </Card>
                </Box>
            </Grid2>
        </>
    );
}