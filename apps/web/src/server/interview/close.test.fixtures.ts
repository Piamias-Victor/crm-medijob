import type { CloseInterviewDeps } from '@/server/interview/close'
import type { CloseSideEffectProfile } from '@/server/interview/close-side-effects'
import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'
import type { MappingQuestion } from '@/view-models/interview-mapping-extract'
import type { InterviewRecord } from '@/view-models/interview-list'

export type CloseInterviewMemoryRow = InterviewRecord & {
  scores: Record<string, number>
  answers: InterviewDraftAnswers
}

export function memoryCloseDeps(
  seed?: Partial<CloseInterviewMemoryRow>,
  profile?: Partial<CloseSideEffectProfile>,
  questions: MappingQuestion[] = [],
): CloseInterviewDeps & {
  interviews: CloseInterviewMemoryRow[]
  candidate: CloseSideEffectProfile
  logs: { candidateId: string; authorId: string; content: string }[]
} {
  const interviews: CloseInterviewMemoryRow[] = [
    {
      id: 'i1',
      candidateId: 'c1',
      status: 'DRAFT',
      decision: null,
      createdAt: new Date('2026-08-17T10:00:00Z'),
      scores: {},
      answers: { questions: {}, checklist: {} },
      mode: 'INTERIM',
      ...seed,
    },
  ]
  const candidate: CloseSideEffectProfile = {
    availableFrom: null,
    mobilityRadiusKm: null,
    salaryExpectations: null,
    notes: null,
    softwareNames: [],
    contractTypes: [],
    status: 'NOUVEAU',
    cvSummary: null,
    jobTitleName: 'Pharmacien',
    ...profile,
  }
  const logs: { candidateId: string; authorId: string; content: string }[] = []
  return {
    interviews,
    candidate,
    logs,
    findById: async (id) => interviews.find((row) => row.id === id) ?? null,
    close: async (id, data) => {
      const row = interviews.find((interview) => interview.id === id)
      if (!row) return
      row.status = 'CLOSED'
      row.decision = data.decision
      row.scores = data.scores
    },
    findCandidate: async () => candidate,
    findTemplateQuestions: async () => questions,
    applyCandidatePatch: async (_id, patch) => {
      Object.assign(candidate, patch)
    },
    logActivity: async (input: { candidateId: string; authorId: string; content: string }) => {
      logs.push(input)
    },
    storePdf: async () => null,
  }
}
