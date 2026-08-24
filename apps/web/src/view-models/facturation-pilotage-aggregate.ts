import type { PilotageContribution } from '@/view-models/facturation-pilotage-union'
import type { Pilotage } from '@/view-models/facturation-pilotage'

function pct(marge: number, ca: number) {
  return ca === 0 ? 0 : Math.round((marge / ca) * 1000) / 10
}

export function aggregatePilotage(
  items: PilotageContribution[],
  months: string[],
): Pilotage {
  let ca = 0
  let caPlacement = 0
  let caInterim = 0
  let marge = 0
  let placementsActifs = 0
  let cancelledCount = 0
  let cancelledCa = 0
  let cancelledMarge = 0
  const pharmacies = new Set<string>()
  for (const item of items) {
    if (item.cancelled) {
      cancelledCount += 1
      cancelledCa += item.ca
      cancelledMarge += item.marge
      continue
    }
    ca += item.ca
    marge += item.marge
    pharmacies.add(item.pharmacyId)
    if (item.pole === 'placement') caPlacement += item.ca
    else caInterim += item.ca
    if (item.countsAsPlacement) placementsActifs += 1
  }
  return {
    kpis: {
      ca,
      caPlacement,
      caInterim,
      marge,
      margePct: pct(marge, ca),
      placementsActifs,
      pharmaciesActives: pharmacies.size,
    },
    cancelled: { count: cancelledCount, ca: cancelledCa, marge: cancelledMarge },
    months,
  }
}
