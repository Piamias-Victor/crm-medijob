import { type PlacementContractType } from '@/view-models/finance-line'

export function isPlacementContractType(value: string | null | undefined): value is PlacementContractType {
  return value === 'CDD' || value === 'CDI'
}

export function placementTypeFromMission(contractType: string | null | undefined) {
  return isPlacementContractType(contractType) ? contractType : ''
}

export function requirePlacementContract(
  kind: string,
  placementContractType: string | null | undefined,
): boolean {
  if (kind !== 'PLACEMENT') return true
  return isPlacementContractType(placementContractType)
}
