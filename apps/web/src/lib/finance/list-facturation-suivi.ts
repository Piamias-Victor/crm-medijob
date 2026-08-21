import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import { deriveCommercialStatus } from '@/lib/finance/derive-commercial-status'
import { matchesFacturationFilters } from '@/lib/finance/match-facturation-filters'
import type { FacturationMissionRecord, FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'

export function toFacturationSuiviRow(mission: FacturationMissionRecord): FacturationSuiviRow {
  const current = pickCurrentDevis(mission.devis)
  return {
    missionId: mission.id,
    pharmacyId: mission.pharmacyId,
    pharmacyName: mission.pharmacyName,
    referentId: mission.referentId,
    referentName: mission.referentName,
    contractType: mission.contractType,
    commercialStatus: deriveCommercialStatus(current),
    sentAt: current?.sentAt ?? null,
    acceptedAt: current?.acceptedAt ?? null,
    amountHt: current?.amountHt ?? null,
  }
}

export function listFacturationSuivi(
  missions: FacturationMissionRecord[],
  filters: FacturationSuiviFilters = {},
): FacturationSuiviRow[] {
  return missions.map(toFacturationSuiviRow).filter((row) => matchesFacturationFilters(row, filters))
}
