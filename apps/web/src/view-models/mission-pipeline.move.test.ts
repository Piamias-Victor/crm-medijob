import { describe, it, expect } from 'vitest'
import { movePipelineCandidate } from '@/view-models/mission-pipeline'
import type { PipelineCandidateRow, PipelineStageRef } from '@/view-models/mission-pipeline.types'

const stages: PipelineStageRef[] = [
  { id: 's1', name: 'Nouveau', position: 0 },
  { id: 's2', name: 'Entretien', position: 2 },
]

const candidates: PipelineCandidateRow[] = [
  {
    candidateId: 'c1',
    fullName: 'Alice',
    stageId: 's1',
    stageName: 'Nouveau',
    jobTitle: null,
    city: null,
    postalCode: null,
    referentName: null,
  },
  {
    candidateId: 'c2',
    fullName: 'Bob',
    stageId: 's1',
    stageName: 'Nouveau',
    jobTitle: null,
    city: null,
    postalCode: null,
    referentName: null,
  },
]

describe('movePipelineCandidate', () => {
  it('updates only the targeted candidate stage', () => {
    const next = movePipelineCandidate(candidates, {
      candidateId: 'c1',
      targetStage: stages[1],
    })

    expect(next.find((row) => row.candidateId === 'c1')?.stageId).toBe('s2')
    expect(next.find((row) => row.candidateId === 'c2')?.stageId).toBe('s1')
  })
})
