import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboard'

type DashboardItem = {
  id: number
  name: string
  packaging: string
  total_stock: number
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardItem[]>([])

  useEffect(() => {
    getDashboard().then((response) => setData(response))
  })
  return (
    <div>
      {data.map((item) => (
        <div key={`${item.id}-${item.packaging}`}>
          {item.name} - {item.packaging} - {item.total_stock}
        </div>
      ))}
    </div>
  )
}
