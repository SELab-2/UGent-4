import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/loginPage/LoginPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import {MainPage} from "./pages/mainPage/MainPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <React.Suspense fallback={<div>Loading...</div>}>
            <ThemeProvider theme={theme}>
              <RouterProvider router={router} />
            </ThemeProvider>
        </React.Suspense>
  </React.StrictMode>
);
