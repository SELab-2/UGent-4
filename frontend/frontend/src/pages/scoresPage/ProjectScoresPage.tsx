import { Header } from "../../components/Header";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { StudentsView } from "./StudentsView.tsx";
import {t} from "i18next";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import instance from "../../axiosConfig.ts";

export function ProjectScoresPage() {
    let { assignmentId } = useParams();
    const projectId = Number(assignmentId);

    const [project, setProject] = useState<any>();

    const navigate = useNavigate();

    const exportSubmissions = () => {
        console.log("export submissions");
    }

    const uploadScores = () => {
        console.log("upload scores");
    }

    const saveScores = () => {
        console.log("save scores");
        navigate("/assignment_teacher");
    }

    const deleteScores = () => {
        console.log("delete scores");
        navigate("/assignment_teacher");
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
                <Header variant={"default"} title={"Project 1: Scores"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10, boxShadow: 3, borderRadius: 3 }}>
                    <StudentsView project={project} />
                </Box>
                <Box display="flex" flexDirection="row" sx={{ width: '100%', height:"30%", marginTop:5 }}>
                    <Box display="flex" flexDirection="row" sx={{ width: '50%', height:"auto" }}>
                        <Button onClick={exportSubmissions} variant="contained" color="secondary">{t("export_submissions")}</Button>
                        <Button onClick={uploadScores} variant="contained" color="secondary">{t("upload_scores")}</Button>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" sx={{ width: '50%', height:"auto" }}>
                        <Button onClick={saveScores} variant="contained" startIcon={<SaveIcon />}/>
                        <Button onClick={deleteScores} variant="contained" color="secondary" startIcon={<CloseIcon />}/>
                    </Box>
                </Box>
            </Stack>
        </>
    );
}