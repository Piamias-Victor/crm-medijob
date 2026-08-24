'use client'

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { FACTURATION_CHART_EMPTY } from '@/view-models/facturation-chart-copy'
import {
  FACTURATION_CHART_COMPOSED_HEIGHT_CLASS,
  FACTURATION_CHART_GRID,
  FACTURATION_CHART_TICK,
} from '@/view-models/facturation-chart-style'

export type ComposedBarSeries = { dataKey: string; name: string; fill: string; stackId?: string }
export type ComposedLineSeries = { dataKey: string; name: string; stroke: string }

type Props = {
  data: { label: string }[]
  bars: ComposedBarSeries[]
  lines: ComposedLineSeries[]
}

function formatChartValue(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  return formatDevisPdfAmount(Number(raw ?? 0))
}

export function FacturationComposedChart({ data, bars, lines }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-fg-muted">{FACTURATION_CHART_EMPTY}</p>
  }
  return (
    <div className={`w-full ${FACTURATION_CHART_COMPOSED_HEIGHT_CLASS}`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke={FACTURATION_CHART_GRID} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: FACTURATION_CHART_TICK, fontSize: 12 }} />
          <YAxis
            tickFormatter={formatChartValue}
            tick={{ fill: FACTURATION_CHART_TICK, fontSize: 11 }}
            width={88}
          />
          <Tooltip formatter={formatChartValue} />
          <Legend />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.fill}
              stackId={bar.stackId}
              radius={[4, 4, 0, 0]}
            />
          ))}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.stroke}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
