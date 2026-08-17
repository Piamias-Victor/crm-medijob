export const interviewStartIdentity = {
  firstName: 'Camille',
  lastName: 'Durand',
  email: 'camille@example.com',
  jobTitleId: 'jt-pharma',
  mode: 'INTERIM' as const,
}

type CandidateRow = {
  id: string
  firstName: string
  lastName: string
  status: string
  jobTitleId: string
  referentId: string
}

type InterviewRow = {
  id: string
  candidateId: string
  mode: string
  status: string
  referentId: string
  deletedAt: Date | null
}

export function memoryStartDeps(seed: CandidateRow[] = []) {
  const candidates = [...seed]
  const interviews: InterviewRow[] = []
  let n = seed.length
  return {
    candidates,
    interviews,
    createCandidate: async (data: Omit<CandidateRow, 'id'>) => {
      const row = { ...data, id: `c${++n}` }
      candidates.push(row)
      return { id: row.id }
    },
    createInterview: async (data: Omit<InterviewRow, 'id' | 'status' | 'deletedAt'>) => {
      const row = { ...data, id: `i${++n}`, status: 'DRAFT', deletedAt: null }
      interviews.push(row)
      return { id: row.id }
    },
    findCandidateById: async (id: string) => candidates.find((row) => row.id === id) ?? null,
    findDraftByCandidate: async (candidateId: string) =>
      interviews.find(
        (row) => row.candidateId === candidateId && row.status === 'DRAFT' && !row.deletedAt,
      ) ?? null,
    setJobTitleIfMissing: async (id: string, jobTitleId: string) => {
      const row = candidates.find((candidate) => candidate.id === id)
      if (row && !row.jobTitleId) row.jobTitleId = jobTitleId
    },
    listByCandidate: async () => [],
    findById: async () => null,
    updateAnswers: async () => undefined,
    findCandidateProfileKey: async () => 'pharmacien',
    findTemplate: async () => ({ label: 'Pharmacien', sections: [] }),
    softDeleteInterview: async (id: string) => {
      const row = interviews.find((interview) => interview.id === id && !interview.deletedAt)
      if (!row) return null
      row.deletedAt = new Date()
      return { candidateId: row.candidateId }
    },
  }
}
