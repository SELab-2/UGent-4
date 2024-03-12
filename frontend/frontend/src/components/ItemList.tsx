import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,useTheme, ThemeProvider } from '@mui/material';
import theme from '../Theme';

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
            <TableCell style={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>Opdracht</TableCell>
            <TableCell style={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>Deadline</TableCell>
            <TableCell style={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>Status</TableCell>
            <TableCell style={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>Score</TableCell>
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