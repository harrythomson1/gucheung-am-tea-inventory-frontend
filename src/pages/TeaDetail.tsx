import { StockChart } from '../components/StockChart'
import { useState, useEffect } from 'react'
import { getTeaStock } from '../api/tea'
import { useParams } from 'react-router-dom'
import { t, TEA_NAMES } from '../constants/translations'

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

  return (
    <>
      <div>{TEA_NAMES[teaName as keyof typeof TEA_NAMES] ?? teaName}</div>
      <button
        onClick={() => setGroupBy('packaging')}
        className={`px-4 py-2 m-1 rounded ${groupBy === 'packaging' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {t('packaging')}
      </button>
      <button
        onClick={() => setGroupBy('flush')}
        className={`px-4 py-2 m-1 rounded ${groupBy === 'flush' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {t('flush')}
      </button>
      <button
        onClick={() => setGroupBy('harvest_year')}
        className={`px-4 py-2 m-1 rounded ${groupBy === 'harvest_year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {t('year')}
      </button>
      <StockChart chartData={chartData} />
    </>
  )
}
