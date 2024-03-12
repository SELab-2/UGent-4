import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";

import {MainPage} from "./pages/mainPage/MainPage.tsx";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {SubjectsStudentPage} from "./pages/subjects_page/SubjectsStudentPage.tsx";

import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';

import {SimpleRequestsPage} from "./pages/simpleRequestsPage/SimpleRequestsPage.tsx";



const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/subjects_student",
        element: <SubjectsStudentPage/>,
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <RouterProvider router={router}/>
                    </LocalizationProvider>
                </ThemeProvider>
            </React.Suspense>
        </HelmetProvider>
    </React.StrictMode>
);
