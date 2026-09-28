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
  it('batches Badakan comments and maps Intake booking SMS without live Badakan', async () => {
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
    expect(getComments).toHaveBeenCalledWith('bk1')
    expect(rows[0]).toMatchObject({
      badakanCommentsLabel: 'Répondeur.',
      intakeBookingSmsLabel: 'Envoyé',
    })
  })

  it('keeps empty Badakan comments label when getComments fails', async () => {
    const rows = await appProfileCaller(
      makeAppProfileTestDeps({
        listIntakeFollowUp: vi.fn().mockResolvedValue([{ ...listRow, calendarSmsSentAt: null }]),
        getBadakanClient: () =>
          stubBadakanClient({
            getComments: vi.fn().mockRejectedValue(new Error('missing env')),
          }),
      }),
    ).listIntakeFollowUp()
    expect(rows[0]).toMatchObject({
      badakanCommentsLabel: '—',
      intakeBookingSmsLabel: '—',
    })
  })
})
