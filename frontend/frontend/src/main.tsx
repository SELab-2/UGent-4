import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.ts";
import "./i18n/config.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/loginPage/LoginPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import {MainPage} from "./pages/mainPage/MainPage.tsx";
import {Helmet} from 'react-helmet';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Helmet>
          <style>{`body { background-color: ${theme.palette.background.default}; }`}</style>
      </Helmet>
      <React.Suspense fallback={<div>Loading...</div>}>
            <ThemeProvider theme={theme}>
              <RouterProvider router={router} />
            </ThemeProvider>
        </React.Suspense>
  </React.StrictMode>
);
