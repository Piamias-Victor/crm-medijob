// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import { facturationTestDeps } from '@/server/routers/facturation.test.deps'
import { listFacturationSuivi } from '@/lib/finance/list-facturation-suivi'
import { currentSent, facturationMissions } from '@/server/routers/facturation.test.fixtures'
import type { UserRole } from '@/server/auth/permissions'

function sess(role: UserRole) {
  return { user: { id: 'u1', role }, expires: '2999-01-01' }
}

function caller(role: UserRole) {
  return createCallerFactory(makeFacturationRouter(facturationTestDeps()))({ session: sess(role) })
}

describe('facturationRouter permissions', () => {
  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)(
    '%s cannot list facturation suivi',
    async (role) => {
      await expect(caller(role).listSuivi()).rejects.toMatchObject({ code: 'FORBIDDEN' })
    },
  )
})

describe('facturationRouter listSuivi', () => {
  it('lists one row per mission for the current devis', async () => {
    const listCaller = createCallerFactory(
      makeFacturationRouter(
        facturationTestDeps(async () => listFacturationSuivi(facturationMissions)),
      ),
    )({ session: sess('DIRECTION') })

    const { rows } = await listCaller.listSuivi()
    expect(rows).toEqual([
      expect.objectContaining({
        missionId: 'm-sent',
        pharmacyName: 'Pharma Nord',
        commercialStatus: 'ENVOYE',
        amountHt: 3000,
      }),
      expect.objectContaining({
        missionId: 'm-draft',
        commercialStatus: 'SANS_DEVIS',
        sentAt: null,
        amountHt: 3000,
      }),
      expect.objectContaining({
        missionId: 'm-two',
        commercialStatus: 'ENVOYE',
        sentAt: currentSent.sentAt,
        amountHt: 4000,
      }),
      expect.objectContaining({
        missionId: 'm-none',
        commercialStatus: 'SANS_DEVIS',
        referentName: null,
      }),
    ])
  })

  it('filters suivi rows by commercial status', async () => {
    const listCaller = createCallerFactory(
      makeFacturationRouter(
        facturationTestDeps(async (filters) => listFacturationSuivi(facturationMissions, filters)),
      ),
    )({ session: sess('DIRECTION') })

    const { rows } = await listCaller.listSuivi({ commercialStatuses: ['SANS_DEVIS'] })
    expect(rows.map((row) => row.missionId)).toEqual(['m-draft', 'm-none'])
  })
})
