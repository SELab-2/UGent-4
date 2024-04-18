import {Header} from "../../components/Header.tsx";
import {Box, Button, Stack} from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ArchivedView} from "./ArchivedView.tsx";
import {CoursesView} from "./CoursesView.tsx";
import {DeadlineCalendar} from "../../components/DeadlineCalendar.tsx";
import dayjs, {Dayjs} from "dayjs";
import {t} from "i18next";
import {useEffect, useState} from "react";
import instance from "../../axiosConfig.ts";
import {AxiosError, AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";

export default interface course {
    vak_id: number;
    naam: string;
    studenten: number[];
    lesgevers: number[];
}

export interface project {
    project_id: number;
    titel: string;
    beschrijving: string;
    opgave_bestand: File | null;
    vak_id: number;
    deadline: string;
    extra_deadline: string | null;
    max_score: number;
    max_groepsgrootte: number;
    zichtbaar: boolean;
    gearchiveerd: boolean;
}

/**
 * MainPage function component
 * This is the main page of the application.
 * It contains a header, a tab switcher for current and archived courses, a deadline calendar, and an admin button.
 */
export function MainPage() {
    // State for role
    const [role, setRole] = useState<string>('');
    const [courses, setCourses] = useState<course[]>([]);
    const [deadlines, setDeadlines] = useState<Dayjs[]>([]);
    const navigator = useNavigate();

    useEffect(() => {
        // Get the role of the person that has logged in
        console.log("requesting api")
        instance.get("/gebruikers/me/").then((response: AxiosResponse) => {
            console.log(response.data);
            setRole(response.data.is_lesgever ? "teacher" : "student");
        }).catch((e: AxiosError) => {
            console.error(e);
        });

        // Get the courses, their projects, and their respective deadlines
        async function fetchData() {
            try {
                const response = await instance.get<course[]>("/vakken/");
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }

            instance.get("/projecten/").then((response: AxiosResponse) => {
                const deadlines: Dayjs[] = [];
                response.data.forEach((project: project) => {
                        if (project.zichtbaar && !project.gearchiveerd) {
                            deadlines.push(dayjs(project.deadline, "YYYY-MM-DD-HH:mm:ss"));
                        }
                    }
                )
                console.log(deadlines);
                setDeadlines(deadlines);
            }).catch((e: AxiosError) => {
                console.error(e);
            });
        }

        fetchData().catch((e) => {
            console.error(e)
        });

    }, []);

    useEffect(() => {

    }, [courses]);


    return (
        <>
            <Stack direction={"column"} spacing={5}
                   sx={{width: "100%", height: "100%", backgroundColor: "background.default", paddingTop: 5}}>
                <Header variant={"default"} title={"Pigeonhole"}/>
                <Box sx={{
                    width: '100%',
                    height: "80%",
                    marginTop: 10,
                    display: "flex",
                    flexDirection: {"md": "row", "xs": "column-reverse"},
                    gap: 3,
                }}>
                    {/* Two tabs to select either the current or archived courses,
                    CoursesView is a scroll-box with the current courses, 
                    ArchivedView is the same but for the archived courses.  */}
                    <TabSwitcher titles={["current_courses", "archived"]}
                                 nodes={[<CoursesView isStudent={role == 'student'} activecourses={courses}/>,
                                     <ArchivedView isStudent={role == 'student'} archivedCourses={courses}/>]}/>
                    {/* Add a calendar to the right of the mainpage. */}
                    <Box aria-label={"calendarView"} display={"flex"} flexDirection={"row"} alignContent={"center"}
                         height={"50%"}>
                        <DeadlineCalendar deadlines={deadlines}/>
                    </Box>
                </Box>
                {role === "admin" &&
                    <Box sx={{
                        width: "100%",
                        height: "5%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "end"
                    }}>
                        <Button variant={'contained'} color={"secondary"}
                                on-click={() => navigator("/addTeacher")}
                                aria-label={'admin-button'} sx={{margin: 5}}>{t('add_teacher')}</Button>
                    </Box>}
            </Stack>
        </>
    );
}