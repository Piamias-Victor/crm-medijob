import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CandidateHistoryTab } from '@/components/molecules/CandidateHistoryTab'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}))

vi.mock('@/components/molecules/ActivityLogForm', () => ({
  ActivityLogForm: () => <div data-testid="activity-log-form" />,
}))

describe('CandidateHistoryTab', () => {
  it('shows positionings mixed with activity logs', () => {
    render(
      <CandidateHistoryTab
        scope={{ entityType: 'CANDIDATE', entityId: 'c1' }}
        initialLogs={[
          {
            id: 'l1',
            type: 'NOTE',
            typeLabel: 'Note',
            content: 'Note manuelle',
            date: new Date('2026-01-01'),
            authorName: 'Alice',
          },
        ]}
        positionings={[
          {
            id: 'm1',
            title: 'Titulaire CDI',
            stageName: 'Présenté',
            date: new Date('2026-02-01'),
          },
        ]}
      />,
    )

    expect(screen.getByText('Note manuelle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /titulaire cdi/i })).toBeInTheDocument()
    expect(screen.getByText('Présenté')).toBeInTheDocument()
  })

  it('navigates to mission detail from history positioning', () => {
    render(
      <CandidateHistoryTab
        scope={{ entityType: 'CANDIDATE', entityId: 'c1' }}
        initialLogs={[]}
        positionings={[
          {
            id: 'm9',
            title: 'Mission annulée',
            stageName: 'Pas retenu',
            date: new Date('2026-02-01'),
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /mission annulée/i }))
    expect(push).toHaveBeenCalledWith('/missions/m9')
  })
})
