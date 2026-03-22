import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboard'
import { StockChart } from '../components/StockChart'
import { ActivityFeed } from '../components/ActivityFeed'
import { useNavigate } from 'react-router-dom'
import { TRANSLATIONS, LANGUAGE, t } from '../constants/translations'

type DashboardItem = {
  id: number
  name: string
  packaging: string
  total_stock: number
  harvest_year: number
}
export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardItem[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const availableYears = [
    ...new Set(data.map((item) => item.harvest_year)),
  ].sort((a, b) => b - a)

  const filteredData = (
    selectedYear
      ? data.filter((item) => item.harvest_year === selectedYear)
      : data
  ).filter((item) => item.total_stock > 0)

  useEffect(() => {
    getDashboard().then((response) => {
      setData(response)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <div>{TRANSLATIONS[LANGUAGE].loading}</div>

  const chartData = filteredData.reduce(
    (acc, item) => {
      const existing = acc.find((t) => t.name === item.name)
      if (existing) {
        existing[item.packaging] = item.total_stock
      } else {
        acc.push({
          id: item.id,
          name: item.name,
          [item.packaging]: item.total_stock,
        })
      }
      return acc
    },
    [] as Record<string, unknown>[]
  )

  return (
    <>
      <select
        value={selectedYear ?? ''}
        onChange={(e) =>
          setSelectedYear(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">{t('allYears')}</option>
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button onClick={() => setSelectedYear(null)}>
        {TRANSLATIONS[LANGUAGE].allYears}
      </button>
      <StockChart
        chartData={chartData}
        onBarClick={(id) => navigate(`/teas/${id}`)}
      />
      <button
        onClick={() => navigate('/add-stock')}
        className="bg-gray-200 px-4 py-2 m-1 rounded cursor-pointer"
      >
        {TRANSLATIONS[LANGUAGE].addStock}
      </button>
      <button
        onClick={() => navigate('/remove-stock')}
        className="bg-gray-200 px-4 py-2 m-1 rounded cursor-pointer"
      >
        {TRANSLATIONS[LANGUAGE].removeStock}
      </button>
      <button
        onClick={() => navigate('/teas')}
        className="bg-gray-200 px-4 py-2 m-1 rounded cursor-pointer"
      >
        {TRANSLATIONS[LANGUAGE].manageTeas}
      </button>
      <button
        onClick={() => navigate('/customers')}
        className="bg-gray-200 px-4 py-2 m-1 rounded cursor-pointer"
      >
        {TRANSLATIONS[LANGUAGE].manageCustomers}
      </button>
      <ActivityFeed />
    </>
  )
}
