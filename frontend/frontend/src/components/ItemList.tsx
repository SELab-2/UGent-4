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
                <TableHead id="head">
                    <TableRow>
                        <TableCell
                            id="opdracht"
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Opdracht
                        </TableCell>
                        <TableCell
                            id="deadline"
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Deadline
                        </TableCell>
                        <TableCell
                            id="status"
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Status
                        </TableCell>
                        <TableCell
                            id="score"
                            style={{
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Score
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody id="body">
                    {/* Map through itemList and render a TableRow for each item */}
                    {itemList.map((item, index) => (
                        <TableRow id={index.toString()} key={index}>
                            <TableCell id="opdracht">{item.opdracht}</TableCell>
                            <TableCell id="deadline">{item.deadline}</TableCell>
                            <TableCell id="status">{item.status}</TableCell>
                            <TableCell id="score">{item.score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
