// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeWeeklyAvailabilityRouter } from './weekly-availability'
import {
  filterDeps,
  marie,
  PARIS,
  LYON,
  wedAmPrep,
} from './weekly-availability-filter.test.fixtures'
import type { AvailabilityFilterSeed } from '@/server/weekly-availability/filter-pool'
import { weeklyAvailabilityFilterInputSchema } from '@/view-models/weekly-availability-filter.schema'
import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function caller(seeds: AvailabilityFilterSeed[], lookupGeo: (q: string) => Promise<typeof LYON>) {
  return createCallerFactory(makeWeeklyAvailabilityRouter(filterDeps(seeds, lookupGeo)))({
    session,
  })
}

const parisMarie: AvailabilityFilterSeed = {
  ...marie,
  id: 'paris',
  city: 'Paris',
  postalCode: '75011',
}

async function byQuery(query: string) {
  if (query === 'Paris' || query.startsWith('75')) return PARIS
  return LYON
}

describe('weeklyAvailability.filter geo', () => {
  it('excludes candidates beyond default 30 km radius', async () => {
    const rows = await caller([marie, parisMarie], byQuery).filter(wedAmPrep)
    expect(rows.map((row) => row.id)).toEqual(['marie'])
  })

  it('uses recruiter radius when set', async () => {
    const rows = await caller([marie, parisMarie], byQuery).filter({
      ...wedAmPrep,
      radiusKm: 500,
    })
    expect(rows.map((row) => row.id)).toEqual(['marie', 'paris'])
  })
})

describe('weeklyAvailabilityFilterInputSchema', () => {
  it('has slot, JobTitle and geo only — no software, salary or contract', () => {
    expect(Object.keys(weeklyAvailabilityFilterInputSchema.shape)).toEqual([
      'date',
      'period',
      'jobTitleId',
      'city',
      'radiusKm',
    ])
    expect(DEFAULT_MOBILITY_RADIUS_KM).toBe(30)
    const parsed = weeklyAvailabilityFilterInputSchema.parse(wedAmPrep)
    expect(parsed.radiusKm).toBeUndefined()
  })
})

describe('weeklyAvailability.filter auth', () => {
  it('rejects an unauthenticated caller', async () => {
    const unauth = createCallerFactory(makeWeeklyAvailabilityRouter(filterDeps()))({
      session: null,
    })
    await expect(unauth.filter(wedAmPrep)).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })
})
