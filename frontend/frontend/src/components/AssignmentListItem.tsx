import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {useNavigate} from "react-router-dom";
import {t} from "i18next";
import { useState, useEffect } from "react";
import axios from "axios";

interface AssignmentListItemProps {
    id: string;
    projectName: string;
    dueDate?: Date;
    status: boolean;
    isStudent: boolean;
}

/*
* This component is used to display a single assignment in the list of assignments
* @param key: string - the key of the assignment
* @param projectName: string - the name of the project
* @param dueDate: Date - the due date of the project
* @param status: boolean - the status of the project
* @param isStudent: boolean - if the user is a student or a teacher
*/

export function AssignmentListItem({id, projectName, dueDate, status, isStudent}: AssignmentListItemProps) {
    const navigate = useNavigate();
    const [stat, setStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Make API request to fetch status
            const response = await axios.get(`https://sel2-4.ugent.be/api/projecten/${id}`);
            setStatus(response.data.status);
            setLoading(false);
          } catch (error) {
            const errorMessage = (error as Error).message;
            setError(errorMessage);
            setLoading(false);
          }
        };
    
        fetchData();
      }, [id]);

    const handleProjectClick = () => {
        console.log("Project clicked");
        navigate(`/${id}`)
    }

    return (
        <>
            <ListItem key={projectName} sx={{margin: 0}} disablePadding={true}>
                <ListItemButton onClick={handleProjectClick} sx={{
                    width: "100%",
                    height: 30,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingX: 1,
                    paddingY: 3,
                    borderRadius: 2,
                }}>
                    <ListItemText sx={{maxWidth: 100}} primary={projectName}/>
                    <ListItemText sx={{maxWidth: 110}}
                                  primary={dueDate ? dueDate.toLocaleDateString() : t("no_deadline")}/>
                    {isStudent && <ListItemIcon sx={{minWidth: 35}}>{status ?
                        <CheckCircleOutlineIcon sx={{color: "success.main"}}/> :
                        <HighlightOffIcon sx={{color: "error.main"}}/>}</ListItemIcon>}

                </ListItemButton>
            </ListItem>
        </>
    );
}