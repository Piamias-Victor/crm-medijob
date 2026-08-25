import { annualFromMonthly } from '@/view-models/objectif'
import { facturationMonthKey } from '@/view-models/facturation-month-key'
import type { PilotagePoleSeries } from '@/view-models/facturation-pilotage-poles'

export type PolePeriod = 'month' | 'year'

export function poleProgress(
  series: PilotagePoleSeries,
  monthlyCa: number,
  monthlyMarge: number,
  period: PolePeriod,
  month: string,
) {
  if (period === 'year') {
    const caObjectif = annualFromMonthly(monthlyCa)
    const margeObjectif = annualFromMonthly(monthlyMarge)
    return {
      ca: series.annualCa,
      marge: series.annualMarge,
      caObjectif,
      margeObjectif,
      caPct: meterPct(series.annualCa, caObjectif),
      margePct: meterPct(series.annualMarge, margeObjectif),
    }
  }
  const row = series.months.find((item) => item.month === month)
  return {
    ca: row?.ca ?? 0,
    marge: row?.marge ?? 0,
    caObjectif: monthlyCa,
    margeObjectif: monthlyMarge,
    caPct: meterPct(row?.ca ?? 0, monthlyCa),
    margePct: meterPct(row?.marge ?? 0, monthlyMarge),
  }
}

function meterPct(value: number, max: number) {
  return max === 0 ? 0 : Math.min(100, Math.round((value / max) * 1000) / 10)
}

export type PoleProgress = ReturnType<typeof poleProgress>

export function defaultPoleMonth(months: string[], now = new Date()) {
  if (months.length === 0) return facturationMonthKey(now)
  const current = facturationMonthKey(now)
  return months.includes(current) ? current : (months.at(-1) ?? current)
}
