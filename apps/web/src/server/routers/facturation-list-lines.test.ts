// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import {
  financeLineInput,
  makeMemoryFacturationDeps,
} from '@/server/routers/facturation-line.test.fixtures'
import type { UserRole } from '@/server/auth/permissions'

function sess(role: UserRole) {
  return { user: { id: 'u1', role }, expires: '2999-01-01' }
}

function caller(role: UserRole) {
  return createCallerFactory(makeFacturationRouter(makeMemoryFacturationDeps()))({
    session: sess(role),
  })
}

describe('facturationRouter listLines', () => {
  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)(
    '%s cannot list Placements or Intérim',
    async (role) => {
      await expect(caller(role).listLines({ kind: 'PLACEMENT' })).rejects.toMatchObject({
        code: 'FORBIDDEN',
      })
      await expect(caller(role).listLines({ kind: 'INTERIM' })).rejects.toMatchObject({
        code: 'FORBIDDEN',
      })
    },
  )

  it('lists Placement lines only for Direction', async () => {
    const api = caller('DIRECTION')
    await api.createLine(financeLineInput)
    await api.createLine({ ...financeLineInput, kind: 'INTERIM', placementContractType: null })
    const { rows } = await api.listLines({ kind: 'PLACEMENT' })
    expect(rows).toEqual([
      expect.objectContaining({
        lineKind: 'PLACEMENT',
        jobTitle: 'Pharmacien',
        amountHt: 5000,
      }),
    ])
  })
})
