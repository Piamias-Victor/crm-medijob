import { describe, expect, it, vi } from 'vitest'
import { makeBadakanContractRepository } from './badakan-contract.repository'

const mapped = {
  badakanId: 'c-lucie',
  status: 'VALIDATED',
  pdfUrl: 'https://files.badakan.test/c-lucie.pdf',
  dpaeUrl: 'https://files.badakan.test/c-lucie-dpae.pdf',
  recipientName: 'Lucie Robert',
  pharmacyName: 'Pharmacie Hermes',
}

function mockDb() {
  return {
    badakanContract: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  }
}

describe('badakanContractRepository', () => {
  it('lists persisted Badakan contracts ordered by sync', async () => {
    const db = mockDb()
    db.badakanContract.findMany.mockResolvedValue([{ id: 'row1', ...mapped }])
    const repo = makeBadakanContractRepository(db as never)
    const rows = await repo.list(10)
    expect(rows).toHaveLength(1)
    expect(db.badakanContract.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        orderBy: { syncedAt: 'desc' },
      }),
    )
  })

  it('upserts a Badakan contract read without a FinanceLine', async () => {
    const db = mockDb()
    db.badakanContract.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanContractRepository(db as never)
    await repo.upsertFromRead(mapped)
    expect(db.badakanContract.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { badakanId: 'c-lucie' },
        create: expect.objectContaining({
          status: 'VALIDATED',
          pdfUrl: mapped.pdfUrl,
          pharmacyName: 'Pharmacie Hermes',
        }),
      }),
    )
    expect(db).not.toHaveProperty('financeLine')
  })
})
