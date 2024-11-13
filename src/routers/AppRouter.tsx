import { useEffect } from 'react'
import { useAuthStore } from '../hooks'
import { PublicRoutes } from './PublicRoutes'
import { PrivateRoutes } from './PrivateRoutes'
import { Loading } from '../components'
import { Navigate, Route, Routes } from 'react-router-dom'

export const AppRouter: React.FC = () => {
  const { status, checkAuthToken } = useAuthStore()
  // const authStatus = 'not-authenticated'; // 'authenticated'; // 'not-authenticated';

  useEffect(() => {
    checkAuthToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'checking') {
    return <Loading key="loading-checking-routers" loading />
  }

  return (
    <Routes>
      <Route path="/*" element={<PrivateRoutes />} />
    </Routes>
    // {
    //   (status === 'authenticated')
    //     ? <Route path="/*" element={<PrivateRoutes />} />
    //     : <Route path="/auth/*" element={<PublicRoutes />} />
    // }
    // {/* {
    //   (status === 'not-authenticated')
    //     ? (<PublicRoutes />)
    //     : (<PrivateRoutes />)
    // } */}

    // <Route path='/*' element={<Navigate to='/auth/login' />} />
  )
}
