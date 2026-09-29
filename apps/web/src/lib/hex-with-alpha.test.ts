// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { hexWithAlpha } from './hex-with-alpha'

describe('hexWithAlpha', () => {
  it('converts hex to rgba with alpha', () => {
    expect(hexWithAlpha('#FEF3C7', 0.25)).toBe('rgba(254, 243, 199, 0.25)')
    expect(hexWithAlpha('#abc', 1)).toBe('rgba(170, 187, 204, 1)')
  })

  it('falls back on invalid hex', () => {
    expect(hexWithAlpha('nope', 0.2)).toBe('transparent')
  })
})
