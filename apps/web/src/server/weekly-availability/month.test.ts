// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { memoryAvailabilityStore } from './test-store'
import { getMonth } from './get-month'
import { saveMonth } from './save-month'

const token = 'tok_abcdefghijklmnopqrstuvwx'
const now = new Date('2026-09-03T09:00:00.000Z')
const store = () => memoryAvailabilityStore([{ token, candidateId: 'c1' }])

describe('saveMonth / getMonth', () => {
  it('stores slots spread across several weeks and reads them back', async () => {
    const target = store()
    await saveMonth(target, {
      token,
      month: '2026-09',
      now,
      slots: [
        { date: '2026-09-15', period: 'AM' },
        { date: '2026-09-24', period: 'PM' },
      ],
    })
    const read = await getMonth(target, { token, month: '2026-09', now })
    expect(read.ok && read.month.slots).toEqual([
      { date: '2026-09-15', period: 'AM' },
      { date: '2026-09-24', period: 'PM' },
    ])
  })

  it('drops slots outside the saved month', async () => {
    const target = store()
    await saveMonth(target, {
      token,
      month: '2026-09',
      now,
      slots: [{ date: '2026-10-01', period: 'AM' }],
    })
    const read = await getMonth(target, { token, month: '2026-10', now })
    expect(read.ok && read.month.slots).toEqual([])
  })

  it('defaults to the current Paris month', async () => {
    const read = await getMonth(store(), { token, now })
    expect(read.ok && read.month.month).toBe('2026-09')
  })

  it('reports an unknown token', async () => {
    expect(await getMonth(store(), { token: 'tok_unknown_aaaaaaaaaaaaaaaaaa', now })).toEqual({
      ok: false,
      reason: 'not_found',
    })
  })
})
