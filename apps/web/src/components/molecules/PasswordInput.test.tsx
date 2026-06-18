import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from '@/components/molecules/PasswordInput'

describe('PasswordInput', () => {
  it('masks the value by default', () => {
    render(<PasswordInput aria-label="Mot de passe" />)

    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'password')
  })

  it('reveals the value when the toggle is pressed', () => {
    render(<PasswordInput aria-label="Mot de passe" />)

    fireEvent.click(screen.getByRole('button', { name: 'Afficher le mot de passe' }))

    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'text')
  })

  it('masks the value again on a second press', () => {
    render(<PasswordInput aria-label="Mot de passe" />)
    const toggle = () => screen.getByRole('button', { name: /mot de passe/i })

    fireEvent.click(toggle())
    fireEvent.click(toggle())

    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'password')
  })
})
