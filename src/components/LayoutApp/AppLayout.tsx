
import { Box, Toolbar } from '@mui/material';
import { NavBar } from './NavBar';
import { SideBar } from './SideBar';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const drawerWidth = 240; //Ancho del sidebar en px;



export interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {

    // const handleSideBarOpen = useCallback(() => {
    //     setOpen(true);
    // }, []);

    // const handleSideBarClose = useCallback(() => {
    //     setOpen(false);
    // }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <CssBaseline /> */}
            <NavBar />
            <SideBar drawerWidth={drawerWidth} />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}