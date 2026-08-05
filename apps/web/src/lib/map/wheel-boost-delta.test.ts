import { describe, it, expect } from 'vitest'
import { wheelBoostDelta } from '@/lib/map/wheel-boost-delta'
import { MAP_WHEEL_PX_PER_ZOOM_LEVEL } from '@/lib/map/constants'

describe('wheelBoostDelta', () => {
  it('zooms in when scrolling up (negative deltaY)', () => {
    expect(wheelBoostDelta(-MAP_WHEEL_PX_PER_ZOOM_LEVEL)).toBe(1)
  })

  it('zooms out when scrolling down (positive deltaY)', () => {
    expect(wheelBoostDelta(MAP_WHEEL_PX_PER_ZOOM_LEVEL)).toBe(-1)
  })

  it('returns 0 for zero delta', () => {
    expect(wheelBoostDelta(0)).toBe(0)
  })
})
