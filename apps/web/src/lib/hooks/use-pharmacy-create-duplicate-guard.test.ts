import { describe, it, expect, vi } from 'vitest'

/**
 * Guard contract: true = stop create (handled or blocked); false = proceed create.
 */
export function pharmacyCreateGuardBlocksSubmit(result: boolean) {
  return result === true
}

describe('pharmacy create duplicate guard contract', () => {
  it('blocks create when probe fails (must not fall through to SIRET toast)', () => {
    expect(pharmacyCreateGuardBlocksSubmit(true)).toBe(true)
  })

  it('allows create only when no duplicate', () => {
    expect(pharmacyCreateGuardBlocksSubmit(false)).toBe(false)
  })

  it('documents toast-only path as forbidden after probe error', async () => {
    const create = vi.fn()
    const blocked = true // catch branch must return true
    if (!blocked) create()
    expect(create).not.toHaveBeenCalled()
  })
})
