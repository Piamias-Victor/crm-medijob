import type { FacturationMissionOption } from '@/view-models/finance-line'

export function filterMissionsForPharmacy(
  missions: FacturationMissionOption[],
  pharmacyId: string,
): FacturationMissionOption[] {
  if (!pharmacyId) return missions
  return missions.filter((mission) => mission.pharmacyId === pharmacyId)
}
