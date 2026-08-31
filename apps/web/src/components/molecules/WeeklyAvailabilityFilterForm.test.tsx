import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeeklyAvailabilityFilterForm } from './WeeklyAvailabilityFilterForm'

const values = {
  date: '2026-09-02',
  period: 'AM' as const,
  jobTitleId: 'jt-prep',
  city: 'Lyon',
  radiusKm: 30,
}

describe('WeeklyAvailabilityFilterForm', () => {
  it('filters by slot, JobTitle and city with default radius 30 km', () => {
    render(
      <WeeklyAvailabilityFilterForm
        jobTitles={[{ id: 'jt-prep', name: 'Préparateur' }]}
        values={values}
      />,
    )
    expect(screen.getByLabelText('Rayon (km)')).toHaveValue(30)
    expect(screen.getByLabelText('Date')).toHaveValue('2026-09-02')
    expect(screen.getByLabelText('Créneau')).toHaveValue('AM')
    expect(screen.getByLabelText('Métier')).toHaveValue('jt-prep')
    expect(screen.getByLabelText('Ville')).toHaveValue('Lyon')
    expect(screen.queryByLabelText(/logiciel/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/salaire/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/contrat/i)).not.toBeInTheDocument()
  })
})
