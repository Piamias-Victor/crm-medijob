// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import { facturationTestDeps } from '@/server/routers/facturation.test.deps'
import { EMPTY_PILOTAGE } from '@/view-models/facturation-pilotage'

describe('facturationRouter pilotage', () => {
  it('forbids Recruteur', async () => {
    const caller = createCallerFactory(
      makeFacturationRouter({
        ...facturationTestDeps(),
        pilotage: async () => EMPTY_PILOTAGE,
      }),
    )({ session: { user: { id: 'u1', role: 'RECRUTEUR' }, expires: '2999-01-01' } })

    await expect(caller.pilotage()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('returns Pilotage KPIs for Direction', async () => {
    const payload = {
      ...EMPTY_PILOTAGE,
      kpis: { ...EMPTY_PILOTAGE.kpis, ca: 5000, caPlacement: 5000, marge: 1500 },
    }
    const caller = createCallerFactory(
      makeFacturationRouter({
        ...facturationTestDeps(),
        pilotage: async () => payload,
      }),
    )({ session: { user: { id: 'u1', role: 'DIRECTION' }, expires: '2999-01-01' } })

    await expect(caller.pilotage({ exercice: '2025' })).resolves.toMatchObject({
      kpis: { ca: 5000, caPlacement: 5000, marge: 1500 },
    })
  })
})
