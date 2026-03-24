import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AdminRoute() {
  const { isAdmin, isLoading } = useAuth()

  if (isLoading) return null

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
