// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import { makeMemoryFacturationDeps } from '@/server/routers/facturation-line.test.fixtures'

const api = createCallerFactory(makeFacturationRouter(makeMemoryFacturationDeps()))({
  session: { user: { id: 'u1', role: 'DIRECTION' }, expires: '2999-01-01' },
})

describe('facturation createLine Placement', () => {
  it('Direction books a Placement CDI with CA 0 and a Referent', async () => {
    await api.createLine({
      pharmacyId: 'p1',
      candidateId: 'c1',
      kind: 'PLACEMENT',
      amountHt: 0,
      placementContractType: 'CDI',
      referentId: 'u-alice',
      occurredAt: new Date('2026-08-01T00:00:00Z'),
    })
    const { rows } = await api.listSuivi()
    expect(rows[0]).toMatchObject({
      amountHt: 0,
      contractType: 'CDI',
      referentId: 'u-alice',
      referentName: 'Alice',
      lineKind: 'PLACEMENT',
    })
  })
})
