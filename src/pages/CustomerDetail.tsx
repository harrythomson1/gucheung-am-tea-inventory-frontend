import { useState, useEffect } from 'react'
import type { Customer } from '../types/customer'
import { getCustomerWithId } from '../api/customers'
import { useParams } from 'react-router-dom'

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>()
  const [customerData, setCustomerData] = useState<Customer | null>(null)

  useEffect(() => {
    getCustomerWithId(Number(customerId)).then((response) => {
      setCustomerData(response)
    })
  }, [customerId])

  if (!customerData) return <div>로딩 중...</div>

  return (
    <div>
      <div>{customerData.name}</div>
    </div>
  )
}
