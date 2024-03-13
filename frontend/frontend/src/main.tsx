import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";

import {MainPage} from "./pages/mainPage/MainPage.tsx";
import {Helmet, HelmetProvider} from "react-helmet-async";
import { SubjectsStudentPage } from "./pages/subjects_page/SubjectsStudentPage.tsx";
import { AssignmentStudentPage } from "./pages/assignmentPage/assignmentStudentPage";
import { AssignmentTeacherPage } from "./pages/assignmentPage/assignmentTeacherPage.tsx";
import { GroupsPage } from "./pages/groupsPage/groupsPage.tsx";
import {SubjectsStudentPage} from "./pages/subjects_page/SubjectsStudentPage.tsx";
import {SubmissionPage} from "./pages/submissionPage/SubmissionPage.tsx";
import {SimpleRequestsPage} from "./pages/simpleRequestsPage/SimpleRequestsPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/subjects_student",
    element: <SubjectsStudentPage />,
  },
  {
    path: "/assignment_student",
    element: <AssignmentStudentPage />,
  },
  {
    path: "/assignment_teacher",
    element: <AssignmentTeacherPage/>,
  },
  {
    path: "/groups",
    element: <GroupsPage/>,
  },
   {
        path: "/subjects_student",
        element: <SubjectsStudentPage/>,
    },
    {

        path: "/submission/:project",
        element: <SubmissionPage/>,
    },
  {
        path: "/test_requests",
        element: <SimpleRequestsPage/>,
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
                    <RouterProvider router={router}/>
                </ThemeProvider>
            </React.Suspense>
        </HelmetProvider>
    </React.StrictMode>
);
