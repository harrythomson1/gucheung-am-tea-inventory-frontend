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
    'flush' | 'packaging' | 'harvest_year'
  >('packaging')
  const stackBy = groupBy === 'packaging' ? 'flush' : 'packaging'

  useEffect(() => {
    const id = Number(teaId)
    getTeaStock(id).then((response) => {
      setData(response)
    })
  }, [teaId])

  const totalStock = data.reduce((sum, item) => sum + item.current_stock, 0)

  const chartData = data.reduce(
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
    key: 'packaging' | 'flush' | 'harvest_year'
    label: string
  }[] = [
    { key: 'packaging', label: t('packaging') },
    { key: 'flush', label: t('flush') },
    { key: 'harvest_year', label: t('year') },
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

      {/* Filter toggles */}
      <div className="flex gap-2 mb-3">
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
          {TEA_NAMES[teaName as keyof typeof TEA_NAMES] ?? teaName}
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
