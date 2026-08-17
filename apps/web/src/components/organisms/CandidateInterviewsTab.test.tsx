import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateInterviewsTab } from '@/components/organisms/CandidateInterviewsTab'
import { INTERVIEW_TAB_EMPTY } from '@/view-models/interview-copy'
import { toInterviewListRow } from '@/view-models/interview-list'

describe('CandidateInterviewsTab', () => {
  it('shows empty state when the candidate has no interviews', () => {
    render(<CandidateInterviewsTab interviews={[]} />)
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
    render(<CandidateInterviewsTab interviews={interviews} />)
    expect(screen.getByText('Intérim')).toBeInTheDocument()
    expect(screen.getByText('Brouillon')).toBeInTheDocument()
  })
})
