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
  const [selectedTeaId, setSelectedTeaId] = useState<number | null>(null)
  const [selectedPackaging, setSelectedPackaging] = useState<string | null>(
    null
  )
  const [selectedFlush, setSelectedFlush] = useState<string | null>(null)
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null)
  const [selectedHarvestYear, setSelectedHarvestYear] = useState<number | null>(
    null
  )
  const [selectedQuantityChange, setSelectedQuantityChange] = useState<
    number | null
  >(null)
  const PACKAGING_TYPES = ['silver', 'wing', 'gift', 'standard', 'mixed']
  const FLUSH_TYPES = ['first', 'second', 'mixed']

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStockInputs>()

  const handleTeaSelect = async (teaId: number) => {
    setSelectedTeaId(teaId)
    setSelectedHarvestYear(null)
    setSelectedPackaging(null)
    setSelectedFlush(null)
    setSelectedWeight(null)
  }

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
      {teas.map((tea) => (
        <button
          key={tea.id}
          className={`px-4 py-2 m-1 rounded ${selectedTeaId === tea.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          type="button"
          onClick={() => handleTeaSelect(tea.id)}
        >
          {tea.name}
        </button>
      ))}
      {selectedTeaId && (
        <div>
          {PACKAGING_TYPES.map((packaging) => (
            <button
              key={packaging}
              className={`px-4 py-2 m-1 rounded ${selectedPackaging === packaging ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              type="button"
              onClick={() => {
                setSelectedPackaging(packaging)
                setSelectedFlush(null)
                setSelectedHarvestYear(null)
                setSelectedWeight(null)
                setSelectedQuantityChange(null)
              }}
            >
              {packaging}
            </button>
          ))}
        </div>
      )}
      {selectedPackaging && (
        <div>
          {FLUSH_TYPES.map((flush) => (
            <button
              key={flush}
              className={`px-4 py-2 m-1 rounded ${selectedFlush === flush ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              type="button"
              onClick={() => {
                setSelectedFlush(flush)
                setSelectedHarvestYear(null)
                setSelectedWeight(null)
                setSelectedQuantityChange(null)
              }}
            >
              {flush}
            </button>
          ))}
        </div>
      )}
      {selectedFlush && (
        <div>
          <input
            type="number"
            placeholder="Harvest year"
            {...register('harvest_year', {
              onChange: (e) => {
                setSelectedHarvestYear(Number(e.target.value))
                setSelectedWeight(null)
                setSelectedQuantityChange(null)
              },
              required: true,
              valueAsNumber: true,
              validate: (value) => {
                const year = Number(value)
                const currentYear = new Date().getFullYear()
                if (isNaN(year) || year < 2000)
                  return 'Please enter a valid year'
                if (year > currentYear)
                  return 'Harvest year cannot be in the future'
                return true
              },
            })}
          />
        </div>
      )}
      {selectedHarvestYear && (
        <div>
          <input
            type="number"
            placeholder="Weight"
            {...register('weight_grams', {
              onChange: (e) => {
                setSelectedWeight(Number(e.target.value))
                setSelectedQuantityChange(null)
              },
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
        </div>
      )}
      {selectedWeight && (
        <div>
          <input
            type="number"
            placeholder="Quantity"
            {...register('quantity_change', {
              onChange: (e) =>
                setSelectedQuantityChange(Number(e.target.value)),
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
        </div>
      )}
      {selectedQuantityChange && (
        <div>
          <input {...register('notes')} />
        </div>
      )}
      {errors.tea_id && <span>Tea name is required</span>}
      {errors.packaging && <span>Packaging type is required is required</span>}
      {errors.flush && <span>Flush type is required</span>}
      {errors.harvest_year && <span>{errors.harvest_year.message}</span>}
      {errors.weight_grams && <span>{errors.weight_grams.message}</span>}
      {errors.quantity_change && <span>{errors.quantity_change.message}</span>}
      {selectedQuantityChange && <input type="submit" />}
    </form>
  )
}
