import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InterimPage } from '@/components/organisms/InterimPage'

describe('InterimPage', () => {
  it('shows operational Intérim without a refresh control', () => {
    render(<InterimPage />)
    expect(screen.getByRole('heading', { name: 'Intérim' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /rafraîchir/i })).not.toBeInTheDocument()
    expect(screen.queryByText('/facturation/interim')).not.toBeInTheDocument()
  })
})
