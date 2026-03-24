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
import { TEA_NAMES, t } from '../constants/translations'
import { CustomerSearch } from './CustomerSearch'
import { AddCustomerModal } from './AddCustomerModal'
import type { Customer } from '../types/customer'
import { ChevronLeft } from 'lucide-react'

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
  const [selectedHarvestYear, setSelectedHarvestYear] = useState<number | null>(
    null
  )
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    string | null
  >(null)
  const [stockError, setStockError] = useState<string | null>(null)
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RemoveTransactionData>()

  const handleTeaSelect = async (teaId: number) => {
    setSelectedTeaId(teaId)
    setSelectedHarvestYear(null)
    setSelectedPackaging(null)
    setSelectedFlush(null)
    setSelectedWeight(null)
    const data = await getTeaStock(teaId)
    setVariants(data)
  }

  const variantsWithStock = variants.filter((v) => v.current_stock > 0)
  const availableHarvestYear = [
    ...new Set(variantsWithStock.map((v) => v.harvest_year)),
  ].sort((a, b) => b - a)
  const availablePackaging = [
    ...new Set(
      variantsWithStock
        .filter((v) => v.harvest_year === selectedHarvestYear)
        .map((v) => v.packaging)
    ),
  ]
  const availableFlush = [
    ...new Set(
      variantsWithStock
        .filter(
          (v) =>
            v.harvest_year === selectedHarvestYear &&
            v.packaging === selectedPackaging
        )
        .map((v) => v.flush)
    ),
  ]
  const availableWeights = variantsWithStock
    .filter(
      (v) =>
        v.harvest_year === selectedHarvestYear &&
        v.packaging === selectedPackaging &&
        v.flush === selectedFlush
    )
    .map((v) => v.weight_grams)
  const selectedVariant = variants.find(
    (v) =>
      v.harvest_year == selectedHarvestYear &&
      v.packaging === selectedPackaging &&
      v.flush === selectedFlush &&
      v.weight_grams === selectedWeight
  )

  useEffect(() => {
    getTeas().then((response) => setTeas(response))
  }, [])

  useEffect(() => {
    if (selectedVariant) setValue('tea_variant_id', selectedVariant.id)
  }, [selectedVariant, setValue])

  const onSubmit: SubmitHandler<RemoveStockInput> = async (data) => {
    setIsSubmitting(true)
    setStockError(null)
    try {
      await postRemovalTransaction({
        ...data,
        quantity_change: -Math.abs(data.quantity_change),
        customer_id: data.customer_id || undefined,
        notes: data.notes || undefined,
      })
      navigate('/')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setStockError(error.response.data.detail)
      }
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleButtonClass = (selected: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
      selected ? 'bg-[#2a5034] text-white' : 'bg-[#e0e0c8] text-[#2a5034]'
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

      <form
        onSubmit={handleSubmit(onSubmit, (errors) =>
          console.log('validation errors', errors)
        )}
      >
        {/* Tea */}
        <p className="section-label">{t('selectTea')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {teas.map((tea) => (
            <button
              key={tea.id}
              className={toggleButtonClass(selectedTeaId === tea.id)}
              type="button"
              onClick={() => handleTeaSelect(tea.id)}
            >
              {TEA_NAMES[tea.name as keyof typeof TEA_NAMES] ?? tea.name}
            </button>
          ))}
        </div>

        {/* Year */}
        {selectedTeaId && (
          <>
            <p className="section-label">{t('year')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableHarvestYear.map((year) => (
                <button
                  key={year}
                  className={toggleButtonClass(selectedHarvestYear === year)}
                  type="button"
                  onClick={() => {
                    setSelectedHarvestYear(year)
                    setSelectedPackaging(null)
                    setSelectedFlush(null)
                    setSelectedWeight(null)
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Packaging */}
        {selectedHarvestYear && (
          <>
            <p className="section-label">{t('packaging')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {availablePackaging.map((packaging) => (
                <button
                  key={packaging}
                  className={toggleButtonClass(selectedPackaging === packaging)}
                  type="button"
                  onClick={() => {
                    setSelectedPackaging(packaging)
                    setSelectedFlush(null)
                    setSelectedWeight(null)
                  }}
                >
                  {t(packaging)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Flush */}
        {selectedPackaging && (
          <>
            <p className="section-label">{t('flush')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableFlush.map((flush) => (
                <button
                  key={flush}
                  className={toggleButtonClass(selectedFlush === flush)}
                  type="button"
                  onClick={() => {
                    setSelectedFlush(flush)
                    setSelectedWeight(null)
                  }}
                >
                  {t(flush)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Weight */}
        {
          <>
            <p className="section-label">{t('weight')}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableWeights.map((weight) => (
                <button
                  key={weight}
                  className={toggleButtonClass(selectedWeight === weight)}
                  type="button"
                  onClick={() => setSelectedWeight(weight)}
                >
                  {weight}g
                </button>
              ))}
            </div>
          </>
        }

        {/* Variant selected */}
        {selectedVariant && (
          <>
            <div className="card px-4 py-3 mb-4 flex justify-between items-center">
              <span className="text-xs text-gray-400">{t('currentStock')}</span>
              <span className="text-sm font-medium text-[#2a5034]">
                {selectedVariant.current_stock}
              </span>
            </div>

            <p className="section-label">{t('quantity')}</p>
            <input
              type="number"
              placeholder={t('quantityPlaceholder')}
              className="input-base mb-4"
              {...register('quantity_change', {
                required: t('quantityRequired'),
                valueAsNumber: true,
                validate: (value) => value > 0 || t('quantityPositive'),
              })}
            />

            <p className="section-label">{t('transactionType')}</p>
            <div className="relative mb-4">
              <select
                className="input-base appearance-none pr-8"
                {...register('transaction_type', {
                  required: t('transactionRequired'),
                  onChange: (e) => {
                    setSelectedTransactionType(e.target.value)
                    if (e.target.value !== 'sale')
                      setValue('customer_id', undefined)
                  },
                })}
              >
                <option value="">{t('transactionSelect')}</option>
                <option value="sale">{t('sale')}</option>
                <option value="donation">{t('donation')}</option>
                <option value="ceremony">{t('ceremony')}</option>
                <option value="damaged">{t('damaged')}</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#2a5034] text-xs">
                ▼
              </span>
            </div>

            {/* Customer */}
            {(selectedTransactionType === 'sale' ||
              selectedTransactionType === 'donation' ||
              selectedTransactionType === 'ceremony') && (
              <div className="mb-4">
                <p className="section-label">{t('customer')}</p>
                {selectedCustomer ? (
                  <div className="card px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        {selectedCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2a5034]">
                          {selectedCustomer.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {selectedCustomer.city}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5"
                      onClick={() => {
                        setSelectedCustomer(null)
                        setValue('customer_id', undefined)
                      }}
                    >
                      {t('change')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <CustomerSearch
                      onSelect={(customer) => {
                        setValue('customer_id', customer.id)
                        setSelectedCustomer(customer)
                      }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowAddCustomerModal(true)}
                    >
                      {t('addNewCustomer')}
                    </button>
                  </div>
                )}
              </div>
            )}

            <input type="hidden" {...register('customer_id')} />

            <p className="section-label">{t('notes')}</p>
            <input
              className="input-base mb-4"
              {...register('notes')}
              placeholder={t('notesPlaceholder')}
            />

            {/* Errors */}
            {errors.quantity_change && (
              <p className="text-danger text-xs mb-2">
                {errors.quantity_change.message}
              </p>
            )}
            {errors.transaction_type && (
              <p className="text-danger text-xs mb-2">
                {errors.transaction_type.message}
              </p>
            )}
            {stockError && (
              <p className="text-danger text-xs mb-2">{stockError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-danger btn-full disabled:opacity-50"
            >
              {t('submitButton')}
            </button>
          </>
        )}
      </form>

      {showAddCustomerModal && (
        <AddCustomerModal
          onClose={() => setShowAddCustomerModal(false)}
          onCustomerCreated={(customer) => {
            setSelectedCustomer(customer)
            setValue('customer_id', customer.id)
            setShowAddCustomerModal(false)
          }}
        />
      )}
    </div>
  )
}
