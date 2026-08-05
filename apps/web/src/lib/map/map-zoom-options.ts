import {
  MAP_WHEEL_PX_PER_ZOOM_LEVEL,
  MAP_ZOOM_DELTA,
  MAP_ZOOM_SNAP,
} from '@/lib/map/constants'

export const mapZoomOptions = {
  scrollWheelZoom: true as const,
  zoomSnap: MAP_ZOOM_SNAP,
  zoomDelta: MAP_ZOOM_DELTA,
  wheelPxPerZoomLevel: MAP_WHEEL_PX_PER_ZOOM_LEVEL,
}
