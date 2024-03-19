import { Header } from "../../components/Header";
import { Box, Button, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { StudentsView } from "./StudentsView.tsx";
import {t} from "i18next";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export function ProjectScoresPage() {
    let { projectId } = useParams();
    projectId = String(projectId);
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Project 1: Scores"} />
                <Box sx={{ width: '100%', height:"auto", marginTop:10, boxShadow: 3, borderRadius: 3 }}>
                    <StudentsView projectId={projectId} />
                </Box>
                <Box display="flex" flexDirection="row" sx={{ width: '100%', height:"auto", marginTop:10 }}>
                    <Box display="flex" flexDirection="row" sx={{ width: '50%', height:"auto" }}>
                        <Button variant="contained" color="secondary">{t("export_submissions")}</Button>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" sx={{ width: '50%', height:"auto" }}>
                        <Button variant="contained" startIcon={<SaveIcon />}/>
                        <Button variant="contained" color="secondary" startIcon={<CloseIcon />}/>
                    </Box>
                </Box>
            </Stack>
        </>
    );
}