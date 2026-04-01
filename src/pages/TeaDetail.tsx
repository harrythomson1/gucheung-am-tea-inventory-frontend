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

const DROPDOWN_CLASS =
  'appearance-none bg-[#e0e0c8] text-[#2a5034] font-medium text-sm px-3 py-2 pr-7 rounded-xl border-none cursor-pointer w-full'

function FilterDropdown({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={DROPDOWN_CLASS}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#2a5034] text-xs">
        ▼
      </span>
    </div>
  )
}

export function TeaDetail() {
  const { teaId } = useParams<{ teaId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<TeaVariantStockItem[]>([])
  const teaName = data[0]?.tea_name
  const [groupBy, setGroupBy] = useState<
    'flush' | 'packaging' | 'weight_grams'
  >('packaging')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedPackaging, setSelectedPackaging] = useState<string>('')
  const [selectedFlush, setSelectedFlush] = useState<string>('')
  const [selectedWeight, setSelectedWeight] = useState<string>('')

  useEffect(() => {
    const id = Number(teaId)
    getTeaStock(id)
      .then((response) => setData(response))
      .catch((error) => console.error('Failed to fetch tea stock:', error))
  }, [teaId])

  const nonZeroData = data.filter((item) => item.current_stock > 0)

  const availableYears = [
    ...new Set(nonZeroData.map((item) => item.harvest_year)),
  ].sort((a, b) => b - a)
  const availablePackaging = [
    ...new Set(nonZeroData.map((item) => item.packaging)),
  ]
  const availableFlush = [...new Set(nonZeroData.map((item) => item.flush))]
  const availableWeights = [
    ...new Set(nonZeroData.map((item) => item.weight_grams)),
  ].sort((a, b) => a - b)

  const filteredData = nonZeroData.filter((item) => {
    if (selectedYear && item.harvest_year !== Number(selectedYear)) return false
    if (selectedPackaging && item.packaging !== selectedPackaging) return false
    if (selectedFlush && item.flush !== selectedFlush) return false
    if (selectedWeight && item.weight_grams !== Number(selectedWeight))
      return false
    return true
  })

  const totalStock = filteredData.reduce(
    (sum, item) => sum + item.current_stock,
    0
  )

  const stackBy =
    groupBy === 'packaging'
      ? 'flush'
      : groupBy === 'flush'
        ? 'packaging'
        : 'flush'

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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-[#2a5034] mt-4 mb-3"
      >
        <ChevronLeft size={16} />
        {t('dashboard')}
      </button>

      {/* Filter dropdowns */}
      <div className="flex gap-2 mb-2">
        <FilterDropdown value={selectedYear} onChange={setSelectedYear}>
          <option value="">{t('allYears')}</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </FilterDropdown>

        <FilterDropdown
          value={selectedPackaging}
          onChange={setSelectedPackaging}
        >
          <option value="">{t('allPackaging')}</option>
          {availablePackaging.map((p) => (
            <option key={p} value={p}>
              {t(p) ?? p}
            </option>
          ))}
        </FilterDropdown>

        <FilterDropdown value={selectedFlush} onChange={setSelectedFlush}>
          <option value="">{t('allFlush')}</option>
          {availableFlush.map((f) => (
            <option key={f} value={f}>
              {t(f) ?? f}
            </option>
          ))}
        </FilterDropdown>

        <FilterDropdown value={selectedWeight} onChange={setSelectedWeight}>
          <option value="">{t('allWeights')}</option>
          {availableWeights.map((w) => (
            <option key={w} value={w}>
              {w}g
            </option>
          ))}
        </FilterDropdown>
      </div>

      {/* Group by buttons */}
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
