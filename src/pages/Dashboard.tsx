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
  harvest_year: number
}
export default function Dashboard() {
  const [data, setData] = useState<DashboardItem[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const availableYears = [
    ...new Set(data.map((item) => item.harvest_year)),
  ].sort((a, b) => b - a)

  const filteredData = selectedYear
    ? data.filter((item) => item.harvest_year === selectedYear)
    : data

  useEffect(() => {
    getDashboard().then((response) => {
      setData(response)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <div>Loading...</div>

  const chartData = filteredData.reduce(
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
      {availableYears.map((year) => (
        <button
          key={year}
          className={`px-4 py-2 m-1 rounded`}
          type="button"
          onClick={() => {
            setSelectedYear(year)
          }}
        >
          {year}
        </button>
      ))}
      <button onClick={() => setSelectedYear(null)}>All</button>
      <StockChart chartData={chartData} />
      <AddStockForm />
      <RemoveStockForm />
      <ActivityFeed />
    </>
  )
}
