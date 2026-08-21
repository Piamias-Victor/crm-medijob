// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import { buildFacturationOverview } from '@/view-models/facturation-overview'
import { facturationMissions } from '@/server/routers/facturation.test.fixtures'
import { facturationTestDeps } from '@/server/routers/facturation.test.deps'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'

const accepted: FacturationMissionRecord = {
  ...facturationMissions[0]!,
  id: 'm-ok',
  marge: 800,
  devis: [
    {
      ...facturationMissions[0]!.devis[0]!,
      id: 'd-ok',
      missionId: 'm-ok',
      status: 'ACCEPTED',
      acceptedAt: new Date('2026-08-12T00:00:00Z'),
      amountHt: 4000,
    },
  ],
}

describe('facturationRouter overview', () => {
  it('forbids Recruteur from overview', async () => {
    const caller = createCallerFactory(
      makeFacturationRouter({
        ...facturationTestDeps(),
        overview: async () => buildFacturationOverview([]),
      }),
    )({ session: { user: { id: 'u1', role: 'RECRUTEUR' }, expires: '2999-01-01' } })

    await expect(caller.overview()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('summarizes commercial counts, CA and Marge', async () => {
    const caller = createCallerFactory(
      makeFacturationRouter({
        ...facturationTestDeps(),
        overview: async () => buildFacturationOverview([...facturationMissions, accepted]),
      }),
    )({ session: { user: { id: 'u1', role: 'DIRECTION' }, expires: '2999-01-01' } })

    await expect(caller.overview()).resolves.toMatchObject({
      counts: { SANS_DEVIS: 2, ENVOYE: 2, ACCEPTE: 1, FACTURE: 0 },
      ca: 4000,
      marge: 800,
    })
  })

  it('applies suivi filters to overview stats', async () => {
    const missions = [...facturationMissions, accepted]
    const caller = createCallerFactory(
      makeFacturationRouter({
        ...facturationTestDeps(),
        overview: async (filters) => buildFacturationOverview(missions, filters),
      }),
    )({ session: { user: { id: 'u1', role: 'DIRECTION' }, expires: '2999-01-01' } })

    await expect(caller.overview({ contractTypes: ['INTERIM'] })).resolves.toMatchObject({
      counts: { SANS_DEVIS: 1, ENVOYE: 0, ACCEPTE: 0, FACTURE: 0 },
      ca: 0,
      marge: 0,
    })
  })
})
