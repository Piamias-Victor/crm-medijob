import type { MapEntityType } from '@/lib/map/map-entity-type'
import { MAP_ENTITY_TYPES } from '@/lib/map/map-entity-type'

export type MapLayerState = Record<MapEntityType, boolean>

export function defaultLayerState(primary: MapEntityType): MapLayerState {
  return Object.fromEntries(
    MAP_ENTITY_TYPES.map((type) => [type, type === primary]),
  ) as MapLayerState
}

/** Toggle a layer; keep at least one active. */
export function toggleMapLayer(
  state: MapLayerState,
  type: MapEntityType,
): MapLayerState {
  const next = { ...state, [type]: !state[type] }
  const anyOn = MAP_ENTITY_TYPES.some((key) => next[key])
  return anyOn ? next : state
}
