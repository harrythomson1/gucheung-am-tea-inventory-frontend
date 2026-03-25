import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { t, TEA_NAMES } from '../constants/translations'

type StockChartProps = {
  chartData: Record<string, unknown>[]
  onBarClick?: (teaId: number) => void
}

const COLOURS = ['#7a9e7e', '#c4a882', '#9b7b6b', '#b5c4a1', '#d4b896']

export function StockChart({ chartData, onBarClick }: StockChartProps) {
  const barKeys = [
    ...new Set(
      chartData.flatMap((d) =>
        Object.keys(d).filter((k) => k !== 'name' && k !== 'id')
      )
    ),
  ]

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-75 text-sm text-gray-400">
        {t('noStockData')}
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 0, bottom: 0, left: -18 }}
          onClick={(data) => {
            if (onBarClick && data?.activeLabel) {
              const tea = chartData.find((t) => t.name === data.activeLabel)
              if (tea) {
                onBarClick(tea.id as number)
              }
            }
          }}
        >
          <XAxis
            dataKey="name"
            tickFormatter={(value) => t(value) ?? value}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [value, t(String(name ?? ''))]}
            labelFormatter={(label) =>
              TEA_NAMES[label as keyof typeof TEA_NAMES] ?? t(label) ?? label
            }
          />
          <Legend formatter={(value) => t(value) ?? value} />
          {barKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={COLOURS[index % COLOURS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
