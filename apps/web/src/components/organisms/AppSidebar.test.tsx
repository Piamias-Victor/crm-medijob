import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/navigation', () => ({ usePathname: () => '/candidats' }))
vi.mock('next-auth/react', () => ({ signOut: vi.fn() }))

import { AppSidebar } from '@/components/organisms/AppSidebar'
import { useSidebarStore } from '@/stores/sidebar-store'

beforeEach(() => {
  useSidebarStore.setState({ open: false })
})

describe('AppSidebar hover expand', () => {
  it('keeps nav links reachable while collapsed', () => {
    render(<AppSidebar role="RECRUTEUR" />)

    expect(screen.getByRole('link', { name: 'Candidats' })).toBeInTheDocument()
  })

  it('hides labels from assistive tech while collapsed', () => {
    render(<AppSidebar role="RECRUTEUR" />)

    expect(screen.getByText('Candidats')).toHaveAttribute('aria-hidden', 'true')
  })

  it('reveals labels on hover', () => {
    render(<AppSidebar role="RECRUTEUR" />)

    fireEvent.mouseEnter(screen.getByRole('complementary'))

    expect(screen.getByText('Candidats')).toHaveAttribute('aria-hidden', 'false')
  })

  it('hides labels again when the mouse leaves', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    const sidebar = screen.getByRole('complementary')

    fireEvent.mouseEnter(sidebar)
    fireEvent.mouseLeave(sidebar)

    expect(screen.getByText('Candidats')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('AppSidebar admin gating', () => {
  it('shows the Admin entry for admins', () => {
    render(<AppSidebar role="ADMIN" />)

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
