import { describe, expect, it } from 'vitest'
import { getWeek } from './get-week'
import { memoryAvailabilityStore } from './test-store'

const TOKEN = 'valid-secret-token-xxxxxxxxxx'
const MONDAY = '2026-08-31'

describe('getWeek', () => {
  it('refuses an unknown token', async () => {
    const result = await getWeek(memoryAvailabilityStore(), {
      token: 'no-such-token-xxxxxxxxxx',
    })
    expect(result).toEqual({ ok: false, reason: 'not_found' })
  })

  it('treats a never-submitted week as unknown', async () => {
    const result = await getWeek(
      memoryAvailabilityStore([{ token: TOKEN, candidateId: 'c1' }]),
      { token: TOKEN, weekStart: MONDAY },
    )
    expect(result).toEqual({
      ok: true,
      week: { weekStart: MONDAY, declaration: 'unknown', slots: [] },
    })
  })

  it('defaults to the current Paris week when weekStart is omitted', async () => {
    const result = await getWeek(
      memoryAvailabilityStore([{ token: TOKEN, candidateId: 'c1' }]),
      { token: TOKEN, now: new Date('2026-09-02T10:00:00.000Z') },
    )
    expect(result.ok && result.week.weekStart).toBe(MONDAY)
  })
})
