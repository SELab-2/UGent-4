import { Header } from "../../components/Header";
import { Box, Typography } from "@mui/material";

const Content = ({ }) => {
    return (
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: '80%', border: 1, borderRadius: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', p: 1 }}>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Opdrachten</Typography>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Deadline</Typography>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Status</Typography>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Score</Typography>
                </Box>
                {items.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', p: 1 }}>
                        <Typography sx={{ flex: 1 }}>{item.opdracht}</Typography>
                        <Typography sx={{ flex: 1 }}>{item.deadline}</Typography>
                        <Typography sx={{ flex: 1 }}>{item.status}</Typography>
                        <Typography sx={{ flex: 1 }}>{item.score}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

// Example usage:
const items = [
    { opdracht: 'Task 1', deadline: '2024-03-15', status: 'In progress', score: '80%' },
    { opdracht: 'Task 2', deadline: '2024-03-20', status: 'Completed', score: '100%' },
    { opdracht: 'Task 3', deadline: '2024-03-25', status: 'Not started', score: 'N/A' },
];


export function SubjectsStudentPage() {
    return (
        <Box
            sx={{ 
                display: 'flex', 
                minHeight: '100vh' 
                }}
        >
            <Header variant={"variant-2"} username={"testuser"} title={"Naam vak"}/>
            <Content></Content>
        </Box>
    );
}
