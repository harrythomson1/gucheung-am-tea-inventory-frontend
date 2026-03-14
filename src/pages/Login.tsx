import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="test" {...register('email')} />
      <input {...register('password', { required: true })} />
      {errors.password && <span>This field is required</span>}
      <input type="submit" />
    </form>
  )
}
