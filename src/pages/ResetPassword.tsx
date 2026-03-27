import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { TRANSLATIONS, LANGUAGE } from '../constants/translations'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true)
      }
    })
  }, [])

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.  |  Please enter a password.')
      return
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.  |  Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError(
        '비밀번호는 6자 이상이어야 합니다.  |  Password must be at least 6 characters.'
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-sm text-gray-400">
          비밀번호 재설정 링크가 유효하지 않습니다. | Invalid or expired reset
          link.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-72">
        <h1 className="text-center text-xl font-medium text-[#2a5034] mb-6">
          비밀번호 재설정 | Reset Password
        </h1>
        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="새 비밀번호  |  New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
          />
          <input
            type="password"
            placeholder="비밀번호 확인  |  Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-base"
          />
          {error && <p className="text-danger text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary btn-full mt-2 disabled:opacity-50"
          >
            {TRANSLATIONS[LANGUAGE].submitButton}
          </button>
        </div>
      </div>
    </div>
  )
}
