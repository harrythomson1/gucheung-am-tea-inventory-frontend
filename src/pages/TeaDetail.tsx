import { StockChart } from '../components/StockChart'
import { useState, useEffect } from 'react'
import { getTeaStock } from '../api/tea'
import { useParams } from 'react-router-dom'

type TeaVariantStockItem = {
  id: number
  packaging: string
  flush: string
  harvest_year: number
  weight_grams: number
  current_stock: number
}

export function TeaDetail() {
  const { teaId } = useParams<{ teaId: string }>()
  const [data, setData] = useState<TeaVariantStockItem[]>([])
  const [groupBy, setGroupBy] = useState<
    'flush' | 'packaging' | 'harvest_year'
  >('packaging')
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
        existing[item.packaging] = item.current_stock
      } else {
        acc.push({ name: key, [item.packaging]: item.current_stock })
      }
      return acc
    },
    [] as Record<string, unknown>[]
  )

  return (
    <>
      <button onClick={() => setGroupBy('packaging')}>By Packaging</button>
      <button onClick={() => setGroupBy('flush')}>By Flush</button>
      <button onClick={() => setGroupBy('harvest_year')}>By Year</button>
      <StockChart chartData={chartData} />
    </>
  )
}
