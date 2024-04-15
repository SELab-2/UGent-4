import {Box, Button, Typography} from "@mui/material";
import {t} from "i18next";
import Switch from "@mui/material/Switch";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface GroupAccessComponentProps {
    assignmentid: number;
    courseid: number;
}


export function GroupAccessComponent({assignmentid, courseid}: GroupAccessComponentProps) {
    const navigate = useNavigate();
    const [allowGroups, setAllowGroups] = useState(false);

    const handleClick = () => {
        navigate(`/course/${courseid}/assignment/${assignmentid}/groups`);
    };

    useEffect(() => {
        //set max group size to 1 if groups are not allowed and register all students to a group of their own
    }, [allowGroups]);

    return (
        <>
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"20vw"}
                marginBottom={2}
            >
                {allowGroups ?

                    <Button variant={"contained"} disableElevation
                            onClick={handleClick}
                            color={"secondary"}>{t('groups')}</Button> :
                    <Typography color={'text.primary'} variant={"body1"}>{t('groups')}</Typography>}
                <Switch checked={allowGroups} onChange={() => setAllowGroups(!allowGroups)}
                        color={'primary'}/>
            </Box>
        </>
    );
}