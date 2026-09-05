import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeeklyAvailabilityFilterPage } from './WeeklyAvailabilityFilterPage'

describe('WeeklyAvailabilityFilterPage', () => {
  it('shows filter form and contact list without MissionCandidate action', () => {
    render(
      <WeeklyAvailabilityFilterPage
        jobTitles={[{ id: 'jt-prep', name: 'Préparateur' }]}
        values={{
          date: '2026-09-02',
          period: 'AM',
          jobTitleId: 'jt-prep',
          city: 'Lyon',
          radiusKm: 30,
        }}
        rows={[
          {
            id: 'marie',
            fullName: 'Marie Dupont',
            jobTitleName: 'Préparateur',
            city: 'Lyon',
            phone: '06 12 34 56 78',
            telHref: 'tel:06 12 34 56 78',
            smsHref: 'sms:+33612345678',
          },
        ]}
        queried
      />,
    )
    expect(screen.getByRole('button', { name: 'Filtrer' })).toBeInTheDocument()
    expect(screen.getByText('Marie Dupont')).toBeInTheDocument()
    expect(screen.queryByText(/positionner/i)).not.toBeInTheDocument()
  })
})
