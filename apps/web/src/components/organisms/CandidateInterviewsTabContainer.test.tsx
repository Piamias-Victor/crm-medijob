import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateInterviewsTabContainer } from '@/components/organisms/CandidateInterviewsTabContainer'

vi.mock('@/components/organisms/CandidateInterviewsTab', () => ({
  CandidateInterviewsTab: ({
    interviews,
    documents,
  }: {
    interviews: { id: string }[]
    documents: { id: string }[]
  }) => (
    <div data-testid="interviews-tab">
      {interviews.map((i) => i.id).join(',')}|{documents.map((d) => d.id).join(',')}
    </div>
  ),
}))

const listByCandidate = vi.fn()
const listByEntity = vi.fn()

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: {
      listByCandidate: { useQuery: (input: unknown) => listByCandidate(input) },
    },
    document: {
      listByEntity: { useQuery: (input: unknown) => listByEntity(input) },
    },
  },
}))

describe('CandidateInterviewsTabContainer', () => {
  it('shows loading while interview queries are pending', () => {
    listByCandidate.mockReturnValue({ data: undefined, isLoading: true })
    listByEntity.mockReturnValue({ data: undefined, isLoading: true })
    render(<CandidateInterviewsTabContainer candidateId="c1" />)
    expect(screen.getByText('Chargement…')).toBeInTheDocument()
    expect(listByCandidate).toHaveBeenCalledWith({ candidateId: 'c1' })
  })

  it('renders interviews when queries resolve', () => {
    listByCandidate.mockReturnValue({ data: [{ id: 'i1' }], isLoading: false })
    listByEntity.mockReturnValue({ data: [{ id: 'd1', name: 'cr.pdf' }], isLoading: false })
    render(<CandidateInterviewsTabContainer candidateId="c1" />)
    expect(screen.getByTestId('interviews-tab')).toHaveTextContent('i1|d1')
  })
})
