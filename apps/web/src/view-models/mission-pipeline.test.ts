import { describe, it, expect } from 'vitest'
import { buildMissionPipelineColumns } from '@/view-models/mission-pipeline'
import type { PipelineCandidateRow, PipelineStageRef } from '@/view-models/mission-pipeline.types'

const stages: PipelineStageRef[] = [
  { id: 's1', name: 'Nouveau', position: 0 },
  { id: 's2', name: 'Entretien', position: 2 },
  { id: 's3', name: 'Placé', position: 4 },
]

const row = (id: string, stage: PipelineStageRef, name: string): PipelineCandidateRow => ({
  candidateId: id,
  fullName: name,
  stageId: stage.id,
  stageName: stage.name,
  jobTitle: null,
  city: null,
  postalCode: null,
  referentName: null,
})

describe('buildMissionPipelineColumns', () => {
  it('orders columns by stage position and groups candidates by stageId', () => {
    const candidates = [
      row('c1', stages[0], 'Alice Martin'),
      row('c2', stages[1], 'Bob Durand'),
    ]
    const columns = buildMissionPipelineColumns(stages, candidates)

    expect(columns.map((column) => column.stage.id)).toEqual(['s1', 's2', 's3'])
    expect(columns[0].cards.map((card) => card.candidateId)).toEqual(['c1'])
    expect(columns[1].cards.map((card) => card.candidateId)).toEqual(['c2'])
  })

  it('excludes candidates in terminal stages from the kanban', () => {
    const candidates = [
      row('c1', stages[0], 'Alice Martin'),
      row('c2', stages[2], 'Bob Durand'),
    ]
    const columns = buildMissionPipelineColumns(stages, candidates)

    expect(columns.flatMap((column) => column.cards)).toEqual([candidates[0]])
  })
})
