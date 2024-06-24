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
  ListCountryPage,
  NewCountryPage,
  ListSystemPage,
  NewSystemPage,
  ListLicencesPage,
  NewLicencesPage,
  ListMenuModulesPage,
  NewMenuModulesPage,
  AccountPage,
  ListAccountPage,
} from "../pages";



export const PrivateRoutes: React.FC = () => {

  const { pathname, search } = useLocation();

  const lastPath = useMemo(() => pathname + search, [pathname, search]);
  localStorage.setItem("lastPath_bo", lastPath);

  return (
    <AppLayout key="app-layout">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/user/new" element={<UserPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/list-user" element={<ListUserPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/categories" element={<ListCategory />} />
        <Route path="/category/new" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/type-movement" element={<ListMovementPage />} />
        <Route path="/type-movement/new" element={<MovementPage />} />
        <Route path="/type-movement/:id" element={<MovementPage />} />
        <Route path="/type-supplies" element={< ListSuppliesPage />} />
        <Route path="/type-supplies/new" element={<SuppliesTypePage />} />
        <Route path="/type-supplies/:id" element={<SuppliesTypePage />} />
        <Route path="/crops" element={<ListCropsPage />} />
        <Route path="/crops/new" element={<NewCropsPage />} />
        <Route path="/crops/:id" element={<NewCropsPage />} />
        <Route path="/country" element={<ListCountryPage />} />
        <Route path="/country/new" element={<NewCountryPage />} />
        <Route path="/country/:id" element={<NewCountryPage />} />
        <Route path="/system" element={<ListSystemPage />} />
        <Route path="/system/new" element={<NewSystemPage />} />
        <Route path="/system/:id" element={<NewSystemPage />} />
        <Route path="/licences" element={<ListLicencesPage />} />
        <Route path="/licences/new" element={<NewLicencesPage />} />
        <Route path="/licences/:id" element={<NewLicencesPage />} />
        <Route path="/menus-modules" element={<ListMenuModulesPage />} />
        <Route path="/menus-modules/new" element={<NewMenuModulesPage />} />
        <Route path="/menus-modules/:id" element={<NewMenuModulesPage />} />

        <Route path="/accounts" element={<ListAccountPage />} />
        <Route path="/accounts/new" element={<AccountPage />} />
        <Route path="/accounts/:id" element={<AccountPage />} />


        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </AppLayout>
  );
};
