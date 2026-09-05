import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterimLayoutShell } from '@/components/organisms/InterimLayoutShell'

vi.mock('next/navigation', () => ({ usePathname: () => '/interim/besoins' }))

describe('InterimLayoutShell', () => {
  it('shows Accueil Besoins Suivi Candidats Dispos without refresh', () => {
    render(
      <InterimLayoutShell counts={{ besoins: 2, dispos: 1, suivi: 3 }}>
        liste
      </InterimLayoutShell>,
    )
    expect(screen.getByRole('heading', { name: 'Intérim' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Accueil/ })).toHaveAttribute('href', '/interim')
    expect(screen.getByRole('link', { name: /Besoins/ })).toHaveAttribute(
      'href',
      '/interim/besoins',
    )
    expect(screen.getByRole('link', { name: /Suivi/ })).toHaveAttribute('href', '/interim/suivi')
    expect(screen.getByRole('link', { name: /Dispos/ })).toHaveAttribute(
      'href',
      '/interim/disponibilites',
    )
    expect(screen.queryByRole('button', { name: /rafraîchir/i })).not.toBeInTheDocument()
  })
})
