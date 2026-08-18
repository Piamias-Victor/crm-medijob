import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateInterviewsTab } from '@/components/organisms/CandidateInterviewsTab'
import { INTERVIEW_CTA, INTERVIEW_RESUME, INTERVIEW_TAB_EMPTY } from '@/view-models/interview-copy'
import { INTERVIEW_PDF_DOWNLOAD } from '@/view-models/interview-pdf-copy'
import { interviewPdfFilename } from '@/view-models/interview-pdf-filename'
import { toInterviewListRow } from '@/view-models/interview-list'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: { generatePdf: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) } },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

describe('CandidateInterviewsTab', () => {
  it('shows empty state when the candidate has no interviews', () => {
    render(<CandidateInterviewsTab candidateId="c1" interviews={[]} documents={[]} />)
    expect(screen.getByText(INTERVIEW_TAB_EMPTY)).toBeInTheDocument()
  })

  it('lists persisted interviews with mode and status', () => {
    const interviews = [
      toInterviewListRow({
        id: 'i1',
        status: 'DRAFT',
        mode: 'INTERIM',
        decision: null,
        createdAt: new Date('2026-08-17T10:00:00Z'),
        candidateId: 'c1',
      }),
    ]
    render(<CandidateInterviewsTab candidateId="c1" interviews={interviews} documents={[]} />)
    expect(screen.getByText('Intérim')).toBeInTheDocument()
    expect(screen.getByText('Brouillon')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: INTERVIEW_RESUME })).toHaveAttribute(
      'href',
      '/candidats/c1/entretiens/i1',
    )
  })

  it('offers PDF download on a closed interview when the document exists', () => {
    const interviews = [
      toInterviewListRow({
        id: 'i1',
        status: 'CLOSED',
        mode: 'INTERIM',
        decision: 'ELIGIBLE',
        createdAt: new Date('2026-08-17T10:00:00Z'),
        candidateId: 'c1',
      }),
    ]
    render(
      <CandidateInterviewsTab
        candidateId="c1"
        interviews={interviews}
        documents={[{ id: 'd2', name: interviewPdfFilename('i1') }]}
      />,
    )
    expect(screen.getByRole('link', { name: INTERVIEW_PDF_DOWNLOAD })).toHaveAttribute(
      'href',
      '/api/documents/d2/download',
    )
  })

  it('offers a CTA to start a new interview', () => {
    render(<CandidateInterviewsTab candidateId="c1" interviews={[]} documents={[]} />)
    expect(screen.getByRole('link', { name: INTERVIEW_CTA })).toHaveAttribute(
      'href',
      '/candidats/c1/entretiens/new',
    )
  })
})
