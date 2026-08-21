import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import { deriveCommercialStatus } from '@/lib/finance/derive-commercial-status'
import { matchesFacturationFilters } from '@/lib/finance/match-facturation-filters'
import { toFinanceLineSuiviRow } from '@/lib/finance/to-finance-line-row'
import type { FacturationMissionRecord, FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FinanceLineRecord } from '@/view-models/finance-line'

export function toFacturationSuiviRow(mission: FacturationMissionRecord): FacturationSuiviRow {
  const current = pickCurrentDevis(mission.devis)
  return {
    missionId: mission.id,
    financeLineId: null,
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
  lines: FinanceLineRecord[] = [],
): FacturationSuiviRow[] {
  const rows = [...lines.map(toFinanceLineSuiviRow), ...missions.map(toFacturationSuiviRow)]
  return rows.filter((row) => matchesFacturationFilters(row, filters))
}
