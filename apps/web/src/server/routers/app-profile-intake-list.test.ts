// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { appProfileCaller, makeAppProfileTestDeps } from './app-profile.test-deps'

describe('appProfileRouter listIntakeFollowUp', () => {
  it('lists App intake follow-up excluding App-validated and Ignore', async () => {
    const listIntakeFollowUp = vi.fn().mockResolvedValue([
      {
        id: 'p1',
        badakanId: 'bk1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '0600000000',
        address: null,
        city: 'Paris',
        postalCode: '75001',
        activityLabel: 'Pharmacien',
        jobTitleId: null,
        hasResume: false,
        status: 'EN_ATTENTE',
        syncedAt: new Date('2026-03-12T10:00:00.000Z'),
        createdAt: new Date('2026-03-10T08:00:00.000Z'),
        jobTitle: null,
      },
    ])
    const rows = await appProfileCaller(
      makeAppProfileTestDeps({ listIntakeFollowUp }),
    ).listIntakeFollowUp()
    expect(listIntakeFollowUp).toHaveBeenCalledWith({
      referentScope: 'mine',
      population: 'default',
      currentUserId: 'u1',
    })
    expect(rows[0]).toMatchObject({
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '0600000000',
      email: 'ada@example.com',
      city: 'Paris',
      postalCode: '75001',
      createdAt: new Date('2026-03-10T08:00:00.000Z'),
    })
  })

  it('passes full queue scope when referentScope is all', async () => {
    const listIntakeFollowUp = vi.fn().mockResolvedValue([])
    await appProfileCaller(
      makeAppProfileTestDeps({ listIntakeFollowUp }),
    ).listIntakeFollowUp({ referentScope: 'all' })
    expect(listIntakeFollowUp).toHaveBeenCalledWith({
      referentScope: 'all',
      population: 'default',
      currentUserId: 'u1',
    })
  })

  it('passes archive population when requested', async () => {
    const listIntakeFollowUp = vi.fn().mockResolvedValue([])
    await appProfileCaller(
      makeAppProfileTestDeps({ listIntakeFollowUp }),
    ).listIntakeFollowUp({ population: 'archive' })
    expect(listIntakeFollowUp).toHaveBeenCalledWith({
      referentScope: 'mine',
      population: 'archive',
      currentUserId: 'u1',
    })
  })
})
