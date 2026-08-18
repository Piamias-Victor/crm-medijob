import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { InterviewCloseForm } from '@/components/organisms/interview-close-form/InterviewCloseForm'
import { INTERVIEW_CLOSE_CONFIRM, INTERVIEW_MAPPING_SAVE } from '@/view-models/interview-copy'
import type { InterviewClosePreview } from '@/server/interview/preview-close'

const closeMutate = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: {
      close: { useMutation: () => ({ mutate: closeMutate, isPending: false }) },
      suggestCvSummary: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

const preview: InterviewClosePreview = {
  scores: { B1: 12 },
  scoreMax: { B1: 24 },
  decision: 'ELIGIBLE',
  diffs: [
    {
      field: 'availableFrom',
      kind: 'overwrite',
      current: new Date('2026-01-01'),
      next: new Date('2026-09-01'),
    },
    {
      field: 'softwareNames',
      kind: 'fill',
      current: [],
      next: ['Winpharma', 'LGPI'],
    },
    {
      field: 'contractTypes',
      kind: 'fill',
      current: [],
      next: ['CDI', 'CDD'],
    },
  ],
  proposedStatus: 'QUALIFIE',
  currentStatus: 'NOUVEAU',
  candidateId: 'c1',
  cvSummary: '## Pharmacien\n\nDéjà en fiche.',
}

describe('InterviewCloseForm', () => {
  it('prefills the fiche value and applies Qualifié by default', async () => {
    render(<InterviewCloseForm preview={preview} interviewId="i1" />)
    expect(screen.getByLabelText('Disponibilité')).toHaveValue('2026-01-01')
    expect(screen.getByRole('checkbox', { name: 'Winpharma' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'CDI' })).toBeChecked()
    fireEvent.change(screen.getByLabelText('Disponibilité'), { target: { value: '2026-10-01' } })
    fireEvent.click(screen.getByRole('button', { name: INTERVIEW_MAPPING_SAVE }))
    fireEvent.click(screen.getByRole('button', { name: INTERVIEW_CLOSE_CONFIRM }))
    await waitFor(() =>
      expect(closeMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'i1',
          decision: 'ELIGIBLE',
          applyStatus: true,
          overwriteFields: ['softwareNames', 'contractTypes', 'availableFrom'],
          mappingEdits: {
            availableFrom: '2026-10-01',
            softwareNames: 'Winpharma, LGPI',
            contractTypes: 'CDI, CDD',
          },
          cvSummary: '## Pharmacien\n\nDéjà en fiche.',
        }),
      ),
    )
  })
})
