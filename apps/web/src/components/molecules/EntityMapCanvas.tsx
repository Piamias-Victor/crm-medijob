'use client'

import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapPin } from '@/view-models/map-pins'
import { EntityMapFitBounds } from '@/components/molecules/entity-map-fit-bounds'
import { EntityMapMarkers } from '@/components/molecules/entity-map-markers'
import { EntityMapWheelBoost } from '@/components/molecules/entity-map-wheel-boost'
import { mapZoomOptions } from '@/lib/map/map-zoom-options'

type Props = {
  pins: MapPin[]
  onPinClick?: (pin: MapPin) => void
}

export function EntityMapCanvas({ pins, onPinClick }: Props) {
  return (
    <MapContainer
      center={[46.6, 2.4]}
      zoom={5}
      className="medijob-entity-map h-[420px] w-full rounded-lg z-0"
      {...mapZoomOptions}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <EntityMapWheelBoost />
      <EntityMapFitBounds pins={pins} />
      <EntityMapMarkers pins={pins} onPinClick={onPinClick} />
    </MapContainer>
  )
}
