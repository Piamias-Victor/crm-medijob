import { describe, it, expect } from 'vitest'
import { shouldClusterPins } from '@/lib/map/should-cluster-pins'
import { MAP_CLUSTER_THRESHOLD } from '@/lib/map/constants'

describe('shouldClusterPins', () => {
  it('clusters when pin count is above threshold', () => {
    expect(shouldClusterPins(51, MAP_CLUSTER_THRESHOLD)).toBe(true)
  })

  it('keeps individual markers at or below threshold', () => {
    expect(shouldClusterPins(MAP_CLUSTER_THRESHOLD, MAP_CLUSTER_THRESHOLD)).toBe(
      false,
    )
    expect(shouldClusterPins(1, MAP_CLUSTER_THRESHOLD)).toBe(false)
  })
})