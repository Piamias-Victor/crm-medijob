import type { MapEntityType } from '@/lib/map/map-entity-type'
import { mapPinKey } from '@/lib/map/map-entity-type'

export type MapPinSource = {
  entityId: string
  entityType: MapEntityType
  label: string
  latitude: number | null
  longitude: number | null
}

export type MapPin = {
  id: string
  entityId: string
  entityType: MapEntityType
  label: string
  latitude: number
  longitude: number
}

export function toMapPins(rows: MapPinSource[]): MapPin[] {
  return rows.flatMap((row) => {
    if (row.latitude == null || row.longitude == null) return []
    return [
      {
        id: mapPinKey(row.entityType, row.entityId),
        entityId: row.entityId,
        entityType: row.entityType,
        label: row.label,
        latitude: row.latitude,
        longitude: row.longitude,
      },
    ]
  })
}
