import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const push = vi.fn()
const refresh = vi.fn()
const signIn = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}))

vi.mock('next-auth/react', () => ({ signIn: (...args: unknown[]) => signIn(...args) }))

import { LoginForm } from '@/components/molecules/LoginForm'

beforeEach(() => {
  push.mockReset()
  refresh.mockReset()
  signIn.mockReset()
  signIn.mockResolvedValue({ error: null })
})

describe('LoginForm', () => {
  it('shows redirect loading after successful login', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@medijob.fr' },
    })
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'admin-medijob-2026' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    await waitFor(() => {
      expect(screen.getByText('Redirection…')).toBeInTheDocument()
      expect(screen.getByRole('status', { name: 'Chargement' })).toBeInTheDocument()
    })
    expect(push).toHaveBeenCalledWith('/candidats')
  })
})
