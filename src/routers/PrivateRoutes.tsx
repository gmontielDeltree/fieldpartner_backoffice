import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components';
import {
    HomePage,
    CustomerPage,
    ListCustomerPage,
    UserPage,
    ListUserPage,
    SettingsPage,
} from '../pages';


export const PrivateRoutes: React.FC = () => {
    return (
        <AppLayout key="app-layout">
            <Routes>
                <Route path='/home' element={<HomePage />} />
                <Route path='/customer/new' element={<CustomerPage />} />
                <Route path='/customer/:id' element={<CustomerPage />} />
                <Route path='/list-customer' element={<ListCustomerPage />} />
                <Route path='/user/new' element={<UserPage />} />
                <Route path='/user/:id' element={<UserPage />} />
                <Route path='/list-user' element={<ListUserPage />} />
                <Route path='/settings' element={<SettingsPage />} />

                <Route path='/*' element={<Navigate to="/home" />} />
            </Routes>
        </AppLayout>
    )
}
