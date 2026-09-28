import { describe, expect, it } from 'vitest'
import {
  defaultRelanceAfterCall,
  defaultRelanceOnArrival,
  isRelanceOverdue,
} from './app-profile-relance'
import { parisYmd } from '@/lib/paris-week'

describe('app-profile-relance', () => {
  it('defaults arrival relance to Paris calendar day of intake', () => {
    const createdAt = new Date('2026-07-10T22:30:00.000Z') // 00:30 11 Jul Paris
    const relance = defaultRelanceOnArrival(createdAt)
    expect(parisYmd(relance)).toBe('2026-07-11')
  })

  it('defaults after-call relance to last-call Paris day + 2', () => {
    const lastCalledAt = new Date('2026-03-10T15:00:00.000Z')
    const relance = defaultRelanceAfterCall(lastCalledAt)
    expect(parisYmd(relance)).toBe('2026-03-12')
  })

  it('marks overdue when relance Paris day is before today', () => {
    const now = new Date('2026-03-12T10:00:00.000Z')
    expect(isRelanceOverdue(new Date('2026-03-11T00:00:00.000Z'), now)).toBe(true)
    expect(isRelanceOverdue(new Date('2026-03-12T00:00:00.000Z'), now)).toBe(false)
    expect(isRelanceOverdue(null, now)).toBe(false)
  })
})
