import { StockChart } from '../components/StockChart'
import { useState, useEffect } from 'react'
import { getTeaStock } from '../api/tea'
import { useParams, useNavigate } from 'react-router-dom'
import { t, TEA_NAMES } from '../constants/translations'
import { ActivityFeed } from '../components/ActivityFeed'
import { ChevronLeft } from 'lucide-react'

type TeaVariantStockItem = {
  id: number
  tea_name: string
  packaging: string
  flush: string
  harvest_year: number
  weight_grams: number
  current_stock: number
}

export function TeaDetail() {
  const { teaId } = useParams<{ teaId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<TeaVariantStockItem[]>([])
  const teaName = data[0]?.tea_name
  const [groupBy, setGroupBy] = useState<
    'flush' | 'packaging' | 'weight_grams'
  >('packaging')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const stackBy = groupBy === 'packaging' ? 'flush' : 'packaging'

  useEffect(() => {
    const id = Number(teaId)
    getTeaStock(id)
      .then((response) => {
        setData(response)
      })
      .catch((error) => console.error('Failed to fetch tea stock:', error))
  }, [teaId])

  const availableYears = [
    ...new Set(
      data
        .filter((item) => item.current_stock > 0)
        .map((item) => item.harvest_year)
    ),
  ].sort((a, b) => b - a)

  const filteredData = selectedYear
    ? data.filter((item) => item.harvest_year === selectedYear)
    : data

  const totalStock = filteredData.reduce(
    (sum, item) => sum + item.current_stock,
    0
  )

  const chartData = filteredData.reduce(
    (acc, item) => {
      const key = String(item[groupBy])
      const existing = acc.find((t) => t.name === key)
      if (existing) {
        const stackKey = String(item[stackBy])
        existing[stackKey] =
          ((existing[stackKey] as number) || 0) + item.current_stock
      } else {
        acc.push({ name: key, [String(item[stackBy])]: item.current_stock })
      }
      return acc
    },
    [] as Record<string, unknown>[]
  )

  const filters: {
    key: 'packaging' | 'flush' | 'weight_grams'
    label: string
  }[] = [
    { key: 'packaging', label: t('packaging') },
    { key: 'flush', label: t('flush') },
    { key: 'weight_grams', label: t('weight') },
  ]

  return (
    <div className="px-4 pb-28 safe-area-inset">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-[#2a5034] mt-4 mb-3"
      >
        <ChevronLeft size={16} />
        {t('dashboard')}
      </button>

      {/* Year dropdown + filter toggles */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <select
            value={selectedYear ?? ''}
            onChange={(e) =>
              setSelectedYear(e.target.value ? Number(e.target.value) : null)
            }
            className="appearance-none bg-[#e0e0c8] text-[#2a5034] font-medium text-sm px-4 py-2 pr-8 rounded-xl border-none cursor-pointer"
          >
            <option value="">{t('allYears')}</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#2a5034] text-xs">
            ▼
          </span>
        </div>

        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setGroupBy(key)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
              groupBy === key
                ? 'bg-[#2a5034] text-white'
                : 'bg-[#e0e0c8] text-[#2a5034]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <StockChart chartData={chartData} />

      {/* Tea name + total stock */}
      <div className="card bg-[#e8e8d5] border border-[#d4d4bc] px-4 py-4 flex items-center justify-between my-2">
        <p className="text-3xl font-medium text-[#2a5034]">
          {teaName
            ? (TEA_NAMES[teaName as keyof typeof TEA_NAMES] ?? teaName)
            : '...'}
        </p>
        <div className="text-right">
          <p className="text-sm text-gray-400">{t('totalStock')}</p>
          <p className="text-lg font-medium text-[#2a5034]">{totalStock}</p>
        </div>
      </div>

      {/* Activity feed */}
      <p className="section-label">{t('recentActivity')}</p>
      <ActivityFeed teaId={teaId} />
    </div>
  )
}
