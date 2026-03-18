import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { supabase } from '../lib/subabase'
import { useNavigate } from 'react-router-dom'

type Inputs = {
  email: string
  password: string
}

export function LoginForm() {
  const navigate = useNavigate()

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
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <div>
          <input
            defaultValue="이메일"
            {...register('email')}
            className="border border-black rounded-md"
          />
        </div>
        <div>
          <input
            placeholder="비밀번호"
            {...register('password', { required: true })}
            className="border border-black rounded-md"
          />
        </div>
        <div className="bg-[#2a5034] mt-6 rounded-2xl p-1.5 shadow-md flex justify-center">
          <input
            type="submit"
            className="text-white bg-transparent cursor-pointer w-full text-center"
            value="제출"
          />
        </div>
        <div>{errors.password && <span>This field is required</span>}</div>
      </div>
    </form>
  )
}
