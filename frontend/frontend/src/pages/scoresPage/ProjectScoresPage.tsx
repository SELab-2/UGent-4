import { Header } from "../../components/Header";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { StudentsView } from "./StudentsView.tsx";
import {t} from "i18next";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import instance from "../../axiosConfig.ts";
import WarningPopup from "../../components/WarningPopup.tsx";

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
    }

    const uploadScores = () => {
        console.log("upload scores");
    }

    const saveScores = async () => {
        console.log("save scores");

        for(const groep of groepen){
            const score = groep.score;
            console.log(score.score);
            try {
                await instance.put(`/scores/${score.score_id}/`, score);
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
                <WarningPopup title={t("edit_scores_warning")} content={t("everyone_can_see")}
                buttonName={t("confirm")} open={openSaveScoresPopup} handleClose={() => setOpenSaveScoresPopup(false)} doAction={saveScores}/>
                <WarningPopup title={t("undo_changes_warning")} content={t("cant_be_undone")}
                buttonName={t("confirm")} open={openDeleteScoresPopup} handleClose={() => setOpenDeleteScoresPopup(false)} doAction={deleteScores}/>
            </Stack>
        </>
    );
}