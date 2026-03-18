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
      <div>
        <input
          defaultValue="email"
          {...register('email')}
          className="border border-black"
        />
      </div>
      <div>
        <input
          defaultValue="password"
          {...register('password', { required: true })}
          className="border border-black"
        />
      </div>
      <div>
        <input type="submit" />
      </div>
      <div>{errors.password && <span>This field is required</span>}</div>
    </form>
  )
}
