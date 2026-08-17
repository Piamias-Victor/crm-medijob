// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { interviewCaller, interviewRecord, makeInterviewDeps } from '@/server/routers/interview.test.fixtures'
import { INTERVIEW_NOT_DRAFT } from '@/view-models/interview-copy'

const draftAnswers = {
  questions: { pharm_q1: { choiceLabel: 'En recherche', note: 'dispo juin' } },
  checklist: { cv: true },
}

describe('interviewRouter saveDraft', () => {
  it('persists DRAFT answers so a later read returns them', async () => {
    const stored = { ...interviewRecord, answers: {} }
    const deps = makeInterviewDeps({
      findById: vi.fn(async () => stored),
      updateAnswers: vi.fn(async (_id, answers) => {
        stored.answers = answers
      }),
      findCandidateProfileKey: vi.fn(async () => 'pharmacien'),
      findTemplate: vi.fn(async () => ({ label: 'Pharmacien', sections: [] })),
    })
    const caller = interviewCaller(deps)

    await caller.saveDraft({ id: 'i1', answers: draftAnswers })
    const run = await caller.getRun({ id: 'i1' })

    expect(run?.answers.questions.pharm_q1).toEqual(draftAnswers.questions.pharm_q1)
    expect(run?.answers.checklist.cv).toBe(true)
  })

  it('refuses to save answers on a CLOSED interview', async () => {
    const deps = makeInterviewDeps({
      findById: vi.fn(async () => ({ ...interviewRecord, status: 'CLOSED' as const })),
    })
    await expect(
      interviewCaller(deps).saveDraft({ id: 'i1', answers: draftAnswers }),
    ).rejects.toMatchObject({ message: INTERVIEW_NOT_DRAFT })
  })
})
