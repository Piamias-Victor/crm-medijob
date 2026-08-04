'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapPin } from '@/view-models/map-pins'
import { leafletPinIcon } from '@/lib/map/leaflet-pin-icon'
import { EntityMapFitBounds } from '@/components/molecules/entity-map-fit-bounds'

type Props = {
  pins: MapPin[]
  onPinClick?: (id: string) => void
}

export function EntityMapCanvas({ pins, onPinClick }: Props) {
  return (
    <MapContainer
      center={[46.6, 2.4]}
      zoom={5}
      className="h-[420px] w-full rounded-lg z-0"
      scrollWheelZoom
      zoomSnap={0}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={120}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <EntityMapFitBounds pins={pins} />
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.latitude, pin.longitude]}
          icon={leafletPinIcon}
          eventHandlers={{ click: () => onPinClick?.(pin.id) }}
        >
          <Popup>{pin.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
