import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PaletteShowcase } from './PaletteShowcase'
import { colorTokens } from '@/lib/design-tokens'

describe('PaletteShowcase', () => {
  it('paints one swatch per token using a token background utility', () => {
    const { container } = render(<PaletteShowcase />)

    const swatches = container.querySelectorAll('[class*="bg-"]')

    expect(swatches).toHaveLength(colorTokens.length)
  })
})
