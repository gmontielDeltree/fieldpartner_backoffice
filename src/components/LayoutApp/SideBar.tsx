import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  SyncAlt as SyncAltIcon,
  Inventory as InventoryIcon,
  Yard as YardIcon
} from "@mui/icons-material";




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
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        sx={{
          width: drawerWidth,
          display: { xs: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
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
          <ListItem key="customer" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/list-customer"
              selected={pathname.includes("list-customer")}
            >
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItemButton>
          </ListItem>
          <ListItem key="users-backoffice" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/list-user"
              selected={pathname.includes("list-user")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Usuarios Backoffice" />
            </ListItemButton>
          </ListItem>
          <ListItem key="categories" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/categories"
              selected={pathname.includes("categories")}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Categorías" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Tipos Movimientos" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/type-movement"
              selected={pathname.includes("type-movement")}
            >
              <ListItemIcon>
                <SyncAltIcon />
              </ListItemIcon>
              <ListItemText primary="Tipos Movimientos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Tipos Insumos" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/type-supplies"
              selected={pathname.includes("type-supplies")}
            >
              <ListItemIcon>
                <InventoryIcon/>
              </ListItemIcon>
              <ListItemText primary="Tipos Insumos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Cultivos" disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/crops"
              selected={pathname.includes("crops")}
            >
              <ListItemIcon>
                <YardIcon/>
              </ListItemIcon>
              <ListItemText primary="Cultivos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="settings" disablePadding>
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
    </Box>
  );
};
