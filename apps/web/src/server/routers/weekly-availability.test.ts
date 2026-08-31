// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeWeeklyAvailabilityRouter } from './weekly-availability'
import { memoryAvailabilityStore } from '@/server/weekly-availability/test-store'
import type { WeeklyAvailabilityDeps } from './weekly-availability.deps'

const TOKEN = 'valid-secret-token-xxxxxxxxxx'
const MONDAY = '2026-08-31'
const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function deps(): WeeklyAvailabilityDeps {
  return {
    store: memoryAvailabilityStore([
      { token: TOKEN, candidateId: 'c1', origin: 'APP' },
    ]),
    filterStore: { listBySlot: async () => [] },
    lookupGeo: async () => null,
    createToken: () => 'unguessable-token-32bytes-base64url',
    getBaseUrl: () => 'http://localhost:3000',
  }
}

function caller(d = deps(), sess: typeof session | null = session) {
  return createCallerFactory(makeWeeklyAvailabilityRouter(d))({ session: sess })
}

describe('weeklyAvailabilityRouter', () => {
  it('refuses an unknown token and reads a never-submitted week as unknown', async () => {
    const api = caller()
    expect(await api.getWeek({ token: 'no-such-token-xxxxxxxxxx' })).toBeNull()
    const week = await api.getWeek({ token: TOKEN, weekStart: MONDAY })
    expect(week).toMatchObject({ weekStart: MONDAY, declaration: 'unknown', slots: [] })
  })

  it('saves an empty week as declared unavailable', async () => {
    const week = await caller().saveWeek({ token: TOKEN, weekStart: MONDAY, slots: [] })
    expect(week.declaration).toBe('declared_unavailable')
  })

  it('copies a public URL for an App-origin Candidate', async () => {
    const link = await caller().copyLink({ id: 'c1' })
    expect(link?.url).toBe('http://localhost:3000/dispo/valid-secret-token-xxxxxxxxxx')
  })
})
