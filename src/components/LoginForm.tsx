import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { TRANSLATIONS, LANGUAGE } from '../constants/translations'

type Inputs = {
  email: string
  password: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-72">
      <div className="space-y-2">
        <div>
          <input
            placeholder={TRANSLATIONS[LANGUAGE].emailPlaceholder}
            {...register('email', {
              required: true,
              onChange: () => setAuthError(null),
            })}
            className="border border-black rounded-md w-full"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder={TRANSLATIONS[LANGUAGE].passwordPlaceholder}
            {...register('password', {
              required: true,
              onChange: () => setAuthError(null),
            })}
            className="border border-black rounded-md w-full"
          />
        </div>
        <div className="bg-[#2a5034] mt-6 rounded-2xl p-1.5 shadow-md flex justify-center cursor-pointer">
          <input
            type="submit"
            className="text-white bg-transparent cursor-pointer text-center w-full"
            value={TRANSLATIONS[LANGUAGE].submitButton}
          />
        </div>
      </div>
      <div className="mt-2">
        {authError && <span className="text-red-500 text-sm">{authError}</span>}
        {errors.password && (
          <span className="text-red-500 text-sm">
            {TRANSLATIONS[LANGUAGE].requiredField}
          </span>
        )}
        {errors.email && (
          <span className="text-red-500 text-sm">
            {TRANSLATIONS[LANGUAGE].requiredField}
          </span>
        )}
      </div>
    </form>
  )
}
