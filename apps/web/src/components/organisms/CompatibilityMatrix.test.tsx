import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompatibilityMatrix } from '@/components/organisms/CompatibilityMatrix'
import { compatibilityKey } from '@/view-models/compatibility-matrix'

const titles = [
  { id: 'a', name: 'Pharmacien' },
  { id: 'b', name: 'Préparateur' },
]
const scores = new Map([[compatibilityKey('a', 'a'), 100]])

describe('CompatibilityMatrix', () => {
  it('renders the explanatory legend', () => {
    render(<CompatibilityMatrix titles={titles} scores={scores} onChange={vi.fn()} />)
    expect(screen.getByText(/exclut le couple du matching/i)).toBeInTheDocument()
  })

  it('shows score cells for each mission/candidate pair', () => {
    render(<CompatibilityMatrix titles={titles} scores={scores} onChange={vi.fn()} />)
    expect(
      screen.getByRole('slider', { name: 'Compatibilité Pharmacien → Pharmacien' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('slider')).toHaveLength(4)
  })
})
