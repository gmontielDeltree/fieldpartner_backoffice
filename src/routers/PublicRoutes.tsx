import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages';
import { AuthLayout } from '../components';

export const PublicRoutes: React.FC = () => {
    return (
        <AuthLayout>
            <Routes>
                <Route path='login' element={<LoginPage />} />
                <Route path='complete-new-password' element={<LoginPage />} />

                <Route path="/*" element={<Navigate to="/auth/login" />} />
            </Routes>
        </AuthLayout>
    )
}
