import type { InterviewRecord } from '@/view-models/interview-list'
import { mockProvider } from '@/server/ai/mock-provider'

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

type InterviewRow = InterviewRecord & {
  referentId: string
  deletedAt: Date | null
}

export function memoryStartDeps(seed: CandidateRow[] = []) {
  const candidates = [...seed]
  const interviews: InterviewRow[] = []
  const logs: { candidateId: string; authorId: string; content: string }[] = []
  let n = seed.length
  return {
    candidates,
    interviews,
    logs,
    createCandidate: async (data: Omit<CandidateRow, 'id'>) => {
      const row = { ...data, id: `c${++n}` }
      candidates.push(row)
      return { id: row.id }
    },
    createInterview: async (data: Omit<InterviewRow, 'id' | 'status' | 'deletedAt' | 'decision' | 'createdAt'>) => {
      const row: InterviewRow = {
        ...data,
        id: `i${++n}`,
        status: 'DRAFT',
        decision: null,
        createdAt: new Date(),
        deletedAt: null,
      }
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
    findById: async (id: string) =>
      interviews.find((row) => row.id === id && !row.deletedAt) ?? null,
    updateAnswers: async () => undefined,
    findCandidateProfileKey: async () => 'pharmacien',
    findTemplate: async () => ({ label: 'Pharmacien', sections: [] }),
    logActivity: async (input: { candidateId: string; authorId: string; content: string }) => {
      logs.push(input)
    },
    close: async () => undefined,
    findCandidate: async () => null,
    findTemplateQuestions: async () => [],
    findTemplateSections: async () => [],
    applyCandidatePatch: async () => undefined,
    loadSnapshot: async () => null,
    findDocumentByName: async () => null,
    renderPdf: async () => Buffer.from('%PDF'),
    uploadBlob: async () => ({ url: 'https://blob.example/x.pdf' }),
    createDocument: async () => ({ id: 'd1' }),
    provider: mockProvider,
    softDeleteInterview: async (id: string) => {
      const row = interviews.find((interview) => interview.id === id && !interview.deletedAt)
      if (!row) return null
      row.deletedAt = new Date()
      return { candidateId: row.candidateId }
    },
  }
}
