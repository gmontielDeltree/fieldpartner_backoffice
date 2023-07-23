import { AppBar, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import React from 'react';
import { useAuthStore } from '../../hooks';

export interface NavBarProps {
    drawerWidth: number;
    open: boolean;
    handleSideBarOpen: () => void;
}

export const NavBar: React.FC = () => {

    const { startLogout } = useAuthStore();

    const onClickLogout = () => startLogout();


    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {/* <Typography variant="h6" noWrap component="div">
                    Fieldpartner
                </Typography> */}
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography variant='h6' noWrap component="h2">Fieldpartner</Typography>
                    <IconButton color='inherit' onClick={() => onClickLogout()}>
                        <LogoutOutlined />
                    </IconButton>
                </Grid>
            </Toolbar>
        </AppBar>
        // <AppBar
        //     position='fixed'
        //     sx={{
        //         ...(open && {
        //             width: { sm: `calc(100% - ${drawerWidth}px)` },
        //             ml: { sm: `${drawerWidth}px` }
        //         })
        //     }}
        // >
        //     <Toolbar>
        //         <IconButton
        //             color='inherit'
        //             edge="start"
        //             onClick={handleSideBarOpen}
        //             sx={{ mr: 2, ...(open && { display: 'none' }) }} >
        //             <MenuOutlined />
        //         </IconButton>

        //         <Grid
        //             container
        //             direction="row"
        //             justifyContent="space-between"
        //             alignItems="center">
        //             <Typography variant='h6' noWrap component="h2">FieldPartner</Typography>
        //             <IconButton color='inherit' onClick={() => onClickLogout()}>
        //                 <LogoutOutlined />
        //             </IconButton>
        //         </Grid>
        //     </Toolbar>
        // </AppBar>
    )
}
