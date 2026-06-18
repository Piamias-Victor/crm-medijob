import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/navigation', () => ({ usePathname: () => '/candidats' }))

import { AppSidebar } from '@/components/organisms/AppSidebar'
import { useSidebarStore } from '@/stores/sidebar-store'

beforeEach(() => {
  useSidebarStore.setState({ open: false })
})

describe('AppSidebar hover expand', () => {
  it('keeps nav links reachable while collapsed', () => {
    render(<AppSidebar />)

    expect(screen.getByRole('link', { name: 'Candidats' })).toBeInTheDocument()
  })

  it('hides labels from assistive tech while collapsed', () => {
    render(<AppSidebar />)

    expect(screen.getByText('Candidats')).toHaveAttribute('aria-hidden', 'true')
  })

  it('reveals labels on hover', () => {
    render(<AppSidebar />)

    fireEvent.mouseEnter(screen.getByRole('complementary'))

    expect(screen.getByText('Candidats')).toHaveAttribute('aria-hidden', 'false')
  })

  it('hides labels again when the mouse leaves', () => {
    render(<AppSidebar />)
    const sidebar = screen.getByRole('complementary')

    fireEvent.mouseEnter(sidebar)
    fireEvent.mouseLeave(sidebar)

    expect(screen.getByText('Candidats')).toHaveAttribute('aria-hidden', 'true')
  })
})
