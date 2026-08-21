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

describe('facturation createLine', () => {
  it('Direction creates a line without Mission and sees CA in Facturation', async () => {
    const api = caller('DIRECTION')
    await api.createLine(financeLineInput)
    const { rows } = await api.listSuivi()
    expect(rows).toEqual([
      expect.objectContaining({
        pharmacyName: 'Pharma Nord',
        candidateName: 'Ada Lovelace',
        amountHt: 5000,
        missionId: null,
        lineKind: 'PLACEMENT',
        commercialStatus: 'ACCEPTE',
      }),
    ])
    await expect(api.overview()).resolves.toMatchObject({ ca: 5000, marge: 1500 })
  })

  it('Direction can attach an optional Mission on the line', async () => {
    const api = caller('DIRECTION')
    await api.createLine({ ...financeLineInput, missionId: 'm1' })
    const { rows } = await api.listSuivi()
    expect(rows[0]).toMatchObject({ missionId: 'm1', amountHt: 5000 })
  })

  it('forbids Recruteur from creating a finance line', async () => {
    await expect(caller('RECRUTEUR').createLine(financeLineInput)).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })

  it('generates a Devis tied to the Pharmacy and Mission', async () => {
    const api = caller('DIRECTION')
    const line = await api.createLine({ ...financeLineInput, missionId: 'm1' })
    const generated = await api.generateDevisFromLine({ id: line.id })
    expect(generated).toMatchObject({
      pharmacyId: 'p1',
      missionId: 'm1',
      devis: { amountHt: 5000, status: 'DRAFT', kind: 'CDD' },
    })
    const { rows } = await api.listSuivi()
    expect(rows[0]?.devisId).toBe(generated.devis.id)
  })

  it('refuses to generate a Devis when the line has no Mission', async () => {
    const api = caller('DIRECTION')
    const line = await api.createLine(financeLineInput)
    await expect(api.generateDevisFromLine({ id: line.id })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
  })
})
