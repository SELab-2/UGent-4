import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material'
import theme from './Theme.ts'
import './i18n/config.ts'
import { RouterProvider } from 'react-router-dom'
import {
    AuthenticationResult,
    EventMessage,
    EventType,
    InteractionRequiredAuthError,
    PublicClientApplication,
} from '@azure/msal-browser'
import { msalConfig } from './authConfig/authConfig.ts'

import { Helmet, HelmetProvider } from 'react-helmet-async'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs'

import router from './routes.tsx'
import instance from './axiosConfig.ts'

/**
 * MSAL should be instantiated outside the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const msalInstance = new PublicClientApplication(msalConfig)

// Default to using the first account if no account is active on page load
if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(
        msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0]
    )
}


// Listen for sign-in event and set active account
msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
        // Cast event.payload to AuthenticationResult to access the account property
        console.log('login success')
        const authResult = event.payload as AuthenticationResult
        if (authResult.account) {
            const account = authResult.account
            msalInstance.setActiveAccount(account)
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HelmetProvider>
            <Helmet>
                <style>{`body { background-color: ${theme.palette.background.default}; }`}</style>
            </Helmet>

            <React.Suspense fallback={<div>Loading...</div>}>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <RouterProvider router={router} />
                    </LocalizationProvider>
                </ThemeProvider>
            </React.Suspense>
        </HelmetProvider>
    </React.StrictMode>
)
