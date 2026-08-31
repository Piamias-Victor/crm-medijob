import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadakanMissionList } from './BadakanMissionList'
import type { BadakanMissionListItem } from '@/view-models/badakan-mission-list'

const row: BadakanMissionListItem = {
  id: 'row1',
  pharmacyName: 'Pharmacie Hermes',
  step: 'CANCELLED',
  stepLabel: 'Annulée',
  periodLabel: '01/08/2026 → 03/08/2026',
  href: '/interim/missions/row1',
}

describe('BadakanMissionList', () => {
  it('shows pharmacy, dates and step on each Badakan mission card', () => {
    render(<BadakanMissionList rows={[row]} />)
    expect(screen.getByText('Pharmacie Hermes')).toBeInTheDocument()
    expect(screen.getByText('Annulée')).toBeInTheDocument()
    expect(screen.getByText('01/08/2026 → 03/08/2026')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/interim/missions/row1')
    expect(screen.queryByText(/application/i)).not.toBeInTheDocument()
  })

  it('explains empty Badakan mission list without CRM kanban copy', () => {
    render(<BadakanMissionList rows={[]} />)
    expect(screen.getByText('Aucune mission Badakan')).toBeInTheDocument()
    expect(screen.queryByText(/application/i)).not.toBeInTheDocument()
  })
})
