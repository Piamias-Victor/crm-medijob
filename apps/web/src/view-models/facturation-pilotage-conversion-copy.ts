import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import { formatPilotagePct } from '@/view-models/facturation-pilotage-gauge-copy'
import type { PilotageConversionCard } from '@/view-models/facturation-pilotage-conversion'

export const PILOTAGE_CONVERSION_TITLE = 'Go / NoGo'
export const PILOTAGE_CONVERSION_CDI = 'CDI'
export const PILOTAGE_CONVERSION_CDD = 'CDD'
export const PILOTAGE_CONVERSION_ENGAGED = 'Engagés'
export const PILOTAGE_CONVERSION_RATE = 'Conversion'
export const PILOTAGE_CONVERSION_BILLED = 'Facturés'
export const PILOTAGE_CONVERSION_LOST = 'Perdus'

export function conversionCardRows(card: PilotageConversionCard) {
  return [
    { label: PILOTAGE_CONVERSION_ENGAGED, value: String(card.engaged) },
    { label: PILOTAGE_CONVERSION_RATE, value: formatPilotagePct(card.conversionPct) },
    {
      label: PILOTAGE_CONVERSION_BILLED,
      value: `${card.billedCount} · ${formatDevisPdfAmount(card.billedCa)}`,
    },
    {
      label: PILOTAGE_CONVERSION_LOST,
      value: `${card.lostCount} · ${formatDevisPdfAmount(card.lostCa)}`,
    },
  ]
}
