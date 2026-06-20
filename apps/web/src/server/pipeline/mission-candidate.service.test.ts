// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import {
  applyTerminalTransition,
  updateStage,
} from '@/server/pipeline/mission-candidate.service'

describe('missionCandidateService', () => {
  it('updateStage appelle repository avec missionId, candidateId, stageId', async () => {
    const updateStageRepo = vi.fn().mockResolvedValue({ missionId: 'm1', candidateId: 'c1' })
    await updateStage({ missionId: 'm1', candidateId: 'c1', stageId: 's2' }, { updateStage: updateStageRepo })
    expect(updateStageRepo).toHaveBeenCalledWith({
      missionId: 'm1',
      candidateId: 'c1',
      stageId: 's2',
    })
  })

  it('applyTerminalTransition met à jour statut mission + stages candidats en transaction', async () => {
    const applyTerminalTransitionRepo = vi.fn().mockResolvedValue({ id: 'm1', status: 'POURVU' })
    const stageUpdates = [
      { candidateId: 'c1', stageId: 's-rejected' },
      { candidateId: 'c2', stageId: 's-placed' },
    ]
    const result = await applyTerminalTransition('m1', 'POURVU', stageUpdates, {
      applyTerminalTransition: applyTerminalTransitionRepo,
    })
    expect(applyTerminalTransitionRepo).toHaveBeenCalledWith('m1', 'POURVU', stageUpdates)
    expect(result).toEqual({ id: 'm1', status: 'POURVU' })
  })
})
