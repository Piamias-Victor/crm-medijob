import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DesignSystemPage from './page'
import { dsSections } from '@/lib/design-system'

const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/design-system',
  useSearchParams: () => mockSearchParams,
}))

describe('Design system page', () => {
  it('announces itself with a top-level heading', () => {
    render(<DesignSystemPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /design system/i }),
    ).toBeInTheDocument()
  })

  it('documents the 13 charte sections as labelled regions', () => {
    render(<DesignSystemPage />)

    expect(screen.getAllByRole('region')).toHaveLength(dsSections.length)
    expect(dsSections).toHaveLength(13)
  })

  it('anchors every section so the in-page nav can scroll to it', () => {
    const { container } = render(<DesignSystemPage />)

    for (const section of dsSections) {
      expect(container.querySelector(`#${section.id}`)).not.toBeNull()
    }
  })

  it('offers an anchor link to each section', () => {
    render(<DesignSystemPage />)

    for (const section of dsSections) {
      expect(
        screen.getByRole('link', { name: section.label }),
      ).toHaveAttribute('href', `#${section.id}`)
    }
  })
})
