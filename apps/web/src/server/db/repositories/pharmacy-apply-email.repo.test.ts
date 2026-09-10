import { describe, expect, it } from 'vitest'
import { makePharmacyApplyEmailRepository } from './pharmacy-apply-email.repo'
import { NOT_DELETED } from './soft-delete'
import {
  appliedHermes,
  enterpriseLinked,
  enterpriseUnlinked,
  mockPharmacyApplyEmailDb,
} from './pharmacy-apply-email.repo.fixtures'

describe('pharmacyApplyEmailRepository listDue', () => {
  it('lists a new SEARCH_APPLIED with pharmacy and primary contact emails', async () => {
    const db = mockPharmacyApplyEmailDb()
    db.badakanSearchApplied.findMany.mockResolvedValue([appliedHermes])
    db.badakanPharmacyApplyEmail.findMany.mockResolvedValue([])
    db.badakanEnterprise.findMany.mockResolvedValue([enterpriseLinked])
    db.pharmacy.findMany.mockResolvedValue([{ id: 'p1', email: 'officine@example.com' }])
    db.contact.findMany.mockResolvedValue([
      { id: 'ct1', pharmacyId: 'p1', email: 'marie@example.com', firstName: 'Marie' },
    ])
    const rows = await makePharmacyApplyEmailRepository(db as never).listDue()
    expect(rows).toEqual([
      {
        missionBadakanId: 'm-hermes',
        recipientId: 'rec-1',
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

  it('skips SEARCH_APPLIED already in the journal', async () => {
    const db = mockPharmacyApplyEmailDb()
    db.badakanSearchApplied.findMany.mockResolvedValue([appliedHermes])
    db.badakanPharmacyApplyEmail.findMany.mockResolvedValue([
      { missionBadakanId: 'm-hermes', recipientId: 'rec-1' },
    ])
    const rows = await makePharmacyApplyEmailRepository(db as never).listDue()
    expect(rows).toEqual([])
    expect(db.badakanEnterprise.findMany).not.toHaveBeenCalled()
  })

  it('falls back to the Badakan principal when the Pharmacy is not linked', async () => {
    const db = mockPharmacyApplyEmailDb()
    db.badakanSearchApplied.findMany.mockResolvedValue([appliedHermes])
    db.badakanPharmacyApplyEmail.findMany.mockResolvedValue([])
    db.badakanEnterprise.findMany.mockResolvedValue([enterpriseUnlinked])
    db.pharmacy.findMany.mockResolvedValue([])
    db.contact.findMany.mockResolvedValue([])
    const rows = await makePharmacyApplyEmailRepository(db as never).listDue()
    expect(rows).toEqual([
      {
        missionBadakanId: 'm-hermes',
        recipientId: 'rec-1',
        pharmacyId: null,
        contactId: null,
        pharmacyEmail: 'd.litzler@hermes.fr',
        primaryEmail: 'd.litzler@hermes.fr',
        primaryFirstName: 'Dominique',
      },
    ])
  })
})

describe('pharmacyApplyEmailRepository markSent', () => {
  it('writes the journal key after a real send', async () => {
    const db = mockPharmacyApplyEmailDb()
    db.badakanPharmacyApplyEmail.upsert.mockResolvedValue({})
    await makePharmacyApplyEmailRepository(db as never).markSent('m-hermes', 'rec-1')
    expect(db.badakanPharmacyApplyEmail.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          missionBadakanId_recipientId: { missionBadakanId: 'm-hermes', recipientId: 'rec-1' },
        },
        create: { missionBadakanId: 'm-hermes', recipientId: 'rec-1' },
      }),
    )
  })
})
