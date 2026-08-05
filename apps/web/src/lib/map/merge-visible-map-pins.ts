import type { MapEntityType } from '@/lib/map/map-entity-type'
import { MAP_ENTITY_TYPES } from '@/lib/map/map-entity-type'
import type { MapLayerState } from '@/lib/map/map-layer-state'
import type { MapPin } from '@/view-models/map-pins'

export function mergeVisibleMapPins(input: {
  layers: MapLayerState
  primaryType: MapEntityType
  primaryPins: MapPin[]
  extras: Partial<Record<MapEntityType, MapPin[]>>
}): MapPin[] {
  const { layers, primaryType, primaryPins, extras } = input
  const out: MapPin[] = []
  for (const type of MAP_ENTITY_TYPES) {
    if (!layers[type]) continue
    if (type === primaryType) out.push(...primaryPins)
    else out.push(...(extras[type] ?? []))
  }
  return out
}
