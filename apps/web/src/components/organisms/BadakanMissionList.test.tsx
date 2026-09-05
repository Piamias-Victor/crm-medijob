import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { BadakanMissionList } from './BadakanMissionList'
import type { BadakanMissionListItem } from '@/view-models/badakan-mission-list'

const { push, router, searchParams } = vi.hoisted(() => {
  const push = vi.fn()
  return { push, router: { push, replace: vi.fn() }, searchParams: new URLSearchParams() }
})

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/interim/missions',
  useSearchParams: () => searchParams,
}))

const row: BadakanMissionListItem = {
  id: 'row1',
  pharmacyName: 'Pharmacie Hermes',
  step: 'CANCELLED',
  stepLabel: 'Annulée',
  periodLabel: '01/08/2026 → 03/08/2026',
  href: '/interim/missions/row1',
}

const other: BadakanMissionListItem = {
  ...row,
  id: 'row2',
  pharmacyName: 'Pharmacie du Parc',
  step: 'STAFFED',
  stepLabel: 'Staffée',
}

describe('BadakanMissionList', () => {
  it('shows pharmacy, dates and step as table columns', () => {
    render(<BadakanMissionList rows={[row]} />)
    expect(screen.getByRole('columnheader', { name: 'Officine' })).toBeInTheDocument()
    expect(screen.getByText('Pharmacie Hermes')).toBeInTheDocument()
    expect(screen.getByText('Annulée')).toBeInTheDocument()
    expect(screen.getByText('01/08/2026 → 03/08/2026')).toBeInTheDocument()
    expect(screen.queryByText(/application/i)).not.toBeInTheDocument()
  })

  it('opens the mission when the row is activated', () => {
    render(<BadakanMissionList rows={[row]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir la fiche' }))
    expect(push).toHaveBeenCalledWith('/interim/missions/row1')
  })

  it('narrows the table to the searched officine', () => {
    render(<BadakanMissionList rows={[row, other]} />)
    fireEvent.change(screen.getByPlaceholderText('Officine…'), { target: { value: 'parc' } })
    expect(screen.getByText('Pharmacie du Parc')).toBeInTheDocument()
    expect(screen.queryByText('Pharmacie Hermes')).not.toBeInTheDocument()
  })

  it('explains empty Badakan mission list without CRM kanban copy', () => {
    render(<BadakanMissionList rows={[]} />)
    expect(screen.getByText('Aucune mission Badakan')).toBeInTheDocument()
    expect(screen.queryByText(/application/i)).not.toBeInTheDocument()
  })
})
