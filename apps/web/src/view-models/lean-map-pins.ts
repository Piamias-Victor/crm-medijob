import type { MapPin } from '@/view-models/map-pins'
import type { MapEntityType } from '@/lib/map/map-entity-type'
import { mapPinKey } from '@/lib/map/map-entity-type'

/** Lean row from mapPins tRPC → MapPin. */
export function toLeanMapPins(
  entityType: MapEntityType,
  rows: Array<{
    id: string
    label: string
    latitude: number
    longitude: number
  }>,
): MapPin[] {
  return rows.map((row) => ({
    id: mapPinKey(entityType, row.id),
    entityId: row.id,
    entityType,
    label: row.label,
    latitude: row.latitude,
    longitude: row.longitude,
  }))
}
