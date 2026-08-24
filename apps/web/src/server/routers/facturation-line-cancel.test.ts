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

describe('facturation cancel and restore line', () => {
  it('keeps a cancelled Placement visible then restores it', async () => {
    const api = caller('DIRECTION')
    const line = await api.createLine({ ...financeLineInput, placementContractType: 'CDI' })
    await api.cancelLine({ id: line.id })
    const cancelled = await api.listSuivi()
    expect(cancelled.rows[0]).toMatchObject({
      financeLineId: line.id,
      cancelled: true,
      amountHt: 5000,
    })
    const { rows: cancelledOnly } = await api.listSuivi({ cancelled: true })
    expect(cancelledOnly[0]?.financeLineId).toBe(line.id)
    await api.restoreLine({ id: line.id })
    const restored = await api.listSuivi()
    expect(restored.rows[0]).toMatchObject({ financeLineId: line.id, cancelled: false })
    const { rows: afterRestore } = await api.listSuivi({ cancelled: true })
    expect(afterRestore).toEqual([])
  })

  it('forbids Recruteur from cancelling a line', async () => {
    await expect(caller('RECRUTEUR').cancelLine({ id: 'line-1' })).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })
})
