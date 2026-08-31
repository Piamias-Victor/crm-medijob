// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeWeeklyAvailabilityRouter } from './weekly-availability'
import {
  filterDeps,
  marie,
  wedAmPrep,
} from './weekly-availability-filter.test.fixtures'
import type { WeeklyAvailabilityDeps } from './weekly-availability.deps'
import type { AvailabilityFilterSeed } from '@/server/weekly-availability/filter-pool'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function caller(d: WeeklyAvailabilityDeps = filterDeps()) {
  return createCallerFactory(makeWeeklyAvailabilityRouter(d))({ session })
}

function idsOf(seeds: AvailabilityFilterSeed[]) {
  return caller(filterDeps(seeds)).filter(wedAmPrep)
}

describe('weeklyAvailability.filter', () => {
  it('returns App-origin candidate matching dated AM slot, JobTitle and city', async () => {
    const rows = await caller().filter(wedAmPrep)
    expect(rows).toEqual([
      {
        id: 'marie',
        fullName: 'Marie Dupont',
        jobTitleName: 'Préparateur',
        city: 'Lyon',
        phone: '06 12 34 56 78',
        telHref: 'tel:06 12 34 56 78',
        smsHref: 'sms:+33612345678',
      },
    ])
  })

  it('excludes unknown and declared-unavailable weeks from dispo', async () => {
    const unknown: AvailabilityFilterSeed = { ...marie, id: 'unknown', slots: [] }
    const emptyWeek: AvailabilityFilterSeed = { ...marie, id: 'empty', slots: [] }
    const rows = await idsOf([marie, unknown, emptyWeek])
    expect(rows.map((row) => row.id)).toEqual(['marie'])
  })

  it('excludes CRM origin and Inactif from dispo', async () => {
    const crm: AvailabilityFilterSeed = { ...marie, id: 'crm', origin: 'CRM' }
    const inactif: AvailabilityFilterSeed = { ...marie, id: 'inactif', status: 'INACTIF' }
    const rows = await idsOf([marie, crm, inactif])
    expect(rows.map((row) => row.id)).toEqual(['marie'])
  })

  it('excludes a different JobTitle', async () => {
    const other: AvailabilityFilterSeed = { ...marie, id: 'pharma', jobTitleId: 'jt-pharma' }
    const rows = await idsOf([marie, other])
    expect(rows.map((row) => row.id)).toEqual(['marie'])
  })
})
