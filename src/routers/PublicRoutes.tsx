import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages';
import { AuthLayout } from '../components';

/* El layout de ingreso (foto de marca + columna del formulario) vive acá,
 * como en FieldPartner: al cambiar de pantalla pública solo cambia el formulario. */
export const PublicRoutes: React.FC = () => {
    return (
        <AuthLayout>
            <Routes>
                <Route path='login' element={<LoginPage />} />

                <Route path="/*" element={<Navigate to="/auth/login" />} />
            </Routes>
        </AuthLayout>
    )
}
