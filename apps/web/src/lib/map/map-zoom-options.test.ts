import { describe, it, expect } from 'vitest'
import { mapZoomOptions } from '@/lib/map/map-zoom-options'
import { MAP_WHEEL_PX_PER_ZOOM_LEVEL } from '@/lib/map/constants'

describe('mapZoomOptions', () => {
  it('exposes sensitive wheel zoom below legacy 120 px/level', () => {
    expect(mapZoomOptions.wheelPxPerZoomLevel).toBe(MAP_WHEEL_PX_PER_ZOOM_LEVEL)
    expect(mapZoomOptions.wheelPxPerZoomLevel).toBeLessThan(120)
    expect(mapZoomOptions.zoomSnap).toBe(0)
    expect(mapZoomOptions.scrollWheelZoom).toBe(true)
  })
})
