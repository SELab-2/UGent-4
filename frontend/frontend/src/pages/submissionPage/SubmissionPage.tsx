import Grid2 from "@mui/material/Unstable_Grid2";
import {Header} from "../../components/Header.tsx";
import {useParams} from "react-router-dom";
import {t} from "i18next";
import {useEffect, useState} from "react";
import {Paper} from "@mui/material";
import {Dayjs} from "dayjs";

interface Submission {
    //Dayjs is present in pull request for mainpage
    deadline: Dayjs;
    projectName: string;
    assignment: string;
    filename: string;


}

export function SubmissionPage() {
    const {project} = useParams();
    const [submission, setSubmission] = useState({} as Submission);

    useEffect(() => {
        fetch(`/api/submissions/${project}`)
            .then(res => res.json())
            .then(data => setSubmission(data));
    }, [project]);


    return (
        <>
            <Grid2 container spacing={2}>
                <Header variant={"not_main"} title={project + t("submission")}/>
                <Paper aria-label={"deadline"} content={"Deadline: " + submission.deadline}/>
            </Grid2>
        </>
    );
}