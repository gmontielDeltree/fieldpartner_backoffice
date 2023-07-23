import { Theme, createTheme } from '@mui/material';

export const skyBlueTheme: Theme = createTheme({
    palette: {
        primary: {
            main: '#1964D2',
            light: '#6F9EE3',
        },
        secondary: {
            main: '#543884',
        },
        error: {
            main: '#ef5350',
        },
        // mode: 'dark'
    },
});