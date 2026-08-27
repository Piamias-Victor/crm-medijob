import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { facturationMonthLabelFromKey } from '@/view-models/facturation-month-key'
import type { PolePeriod } from '@/view-models/facturation-pilotage-pole-progress'

export const PILOTAGE_POLE_TITLE = 'Objectifs par pôle'
export const PILOTAGE_POLE_PLACEMENT = 'Placement'
export const PILOTAGE_POLE_INTERIM = 'Intérim'
export const PILOTAGE_POLE_MONTH = 'Mois'
export const PILOTAGE_POLE_YEAR = 'Annuel'
export const PILOTAGE_POLE_CA = 'CA'
export const PILOTAGE_POLE_MARGE = 'Marge'
export const PILOTAGE_POLE_PERIOD_TABS = [
  { id: 'month', label: PILOTAGE_POLE_MONTH },
  { id: 'year', label: PILOTAGE_POLE_YEAR },
] as const

export function formatPilotageRatio(value: number, objectif: number) {
  return `${formatDevisPdfAmount(value)} / ${formatDevisPdfAmount(objectif)}`
}

export function poleMonthOptions(months: string[]) {
  return months.map((month) => ({ value: month, label: facturationMonthLabelFromKey(month) }))
}

export function polePeriodCaption(period: PolePeriod, month: string) {
  return period === 'year' ? PILOTAGE_POLE_YEAR : facturationMonthLabelFromKey(month)
}
