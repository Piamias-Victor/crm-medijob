// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeMissionRouter, type MissionDeps } from '@/server/routers/mission'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }
const statusInput = { id: 'm1', status: 'EN_RECHERCHE' as const }

function makeDeps(overrides: Partial<MissionDeps> = {}): MissionDeps {
  return {
    list: vi.fn().mockResolvedValue([]),
    createQuick: vi.fn().mockResolvedValue({ id: 'm1', status: 'A_POURVOIR' }),
    createJobTitle: vi.fn().mockResolvedValue({ id: 'jt1', name: 'Préparateur' }),
    referentials: vi.fn().mockResolvedValue({ jobTitles: [], recruiters: [] }),
    updateStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'EN_RECHERCHE' }),
    ...overrides,
  }
}

function caller(deps: MissionDeps) {
  return createCallerFactory(makeMissionRouter(deps))({ session })
}

describe('missionRouter', () => {
  it('returns missions from list', async () => {
    const rows = [{ id: 'm1', title: 'CDI' }]
    const deps = makeDeps({ list: vi.fn().mockResolvedValue(rows) })
    await expect(caller(deps).list()).resolves.toEqual(rows)
  })

  it('creates a mission with A_POURVOIR status', async () => {
    const deps = makeDeps()
    const input = {
      pharmacyId: 'p1',
      title: 'Adjoint CDD',
      jobTitleId: 'jt1',
      contractType: 'CDD' as const,
      startDate: new Date('2026-03-01'),
      referentId: 'u1',
    }
    const created = await caller(deps).create(input)
    expect(created).toEqual({ id: 'm1', status: 'A_POURVOIR' })
    expect(deps.createQuick).toHaveBeenCalledWith(input)
  })

  it('creates a job title referential inline', async () => {
    const deps = makeDeps()
    const created = await caller(deps).createJobTitle({ name: 'Préparateur' })
    expect(deps.createJobTitle).toHaveBeenCalledWith('Préparateur')
    expect(created).toEqual({ id: 'jt1', name: 'Préparateur' })
  })

  it('returns updated mission from updateStatus', async () => {
    const deps = makeDeps()
    const result = await caller(deps).updateStatus(statusInput)
    expect(result).toEqual({ id: 'm1', status: 'EN_RECHERCHE' })
    expect(deps.updateStatus).toHaveBeenCalledWith(statusInput)
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeMissionRouter(makeDeps()))({ session: null })
    await expect(unauth.updateStatus(statusInput)).rejects.toThrow()
  })

  it('requires placedCandidateId when status is POURVU', async () => {
    await expect(
      caller(makeDeps()).updateStatus({ id: 'm1', status: 'POURVU' }),
    ).rejects.toThrow()
  })
})
