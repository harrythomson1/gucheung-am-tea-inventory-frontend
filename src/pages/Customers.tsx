import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customers'
import type { Customer } from '../types/customer'

export function Customers() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const skip = (currentPage - 1) * 20

  useEffect(() => {
    getCustomers({ skip: skip }).then((response) => setCustomers(response))
  }, [currentPage, skip])
  return (
    <div>
      {customers.map((customer) => (
        <div key={customer.id}>
          {customer.name} - {customer.city}
        </div>
      ))}
      {customers.length == 20 && (
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={customers.length < 20}
        >
          Next page
        </button>
      )}
      {currentPage != 1 && (
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Previous page
        </button>
      )}
    </div>
  )
}
