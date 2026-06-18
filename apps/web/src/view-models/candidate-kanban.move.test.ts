import { describe, it, expect } from 'vitest'
import { moveMissionRow } from './candidate-kanban'
import { stages, row, candidate } from './candidate-kanban.fixtures'

describe('moveMissionRow', () => {
  it('re-stages only the targeted mission of the targeted candidate', () => {
    const c = candidate({ missions: [row('m1', stages[0]), row('m2', stages[0])] })
    const next = moveMissionRow([c], {
      missionId: 'm1',
      candidateId: 'c1',
      targetStage: stages[1],
    })
    const missions = next[0].missions
    expect(missions.find((m) => m.mission.id === 'm1')?.stageId).toBe('s2')
    expect(missions.find((m) => m.mission.id === 'm2')?.stageId).toBe('s1')
  })

  it('leaves other candidates untouched', () => {
    const a = candidate({ id: 'cA', missions: [row('m1', stages[0])] })
    const b = candidate({ id: 'cB', missions: [row('m1', stages[0])] })
    const next = moveMissionRow([a, b], {
      missionId: 'm1',
      candidateId: 'cA',
      targetStage: stages[1],
    })
    expect(next[1].missions[0].stageId).toBe('s1')
  })
})
