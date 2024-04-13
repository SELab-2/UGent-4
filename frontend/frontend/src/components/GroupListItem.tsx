import {Card, ListItem, ListItemText, Select} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface GroupListItemProps {
    id: string;
    studentName: string;
    groupMemberNames: string[];
}

/*
* This component is used to display a single assignment in the list of assignments
* @param id: string - the id of the assignment
* @param studentName: string - the name of the student
* @param groupMemberNames: [string] the names of the groupmembers
*/

export function GroupListItem({id, studentName, groupMemberNames}: GroupListItemProps) {
    const navigate = useNavigate();

    return (
        <>
            <Card elevation={1} sx={{
                color: "text.primary",
                padding: 0,
                backgroundColor: "background.default",
                borderRadius: 5,
                margin: 1
            }}
            >
                <ListItem key={studentName} sx={{margin: 0}} disablePadding={true}>
                    <ListItem sx={{
                        width: "100%",
                        height: 30,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingX: 1,
                        paddingY: 3,
                        borderRadius: 2,
                    }}>
                        <ListItemText sx={{maxWidth: 100}} primary={studentName}/>
                        <Select>
                            <ListItemText
                                primary={groupMemberNames.join(", ")}/>
                        </Select>
                    </ListItem>
                </ListItem>
            </Card>
        </>
    );
}