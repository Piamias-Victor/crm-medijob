import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({ usePathname: () => '/candidats' }))
vi.mock('next-auth/react', () => ({ signOut: vi.fn() }))

import { AppSidebar } from '@/components/organisms/AppSidebar'
import { useSidebarStore } from '@/stores/sidebar-store'

beforeEach(() => {
  useSidebarStore.setState({ open: false })
})

describe('AppSidebar admin gating', () => {
  it('shows the Admin entry for admins', () => {
    render(<AppSidebar role="RH_ADMIN" />)
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument()
  })

  it('hides the Admin entry from recruiters', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
  })

  it('hides the Admin entry when the role is unknown', () => {
    render(<AppSidebar role={null} />)
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
  })
})

describe('AppSidebar facturation gating', () => {
  it('shows Facturation for Direction', () => {
    render(<AppSidebar role="DIRECTION" />)
    expect(screen.getByRole('link', { name: 'Facturation' })).toBeInTheDocument()
  })

  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)('hides Facturation from %s', (role) => {
    render(<AppSidebar role={role} />)
    expect(screen.queryByRole('link', { name: 'Facturation' })).not.toBeInTheDocument()
  })
})

describe('AppSidebar Intérim', () => {
  it('shows operational Intérim to a recruteur', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    expect(screen.getByRole('link', { name: 'Intérim' })).toHaveAttribute('href', '/interim')
  })
})
