import { describe, it, expect } from 'vitest'
import { mapZoomOptions } from '@/lib/map/map-zoom-options'
import {
  MAP_WHEEL_DEBOUNCE_MS,
  MAP_WHEEL_PX_PER_ZOOM_LEVEL,
} from '@/lib/map/constants'

describe('mapZoomOptions', () => {
  it('keeps mid wheel sensitivity; native wheel off for custom boost', () => {
    expect(mapZoomOptions.wheelPxPerZoomLevel).toBe(MAP_WHEEL_PX_PER_ZOOM_LEVEL)
    expect(mapZoomOptions.wheelPxPerZoomLevel).toBeGreaterThan(40)
    expect(mapZoomOptions.wheelPxPerZoomLevel).toBeLessThanOrEqual(60)
    expect(mapZoomOptions.wheelDebounceTime).toBe(MAP_WHEEL_DEBOUNCE_MS)
    expect(mapZoomOptions.wheelDebounceTime).toBe(0)
    expect(mapZoomOptions.zoomSnap).toBe(0)
    expect(mapZoomOptions.scrollWheelZoom).toBe(false)
  })
})
