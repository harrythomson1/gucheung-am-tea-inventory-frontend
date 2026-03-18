import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginForm } from '../components/LoginForm'

export default function Login() {
  const { session } = useAuth()

  if (session) return <Navigate to="/dashboard" replace />

  return (
    <div className="bg-[#f2f2e1] min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div>
          <h1 className="text-center text-2xl font-bold">구층암</h1>
          <h1 className="text-center text-2xl font-bold">관리 페이지</h1>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
      <div className="flex-1 flex items-center justify-center"></div>
    </div>
  )
}
