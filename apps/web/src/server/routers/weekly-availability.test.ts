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
    declaredStore: { listDeclared: async () => [] },
    lookupGeo: async () => null,
    createToken: () => 'unguessable-token-32bytes-base64url',
    getBaseUrl: () => 'http://localhost:3000',
    resendSms: async () => 'sent' as const,
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

  it('resends the same weekly availability URL by SMS', async () => {
    const result = await caller().resendSms({ id: 'c1' })
    expect(result).toEqual({ sent: true })
  })

  it('saves a whole month from the public link', async () => {
    const api = caller()
    const saved = await api.saveMonth({
      token: TOKEN,
      month: '2099-09',
      slots: [{ date: '2099-09-15', period: 'AM' }],
    })
    expect(saved.slots).toEqual([{ date: '2099-09-15', period: 'AM' }])
    expect(await api.getMonth({ token: TOKEN, month: '2099-09' })).toEqual(saved)
  })

  it('exposes the month planning of a Candidate to the CRM', async () => {
    const shared = deps()
    await caller(shared).saveMonth({
      token: TOKEN,
      month: '2099-09',
      slots: [{ date: '2099-09-15', period: 'PM' }],
    })
    const planning = await caller(shared).candidateMonth({ candidateId: 'c1', month: '2099-09' })
    expect(planning).toEqual({ month: '2099-09', slots: [{ date: '2099-09-15', period: 'PM' }] })
  })

  it('lets staff save dispos by candidate id', async () => {
    const shared = deps()
    const saved = await caller(shared).saveCandidateMonth({
      candidateId: 'c1',
      month: '2099-09',
      slots: [{ date: '2099-09-16', period: 'AM' }],
    })
    expect(saved).toEqual({ month: '2099-09', slots: [{ date: '2099-09-16', period: 'AM' }] })
    expect(await caller(shared).candidateMonth({ candidateId: 'c1', month: '2099-09' })).toEqual(
      saved,
    )
  })
})
