// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { prefilterCandidates } from '@/server/matching/prefilter'
import {
  baseCandidate,
  mission,
  nearLookup,
  scores,
} from '@/server/matching/prefilter.test.fixtures'

describe('prefilterCandidates', () => {
  it('excludes candidates whose job title scores 0 in the compatibility matrix', async () => {
    const matrix = new Map([['jt-preparateur', 0], ['jt-pharmacien', 100]])
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'ok' }), baseCandidate({ id: 'ko', jobTitleId: 'jt-preparateur', jobTitleName: 'Préparateur' })],
      matrix,
      nearLookup,
    )
    expect(result.eligible.map((c) => c.id)).toEqual(['ok'])
    expect(result.excluded[0]).toMatchObject({ candidateId: 'ko', reasons: ['job_title'] })
  })

  it('excludes candidates missing geo fields with a geo reason', async () => {
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'no-cp', postalCode: null })],
      scores,
      nearLookup,
    )
    expect(result.eligible).toHaveLength(0)
    expect(result.excluded[0].reasons).toContain('geo')
  })

  it('excludes candidates beyond mobility radius', async () => {
    const farLookup = async (cp: string) =>
      cp.startsWith('69') ? { lat: 45.75, lon: 4.85 } : { lat: 48.85, lon: 2.35 }
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'far', postalCode: '75011', mobilityRadiusKm: 10 })],
      scores,
      farLookup,
    )
    expect(result.excluded[0].reasons).toContain('distance')
  })

  it('excludes candidates whose contract preference does not include the mission', async () => {
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'cdd-only', preferredContractTypes: ['CDD'] })],
      scores,
      nearLookup,
    )
    expect(result.excluded[0].reasons).toContain('contract')
  })

  it('skips contract filter when candidate has no preferred contract types', async () => {
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'open', preferredContractTypes: [] })],
      scores,
      nearLookup,
    )
    expect(result.eligible.map((c) => c.id)).toEqual(['open'])
  })

  it('excludes candidates unavailable before mission start', async () => {
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'late', availableFrom: new Date('2026-08-01') })],
      scores,
      nearLookup,
    )
    expect(result.excluded[0].reasons).toContain('availability')
  })

  it('exclut candidats geo si lookup pharmacie échoue', async () => {
    const lookupGeo = async (cp: string) => (cp === '69001' ? null : nearLookup())
    const result = await prefilterCandidates(
      mission,
      [baseCandidate({ id: 'geo-fail' })],
      scores,
      lookupGeo,
    )
    expect(result.eligible).toHaveLength(0)
    expect(result.excluded[0].reasons).toContain('geo')
  })
})
