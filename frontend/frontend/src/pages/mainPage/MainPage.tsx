import {Header} from "../../components/Header.tsx";
import {Box, Button, Stack} from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ArchivedView} from "./ArchivedView.tsx";
import {CoursesView} from "./CoursesView.tsx";
import {DeadlineCalendar} from "../../components/DeadlineCalendar.tsx";
import dayjs from "dayjs";
import {t} from "i18next";
import {useEffect, useState} from "react";

/**
 * MainPage function component
 * This is the main page of the application.
 * It contains a header, a tab switcher for current and archived courses, a deadline calendar, and an admin button.
 */
export function MainPage() {
    // State for role
    const [role, setRole] = useState(getRole("1"));

    /**
     * useEffect hook to set the role of the user and log it
     */
    useEffect(() => {
        setRole(getRole("1"));
        console.log("current user is: " + role);
    }, []);

    return (
        <>
            <Stack direction={"column"} spacing={5}
                   sx={{width: "100%", height: "100%", backgroundColor: "background.default", paddingTop: 5}}>
                <Header variant={"default"} title={"Naam Platform"}/>
                <Box sx={{
                    width: '100%',
                    height: "80%",
                    marginTop: 10,
                    display: "flex",
                    flexDirection: {"md": "row", "xs": "column-reverse"},
                    gap: 5,
                }}>
                    <TabSwitcher titles={["current_courses", "archived"]}
                                 nodes={[<CoursesView isStudent={role == 'student'}/>,
                                     <ArchivedView isStudent={role == 'student'}/>]}/>
                    <Box aria-label={"calendarView"} display={"flex"} flexDirection={"row"} alignContent={"center"}
                         height={"50%"}>
                        <DeadlineCalendar deadlines={[dayjs()]}/>
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
                                aria-label={'admin-button'} sx={{margin: 5}}>{t('add_admin')}</Button>
                    </Box>}
            </Stack>
        </>
    );
}

//TODO: implement api integration
/**
 * Function to get the role of the user
 * @param {string} id - The id of the user
 * @returns {string} - The role of the user
 */
function getRole(id: string): string {
    return "teacher";
}