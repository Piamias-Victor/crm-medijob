import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShortcutBar } from '@/components/molecules/ShortcutBar'

describe('ShortcutBar', () => {
  it('renders the predefined shortcuts including week report and best profiles', () => {
    render(<ShortcutBar onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(7)
    expect(screen.getByRole('button', { name: 'Résumer candidat' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rapport semaine' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Meilleurs profils' })).toBeInTheDocument()
  })

  it('calls onSelect with the clicked shortcut', () => {
    const onSelect = vi.fn()
    render(<ShortcutBar onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Rédiger mail pharmacie' }))

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'pharmacy-email' }))
  })
})
