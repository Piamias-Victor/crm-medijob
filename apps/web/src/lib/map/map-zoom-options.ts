import {
  MAP_WHEEL_DEBOUNCE_MS,
  MAP_WHEEL_PX_PER_ZOOM_LEVEL,
  MAP_ZOOM_DELTA,
  MAP_ZOOM_SNAP,
} from '@/lib/map/constants'

/** Native wheel off — EntityMapWheelBoost owns fractional zoom. */
export const mapZoomOptions = {
  scrollWheelZoom: false as const,
  zoomSnap: MAP_ZOOM_SNAP,
  zoomDelta: MAP_ZOOM_DELTA,
  wheelPxPerZoomLevel: MAP_WHEEL_PX_PER_ZOOM_LEVEL,
  wheelDebounceTime: MAP_WHEEL_DEBOUNCE_MS,
}
