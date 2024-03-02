import { ItemList } from "../../components/ItemList";
import { Box } from "@mui/material";

const items = [
    { opdracht: 'Task 1', deadline: '2024-03-15', status: 'In progress', score: '80%' },
    { opdracht: 'Task 2', deadline: '2024-03-20', status: 'Completed', score: '100%' },
    { opdracht: 'Task 3', deadline: '2024-03-25', status: 'Not started', score: 'N/A' },
    { opdracht: 'Task 1', deadline: '2024-03-15', status: 'In progress', score: '80%' },
    { opdracht: 'Task 2', deadline: '2024-03-20', status: 'Completed', score: '100%' },
    { opdracht: 'Task 3', deadline: '2024-03-25', status: 'Not started', score: 'N/A' },
    { opdracht: 'Task 1', deadline: '2024-03-15', status: 'In progress', score: '80%' },
    { opdracht: 'Task 2', deadline: '2024-03-20', status: 'Completed', score: '100%' },
    { opdracht: 'Task 3', deadline: '2024-03-25', status: 'Not started', score: 'N/A' },
    { opdracht: 'Task 1', deadline: '2024-03-15', status: 'In progress', score: '80%' },
    { opdracht: 'Task 2', deadline: '2024-03-20', status: 'Completed', score: '100%' },
    { opdracht: 'Task 3', deadline: '2024-03-25', status: 'Not started', score: 'N/A' },
    { opdracht: 'Task 1', deadline: '2024-03-15', status: 'In progress', score: '80%' },
    { opdracht: 'Task 2', deadline: '2024-03-20', status: 'Completed', score: '100%' },
    { opdracht: 'Task 3', deadline: '2024-03-25', status: 'Not started', score: 'N/A' },
    { opdracht: 'Task 1', deadline: '2024-03-15', status: 'In progress', score: '80%' },
    { opdracht: 'Task 2', deadline: '2024-03-20', status: 'Completed', score: '100%' },
    { opdracht: 'Task 3', deadline: '2024-03-25', status: 'Not started', score: 'N/A' },
];

export function SubjectsStudentPage() {
    return (
        <>
            {/* <Header variant={"variant-2"} username={"testuser"} title={"Naam vak"}/> */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ width: '80%'}}>
                    <ItemList itemList={items} />
                </Box>
            </Box>
        </>
    );
}
