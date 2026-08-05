'use client'

import { Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import type { MapPin } from '@/view-models/map-pins'
import { createLeafletPinIcon } from '@/lib/map/leaflet-pin-icon'
import { MAP_CLUSTER_THRESHOLD } from '@/lib/map/constants'
import { shouldClusterPins } from '@/lib/map/should-cluster-pins'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'

type Props = {
  pins: MapPin[]
  onPinClick?: (pin: MapPin) => void
}

function pinMarkers(pins: MapPin[], onPinClick?: (pin: MapPin) => void) {
  return pins.map((pin) => (
    <Marker
      key={pin.id}
      position={[pin.latitude, pin.longitude]}
      icon={createLeafletPinIcon(pin.entityType)}
      eventHandlers={{ click: () => onPinClick?.(pin) }}
    >
      <Popup>{pin.label}</Popup>
    </Marker>
  ))
}

export function EntityMapMarkers({ pins, onPinClick }: Props) {
  const markers = pinMarkers(pins, onPinClick)
  if (!shouldClusterPins(pins.length, MAP_CLUSTER_THRESHOLD)) return markers
  return <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
}
