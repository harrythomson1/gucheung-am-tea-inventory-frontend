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
import { ChevronLeft } from 'lucide-react'

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
  const [showCustomYear, setShowCustomYear] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const currentYear = new Date().getFullYear()
  const HARVEST_YEARS = [currentYear, currentYear - 1, currentYear - 2]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddStockInputs>()

  const handleTeaSelect = async (teaId: number) => {
    try {
      setSelectedTeaId(teaId)
      setSelectedPackaging(null)
      setSelectedFlush(null)
      setSelectedHarvestYear(null)
      setSelectedWeight(null)
      setSelectedQuantityChange(null)
      const data = await getTeaStock(teaId)
      setVariants(data)
    } catch {
      console.error('Failed to fetch tea stock')
    }
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
    getTeas()
      .then((response) => setTeas(response))
      .catch((error) => console.error('Failed to fetch teas:', error))
  }, [])

  const onSubmit: SubmitHandler<AddStockInputs> = async (data) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await postHarvestTransaction({
        ...data,
        transaction_type: 'harvest',
        notes: data.notes || undefined,
      })
      navigate('/')
    } catch {
      setSubmitError(t('submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeClass = 'bg-[#2a5034] text-white'
  const enabledClass = 'bg-[#e0e0c8] text-[#2a5034]'
  const disabledClass = 'bg-[#f0f0e0] text-gray-300 cursor-not-allowed'

  const toggleButtonClass = (selected: boolean, disabled: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
      selected ? activeClass : disabled ? disabledClass : enabledClass
    }`

  return (
    <div className="px-4 pb-28 safe-area-inset">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm text-[#2a5034] mt-4 mb-3"
      >
        <ChevronLeft size={16} />
        {t('dashboard')}
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tea */}
        <p className="section-label">{t('selectTea')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {teas.map((tea) => (
            <button
              key={tea.id}
              className={toggleButtonClass(selectedTeaId === tea.id, false)}
              type="button"
              onClick={() => {
                handleTeaSelect(tea.id)
                setValue('tea_id', tea.id)
              }}
            >
              {TEA_NAMES[tea.name as keyof typeof TEA_NAMES] ?? tea.name}
            </button>
          ))}
        </div>

        {/* Packaging */}
        <p className="section-label">{t('packaging')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PACKAGING_TYPES.map((packaging) => (
            <button
              key={packaging}
              className={toggleButtonClass(
                selectedPackaging === packaging,
                !selectedTeaId
              )}
              type="button"
              disabled={!selectedTeaId}
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

        {/* Flush */}
        <p className="section-label">{t('flush')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {FLUSH_TYPES.map((flush) => (
            <button
              key={flush}
              className={toggleButtonClass(
                selectedFlush === flush,
                !selectedPackaging
              )}
              type="button"
              disabled={!selectedPackaging}
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

        {/* Year */}
        <p className="section-label">{t('year')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {HARVEST_YEARS.map((harvestYear) => (
            <button
              key={harvestYear}
              className={toggleButtonClass(
                selectedHarvestYear === harvestYear,
                !selectedFlush
              )}
              type="button"
              disabled={!selectedFlush}
              onClick={() => {
                setSelectedHarvestYear(harvestYear)
                setShowCustomYear(false)
                setSelectedWeight(null)
                setSelectedQuantityChange(null)
                setValue('harvest_year', harvestYear)
              }}
            >
              {harvestYear}
            </button>
          ))}
          <button
            type="button"
            className={toggleButtonClass(showCustomYear, !selectedFlush)}
            disabled={!selectedFlush}
            onClick={() => {
              setShowCustomYear(true)
              setSelectedHarvestYear(null)
              setSelectedWeight(null)
              setSelectedQuantityChange(null)
            }}
          >
            {t('otherYear')}
          </button>
          {showCustomYear && (
            <input
              type="number"
              placeholder={t('yearPlaceholder')}
              className="input-base mt-2"
              {...register('harvest_year', {
                onChange: (e) => setSelectedHarvestYear(Number(e.target.value)),
                required: true,
                valueAsNumber: true,
                validate: (value) => value > 1900 || t('invalidYear'),
              })}
            />
          )}
        </div>

        {/* Weight */}
        <p className="section-label">{t('weight')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestedWeights.length > 0 ? (
            <>
              {suggestedWeights.map((weight) => (
                <button
                  key={weight}
                  className={toggleButtonClass(
                    selectedWeight === weight,
                    !selectedHarvestYear
                  )}
                  type="button"
                  disabled={!selectedHarvestYear}
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
                className={toggleButtonClass(
                  showCustomWeight,
                  !selectedHarvestYear
                )}
                disabled={!selectedHarvestYear}
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
                  className="input-base mt-2"
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
              className={`input-base ${!selectedHarvestYear ? 'opacity-40 pointer-events-none' : ''}`}
              {...register('weight_grams', {
                onChange: (e) => setSelectedWeight(Number(e.target.value)),
                required: true,
                valueAsNumber: true,
                validate: (value) => value > 0 || t('invalidWeight'),
              })}
            />
          )}
        </div>

        {/* Quantity */}
        <p className="section-label">{t('quantity')}</p>
        <input
          type="number"
          placeholder={t('quantityPlaceholder')}
          className={`input-base mb-4 ${!selectedWeight ? 'opacity-40 pointer-events-none' : ''}`}
          {...register('quantity_change', {
            onChange: (e) => setSelectedQuantityChange(Number(e.target.value)),
            required: true,
            valueAsNumber: true,
            validate: (value) => {
              if (isNaN(Number(value))) return t('invalidQuantity')
              if (value <= 0) return t('positiveQuantity')
              return true
            },
          })}
        />

        {/* Notes */}
        <p className="section-label">{t('notes')}</p>
        <input
          className={`input-base mb-4 ${!selectedQuantityChange ? 'opacity-40 pointer-events-none' : ''}`}
          {...register('notes')}
          placeholder={t('notesPlaceholder')}
        />

        {/* Errors */}
        {Object.values(errors).map((error, i) => (
          <p key={i} className="text-danger text-xs mb-2">
            {error?.message}
          </p>
        ))}
        {submitError && (
          <p className="text-danger text-xs mb-2">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !selectedQuantityChange}
          className="btn-primary btn-full disabled:opacity-50"
        >
          {t('submitButton')}
        </button>
      </form>
    </div>
  )
}
