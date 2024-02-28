import React from 'react'
import ReactDOM from 'react-dom/client'
import {ThemeProvider} from "@mui/material";
import theme from './Theme.ts'
import "./i18n/config.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {LoginPage} from "./pages/login_page/LoginPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>,
        errorElement: <ErrorPage />
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
)
