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
    <div className="px-4 pb-28 safe-area-inset">
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

      <p className="text-xs text-gray-400 uppercase tracking-wider mt-4 mb-2">
        {t('manage')}
      </p>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => navigate('/teas')}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm"
        >
          {TRANSLATIONS[LANGUAGE].manageTeas}
        </button>
        <button
          onClick={() => navigate('/customers')}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm"
        >
          {TRANSLATIONS[LANGUAGE].manageCustomers}
        </button>
      </div>

      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
        {t('recentActivity')}
      </p>
      <ActivityFeed />

      <div className="fixed bottom-0 left-0 right-0 bg-[#f2f2e1] border-t border-gray-200 px-4 pt-3 pb-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/add-stock')}
          className="btn-primary btn-full"
        >
          + {TRANSLATIONS[LANGUAGE].addStock}
        </button>
        <button
          onClick={() => navigate('/remove-stock')}
          className="btn btn-danger btn-full"
        >
          − {TRANSLATIONS[LANGUAGE].removeStock}
        </button>
      </div>
    </div>
  )
}
