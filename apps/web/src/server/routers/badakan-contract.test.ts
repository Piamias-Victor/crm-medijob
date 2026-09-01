// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeBadakanContractRouter } from './badakan-contract'
import type { BadakanContractDeps } from './badakan-contract.deps'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const row = {
  id: 'row1',
  badakanId: 'c-lucie',
  recipientName: 'Lucie Robert',
  pharmacyName: 'Pharmacie Hermes',
  status: 'VALIDATED',
  pdfUrl: 'https://files.badakan.test/c-lucie.pdf',
  dpaeUrl: 'https://files.badakan.test/c-lucie-dpae.pdf',
}

function deps(overrides: Partial<BadakanContractDeps> = {}): BadakanContractDeps {
  return {
    list: vi.fn().mockResolvedValue([row]),
    ...overrides,
  }
}

function caller(d: BadakanContractDeps = deps()) {
  return createCallerFactory(makeBadakanContractRouter(d))({ session })
}

describe('badakanContractRouter', () => {
  it('lists Badakan contracts with status and PDF', async () => {
    const items = await caller().list()
    expect(items).toEqual([
      expect.objectContaining({
        recipientName: 'Lucie Robert',
        pharmacyName: 'Pharmacie Hermes',
        statusLabel: 'Validé',
        pdfHref: row.pdfUrl,
      }),
    ])
  })

  it('rejects unauthenticated reads', async () => {
    const unauth = createCallerFactory(makeBadakanContractRouter(deps()))({ session: null })
    await expect(unauth.list()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })
})
