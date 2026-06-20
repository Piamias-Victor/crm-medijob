import { describe, it, expect, vi } from 'vitest'
import { CLEAR_DATE_LABEL, SELECT_DATE_LABEL } from '@/lib/date-picker-utils'
import { render, screen, fireEvent } from '@testing-library/react'
import { DatePicker } from '@/components/molecules/DatePicker'

describe('DatePicker', () => {
  it('renders calendar panel in document body via fixed portal', () => {
    render(<DatePicker value="2026-06-19" onChange={() => {}} />)
    fireEvent.click(screen.getByRole('button'))
    const panel = document.body.querySelector('[data-floating-panel]')
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveStyle({ position: 'fixed' })
  })

  it('shows custom empty label instead of availability asap text', () => {
    render(
      <DatePicker value="" onChange={() => {}} emptyLabel={SELECT_DATE_LABEL} />,
    )
    expect(screen.getByRole('button', { name: /sélectionner une date/i })).toBeInTheDocument()
  })

  it('calls onChange with undefined when cleared', () => {
    const onChange = vi.fn()
    render(<DatePicker value="2026-06-19" onChange={onChange} clearLabel={CLEAR_DATE_LABEL} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button', { name: /effacer la date/i }))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})
