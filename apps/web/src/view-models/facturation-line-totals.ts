import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function facturationLineTotals(rows: FacturationSuiviRow[]) {
  return rows.reduce(
    (totals, row) => ({
      count: totals.count + 1,
      ca: totals.ca + (row.amountHt ?? 0),
      marge: totals.marge + (row.marge ?? 0),
    }),
    { count: 0, ca: 0, marge: 0 },
  )
}
