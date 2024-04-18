import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import theme from '../Theme'
import { FC } from 'react'

// Define the structure of each item in the list
interface Item {
    opdracht: string
    deadline: string
    status: string
    score: string
}

interface ItemListProps {
    itemList: Item[] // Array of items to be displayed in the list
}

/**
 * Component to display a list of items in a table format.
 * @param itemList An array of items to be displayed in the table.
 */
export const ItemList: FC<ItemListProps> = ({ itemList }) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Opdracht
                        </TableCell>
                        <TableCell
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Deadline
                        </TableCell>
                        <TableCell
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Status
                        </TableCell>
                        <TableCell
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Score
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Map through itemList and render a TableRow for each item */}
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
    )
}
