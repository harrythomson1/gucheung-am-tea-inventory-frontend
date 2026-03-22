import { useState, useEffect } from 'react'
import type { Customer } from '../types/customer'
import {
  getCustomerWithId,
  getTransactionsWithCustomerId,
  updateCustomer,
} from '../api/customers'
import { useParams } from 'react-router-dom'
import type { ActivityFeedType } from '../types/transaction'
import { t, TEA_NAMES } from '../constants/translations'
import { timeAgo } from '../utils/time'
import { UpdateCustomerModal } from '../components/UpdateCustomerModal'

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>()
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [transactionData, setTransactionData] = useState<ActivityFeedType[]>([])
  const [editingNotes, setEditingNotes] = useState(false)
  const [noteInput, setNoteInput] = useState(customerData?.notes ?? '')
  const [refreshCount, setRefreshCount] = useState<number>(0)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getCustomerWithId(Number(customerId)).then((response) => {
      setCustomerData(response)
    })
  }, [customerId, refreshCount])

  useEffect(() => {
    getTransactionsWithCustomerId(Number(customerId)).then((response) => {
      setTransactionData(response)
    })
  }, [customerId])

  const handleNoteInput = async () => {
    setIsSubmitting(false)
    try {
      await updateCustomer(customerData!.id, { notes: noteInput })
      setEditingNotes(false)
      setNoteInput('')
      setRefreshCount((c) => c + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!customerData) return <div>{t('loading')}</div>

  return (
    <div>
      <div>{customerData.name}</div>
      <div>
        {transactionData.map((transaction) => (
          <div
            key={`${transaction.tea_name}-${transaction.created_at}`}
            className="p-3 mb-2 border rounded-lg"
          >
            <div
              className={`font-bold text-lg ${transaction.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {transaction.quantity_change > 0 ? '+' : ''}
              {transaction.quantity_change}{' '}
              {`${TEA_NAMES[transaction.tea_name as keyof typeof TEA_NAMES] ?? transaction.tea_name}`}
            </div>
            <div className="text-sm text-gray-600">
              {t(transaction.packaging) ?? transaction.packaging} ·{' '}
              {transaction.weight_grams}g ·{' '}
              {t(transaction.flush) ?? transaction.flush} ·{' '}
              {transaction.harvest_year}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {t(transaction.transaction_type) ?? transaction.transaction_type}{' '}
              · {transaction.performed_by_name} ·{' '}
              {timeAgo(transaction.created_at)}
            </div>
          </div>
        ))}
        {editingNotes ? (
          <>
            <input onChange={(e) => setNoteInput(e.target.value)} type="text" />
            <button onClick={() => handleNoteInput()} disabled={isSubmitting}>
              {t('saveNote')}
            </button>
          </>
        ) : customerData.notes ? (
          <>
            <div>{customerData.notes}</div>
            <button onClick={() => setEditingNotes(true)}>
              {t('editNote')}
            </button>
          </>
        ) : (
          <button onClick={() => setEditingNotes(true)}>{t('addNote')}</button>
        )}
        <button onClick={() => setShowUpdateModal(true)}>
          {t('updateCustomer')}
        </button>
        {showUpdateModal && (
          <UpdateCustomerModal
            onClose={() => setShowUpdateModal(false)}
            onCustomerUpdated={() => setRefreshCount((c) => c + 1)}
            currentCustomer={customerData}
          />
        )}
      </div>
    </div>
  )
}
