import { describe, expect, it, vi } from 'vitest'
import { makeBadakanMissionRepository } from './badakan-mission.repository'
import { EMPTY_BADAKAN_MISSION_DETAILS } from '@/server/badakan/map-mission-details'

const mapped = {
  ...EMPTY_BADAKAN_MISSION_DETAILS,
  jobTitleId: null,
  softwareId: null,
  badakanId: 'm-hermes',
  pharmacyName: 'Pharmacie Hermes',
  enterpriseId: 'ent-hermes',
  step: 'CANCELLED',
  periods: [{ start: '2026-08-01', end: '2026-08-03' }],
  searchApplied: [
    {
      recipientId: 'r-lucie',
      firstName: 'Lucie',
      lastName: 'Robert',
      phone: '0601020304',
    },
  ],
}

function mockDb() {
  return {
    badakanMission: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  }
}

describe('badakanMissionRepository', () => {
  it('lists persisted Badakan missions ordered by sync', async () => {
    const db = mockDb()
    db.badakanMission.findMany.mockResolvedValue([{ id: 'row1', ...mapped }])
    const repo = makeBadakanMissionRepository(db as never)
    const rows = await repo.list(10)
    expect(rows).toHaveLength(1)
    expect(db.badakanMission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        include: { searchApplied: true },
      }),
    )
  })

  it('keeps an existing job title when resolve returns null', async () => {
    const db = mockDb()
    db.badakanMission.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanMissionRepository(db as never)
    await repo.upsertFromRead(mapped)
    const payload = db.badakanMission.upsert.mock.calls[0]?.[0] as {
      create: { jobTitleId: unknown }
      update: { jobTitleId?: unknown }
    }
    expect(payload.create.jobTitleId).toBeNull()
    expect(payload.update).not.toHaveProperty('jobTitleId')
  })

  it('writes the resolved job title on create and update', async () => {
    const db = mockDb()
    db.badakanMission.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanMissionRepository(db as never)
    await repo.upsertFromRead({ ...mapped, jobTitleId: 'jt-prep' })
    expect(db.badakanMission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ jobTitleId: 'jt-prep' }),
        update: expect.objectContaining({ jobTitleId: 'jt-prep' }),
      }),
    )
  })

  it('upserts SEARCH_APPLIED applicants on a Badakan mission', async () => {
    const db = mockDb()
    db.badakanMission.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanMissionRepository(db as never)
    await repo.upsertFromRead(mapped)
    expect(db.badakanMission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { badakanId: 'm-hermes' },
        create: expect.objectContaining({
          pharmacyName: 'Pharmacie Hermes',
          enterpriseId: 'ent-hermes',
          searchApplied: { create: mapped.searchApplied },
        }),
      }),
    )
  })

  it('lists only missions that still need staffing', async () => {
    const db = mockDb()
    db.badakanMission.findMany.mockResolvedValue([
      {
        id: 'open',
        pharmacyName: 'Cygne',
        city: 'Strasbourg',
        activityLabel: 'Préparateur Expert',
        expectedRecipients: 2,
        staffedRecipients: 1,
        periods: [],
        jobTitle: { name: 'Préparateur' },
        software: { name: 'LGPI' },
      },
      {
        id: 'full',
        pharmacyName: 'Hermes',
        city: 'Lyon',
        activityLabel: 'Pharmacien',
        expectedRecipients: 1,
        staffedRecipients: 1,
        periods: [],
        jobTitle: null,
        software: null,
      },
    ])
    const repo = makeBadakanMissionRepository(db as never)
    const rows = await repo.listOpenNeeds(10)
    expect(rows.map((row) => row.id)).toEqual(['open'])
    expect(db.badakanMission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          jobTitle: { select: { name: true } },
          software: { select: { name: true } },
          proposals: { select: { status: true } },
        },
      }),
    )
  })
})
