import { describe, expect, it, vi } from 'vitest'
import { syncBadakanContracts } from './sync'
import type { BadakanContract } from '@/server/badakan/map-contract'

const mapped: BadakanContract = {
  badakanId: 'c-lucie',
  status: 'VALIDATED',
  pdfUrl: 'https://files.badakan.test/c-lucie.pdf',
  dpaeUrl: 'https://files.badakan.test/c-lucie-dpae.pdf',
  recipientName: 'Lucie Robert',
  pharmacyName: 'Pharmacie Hermes',
}

describe('syncBadakanContracts', () => {
  it('persists search results and never creates a Ligne de suivi', async () => {
    const upsertFromRead = vi.fn()
    const createFinanceLine = vi.fn()
    const result = await syncBadakanContracts({
      searchContracts: async () => [mapped],
      upsertFromRead,
    })
    expect(upsertFromRead).toHaveBeenCalledWith(mapped)
    expect(createFinanceLine).not.toHaveBeenCalled()
    expect(result).toEqual({ fetched: 1, upserted: 1 })
  })
})
