import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FilterDateRangeField } from '@/components/organisms/filter-bar/filter-date-range-field'

describe('FilterDateRangeField', () => {
  it('uses DatePicker buttons instead of native date inputs', () => {
    render(
      <FilterDateRangeField
        config={{ id: 'acceptation', label: 'Date d’acceptation', type: 'date-range' }}
        value={{ from: '2026-08-01', to: '2026-08-31' }}
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'Date d’acceptation — début' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Date d’acceptation — fin' })).toBeInTheDocument()
    expect(document.querySelector('input[type="date"]')).toBeNull()
  })
})
