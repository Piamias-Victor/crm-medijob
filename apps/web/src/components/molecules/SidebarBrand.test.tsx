import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidebarBrand } from '@/components/molecules/SidebarBrand'

describe('SidebarBrand', () => {
  it('shows the Medijob logo in the shell', () => {
    render(<SidebarBrand />)

    expect(screen.getByRole('img', { name: 'Medijob' })).toBeInTheDocument()
  })

  it('keeps an accessible logo when collapsed', () => {
    render(<SidebarBrand expanded={false} />)

    expect(screen.getByRole('img', { name: 'Medijob' })).toBeInTheDocument()
  })
})
