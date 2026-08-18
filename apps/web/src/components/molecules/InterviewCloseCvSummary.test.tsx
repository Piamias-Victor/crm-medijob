import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { InterviewCloseCvSummary } from '@/components/molecules/InterviewCloseCvSummary'
import { CV_SUMMARY_GENERATE } from '@/view-models/cv-summary-copy'

const onChange = vi.fn()
const suggestMutate = vi.fn(
  (_input: unknown, opts?: { onSuccess?: (data: { cvSummary: string }) => void }) => {
    opts?.onSuccess?.({ cvSummary: '## Pharmacien\n\nGénéré entretien.' })
  },
)

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: {
      suggestCvSummary: { useMutation: () => ({ mutate: suggestMutate, isPending: false }) },
    },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

describe('InterviewCloseCvSummary', () => {
  it('shows the existing fiche summary then fills generate output', () => {
    render(
      <InterviewCloseCvSummary
        interviewId="i1"
        value="## Pharmacien\n\nDéjà en fiche."
        savedValue="## Pharmacien\n\nDéjà en fiche."
        onChange={onChange}
      />,
    )
    expect(screen.getByDisplayValue(/Déjà en fiche/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: CV_SUMMARY_GENERATE }))
    expect(onChange).toHaveBeenCalledWith('## Pharmacien\n\nGénéré entretien.')
  })
})
