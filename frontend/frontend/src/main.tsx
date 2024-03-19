import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";

import {MainPage} from "./pages/mainPage/MainPage.tsx";
import {Helmet, HelmetProvider} from "react-helmet-async";

import {SubjectsStudentPage} from "./pages/SubjectsPage/SubjectsStudentPage.tsx";
import {SubjectsTeacherPage} from "./pages/SubjectsPage/SubjectsTeacherPage.tsx";
import {ProjectScoresPage} from "./pages/scoresPage/ProjectScoresPage.tsx";
import {AssignmentStudentPage} from "./pages/assignmentPage/assignmentStudentPage";
import {AssignmentTeacherPage} from "./pages/assignmentPage/assignmentTeacherPage.tsx";
import {GroupsPage} from "./pages/groupsPage/groupsPage.tsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';

import {SubmissionPage} from "./pages/submissionPage/SubmissionPage.tsx";
import {SimpleRequestsPage} from "./pages/simpleRequestsPage/SimpleRequestsPage.tsx";
import {AddChangeAssignmentPage} from "./pages/AddChangeAssignmentPage/AddChangeAssignmentPage.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/subjects_student/:courseId",
        element: <SubjectsStudentPage/>,
        errorElement: <ErrorPage/>,

    },
    {

        path: "/subjects_teacher/:courseId",
        element: <SubjectsTeacherPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/scores",
        element: <ProjectScoresPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/assignment_student",
        element: <AssignmentStudentPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/assignment_teacher",
        element: <AssignmentTeacherPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/groups",
        element: <GroupsPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/add_change_assignment",
        element: <AddChangeAssignmentPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/submission/:project",
        element: <SubmissionPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/test_requests",
        element: <SimpleRequestsPage/>,
        errorElement: <ErrorPage/>,

    }

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelmetProvider>
            <Helmet>
                <style>{`body { background-color: ${theme.palette.background.default}; }`}</style>
            </Helmet>

            <React.Suspense fallback={<div>Loading...</div>}>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <RouterProvider router={router}/>
                    </LocalizationProvider>
                </ThemeProvider>
            </React.Suspense>
        </HelmetProvider>
    </React.StrictMode>
);
