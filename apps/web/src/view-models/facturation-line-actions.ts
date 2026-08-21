import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function canGenerateDevisFromRow(row: FacturationSuiviRow): boolean {
  return Boolean(row.financeLineId && row.missionId && !row.devisId)
}

export function facturationRowOriginLabel(row: FacturationSuiviRow): string {
  if (!row.financeLineId) return 'Devis'
  return row.lineKind === 'INTERIM' ? 'Intérim' : 'Placement'
}
