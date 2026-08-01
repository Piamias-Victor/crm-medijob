import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidebarBrand } from '@/components/molecules/SidebarBrand'

describe('SidebarBrand', () => {
  it('shows the Medijob logo in the shell', () => {
    render(<SidebarBrand />)

    expect(screen.getByRole('img', { name: 'Medijob' })).toBeInTheDocument()
  })

  it('uses the heart mark when collapsed', () => {
    render(<SidebarBrand expanded={false} />)

    expect(screen.getByRole('img', { name: 'Medijob' })).toHaveAttribute(
      'src',
      '/brand/medijob-mark.png',
    )
  })
})
