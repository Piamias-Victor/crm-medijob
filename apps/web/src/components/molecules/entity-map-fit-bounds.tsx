'use client'

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import type { MapPin } from '@/view-models/map-pins'

const FRANCE_CENTER: [number, number] = [46.6, 2.4]

function pinsKey(pins: MapPin[]) {
  return pins.map((pin) => `${pin.id}:${pin.latitude}:${pin.longitude}`).join('|')
}

/** Fit bounds once per distinct pin set — avoid fighting user pan/zoom. */
export function EntityMapFitBounds({ pins }: { pins: MapPin[] }) {
  const map = useMap()
  const fittedKey = useRef<string | null>(null)

  useEffect(() => {
    const key = pinsKey(pins)
    if (fittedKey.current === key) return
    fittedKey.current = key

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
      { padding: [40, 40], animate: false },
    )
  }, [map, pins])

  return null
}
