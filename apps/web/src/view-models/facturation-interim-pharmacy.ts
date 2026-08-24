import { roundMoney } from '@/lib/finance/calculate-interim-libre'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export type InterimPharmacyAggregate = {
  pharmacyId: string
  pharmacyName: string
  count: number
  hours: number
  ca: number
  marge: number
  caPerHour: number
  margePerHour: number
  lastDate: Date | null
}

type PharmacyTotals = Omit<InterimPharmacyAggregate, 'caPerHour' | 'margePerHour'>

function perHour(amount: number, hours: number) {
  return hours === 0 ? 0 : roundMoney(amount / hours)
}

function laterDate(current: Date | null, next: Date | null) {
  if (!next) return current
  if (!current || next.getTime() > current.getTime()) return next
  return current
}

function withRates(row: PharmacyTotals): InterimPharmacyAggregate {
  return {
    ...row,
    caPerHour: perHour(row.ca, row.hours),
    margePerHour: perHour(row.marge, row.hours),
  }
}

function emptyTotals(row: FacturationSuiviRow): PharmacyTotals {
  return {
    pharmacyId: row.pharmacyId,
    pharmacyName: row.pharmacyName,
    count: 0,
    hours: 0,
    ca: 0,
    marge: 0,
    lastDate: null,
  }
}

export function buildInterimPharmacyAggregates(
  rows: FacturationSuiviRow[],
): InterimPharmacyAggregate[] {
  const byPharmacy = new Map<string, PharmacyTotals>()
  for (const row of rows) {
    const current = byPharmacy.get(row.pharmacyId) ?? emptyTotals(row)
    current.count += 1
    current.hours += row.hours ?? 0
    current.ca += row.amountHt ?? 0
    current.marge += row.marge ?? 0
    current.lastDate = laterDate(current.lastDate, row.acceptedAt)
    byPharmacy.set(row.pharmacyId, current)
  }
  return [...byPharmacy.values()].map(withRates).sort((a, b) => b.ca - a.ca)
}
