import { useEffect, useState } from 'react'
import { getTeas, getTeaStock } from '../api/tea'
import type { SubmitHandler } from 'react-hook-form'
import type { AddTransactionData } from '../types/transaction'
import { postHarvestTransaction } from '../api/transaction'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import type { Tea } from '../types/tea'
import type { Variant } from '../types/variant'
import { t, TEA_NAMES } from '../constants/translations'

type AddStockInputs = Omit<AddTransactionData, 'transaction_type'>
const PACKAGING_TYPES = ['silver', 'wing', 'gift']
const FLUSH_TYPES = ['first', 'second', 'mixed']

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
  const [variants, setVariants] = useState<Variant[]>([])
  const [showCustomWeight, setShowCustomWeight] = useState(false)
  const currentYear = new Date().getFullYear()
  const HARVEST_YEARS = [currentYear, currentYear - 1, currentYear - 2]
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddStockInputs>()

  const handleTeaSelect = async (teaId: number) => {
    setSelectedTeaId(teaId)
    const data = await getTeaStock(teaId)
    setVariants(data)
    setSelectedHarvestYear(null)
    setSelectedPackaging(null)
    setSelectedFlush(null)
    setSelectedWeight(null)
  }

  const suggestedWeights = [
    ...new Set(
      variants
        .filter(
          (v) =>
            v.packaging === selectedPackaging &&
            v.flush === selectedFlush &&
            v.harvest_year === selectedHarvestYear &&
            v.current_stock > 0
        )
        .map((v) => v.weight_grams)
    ),
  ]

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
          onClick={() => {
            handleTeaSelect(tea.id)
            setValue('tea_id', tea.id)
          }}
        >
          {TEA_NAMES[tea.name as keyof typeof TEA_NAMES] ?? tea.name}
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
                setValue('packaging', packaging)
              }}
            >
              {t(packaging)}
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
                setValue('flush', flush)
              }}
            >
              {t(flush)}
            </button>
          ))}
        </div>
      )}
      {selectedFlush && (
        <div>
          {HARVEST_YEARS.map((harvestYear) => (
            <button
              key={harvestYear}
              className={`px-4 py-2 m-1 rounded ${selectedHarvestYear === harvestYear ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              type="button"
              onClick={() => {
                setSelectedHarvestYear(harvestYear)
                setSelectedWeight(null)
                setSelectedQuantityChange(null)
                setValue('harvest_year', harvestYear)
              }}
            >
              {harvestYear}
            </button>
          ))}
        </div>
      )}
      {selectedHarvestYear && (
        <div>
          {suggestedWeights.length > 0 ? (
            <>
              {suggestedWeights.map((weight) => (
                <button
                  key={weight}
                  className={`px-4 py-2 m-1 rounded ${selectedWeight === weight ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  type="button"
                  onClick={() => {
                    setSelectedWeight(weight)
                    setSelectedQuantityChange(null)
                    setValue('weight_grams', weight)
                  }}
                >
                  {weight}g
                </button>
              ))}
              <button
                type="button"
                className="px-4 py-2 m-1 rounded bg-gray-200"
                onClick={() => {
                  setShowCustomWeight(true)
                  setSelectedWeight(null)
                }}
              >
                {t('otherWeight')}
              </button>
              {showCustomWeight && (
                <input
                  type="number"
                  placeholder={t('weightPlaceholder')}
                  {...register('weight_grams', {
                    onChange: (e) => setSelectedWeight(Number(e.target.value)),
                    required: true,
                    valueAsNumber: true,
                    validate: (value) => value > 0 || t('invalidWeight'),
                  })}
                />
              )}
            </>
          ) : (
            <input
              type="number"
              placeholder={t('weightPlaceholder')}
              {...register('weight_grams', {
                onChange: (e) => setSelectedWeight(Number(e.target.value)),
                required: true,
                valueAsNumber: true,
                validate: (value) => value > 0 || t('invalidWeight'),
              })}
            />
          )}
        </div>
      )}
      {selectedWeight && (
        <div>
          <input
            type="number"
            placeholder={t('quantityPlaceholder')}
            {...register('quantity_change', {
              onChange: (e) =>
                setSelectedQuantityChange(Number(e.target.value)),
              required: true,
              valueAsNumber: true,
              validate: (value) => {
                const weight = Number(value)
                if (isNaN(weight)) return t('invalidQuantity')
                else if (value <= 0) return t('positiveQuantity')
                return true
              },
            })}
          />
        </div>
      )}
      {selectedQuantityChange && (
        <div>
          <input {...register('notes')} placeholder={t('notesPlaceholder')} />
        </div>
      )}
      {errors.tea_id && <span>{t('teaRequired')}</span>}
      {errors.packaging && <span>{t('packagingRequired')}</span>}
      {errors.flush && <span>{t('flushRequired')}</span>}
      {errors.harvest_year && <span>{errors.harvest_year.message}</span>}
      {errors.weight_grams && <span>{errors.weight_grams.message}</span>}
      {errors.quantity_change && <span>{errors.quantity_change.message}</span>}
      {selectedQuantityChange && (
        <input type="submit" value={t('submitButton')} />
      )}
    </form>
  )
}
