import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginForm } from '../components/LoginForm'
import { t } from '../constants/translations'

export default function Login() {
  const { session } = useAuth()
  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    navigator.maxTouchPoints > 0
  const isInStallMode = window.matchMedia('(display-mode: standalone)').matches

  if (session) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen flex flex-col">
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
      {isIOS && !isInStallMode && (
        <div className="bg-[#e0e0c8] rounded-xl px-4 py-3 text-xs text-[#2a5034] text-center">
          {t('iosInstallPrompt')}
        </div>
      )}
    </div>
  )
}
