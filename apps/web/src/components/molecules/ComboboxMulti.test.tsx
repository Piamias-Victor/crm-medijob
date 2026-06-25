import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ComboboxMulti } from '@/components/molecules/ComboboxMulti'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

describe('ComboboxMulti', () => {
  it('filtre les options via la barre de recherche', () => {
    render(<ComboboxMulti values={[]} onChange={() => {}} options={options} />)
    fireEvent.click(screen.getByRole('button', { name: /tous/i }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'bet' } })
    expect(screen.queryByRole('button', { name: 'Alpha' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument()
  })

  it('sélectionne plusieurs valeurs', () => {
    const onChange = vi.fn()
    render(<ComboboxMulti values={[]} onChange={onChange} options={options} />)
    fireEvent.click(screen.getByRole('button', { name: /tous/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }))
    expect(onChange).toHaveBeenCalledWith(['a'])
  })
})
