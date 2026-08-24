import { deriveMissionCa } from '@/lib/finance/derive-mission-finance'
import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'
import type { FinanceLineRecord, PlacementContractType } from '@/view-models/finance-line'

export type PilotagePole = 'placement' | 'interim'

export type PilotageContribution = {
  cancelled: boolean
  pole: PilotagePole
  placementType: PlacementContractType | null
  ca: number
  marge: number
  pharmacyId: string
  occurredAt: Date
  referentId: string | null
  countsAsPlacement: boolean
}

function poleFromContract(contractType: string): PilotagePole {
  return contractType === 'CDD' || contractType === 'CDI' ? 'placement' : 'interim'
}

function placementTypeOf(contractType: string): PlacementContractType | null {
  return contractType === 'CDD' || contractType === 'CDI' ? contractType : null
}

export function contributionFromLine(line: FinanceLineRecord): PilotageContribution {
  const pole: PilotagePole = line.kind === 'INTERIM' ? 'interim' : 'placement'
  return {
    cancelled: line.cancelled,
    pole,
    placementType: pole === 'placement' ? line.placementContractType : null,
    ca: line.amountHt,
    marge: line.marge ?? 0,
    pharmacyId: line.pharmacyId,
    occurredAt: line.occurredAt,
    referentId: line.referentId,
    countsAsPlacement: pole === 'placement',
  }
}

export function contributionFromMission(
  mission: FacturationMissionRecord,
): PilotageContribution | null {
  const current = pickCurrentDevis(mission.devis)
  const ca = deriveMissionCa(mission.status, current)
  if (ca === 0 || !current?.acceptedAt) return null
  return {
    cancelled: false,
    pole: poleFromContract(mission.contractType),
    placementType: placementTypeOf(mission.contractType),
    ca,
    marge: mission.marge ?? 0,
    pharmacyId: mission.pharmacyId,
    occurredAt: current.acceptedAt,
    referentId: mission.referentId,
    countsAsPlacement: false,
  }
}

export function collectPilotageContributions(
  lines: FinanceLineRecord[],
  missions: FacturationMissionRecord[],
): PilotageContribution[] {
  const linked = new Set(lines.flatMap((line) => (line.missionId ? [line.missionId] : [])))
  const fromMissions = missions
    .filter((mission) => !linked.has(mission.id))
    .map(contributionFromMission)
    .filter((row): row is PilotageContribution => row !== null)
  return [...lines.map(contributionFromLine), ...fromMissions]
}
