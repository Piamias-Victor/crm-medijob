export type MapEntityType = 'pharmacy' | 'candidate' | 'mission' | 'jobOffer'

export const MAP_ENTITY_TYPES = [
  'pharmacy',
  'candidate',
  'mission',
  'jobOffer',
] as const satisfies readonly MapEntityType[]

export function mapPinKey(entityType: MapEntityType, entityId: string): string {
  return `${entityType}:${entityId}`
}
