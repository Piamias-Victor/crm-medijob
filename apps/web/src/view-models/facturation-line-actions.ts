import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

export function canGenerateDevisFromRow(row: FacturationSuiviRow): boolean {
  return Boolean(row.financeLineId && !row.devisId)
}

export function canSendDevisFromRow(row: FacturationSuiviRow): boolean {
  if (!row.financeLineId) return false
  return row.devisStatus !== 'SENT' && row.devisStatus !== 'ACCEPTED'
}

export function facturationRowOriginLabel(row: FacturationSuiviRow): string {
  if (!row.financeLineId) return 'Devis'
  return row.lineKind === 'INTERIM' ? 'Intérim' : 'Placement'
}
