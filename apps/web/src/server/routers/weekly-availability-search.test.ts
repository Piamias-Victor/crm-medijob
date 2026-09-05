// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeWeeklyAvailabilityRouter } from './weekly-availability'
import { filterDeps, marie, LYON } from './weekly-availability-filter.test.fixtures'
import type { AvailabilityFilterSeed } from '@/server/weekly-availability/filter-pool'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const lyonPrep: AvailabilityFilterSeed = {
  ...marie,
  slots: [
    { date: '2099-09-07', period: 'AM' },
    { date: '2099-09-07', period: 'PM' },
  ],
}

const parisPharma: AvailabilityFilterSeed = {
  ...marie,
  id: 'paul',
  firstName: 'Paul',
  lastName: 'Martin',
  city: 'Paris',
  postalCode: '75001',
  jobTitleId: 'jt-pharma',
  jobTitleName: 'Pharmacien',
  slots: [{ date: '2099-09-08', period: 'PM' }],
}

function caller(seeds: AvailabilityFilterSeed[] = [lyonPrep, parisPharma]) {
  return createCallerFactory(makeWeeklyAvailabilityRouter(filterDeps(seeds, async () => LYON)))({
    session,
  })
}

describe('weeklyAvailability.search', () => {
  it('lists everyone who declared when no filter is given', async () => {
    const rows = await caller().search()
    expect(rows.map((row) => row.fullName)).toEqual(['Marie Dupont', 'Paul Martin'])
    expect(rows[0]?.halfDayLabel).toBe('2 demi-journées')
    expect(rows[0]?.nextSlotLabel).toBe('lun. 7 sept. matin')
  })

  it('narrows the list to a job title', async () => {
    const rows = await caller().search({ jobTitleIds: ['jt-pharma'] })
    expect(rows.map((row) => row.fullName)).toEqual(['Paul Martin'])
  })

  it('narrows the list to a half-day inside a date range', async () => {
    const rows = await caller().search({
      dateFrom: '2099-09-08',
      dateTo: '2099-09-08',
      period: 'PM',
    })
    expect(rows.map((row) => row.fullName)).toEqual(['Paul Martin'])
  })

  it('can list candidates without declared slots', async () => {
    const noSlots: AvailabilityFilterSeed = {
      ...marie,
      id: 'lucie',
      firstName: 'Lucie',
      lastName: 'Sans',
      slots: [],
    }
    const api = caller([lyonPrep, noSlots])
    const all = await api.search({ hasDispo: 'all', dateFrom: '2099-09-01' })
    expect(all.map((row) => row.fullName).sort()).toEqual(['Lucie Sans', 'Marie Dupont'])
    const none = await api.search({ hasDispo: 'no', dateFrom: '2099-09-01' })
    expect(none.map((row) => row.fullName)).toEqual(['Lucie Sans'])
  })

  it('refuses an anonymous recruiter', async () => {
    const anonymous = createCallerFactory(makeWeeklyAvailabilityRouter(filterDeps()))({
      session: null,
    })
    await expect(anonymous.search()).rejects.toThrow()
  })
})
