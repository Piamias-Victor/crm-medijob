import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterimLayoutShell } from '@/components/organisms/InterimLayoutShell'

vi.mock('next/navigation', () => ({ usePathname: () => '/interim/missions' }))

describe('InterimLayoutShell', () => {
  it('shows operational Intérim without a refresh control', () => {
    render(<InterimLayoutShell>liste</InterimLayoutShell>)
    expect(screen.getByRole('heading', { name: 'Intérim' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Missions Badakan' })).toHaveAttribute(
      'href',
      '/interim/missions',
    )
    expect(screen.getByRole('link', { name: 'Contrats Badakan' })).toHaveAttribute(
      'href',
      '/interim/contrats',
    )
    expect(screen.getByRole('link', { name: 'Vérif officines' })).toHaveAttribute(
      'href',
      '/interim/officines',
    )
    expect(screen.getByRole('link', { name: 'Disponibilités' })).toHaveAttribute(
      'href',
      '/interim/disponibilites',
    )
    expect(screen.queryByRole('button', { name: /rafraîchir/i })).not.toBeInTheDocument()
    expect(screen.queryByText('/facturation/interim')).not.toBeInTheDocument()
  })
})
