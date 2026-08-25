// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import {
  financeLineInput,
  makeMemoryFacturationDeps,
} from '@/server/routers/facturation-line.test.fixtures'
import type { UserRole } from '@/server/auth/permissions'

function caller(role: UserRole) {
  return createCallerFactory(makeFacturationRouter(makeMemoryFacturationDeps()))({
    session: { user: { id: 'u1', role }, expires: '2999-01-01' },
  })
}

const occurredAt = new Date('2026-08-01T00:00:00Z')

describe('facturation line Facturé and Encaissé', () => {
  it('marks Facturé then Encaissé without changing CA or date', async () => {
    const api = caller('DIRECTION')
    const line = await api.createLine({ ...financeLineInput, occurredAt })
    await api.setInvoiced({ id: line.id, invoiced: true })
    await api.setPaid({ id: line.id, paid: true })
    const { rows } = await api.listSuivi()
    expect(rows[0]).toMatchObject({
      financeLineId: line.id,
      amountHt: 5000,
      invoiced: true,
      paid: true,
    })
    expect(rows[0]?.acceptedAt).toEqual(occurredAt)
  })

  it('forbids Recruteur from marking Encaissé', async () => {
    await expect(caller('RECRUTEUR').setPaid({ id: 'line-1', paid: true })).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })
})
