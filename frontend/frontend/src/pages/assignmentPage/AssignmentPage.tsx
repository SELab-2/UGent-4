import {Header} from "../../components/Header.tsx";
import {SubmissionListItemStudentPage} from "../../components/SubmissionListItemStudentPage.tsx";
import {SubmissionListItemTeacherPage } from "../../components/SubmissionListItemTeacherPage.tsx";
import {Box, Button, Card, Divider, List, Stack, Typography} from "@mui/material";
import AddRestrictionButton from "./AddRestrictionButton.tsx";
import {t} from "i18next";
import instance from "../../axiosConfig.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const students = [
    {
      id: '1',
      name: 'Lucas',
      submitted: new Date(2024, 11, 17),
      score: 12,
    },
    {
      id: '3',
      name: 'Ethan',
      submitted: new Date(2024, 11, 19),
      score: 18,
    },
    {
      id: '5',
      name: 'Liam',
      submitted: undefined,
      score: 17,
    },
];

export function AssignmentPage() {
    let { courseId, assignmentId } = useParams();
    assignmentId = String(assignmentId);
    courseId = String(courseId);

    const [user, setUser] = useState({user: 0, is_lesgever: false, first_name: "", last_name: "", email: ""});
    const [assignment, setAssignment] = useState<any>();
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {           
                const userResponse = await instance.get("/gebruikers/me/");
                setUser(userResponse.data);
                const assignmentResponse = await instance.get(`/projecten/${assignmentId}/`);
                setAssignment(assignmentResponse.data);
                if (userResponse.data){
                    let submissionsResponse;
                    if (user.is_lesgever){
                        submissionsResponse = await instance.get(`/indieningen/?project=${assignmentId}`);
                    } else {
                        submissionsResponse = await instance.get(`/indieningen/?vak=${courseId}`);
                    }
                    setSubmissions(submissionsResponse.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [assignmentId]);
    
    return (
        <>
            {user.is_lesgever ? (
                <>
                    <Header variant={"not_main"} title={assignment ? assignment.titel : ""}></Header>
                    <Stack marginTop={15} direction={"column"} spacing={4}
                        sx={{ width: "100%", height: "100%", backgroundColor: "background.default" }}>

                        {/*deadline and groep button */}
                        <Box sx={{
                            padding: '20px',
                            backgroundColor: "background.default",
                        }}
                        >
                        <Typography variant="h6" color="text.primary"><strong>Deadline </strong>{assignment ? new Date(assignment.deadline) && new Date(assignment.deadline).toLocaleDateString() : "no deadline"}</Typography>
                        </Box>

                        {/*Opgave*/}
                        <Card elevation={1} sx={{
                                color: "text.primary",
                                padding: '20px',
                                backgroundColor: "background.default",
                                borderRadius: 5,
                            }}
                            >
                                <Stack direction={"column"}>
                                    <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>{t("assignment")}</Typography>
                                    <Typography>{assignment ? assignment.beschrijving : ""}</Typography>
                                </Stack>
                            </Card>

                            {/*Indieningen*/}
                            <Card elevation={1} sx={{
                                color: "text.primary",
                                backgroundColor: "background.default",
                                borderRadius: 5,
                                padding: '20px'
                                
                            }}
                            >
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                                    <Typography sx={{ fontWeight: 'bold' }}>Student</Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>{t("time")}</Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>Score</Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>{t("download")}</Typography>
                                </Box>
                                <Box style={{maxHeight: 300, overflow: 'auto'}}>
                                    <Divider color={"text.main"}></Divider>
                                    <List disablePadding={true} >
                                            {students.map((student) => (
                                                <Box key={student.id}>
                                                    <Divider color={"text.main"}></Divider>
                                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                                                    <SubmissionListItemTeacherPage
                                                        id={student.id} 
                                                        studentName={student.name}
                                                        submitted={student.submitted}
                                                        score={student.score}
                                                        />
                                                    </Box>
                                                </Box>
                                            ))}
                                    </List>
                                </Box>
                            </Card>

                            <AddRestrictionButton></AddRestrictionButton>

                            {/* <Button sx={{bgcolor: 'secondary.main'}}>
                                <AddIcon sx={{color: "secondary.contrastText"}}></AddIcon>
                            </Button> */}

                            {/*Upload knop*/}
                            <Box sx={{
                                    padding: '20px',
                                    backgroundColor: "background.default",
                                }}
                                >
                                    <Stack direction={"row"}>
                                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                                            <Typography color="secondary.contrastText">{t("export")} {t("submissions")}</Typography>
                                        </Button>
                                        <div style={{flexGrow: 1}}/>
                                        <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                                            <Typography color="secondary.contrastText">{t("adjust_scores")}</Typography>
                                        </Button>
                                    </Stack>
                                </Box>
                                    </Stack>
                                </>
            ) : (
                <>
                    <Header variant={"not_main"} title={assignment ? assignment.titel : ""}></Header>
                    <Stack marginTop={15} direction={"column"} spacing={4}
                        sx={{ width: "100%", height: "100%", backgroundColor: "background.default" }}>

                        {/*deadline and groep button */}
                        <Box sx={{
                            padding: '20px',
                            backgroundColor: "background.default",
                        }}
                        >
                            <Stack direction={"row"}>
                                <Typography variant="h6" color="text.primary"><strong>Deadline </strong>{assignment ? new Date(assignment.deadline) && new Date(assignment.deadline).toLocaleDateString() : "no deadline"}</Typography>
                                <div style={{flexGrow: 1}}/>
                                <Button sx={{bgcolor: 'secondary.main', textTransform: 'none'}}>
                                    <Typography color="secondary.contrastText">{t("group")}</Typography>
                                </Button>
                            </Stack>
                        </Box>

                        {/*Opgave*/}
                        <Card elevation={1} sx={{
                            color: "text.primary",
                            padding: '20px',
                            backgroundColor: "background.default",
                            borderRadius: 5,
                        }}
                        >
                            <Stack direction={"column"}>
                                <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>{t("assignment")}</Typography>
                                <Typography>{assignment ? assignment.beschrijving : ""}</Typography>
                            </Stack>
                        </Card>

                        {/*Indieningen*/}
                        <Card elevation={1} sx={{
                            color: "text.primary",
                            backgroundColor: "background.default",
                            borderRadius: 5,
                            padding: '20px'
                            
                        }}
                        >
                        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                            <Typography sx={{fontWeight: 'bold'}}>{t("submission")}</Typography>
                            <Typography sx={{fontWeight: 'bold'}}>{t("time")}</Typography>
                            <Typography sx={{fontWeight: 'bold'}}>Status</Typography>
                        </Box>
                        <Box style={{maxHeight: 300, overflow: 'auto'}}>
                            <Divider color={"text.main"}></Divider>
                            <List disablePadding={true} >
                                {submissions.map((submission) => (
                                    <Box key={submission.indiening_id}>
                                        <Divider color={"text.main"}></Divider>
                                        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} pl={3} pr={3}>
                                            <SubmissionListItemStudentPage id={submission.indiening_id} 
                                                                timestamp={new Date(submission.tijdstip)}
                                                                status={!!!submission.status}
                                            />
                                            </Box>
                                    </Box>
                                ))}
                            </List>
                        </Box>
                    </Card>

                        {/*Upload knop*/}
                        <Box sx={{
                            padding: '20px',
                            backgroundColor: "background.default",
                        }}
                        >
                            <Stack direction={"row"}>
                                <Button sx={{bgcolor: 'primary.main', textTransform: 'none'}}>
                                    <Typography color="primary.contrastText">{t("upload")}</Typography>
                                </Button>
                                <div style={{flexGrow: 1}}/>
                                <Button sx={{bgcolor: 'success.main', textTransform: 'none'}}>
                                    <Typography color="primary.contrastText">{t("submission")+" "+t("passed") }</Typography>
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </>
            )}
        </>
    );
}