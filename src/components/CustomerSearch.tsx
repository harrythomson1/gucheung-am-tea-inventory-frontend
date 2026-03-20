import { useEffect, useState } from 'react'
import { searchCustomers } from '../api/customers'
import type { Customer } from '../types/customer'

type CustomerSearchProps = {
  onSelect: (customer: Customer) => void
}

export function CustomerSearch({ onSelect }: CustomerSearchProps) {
  const [search, setSearch] = useState<string>('')
  const [results, setResults] = useState<Customer[]>([])

  useEffect(() => {
    if (!search) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      searchCustomers(search).then((response) => setResults(response))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])
  return (
    <div>
      <input
        placeholder="고객 검색"
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      {results.map((result) => (
        <div
          className={`px-4 py-2 m-1 rounded w-fit 'bg-gray-200'}`}
          key={result.id}
        >
          <button
            key={result.id}
            type="button"
            onClick={() => {
              onSelect(result)
            }}
          >
            {result.name} - {result.city} - {result.phone}
          </button>
        </div>
      ))}
    </div>
  )
}
