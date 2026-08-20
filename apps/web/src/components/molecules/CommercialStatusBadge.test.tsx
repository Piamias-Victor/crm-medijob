import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommercialStatusBadge } from '@/components/molecules/CommercialStatusBadge'

describe('CommercialStatusBadge', () => {
  it('shows Accepté for an accepted quote', () => {
    render(<CommercialStatusBadge status="ACCEPTE" />)
    expect(screen.getByText('Accepté')).toBeInTheDocument()
  })
})
