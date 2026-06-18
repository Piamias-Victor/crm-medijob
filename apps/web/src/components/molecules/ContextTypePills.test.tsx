import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContextTypePills } from '@/components/molecules/ContextTypePills'

describe('ContextTypePills', () => {
  it('renders the three entity types plus a clear option', () => {
    render(<ContextTypePills onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Candidat' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pharmacie' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mission' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Aucun' })).toBeInTheDocument()
  })

  it('emits the chosen type and marks it pressed', () => {
    const onChange = vi.fn()
    render(<ContextTypePills value="pharmacy" onChange={onChange} />)

    expect(screen.getByRole('button', { name: 'Pharmacie' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mission' }))
    expect(onChange).toHaveBeenCalledWith('mission')
  })

  it('clears the selection via "Aucun"', () => {
    const onChange = vi.fn()
    render(<ContextTypePills value="candidate" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Aucun' }))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})
