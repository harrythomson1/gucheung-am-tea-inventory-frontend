import { useEffect, useState } from 'react'
import { getTeas } from '../api/tea'

type Inputs = {
  tea_id: number
  packaging: string
  flush: string
  harvest_year: number
  weight_grams: number
  quantity_change: number
  notes: string | undefined
}

export default function AddStockForm() {
  const [teas, setTeas] = useState([])
  useEffect(() => {
    getTeas().then((response) => setTeas(response))
  }, [])
  return <div>Add stock form</div>
}
