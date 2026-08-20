import { deriveMissionCa } from '@/lib/finance/derive-mission-finance'
import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import { toFacturationSuiviRow } from '@/lib/finance/list-facturation-suivi'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'
import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'

export type FacturationOverview = {
  counts: Record<CommercialStatus, number>
  ca: number
  marge: number
}

export const EMPTY_FACTURATION_OVERVIEW: FacturationOverview = {
  counts: { SANS_DEVIS: 0, ENVOYE: 0, ACCEPTE: 0, FACTURE: 0 },
  ca: 0,
  marge: 0,
}

export function buildFacturationOverview(
  missions: FacturationMissionRecord[],
): FacturationOverview {
  const counts = { ...EMPTY_FACTURATION_OVERVIEW.counts }
  let ca = 0
  let marge = 0
  for (const mission of missions) {
    counts[toFacturationSuiviRow(mission).commercialStatus]++
    const missionCa = deriveMissionCa(mission.status, pickCurrentDevis(mission.devis))
    ca += missionCa
    if (missionCa > 0) marge += mission.marge ?? 0
  }
  return { counts, ca, marge }
}
