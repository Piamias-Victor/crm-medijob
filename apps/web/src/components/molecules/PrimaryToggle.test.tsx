import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PrimaryToggle } from '@/components/molecules/PrimaryToggle'

describe('PrimaryToggle', () => {
  it('shows the titulaire label and helper text', () => {
    render(<PrimaryToggle checked={false} onChange={vi.fn()} />)
    expect(screen.getByText('Titulaire principal')).toBeInTheDocument()
    expect(screen.getByText(/un seul titulaire par pharmacie/i)).toBeInTheDocument()
  })

  it('calls onChange when the card is clicked', () => {
    const onChange = vi.fn()
    render(<PrimaryToggle checked={false} onChange={onChange} />)
    fireEvent.click(screen.getByText('Titulaire principal'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
