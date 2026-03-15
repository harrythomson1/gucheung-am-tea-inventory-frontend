import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboard'
import { StockChart } from '../components/StockChart'
import { AddStockForm } from '../components/AddStockForm'
import { RemoveStockForm } from '../components/RemoveStockForm'
import { ActivityFeed } from '../components/ActivityFeed'

type DashboardItem = {
  id: number
  name: string
  packaging: string
  total_stock: number
}
export default function Dashboard() {
  const [data, setData] = useState<DashboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getDashboard().then((response) => {
      setData(response)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <div>Loading...</div>

  const chartData = data.reduce(
    (acc, item) => {
      const existing = acc.find((t) => t.name === item.name)
      if (existing) {
        existing[item.packaging] = item.total_stock
      } else {
        acc.push({ name: item.name, [item.packaging]: item.total_stock })
      }
      return acc
    },
    [] as Record<string, unknown>[]
  )

  return (
    <>
      <StockChart chartData={chartData} />
      <AddStockForm />
      <RemoveStockForm />
      <ActivityFeed />
    </>
  )
}
