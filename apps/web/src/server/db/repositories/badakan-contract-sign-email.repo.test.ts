import { describe, expect, it, vi } from 'vitest'
import { makeBadakanContractSignEmailRepository } from './badakan-contract-sign-email.repo'
import { NOT_DELETED } from './soft-delete'
import { enterpriseLinked, enterpriseUnlinked } from './pharmacy-apply-email.repo.fixtures'

function mockDb() {
  return {
    badakanContract: { findMany: vi.fn(), update: vi.fn() },
    badakanEnterprise: { findMany: vi.fn() },
    pharmacy: { findMany: vi.fn() },
    contact: { findMany: vi.fn() },
  }
}

const pending = { id: 'row1', enterpriseId: 'ent-hermes' }

describe('badakanContractSignEmailRepository listDue', () => {
  it('lists a new CREATED contract with pharmacy and primary contact emails', async () => {
    const db = mockDb()
    db.badakanContract.findMany.mockResolvedValue([pending])
    db.badakanEnterprise.findMany.mockResolvedValue([enterpriseLinked])
    db.pharmacy.findMany.mockResolvedValue([{ id: 'p1', email: 'officine@example.com' }])
    db.contact.findMany.mockResolvedValue([
      { id: 'ct1', pharmacyId: 'p1', email: 'marie@example.com', firstName: 'Marie' },
    ])
    const rows = await makeBadakanContractSignEmailRepository(db as never).listDue()
    expect(db.badakanContract.findMany).toHaveBeenCalledWith({
      where: {
        status: 'CREATED',
        signInviteEmailSentAt: null,
        enterpriseId: { not: null },
      },
      select: { id: true, enterpriseId: true },
    })
    expect(rows).toEqual([
      {
        contractId: 'row1',
        pharmacyId: 'p1',
        contactId: 'ct1',
        pharmacyEmail: 'officine@example.com',
        primaryEmail: 'marie@example.com',
        primaryFirstName: 'Marie',
      },
    ])
    expect(db.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          ...NOT_DELETED,
          isPrimary: true,
          pharmacyId: { in: ['p1'] },
        }),
      }),
    )
  })

  it('falls back to the Badakan principal when the Pharmacy is not linked', async () => {
    const db = mockDb()
    db.badakanContract.findMany.mockResolvedValue([pending])
    db.badakanEnterprise.findMany.mockResolvedValue([enterpriseUnlinked])
    db.pharmacy.findMany.mockResolvedValue([])
    db.contact.findMany.mockResolvedValue([])
    const rows = await makeBadakanContractSignEmailRepository(db as never).listDue()
    expect(rows).toEqual([
      {
        contractId: 'row1',
        pharmacyId: null,
        contactId: null,
        pharmacyEmail: 'd.litzler@hermes.fr',
        primaryEmail: 'd.litzler@hermes.fr',
        primaryFirstName: 'Dominique',
      },
    ])
  })
})

describe('badakanContractSignEmailRepository markSent', () => {
  it('stamps signInviteEmailSentAt after a real send', async () => {
    const db = mockDb()
    db.badakanContract.update.mockResolvedValue({})
    await makeBadakanContractSignEmailRepository(db as never).markSent('row1')
    expect(db.badakanContract.update).toHaveBeenCalledWith({
      where: { id: 'row1' },
      data: { signInviteEmailSentAt: expect.any(Date) },
    })
  })
})
