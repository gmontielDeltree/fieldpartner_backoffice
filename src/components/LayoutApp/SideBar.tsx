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
  Person as PersonIcon,
  Category as CategoryIcon,
  SyncAlt as SyncAltIcon,
  Inventory as InventoryIcon,
  Yard as YardIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  DisplaySettings as DisplaySettingsIcon,
  List as ListIcon,
  SettingsInputAntenna as SettingsInputAntennaIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import 'semantic-ui-css/semantic.min.css';
import {
  RUTAS_USUARIOS,
  RUTAS_PAISES,
  RUTAS_LICENCIAS,
  RUTAS_CATEGORIAS,
  RUTAS_BASE,
  RUTAS_TIPOS_DISPOSITIVOS,
  RUTAS_TIPOS_MOVIMIENTOS,
  RUTAS_TIPOS_INSUMOS,
  RUTAS_CULTIVOS,
  RUTAS_SISTEMAS,
  RUTAS_MENUS_MODULOS,
  RUTAS_CUENTAS
} from "../../shared/constants";


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
          <ListItem key="users-backoffice" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_USUARIOS.LISTA}
              selected={pathname.includes("list-user")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Usuarios Backoffice" />
            </ListItemButton>
          </ListItem>
          <ListItem key="clientes" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_CUENTAS.LISTA}
              selected={pathname.includes("cuentas")}
            >
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Cuentas" />
            </ListItemButton>
          </ListItem>
          <ListItem key="paises" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_PAISES.LISTA}
              selected={pathname.includes("paises")}
            >
              <ListItemIcon>
                <PublicIcon />
              </ListItemIcon>
              <ListItemText primary="Países" />
            </ListItemButton>
          </ListItem>
          <ListItem key="licencias" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_LICENCIAS.LISTA}
              selected={pathname.includes("licencias")}
            >
              <ListItemIcon>
                <DisplaySettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Licencias" />
            </ListItemButton>
          </ListItem>
          <ListItem key="categories" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_CATEGORIAS.LISTA}
              selected={pathname.includes("categories")}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Categorías" />
            </ListItemButton>
          </ListItem>
          <ListItem key="type-of-devices" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_TIPOS_DISPOSITIVOS.LISTA}
              selected={pathname.includes("type-of-devices")}
            >
              <ListItemIcon>
                <SettingsInputAntennaIcon />
              </ListItemIcon>
              <ListItemText primary="Tipo de Dispositivos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="type-movement" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_TIPOS_MOVIMIENTOS.LISTA}
              selected={pathname.includes("type-movement")}
            >
              <ListItemIcon>
                <SyncAltIcon />
              </ListItemIcon>
              <ListItemText primary="Tipos Movimientos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="type-supplies" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_TIPOS_INSUMOS.LISTA}
              selected={pathname.includes("type-supplies")}
            >
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Tipos Insumos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="cultivos" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_CULTIVOS.LISTA}
              selected={pathname.includes("crops")}
            >
              <ListItemIcon>
                <YardIcon />
              </ListItemIcon>
              <ListItemText primary="Cultivos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="sistemas" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_SISTEMAS.LISTA}
              selected={pathname.includes("system")}
            >
              <ListItemIcon>
                <ComputerIcon />
              </ListItemIcon>
              <ListItemText primary="Sistemas" />
            </ListItemButton>
          </ListItem>
          <ListItem key="menus-modules" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_MENUS_MODULOS.LISTA}
              selected={pathname.includes("menus-modules")}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Menús y Módulos" />
            </ListItemButton>
          </ListItem>
          <ListItem key="settings" disablePadding>
            <ListItemButton
              component={RouterLink}
              to={RUTAS_BASE.SETTINGS}
              selected={pathname.includes("settings")}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};
