import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customers'
import type { Customer } from '../types/customer'
import { t } from '../constants/translations'
import { Search } from 'lucide-react'

type CustomerSearchProps = {
  onSelect: (customer: Customer) => void
}

export function CustomerSearch({ onSelect }: CustomerSearchProps) {
  const [search, setSearch] = useState<string>('')
  const [results, setResults] = useState<Customer[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search) {
        setResults([])
        return
      }
      getCustomers({ search }).then((response) => setResults(response))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
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
      {results.length > 0 && (
        <div className="flex flex-col gap-1">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => onSelect(result)}
              className="card px-4 py-3 flex items-center gap-3 text-left active:opacity-70"
            >
              <div className="avatar">{result.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-medium text-[#2a5034]">
                  {result.name}
                </p>
                <p className="text-xs text-gray-400">
                  {result.city}
                  {result.phone ? ` · ${result.phone}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
