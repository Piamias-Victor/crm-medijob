import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { PILOTAGE_POLE_INTERIM, PILOTAGE_POLE_PLACEMENT } from '@/view-models/facturation-pilotage-poles-copy'
import type { PilotageMonthLine, PilotageMonthlyRow } from '@/view-models/facturation-pilotage-monthly'

export const PILOTAGE_MONTHLY_TITLE = 'Suivi mensuel'
export const PILOTAGE_MONTHLY_HINT = 'Clique une ligne pour voir le détail'
export const PILOTAGE_MONTHLY_HEADERS = [
  'Mois',
  'Placements',
  'Intérim',
  'CA CDD/CDI',
  'CA Intérim',
  'CA',
  'Marge',
] as const
export const PILOTAGE_MONTHLY_DETAIL_HEADERS = [
  'Pharmacie',
  'Candidat',
  'Pôle',
  'CA',
  'Marge',
] as const

export function monthlyRowCells(row: PilotageMonthlyRow): string[] {
  return [
    row.label,
    String(row.placements),
    String(row.interim),
    formatDevisPdfAmount(row.caPlacement),
    formatDevisPdfAmount(row.caInterim),
    formatDevisPdfAmount(row.ca),
    formatDevisPdfAmount(row.marge),
  ]
}

export function monthlyDetailCells(line: PilotageMonthLine): string[] {
  return [
    line.pharmacyName,
    line.candidateName,
    line.pole === 'interim' ? PILOTAGE_POLE_INTERIM : PILOTAGE_POLE_PLACEMENT,
    formatDevisPdfAmount(line.ca),
    formatDevisPdfAmount(line.marge),
  ]
}
