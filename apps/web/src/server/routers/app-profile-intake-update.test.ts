// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { appProfileCaller, makeAppProfileTestDeps } from './app-profile.test-deps'

const intakeRow = {
  id: 'p1',
  badakanId: 'bk1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: null,
  phone: null,
  address: null,
  city: null,
  postalCode: null,
  activityLabel: null,
  jobTitleId: null,
  hasResume: false,
  status: 'EN_ATTENTE' as const,
  intakeStatus: 'A_RELANCER' as const,
  callOutcome: 'MESSAGERIE' as const,
  plannedRdvAt: null,
  notes: 'rappel',
  syncedAt: new Date('2026-03-12T10:00:00.000Z'),
  createdAt: new Date('2026-03-10T08:00:00.000Z'),
  jobTitle: null,
}

describe('appProfileRouter updateIntake', () => {
  it('updates Intake ops fields and returns list item', async () => {
    const updateIntake = vi.fn().mockResolvedValue(intakeRow)
    const result = await appProfileCaller(makeAppProfileTestDeps({ updateIntake })).updateIntake({
      id: 'p1',
      intakeStatus: 'A_RELANCER',
      callOutcome: 'MESSAGERIE',
      plannedRdvAt: null,
      notes: 'rappel',
    })
    expect(updateIntake).toHaveBeenCalledWith('p1', {
      intakeStatus: 'A_RELANCER',
      callOutcome: 'MESSAGERIE',
      plannedRdvAt: null,
      notes: 'rappel',
    })
    expect(result).toMatchObject({
      id: 'p1',
      intakeStatus: 'A_RELANCER',
      callOutcome: 'MESSAGERIE',
      notes: 'rappel',
    })
  })

  it('rejects RDV_PRIS without planned RDV date', async () => {
    await expect(
      appProfileCaller(makeAppProfileTestDeps()).updateIntake({
        id: 'p1',
        intakeStatus: 'A_APPELER',
        callOutcome: 'RDV_PRIS',
        plannedRdvAt: null,
        notes: null,
      }),
    ).rejects.toThrow()
  })
})
