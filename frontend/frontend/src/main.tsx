import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";

import {MainPage} from "./pages/mainPage/MainPage.tsx";
import {Helmet, HelmetProvider} from "react-helmet-async";
import { SubjectsStudentPage } from "./pages/subjectsPage/SubjectsStudentPage.tsx";
import { SubjectsTeacherPage } from "./pages/subjectsPage/SubjectsTeacherPage.tsx";


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
    path: "/subjects_teacher",
    element: <SubjectsTeacherPage />,
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
              <RouterProvider router={router} />
            </ThemeProvider>
        </React.Suspense>
      </HelmetProvider>
  </React.StrictMode>
);
