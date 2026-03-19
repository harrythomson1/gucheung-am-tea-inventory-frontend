import { useEffect, useState } from 'react'
import { searchCustomers } from '../api/customers'
import type { Customer } from '../types/customer'

export function CustomerSearch() {
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
      <input onChange={(e) => setSearch(e.target.value)}></input>
      {results.map((result) => (
        <div key={result.id}>
          <span>{result.name}</span>
          <span>{result.city}</span>
        </div>
      ))}
    </div>
  )
}
