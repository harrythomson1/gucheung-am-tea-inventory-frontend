import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customers'
import type { Customer } from '../types/customer'
import { useNavigate } from 'react-router-dom'
import { t } from '../constants/translations'

export function Customers() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const skip = (currentPage - 1) * 20
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    getCustomers({ skip, search: debouncedSearch || undefined }).then(
      (response) => setCustomers(response)
    )
  }, [currentPage, skip, debouncedSearch])

  return (
    <div>
      <input
        placeholder={t('customerSearch')}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => navigate(`/customers/${customer.id}`)}
          className="cursor-pointer w-fit"
        >
          {customer.name} - {customer.city}
        </div>
      ))}
      {customers.length == 20 && (
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={customers.length < 20}
        >
          {t('nextPage')}
        </button>
      )}
      {currentPage != 1 && (
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          {t('previousPage')}
        </button>
      )}
    </div>
  )
}
