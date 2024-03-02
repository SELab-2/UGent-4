import { Box,Paper,TableContainer,Table,TableHead,TableRow,TableCell,TableBody } from '@mui/material';

interface Item {
    opdracht: string;
    deadline: string;
    status: string;
    score: string;
  }
  
  interface ItemListProps {
    itemList: Item[];
  }
  
  export const ItemList: React.FC<ItemListProps> = ({ itemList }) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Opdracht</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {itemList.map((item, index) => (
                <TableRow key={index}>
                    <TableCell>{item.opdracht}</TableCell>
                    <TableCell>{item.deadline}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.score}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
    );
  };