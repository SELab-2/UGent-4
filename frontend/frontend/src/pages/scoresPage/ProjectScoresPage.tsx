import { Header } from "../../components/Header";
import { Box, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { StudentsView } from "./StudentsView.tsx";

export function ProjectScoresPage() {
    let { projectId } = useParams();
    projectId = String(projectId);
    return (
        <>
            <Stack direction={"column"} spacing={10} sx={{width:"100%" ,height:"100%", backgroundColor:"background.default"}}>
                <Header variant={"default"} title={"Project 1: Scores"} />
                <Box sx={{ width: '100%', height:"70%", marginTop:10, boxShadow: 3, borderRadius: 3 }}>
                    <StudentsView projectId={projectId} />
                </Box>
            </Stack>
        </>
    );
}