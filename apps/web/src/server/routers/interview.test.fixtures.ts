import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeInterviewRouter, type InterviewDeps } from '@/server/routers/interview'
import type { InterviewRecord } from '@/view-models/interview-list'

export const interviewRecord: InterviewRecord = {
  id: 'i1',
  status: 'DRAFT',
  mode: 'INTERIM',
  decision: null,
  createdAt: new Date('2026-08-17T10:00:00Z'),
  candidateId: 'c1',
  answers: {},
}

import type { UserRole } from '@/server/auth/permissions'

export const recruiterSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as UserRole },
  expires: '2999-01-01',
}

export const communicationSession = {
  user: { id: 'u2', role: 'COMMUNICATION' as UserRole },
  expires: '2999-01-01',
}

export function makeInterviewDeps(overrides: Partial<InterviewDeps> = {}): InterviewDeps {
  return {
    listByCandidate: vi.fn().mockResolvedValue([interviewRecord]),
    findById: vi.fn().mockResolvedValue(interviewRecord),
    findCandidateById: vi.fn().mockResolvedValue(null),
    findDraftByCandidate: vi.fn().mockResolvedValue(null),
    setJobTitleIfMissing: vi.fn().mockResolvedValue(undefined),
    createCandidate: vi.fn().mockResolvedValue({ id: 'c1' }),
    createInterview: vi.fn().mockResolvedValue({ id: 'i1' }),
    softDeleteInterview: vi.fn().mockResolvedValue({ candidateId: 'c1' }),
    updateAnswers: vi.fn().mockResolvedValue(undefined),
    findCandidateProfileKey: vi.fn().mockResolvedValue('pharmacien'),
    findTemplate: vi.fn().mockResolvedValue({ label: 'Pharmacien', sections: [] }),
    logActivity: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    findCandidate: vi.fn().mockResolvedValue(null),
    findTemplateQuestions: vi.fn().mockResolvedValue([]),
    findTemplateSections: vi.fn().mockResolvedValue([]),
    applyCandidatePatch: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

export function interviewCaller(
  deps: InterviewDeps,
  session: { user: { id: string; role: UserRole }; expires: string } = recruiterSession,
) {
  return createCallerFactory(makeInterviewRouter(deps))({ session })
}
