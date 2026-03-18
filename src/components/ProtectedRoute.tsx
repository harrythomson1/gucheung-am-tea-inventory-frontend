import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) return <div>로딩 중...</div>
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
