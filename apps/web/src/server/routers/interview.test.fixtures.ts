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
    ...overrides,
  }
}

export function interviewCaller(
  deps: InterviewDeps,
  session: { user: { id: string; role: UserRole }; expires: string } = recruiterSession,
) {
  return createCallerFactory(makeInterviewRouter(deps))({ session })
}
