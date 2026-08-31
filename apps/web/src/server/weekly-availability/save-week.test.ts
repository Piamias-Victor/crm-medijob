import { describe, expect, it } from 'vitest'
import { getWeek } from './get-week'
import { saveWeek } from './save-week'
import { memoryAvailabilityStore } from './test-store'

const TOKEN = 'valid-secret-token-xxxxxxxxxx'
const MONDAY = '2026-08-31'
const seed = [{ token: TOKEN, candidateId: 'c1' }]

describe('saveWeek', () => {
  it('refuses an unknown token', async () => {
    const result = await saveWeek(memoryAvailabilityStore(), {
      token: 'no-such-token-xxxxxxxxxx',
      weekStart: MONDAY,
      slots: [],
    })
    expect(result).toEqual({ ok: false, reason: 'not_found' })
  })

  it('marks an empty save as declared unavailable', async () => {
    const store = memoryAvailabilityStore(seed)
    await saveWeek(store, { token: TOKEN, weekStart: MONDAY, slots: [] })
    const result = await getWeek(store, { token: TOKEN, weekStart: MONDAY })
    expect(result).toEqual({
      ok: true,
      week: { weekStart: MONDAY, declaration: 'declared_unavailable', slots: [] },
    })
  })

  it('keeps saved slots when switching weeks then returning', async () => {
    const store = memoryAvailabilityStore(seed)
    const wedAm = { date: '2026-09-02', period: 'AM' as const }
    await saveWeek(store, { token: TOKEN, weekStart: MONDAY, slots: [wedAm] })
    const nextWeek = await getWeek(store, { token: TOKEN, weekStart: '2026-09-07' })
    const back = await getWeek(store, { token: TOKEN, weekStart: MONDAY })
    expect(nextWeek).toEqual({
      ok: true,
      week: { weekStart: '2026-09-07', declaration: 'unknown', slots: [] },
    })
    expect(back).toEqual({
      ok: true,
      week: { weekStart: MONDAY, declaration: 'submitted', slots: [wedAm] },
    })
  })

  it('keeps already-saved past slots when saving later in the week', async () => {
    const store = memoryAvailabilityStore(seed)
    const monAm = { date: '2026-08-31', period: 'AM' as const }
    const wedAm = { date: '2026-09-02', period: 'AM' as const }
    await saveWeek(store, {
      token: TOKEN,
      weekStart: MONDAY,
      slots: [monAm],
      now: new Date('2026-08-31T08:00:00.000Z'),
    })
    const result = await saveWeek(store, {
      token: TOKEN,
      weekStart: MONDAY,
      slots: [wedAm],
      now: new Date('2026-09-02T08:00:00.000Z'),
    })
    expect(result.ok && result.week.slots).toEqual([monAm, wedAm])
  })
})
