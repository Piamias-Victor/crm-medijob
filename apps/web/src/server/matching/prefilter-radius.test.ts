// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { prefilterCandidates } from '@/server/matching/prefilter'
import {
  baseCandidate,
  mission,
  nearLookup,
  scores,
} from '@/server/matching/prefilter.test.fixtures'

describe('prefilterCandidates radius', () => {
  it('excludes candidates beyond recruiter radius', async () => {
    const farLookup = async (cp: string) =>
      cp.startsWith('69') ? { lat: 45.75, lon: 4.85 } : { lat: 48.85, lon: 2.35 }
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'far', postalCode: '75011', mobilityRadiusKm: 500 })],
      scores,
      farLookup,
      15,
    )
    expect(result.excluded[0].reasons).toContain('distance')
  })

  it('ignores candidate mobilityRadiusKm inside recruiter radius', async () => {
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'tiny', mobilityRadiusKm: 1 })],
      scores,
      nearLookup,
      30,
    )
    expect(result.eligible.map((c) => c.id)).toEqual(['tiny'])
  })
})
