export type MapEntityType = 'pharmacy' | 'candidate' | 'mission'

export const MAP_ENTITY_TYPES = [
  'pharmacy',
  'candidate',
  'mission',
] as const satisfies readonly MapEntityType[]

export function mapPinKey(entityType: MapEntityType, entityId: string): string {
  return `${entityType}:${entityId}`
}
