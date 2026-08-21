// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeFacturationRouter } from '@/server/routers/facturation'
import {
  financeLineInput,
  makeMemoryFacturationDeps,
} from '@/server/routers/facturation-line.test.fixtures'

const api = createCallerFactory(makeFacturationRouter(makeMemoryFacturationDeps()))({
  session: { user: { id: 'u1', role: 'DIRECTION' }, expires: '2999-01-01' },
})

describe('facturation sendDevisFromLine', () => {
  it('sends a Devis from a line without Mission', async () => {
    const line = await api.createLine(financeLineInput)
    const result = await api.sendDevisFromLine({ id: line.id })
    expect(result.composeUrl).toContain('mail.google.com')
    expect(result.devis.status).toBe('SENT')
    const { rows } = await api.listSuivi()
    expect(rows[0]?.devisStatus).toBe('SENT')
  })
})
