// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { makeMissionRouter } from '@/server/routers/mission'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import { createCallerFactory } from '@/server/trpc'
import { makeMissionDeps, missionCaller } from '@/server/routers/mission.test.fixtures'

const statusInput = { id: 'm1', status: 'EN_RECHERCHE' as const }

describe('missionRouter', () => {
  it('returns typed list rows and kanban missions from list', async () => {
    const kanban = [
      {
        id: 'm1',
        title: 'CDI',
        status: 'A_POURVOIR' as const,
        startDate: new Date('2026-03-01'),
        jobTitle: { name: 'Pharmacien' },
        pharmacy: { name: 'Pharmacie du Centre', city: 'Lyon' },
        referent: { name: 'Réf Demo' },
      },
    ]
    const deps = makeMissionDeps({ list: vi.fn().mockResolvedValue(kanban) })
    const result = await missionCaller(deps).list()
    expect(result.kanban).toEqual(kanban)
    expect(result.rows[0]).toMatchObject({ id: 'm1', title: 'CDI', pharmacyName: 'Pharmacie du Centre' })
  })

  it('maps getById through mission detail view-model', async () => {
    const mission = await missionCaller(makeMissionDeps()).getById({ id: 'm1' })
    expect((mission as MissionDetailPayload).pharmacyName).toBe('Pharmacie du Centre')
  })

  it('updates mission fields', async () => {
    const deps = makeMissionDeps()
    await missionCaller(deps).update({
      id: 'm1',
      data: {
        title: 'Adjoint CDD',
        jobTitleId: 'jt1',
        contractType: 'CDD',
        pharmacyId: 'p1',
        referentId: 'u1',
        startDate: new Date('2026-04-01'),
        tempsPlein: true,
      },
    })
    expect(deps.update).toHaveBeenCalled()
  })

  it('delegates markAnnulee to terminal transition', async () => {
    const deps = makeMissionDeps({
      updateStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'ANNULEE' }),
    })
    await missionCaller(deps).markAnnulee({ id: 'm1' })
    expect(deps.updateStatus).toHaveBeenCalledWith({ id: 'm1', status: 'ANNULEE' })
  })

  it('keeps markPourvu on router for pipeline issue #66', async () => {
    const deps = makeMissionDeps({
      updateStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'POURVU' }),
    })
    await missionCaller(deps).markPourvu({ id: 'm1', placedCandidateId: 'c2' })
    expect(deps.updateStatus).toHaveBeenCalledWith({
      id: 'm1',
      status: 'POURVU',
      placedCandidateId: 'c2',
    })
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeMissionRouter(makeMissionDeps()))({ session: null })
    await expect(unauth.updateStatus(statusInput)).rejects.toThrow()
  })

  it('requires placedCandidateId when status is POURVU', async () => {
    await expect(
      missionCaller(makeMissionDeps()).updateStatus({ id: 'm1', status: 'POURVU' }),
    ).rejects.toThrow()
  })
})
