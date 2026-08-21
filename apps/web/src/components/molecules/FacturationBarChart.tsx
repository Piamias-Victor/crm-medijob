'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import {
  FACTURATION_CHART_CA,
  FACTURATION_CHART_EMPTY,
  FACTURATION_CHART_MARGE,
} from '@/view-models/facturation-chart-copy'
import {
  FACTURATION_CHART_CA_FILL,
  FACTURATION_CHART_GRID,
  FACTURATION_CHART_HEIGHT_CLASS,
  FACTURATION_CHART_LABEL_MAX,
  FACTURATION_CHART_MARGE_FILL,
  FACTURATION_CHART_TICK,
} from '@/view-models/facturation-chart-style'
import type { FacturationSliceBucket } from '@/view-models/facturation-slice-bucket'

type Props = { data: FacturationSliceBucket[] }

function shortLabel(label: string) {
  if (label.length <= FACTURATION_CHART_LABEL_MAX) return label
  return `${label.slice(0, FACTURATION_CHART_LABEL_MAX - 1)}…`
}

function formatChartValue(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  return formatDevisPdfAmount(Number(raw ?? 0))
}

export function FacturationBarChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-fg-muted">{FACTURATION_CHART_EMPTY}</p>
  }
  return (
    <div className={`w-full ${FACTURATION_CHART_HEIGHT_CLASS}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke={FACTURATION_CHART_GRID} vertical={false} />
          <XAxis
            dataKey="label"
            tickFormatter={shortLabel}
            tick={{ fill: FACTURATION_CHART_TICK, fontSize: 12 }}
          />
          <YAxis
            tickFormatter={formatChartValue}
            tick={{ fill: FACTURATION_CHART_TICK, fontSize: 11 }}
            width={88}
          />
          <Tooltip formatter={formatChartValue} />
          <Legend />
          <Bar
            dataKey="ca"
            name={FACTURATION_CHART_CA}
            fill={FACTURATION_CHART_CA_FILL}
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="marge"
            name={FACTURATION_CHART_MARGE}
            fill={FACTURATION_CHART_MARGE_FILL}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
