import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Group as GroupIcon,
  // List as ListIcon,
} from '@mui/icons-material';


export interface SideBarProps {
  drawerWidth: number;
  // open: boolean;
  // handleSideBarClose: () => void;
}
export const SideBar: React.FC<SideBarProps> = ({ drawerWidth }) => {

  const { pathname } = useLocation();

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        sx={{
          width: drawerWidth,
          display: { xs: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', },
        }}
        variant="permanent"
        anchor="left"
      // open={open}
      >
        <Toolbar />
        {/* <Box
          component="div"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ px: 0, py: 1.5 }}>
          <IconButton onClick={handleSideBarClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box> */}
        <Divider />
        <List>
          <ListItem key='customer' disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/customer"
              selected={pathname.includes("customer")}
            >
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItemButton>
          </ListItem>
          <ListItem key='settings' disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/settings"
              selected={pathname.includes("settings")}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuracion" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box >

  )
}
