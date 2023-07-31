import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components';
import { CustomerPage, SettingsPage } from '../pages';


export const PrivateRoutes: React.FC = () => {
    return (
        <AppLayout key="app-layout">
            <Routes>
                <Route path='/customer' element={<CustomerPage />} />
                <Route path='/settings' element={<SettingsPage />} />

                <Route path='/*' element={<Navigate to="/customer" />} />
            </Routes>
        </AppLayout>
    )
}
