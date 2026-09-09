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

  it('hides labels while collapsed', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    expect(screen.queryByText('Candidats')).not.toBeInTheDocument()
  })

  it('reveals labels on hover', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    fireEvent.mouseEnter(screen.getByRole('complementary'))
    expect(screen.getByText('Candidats')).toBeInTheDocument()
  })

  it('hides labels again when the mouse leaves', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    const sidebar = screen.getByRole('complementary')
    fireEvent.mouseEnter(sidebar)
    fireEvent.mouseLeave(sidebar)
    expect(screen.queryByText('Candidats')).not.toBeInTheDocument()
  })

  it('pins expanded from the toggle without hover', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    fireEvent.click(screen.getByRole('button', { name: 'Déplier le menu' }))
    expect(screen.getByText('Candidats')).toBeInTheDocument()
  })

  it('pins collapsed from the toggle', () => {
    render(<AppSidebar role="RECRUTEUR" />)
    fireEvent.click(screen.getByRole('button', { name: 'Déplier le menu' }))
    fireEvent.click(screen.getByRole('button', { name: 'Replier le menu' }))
    expect(screen.queryByText('Candidats')).not.toBeInTheDocument()
  })
})
