import { useState, useEffect } from 'react'
import type { Customer } from '../types/customer'
import {
  getCustomerWithId,
  getTransactionsWithCustomerId,
} from '../api/customers'
import { useParams } from 'react-router-dom'
import type { ActivityFeedType } from '../types/transaction'
import {
  FLUSH_LABELS,
  PACKAGING_LABELS,
  TEA_NAMES,
  TRANSACTION_TYPE_LABELS,
} from '../constants/transalations'
import { timeAgo } from '../utils/time'

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>()
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [transactionData, setTransactionData] = useState<ActivityFeedType[]>([])
  const [editingNotes, setEditingNotes] = useState(false)

  useEffect(() => {
    getCustomerWithId(Number(customerId)).then((response) => {
      setCustomerData(response)
    })
  }, [customerId])

  useEffect(() => {
    getTransactionsWithCustomerId(Number(customerId)).then((response) => {
      setTransactionData(response)
    })
  }, [customerId])

  if (!customerData) return <div>로딩 중...</div>

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
              {PACKAGING_LABELS[
                transaction.packaging as keyof typeof PACKAGING_LABELS
              ] ?? transaction.packaging}{' '}
              · {transaction.weight_grams}g ·{' '}
              {FLUSH_LABELS[transaction.flush as keyof typeof FLUSH_LABELS] ??
                transaction.flush}{' '}
              · {transaction.harvest_year}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {TRANSACTION_TYPE_LABELS[
                transaction.transaction_type as keyof typeof TRANSACTION_TYPE_LABELS
              ] ?? transaction.transaction_type}{' '}
              · {transaction.performed_by_name} ·{' '}
              {timeAgo(transaction.created_at)}
            </div>
          </div>
        ))}
        {editingNotes ? (
          <>
            <input type="text" />
            <button onClick={() => setEditingNotes(false)}>Save note</button>
          </>
        ) : customerData.notes ? (
          <>
            <div>{customerData.notes}</div>
            <button onClick={() => setEditingNotes(true)}>Edit note</button>
          </>
        ) : (
          <button onClick={() => setEditingNotes(true)}>Add note</button>
        )}
      </div>
    </div>
  )
}
