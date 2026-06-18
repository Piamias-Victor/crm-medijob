// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { transitionMissionStatus } from '@/server/mission/transition-status'
import { TransitionError } from '@/server/mission/transition-errors'

function makeDeps(overrides: Partial<Parameters<typeof transitionMissionStatus>[1]> = {}) {
  return {
    findStageIdsByNames: vi.fn().mockResolvedValue({ placé: 's-placed', pasRetenu: 's-rejected' }),
    listCandidateIds: vi.fn().mockResolvedValue(['c1', 'c2', 'c3']),
    updateMissionStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'EN_RECHERCHE' }),
    applyTerminalTransition: vi.fn().mockResolvedValue({ id: 'm1', status: 'POURVU' }),
    ...overrides,
  }
}

describe('transitionMissionStatus', () => {
  it('updates non-terminal status without terminal transition', async () => {
    const deps = makeDeps()
    const result = await transitionMissionStatus(
      { missionId: 'm1', status: 'EN_RECHERCHE' },
      deps,
    )
    expect(result.status).toBe('EN_RECHERCHE')
    expect(deps.updateMissionStatus).toHaveBeenCalledWith('m1', 'EN_RECHERCHE')
    expect(deps.applyTerminalTransition).not.toHaveBeenCalled()
  })

  it('moves placed candidate to Placé and others to Pas retenu on POURVU', async () => {
    const deps = makeDeps({
      applyTerminalTransition: vi.fn().mockResolvedValue({ id: 'm1', status: 'POURVU' }),
    })
    const result = await transitionMissionStatus(
      { missionId: 'm1', status: 'POURVU', placedCandidateId: 'c2' },
      deps,
    )
    expect(result.status).toBe('POURVU')
    expect(deps.applyTerminalTransition).toHaveBeenCalledWith('m1', 'POURVU', [
      { candidateId: 'c1', stageId: 's-rejected' },
      { candidateId: 'c2', stageId: 's-placed' },
      { candidateId: 'c3', stageId: 's-rejected' },
    ])
  })

  it('moves all MissionCandidates to Pas retenu on ANNULEE', async () => {
    const deps = makeDeps({
      applyTerminalTransition: vi.fn().mockResolvedValue({ id: 'm1', status: 'ANNULEE' }),
    })
    await transitionMissionStatus({ missionId: 'm1', status: 'ANNULEE' }, deps)
    expect(deps.applyTerminalTransition).toHaveBeenCalledWith('m1', 'ANNULEE', [
      { candidateId: 'c1', stageId: 's-rejected' },
      { candidateId: 'c2', stageId: 's-rejected' },
      { candidateId: 'c3', stageId: 's-rejected' },
    ])
  })

  it('rejects POURVU when placedCandidateId is not on the mission', async () => {
    const deps = makeDeps()
    await expect(
      transitionMissionStatus(
        { missionId: 'm1', status: 'POURVU', placedCandidateId: 'c99' },
        deps,
      ),
    ).rejects.toThrow(TransitionError)
    expect(deps.applyTerminalTransition).not.toHaveBeenCalled()
  })
})
