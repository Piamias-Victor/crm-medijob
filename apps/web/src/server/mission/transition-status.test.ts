// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { transitionMissionStatus } from '@/server/mission/transition-status'

describe('transitionMissionStatus', () => {
  it('moves placed candidate to Placé and others to Pas retenu on POURVU', async () => {
    const updateStage = vi.fn().mockResolvedValue(undefined)
    const result = await transitionMissionStatus(
      { missionId: 'm1', status: 'POURVU', placedCandidateId: 'c2' },
      {
        findStageIdsByNames: vi.fn().mockResolvedValue({ placé: 's-placed', pasRetenu: 's-rejected' }),
        listCandidateIds: vi.fn().mockResolvedValue(['c1', 'c2', 'c3']),
        updateMissionStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'POURVU' }),
        updateStage,
      },
    )
    expect(result.status).toBe('POURVU')
    expect(updateStage).toHaveBeenCalledWith('m1', 'c2', 's-placed')
    expect(updateStage).toHaveBeenCalledWith('m1', 'c1', 's-rejected')
    expect(updateStage).toHaveBeenCalledWith('m1', 'c3', 's-rejected')
  })

  it('moves all MissionCandidates to Pas retenu on ANNULEE', async () => {
    const updateStage = vi.fn().mockResolvedValue(undefined)
    await transitionMissionStatus(
      { missionId: 'm1', status: 'ANNULEE' },
      {
        findStageIdsByNames: vi.fn().mockResolvedValue({ placé: 's-placed', pasRetenu: 's-rejected' }),
        listCandidateIds: vi.fn().mockResolvedValue(['c1', 'c2']),
        updateMissionStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'ANNULEE' }),
        updateStage,
      },
    )
    expect(updateStage).toHaveBeenCalledWith('m1', 'c1', 's-rejected')
    expect(updateStage).toHaveBeenCalledWith('m1', 'c2', 's-rejected')
  })
})
