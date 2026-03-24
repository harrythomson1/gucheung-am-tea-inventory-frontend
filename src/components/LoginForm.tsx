import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { TRANSLATIONS, LANGUAGE } from '../constants/translations'
import { Download } from 'lucide-react'

type Inputs = {
  email: string
  password: string
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

export function LoginForm() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    setInstallPrompt(null)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        console.error(error.message)
        setAuthError(TRANSLATIONS[LANGUAGE].authError)
      } else {
        navigate('/dashboard', { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-72">
      <div className="space-y-2">
        <input
          placeholder={TRANSLATIONS[LANGUAGE].emailPlaceholder}
          {...register('email', {
            required: true,
            onChange: () => setAuthError(null),
          })}
          className="input-base"
        />
        <input
          type="password"
          placeholder={TRANSLATIONS[LANGUAGE].passwordPlaceholder}
          {...register('password', {
            required: true,
            onChange: () => setAuthError(null),
          })}
          className="input-base"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary btn-full mt-4 disabled:opacity-50"
        >
          {TRANSLATIONS[LANGUAGE].submitButton}
        </button>
        {installPrompt && (
          <button
            type="button"
            onClick={handleInstall}
            className="btn-secondary btn-full"
          >
            <Download size={14} />
            {TRANSLATIONS[LANGUAGE].installApp}
          </button>
        )}
      </div>
      <div className="mt-2">
        {authError && <p className="text-danger text-sm">{authError}</p>}
        {(errors.email || errors.password) && (
          <p className="text-danger text-sm">
            {TRANSLATIONS[LANGUAGE].requiredField}
          </p>
        )}
      </div>
    </form>
  )
}
