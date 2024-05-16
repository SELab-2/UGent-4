import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        include: [
            '@emotion/react',
            '@emotion/styled',
            '@mui/material/Tooltip', // Include other MUI components as needed
        ],
        exclude: [
            'chunk-LTJERZ23.js?v=fff2b904',
            'chunk-OLZKTZWI.js?v=fff2b904',
            'chunk-6ZDRAOHK.js?v=fff2b904',
            'chunk-BWG3R63Q.js?v=fff2b904',
            '@mui/material/Grid', // Exclude other MUI components as needed
        ],
    },
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['@emotion/babel-plugin'],
            },
        }),
    ],
})
