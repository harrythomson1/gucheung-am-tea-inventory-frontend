import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { supabase } from '../lib/subabase'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

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
      setAuthError('이메일 또는 비밀번호가 올바르지 않습니다')
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-72">
      <div className="space-y-2">
        <div>
          <input
            placeholder="이메일"
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
            placeholder="비밀번호"
            {...register('password', {
              required: true,
              onChange: () => setAuthError(null),
            })}
            className="border border-black rounded-md w-full"
          />
        </div>
        <div className="bg-[#2a5034] mt-6 rounded-2xl p-1.5 shadow-md flex justify-center">
          <input
            type="submit"
            className="text-white bg-transparent cursor-pointer text-center"
            value="제출"
          />
        </div>
      </div>
      <div className="mt-2">
        {authError && <span className="text-red-500 text-sm">{authError}</span>}
        {errors.password && (
          <span className="text-red-500 text-sm">필수 입력 항목입니다</span>
        )}
        {errors.email && (
          <span className="text-red-500 text-sm">필수 입력 항목입니다</span>
        )}
      </div>
    </form>
  )
}
