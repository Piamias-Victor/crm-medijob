import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterviewStartForm } from '@/components/organisms/interview-start-form/InterviewStartForm'
import { buildInterviewStartDefaults } from '@/view-models/interview-start-defaults'
import { INTERVIEW_START_SUBMIT } from '@/view-models/interview-copy'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    useUtils: () => ({
      candidate: { detectDuplicate: { fetch: vi.fn().mockResolvedValue([]) } },
    }),
  },
}))

describe('InterviewStartForm', () => {
  it('renders confirmed identity fields', () => {
    render(
      <InterviewStartForm
        defaultValues={buildInterviewStartDefaults({
          firstName: 'Camille',
          lastName: 'Durand',
          email: 'camille@example.com',
          jobTitleId: 'jt1',
        })}
        jobTitles={[{ id: 'jt1', name: 'Pharmacien' }]}
        submitting={false}
        onSubmit={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Prénom')).toHaveValue('Camille')
    expect(screen.getByLabelText('Nom')).toHaveValue('Durand')
    expect(screen.getByText('Intérim')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: INTERVIEW_START_SUBMIT })).toBeInTheDocument()
  })
})
