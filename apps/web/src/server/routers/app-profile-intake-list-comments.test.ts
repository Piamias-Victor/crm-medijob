// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { appProfileCaller, makeAppProfileTestDeps } from './app-profile.test-deps'
import { stubBadakanClient } from './app-profile.test-client'

const listRow = {
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
  status: 'EN_ATTENTE' as const,
  calendarSmsSentAt: new Date('2026-09-01T00:00:00.000Z'),
  syncedAt: new Date('2026-03-12T10:00:00.000Z'),
  createdAt: new Date('2026-03-10T08:00:00.000Z'),
  jobTitle: null,
}

describe('appProfileRouter listIntakeFollowUp comments + SMS', () => {
  it('skips live Badakan comments on list (avoids N+1 timeout)', async () => {
    const getComments = vi.fn().mockResolvedValue([
      {
        id: 'c1',
        content: 'Répondeur.',
        authorName: 'Ops',
        date: new Date('2026-03-12T14:32:00.000Z'),
      },
    ])
    const rows = await appProfileCaller(
      makeAppProfileTestDeps({
        listIntakeFollowUp: vi.fn().mockResolvedValue([listRow]),
        getBadakanClient: () => stubBadakanClient({ getComments }),
      }),
    ).listIntakeFollowUp()
    expect(getComments).not.toHaveBeenCalled()
    expect(rows[0]).toMatchObject({
      badakanCommentsLabel: '—',
      intakeBookingSmsLabel: 'Envoyé',
    })
  })

  it('still maps SMS from calendarSmsSentAt without Badakan', async () => {
    const rows = await appProfileCaller(
      makeAppProfileTestDeps({
        listIntakeFollowUp: vi.fn().mockResolvedValue([{ ...listRow, calendarSmsSentAt: null }]),
      }),
    ).listIntakeFollowUp()
    expect(rows[0]).toMatchObject({
      badakanCommentsLabel: '—',
      intakeBookingSmsLabel: '—',
    })
  })
})
