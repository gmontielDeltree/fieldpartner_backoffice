import React, { useMemo } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "../components";
import {
  HomePage,
  UserPage,
  ListUserPage,
  SettingsPage,
  ListCategory,
  CategoryPage,
  ListMovementPage,
  MovementPage,
  ListSuppliesPage,
  SuppliesTypePage,
  ListCropsPage,
  NewCropsPage,
  // ListCountryPage,
  // NewCountryPage,
  ListSystemPage,
  NewSystemPage,
  // Nuevo módulo de Licencias
  ListaLicenciasPage,
  FormularioLicenciaPage,
  MigracionLicenciasPage,
  // Nuevo módulo de Clientes (reemplaza Accounts)
  // ListaClientesPage,
  // CrearClientePage,
  // DetalleClientePage,
  // Nuevo módulo de Países (reemplaza Country legacy)
  // ListaPaisesPage,
  ListaPaisesSimplePage,
  PaisesTestPage,
  // Módulos restantes
  ListMenuModulesPage,
  NewMenuModulesPage,
  ListaCuentasPage,
  CrearCuentaPage,
  DetalleCuentaPage,
  ListTypeDevicesPage,
  NewTypeDevicesPage,
  AccountPage,
} from "../pages";

// Importar constantes de rutas centralizadas
import {
  RUTAS_BASE,
  RUTAS_USUARIOS,
  // RUTAS_CLIENTES,
  RUTAS_CUENTAS,
  RUTAS_PAISES,
  RUTAS_LICENCIAS,
  RUTAS_CATEGORIAS,
  RUTAS_TIPOS_MOVIMIENTOS,
  RUTAS_TIPOS_INSUMOS,
  RUTAS_CULTIVOS,
  RUTAS_SISTEMAS,
  RUTAS_TIPOS_DISPOSITIVOS,
  RUTAS_MENUS_MODULOS
} from "../shared/constants/routes";



export const PrivateRoutes: React.FC = () => {

  const { pathname, search } = useLocation();

  const lastPath = useMemo(() => pathname + search, [pathname, search]);
  localStorage.setItem("lastPath_bo", lastPath);

  return (
    <AppLayout key="app-layout">
      <Routes>
        {/* Rutas base */}
        <Route path={RUTAS_BASE.HOME} element={<HomePage />} />
        <Route path={RUTAS_BASE.SETTINGS} element={<SettingsPage />} />

        {/* Rutas de usuarios backoffice */}
        <Route path={RUTAS_USUARIOS.NUEVO} element={<UserPage />} />
        <Route path={RUTAS_USUARIOS.DETALLE} element={<UserPage />} />
        <Route path={RUTAS_USUARIOS.LISTA} element={<ListUserPage />} />

        {/* Rutas del módulo de Clientes */}
         <Route path={RUTAS_CUENTAS.LISTA} element={<ListaCuentasPage />} />
        <Route path={RUTAS_CUENTAS.CREAR} element={<CrearCuentaPage />} />
        <Route path={RUTAS_CUENTAS.DETALLE} element={<DetalleCuentaPage />} />

        {/* Rutas del módulo de Países */}
        <Route path={RUTAS_PAISES.LISTA} element={<ListaPaisesSimplePage />} />
        <Route path={RUTAS_PAISES.TEST} element={<PaisesTestPage />} />
        <Route path={RUTAS_PAISES.LISTA_SIMPLE} element={<ListaPaisesSimplePage />} />

        {/* Rutas del módulo de Licencias */}
        <Route path={RUTAS_LICENCIAS.LISTA} element={<ListaLicenciasPage />} />
        <Route path={RUTAS_LICENCIAS.NUEVA} element={<FormularioLicenciaPage />} />
        <Route path={RUTAS_LICENCIAS.EDITAR} element={<FormularioLicenciaPage />} />
        <Route path={RUTAS_LICENCIAS.ASIGNAR} element={<FormularioLicenciaPage />} />
        <Route path={RUTAS_LICENCIAS.MIGRACION} element={<MigracionLicenciasPage />} />

        {/* Rutas de datos maestros - Categorías */}
        <Route path={RUTAS_CATEGORIAS.LISTA} element={<ListCategory />} />
        <Route path={RUTAS_CATEGORIAS.NUEVA} element={<CategoryPage />} />
        <Route path={RUTAS_CATEGORIAS.DETALLE} element={<CategoryPage />} />

        {/* Rutas de datos maestros - Tipos de Movimientos */}
        <Route path={RUTAS_TIPOS_MOVIMIENTOS.LISTA} element={<ListMovementPage />} />
        <Route path={RUTAS_TIPOS_MOVIMIENTOS.NUEVO} element={<MovementPage />} />
        <Route path={RUTAS_TIPOS_MOVIMIENTOS.DETALLE} element={<MovementPage />} />

        {/* Rutas de datos maestros - Tipos de Insumos */}
        <Route path={RUTAS_TIPOS_INSUMOS.LISTA} element={<ListSuppliesPage />} />
        <Route path={RUTAS_TIPOS_INSUMOS.NUEVO} element={<SuppliesTypePage />} />
        <Route path={RUTAS_TIPOS_INSUMOS.DETALLE} element={<SuppliesTypePage />} />

        {/* Rutas de datos maestros - Cultivos */}
        <Route path={RUTAS_CULTIVOS.LISTA} element={<ListCropsPage />} />
        <Route path={RUTAS_CULTIVOS.NUEVO} element={<NewCropsPage />} />
        <Route path={RUTAS_CULTIVOS.DETALLE} element={<NewCropsPage />} />

        {/* Rutas de datos maestros - Sistemas */}
        <Route path={RUTAS_SISTEMAS.LISTA} element={<ListSystemPage />} />
        <Route path={RUTAS_SISTEMAS.NUEVO} element={<NewSystemPage />} />
        <Route path={RUTAS_SISTEMAS.DETALLE} element={<NewSystemPage />} />

        {/* Rutas de datos maestros - Tipos de Dispositivos */}
        <Route path={RUTAS_TIPOS_DISPOSITIVOS.LISTA} element={<ListTypeDevicesPage />} />
        <Route path={RUTAS_TIPOS_DISPOSITIVOS.NUEVO} element={<NewTypeDevicesPage />} />
        <Route path={RUTAS_TIPOS_DISPOSITIVOS.DETALLE} element={<NewTypeDevicesPage />} />

        {/* Rutas de configuración - Menús y Módulos */}
        <Route path={RUTAS_MENUS_MODULOS.LISTA} element={<ListMenuModulesPage />} />
        <Route path={RUTAS_MENUS_MODULOS.NUEVO} element={<NewMenuModulesPage />} />
        <Route path={RUTAS_MENUS_MODULOS.DETALLE} element={<NewMenuModulesPage />} />

        {/* Ruta por defecto */}
        <Route path="/*" element={<Navigate to={RUTAS_BASE.HOME} />} />
      </Routes>
    </AppLayout>
  );
};
