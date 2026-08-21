import { deriveMissionCa } from '@/lib/finance/derive-mission-finance'
import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import { toFacturationSuiviRow } from '@/lib/finance/list-facturation-suivi'
import { toFinanceLineSuiviRow } from '@/lib/finance/to-finance-line-row'
import { matchesFacturationFilters } from '@/lib/finance/match-facturation-filters'
import { EMPTY_FACTURATION_SLICES, type FacturationSlices } from '@/view-models/facturation-slice-bucket'
import { buildFacturationSlices } from '@/view-models/facturation-slices'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'

export type FacturationOverview = {
  counts: Record<CommercialStatus, number>
  ca: number
  marge: number
  slices: FacturationSlices
}

export const EMPTY_FACTURATION_OVERVIEW: FacturationOverview = {
  counts: { SANS_DEVIS: 0, ENVOYE: 0, ACCEPTE: 0, FACTURE: 0 },
  ca: 0,
  marge: 0,
  slices: EMPTY_FACTURATION_SLICES,
}

export function buildFacturationOverview(
  missions: FacturationMissionRecord[],
  filters: FacturationSuiviFilters = {},
  lines: FinanceLineRecord[] = [],
): FacturationOverview {
  const counts = { ...EMPTY_FACTURATION_OVERVIEW.counts }
  let ca = 0
  let marge = 0
  const matched: FacturationMissionRecord[] = []
  const matchedLines: FinanceLineRecord[] = []
  for (const mission of missions) {
    const row = toFacturationSuiviRow(mission)
    if (!matchesFacturationFilters(row, filters)) continue
    matched.push(mission)
    counts[row.commercialStatus]++
    const missionCa = deriveMissionCa(mission.status, pickCurrentDevis(mission.devis))
    ca += missionCa
    if (missionCa > 0) marge += mission.marge ?? 0
  }
  for (const line of lines) {
    const row = toFinanceLineSuiviRow(line)
    if (!matchesFacturationFilters(row, filters)) continue
    matchedLines.push(line)
    counts[row.commercialStatus]++
    ca += line.amountHt
    marge += line.marge ?? 0
  }
  return { counts, ca, marge, slices: buildFacturationSlices(matched, matchedLines) }
}
