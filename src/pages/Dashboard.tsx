import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboard'
import { StockChart } from '../components/StockChart'
import { ActivityFeed } from '../components/ActivityFeed'
import { useNavigate } from 'react-router-dom'
import { LANGUAGE, t } from '../constants/translations'
import { Plus, Minus, Leaf, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { LoadingScreen } from '../components/LoadingScreen'

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
  const { isAdmin } = useAuth()

  const nonZeroData = data.filter((item) => item.total_stock > 0)

  const availableYears = [
    ...new Set(nonZeroData.map((item) => item.harvest_year)),
  ].sort((a, b) => b - a)

  const filteredData = selectedYear
    ? nonZeroData.filter((item) => item.harvest_year === selectedYear)
    : nonZeroData

  useEffect(() => {
    getDashboard()
      .then((response) => {
        setData(response)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch dashboard:', error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) return <LoadingScreen />

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
    <div className="px-4 pb-28 safe-area-inset pt-4">
      <div className="relative inline-block mb-4">
        <select
          value={selectedYear ?? ''}
          onChange={(e) =>
            setSelectedYear(e.target.value ? Number(e.target.value) : null)
          }
          className="appearance-none bg-[#e0e0c8] text-stock-add font-medium text-sm px-4 py-2 pr-8 rounded-xl border-none cursor-pointer"
        >
          <option value="">{t('allYears')}</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stock-add text-xs">
          ▼
        </span>
      </div>

      <StockChart
        chartData={chartData}
        onBarClick={(id) => navigate(`/teas/${id}`)}
      />

      <p className="text-xs text-gray-400 uppercase tracking-wider mt-4 mb-2">
        {t('manage')}
      </p>
      <div className="flex gap-2 mb-6">
        {isAdmin && (
          <button
            onClick={() => navigate('/teas')}
            className="btn-secondary btn-full"
          >
            <Leaf size={14} />
            {t('manageTeas')}
          </button>
        )}
        <button
          onClick={() => navigate('/customers')}
          className="btn-secondary btn-full"
        >
          <Users size={14} />
          {t('manageCustomers')}
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
          <Plus size={18} />
          {t('addStock')}
        </button>
        <button
          onClick={() => navigate('/remove-stock')}
          className="btn btn-danger btn-full"
        >
          <Minus size={18} />
          {t('removeStock')}
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 py-4 mt-2">
        <button
          onClick={() => {
            localStorage.setItem('language', LANGUAGE === 'ko' ? 'en' : 'ko')
            window.location.reload()
          }}
          className="text-xs text-gray-400 flex items-center gap-1"
        >
          🌐 {LANGUAGE === 'ko' ? 'English' : '한국어'}
        </button>
        <span className="text-gray-300 text-xs">|</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs text-gray-400"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}
