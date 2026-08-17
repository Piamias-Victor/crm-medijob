import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateInterviewsTab } from '@/components/organisms/CandidateInterviewsTab'
import { INTERVIEW_CTA, INTERVIEW_RESUME, INTERVIEW_TAB_EMPTY } from '@/view-models/interview-copy'
import { toInterviewListRow } from '@/view-models/interview-list'

describe('CandidateInterviewsTab', () => {
  it('shows empty state when the candidate has no interviews', () => {
    render(<CandidateInterviewsTab candidateId="c1" interviews={[]} />)
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
      }),
    ]
    render(<CandidateInterviewsTab candidateId="c1" interviews={interviews} />)
    expect(screen.getByText('Intérim')).toBeInTheDocument()
    expect(screen.getByText('Brouillon')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: INTERVIEW_RESUME })).toHaveAttribute(
      'href',
      '/candidats/c1/entretiens/i1',
    )
  })

  it('offers a CTA to start a new interview', () => {
    render(<CandidateInterviewsTab candidateId="c1" interviews={[]} />)
    expect(screen.getByRole('link', { name: INTERVIEW_CTA })).toHaveAttribute(
      'href',
      '/candidats/c1/entretiens/new',
    )
  })
})
