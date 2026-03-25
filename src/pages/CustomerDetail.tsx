import { useState, useEffect } from 'react'
import type { Customer } from '../types/customer'
import {
  getCustomerWithId,
  getTransactionsWithCustomerId,
  updateCustomer,
} from '../api/customers'
import { useParams, useNavigate } from 'react-router-dom'
import type { ActivityFeedType } from '../types/transaction'
import { t, TEA_NAMES } from '../constants/translations'
import { timeAgo } from '../utils/time'
import { TrendingUp, TrendingDown, Pencil, ChevronLeft, X } from 'lucide-react'

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [transactionData, setTransactionData] = useState<ActivityFeedType[]>([])
  const [editingNotes, setEditingNotes] = useState(false)
  const [noteInput, setNoteInput] = useState('')
  const [editingCustomer, setEditingCustomer] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [cityInput, setCityInput] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [refreshCount, setRefreshCount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getCustomerWithId(Number(customerId))
      .then((response) => {
        setCustomerData(response)
      })
      .catch((error) => console.error('Failed to fetch customer:', error))
  }, [customerId, refreshCount])

  useEffect(() => {
    getTransactionsWithCustomerId(Number(customerId))
      .then((response) => {
        setTransactionData(response)
      })
      .catch((error) => console.error('Failed to fetch transactions:', error))
  }, [customerId])

  const handleOpenEdit = () => {
    setNameInput(customerData?.name ?? '')
    setCityInput(customerData?.city ?? '')
    setAddressInput(customerData?.address ?? '')
    setPhoneInput(customerData?.phone ?? '')
    setEditingCustomer(true)
  }

  const handleNoteInput = async () => {
    setIsSubmitting(true)
    try {
      await updateCustomer(customerData!.id, { notes: noteInput })
      setEditingNotes(false)
      setNoteInput('')
      setRefreshCount((c) => c + 1)
    } catch {
      console.error('Failed to update note')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCustomerUpdate = async () => {
    setIsSubmitting(true)
    try {
      await updateCustomer(customerData!.id, {
        name: nameInput || customerData!.name,
        city: cityInput || customerData!.city,
        address: addressInput || null,
        phone: phoneInput || null,
      })
      setEditingCustomer(false)
      setRefreshCount((c) => c + 1)
    } catch {
      console.error('Failed to update customer')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!customerData) return <div className="px-4 pt-4">{t('loading')}</div>

  return (
    <div className="px-4 pb-28 safe-area-inset">
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center gap-1 text-sm text-[#2a5034] mt-4 mb-3"
      >
        <ChevronLeft size={16} />
        {t('manageCustomers')}
      </button>

      {/* Avatar card / inline edit */}
      {editingCustomer ? (
        <div className="card px-4 py-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#2a5034]">
              {t('updateCustomer')}
            </p>
            <button onClick={() => setEditingCustomer(false)}>
              <X size={14} className="text-gray-400" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <input
              value={nameInput}
              placeholder={t('namePlaceholder')}
              onChange={(e) => setNameInput(e.target.value)}
              className="input-base"
            />
            <input
              value={cityInput}
              placeholder={t('cityPlaceholder')}
              onChange={(e) => setCityInput(e.target.value)}
              className="input-base"
            />
            <input
              value={addressInput}
              placeholder={t('addressPlaceholder')}
              onChange={(e) => setAddressInput(e.target.value)}
              className="input-base"
            />
            <input
              value={phoneInput}
              placeholder={t('phonePlaceholder')}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="input-base"
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setEditingCustomer(false)}
                className="btn-secondary flex-1"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCustomerUpdate}
                disabled={isSubmitting}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {t('submitButton')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card px-4 py-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="avatar text-base">
              {customerData.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-[#2a5034]">
                {customerData.name}
              </p>
              <p className="text-xs text-gray-400">{customerData.city}</p>
            </div>
          </div>
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5"
          >
            <Pencil size={11} />
            {t('updateCustomer')}
          </button>
        </div>
      )}

      {/* Phone */}
      {(customerData.phone || customerData.address) && !editingCustomer && (
        <div className="card overflow-hidden mb-2">
          {customerData.phone && (
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
              <span className="text-xs text-gray-400">
                {t('phonePlaceholder')}
              </span>
              <span className="text-sm font-medium text-[#2a5034]">
                {customerData.phone}
              </span>
            </div>
          )}
          {customerData.address && (
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {t('addressPlaceholder')}
              </span>
              <span className="text-sm font-medium text-[#2a5034]">
                {customerData.address}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="card px-4 py-3 mb-4">
        <p className="section-label mt-0">{t('notesPlaceholder')}</p>
        {editingNotes ? (
          <div className="flex flex-col gap-2">
            <input
              defaultValue={customerData.notes ?? ''}
              onChange={(e) => setNoteInput(e.target.value)}
              type="text"
              className="input-base"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingNotes(false)}
                className="btn-secondary flex-1 py-2 text-xs"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleNoteInput}
                disabled={isSubmitting}
                className="btn-primary flex-1 py-2 text-xs disabled:opacity-50"
              >
                {t('saveNote')}
              </button>
            </div>
          </div>
        ) : customerData.notes ? (
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-600">{customerData.notes}</p>
            <button onClick={() => setEditingNotes(true)}>
              <Pencil size={13} className="text-gray-300 shrink-0" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingNotes(true)}
            className="text-xs text-gray-400 flex items-center gap-1"
          >
            <Pencil size={11} />
            {t('addNote')}
          </button>
        )}
      </div>

      {/* Transaction history */}
      {transactionData.length > 0 && (
        <>
          <p className="section-label">{t('transactionHistory')}</p>
          <div className="flex flex-col gap-2">
            {transactionData.map((transaction) => (
              <div
                key={`${transaction.tea_name}-${transaction.created_at}`}
                className="card px-4 py-3"
              >
                <div
                  className={`flex items-center gap-1 font-medium text-sm mb-1 ${transaction.quantity_change > 0 ? 'text-stock-add' : 'text-stock-remove'}`}
                >
                  {transaction.quantity_change > 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {Math.abs(transaction.quantity_change)}{' '}
                  {TEA_NAMES[transaction.tea_name as keyof typeof TEA_NAMES] ??
                    transaction.tea_name}
                </div>
                <div className="text-xs text-gray-500">
                  {t(transaction.packaging) ?? transaction.packaging} ·{' '}
                  {transaction.weight_grams}g ·{' '}
                  {t(transaction.flush) ?? transaction.flush} ·{' '}
                  {transaction.harvest_year}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t(transaction.transaction_type) ??
                    transaction.transaction_type}{' '}
                  · {transaction.performed_by_name} ·{' '}
                  {timeAgo(transaction.created_at)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
