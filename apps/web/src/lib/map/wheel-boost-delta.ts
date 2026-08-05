import { MAP_WHEEL_PX_PER_ZOOM_LEVEL } from '@/lib/map/constants'

/** Fractional zoom from wheel delta (negative deltaY = zoom in). */
export function wheelBoostDelta(deltaY: number): number {
  if (deltaY === 0) return 0
  return -deltaY / MAP_WHEEL_PX_PER_ZOOM_LEVEL
}
