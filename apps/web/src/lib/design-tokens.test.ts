import { describe, it, expect } from 'vitest'
import { colorTokens } from '@/lib/design-tokens'

describe('colorTokens', () => {
  it('exposes Medijob brand swatches teal mint sky rose', () => {
    const byName = Object.fromEntries(colorTokens.map((t) => [t.name, t]))

    expect(byName.primary?.description).toMatch(/teal/i)
    expect(byName.accent?.description).toMatch(/mint/i)
    expect(byName.sky?.className).toBe('bg-sky')
    expect(byName.rose?.className).toBe('bg-rose')
  })
})
