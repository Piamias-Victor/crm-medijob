import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeeklyAvailabilityFilterCard } from './WeeklyAvailabilityFilterCard'
import type { AvailabilityFilterRow } from '@/view-models/weekly-availability-filter-row'

const row: AvailabilityFilterRow = {
  id: 'marie',
  fullName: 'Marie Dupont',
  jobTitleName: 'Préparateur',
  city: 'Lyon',
  phone: '06 12 34 56 78',
  telHref: 'tel:06 12 34 56 78',
  smsHref: 'sms:+33612345678',
}

describe('WeeklyAvailabilityFilterCard', () => {
  it('offers tel and SMS contact without creating a MissionCandidate', () => {
    render(<WeeklyAvailabilityFilterCard row={row} />)
    expect(screen.getByRole('link', { name: '06 12 34 56 78' })).toHaveAttribute(
      'href',
      'tel:06 12 34 56 78',
    )
    expect(screen.getByRole('link', { name: 'SMS' })).toHaveAttribute(
      'href',
      'sms:+33612345678',
    )
    expect(screen.queryByText(/positionner/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /mission/i })).not.toBeInTheDocument()
  })
})
