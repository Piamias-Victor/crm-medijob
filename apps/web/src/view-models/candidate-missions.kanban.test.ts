import { describe, it, expect } from 'vitest'
import { buildCandidateMissionKanban, moveCandidateMission } from '@/view-models/candidate-missions'

describe('buildCandidateMissionKanban', () => {
  it('groups mission cards under their pipeline stage columns', () => {
    const columns = buildCandidateMissionKanban(
      [
        { id: 's1', name: 'Nouveau', position: 0 },
        { id: 's2', name: 'Contacté', position: 1 },
      ],
      [
        { missionId: 'm1', missionTitle: 'Titulaire CDI', stageId: 's1', stageName: 'Nouveau' },
        { missionId: 'm2', missionTitle: 'Adjoint CDD', stageId: 's1', stageName: 'Nouveau' },
      ],
    )
    expect(columns[0]?.missions).toHaveLength(2)
    expect(columns[1]?.missions).toHaveLength(0)
  })

  it('moves a mission card to another stage optimistically', () => {
    const rows = [
      { missionId: 'm1', missionTitle: 'A', stageId: 's1', stageName: 'Nouveau' },
    ]
    const next = moveCandidateMission(rows, {
      missionId: 'm1',
      targetStage: { id: 's2', name: 'Contacté' },
    })
    expect(next[0]?.stageId).toBe('s2')
  })
})
