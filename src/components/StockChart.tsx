import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  FLUSH_LABELS,
  PACKAGING_LABELS,
  TEA_NAMES,
} from '../constants/transalations'

type StockChartProps = {
  chartData: Record<string, unknown>[]
  onBarClick?: (teaId: number) => void
}

const COLOURS = ['#94a3b8', '#60a5fa', '#f472b6', '#4ade80', '#fb923c']

export function StockChart({ chartData, onBarClick }: StockChartProps) {
  const barKeys = [
    ...new Set(
      chartData.flatMap((d) =>
        Object.keys(d).filter((k) => k !== 'name' && k !== 'id')
      )
    ),
  ]
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
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
            tickFormatter={(value) =>
              PACKAGING_LABELS[value as keyof typeof PACKAGING_LABELS] ??
              FLUSH_LABELS[value as keyof typeof FLUSH_LABELS] ??
              TEA_NAMES[value as keyof typeof TEA_NAMES] ??
              value
            }
          />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              value,
              PACKAGING_LABELS[name as keyof typeof PACKAGING_LABELS] ??
                FLUSH_LABELS[name as keyof typeof FLUSH_LABELS] ??
                name,
            ]}
            labelFormatter={(label) =>
              TEA_NAMES[label as keyof typeof TEA_NAMES] ??
              PACKAGING_LABELS[label as keyof typeof PACKAGING_LABELS] ??
              FLUSH_LABELS[label as keyof typeof FLUSH_LABELS] ??
              label
            }
          />
          <Legend
            formatter={(value) =>
              PACKAGING_LABELS[value as keyof typeof PACKAGING_LABELS] ??
              FLUSH_LABELS[value as keyof typeof FLUSH_LABELS] ??
              value
            }
          />
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
