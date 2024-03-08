import {Header} from "../../components/Header.tsx";
import {Box, Stack} from "@mui/material";
import TabSwitcher from "../../components/TabSwitcher.tsx";
import {ArchivedView} from "./ArchivedView.tsx";
import {CoursesView} from "./CoursesView.tsx";
import {DeadlineCalendar} from "../../components/DeadlineCalendar.tsx";
import dayjs from "dayjs";

export function MainPage() {
    return (
        <>
            <Stack direction={"column"} spacing={10}
                   sx={{width: "100%", height: "100%", backgroundColor: "background.default"}}>
                <Header variant={"default"} title={"Naam Platform"}/>
                <Box sx={{
                    width: '100%',
                    height: "70%",
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <TabSwitcher titles={["current_courses", "archived"]}
                                 nodes={[<CoursesView isStudent={true}/>, <ArchivedView isStudent/>]}/>
                    <Box aria-label={"calendarView"} display={"flex"} flexDirection={"row"} alignContent={"center"}>
                        <DeadlineCalendar deadlines={[dayjs()]}/>
                    </Box>
                </Box>
            </Stack>
        </>
    );
}

//TODO: use api to check user role
function getRole(id: string): string {
    return "teacher";
}