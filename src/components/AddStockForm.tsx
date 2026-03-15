import { useEffect, useState } from 'react'
import { getTeas } from '../api/tea'
import type { SubmitHandler } from 'react-hook-form'
import type { AddTransactionData } from '../types/transaction'
import { postHarvestTransaction } from '../api/transaction'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import type { Tea } from '../types/tea'

type AddStockInputs = Omit<AddTransactionData, 'transaction_type'>

export function AddStockForm() {
  const navigate = useNavigate()
  const [teas, setTeas] = useState<Tea[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStockInputs>()

  useEffect(() => {
    getTeas().then((response) => setTeas(response))
  }, [])

  const onSubmit: SubmitHandler<AddStockInputs> = async (data) => {
    try {
      await postHarvestTransaction({
        ...data,
        transaction_type: 'harvest',
        notes: data.notes || undefined,
      })
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('tea_id', { required: true, valueAsNumber: true })}>
        <option value="">Select tea</option>
        {teas.map((tea) => (
          <option key={tea.id} value={tea.id}>
            {tea.name}
          </option>
        ))}
      </select>
      <select {...register('packaging', { required: true })}>
        <option value="">Select packaging</option>
        <option value="silver">Silver</option>
        <option value="wing">Wing</option>
        <option value="gift">Gift</option>
        <option value="standard">Standard</option>
      </select>
      <select {...register('flush', { required: true })}>
        <option value="">Select Flush</option>
        <option value="first">First Flush</option>
        <option value="second">Second Flush</option>
      </select>
      <input
        placeholder="Harvest year"
        {...register('harvest_year', {
          required: true,
          valueAsNumber: true,
          validate: (value) => {
            const year = Number(value)
            const currentYear = new Date().getFullYear()
            if (isNaN(year) || year < 2000) return 'Please enter a valid year'
            if (year > currentYear)
              return 'Harvest year cannot be in the future'
            return true
          },
        })}
      />
      <input
        placeholder="Weight"
        {...register('weight_grams', {
          required: true,
          valueAsNumber: true,
          validate: (value) => {
            const weight = Number(value)
            if (isNaN(weight) || weight <= 0)
              return 'Please enter a valid weight'
            return true
          },
        })}
      />
      <input
        placeholder="Quantity"
        {...register('quantity_change', {
          required: true,
          valueAsNumber: true,
          validate: (value) => {
            const weight = Number(value)
            if (isNaN(weight)) return 'Please enter a valid'
            else if (value <= 0) return 'Value must be positive'
            return true
          },
        })}
      />
      <input {...register('notes')} />
      {errors.tea_id && <span>Tea name is required</span>}
      {errors.packaging && <span>Packaging type is required is required</span>}
      {errors.flush && <span>Flush type is required</span>}
      {errors.harvest_year && <span>{errors.harvest_year.message}</span>}
      {errors.weight_grams && <span>{errors.weight_grams.message}</span>}
      {errors.quantity_change && <span>{errors.quantity_change.message}</span>}
      <input type="submit" />
    </form>
  )
}
