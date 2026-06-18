import { describe, it, expect, vi } from 'vitest'
import { loadCandidateReferentials } from '@/server/read-models/candidate-referentials'

describe('loadCandidateReferentials', () => {
  it('aggregates referential lists for Candidate forms', async () => {
    const data = await loadCandidateReferentials({
      listJobTitles: async () => [{ id: 'jt1', name: 'Pharmacien' }],
      listSoftwares: async () => [{ id: 's1', name: 'Winpharma' }],
      listRecruiters: async () => [{ id: 'u1', name: 'Réf' }],
      listPipelineStages: async () => [{ id: 'p1', name: 'Nouveau', position: 0 }],
    })
    expect(data.jobTitles[0]?.name).toBe('Pharmacien')
    expect(data.pipelineStages[0]?.name).toBe('Nouveau')
  })
})
