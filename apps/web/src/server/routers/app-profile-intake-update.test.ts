// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { appProfileCaller, makeAppProfileTestDeps } from './app-profile.test-deps'
import { defaultRelanceAfterCall } from '@/view-models/app-profile-relance'

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
  referentId: null,
  relanceAt: new Date('2026-03-12T12:00:00.000Z'),
  lastCalledAt: new Date('2026-03-10T15:00:00.000Z'),
  lastCalledById: 'u1',
  syncedAt: new Date('2026-03-12T10:00:00.000Z'),
  createdAt: new Date('2026-03-10T08:00:00.000Z'),
  jobTitle: null,
  referent: null,
  lastCalledBy: { id: 'u1', name: 'Alice' },
}

describe('appProfileRouter updateIntake', () => {
  it('stamps last-call and bumps relance when Call outcome changes', async () => {
    const findById = vi.fn().mockResolvedValue({ ...intakeRow, callOutcome: null })
    const updateIntake = vi.fn().mockResolvedValue(intakeRow)
    await appProfileCaller(makeAppProfileTestDeps({ findById, updateIntake })).updateIntake({
      id: 'p1',
      intakeStatus: 'A_RELANCER',
      callOutcome: 'MESSAGERIE',
      plannedRdvAt: null,
      notes: 'rappel',
      referentId: null,
      relanceAt: new Date('2026-03-10T12:00:00.000Z'),
    })
    const [, data] = updateIntake.mock.calls[0]!
    expect(data.lastCalledById).toBe('u1')
    expect(data.lastCalledAt).toBeInstanceOf(Date)
    expect(data.relanceAt).toEqual(defaultRelanceAfterCall(data.lastCalledAt as Date))
  })

  it('persists Referent without stamping when Call outcome unchanged', async () => {
    const findById = vi.fn().mockResolvedValue(intakeRow)
    const updateIntake = vi.fn().mockResolvedValue({
      ...intakeRow,
      referentId: 'u1',
      referent: { id: 'u1', name: 'Alice' },
    })
    const result = await appProfileCaller(
      makeAppProfileTestDeps({ findById, updateIntake }),
    ).updateIntake({
      id: 'p1',
      intakeStatus: 'A_RELANCER',
      callOutcome: 'MESSAGERIE',
      plannedRdvAt: null,
      notes: 'rappel',
      referentId: 'u1',
      relanceAt: new Date('2026-03-20T12:00:00.000Z'),
    })
    expect(updateIntake).toHaveBeenCalledWith('p1', {
      intakeStatus: 'A_RELANCER',
      callOutcome: 'MESSAGERIE',
      plannedRdvAt: null,
      notes: 'rappel',
      referentId: 'u1',
      relanceAt: new Date('2026-03-20T12:00:00.000Z'),
    })
    expect(result.referentId).toBe('u1')
  })

  it('rejects RDV_PRIS without planned RDV date', async () => {
    await expect(
      appProfileCaller(makeAppProfileTestDeps()).updateIntake({
        id: 'p1',
        intakeStatus: 'A_APPELER',
        callOutcome: 'RDV_PRIS',
        plannedRdvAt: null,
        notes: null,
        referentId: null,
        relanceAt: null,
      }),
    ).rejects.toThrow()
  })
})
