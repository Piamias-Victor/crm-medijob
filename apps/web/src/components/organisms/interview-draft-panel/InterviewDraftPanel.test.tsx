import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterviewDraftPanel } from '@/components/organisms/interview-draft-panel/InterviewDraftPanel'
import { INTERVIEW_ABANDON } from '@/view-models/interview-copy'
import { toInterviewListRow } from '@/view-models/interview-list'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: {
      abandon: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

describe('InterviewDraftPanel', () => {
  it('lets the recruiter abandon a DRAFT', () => {
    render(
      <InterviewDraftPanel
        candidateId="c1"
        interview={toInterviewListRow({
          id: 'i1',
          status: 'DRAFT',
          mode: 'INTERIM',
          decision: null,
          createdAt: new Date('2026-08-17T10:00:00Z'),
        })}
      />,
    )
    expect(screen.getByRole('button', { name: INTERVIEW_ABANDON })).toBeInTheDocument()
  })
})
