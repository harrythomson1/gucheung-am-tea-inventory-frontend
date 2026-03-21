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
import {
  FLUSH_LABELS,
  FORM_LABELS,
  PACKAGING_LABELS,
  TEA_NAMES,
  TRANSACTION_TYPE_LABELS,
} from '../constants/transalations'
import { CustomerSearch } from './CustomerSearch'
import { AddCustomerModal } from './AddCustomerModal'
import type { Customer } from '../types/customer'

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
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setStockError(error.response.data.detail)
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
            className={`px-4 py-2 m-1 rounded ${selectedTeaId === tea.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            type="button"
            onClick={() => handleTeaSelect(tea.id)}
          >
            {TEA_NAMES[tea.name as keyof typeof TEA_NAMES] ?? tea.name}
          </button>
        ))}
      </div>
      {selectedTeaId && (
        <div>
          {availableHarvestYear.map((harvest_year) => (
            <button
              key={harvest_year}
              className={`px-4 py-2 m-1 rounded ${selectedHarvestYear === harvest_year ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              type="button"
              onClick={() => {
                setSelectedHarvestYear(harvest_year)
                setSelectedPackaging(null)
                setSelectedFlush(null)
                setSelectedWeight(null)
              }}
            >
              {harvest_year}
            </button>
          ))}
        </div>
      )}
      {selectedHarvestYear && (
        <div>
          {availablePackaging.map((packaging) => (
            <button
              key={packaging}
              className={`px-4 py-2 m-1 rounded ${selectedPackaging === packaging ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              type="button"
              onClick={() => {
                setSelectedPackaging(packaging)
                setSelectedFlush(null)
                setSelectedWeight(null)
              }}
            >
              {PACKAGING_LABELS[packaging as keyof typeof PACKAGING_LABELS]}
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
              className={`px-4 py-2 m-1 rounded ${selectedFlush === flush ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setSelectedFlush(flush)
                setSelectedWeight(null)
              }}
            >
              {FLUSH_LABELS[flush as keyof typeof FLUSH_LABELS]}
            </button>
          ))}
        </div>
      )}
      {selectedFlush && (
        <div>
          {availableWeights.map((weight) => (
            <button
              key={weight}
              className={`px-4 py-2 m-1 rounded ${selectedWeight === weight ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
          <p>현재 재고: {selectedVariant.current_stock}</p>
          <input
            type="number"
            placeholder="수량"
            {...register('quantity_change', {
              required: 'Please enter a quantity',
              valueAsNumber: true,
              validate: (value) => value > 0 || 'Must be greater than 0',
            })}
          />
          <select
            {...register('transaction_type', {
              required: 'Please select a transaction reason',
              onChange: (e) => {
                setSelectedTransactionType(e.target.value)
                if (e.target.value !== 'sale') {
                  setValue('customer_id', undefined)
                }
              },
            })}
          >
            <option value="">{FORM_LABELS.transactionSelect}</option>
            <option value="sale">{TRANSACTION_TYPE_LABELS.sale}</option>
            <option value="donation">{TRANSACTION_TYPE_LABELS.donation}</option>
            <option value="ceremony">{TRANSACTION_TYPE_LABELS.ceremony}</option>
            <option value="damaged">{TRANSACTION_TYPE_LABELS.damaged}</option>
          </select>
          {(selectedTransactionType === 'sale' ||
            selectedTransactionType === 'donation' ||
            selectedTransactionType === 'ceremony') && (
            <div>
              {selectedCustomer ? (
                <button
                  type="button"
                  className="px-4 py-2 m-1 rounded bg-blue-500 text-white"
                  onClick={() => {
                    setSelectedCustomer(null)
                    setValue('customer_id', undefined)
                  }}
                >
                  {selectedCustomer.name} - {selectedCustomer.city}
                </button>
              ) : (
                <CustomerSearch
                  onSelect={(customer) => {
                    setValue('customer_id', customer.id)
                    setSelectedCustomer(customer)
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
              >
                새 고객 추가
              </button>
            </div>
          )}
          {showAddCustomerModal && (
            <AddCustomerModal
              onClose={() => setShowAddCustomerModal(false)}
              onCustomerCreated={(customer) => {
                setSelectedCustomer(customer)
                setValue('customer_id', customer.id)
              }}
            />
          )}
          <input type="hidden" {...register('customer_id')} />
          <input {...register('notes')} placeholder="메모" />
          <input type="submit" value="제출" />
        </>
      )}
      {errors.quantity_change && <span>{errors.quantity_change.message}</span>}
      {errors.transaction_type && (
        <span>{errors.transaction_type.message}</span>
      )}
      {stockError && <span>{stockError}</span>}
    </form>
  )
}
