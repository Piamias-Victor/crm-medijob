'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  FACTURATION_CHART_EMPTY,
} from '@/view-models/facturation-chart-copy'
import {
  FACTURATION_CHART_GRID,
  FACTURATION_CHART_HEIGHT_CLASS,
  FACTURATION_CHART_TICK,
} from '@/view-models/facturation-chart-style'

export type ActiviteLineSeries = { dataKey: string; name: string; stroke: string }

type Props = {
  data: { label: string }[]
  series: ActiviteLineSeries[]
}

export function ActiviteMultiLineChart({ data, series }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-fg-muted">{FACTURATION_CHART_EMPTY}</p>
  }
  return (
    <div className={`w-full ${FACTURATION_CHART_HEIGHT_CLASS}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke={FACTURATION_CHART_GRID} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: FACTURATION_CHART_TICK, fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: FACTURATION_CHART_TICK, fontSize: 11 }} width={40} />
          <Tooltip />
          <Legend />
          {series.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.stroke}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
