import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateHistoryTabContainer } from '@/components/molecules/CandidateHistoryTabContainer'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/components/molecules/ActivityLogForm', () => ({
  ActivityLogForm: () => <div data-testid="activity-log-form" />,
}))

const listByEntity = vi.fn()
const listComments = vi.fn()

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    activityLog: {
      listByEntity: { useQuery: (input: unknown) => listByEntity(input) },
    },
    candidate: {
      listComments: { useQuery: (input: unknown) => listComments(input) },
    },
  },
}))

describe('CandidateHistoryTabContainer', () => {
  it('shows loading while history queries are pending', () => {
    listByEntity.mockReturnValue({ data: undefined, isLoading: true })
    listComments.mockReturnValue({ data: undefined, isLoading: true })

    render(<CandidateHistoryTabContainer candidateId="c1" positionings={[]} />)

    expect(screen.getByText('Chargement…')).toBeInTheDocument()
    expect(listByEntity).toHaveBeenCalledWith({
      entityType: 'CANDIDATE',
      entityId: 'c1',
    })
    expect(listComments).toHaveBeenCalledWith({ id: 'c1' })
  })

  it('renders Badakan comments when queries resolve', () => {
    listByEntity.mockReturnValue({ data: [], isLoading: false })
    listComments.mockReturnValue({
      data: [
        {
          id: 'b1',
          content: 'Appel OK',
          authorName: 'Alice',
          date: new Date('2026-03-12T14:32:00.000Z'),
        },
      ],
      isLoading: false,
    })

    render(<CandidateHistoryTabContainer candidateId="c1" positionings={[]} />)

    expect(screen.getByText('Appel OK')).toBeInTheDocument()
    expect(screen.queryByText('Chargement…')).not.toBeInTheDocument()
  })
})
