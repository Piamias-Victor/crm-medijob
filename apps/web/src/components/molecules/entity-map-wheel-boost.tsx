'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { DomEvent } from 'leaflet'
import { wheelBoostDelta } from '@/lib/map/wheel-boost-delta'

/**
 * Owns wheel zoom (native scrollWheelZoom off) for fractional + boosted feel.
 * preventDefault keeps page from stealing the trackpad.
 */
export function EntityMapWheelBoost() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const onWheel = (event: WheelEvent) => {
      DomEvent.preventDefault(event)
      DomEvent.stopPropagation(event)
      const boost = wheelBoostDelta(event.deltaY)
      if (boost === 0) return
      const next = map.getZoom() + boost
      map.setZoom(next, { animate: false })
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [map])

  return null
}
