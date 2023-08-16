import { AppBar, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import React from 'react';
import { useAuthStore } from '../../hooks';
import { Link as RouterLink } from 'react-router-dom';

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
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography
                        variant='h6'
                        color="white"
                        fontSize={25}
                        sx={{ textDecoration: 'none' }}
                        to="/home"
                        noWrap
                        component={RouterLink}>Fieldpartner</Typography>
                    <Typography variant='h6' noWrap component="h2">Backoffice</Typography>
                    <IconButton color='inherit' onClick={() => onClickLogout()}>
                        <LogoutOutlined />
                    </IconButton>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
