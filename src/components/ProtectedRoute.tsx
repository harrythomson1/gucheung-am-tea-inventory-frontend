import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from './LoadingScreen'

export function ProtectedRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
