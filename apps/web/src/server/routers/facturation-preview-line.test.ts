// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import {
  financeLineDevisInput,
  financeLineInput,
  makeMemoryFacturationDeps,
} from '@/server/routers/facturation-line.test.fixtures'

function caller() {
  return createCallerFactory(makeFacturationRouter(makeMemoryFacturationDeps()))({
    session: { user: { id: 'u1', role: 'DIRECTION' }, expires: '2999-01-01' },
  })
}

describe('facturation preview Devis from line form', () => {
  it('previews a Devis without creating a Ligne de suivi', async () => {
    const api = caller()
    const result = await api.previewDevis(financeLineDevisInput)
    expect(result.quote.destinataire.pharmacyName).toBe('Pharma Nord')
    expect(result.quote.line.totalHt).toBe('5 000,00 €')
    expect((await api.listSuivi()).rows).toEqual([])
  })

  it('saves a Devis from preview then attaches it when the line is saved', async () => {
    const api = caller()
    const devis = await api.saveDevis(financeLineDevisInput)
    expect(devis.status).toBe('DRAFT')
    expect((await api.listSuivi()).rows).toEqual([])
    const line = await api.createLine({ ...financeLineInput, devisId: devis.id })
    expect(line.devisId).toBe(devis.id)
    expect((await api.listSuivi()).rows[0]?.devisId).toBe(devis.id)
  })

  it('sends a Devis from preview without creating a Ligne de suivi', async () => {
    const api = caller()
    const result = await api.sendDevis(financeLineDevisInput)
    expect(result.devis.status).toBe('SENT')
    expect(result.composeUrl).toContain('mail.google.com')
    expect((await api.listSuivi()).rows).toEqual([])
  })
})
