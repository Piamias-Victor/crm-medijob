import { describe, expect, it } from 'vitest'
import { makeBadakanMissionRepository } from './badakan-mission.repository'
import { mappedMission, mockMissionDb } from './badakan-mission.repository.fixtures'

describe('badakanMissionRepository', () => {
  it('lists persisted Badakan missions ordered by sync', async () => {
    const db = mockMissionDb()
    db.badakanMission.findMany.mockResolvedValue([{ id: 'row1', ...mappedMission }])
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
    const db = mockMissionDb()
    db.badakanMission.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanMissionRepository(db as never)
    await repo.upsertFromRead(mappedMission)
    const payload = db.badakanMission.upsert.mock.calls[0]?.[0] as {
      create: { jobTitleId: unknown }
      update: { jobTitleId?: unknown }
    }
    expect(payload.create.jobTitleId).toBeNull()
    expect(payload.update).not.toHaveProperty('jobTitleId')
  })

  it('writes the resolved job title on create and update', async () => {
    const db = mockMissionDb()
    db.badakanMission.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanMissionRepository(db as never)
    await repo.upsertFromRead({ ...mappedMission, jobTitleId: 'jt-prep' })
    expect(db.badakanMission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ jobTitleId: 'jt-prep' }),
        update: expect.objectContaining({ jobTitleId: 'jt-prep' }),
      }),
    )
  })

  it('upserts SEARCH_APPLIED applicants on a Badakan mission', async () => {
    const db = mockMissionDb()
    db.badakanMission.upsert.mockResolvedValue({ id: 'row1' })
    const repo = makeBadakanMissionRepository(db as never)
    await repo.upsertFromRead(mappedMission)
    expect(db.badakanMission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { badakanId: 'm-hermes' },
        create: expect.objectContaining({
          pharmacyName: 'Pharmacie Hermes',
          enterpriseId: 'ent-hermes',
          searchApplied: { create: mappedMission.searchApplied },
        }),
      }),
    )
  })
})
