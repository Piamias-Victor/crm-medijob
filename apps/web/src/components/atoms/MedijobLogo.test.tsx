import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MedijobLogo } from '@/components/atoms/MedijobLogo'

describe('MedijobLogo', () => {
  it('shows the Medijob brand mark with accessible name', () => {
    render(<MedijobLogo />)

    const img = screen.getByRole('img', { name: 'Medijob' })
    expect(img).toHaveAttribute('src', '/brand/medijob-logo.png')
  })
})
