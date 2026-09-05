// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  slotLabel,
  toDeclaredAvailabilityRow,
} from '@/view-models/weekly-availability-declared-row'
import type { DeclaredAvailabilityPoolRow } from '@/server/weekly-availability/filter-pool'

const pool: DeclaredAvailabilityPoolRow = {
  id: 'c1',
  firstName: 'Margo',
  lastName: 'Rié',
  phone: '0600000000',
  city: 'Paris',
  postalCode: '75001',
  jobTitleId: 'jt1',
  jobTitleName: 'Préparatrice',
  slots: [
    { date: '2026-09-07', period: 'AM' },
    { date: '2026-09-07', period: 'PM' },
    { date: '2026-09-08', period: 'AM' },
  ],
}

describe('slotLabel', () => {
  it('spells out the day and the half-day', () => {
    expect(slotLabel({ date: '2026-09-07', period: 'AM' })).toBe('lun. 7 sept. matin')
    expect(slotLabel({ date: '2026-09-07', period: 'PM' })).toBe('lun. 7 sept. après-midi')
  })
})

describe('toDeclaredAvailabilityRow', () => {
  it('counts the declared half-days and points to the next one', () => {
    const row = toDeclaredAvailabilityRow(pool)
    expect(row.fullName).toBe('Margo Rié')
    expect(row.halfDayCount).toBe(3)
    expect(row.halfDayLabel).toBe('3 demi-journées')
    expect(row.nextSlotLabel).toBe('lun. 7 sept. matin')
    expect(row.href).toBe('/candidats/c1')
    expect(row.telHref).toBe('tel:0600000000')
  })

  it('stays readable for a candidate without phone or upcoming slot', () => {
    const row = toDeclaredAvailabilityRow({ ...pool, phone: null, slots: [] })
    expect(row.halfDayLabel).toBe('0 demi-journée')
    expect(row.nextSlotLabel).toBe('—')
    expect(row.telHref).toBeNull()
  })
})
