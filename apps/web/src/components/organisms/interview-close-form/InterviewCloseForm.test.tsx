import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { InterviewCloseForm } from '@/components/organisms/interview-close-form/InterviewCloseForm'
import {
  INTERVIEW_APPLY_STATUS,
  INTERVIEW_CLOSE_CONFIRM,
  INTERVIEW_MAPPING_OVERWRITE,
} from '@/view-models/interview-copy'
import type { InterviewClosePreview } from '@/server/interview/preview-close'

const closeMutate = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: { close: { useMutation: () => ({ mutate: closeMutate, isPending: false }) } },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

const preview: InterviewClosePreview = {
  scores: { B1: 12 },
  decision: 'ELIGIBLE',
  diffs: [
    {
      field: 'availableFrom',
      kind: 'overwrite',
      current: new Date('2026-01-01'),
      next: new Date('2026-09-01'),
    },
  ],
  proposedStatus: 'QUALIFIE',
  currentStatus: 'NOUVEAU',
  candidateId: 'c1',
}

describe('InterviewCloseForm', () => {
  it('does not close until confirm and asks before overwrite', async () => {
    render(<InterviewCloseForm preview={preview} interviewId="i1" />)
    expect(screen.getByText(INTERVIEW_MAPPING_OVERWRITE)).toBeInTheDocument()
    expect(screen.getByText(INTERVIEW_APPLY_STATUS, { exact: false })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: INTERVIEW_CLOSE_CONFIRM }))
    await waitFor(() =>
      expect(closeMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'i1',
          decision: 'ELIGIBLE',
          applyStatus: false,
          overwriteFields: [],
        }),
      ),
    )
  })
})
