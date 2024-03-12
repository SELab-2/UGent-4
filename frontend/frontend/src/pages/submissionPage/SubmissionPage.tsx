import Grid2 from "@mui/material/Unstable_Grid2";
import {Header} from "../../components/Header.tsx";
import {useParams} from "react-router-dom";
import {t} from "i18next";
import {useEffect, useState} from "react";
import {Box, Button, Card, Divider, ListItem, Paper, Typography} from "@mui/material";
import dayjs, {Dayjs} from "dayjs";
import DownloadIcon from '@mui/icons-material/Download';
import List from "@mui/material/List";

interface Submission {
    //Dayjs is present in pull request for mainpage
    deadline: Dayjs;
    projectName: string;
    assignment: string;
    filename: string;
    restrictions: { name: string, value: string, artifact?: string }[];
}


export function SubmissionPage() {
    const {project} = useParams();
    const [submission, setSubmission] = useState({
        deadline: dayjs(),
        projectName: "",
        assignment: "",
        filename: "",
        restrictions: []
    } as Submission);

    const downloadArtifact = (artifact: string) => {
        fetch(`/api/submissions/${project}/${artifact}`)
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = artifact;
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }

    const downloadSubmission = () => {
        fetch(`/api/submissions/${project}`)
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = project + "_submission.zip";
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }

    //TODO: fetch submission data from backend
    useEffect(() => {
        // fetch(`/api/submissions/${project}`)
        //     .then(res => res.json())
        //     .then(data => setSubmission(data));
        setSubmission({
            deadline: dayjs(),
            projectName: "project",
            assignment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Pretium lectus quam id leo in vitae. A scelerisque purus semper eget. Porttitor leo a diam sollicitudin. Ornare massa eget egestas purus viverra accumsan in nisl nisi. Nunc lobortis mattis aliquam faucibus purus in. Orci dapibus ultrices in iaculis nunc sed. Morbi enim nunc faucibus a pellentesque sit amet. Quam quisque id diam vel quam elementum pulvinar. Quis commodo odio aenean sed adipiscing diam donec adipiscing tristique. Egestas maecenas pharetra convallis posuere morbi leo urna. At varius vel pharetra vel turpis nunc eget lorem. Eleifend donec pretium vulputate sapien. Sit amet cursus sit amet. Lectus quam id leo in. Neque vitae tempus quam pellentesque nec nam. Metus aliquam eleifend mi in nulla. Faucibus turpis in eu mi. Sed vulputate odio ut enim blandit volutpat.\n" +
                "\n" +
                "Quis varius quam quisque id diam vel quam elementum pulvinar. Viverra vitae congue eu consequat. Amet aliquam id diam maecenas ultricies mi eget mauris. Mi proin sed libero enim sed. Etiam tempor orci eu lobortis elementum nibh tellus molestie nunc. Orci a scelerisque purus semper eget. Magna fermentum iaculis eu non diam phasellus vestibulum lorem. Eu nisl nunc mi ipsum. Augue eget arcu dictum varius duis at consectetur lorem. Aenean vel elit scelerisque mauris pellentesque. Elit duis tristique sollicitudin nibh.\n" +
                "\n" +
                "Amet consectetur adipiscing elit ut aliquam. Amet aliquam id diam maecenas ultricies. Tellus in metus vulputate eu scelerisque felis imperdiet proin fermentum. Cursus euismod quis viverra nibh cras pulvinar mattis nunc sed. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Quam elementum pulvinar etiam non quam lacus. At imperdiet dui accumsan sit amet nulla facilisi morbi. Accumsan sit amet nulla facilisi. Enim praesent elementum facilisis leo vel fringilla. Quisque id diam vel quam elementum. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Volutpat est velit egestas dui id ornare arcu odio ut. Tellus in metus vulputate eu scelerisque felis imperdiet proin fermentum. Velit ut tortor pretium viverra suspendisse.\n" +
                "\n" +
                "Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Volutpat commodo sed egestas egestas fringilla phasellus faucibus. Lorem sed risus ultricies tristique nulla aliquet enim. Donec ultrices tincidunt arcu non sodales neque sodales ut. Volutpat est velit egestas dui id. Egestas erat imperdiet sed euismod. Egestas pretium aenean pharetra magna. Nunc consequat interdum varius sit amet. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis. Viverra mauris in aliquam sem fringilla ut morbi tincidunt. Vitae congue eu consequat ac felis donec et odio pellentesque. Volutpat odio facilisis mauris sit amet massa vitae. Tellus mauris a diam maecenas. Eget gravida cum sociis natoque penatibus et magnis dis parturient. Diam quis enim lobortis scelerisque. Ut venenatis tellus in metus vulputate. Et malesuada fames ac turpis. A cras semper auctor neque vitae tempus quam. Sed viverra tellus in hac. Mattis enim ut tellus elementum sagittis vitae et.\n" +
                "\n" +
                "Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Gravida dictum fusce ut placerat orci nulla pellentesque. Vel facilisis volutpat est velit egestas dui id ornare arcu. Et ligula ullamcorper malesuada proin libero nunc consequat. A arcu cursus vitae congue. Feugiat scelerisque varius morbi enim nunc faucibus a. Velit dignissim sodales ut eu sem. Vestibulum mattis ullamcorper velit sed. Volutpat commodo sed egestas egestas fringilla phasellus. Libero justo laoreet sit amet cursus sit amet. In est ante in nibh mauris cursus mattis molestie a. Euismod elementum nisi quis eleifend quam adipiscing vitae proin. Cursus in hac habitasse platea dictumst quisque sagittis purus.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Parturient montes nascetur ridiculus mus mauris vitae. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Enim praesent elementum facilisis leo vel fringilla est. Euismod quis viverra nibh cras. Enim ut tellus elementum sagittis. Nisl nisi scelerisque eu ultrices. A erat nam at lectus urna duis convallis. Viverra nam libero justo laoreet sit amet cursus sit. Id aliquet risus feugiat in ante. Amet commodo nulla facilisi nullam. Accumsan lacus vel facilisis volutpat est velit egestas. Nibh nisl condimentum id venenatis. Sagittis eu volutpat odio facilisis mauris. Et magnis dis parturient montes nascetur ridiculus mus mauris vitae. Aliquam nulla facilisi cras fermentum odio eu feugiat. Quis enim lobortis scelerisque fermentum dui faucibus in. At ultrices mi tempus imperdiet.\n" +
                "\n" +
                "Felis imperdiet proin fermentum leo vel. Luctus accumsan tortor posuere ac ut. Tellus cras adipiscing enim eu. Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Enim nec dui nunc mattis enim. Felis eget nunc lobortis mattis aliquam faucibus. Eget velit aliquet sagittis id consectetur purus ut faucibus. Eget egestas purus viverra accumsan in. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Sit amet facilisis magna etiam. Consectetur libero id faucibus nisl tincidunt eget nullam non nisi. Aliquet eget sit amet tellus cras adipiscing. Justo eget magna fermentum iaculis. Volutpat maecenas volutpat blandit aliquam. Scelerisque purus semper eget duis at tellus. Morbi tempus iaculis urna id volutpat. Nec ultrices dui sapien eget mi proin sed. Nibh tellus molestie nunc non blandit massa enim nec dui.\n" +
                "\n" +
                "Dolor sed viverra ipsum nunc aliquet bibendum. Egestas sed tempus urna et pharetra pharetra massa massa ultricies. Ut sem nulla pharetra diam sit amet nisl suscipit. Magna eget est lorem ipsum dolor sit. Consequat interdum varius sit amet mattis. Senectus et netus et malesuada fames ac turpis. Justo eget magna fermentum iaculis eu non diam. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Tempus imperdiet nulla malesuada pellentesque. Ornare quam viverra orci sagittis eu. Pellentesque nec nam aliquam sem. Semper viverra nam libero justo laoreet sit amet. A diam sollicitudin tempor id. Sed velit dignissim sodales ut eu sem integer vitae. Fermentum odio eu feugiat pretium nibh ipsum. Morbi tincidunt augue interdum velit euismod in pellentesque massa. Purus ut faucibus pulvinar elementum integer enim. Parturient montes nascetur ridiculus mus mauris vitae ultricies. Eu ultrices vitae auctor eu augue.\n" +
                "\n" +
                "Netus et malesuada fames ac turpis egestas sed tempus urna. Eget nunc scelerisque viverra mauris in aliquam. Feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Sollicitudin aliquam ultrices sagittis orci. Eleifend mi in nulla posuere sollicitudin aliquam. Non diam phasellus vestibulum lorem sed. Quis auctor elit sed vulputate mi sit amet. Id nibh tortor id aliquet lectus. Et netus et malesuada fames ac turpis egestas. Viverra orci sagittis eu volutpat odio facilisis mauris. Neque viverra justo nec ultrices dui sapien eget. Ut tristique et egestas quis ipsum suspendisse ultrices gravida dictum. Consectetur a erat nam at lectus urna duis. Condimentum mattis pellentesque id nibh tortor id aliquet. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Nunc sed id semper risus. Vitae auctor eu augue ut lectus. Sociis natoque penatibus et magnis. Odio pellentesque diam volutpat commodo sed egestas egestas. Sit amet nulla facilisi morbi tempus iaculis urna id volutpat.\n" +
                "\n" +
                "Nunc lobortis mattis aliquam faucibus purus. Quis vel eros donec ac odio tempor orci. Tempus egestas sed sed risus pretium quam vulputate. In hac habitasse platea dictumst vestibulum rhoncus. Aliquam ultrices sagittis orci a scelerisque purus semper eget duis. Diam phasellus vestibulum lorem sed risus ultricies tristique. Tincidunt eget nullam non nisi est sit. Habitant morbi tristique senectus et netus et malesuada. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Magna ac placerat vestibulum lectus mauris. Aliquet eget sit amet tellus cras adipiscing enim. A erat nam at lectus urna duis. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. A diam maecenas sed enim ut sem viverra aliquet. Nunc mi ipsum faucibus vitae aliquet.\n" +
                "\n" +
                "Leo urna molestie at elementum eu. Arcu cursus vitae congue mauris rhoncus aenean vel. Amet massa vitae tortor condimentum lacinia. Ut tristique et egestas quis. Neque gravida in fermentum et sollicitudin ac. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Non curabitur gravida arcu ac tortor dignissim convallis aenean. Aenean et tortor at risus viverra adipiscing. Amet commodo nulla facilisi nullam. Duis convallis convallis tellus id interdum velit laoreet id donec. Fames ac turpis egestas sed tempus urna et pharetra. Ac tincidunt vitae semper quis lectus nulla. Accumsan tortor posuere ac ut consequat semper viverra. Pretium fusce id velit ut tortor pretium viverra suspendisse potenti. Ultricies mi eget mauris pharetra et ultrices neque ornare aenean. Fames ac turpis egestas sed tempus urna.\n" +
                "\n" +
                "Elit ut aliquam purus sit amet. Placerat duis ultricies lacus sed turpis tincidunt id aliquet. Et malesuada fames ac turpis egestas integer. Ultrices dui sapien eget mi proin sed libero enim sed. Tristique nulla aliquet enim tortor at auctor urna. Scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis. Ornare quam viverra orci sagittis. Diam in arcu cursus euismod quis. Amet mauris commodo quis imperdiet massa. Malesuada fames ac turpis egestas. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Viverra orci sagittis eu volutpat odio facilisis mauris sit amet. Molestie at elementum eu facilisis sed odio. Turpis cursus in hac habitasse. Sodales ut etiam sit amet nisl purus in.\n" +
                "\n" +
                "Commodo odio aenean sed adipiscing diam donec adipiscing tristique risus. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Cras tincidunt lobortis feugiat vivamus at augue eget. Interdum posuere lorem ipsum dolor sit amet. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Elementum eu facilisis sed odio morbi quis. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Suscipit tellus mauris a diam maecenas. Aliquam ut porttitor leo a diam sollicitudin tempor id eu. Proin fermentum leo vel orci porta non pulvinar neque laoreet.\n" +
                "\n" +
                "Risus nec feugiat in fermentum posuere urna nec. Quis lectus nulla at volutpat diam ut venenatis. Sed cras ornare arcu dui. Quis commodo odio aenean sed adipiscing diam donec adipiscing. Fermentum dui faucibus in ornare quam viverra orci sagittis. Pellentesque dignissim enim sit amet venenatis urna cursus eget nunc. Massa eget egestas purus viverra. Imperdiet proin fermentum leo vel. Habitant morbi tristique senectus et netus et malesuada fames ac. Amet cursus sit amet dictum sit amet justo. Viverra justo nec ultrices dui sapien eget mi. A arcu cursus vitae congue mauris rhoncus.\n" +
                "\n" +
                "Ipsum dolor sit amet consectetur adipiscing. Augue neque gravida in fermentum et sollicitudin ac orci. Urna duis convallis convallis tellus. Nunc sed blandit libero volutpat. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin. Nunc id cursus metus aliquam eleifend mi in. Odio pellentesque diam volutpat commodo sed egestas egestas. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris. Enim nulla aliquet porttitor lacus. Nibh nisl condimentum id venenatis. Neque convallis a cras semper auctor neque vitae tempus. Dictum sit amet justo donec. At varius vel pharetra vel. Nisl pretium fusce id velit ut tortor pretium viverra. Tincidunt lobortis feugiat vivamus at augue eget arcu. Cras semper auctor neque vitae. Maecenas accumsan lacus vel facilisis volutpat est. Vulputate odio ut enim blandit. Sed turpis tincidunt id aliquet risus. Egestas purus viverra accumsan in nisl nisi.",
            filename: "filename",
            restrictions: [{name: "filetype", value: ".pdf, .zip",}, {
                name: "docker tests",
                value: "filename",
                artifact: "filename"
            }, {name: "max file size", value: "10MB"}, {name: "min file size", value: "1MB"}]
        });
    }, [project]);


    return (
        <>
            <Grid2 container spacing={2}>
                <Header variant={"not_main"} title={project + ": " + t("submission")}/>
                <Box sx={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    padding: 2,
                    gap: 2,
                    overflowY: "hidden"
                }}>
                    <Paper aria-label={"deadline"}
                           elevation={1}
                           sx={{
                               backgroundColor: "background.default",
                               padding: 1,
                               minWidth: 100,
                               maxWidth: 200,
                               display: "flex",
                               flexDirection: "row",
                               alignItems: "center",
                               gap: 2
                           }}
                    >
                        <Typography variant={"h6"} fontWeight={"bold"}>Deadline:</Typography>
                        <Typography variant={"body1"}
                        >{submission.deadline.format("DD/MM/YYYY")}</Typography>
                    </Paper>
                    <Card aria-label={'assignment-box'}
                          sx={{
                              width: "99 %",
                              backgroundColor: "background.default",
                              padding: 1,
                              paddingBottom: 3
                          }}>
                        <Typography variant={"h6"} fontWeight={"bold"} aria-label={"title"}>
                            {t("assignment")}
                        </Typography>
                        <Box maxHeight={"35vh"} sx={{padding: 3, overflowY: "auto"}}>
                            <Typography>{submission.assignment}</Typography>
                        </Box>
                    </Card>
                    <Box aria-label={'file-box'} color={"text.primary"}
                         sx={{
                             padding: 1,
                             display: "flex",
                             flexDirection: "row",
                             alignItems: "center",
                             backgroundColor: "background.default",
                             gap: 2
                         }}>
                        <Typography variant={"h6"} fontWeight={"bold"} aria-label={"title"} margin={0}>
                            {t("filename")}
                        </Typography>
                        <Button startIcon={<DownloadIcon/>} onClick={downloadSubmission}>
                            {submission.filename}
                        </Button>
                    </Box>
                    <Card aria-label={'restrictions'}
                          sx={{
                              padding: 1,
                              backgroundColor: "background.default",
                              width: "99 %",
                              height: "20vh",
                          }}>
                        <Typography variant={"h6"} fontWeight={"bold"}>{t("restrictions")}</Typography>
                        <Box sx={{padding: 1}}>
                            <List sx={{maxHeight: "13vh", overflowY: "auto"}}>
                                {
                                    submission.restrictions.map((restriction, index) => {
                                        return (
                                            <>
                                                <ListItem key={index} sx={{gap: 4, justifyContent: "space-between"}}>
                                                    <Typography variant={"body1"}
                                                                fontWeight={"bold"}>{restriction.name}</Typography>
                                                    {restriction.artifact &&
                                                        <Button
                                                            onClick={() => downloadArtifact(restriction.artifact !== undefined ? restriction.artifact : "")}
                                                            startIcon={<DownloadIcon/>}>Download artifact</Button>}
                                                    <Typography variant={"body1"}>{restriction.value}</Typography>
                                                </ListItem>
                                                <Divider/>
                                            </>
                                        );
                                    })
                                }
                            </List>
                        </Box>
                    </Card>
                </Box>
            </Grid2>
        </>
    );
}