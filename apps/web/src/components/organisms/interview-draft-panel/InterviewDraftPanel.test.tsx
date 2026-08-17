import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { InterviewDraftPanel } from '@/components/organisms/interview-draft-panel/InterviewDraftPanel'
import {
  INTERVIEW_ABANDON,
  INTERVIEW_CHECKLIST_TITLE,
  INTERVIEW_ELIMINATOIRE,
} from '@/view-models/interview-copy'
import { interviewRunFixture } from '@/view-models/interview-run.fixture'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const saveDraftMutate = vi.fn()

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: {
      abandon: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      saveDraft: { useMutation: () => ({ mutate: saveDraftMutate, isPending: false }) },
    },
    document: {
      upload: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

describe('InterviewDraftPanel', () => {
  beforeEach(() => saveDraftMutate.mockClear())

  it('lets the recruiter abandon a DRAFT', () => {
    render(<InterviewDraftPanel run={interviewRunFixture} />)
    expect(screen.getByRole('button', { name: INTERVIEW_ABANDON })).toBeInTheDocument()
  })

  it('highlights eliminatory questions and the dossier checklist', () => {
    render(<InterviewDraftPanel run={interviewRunFixture} />)
    expect(screen.getByText(INTERVIEW_ELIMINATOIRE)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: INTERVIEW_CHECKLIST_TITLE })).toBeInTheDocument()
    expect(screen.getByText('Pièce d’identité')).toBeInTheDocument()
  })

  it('saves immediately when a suggested answer is chosen', () => {
    render(<InterviewDraftPanel run={interviewRunFixture} />)
    fireEvent.click(screen.getByRole('button', { name: 'Non inscrit' }))
    expect(saveDraftMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'i1',
        answers: expect.objectContaining({
          questions: expect.objectContaining({
            pharm_q4: expect.objectContaining({ choiceLabel: 'Non inscrit' }),
          }),
        }),
      }),
    )
  })

  it('saves checklist when a document is checked', () => {
    render(<InterviewDraftPanel run={interviewRunFixture} />)
    fireEvent.click(screen.getByText('CV'))
    expect(saveDraftMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: expect.objectContaining({ checklist: expect.objectContaining({ cv: true }) }),
      }),
    )
  })
})
