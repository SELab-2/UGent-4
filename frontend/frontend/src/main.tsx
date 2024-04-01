import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";

import {MainPage} from "./pages/mainPage/MainPage.tsx";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import {LoginPage} from "./pages/loginPage/LoginPage.tsx";
import {SubjectsStudentPage} from "./pages/subjectsPage/SubjectsStudentPage.tsx";
import {AssignmentTeacherPage} from "./pages/assignmentPage/AssignmentTeacherPage.tsx";
import {AssignmentStudentPage} from "./pages/assignmentPage/AssignmentStudentPage.tsx";
import {SubmissionPage} from "./pages/submissionPage/SubmissionPage.tsx";
import {ProjectScoresPage} from "./pages/scoresPage/ProjectScoresPage.tsx";
import {SubjectsTeacherPage} from "./pages/subjectsPage/SubjectsTeacherPage.tsx";
import {AddChangeAssignmentPage} from "./pages/addChangeAssignmentPage/AddChangeAssignmentPage.tsx";

//TODO: add change/add course page when implemented
const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/',
        element: <MainPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_student/:courseId',
        element: <SubjectsStudentPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId',
        element: <SubjectsTeacherPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId/assignment/:assignmentId',
        element: <AssignmentTeacherPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_student/:courseId/assignment/:assignmentId',
        element: <AssignmentStudentPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_student/:courseId/assignment/:assignmentId/submission/:submissionId',
        element: <SubmissionPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId/assignment/:assignmentId/scoring',
        element: <ProjectScoresPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId/assignment/edit/:assignmentId?',
        element: <AddChangeAssignmentPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '*',
        element: <ErrorPage/>,
    },
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

/* old routes, to be deleted TODO: fix routes
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
        path: "/subjects_student",
        element: <SubjectsStudentPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/add_change_assignment",
        element: <addChangeAssignmentPage/>,
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
 */