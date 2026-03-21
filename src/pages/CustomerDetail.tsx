import { useState, useEffect } from 'react'
import type { Customer } from '../types/customer'
import {
  getCustomerWithId,
  getTransactionsWithCustomerId,
} from '../api/customers'
import { useParams } from 'react-router-dom'
import type { ActivityFeedType } from '../types/transaction'

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>()
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [transactionData, setTransactionData] = useState<ActivityFeedType[]>([])

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
          <>
            <div>{transaction.tea_name}</div>
            <div>{transaction.weight_grams}</div>
            <div>{transaction.quantity_change}</div>
          </>
        ))}
      </div>
    </div>
  )
}
