// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { searchDeclared } from '@/server/weekly-availability/search-declared'
import type { DeclaredAvailabilityPoolRow } from '@/server/weekly-availability/filter-pool'

const paris = { lat: 48.85, lon: 2.35 }
const lyon = { lat: 45.76, lon: 4.83 }

function row(over: Partial<DeclaredAvailabilityPoolRow> = {}): DeclaredAvailabilityPoolRow {
  return {
    id: 'c1',
    firstName: 'Margo',
    lastName: 'Rié',
    phone: '0600000000',
    city: 'Paris',
    postalCode: '75001',
    jobTitleId: 'jt1',
    jobTitleName: 'Préparatrice',
    slots: [{ date: '2026-09-07', period: 'AM' }],
    ...over,
  }
}

const lookupGeo = vi.fn(async (query: string) => (query.startsWith('69') ? lyon : paris))

describe('searchDeclared', () => {
  it('lists everyone who declared, from today, when no filter is set', async () => {
    const listDeclared = vi.fn(async () => [row()])
    const rows = await searchDeclared({
      store: { listDeclared },
      lookupGeo,
      input: {},
      today: new Date('2026-09-03T10:00:00Z'),
    })
    expect(listDeclared).toHaveBeenCalledWith({ from: '2026-09-03' })
    expect(rows).toHaveLength(1)
  })

  it('passes the date range, the half-day and the job titles down to the store', async () => {
    const listDeclared = vi.fn(async () => [row()])
    await searchDeclared({
      store: { listDeclared },
      lookupGeo,
      input: { dateFrom: '2026-09-07', dateTo: '2026-09-11', period: 'AM', jobTitleIds: ['jt1'] },
      today: new Date('2026-09-03T10:00:00Z'),
    })
    expect(listDeclared).toHaveBeenCalledWith({
      from: '2026-09-07',
      dateTo: '2026-09-11',
      period: 'AM',
      jobTitleIds: ['jt1'],
    })
  })

  it('never looks before today even when an earlier start date is asked', async () => {
    const listDeclared = vi.fn(async () => [row()])
    await searchDeclared({
      store: { listDeclared },
      lookupGeo,
      input: { dateFrom: '2026-01-01' },
      today: new Date('2026-09-03T10:00:00Z'),
    })
    expect(listDeclared).toHaveBeenCalledWith({ from: '2026-09-03' })
  })

  it('keeps only names or cities matching the search box', async () => {
    const listDeclared = vi.fn(async () => [row(), row({ id: 'c2', lastName: 'Dupont' })])
    const rows = await searchDeclared({
      store: { listDeclared },
      lookupGeo,
      input: { q: 'dupont' },
      today: new Date('2026-09-03T10:00:00Z'),
    })
    expect(rows.map((r) => r.id)).toEqual(['c2'])
  })

  it('keeps only candidates within the radius of the searched city', async () => {
    const listDeclared = vi.fn(async () => [
      row(),
      row({ id: 'c2', city: 'Lyon', postalCode: '69001' }),
    ])
    const rows = await searchDeclared({
      store: { listDeclared },
      lookupGeo,
      input: { city: 'Paris', radiusKm: 30 },
      today: new Date('2026-09-03T10:00:00Z'),
    })
    expect(rows.map((r) => r.id)).toEqual(['c1'])
  })
})
