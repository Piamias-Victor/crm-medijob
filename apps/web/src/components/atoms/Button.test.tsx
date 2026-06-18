import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/atoms/Button'

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Enregistrer</Button>)

    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument()
  })

  it('calls onClick when pressed', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Valider</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Valider' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Bloqué
      </Button>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Bloqué' }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
