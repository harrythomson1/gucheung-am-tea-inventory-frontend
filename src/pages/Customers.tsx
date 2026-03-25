import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customers'
import type { Customer } from '../types/customer'
import { useNavigate } from 'react-router-dom'
import { t } from '../constants/translations'
import { AddCustomerModal } from '../components/AddCustomerModal'
import { Plus, Search, ChevronRight, ChevronLeft } from 'lucide-react'

export function Customers() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const skip = (currentPage - 1) * 20
  const navigate = useNavigate()

  const handleCustomerCreated = (customer: Customer) => {
    navigate(`/customers/${customer.id}`)
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    getCustomers({ skip, search: debouncedSearch || undefined })
      .then((response) => setCustomers(response))
      .catch((error) => console.error('Failed to fetch customers:', error))
  }, [currentPage, skip, debouncedSearch])

  return (
    <div className="px-4 pb-28 safe-area-inset">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm text-[#2a5034] mt-4 mb-3"
      >
        <ChevronLeft size={16} />
        {t('dashboard')}
      </button>
      <p className="section-label">{t('manageCustomers')}</p>

      <div className="relative mb-3">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder={t('customerSearch')}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9"
        />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => navigate(`/customers/${customer.id}`)}
            className="card px-4 py-3 flex items-center justify-between cursor-pointer active:opacity-70"
          >
            <div className="flex items-center gap-3">
              <div className="avatar">{customer.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-medium text-[#2a5034] mb-0.5">
                  {customer.name}
                </p>
                <p className="text-xs text-gray-400">{customer.city}</p>
                {customer.phone && (
                  <p className="text-xs text-gray-400">{customer.phone}</p>
                )}
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </div>
        ))}
      </div>

      {(customers.length === 20 || currentPage !== 1) && (
        <div className="flex gap-2 mb-4">
          {currentPage !== 1 && (
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              className="btn-secondary flex-1"
            >
              {t('previousPage')}
            </button>
          )}
          {customers.length === 20 && (
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn-secondary flex-1"
            >
              {t('nextPage')}
            </button>
          )}
        </div>
      )}

      <button
        className="btn-primary btn-full"
        onClick={() => setShowAddCustomerModal(true)}
      >
        <Plus size={16} />
        {t('addCustomer')}
      </button>

      {showAddCustomerModal && (
        <AddCustomerModal
          onClose={() => setShowAddCustomerModal(false)}
          onCustomerCreated={handleCustomerCreated}
        />
      )}
    </div>
  )
}
