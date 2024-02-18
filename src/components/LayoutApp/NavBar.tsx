import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import React from "react";
import { useAppSelector, useAuthStore } from "../../hooks";
import { Link as RouterLink } from "react-router-dom";
import { capitalizeText } from "../../helpers";

export interface NavBarProps {
  drawerWidth: number;
  open: boolean;
  handleSideBarOpen: () => void;
}

export const NavBar: React.FC = () => {
  const { startLogout } = useAuthStore();
  const { user } = useAppSelector((state) => state.auth);

  const onClickLogout = () => startLogout();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            color="white"
            fontSize={25}
            sx={{ textDecoration: "none" }}
            to="/home"
            noWrap
            component={RouterLink}
          >
            Fieldpartner
          </Typography>
          <Typography variant="h6" noWrap component="h2">
            Backoffice
          </Typography>

          <Box display="flex" alignItems="center">
            <Typography variant="body1" noWrap component="h5">
              {user && capitalizeText(user.firstName)}
            </Typography>
            <IconButton color="inherit" onClick={() => onClickLogout()}>
              <LogoutOutlined />
            </IconButton>
          </Box>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
