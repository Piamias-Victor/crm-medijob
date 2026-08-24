import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { formatPilotagePct } from '@/view-models/facturation-pilotage-gauge-copy'
import type { PilotageGoNoGoMonth } from '@/view-models/facturation-pilotage-gogo'

export const PILOTAGE_GOGO_TITLE = 'Go / NoGo mensuel'
export const PILOTAGE_GOGO_CAPTION =
  'NoGo = Placement annulé ou CA 0 et Marge 0. CA perdu = nombre de NoGo × moyenne du CA facturé du même type (CDI vs CDD). L’intérim n’est jamais NoGo.'
export const PILOTAGE_GOGO_TOP = 'Mois avec le plus de NoGo'
export const PILOTAGE_GOGO_FULL = 'Mois à 100 % de conversion'
export const PILOTAGE_GOGO_EMPTY = '—'
export const PILOTAGE_GOGO_HEADERS = [
  'Mois',
  'CDI ok',
  'CDI NoGo',
  'CDD ok',
  'CDD NoGo',
  'Mix',
  'CA facturé',
] as const

export function gogoMonthCells(row: PilotageGoNoGoMonth): string[] {
  return [
    row.label,
    String(row.cdiOk),
    String(row.cdiNogo),
    String(row.cddOk),
    String(row.cddNogo),
    formatPilotagePct(row.mixPct),
    formatDevisPdfAmount(row.billedCa),
  ]
}
