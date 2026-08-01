import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidebarBrand } from '@/components/molecules/SidebarBrand'
import { BRAND_LOGO_SRC, BRAND_MARK_SRC } from '@/lib/brand-assets'

describe('SidebarBrand', () => {
  it('shows the wordmark when expanded', () => {
    render(<SidebarBrand />)

    expect(screen.getByRole('img', { name: 'Medijob' })).toHaveAttribute(
      'src',
      BRAND_LOGO_SRC,
    )
  })

  it('shows the heart mark when collapsed', () => {
    render(<SidebarBrand expanded={false} />)

    expect(screen.getByRole('img', { name: 'Medijob' })).toHaveAttribute(
      'src',
      BRAND_MARK_SRC,
    )
  })
})
