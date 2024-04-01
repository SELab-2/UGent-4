import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AuthenticationResult, EventMessage, EventType, PublicClientApplication} from "@azure/msal-browser";
import {msalConfig} from "./authConfig/authConfig.ts";

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
import {SimpleRequestsPage} from "./pages/simpleRequestsPage/SimpleRequestsPage.tsx";
import {AddChangeSubjectPage} from "./pages/subjectsPage/AddChangeSubjectPage.tsx";
import {ProjectScoresPage} from "./pages/scoresPage/ProjectScoresPage.tsx";
import {SubjectsTeacherPage} from "./pages/subjectsPage/SubjectsTeacherPage.tsx";
import {AddChangeAssignmentPage} from "./pages/addChangeAssignmentPage/AddChangeAssignmentPage.tsx";
import {AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate} from "@azure/msal-react";

//TODO: add change/add course page when implemented
const router = createBrowserRouter([
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
        path: "/course_teacher/edit/:courseId?",
        element: <AddChangeSubjectPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: '*',
        element: <ErrorPage/>,
    },
]);

/**
 * MSAL should be instantiated outside the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0])
}


// Listen for sign-in event and set active account
msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
        // Cast event.payload to AuthenticationResult to access the account property
        console.log("login success");
        const authResult = event.payload as AuthenticationResult;
        if (authResult.account) {
            const account = authResult.account;
            msalInstance.setActiveAccount(account);
        }
    }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelmetProvider>
            <Helmet>
                <style>{`body { background-color: ${theme.palette.background.default}; }`}</style>
            </Helmet>

            <React.Suspense fallback={<div>Loading...</div>}>
                <MsalProvider instance={msalInstance}>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <AuthenticatedTemplate>
                                <RouterProvider router={router}/>
                            </AuthenticatedTemplate>
                            <UnauthenticatedTemplate>
                                <LoginPage/>
                            </UnauthenticatedTemplate>
                        </LocalizationProvider>
                    </ThemeProvider>
                </MsalProvider>
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
        path: "/add_change_assignment",
        element: <addChangeAssignmentPage/>,
        errorElement: <ErrorPage/>,

    },
    {
        path: "/add_change_subject",
        element: <AddChangeSubjectPage/>,
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
