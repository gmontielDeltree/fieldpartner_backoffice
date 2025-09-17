import { useEffect } from 'react'
import { useAuthStore } from '../hooks'
import { PublicRoutes } from './PublicRoutes'
import { PrivateRoutes } from './PrivateRoutes'
import { Loading } from '../components'
import { Navigate, Route, Routes } from 'react-router-dom'

export const AppRouter: React.FC = () => {
  const { status, verificarTokenAuth, checkAuthToken } = useAuthStore()
  // const authStatus = 'not-authenticated'; // 'authenticated'; // 'not-authenticated';

  useEffect(() => {
    // Usar el nuevo método con renovación automática
    // Si hay problemas, fallback al método legacy
    if (verificarTokenAuth) {
      verificarTokenAuth()
    } else {
      checkAuthToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'checking') {
    return <Loading key="loading-checking-routers" loading />
  }

  return (
    <Routes>
       {status === 'authenticated' ? (
         <Route path="/*" element={<PrivateRoutes />} />
       ) : (
         <Route path="/auth/*" element={<PublicRoutes />} />
       )}
      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  )
}
