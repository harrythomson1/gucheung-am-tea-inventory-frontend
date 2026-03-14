import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboard'
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts'

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
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="silver" stackId="a" fill="#94a3b8" />
          <Bar dataKey="wing" stackId="a" fill="#60a5fa" />
          <Bar dataKey="gift" stackId="a" fill="#f472b6" />
          <Bar dataKey="standard" stackId="a" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
