import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import type { PilotageCancelled } from '@/view-models/facturation-pilotage'

export function buildPilotageCancelledCopy(banner: PilotageCancelled): string {
  const label = banner.count <= 1 ? '1 ligne annulée' : `${banner.count} lignes annulées`
  return `${label} · CA ${formatDevisPdfAmount(banner.ca)} · Marge ${formatDevisPdfAmount(banner.marge)}`
}
