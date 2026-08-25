import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import type { PilotageGauge } from '@/view-models/facturation-pilotage-gauge'

export const PILOTAGE_GAUGE_TITLE = 'Objectif CDD/CDI'
export const PILOTAGE_GAUGE_REALISE = 'Réalisé'
export const PILOTAGE_GAUGE_POTENTIEL = 'Potentiel'
export const PILOTAGE_GAUGE_RESTE = 'Reste à faire'

export function formatPilotagePct(value: number) {
  return `${value.toFixed(1).replace('.', ',')} %`
}

export function gaugeBarWidths(gauge: PilotageGauge) {
  const realise = Math.min(gauge.realisePct, 100)
  const potentiel = Math.min(Math.max(gauge.potentielPct - realise, 0), 100 - realise)
  return { realise, potentiel, reste: Math.max(0, 100 - realise - potentiel) }
}

export function buildPilotageGaugeCaption(gauge: PilotageGauge) {
  return `Cap ${formatDevisPdfAmount(gauge.cap)} · perdu projeté ${formatDevisPdfAmount(gauge.lostCa)}`
}

export function buildPilotageGaugeLegend(gauge: PilotageGauge) {
  return [
    { color: 'bg-accent', label: PILOTAGE_GAUGE_REALISE, value: formatPilotagePct(gauge.realisePct) },
    { color: 'bg-warning', label: PILOTAGE_GAUGE_POTENTIEL, value: formatPilotagePct(gauge.potentielPct) },
    { color: 'bg-border', label: PILOTAGE_GAUGE_RESTE, value: formatDevisPdfAmount(gauge.resteAFaire) },
  ]
}
