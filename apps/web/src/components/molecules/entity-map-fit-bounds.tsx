'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { MapPin } from '@/view-models/map-pins'

const FRANCE_CENTER: [number, number] = [46.6, 2.4]

export function EntityMapFitBounds({ pins }: { pins: MapPin[] }) {
  const map = useMap()

  useEffect(() => {
    if (pins.length === 0) {
      map.setView(FRANCE_CENTER, 5)
      return
    }
    if (pins.length === 1) {
      map.setView([pins[0]!.latitude, pins[0]!.longitude], 11)
      return
    }
    map.fitBounds(
      pins.map((pin) => [pin.latitude, pin.longitude] as [number, number]),
      { padding: [40, 40] },
    )
  }, [map, pins])

  return null
}
