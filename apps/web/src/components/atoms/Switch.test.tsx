import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/atoms/Switch'

describe('Switch', () => {
  it('toggles value on click', () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Temps plein" />)

    fireEvent.click(screen.getByRole('switch', { name: 'Temps plein' }))

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
