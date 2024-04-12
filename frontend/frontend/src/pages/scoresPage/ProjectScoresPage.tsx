import {Header} from "../../components/Header";
import {Box, Button, Stack} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {StudentsView} from "./StudentsView.tsx";
import {t} from "i18next";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import instance from "../../axiosConfig.ts";
import WarningPopup from "../../components/WarningPopup.tsx";
import JSZip from 'jszip';

interface ScoreGroep {
    group: any,
    group_number: number,
    lastSubmission?: any,
    score?: any,
}

export function ProjectScoresPage() {
    let { courseId } = useParams();
    const vakId = Number(courseId);
    let { assignmentId } = useParams();
    const projectId = Number(assignmentId);

    const [openSaveScoresPopup, setOpenSaveScoresPopup] = useState(false);
    const [openDeleteScoresPopup, setOpenDeleteScoresPopup] = useState(false); 

    const [project, setProject] = useState<any>();
    const [groepen, setGroepen] = useState<ScoreGroep[]>([]); 

    const navigate = useNavigate();

    const exportSubmissions = () => {
        console.log("export submissions");
        downloadAllSubmissions();
    }

    const uploadScores = () => {
        console.log("upload scores");
    }

    const saveScores = async () => {
        console.log("save scores");

        for(const groep of groepen){
            const score = groep.score;
            console.log(score?.score);
            try {
                if(score.score_id !== undefined){
                    await instance.put(`/scores/${score.score_id}/`, score);
                } else {
                    await instance.post(`/scores/`, {
                        score: parseInt(groep.score.score),
                        indiening: parseInt(groep.lastSubmission.indiening_id),
                    });
                }
            } catch (error) {
                console.error("Error updating data:", error);
            }
        }

        navigate(`/course_teacher/${vakId}/assignment/${projectId}`);
    }

    const deleteScores = () => {
        console.log("delete scores");
        navigate(`/course_teacher/${vakId}/assignment/${projectId}`);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const assignmentResponse = await instance.get(`/projecten/${projectId}/`);
                setProject(assignmentResponse.data);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const downloadAllSubmissions = () => {
        const zip = new JSZip();
        const downloadPromises: Promise<void>[] = [];
        groepen.filter((groep) => groep.lastSubmission !== undefined)
        .map((groep) => groep.lastSubmission)
        .forEach((submission, index) => {
            downloadPromises.push(
                new Promise((resolve, reject) => {
                    instance.get(`/indieningen/${submission.indiening_id}/indiening_bestanden/`, { responseType: 'blob' }).then(res => {
                            let filename = 'lege_indiening_zip.zip';
                            if (submission.indiening_bestanden.length > 0) {
                                filename = submission.indiening_bestanden[0].bestand.replace(/^.*[\\/]/, '');
                            }
                            if (filename !== 'lege_indiening_zip.zip') {
                                zip.file(filename, res.data);
                            }
                            resolve();
                        }).catch(err => {
                            console.error(`Error downloading submission ${index + 1}:`, err);
                            reject(err);
                        });
                })
            );
        });
        Promise.all(downloadPromises).then(() => {
                zip.generateAsync({ type: "blob" }).then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'all_submissions.zip';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }).catch(err => {
                        console.error("Error generating zip file:", err);
                    });
        }).catch(err => {
            console.error("Error downloading submissions:", err);
        });
    };

    return (
        <>
            <Stack direction={"column"} spacing={0} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={project?.titel + ": Scores"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10, boxShadow: 3, borderRadius: 3 }}>
                    <StudentsView project={project} groepen={groepen} setGroepen={setGroepen}/>
                </Box>
                <Box display="flex" flexDirection="row" sx={{ width: '100%', height:"30%", marginTop:5 }}>
                    <Box display="flex" flexDirection="row" sx={{ width: '50%', height:"auto" }}>
                        <Button onClick={exportSubmissions} variant="contained" color="secondary">{t("export_submissions")}</Button>
                        <Button onClick={uploadScores} variant="contained" color="secondary">{t("upload_scores")}</Button>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" sx={{ width: '50%', height:"auto" }}>
                        <Button onClick={() => setOpenSaveScoresPopup(true)} variant="contained" startIcon={<SaveIcon />}/>
                        <Button onClick={() => setOpenDeleteScoresPopup(true)} variant="contained" color="secondary" startIcon={<CloseIcon />}/>
                    </Box>
                </Box>
                <WarningPopup title={t("edit_scores_warning")} content={t("visible_for_everyone")}
                buttonName={t("confirm")} open={openSaveScoresPopup} handleClose={() => setOpenSaveScoresPopup(false)} doAction={saveScores}/>
                <WarningPopup title={t("undo_changes_warning")} content={t("cant_be_undone")}
                buttonName={t("confirm")} open={openDeleteScoresPopup} handleClose={() => setOpenDeleteScoresPopup(false)} doAction={deleteScores}/>
            </Stack>
        </>
    );
}