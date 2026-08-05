import L from 'leaflet'
import type { MapEntityType } from '@/lib/map/map-entity-type'

const iconCache = new Map<MapEntityType, L.DivIcon>()

export function createLeafletPinIcon(entityType: MapEntityType): L.DivIcon {
  const cached = iconCache.get(entityType)
  if (cached) return cached
  const icon = L.divIcon({
    className: `medijob-map-pin medijob-map-pin--${entityType}`,
    html: '<span class="medijob-map-pin__dot"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  })
  iconCache.set(entityType, icon)
  return icon
}

/** @deprecated Prefer createLeafletPinIcon(entityType) */
export const leafletPinIcon = createLeafletPinIcon('pharmacy')
