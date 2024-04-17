import {Header} from "../../components/Header.tsx";
import {useParams} from "react-router-dom";
import {t} from "i18next";
import {useEffect, useState} from "react";
import {Box, Button, Card, CircularProgress, Divider, ListItem, Paper, Typography} from "@mui/material";
import dayjs, {Dayjs} from "dayjs";
import DownloadIcon from '@mui/icons-material/Download';
import List from "@mui/material/List";
import Grid2 from "@mui/material/Unstable_Grid2";
import instance from "../../axiosConfig.ts";
import {getAssignment} from "../addChangeAssignmentPage/AddChangeAssignmentPage.tsx";
import ErrorPage from "../ErrorPage.tsx";

/**
 * Page for viewing a specific submission
 * The page should take the necessary data from the backend according to the id present in the url and the logged-in user
 * The page should display the deadline, the assignment, the filename and the restrictions of the submission
 * The page should also allow the user to download the submission and any restriction artifacts that are present
 */

enum SubmissionStatus {
    FAIL = -1,
    PENDING = 0,
    PASSED = 1
}

export interface Submission {
    indiening_id: number,
    groep: number,
    tijdstip: Dayjs,
    status: SubmissionStatus,
    result: string,
    indiening_bestanden: { indiening_bestand_id: number, bestand: string, indiening: number }[]
}

interface Restriction {
    restrictie_id: number,
    project: number,
    script: string,
    moet_slagen: boolean,
    artifact?: number,
}


export function SubmissionPage() {
    const {assignmentId, submissionId} = useParams() as {
        assignmentId: string,
        submissionId: string
    };
    const [submission, setSubmission] = useState<Submission>()
    const [project, setProject] = useState<getAssignment>()
    const [restrictions, setRestrictions] = useState<Restriction[]>([])
    const [fetchError, setFetchError] = useState(false);

    const downloadArtifact = (artifact: number) => {
        //TODO: artifacts are not yet implemented in the backend
        instance.get(`/api/submissions/${assignmentId}/${artifact}`, {responseType: 'blob'})
            .then(res => {
                const url = window.URL.createObjectURL(res.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = artifact.toString();
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }

    const downloadSubmission = () => {
        instance.get(`/indieningen/${submissionId}/indiening_bestanden/`, {responseType: 'blob'}).then(
            res => {
                let filename = 'indiening.zip';
                if (submission) {
                    filename = submission.indiening_bestanden[0].bestand.replace(/^.*[\\/]/, '');
                }
                const blob = new Blob([res.data], {type: res.headers['content-type']});
                const file: File = new File([blob], filename, {type: res.headers['content-type']});
                const url = window.URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        ).catch(err => {
            console.error(err);
            setFetchError(true);
        })
    }

    useEffect(() => {
        //get the project data
        instance.get<getAssignment>(`/projecten/${assignmentId}/`).then(
            res => {
                setProject(res.data);
            }
        ).catch(err => {
            console.error(err);
            setFetchError(true);
        })


        //get the restrictions for the submission
        //TODO: artifacts are not yet implemented in the backend
        instance.get<Restriction[]>(`/restricties/?project=${assignmentId}`).then(
            res => {
                setRestrictions(res.data);
            }
        ).catch(err => {
            console.error(err);
            setFetchError(true);
        })


    }, [assignmentId]);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const response = await instance.get('/indieningen/' + submissionId + '/');
                if (response.data.status === 0) {
                    setSubmission(response.data);
                    console.log('Data:', response.data);
                } else {
                    console.log('Status is not 0, stopping requests.');
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error('Error:', err);
                clearInterval(intervalId);
            }
        }, 2000); // 2000 milliseconds = 2 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [submissionId]);

    if (fetchError) {
        return <ErrorPage/>;
    }

    return (
        <>
            <Grid2 container spacing={2}>
                <Header variant={"not_main"} title={project?.titel + ": " + t("submission")}/>
                <Box sx={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    padding: 2,
                    gap: 2,
                    overflowY: "hidden"
                }}>
                    <Paper aria-label={"deadline"}
                           elevation={1}
                           sx={{
                               backgroundColor: "background.default",
                               padding: 1,
                               minWidth: 100,
                               maxWidth: 250,
                               display: "flex",
                               flexDirection: "row",
                               alignItems: "center",
                               gap: 2
                           }}
                    >
                        <Typography variant={"h6"} fontWeight={"bold"}>Deadline:</Typography>
                        <Typography variant={"body1"}>
                            {project?.deadline ? dayjs(project.deadline).format('DD/MM/YYYY HH:MM') : 'error'}</Typography>
                    </Paper>
                    <Card aria-label={'assignment-box'}
                          sx={{
                              width: "99 %",
                              backgroundColor: "background.default",
                              padding: 1,
                              paddingBottom: 3
                          }}>
                        <Typography variant={"h6"} fontWeight={"bold"} aria-label={"title"}>
                            {t("assignment")}
                        </Typography>
                        <Box maxHeight={"25vh"} sx={{padding: 3, overflowY: "auto"}}>
                            <Typography>{project?.beschrijving}</Typography>
                        </Box>
                    </Card>
                    <Box aria-label={'file-box'} color={"text.primary"}
                         sx={{
                             padding: 1,
                             display: "flex",
                             flexDirection: "row",
                             alignItems: "center",
                             backgroundColor: "background.default",
                             gap: 2
                         }}>
                        <Typography variant={"h6"} fontWeight={"bold"} aria-label={"title"} margin={0}>
                            {t("filename")}
                        </Typography>
                        <Button startIcon={<DownloadIcon/>} onClick={downloadSubmission}>
                            {submission ? submission.indiening_bestanden[0].bestand.replace(/^.*[\\/]/, '') : 'error'}
                        </Button>
                    </Box>
                    <Card aria-label={'restrictions'}
                          sx={{
                              padding: 1,
                              backgroundColor: "background.default",
                              maxWidth: "60%",
                              height: "20vh",
                          }}>
                        <Typography variant={"h6"} fontWeight={"bold"}>{t("restrictions")}</Typography>
                        <Box sx={{padding: 1}}>
                            <List sx={{maxHeight: "13vh", overflowY: "auto"}}>
                                {restrictions.length > 0 ?
                                    restrictions.map((restriction, index) => {
                                        return (
                                            <Box key={index}>
                                                <ListItem sx={{gap: 4, justifyContent: "space-between"}}>
                                                    <Typography variant={"body1"}
                                                                fontWeight={"bold"}>{restriction.script}</Typography>
                                                    <Typography
                                                        variant={"body1"}>{restriction.restrictie_id}</Typography>
                                                    <Typography
                                                        variant={"body1"}>{restriction.moet_slagen ? "Moet slagen" : "Mag falen"}</Typography>
                                                    {restriction.artifact &&
                                                        <Button
                                                            onClick={() => downloadArtifact(restriction.artifact ? restriction.artifact : 0)}
                                                            startIcon={<DownloadIcon/>}>Download artifact</Button>}
                                                </ListItem>
                                                <Divider/>
                                            </Box>
                                        );
                                    })
                                    :
                                    <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                                        <Typography fontWeight={'bold'}>{t("no_restrictions")}</Typography>
                                    </Box>
                                }
                            </List>
                        </Box>
                    </Card>
                    <Box aria-label={'result-box'} sx={{
                        padding: 1,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "background.default",
                        color: "text.primary",
                        gap: 2
                    }}>
                        <Box aria-label={'status-box'} sx={{
                            padding: 1,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "background.default",
                            color: "text.primary",
                            gap: 2
                        }}>
                            <Typography variant={"h6"} fontWeight={"bold"}>{t("status") + ":"}</Typography>
                            <Typography variant={"body1"}>
                                {submission?.status === SubmissionStatus.PENDING ? t("pending") :
                                    submission?.status === SubmissionStatus.PASSED ? t("passed") :
                                        t("failed")}
                            </Typography>
                        </Box>
                        <Card aria-label={'result-box'}
                              sx={{
                                  padding: 1,
                                  backgroundColor: "background.default",
                                  color: "text.primary",
                                  gap: 2,
                                  maxHeight: "15vh",
                              }}>
                            <Typography variant={"h6"} fontWeight={"bold"}>{t("result")}</Typography>
                            <Box sx={{padding: 1}}>
                                {submission?.status === SubmissionStatus.FAIL &&
                                    <Typography variant={"body1"} color={'error'}>{submission.result}</Typography>}
                                {submission?.status === SubmissionStatus.PASSED &&
                                    <Typography variant={"body1"} color={'success'}>{submission.result}</Typography>}
                                {submission?.status === SubmissionStatus.PENDING &&
                                    <CircularProgress color={'primary'}/>}
                            </Box>
                        </Card>

                    </Box>
                </Box>
            </Grid2>
        </>
    );
}