import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type StockChartProps = {
  chartData: Record<string, unknown>[]
  onBarClick?: (teaId: number) => void
}

export function StockChart({ chartData, onBarClick }: StockChartProps) {
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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="silver" stackId="a" fill="#94a3b8" />
          <Bar dataKey="wing" stackId="a" fill="#60a5fa" />
          <Bar dataKey="gift" stackId="a" fill="#f472b6" />
          <Bar dataKey="standard" stackId="a" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
