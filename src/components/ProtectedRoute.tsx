import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
