import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'

export type SaveInterviewDraftDeps = {
  findById: (id: string) => Promise<{ id: string; status: string } | null>
  updateAnswers: (id: string, answers: InterviewDraftAnswers) => Promise<void>
}

export async function saveInterviewDraft(
  id: string,
  answers: InterviewDraftAnswers,
  deps: SaveInterviewDraftDeps,
) {
  const row = await deps.findById(id)
  if (!row) throw new Error('INTERVIEW_NOT_FOUND')
  if (row.status !== 'DRAFT') throw new Error('INTERVIEW_NOT_DRAFT')
  await deps.updateAnswers(id, answers)
  return { id }
}
