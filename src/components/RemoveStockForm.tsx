import { useState, useEffect } from 'react'
import type { Variant } from '../types/variant'
import type { SubmitHandler } from 'react-hook-form'
import type { Tea } from '../types/tea'
import { getTeas, getTeaStock } from '../api/tea'
import type { RemoveTransactionData } from '../types/transaction'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { postRemovalTransaction } from '../api/transaction'
import axios from 'axios'

type RemoveStockInput = RemoveTransactionData

export function RemoveStockForm() {
  const navigate = useNavigate()
  const [teas, setTeas] = useState<Tea[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedTeaId, setSelectedTeaId] = useState<number | null>(null)
  const [selectedPackaging, setSelectedPackaging] = useState<string | null>(
    null
  )
  const [selectedFlush, setSelectedFlush] = useState<string | null>(null)
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null)
  const [stockError, setStockError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RemoveTransactionData>()

  const handleTeaSelect = async (teaId: number) => {
    setSelectedTeaId(teaId)
    setSelectedPackaging(null)
    setSelectedFlush(null)
    setSelectedWeight(null)
    const data = await getTeaStock(teaId)
    setVariants(data)
  }
  const availablePackaging = [...new Set(variants.map((v) => v.packaging))]

  const availableFlush = [
    ...new Set(
      variants
        .filter((v) => v.packaging === selectedPackaging)
        .map((v) => v.flush)
    ),
  ]

  const availableWeights = variants
    .filter(
      (v) => v.packaging === selectedPackaging && v.flush === selectedFlush
    )
    .map((v) => v.weight_grams)

  const selectedVariant = variants.find(
    (v) =>
      v.packaging === selectedPackaging &&
      v.flush === selectedFlush &&
      v.weight_grams === selectedWeight
  )

  useEffect(() => {
    getTeas().then((response) => setTeas(response))
  }, [])

  useEffect(() => {
    if (selectedVariant) {
      setValue('tea_variant_id', selectedVariant.id)
    }
  }, [selectedVariant, setValue])

  const onSubmit: SubmitHandler<RemoveStockInput> = async (data) => {
    setStockError(null)
    try {
      await postRemovalTransaction({
        ...data,
        quantity_change: -Math.abs(data.quantity_change),
      })
      navigate('/')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status == 400) {
        setStockError('Insufficient stock')
      }
      console.error(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log('validation errors', errors)
      )}
    >
      <div>
        {teas.map((tea) => (
          <button
            key={tea.id}
            type="button"
            onClick={() => handleTeaSelect(tea.id)}
          >
            {tea.name}
          </button>
        ))}
      </div>

      {selectedTeaId && (
        <div>
          {availablePackaging.map((packaging) => (
            <button
              key={packaging}
              type="button"
              onClick={() => {
                setSelectedPackaging(packaging)
                setSelectedFlush(null)
                setSelectedWeight(null)
              }}
            >
              {packaging}
            </button>
          ))}
        </div>
      )}

      {selectedPackaging && (
        <div>
          {availableFlush.map((flush) => (
            <button
              key={flush}
              type="button"
              onClick={() => {
                setSelectedFlush(flush)
                setSelectedWeight(null)
              }}
            >
              {flush}
            </button>
          ))}
        </div>
      )}

      {selectedFlush && (
        <div>
          {availableWeights.map((weight) => (
            <button
              key={weight}
              type="button"
              onClick={() => setSelectedWeight(weight)}
            >
              {weight}g
            </button>
          ))}
        </div>
      )}

      {selectedVariant && (
        <>
          <p>Current stock: {selectedVariant.current_stock}</p>
          <input
            type="number"
            {...register('quantity_change', {
              required: 'Please enter a quantity',
              valueAsNumber: true,
              validate: (value) => value > 0 || 'Must be greater than 0',
            })}
          />
          <select
            {...register('transaction_type', {
              required: 'Please select a transaction reason',
            })}
          >
            <option value="">Select reason</option>
            <option value="sale">Sale</option>
            <option value="donation">Donation</option>
            <option value="ceremony">Ceremony</option>
            <option value="damaged">Damaged</option>
          </select>
          <input type="submit" />
        </>
      )}
      {errors.quantity_change && <span>{errors.quantity_change.message}</span>}
      {stockError && <span>{stockError}</span>}
    </form>
  )
}
