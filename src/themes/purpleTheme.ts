import { Theme, createTheme } from '@mui/material';
import { red } from '@mui/material/colors';


export const purpleTheme: Theme = createTheme({
    palette: {
        primary: {
            main: '#262254',
        },
        secondary: {
            main: '#543884',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#eeee'
        }
    },
    typography: {
        h2: {
            fontFamily: 'Raleway, Arial',
        }
    },
});