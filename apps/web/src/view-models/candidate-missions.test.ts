import { describe, it, expect } from 'vitest'
import { toCandidateMissionRows } from '@/view-models/candidate-missions'

describe('toCandidateMissionRows', () => {
  it('lists active mission positions with pipeline stage', () => {
    const rows = toCandidateMissionRows([
      {
        updatedAt: new Date('2026-01-01'),
        stage: { id: 's1', name: 'Nouveau', position: 0 },
        mission: { id: 'm1', title: 'Titulaire CDI', status: 'A_POURVOIR' },
      },
      {
        updatedAt: new Date('2026-01-02'),
        stage: { id: 's1', name: 'Nouveau', position: 0 },
        mission: { id: 'm2', title: 'Adjoint CDD', status: 'A_POURVOIR' },
      },
      {
        updatedAt: new Date('2026-01-03'),
        stage: { id: 's1', name: 'Nouveau', position: 0 },
        mission: { id: 'm3', title: 'Préparateur (pourvu)', status: 'POURVU' },
      },
    ])
    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({ missionTitle: 'Titulaire CDI', stageName: 'Nouveau', stageId: 's1' })
  })
})
