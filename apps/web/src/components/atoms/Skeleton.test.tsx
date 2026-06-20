import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from '@/components/atoms/Skeleton'

describe('Skeleton', () => {
  it('renders a pulse placeholder', () => {
    const { container } = render(<Skeleton data-testid="sk" />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })
})
