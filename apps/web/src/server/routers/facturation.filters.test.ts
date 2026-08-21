// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import { facturationTestDeps } from '@/server/routers/facturation.test.deps'
import { listFacturationSuivi } from '@/lib/finance/list-facturation-suivi'
import { facturationMissions } from '@/server/routers/facturation.test.fixtures'
import { REFERENT_NONE } from '@/lib/constants/referent-none'

const listCaller = createCallerFactory(
  makeFacturationRouter(
    facturationTestDeps(async (filters) => listFacturationSuivi(facturationMissions, filters)),
  ),
)({ session: { user: { id: 'u1', role: 'DIRECTION' }, expires: '2999-01-01' } })

async function ids(filters: Parameters<typeof listCaller.listSuivi>[0]) {
  const { rows } = await listCaller.listSuivi(filters)
  return rows.map((row) => row.missionId)
}

describe('facturationRouter listSuivi filters', () => {
  it('filters by pharmacy, contract, referent and sentAt', async () => {
    expect(await ids({ pharmacyIds: ['p-nord'] })).toEqual(['m-sent'])
    expect(await ids({ contractTypes: ['INTERIM'] })).toEqual(['m-none'])
    expect(await ids({ referentIds: [REFERENT_NONE] })).toEqual(['m-none'])
    expect(await ids({ sentFrom: '2026-08-09' })).toEqual(['m-two'])
    expect(await ids({ sentTo: '2026-08-06' })).toEqual(['m-sent'])
  })

  it('drops Sans devis when a sentAt range is set', async () => {
    expect(await ids({ sentFrom: '2026-01-01', sentTo: '2026-12-31' })).toEqual([
      'm-sent',
      'm-two',
    ])
  })
})
