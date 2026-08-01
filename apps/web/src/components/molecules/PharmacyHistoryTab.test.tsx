import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PharmacyHistoryTab } from '@/components/molecules/PharmacyHistoryTab'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}))

vi.mock('@/components/molecules/ActivityLogForm', () => ({
  ActivityLogForm: () => <div data-testid="activity-log-form" />,
}))

describe('PharmacyHistoryTab', () => {
  it('shows terminal missions mixed with activity logs', () => {
    render(
      <PharmacyHistoryTab
        scope={{ entityType: 'PHARMACY', entityId: 'p1' }}
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
        terminalMissions={[
          {
            id: 'm1',
            title: 'Titulaire pourvu',
            status: 'POURVU',
            contractType: 'CDI',
            startDate: new Date('2026-01-01'),
            updatedAt: new Date('2026-02-01'),
            jobTitle: 'Pharmacien',
            referent: null,
          },
        ]}
      />,
    )

    expect(screen.getByText('Note manuelle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /titulaire pourvu/i })).toBeInTheDocument()
    expect(screen.getByText('CDI')).toBeInTheDocument()
    expect(screen.getByText('Pourvu')).toBeInTheDocument()
  })

  it('navigates to mission detail from history mission entry', () => {
    render(
      <PharmacyHistoryTab
        scope={{ entityType: 'PHARMACY', entityId: 'p1' }}
        initialLogs={[]}
        terminalMissions={[
          {
            id: 'm9',
            title: 'Mission annulée',
            status: 'ANNULEE',
            contractType: 'CDD',
            startDate: new Date('2026-01-01'),
            updatedAt: new Date('2026-02-01'),
            jobTitle: 'Préparateur',
            referent: null,
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /mission annulée/i }))
    expect(push).toHaveBeenCalledWith('/missions/m9')
  })
})
