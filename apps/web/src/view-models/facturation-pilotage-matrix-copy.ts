import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { facturationMonthLabelFromKey } from '@/view-models/facturation-month-key'
import type { PilotageMatrix } from '@/view-models/facturation-pilotage-matrix'

export const PILOTAGE_MATRIX_TITLE = 'Matrice commerciaux'
export const PILOTAGE_MATRIX_REFERENT = 'Referent'
export const PILOTAGE_MATRIX_TOTAL = 'Total'

export function matrixHeaders(months: string[]) {
  return [
    PILOTAGE_MATRIX_REFERENT,
    ...months.map(facturationMonthLabelFromKey),
    PILOTAGE_MATRIX_TOTAL,
  ]
}

export function matrixDisplayRows(matrix: PilotageMatrix) {
  return matrix.rows.map((row) => ({
    id: row.referentId ?? '',
    cells: [row.referentName, ...row.values.map(formatDevisPdfAmount), formatDevisPdfAmount(row.total)],
  }))
}
