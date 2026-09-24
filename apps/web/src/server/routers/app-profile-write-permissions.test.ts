// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import * as permissions from '@/server/auth/permissions'
import { makeAppProfileRouter } from './app-profile'
import { makeAppProfileTestDeps } from './app-profile.test-deps'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function caller(deps = makeAppProfileTestDeps()) {
  return createCallerFactory(makeAppProfileRouter(deps))({ session })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('appProfile write permissions', () => {
  it('rejects ignore without crm.write', async () => {
    vi.spyOn(permissions, 'can').mockReturnValue(false)
    await expect(caller().ignore({ id: 'p1' })).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('rejects updateIntake without crm.write', async () => {
    vi.spyOn(permissions, 'can').mockReturnValue(false)
    await expect(
      caller().updateIntake({
        id: 'p1',
        intakeStatus: 'A_APPELER',
        callOutcome: null,
        plannedRdvAt: null,
        notes: null,
        referentId: null,
        relanceAt: null,
      }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('allows ignore with crm.write', async () => {
    const markStatus = vi.fn()
    await caller(makeAppProfileTestDeps({ markStatus })).ignore({ id: 'p1' })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
  })
})
