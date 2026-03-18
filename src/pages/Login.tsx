import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginForm } from '../components/LoginForm'

export default function Login() {
  const { session } = useAuth()

  if (session) return <Navigate to="/dashboard" replace />

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  )
}
