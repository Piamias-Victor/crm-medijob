import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateDetailLink } from '@/components/molecules/CandidateDetailLink'

describe('CandidateDetailLink', () => {
  it('opens the candidate profile in a new tab', () => {
    render(<CandidateDetailLink candidateId="c1">Camille Durand</CandidateDetailLink>)

    const link = screen.getByRole('link', { name: 'Camille Durand' })
    expect(link).toHaveAttribute('href', '/candidats/c1')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
