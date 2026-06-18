import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CompatibilityScoreCell } from '@/components/molecules/CompatibilityScoreCell'

describe('CompatibilityScoreCell', () => {
  it('shows the current score and commits a new value on release', () => {
    const onChange = vi.fn()
    render(
      <CompatibilityScoreCell
        missionName="Pharmacien"
        candidateName="Préparateur"
        score={40}
        onChange={onChange}
      />,
    )

    expect(screen.getByText('40 %')).toBeInTheDocument()

    const slider = screen.getByRole('slider', {
      name: 'Compatibilité Pharmacien → Préparateur',
    })
    fireEvent.change(slider, { target: { value: '75' } })
    fireEvent.mouseUp(slider)

    expect(onChange).toHaveBeenCalledWith(75)
  })
})
