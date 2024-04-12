import {Divider, IconButton, ListItem, ListItemText, TextField} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { t } from "i18next";
import { useEffect, useState } from "react";
import instance from "../../axiosConfig";

interface Bestand {
    indiening_bestand_id: number,
    indiening: number,
    bestand: File | null,
 }

/*
* This component is used to display a single assignment in the list of assignments
* @param key: string - the key of the studentOnProject
* @param studentName: string - the name of the student
* @param submissionFiles: string[] - a list of all files submitted by this student
*/

export function StudentScoreListItem({key, groupNumber, studenten, lastSubmission, score, maxScore, changeScore}) {
    const [name, setName] = useState(t('group') + " " + groupNumber);

    useEffect(() => {
        async function fetchName() {
            if(studenten.length == 1){
                const studentId = studenten[0];
                const studentResponse = await instance.get(`/gebruikers/${studentId}/`);
                setName(studentResponse.data.first_name + " " + studentResponse.data.last_name);
            }
        }
        fetchName();
    }, [studenten]);

    const downloadSubmission = () => {
        try {
            instance.get(`/indieningen/${lastSubmission.indiening_id}/indiening_bestanden/`, {responseType: 'blob'}).then(
                res => {
                    let filename = 'lege_indiening.zip';
                    if (lastSubmission.indiening_bestanden.length > 0) {
                        filename = lastSubmission.indiening_bestanden[0].bestand.replace(/^.*[\\/]/, '');
                    }
                    const blob = new Blob([res.data], {type: res.headers['content-type']});
                    const file: File = new File([blob], filename, {type: res.headers['content-type']});
                    const url = window.URL.createObjectURL(file);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
        } catch(error) {
            console.error(error);
        }
    }
    
    return (
        <>
            <ListItem key={key} sx={{margin: 0}} disablePadding={true}>
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
                    <>
                        <ListItemText sx={{maxWidth: 200}} primary={name}/>
                        <ListItemText sx={{maxWidth: 300}}
                                      primary={lastSubmission? t("last_submission") + " " + new Date(lastSubmission.tijdstip).toLocaleString() : t("no_submissions")}/>
                        <ListItem sx={{maxWidth: 100}}>
                            {lastSubmission?
                                <>
                                    <TextField hiddenLabel defaultValue={score} onChange={(event) => changeScore(parseInt(event.target.value))}
                                    variant="filled" size="small"/>
                                    <ListItemText sx={{maxWidth: 100}} primary={"/" + maxScore}/>
                                </>
                            :
                                <ListItemText sx={{maxWidth: 100}} primary={"0/" + maxScore}/>
                            }
                        </ListItem>
                        <ListItem sx={{maxWidth: 100}}>
                            <IconButton onClick={downloadSubmission} edge="end" aria-label="download" disabled={lastSubmission == undefined}>
                                <DownloadIcon/>
                            </IconButton>
                        </ListItem>
                    </>
                </ListItem>
            </ListItem>
            <Divider color={"text.main"}></Divider>
        </>
    );
}