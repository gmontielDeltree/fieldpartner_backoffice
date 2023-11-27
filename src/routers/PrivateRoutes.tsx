import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components";
import {
  HomePage,
  CustomerPage,
  ListCustomerPage,
  UserPage,
  ListUserPage,
  SettingsPage,
  ListCategory,
  CategoryPage,
  ListMovementPage,
  MovementPage,
  ListSuppliesPage,
  SuppliesPage
} from "../pages";


export const PrivateRoutes: React.FC = () => {
  return (
    <AppLayout key="app-layout">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/customer/new" element={<CustomerPage />} />
        <Route path="/customer/:id" element={<CustomerPage />} />
        <Route path="/list-customer" element={<ListCustomerPage />} />
        <Route path="/user/new" element={<UserPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/list-user" element={<ListUserPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/categories" element={<ListCategory />} />
        <Route path="/category/new" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/type-movement" element={<ListMovementPage/>}/>
        <Route path="/type-movement/new" element={<MovementPage />} /> 
        <Route path="/type-movement/:id" element={<MovementPage />} /> 
        <Route path="/type-supplies" element={< ListSuppliesPage/>}/>
        <Route path="/type-supplies/new" element={<SuppliesPage />} /> 
        <Route path="/type-supplies/:id" element={<SuppliesPage />} /> 



        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </AppLayout>
  );
};
