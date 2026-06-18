import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Combobox } from '@/components/molecules/Combobox'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

describe('Combobox', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(<Combobox value="" onChange={() => {}} options={options} placeholder="Choisir" />)
    expect(screen.getByRole('button', { name: /choisir/i })).toBeInTheDocument()
  })

  it('shows the selected option label', () => {
    render(<Combobox value="b" onChange={() => {}} options={options} placeholder="Choisir" />)
    expect(screen.getByRole('button', { name: /beta/i })).toBeInTheDocument()
  })

  it('selects an option on click', () => {
    const onChange = vi.fn()
    render(<Combobox value="" onChange={onChange} options={options} placeholder="Choisir" />)
    fireEvent.click(screen.getByRole('button', { name: /choisir/i }))
    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('filters options by the search query', () => {
    render(<Combobox value="" onChange={() => {}} options={options} placeholder="Choisir" />)
    fireEvent.click(screen.getByRole('button', { name: /choisir/i }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'bet' } })
    expect(screen.queryByRole('option', { name: 'Alpha' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument()
  })

  it('creates a new option inline and selects it', async () => {
    const onChange = vi.fn()
    const onCreate = vi.fn().mockResolvedValue({ value: 'c', label: 'Gamma' })
    render(
      <Combobox value="" onChange={onChange} options={options} placeholder="Choisir" onCreate={onCreate} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /choisir/i }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Gamma' } })
    fireEvent.click(screen.getByRole('button', { name: /créer.*gamma/i }))
    await waitFor(() => expect(onCreate).toHaveBeenCalledWith('Gamma'))
    expect(onChange).toHaveBeenCalledWith('c')
  })
})
